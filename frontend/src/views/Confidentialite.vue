<template>
  <div class="legal-page fade-in-up">
    <!-- EN-TÊTE -->
    <header class="legal-header">
      <span class="legal-badge">RGPD & {{ locale === 'fr' ? 'Sécurité' : 'Security' }}</span>
      <h1>{{ locale === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy (GDPR)' }}</h1>
      <p class="legal-updated">
        {{ locale === 'fr' ? 'Dernière mise à jour : Octobre 2026' : 'Last updated: October 2026' }}
      </p>
    </header>

    <!-- RÉSUMÉ EN 3 POINTS CLÉS -->
    <section class="highlights-grid">
      <div class="highlight-card">
        <div class="hl-badge">01</div>
        <h3>{{ locale === 'fr' ? 'Zéro revente de données' : 'Zero Data Resale' }}</h3>
        <p>
          {{ locale === 'fr'
            ? 'Vos informations personnelles ne sont jamais vendues, louées ou cédées à des tiers publicitaires.'
            : 'Your personal information is never sold, rented, or shared with advertising third parties.' }}
        </p>
      </div>

      <div class="highlight-card">
        <div class="hl-badge">02</div>
        <h3>{{ locale === 'fr' ? 'Collecte minimale' : 'Minimal Collection' }}</h3>
        <p>
          {{ locale === 'fr'
            ? 'Nous stockons uniquement ce qui est strictement nécessaire à votre compte et au suivi de vos scores.'
            : 'We only store what is strictly necessary for your account and score tracking.' }}
        </p>
      </div>

      <div class="highlight-card">
        <div class="hl-badge">03</div>
        <h3>{{ locale === 'fr' ? 'Contrôle total' : 'Full Control' }}</h3>
        <p>
          {{ locale === 'fr'
            ? 'Vous pouvez modifier ou demander la suppression intégrale de votre compte à tout moment.'
            : 'You can modify or request the complete deletion of your account at any time.' }}
        </p>
      </div>
    </section>

    <!-- CONTENU DÉTAILLÉ -->
    <div class="legal-content">
      <article class="legal-section">
        <h2>{{ locale === 'fr' ? '1. Responsable du traitement' : '1. Data Controller' }}</h2>
        <p>
          {{ locale === 'fr'
            ? 'La plateforme éducative GeoLearn (accessible sur geolearn.fun) traite les données personnelles dans le strict respect du Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679).'
            : 'The educational platform GeoLearn (accessible at geolearn.fun) processes personal data in strict compliance with the General Data Protection Regulation (GDPR - EU Regulation 2016/679).' }}
        </p>
        <p>
          {{ locale === 'fr' ? 'Pour toute question relative à vos données, vous pouvez nous joindre à :' : 'For any inquiries regarding your data, you can contact us at:' }}
          <a href="mailto:geolearn-webapp@gmail.com" class="inline-mail">geolearn-webapp@gmail.com</a>
        </p>
      </article>

      <article class="legal-section">
        <h2>{{ locale === 'fr' ? '2. Données collectées et finalités' : '2. Collected Data and Purposes' }}</h2>
        <p>
          {{ locale === 'fr'
            ? 'Dans le cadre de votre utilisation de GeoLearn, nous collectons uniquement les données suivantes :'
            : 'When you use GeoLearn, we only collect the following data:' }}
        </p>
        <ul class="legal-list">
          <li>
            <strong>{{ locale === 'fr' ? 'Données de compte :' : 'Account data:' }}</strong>
            {{ locale === 'fr'
              ? 'Nom d\'utilisateur, adresse e-mail et mot de passe chiffré (hachage bcrypt) ou identifiant OAuth Google pour sécuriser votre connexion.'
              : 'Username, email address, and encrypted password (bcrypt hash) or Google OAuth identifier to secure your login.' }}
          </li>
          <li>
            <strong>{{ locale === 'fr' ? 'Données de progression :' : 'Progress data:' }}</strong>
            {{ locale === 'fr'
              ? 'Scores obtenus aux quiz, modes joués et dates des parties afin d\'afficher vos statistiques personnelles.'
              : 'Quiz scores, played modes, and game dates in order to display your personal statistics.' }}
          </li>
          <li>
            <strong>{{ locale === 'fr' ? 'Préférences locales (Stockage local) :' : 'Local preferences (LocalStorage):' }}</strong>
            {{ locale === 'fr'
              ? 'Langue choisie (FR/EN), thème d\'affichage (Clair/Sombre) et maintien de votre session active. Aucun cookie publicitaire ou traceur tiers n\'est utilisé.'
              : 'Selected language (FR/EN), display theme (Light/Dark), and active session persistence. No advertising cookies or third-party trackers are used.' }}
          </li>
        </ul>
      </article>

      <article class="legal-section">
        <h2>{{ locale === 'fr' ? '3. Hébergement et sécurité' : '3. Hosting and Security' }}</h2>
        <p>
          {{ locale === 'fr'
            ? 'Toutes les communications entre votre navigateur et nos serveurs sont chiffrées via le protocole HTTPS/TLS. La base de données est hébergée sur une infrastructure cloud sécurisée (Aiven / Render) et les mots de passe ne sont jamais stockés en clair.'
            : 'All communications between your browser and our servers are encrypted via HTTPS/TLS. The database is hosted on a secure cloud infrastructure (Aiven / Render) and passwords are never stored in plain text.' }}
        </p>
      </article>

      <article class="legal-section">
        <h2>{{ locale === 'fr' ? '4. Durée de conservation' : '4. Data Retention' }}</h2>
        <p>
          {{ locale === 'fr'
            ? 'Vos données de compte et votre historique de scores sont conservés tant que votre compte reste actif. Les comptes non vérifiés ou les codes de vérification temporaires sont automatiquement purgés.'
            : 'Your account data and score history are retained as long as your account remains active. Unverified accounts or temporary verification codes are automatically purged.' }}
        </p>
      </article>

      <article class="legal-section">
        <h2>{{ locale === 'fr' ? '5. Vos droits (Accès, Rectification, Suppression)' : '5. Your Rights (Access, Rectification, Erasure)' }}</h2>
        <p>
          {{ locale === 'fr'
            ? 'Conformément au RGPD, vous disposez d\'un droit d\'accès, de rectification, de portabilité et d\'effacement de vos données personnelles. Vous pouvez modifier votre pseudo et votre e-mail directement depuis la page Mon Profil, ou demander la suppression complète de votre compte en écrivant à :'
            : 'In accordance with the GDPR, you have the right to access, rectify, port, and erase your personal data. You can update your username and email directly from the My Profile page, or request the complete deletion of your account by writing to:' }}
        </p>
        <div class="contact-cta-box">
          <div>
            <strong>{{ locale === 'fr' ? 'Exercer vos droits RGPD' : 'Exercise your GDPR rights' }}</strong>
            <p>{{ locale === 'fr' ? 'Réponse garantie sous 48 heures.' : 'Guaranteed response within 48 hours.' }}</p>
          </div>
          <a href="mailto:geolearn-webapp@gmail.com?subject=Demande%20RGPD%20-%20GeoLearn" class="btn-legal-contact">
            geolearn-webapp@gmail.com
          </a>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
</script>

<style scoped>
.legal-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 1rem 0 3rem;
  display: flex;
  flex-direction: column;
  gap: 2.8rem;
}

.legal-header {
  text-align: center;
  max-width: 680px;
  margin: 0 auto;
}

.legal-badge {
  display: inline-block;
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
  border: 1px solid rgba(37, 99, 235, 0.25);
  padding: 0.4rem 1rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 1rem;
}

.legal-header h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.legal-updated {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.highlight-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  padding: 1.75rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.hl-badge {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
  font-weight: 800;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.highlight-card h3 {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-main);
}

.highlight-card p {
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.legal-content {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 22px;
  padding: 2.8rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 2.2rem;
}

.legal-section h2 {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 0.85rem;
}

.legal-section p {
  color: var(--text-muted);
  line-height: 1.7;
  font-size: 0.98rem;
  margin-bottom: 0.75rem;
}

.legal-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-top: 0.75rem;
}

.legal-list li {
  position: relative;
  padding-left: 1.5rem;
  color: var(--text-muted);
  line-height: 1.65;
  font-size: 0.96rem;
}

.legal-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2563eb;
}

.inline-mail {
  color: #2563eb;
  font-weight: 700;
  text-decoration: none;
  margin-left: 0.35rem;
}

.inline-mail:hover {
  text-decoration: underline;
}

.contact-cta-box {
  margin-top: 1.25rem;
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.4rem 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.contact-cta-box strong {
  display: block;
  font-size: 1.05rem;
  color: var(--text-main);
  margin-bottom: 0.2rem;
}

.contact-cta-box p {
  margin: 0;
  font-size: 0.88rem;
}

.btn-legal-contact {
  background: #2563eb;
  color: #ffffff !important;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.92rem;
  padding: 0.75rem 1.35rem;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.btn-legal-contact:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@media (max-width: 768px) {
  .highlights-grid {
    grid-template-columns: 1fr;
  }
  .legal-content {
    padding: 1.75rem 1.25rem;
  }
  .contact-cta-box {
    flex-direction: column;
    align-items: flex-start;
  }
  .btn-legal-contact {
    width: 100%;
    text-align: center;
  }
}
</style>