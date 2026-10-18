require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const { Resend } = require('resend');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- CONFIGURATIONS ---
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const resend = new Resend(process.env.RESEND_API_KEY);

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 11210,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 5,           // Limité à 5 pour ne pas saturer l'offre gratuite Aiven
  maxIdle: 5,
  idleTimeout: 60000,           // Ferme proprement les connexions inactives après 60s
  queueLimit: 0,
  enableKeepAlive: true,        // <-- TRÈS IMPORTANT : Garde la connexion active avec Aiven
  keepAliveInitialDelay: 10000, // Envoie un signal toutes les 10s pour éviter la coupure
  connectTimeout: 10000         // Évite de ramer pendant 40s si le réseau accroche
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Erreur de connexion à MySQL :', err.message);
    return;
  }
  console.log('✅ Connexion à la base de données MySQL réussie ! 🗄️');
  connection.release();
});

const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// --- RÈGLES DE VALIDATION ---
const validateUsername = (username) => {
  if (!username || username.length < 3 || username.length > 25) {
    return "L'identifiant doit contenir entre 3 et 25 caractères.";
  }
  if (/\s{2,}/.test(username) || username.startsWith(' ') || username.endsWith(' ')) {
    return "L'identifiant ne peut pas contenir deux espaces de suite ni commencer/finir par un espace.";
  }
  const usernameRegex = /^[a-zA-Z0-9À-ÿ_.\- ]+$/;
  if (!usernameRegex.test(username)) {
    return "L'identifiant ne peut contenir que des lettres, chiffres, espaces, tirets (-), underscores (_) et points (.).";
  }
  return null;
};

const validatePassword = (password) => {
  if (!password || password.length < 6 || password.length > 30) {
    return "Le mot de passe doit contenir entre 6 et 30 caractères.";
  }
  if (!/[A-Z]/.test(password) || !/\d/.test(password)) {
    return "Le mot de passe doit contenir au moins une majuscule et un chiffre.";
  }
  return null;
};

// ==========================================
// ROUTES UTILISATEURS ET AUTHENTIFICATION
// ==========================================

// 1. INSCRIPTION CLASSIQUE
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Vérification des règles strictes
  const usernameError = validateUsername(username);
  if (usernameError) return res.status(400).json({ error: usernameError });

  const passwordError = validatePassword(password);
  if (passwordError) return res.status(400).json({ error: passwordError });
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode();

    const query = 'INSERT INTO users (username, email, password, verification_code, is_verified) VALUES (?, ?, ?, ?, false)';
    db.query(query, [username, email, hashedPassword, verificationCode], async (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Ce nom d\'utilisateur ou cet email est déjà utilisé.' });
        return res.status(500).json({ error: 'Erreur lors de la création du compte.' });
      }

      try {
        const { data, error } = await resend.emails.send({
          from: 'GeoLearn <geolearn-webapp@gmail.com>',
          to: email, // Doit être ton email validé sur Resend
          subject: 'Ton code de vérification GeoLearn 🌍',
          html: `<div style="text-align: center; font-family: Arial, sans-serif;"><h2>Bienvenue ${username} !</h2><p>Ton code de vérification :</p><h1 style="letter-spacing: 5px; color: #2563eb;">${verificationCode}</h1></div>`
        });

        if (error) {
          console.error("❌ [REGISTER] Erreur API Resend :", error);
        } else {
          console.log(`✅ [REGISTER] Code envoyé via Resend à ${email}`);
        }
        res.status(201).json({ message: 'Compte créé avec succès !', email: email });
      } catch (mailError) {
        console.error("❌ [REGISTER] Crash Resend :", mailError);
        res.status(500).json({ error: "Le compte est créé, mais l'envoi de l'e-mail a échoué." });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur interne.' });
  }
});

// 2. VÉRIFIER LE CODE
app.post('/api/verify-code', (req, res) => {
  const { email, code } = req.body;
  db.query('SELECT * FROM users WHERE email = ? AND verification_code = ?', [email, code], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur de base de données.' });
    if (results.length === 0) return res.status(400).json({ error: 'Code incorrect ou expiré.' });

    db.query('UPDATE users SET is_verified = true, verification_code = NULL WHERE email = ?', [email], (err) => {
      if (err) return res.status(500).json({ error: 'Erreur de validation.' });
      res.json({ message: 'Compte vérifié avec succès !' });
    });
  });
});

// 3. RENVOYER LE CODE
app.post('/api/resend-code', (req, res) => {
  const { email } = req.body;
  const newCode = generateVerificationCode();
  db.query('UPDATE users SET verification_code = ? WHERE email = ? AND is_verified = false', [newCode, email], async (err, results) => {
    if (err || results.affectedRows === 0) return res.status(400).json({ error: 'Impossible de renvoyer le code.' });
    
    try {
      const { data, error } = await resend.emails.send({
        from: 'GeoLearn <geolearn-webapp@gmail.com>',
        to: email,
        subject: 'Nouveau code GeoLearn 🌍',
        html: `<div style="text-align: center; font-family: Arial, sans-serif;"><p>Ton nouveau code :</p><h1 style="letter-spacing: 5px; color: #2563eb;">${newCode}</h1></div>`
      });

      if (error) console.error("❌ [RESEND] Erreur API Resend :", error);
      else console.log(`✅ [RESEND] Nouveau code envoyé à ${email}`);
      
      res.json({ message: 'Nouveau code envoyé.' });
    } catch (mailError) {
      console.error("❌ [RESEND] Crash Resend :", mailError);
      res.status(500).json({ error: "L'envoi de l'e-mail a échoué." });
    }
  });
});

// 4. CONNEXION CLASSIQUE
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur de base de données.' });
    if (results.length === 0) return res.status(401).json({ error: 'Identifiants incorrects.' });

    const user = results[0];
    if (!user.is_verified) return res.status(403).json({ error: 'Tu dois vérifier ton adresse e-mail.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Identifiants incorrects.' });

    res.json({ message: 'Connexion réussie !', user: { id: user.id, username: user.username, email: user.email, createdAt: user.created_at } });
  });
});

// 5. CONNEXION GOOGLE
app.post('/api/google-login', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: 'Jeton manquant.' });

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const { email, name } = ticket.getPayload();

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Erreur de base de données.' });

      if (results.length > 0) {
        const user = results[0];
        if (!user.is_verified) {
          db.query('UPDATE users SET is_verified = true WHERE id = ?', [user.id]);
        }
        return res.json({ message: 'Connexion Google réussie !', user: { id: user.id, username: user.username, email: user.email, createdAt: user.created_at } });
      } else {
        const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-12), 10);
        db.query('INSERT INTO users (username, email, password, is_verified) VALUES (?, ?, ?, true)', [name, email, randomPassword], async (insertErr, insertResult) => {
          if (insertErr) return res.status(500).json({ error: 'Erreur de création de compte.' });
          
          try {
            const { data, error } = await resend.emails.send({
              from: 'GeoLearn <geolearn-webapp@gmail.com>',
              to: email,
              subject: 'Bienvenue sur GeoLearn ! 🌍',
              html: `<div style="text-align: center; font-family: Arial, sans-serif;"><h2 style="color: #2563eb;">Bonjour ${name} !</h2><p>Ton compte a été créé avec succès via Google.</p></div>`
            });
            if (error) console.error("❌ [GOOGLE] Erreur API Resend :", error);
            else console.log(`✅ [GOOGLE] Email de bienvenue envoyé à ${email}`);
          } catch (mailError) {
            console.error("❌ [GOOGLE] Crash Resend :", mailError);
          }

          return res.status(201).json({ message: 'Compte Google créé !', user: { id: insertResult.insertId, username: name, email: email, createdAt: new Date() } });
        });
      }
    });
  } catch (error) {
    console.error("Erreur globale Google :", error);
    return res.status(401).json({ error: 'Jeton Google invalide ou expiré.' });
  }
});

// 6. METTRE À JOUR LE PROFIL
app.put('/api/users/:id', (req, res) => {
  const { name, email } = req.body;

  const usernameError = validateUsername(name);
  if (usernameError) return res.status(400).json({ error: usernameError });

  db.query('UPDATE users SET username = ?, email = ? WHERE id = ?', [name, email, req.params.id], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email ou pseudo déjà pris.' });
      return res.status(500).json({ error: 'Erreur de mise à jour.' });
    }
    res.json({ message: 'Profil mis à jour !', username: name, email: email });
  });
});

// ==========================================
// ROUTES SCORES
// ==========================================
app.post('/api/scores', (req, res) => {
  const { user_id, mode, score, max_score } = req.body;
  if (!user_id) return res.status(401).json({ error: 'Non connecté.' });
  db.query('INSERT INTO scores (user_id, mode, score, max_score) VALUES (?, ?, ?, ?)', [user_id, mode, score, max_score], (err) => {
    if (err) return res.status(500).json({ error: 'Erreur de sauvegarde.' });
    res.status(201).json({ message: 'Score enregistré.' });
  });
});

app.get('/api/scores/:user_id', (req, res) => {
  db.query('SELECT * FROM scores WHERE user_id = ? ORDER BY played_at DESC', [req.params.user_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur de lecture.' });
    res.json(results);
  });
});

// =========================================================
// GESTION DES RETOURS COMMUNAUTAIRES & ADMIN (FEEDBACKS)
// =========================================================
const ADMIN_EMAILS = [
  'lohan.dtr@gmail.com',
  'lohan.dtr.muscu@gmail.com',
  'lohan.demeulemester@efrei.net'
];

// Création automatique de la table feedbacks si elle n'existe pas
pool.query(`
  CREATE TABLE IF NOT EXISTS feedbacks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    type VARCHAR(30) DEFAULT 'suggestion',
    subject VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'nouveau',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).catch(err => console.error('Erreur initialisation table feedbacks:', err));

// 1. Envoyer un retour (Accessible à tous les utilisateurs)
app.post('/api/feedbacks', async (req, res) => {
  try {
    const { userId, username, email, type, subject, message } = req.body;
    if (!username || !email || !subject || !message) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
    }

    await pool.query(
      'INSERT INTO feedbacks (user_id, username, email, type, subject, message) VALUES (?, ?, ?, ?, ?, ?)',
      [userId || null, username, email, type || 'suggestion', subject, message]
    );

    res.status(201).json({ message: 'Retour enregistré avec succès !' });
  } catch (error) {
    console.error('Erreur POST /api/feedbacks:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'enregistrement.' });
  }
});

// 2. Récupérer tous les retours (Réservé à l'Admin)
app.get('/api/admin/feedbacks', async (req, res) => {
  try {
    const adminEmail = (req.query.email || '').toLowerCase();
    if (!ADMIN_EMAILS.includes(adminEmail)) {
      return res.status(403).json({ error: 'Accès réservé à l\'administrateur.' });
    }

    const [rows] = await pool.query('SELECT * FROM feedbacks ORDER BY created_at DESC');
    res.json({ feedbacks: rows });
  } catch (error) {
    console.error('Erreur GET /api/admin/feedbacks:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des retours.' });
  }
});

// 3. Mettre à jour le statut d'un retour (Réservé à l'Admin)
app.put('/api/admin/feedbacks/:id', async (req, res) => {
  try {
    const adminEmail = (req.body.email || '').toLowerCase();
    const { status } = req.body;
    if (!ADMIN_EMAILS.includes(adminEmail)) {
      return res.status(403).json({ error: 'Accès refusé.' });
    }

    await pool.query('UPDATE feedbacks SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Statut mis à jour.' });
  } catch (error) {
    console.error('Erreur PUT /api/admin/feedbacks:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
  }
});

// 4. Supprimer un retour (Réservé à l'Admin)
app.delete('/api/admin/feedbacks/:id', async (req, res) => {
  try {
    const adminEmail = (req.query.email || '').toLowerCase();
    if (!ADMIN_EMAILS.includes(adminEmail)) {
      return res.status(403).json({ error: 'Accès refusé.' });
    }

    await pool.query('DELETE FROM feedbacks WHERE id = ?', [req.params.id]);
    res.json({ message: 'Retour supprimé.' });
  } catch (error) {
    console.error('Erreur DELETE /api/admin/feedbacks:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur Backend démarré sur le port ${PORT}`);
});