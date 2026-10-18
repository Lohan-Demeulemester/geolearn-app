<template>
  <div class="about-page fade-in-up">
    <!-- HERO QUI SOMMES-NOUS -->
    <section class="about-hero">
      <span class="about-badge">
        {{ locale === 'fr' ? 'Notre Mission' : 'Our Mission' }}
      </span>
      <h1>
        {{ locale === 'fr'
          ? 'Rendre la géographie mondiale accessible, visuelle et captivante'
          : 'Making world geography accessible, visual, and engaging' }}
      </h1>
      <p class="about-lead">
        {{ locale === 'fr'
          ? 'GeoLearn est une plateforme éducative interactive conçue pour aider les étudiants, les curieux et les passionnés à maîtriser les pays, les capitales et les drapeaux du monde entier sans publicité et gratuitement.'
          : 'GeoLearn is an interactive educational platform designed to help students, curious minds, and enthusiasts master the countries, capitals, and flags of the world—free and ad-free.' }}
      </p>
    </section>

    <!-- NOS 3 PILIERS -->
    <section class="pillars-grid">
      <div class="pillar-card">
        <div class="pillar-num">01</div>
        <h3>{{ locale === 'fr' ? 'Apprentissage actif' : 'Active Learning' }}</h3>
        <p>
          {{ locale === 'fr'
            ? 'La mémoire visuelle et spatiale fonctionne mieux par la pratique. Nos cartes interactives, nos flashcards et nos défis chronométrés ancrent durablement les connaissances.'
            : 'Visual and spatial memory works best through practice. Our interactive maps, flashcards, and timed challenges anchor knowledge lastingly.' }}
        </p>
      </div>

      <div class="pillar-card">
        <div class="pillar-num">02</div>
        <h3>{{ locale === 'fr' ? '100% Gratuit & Sans pub' : '100% Free & Ad-Free' }}</h3>
        <p>
          {{ locale === 'fr'
            ? 'Aucune bannière intrusive, aucun abonnement caché. L\'interface est épurée pour vous permettre de rester concentré sur votre progression.'
            : 'No intrusive banners, no hidden subscriptions. The interface is clean so you can stay focused on your progress.' }}
        </p>
      </div>

      <div class="pillar-card">
        <div class="pillar-num">03</div>
        <h3>{{ locale === 'fr' ? 'Évolution continue' : 'Continuous Evolution' }}</h3>
        <p>
          {{ locale === 'fr'
            ? 'Développé par un étudiant ingénieur passionné, GeoLearn évolue constamment grâce aux retours et aux idées de sa communauté.'
            : 'Developed by a passionate engineering student, GeoLearn constantly evolves thanks to feedback and ideas from its community.' }}
        </p>
      </div>
    </section>

    <!-- SECTION PROJET & FONDATEUR -->
    <section class="story-card">
      <div class="story-text">
        <h2>{{ locale === 'fr' ? 'Pourquoi avoir créé GeoLearn ?' : 'Why was GeoLearn created?' }}</h2>
        <p>
          {{ locale === 'fr'
            ? 'La plupart des outils de révision géographique existants sont soit saturés de publicités, soit vieillissants et peu ergonomiques sur mobile comme sur ordinateur.'
            : 'Most existing geography study tools are either saturated with ads or outdated and clunky on both mobile and desktop.' }}
        </p>
        <p>
          {{ locale === 'fr'
            ? 'L\'objectif de GeoLearn est d\'offrir une expérience moderne, rapide et bilingue (Français / Anglais), combinant une carte mondiale interactive, des quiz dynamiques et un suivi statistique précis de vos performances.'
            : 'GeoLearn\'s goal is to offer a modern, fast, and bilingual (French / English) experience, combining an interactive world map, dynamic quizzes, and accurate statistical tracking of your performance.' }}
        </p>
      </div>

      <div class="story-stats">
        <div class="mini-stat">
          <strong>195</strong>
          <span>{{ locale === 'fr' ? 'Pays du monde' : 'World Countries' }}</span>
        </div>
        <div class="mini-stat">
          <strong>4+</strong>
          <span>{{ locale === 'fr' ? 'Modes d\'apprentissage' : 'Learning Modes' }}</span>
        </div>
        <div class="mini-stat">
          <strong>FR / EN</strong>
          <span>{{ locale === 'fr' ? 'Plateforme bilingue' : 'Bilingual Platform' }}</span>
        </div>
      </div>
    </section>

    <!-- SECTION CONTACT -->
    <section id="contact" class="contact-section">
      <div class="contact-header">
        <h2>{{ locale === 'fr' ? 'Nous contacter' : 'Contact Us' }}</h2>
        <p>
          {{ locale === 'fr'
            ? 'Une question, un partenariat, une remarque pédagogique ou un bug à signaler ? Choisissez le canal le plus adapté :'
            : 'A question, partnership, educational remark, or bug to report? Choose the most suitable channel:' }}
        </p>
      </div>

      <div class="contact-cards">
        <!-- Carte Email Direct -->
        <div class="contact-box">
          <span class="contact-tag">{{ locale === 'fr' ? 'Contact direct' : 'Direct Contact' }}</span>
          <h3>{{ locale === 'fr' ? 'Par courrier électronique' : 'By Email' }}</h3>
          <p>
            {{ locale === 'fr'
              ? 'Pour toute demande générale, question sur votre compte ou demande liée à la confidentialité (RGPD).'
              : 'For any general inquiry, question about your account, or privacy-related request (GDPR).' }}
          </p>
          <a href="mailto:geolearn-webapp@gmail.com" class="btn-contact-primary">
            geolearn-webapp@gmail.com
          </a>
        </div>

        <!-- Carte Boîte à idées / Bug -->
        <div class="contact-box">
          <span class="contact-tag tag-blue">{{ locale === 'fr' ? 'Communauté' : 'Community' }}</span>
          <h3>{{ locale === 'fr' ? 'Suggérer une idée ou signaler un bug' : 'Suggest an Idea or Report a Bug' }}</h3>
          <p>
            {{ locale === 'fr'
              ? 'Utilisez notre formulaire dédié pour envoyer directement vos suggestions ou rapports techniques à l\'administrateur.'
              : 'Use our dedicated form to send your suggestions or technical reports directly to the administrator.' }}
          </p>
          <router-link to="/feedback" class="btn-contact-secondary">
            {{ locale === 'fr' ? 'Ouvrir le formulaire de retour' : 'Open Feedback Form' }}
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
</script>

<style scoped>
.about-page {
  max-width: 1040px;
  margin: 0 auto;
  padding: 1rem 0 3rem;
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
}

.about-hero {
  text-align: center;
  max-width: 780px;
  margin: 0 auto;
}

.about-badge {
  display: inline-block;
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
  border: 1px solid rgba(37, 99, 235, 0.25);
  padding: 0.4rem 1.1rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 1.1rem;
}

.about-hero h1 {
  font-size: clamp(2.1rem, 4vw, 3.1rem);
  font-weight: 900;
  color: var(--text-main);
  line-height: 1.18;
  margin-bottom: 1.2rem;
}

.about-lead {
  font-size: 1.12rem;
  color: var(--text-muted);
  line-height: 1.65;
}

.pillars-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.75rem;
}

.pillar-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.pillar-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.pillar-num {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
  font-weight: 800;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pillar-card h3 {
  font-size: 1.22rem;
  font-weight: 800;
  color: var(--text-main);
}

.pillar-card p {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.65;
}

.story-card {
  background: linear-gradient(135deg, #091e3a 0%, #0f172a 100%);
  border-radius: 24px;
  padding: 3rem;
  color: #ffffff;
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 2.5rem;
  align-items: center;
  box-shadow: 0 20px 35px -10px rgba(9, 30, 58, 0.35);
}

.story-text h2 {
  font-size: 1.8rem;
  font-weight: 800;
  color: #ffffff !important;
  margin-bottom: 1rem;
}

.story-text p {
  color: #cbd5e1;
  line-height: 1.7;
  font-size: 0.98rem;
  margin-bottom: 0.9rem;
}

.story-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mini-stat {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 1.15rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mini-stat strong {
  font-size: 1.55rem;
  font-weight: 900;
  color: #38bdf8 !important;
}

.mini-stat span {
  font-size: 0.92rem;
  color: #e2e8f0;
  font-weight: 600;
}

.contact-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.contact-header {
  text-align: center;
  max-width: 640px;
  margin: 0 auto;
}

.contact-header h2 {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.contact-header p {
  color: var(--text-muted);
  font-size: 1rem;
}

.contact-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.75rem;
}

.contact-box {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 2.2rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.85rem;
}

.contact-tag {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
}

.contact-tag.tag-blue {
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
}

.contact-box h3 {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-main);
}

.contact-box p {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.65;
  flex: 1;
  margin-bottom: 0.5rem;
}

.btn-contact-primary,
.btn-contact-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.5rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-contact-primary {
  background: #2563eb;
  color: #ffffff !important;
}

.btn-contact-primary:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
}

.btn-contact-secondary {
  background: var(--input-bg);
  color: var(--text-main);
  border: 1px solid var(--border-color);
}

.btn-contact-secondary:hover {
  border-color: #2563eb;
  color: #2563eb;
  transform: translateY(-2px);
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@media (max-width: 860px) {
  .pillars-grid,
  .contact-cards,
  .story-card {
    grid-template-columns: 1fr;
  }
  .story-card {
    padding: 2rem 1.5rem;
  }
}
</style>