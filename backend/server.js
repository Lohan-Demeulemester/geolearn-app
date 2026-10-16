require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- CONFIGURATIONS ---
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL :', err.message);
    return;
  }
  console.log('Connexion à la base de données MySQL réussie ! 🗄️');
});

// --- OUTILS ---
const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// ==========================================
// ROUTES UTILISATEURS ET AUTHENTIFICATION
// ==========================================

// 1. INSCRIPTION CLASSIQUE
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode();

    const query = 'INSERT INTO users (username, email, password, verification_code, is_verified) VALUES (?, ?, ?, ?, false)';
    db.query(query, [username, email, hashedPassword, verificationCode], (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Ce nom d\'utilisateur ou cet email est déjà utilisé.' });
        return res.status(500).json({ error: 'Erreur lors de la création du compte.' });
      }

      const mailOptions = {
        from: `"L'équipe GeoLearn" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Ton code de vérification GeoLearn 🌍',
        html: `<div style="text-align: center; font-family: Arial, sans-serif;"><h2>Bienvenue ${username} !</h2><p>Ton code de vérification :</p><h1 style="letter-spacing: 5px; color: #2563eb;">${verificationCode}</h1></div>`
      };
      transporter.sendMail(mailOptions, (error) => {
        if (error) console.error("Erreur email:", error);
      });

      res.status(201).json({ message: 'Compte créé avec succès !', email: email });
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
  db.query('UPDATE users SET verification_code = ? WHERE email = ? AND is_verified = false', [newCode, email], (err, results) => {
    if (err || results.affectedRows === 0) return res.status(400).json({ error: 'Impossible de renvoyer le code.' });
    
    const mailOptions = {
      from: `"L'équipe GeoLearn" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Nouveau code GeoLearn 🌍',
      html: `<div style="text-align: center; font-family: Arial, sans-serif;"><p>Ton nouveau code :</p><h1 style="letter-spacing: 5px; color: #2563eb;">${newCode}</h1></div>`
    };
    transporter.sendMail(mailOptions);
    res.json({ message: 'Nouveau code envoyé.' });
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

// 5. CONNEXION GOOGLE (Le correctif est ici !)
app.post('/api/google-login', async (req, res) => {
  const { credential } = req.body;
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
        // On force la validation si le compte existait sans être validé
        if (!user.is_verified) {
          db.query('UPDATE users SET is_verified = true WHERE id = ?', [user.id]);
        }
        return res.json({ message: 'Connexion Google réussie !', user: { id: user.id, username: user.username, email: user.email, createdAt: user.created_at } });
      } else {
        const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-12), 10);
        db.query('INSERT INTO users (username, email, password, is_verified) VALUES (?, ?, ?, true)', [name, email, randomPassword], (err, insertResult) => {
          if (err) return res.status(500).json({ error: 'Erreur de création de compte.' });
          
          const mailOptions = {
            from: `"L'équipe GeoLearn" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Bienvenue sur GeoLearn ! 🌍',
            html: `<div style="text-align: center; font-family: Arial, sans-serif;"><h2 style="color: #2563eb;">Bonjour ${name} !</h2><p>Ton compte a été créé avec succès via Google.</p></div>`
          };
          transporter.sendMail(mailOptions, (e) => { if (e) console.error("Erreur email Google :", e); });

          res.status(201).json({ message: 'Compte Google créé !', user: { id: insertResult.insertId, username: name, email: email, createdAt: new Date() } });
        });
      }
    });
  } catch (error) {
    console.error("Erreur de validation Google :", error);
    res.status(401).json({ error: 'Jeton Google invalide ou expiré.' });
  }
});

// 6. METTRE À JOUR LE PROFIL
app.put('/api/users/:id', (req, res) => {
  const { name, email } = req.body;
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

// --- DÉMARRAGE DU SERVEUR ---
app.listen(PORT, () => {
  console.log(`Serveur Backend démarré sur le port ${PORT}`);
});