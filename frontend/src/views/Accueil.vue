<template>
  <div class="home-container">
    
    <!-- HEADER HERO SECTION -->
    <section class="hero slide-up">
      <div class="badge-version">
        <span class="pulse-dot"></span>
        {{ t ? t('home.new_version', 'Nouvelle version disponible') : 'Nouvelle version disponible' }}
      </div>
      
      <h1 class="hero-title">
        Maîtrisez la géographie <br />
        avec <span class="highlight">GeoLearn</span>
      </h1>
      
      <p class="hero-subtitle">
        Découvrez le monde à travers des quiz interactifs, des défis chronométrés et des cartes dynamiques. Apprendre n'a jamais été aussi amusant.
      </p>
      
      <div class="hero-actions">
        <router-link to="/quiz" class="btn btn-primary shadow-hover">
          Lancer une partie ➔
        </router-link>
        <router-link to="/explorer" class="btn btn-secondary shadow-hover">
          🌍 Explorer la carte
        </router-link>
      </div>
    </section>

    <!-- SECTION DES FONCTIONNALITÉS -->
    <section class="features slide-up delay-1">
      <div class="section-header">
        <h2>4 façons d'apprendre</h2>
        <p>Que vous soyez débutant ou expert, nos différents modes de jeu s'adaptent à votre niveau pour une progression optimale.</p>
      </div>

      <div class="features-grid">
        <!-- Carte 1 -->
        <div class="feature-card">
          <div class="feature-icon bg-red">⏱️</div>
          <h3>Défi Europe</h3>
          <p>Le test ultime. Vous avez 3 minutes pour retrouver sur la carte interactive les 47 pays qui composent le continent européen.</p>
          <router-link to="/quiz" class="feature-link text-red">Essayer ce mode ▸</router-link>
        </div>
        
        <!-- Carte 2 -->
        <div class="feature-card">
          <div class="feature-icon bg-blue">🏛️</div>
          <h3>Quiz des Capitales</h3>
          <p>Testez vos connaissances à travers des séries de 15 questions générées aléatoirement sur les capitales du monde entier.</p>
          <router-link to="/quiz" class="feature-link text-blue">Essayer ce mode ▸</router-link>
        </div>
        
        <!-- Carte 3 -->
        <div class="feature-card">
          <div class="feature-icon bg-orange">🚩</div>
          <h3>Reconnaissance de Drapeaux</h3>
          <p>Associez visuellement les drapeaux à leurs pays respectifs. Des images haute définition pour ne rater aucun détail.</p>
          <router-link to="/quiz" class="feature-link text-orange">Essayer ce mode ▸</router-link>
        </div>
        
        <!-- Carte 4 -->
        <div class="feature-card">
          <div class="feature-icon bg-green">🃏</div>
          <h3>Flashcards (Révision)</h3>
          <p>Apprenez sans pression. Un mode révision pur avec des cartes mémorielles recto-verso pour vous entraîner avant les quiz.</p>
          <router-link to="/quiz" class="feature-link text-green">Essayer ce mode ▸</router-link>
        </div>
      </div>
    </section>

    <!-- BANNIÈRE STATISTIQUES -->
    <section class="stats-banner slide-up delay-2">
      <div class="stat-item">
        <span class="stat-number">190+</span>
        <span class="stat-label">Pays intégrés</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-number">100%</span>
        <span class="stat-label">Gratuit & Sans pub</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-icon">📈</span>
        <span class="stat-label">Suivi de progression en direct</span>
      </div>
    </section>

  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<style scoped>
/* CONTENEUR PRINCIPAL */
.home-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 4rem 1.5rem 6rem; /* Beaucoup plus d'espace en haut et en bas */
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ================= HERO SECTION ================= */
.hero {
  text-align: center;
  margin-bottom: 7rem; /* Sépare massivement le hero du reste */
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
}

.badge-version {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #eff6ff;
  color: #2563eb;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 2rem;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background-color: #3b82f6;
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  animation: pulse 2s infinite;
}

.hero-title {
  font-size: 3.8rem;
  font-weight: 900;
  color: #0f172a;
  line-height: 1.15;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.highlight {
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  padding: 0 1rem;
}

.hero-actions {
  display: flex;
  gap: 1.2rem;
  justify-content: center;
}

.btn {
  padding: 0.95rem 1.8rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.05rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #2563eb;
  color: white;
  border: 2px solid #2563eb;
}

.btn-primary:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #ffffff;
  color: #0f172a;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
  transform: translateY(-2px);
}

.shadow-hover:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* ================= FEATURES SECTION ================= */
.features {
  width: 100%;
  margin-bottom: 6rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem; /* Éloigne le titre des cartes */
}

.section-header h2 {
  font-size: 2.2rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1rem;
}

.section-header p {
  color: #64748b;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2.5rem; /* Aère massivement les cartes entre elles */
}

.feature-card {
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: #e2e8f0;
}

.feature-icon {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Couleurs douces pour les icônes */
.bg-red { background: #fee2e2; }
.bg-blue { background: #dbeafe; }
.bg-orange { background: #ffedd5; }
.bg-green { background: #dcfce7; }

.text-red { color: #dc2626; }
.text-blue { color: #2563eb; }
.text-orange { color: #ea580c; }
.text-green { color: #16a34a; }

.feature-card h3 {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.8rem;
}

.feature-card p {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
  flex-grow: 1;
  margin-bottom: 1.8rem;
}

.feature-link {
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  transition: opacity 0.2s;
}

.feature-link:hover {
  opacity: 0.7;
}

/* ================= STATS BANNER ================= */
.stats-banner {
  background: #0f172a;
  width: 100%;
  border-radius: 20px;
  padding: 3rem 2rem;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: white;
  box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.3);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 900;
}

.stat-icon {
  font-size: 2.2rem;
  margin-bottom: 0.3rem;
}

.stat-label {
  color: #94a3b8;
  font-size: 1rem;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 60px;
  background: #334155;
}

/* ================= ANIMATIONS ================= */
@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(37, 99, 235, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
}

.slide-up {
  animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(30px);
}

.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.4s; }

@keyframes slideUpFade {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .hero-title { font-size: 2.8rem; }
  .features-grid { grid-template-columns: 1fr; }
  .stats-banner { flex-direction: column; gap: 2rem; padding: 2.5rem 1.5rem; }
  .stat-divider { width: 100%; height: 1px; }
}

@media (max-width: 600px) {
  .hero-actions { flex-direction: column; }
  .hero-title { font-size: 2.3rem; }
  .home-container { padding: 2rem 1rem 4rem; }
}
</style>