require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt'); // Import de l'outil de cryptage
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const nodemailer = require('nodemailer');

// Configuration du service d'envoi d'emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL :', err.message);
    return;
  }
  console.log('Connexion à la base de données MySQL réussie ! 🗄️');
});

// ==========================================
// ROUTES D'AUTHENTIFICATION
// ==========================================

// --- FONCTION UTILITAIRE : GÉNÉRER UN CODE À 6 CHIFFRES ---
const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1. INSCRIPTION (Génération du code et envoi du mail)
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode(); // Code à 6 chiffres

    // On insère l'utilisateur en tant que non vérifié (is_verified = false par défaut)
    const query = 'INSERT INTO users (username, email, password, verification_code, is_verified) VALUES (?, ?, ?, ?, false)';
    
    db.query(query, [username, email, hashedPassword, verificationCode], (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Ce nom d\'utilisateur ou cet email est déjà utilisé.' });
        }
        return res.status(500).json({ error: 'Erreur lors de la création du compte.' });
      }

      // Envoi du code par email
      const mailOptions = {
        from: `"L'équipe GeoLearn" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Ton code de vérification GeoLearn 🌍',
        html: `
          <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px; text-align: center;">
            <h2 style="color: #2563eb;">Bienvenue ${username} !</h2>
            <p>Pour finaliser la création de ton compte, copie le code de vérification ci-dessous :</p>
            <div style="margin: 30px 0; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1f2937;">
              ${verificationCode}
            </div>
            <p style="color: #6b7280; font-size: 14px;">Si tu n'as pas demandé à créer de compte, ignore simplement cet e-mail.</p>
          </div>
        `
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) console.error("Erreur d'envoi d'email :", error);
      });

      // On renvoie un succès avec l'email pour que le frontend sache quel email vérifier
      res.status(201).json({ message: 'Compte créé. Un code a été envoyé !', email: email });
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur interne.' });
  }
});

// 1. BIS. VÉRIFICATION DU CODE
app.post('/api/verify-code', (req, res) => {
  const { email, code } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND verification_code = ?';
  db.query(query, [email, code], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur lors de la vérification.' });

    if (results.length === 0) {
      return res.status(400).json({ error: 'Code incorrect ou expiré.' });
    }

    // Le code est bon, on valide le compte et on efface le code
    const updateQuery = 'UPDATE users SET is_verified = true, verification_code = NULL WHERE email = ?';
    db.query(updateQuery, [email], (err) => {
      if (err) return res.status(500).json({ error: 'Erreur lors de la validation du compte.' });
      res.json({ message: 'Compte vérifié avec succès ! Tu peux te connecter.' });
    });
  });
});

// 1. TER. RENVOYER UN NOUVEAU CODE
app.post('/api/resend-code', (req, res) => {
  const { email } = req.body;
  const newCode = generateVerificationCode();

  const updateQuery = 'UPDATE users SET verification_code = ? WHERE email = ? AND is_verified = false';
  db.query(updateQuery, [newCode, email], (err, results) => {
    if (err || results.affectedRows === 0) {
      return res.status(400).json({ error: 'Impossible de renvoyer le code (compte introuvable ou déjà vérifié).' });
    }

    const mailOptions = {
      from: `"L'équipe GeoLearn" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Nouveau code de vérification GeoLearn 🌍',
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px; text-align: center;">
          <p>Voici ton nouveau code de vérification :</p>
          <div style="margin: 30px 0; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1f2937;">
            ${newCode}
          </div>
        </div>
      `
    };

    transporter.sendMail(mailOptions);
    res.json({ message: 'Un nouveau code a été envoyé.' });
  });
});

// 2. CONNEXION
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Recherche de l'utilisateur par son email
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur lors de la connexion.' });
    
    // Si aucun utilisateur n'est trouvé
    if (results.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    const user = results[0];
    // Si l'utilisateur n'a pas vérifié son e-mail
    if (!user.is_verified) {
      return res.status(403).json({ error: 'Tu dois vérifier ton adresse e-mail avant de te connecter.' });
    }
    // Comparaison du mot de passe saisi avec le mot de passe crypté stocké
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    // Connexion réussie : on renvoie les infos de l'utilisateur (sans le mot de passe)
    res.json({ 
      message: 'Connexion réussie !', 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        createdAt: user.created_at
      } 
    });
  });
});

// 3. CONNEXION AVEC GOOGLE
app.post('/api/google-login', async (req, res) => {
  const { credential } = req.body;
  
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name } = payload;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Erreur base de données.' });

      if (results.length > 0) {
        // Le compte existe déjà, on le connecte
        const user = results[0];
        return res.json({ 
          message: 'Connexion Google réussie !', 
          user: { id: user.id, username: user.username, email: user.email, createdAt: user.created_at } 
        });
      } else {
        // Le compte n'existe pas : on le crée et on l'active directement (is_verified = true)
        const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-12), 10);
        
        db.query('INSERT INTO users (username, email, password, is_verified) VALUES (?, ?, ?, true)', [name, email, randomPassword], (err, insertResult) => {
          if (err) return res.status(500).json({ error: 'Erreur lors de la création du compte Google.' });
          
          // --- ENVOI DU MAIL DE BIENVENUE GOOGLE ---
          const mailOptions = {
            from: `"L'équipe GeoLearn" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Bienvenue sur GeoLearn ! 🌍',
            html: `
              <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px; text-align: center;">
                <h2 style="color: #2563eb;">Bonjour ${name} !</h2>
                <p>Ton compte GeoLearn a été créé avec succès via Google.</p>
                <p>Prépare-toi à relever nos défis géographiques !</p>
                <div style="margin: 30px 0;">
                  <a href="http://localhost:5173/quiz" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold;">Lancer ma première partie</a>
                </div>
                <p style="color: #6b7280; font-size: 14px;">À très vite sur l'application !<br><b>L'équipe GeoLearn</b></p>
              </div>
            `
          };

          transporter.sendMail(mailOptions, (error) => {
            if (error) console.error("Erreur d'envoi d'email Google :", error);
            else console.log('Email de bienvenue Google envoyé à :', email);
          });
          // ------------------------------------------

          res.status(201).json({
            message: 'Compte Google créé avec succès !',
            user: { id: insertResult.insertId, username: name, email: email, createdAt: new Date() }
          });
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Jeton Google invalide.' });
  }
});

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: "Le serveur Express de GeoLearn fonctionne parfaitement ! 🚀" });
});

// ==========================================
// ROUTES DES SCORES
// ==========================================

// 1. SAUVEGARDER UN SCORE
app.post('/api/scores', (req, res) => {
  const { user_id, mode, score, max_score } = req.body;

  if (!user_id) return res.status(401).json({ error: 'Utilisateur non connecté.' });

  const query = 'INSERT INTO scores (user_id, mode, score, max_score) VALUES (?, ?, ?, ?)';
  db.query(query, [user_id, mode, score, max_score], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors de la sauvegarde du score.' });
    }
    res.status(201).json({ message: 'Score enregistré avec succès !' });
  });
});

// 2. RÉCUPÉRER L'HISTORIQUE D'UN JOUEUR
app.get('/api/scores/:user_id', (req, res) => {
  const userId = req.params.user_id;

  // On récupère les scores du plus récent au plus ancien
  const query = 'SELECT * FROM scores WHERE user_id = ? ORDER BY played_at DESC';
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des scores.' });
    }
    res.json(results);
  });
});

// 3. METTRE À JOUR LE PROFIL UTILISATEUR
app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;

  // Mise à jour du pseudo et de l'email dans la base
  const query = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
  
  db.query(query, [name, email, userId], (err, results) => {
    if (err) {
      // Si le nouveau pseudo ou email existe déjà pour un autre compte
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Ce nom d\'utilisateur ou cet email est déjà utilisé.' });
      }
      return res.status(500).json({ error: 'Erreur lors de la mise à jour du profil.' });
    }
    
    res.json({ 
      message: 'Profil mis à jour avec succès !',
      username: name,
      email: email
    });
  });
});

app.listen(PORT, () => {
  console.log(`Serveur Backend démarré sur http://localhost:${PORT}`);
});