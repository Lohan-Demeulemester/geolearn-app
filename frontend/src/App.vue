<template>
  <div :class="['app-layout', { 'dark-mode': isDarkMode }]">
    <!-- NAVBAR (Écartée sur les bords) -->
    <header class="navbar">
      <div class="navbar-container">
        <router-link to="/" class="brand-logo">
          <span class="logo-icon">🌍</span>
          <span class="logo-text">GeoLearn</span>
        </router-link>

        <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">
          <span v-if="!mobileMenuOpen">☰</span>
          <span v-else>✕</span>
        </button>

        <nav :class="['nav-links', { 'nav-open': mobileMenuOpen }]">
          <router-link to="/" class="nav-item" @click="mobileMenuOpen = false">
            {{ t ? t('nav.home', 'Accueil') : 'Accueil' }}
          </router-link>
          <router-link to="/explorer" class="nav-item" @click="mobileMenuOpen = false">
            {{ t ? t('nav.explore', 'Explorer') : 'Explorer' }}
          </router-link>
          <router-link to="/quiz" class="nav-item" @click="mobileMenuOpen = false">
            {{ t ? t('nav.quiz', 'Quiz & Flashcards') : 'Quiz & Flashcards' }}
          </router-link>
          <router-link to="/scores" class="nav-item" @click="mobileMenuOpen = false">
            {{ locale === 'fr' ? 'Scores' : 'Scores' }}
          </router-link>

          <router-link v-if="isAdmin" to="/admin" class="nav-item admin-badge" @click="mobileMenuOpen = false">
            Admin
          </router-link>
        </nav>

        <div class="nav-actions">
          <!-- BOUTON MODE SOMBRE -->
          <button class="action-btn theme-toggle" @click="toggleDarkMode" :title="isDarkMode ? 'Passer en mode clair' : 'Passer en mode sombre'">
            {{ isDarkMode ? '☀️' : '🌙' }}
          </button>

          <!-- BOUTON LANGUE -->
          <button class="action-btn lang-switch" @click="toggleLanguage">
            {{ locale === 'fr' ? 'FR' : 'EN' }}
          </button>

          <!-- PROFIL -->
          <router-link to="/profil" class="profile-btn" @click="mobileMenuOpen = false">
            <img v-if="currentUser && currentUser.avatar" :src="currentUser.avatar" alt="Avatar" class="nav-avatar" />
            <span v-else class="user-icon">👤</span>
            <span class="profile-name">
              {{ currentUser ? currentUser.name : (t ? t('nav.login', 'Connexion') : 'Connexion') }}
            </span>
          </router-link>
        </div>
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>

    <!-- FOOTER -->
    <footer class="site-footer">
      <div class="footer-container">
        <div class="footer-col brand-col">
          <div class="footer-logo">
            <span class="logo-text">GeoLearn</span>
          </div>
          <p class="footer-desc">
            {{ locale === 'fr' 
              ? 'La plateforme interactive pour apprendre la géographie mondiale, maîtriser les capitales, les drapeaux et relever des défis chronométrés.' 
              : 'The interactive platform to learn world geography, master capitals, flags, and take on timed challenges.' 
            }}
          </p>
          <a href="mailto:contact@geolearn.fun" class="footer-mail">
            contact@geolearn.fun
          </a>
        </div>

        <div class="footer-col">
          <h4>{{ locale === 'fr' ? 'Navigation' : 'Navigation' }}</h4>
          <ul class="footer-links">
            <li><router-link to="/">{{ locale === 'fr' ? 'Accueil' : 'Home' }}</router-link></li>
            <li><router-link to="/explorer">{{ locale === 'fr' ? 'Carte du Monde' : 'World Map' }}</router-link></li>
            <li><router-link to="/quiz">{{ locale === 'fr' ? 'Quiz & Défis' : 'Quizzes & Challenges' }}</router-link></li>
            <li><router-link to="/profil">{{ locale === 'fr' ? 'Mon Compte' : 'My Account' }}</router-link></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>{{ locale === 'fr' ? 'Communauté' : 'Community' }}</h4>
          <ul class="footer-links">
            <li><router-link to="/feedback" class="highlight-link">{{ locale === 'fr' ? 'Signaler un bug' : 'Report a bug' }}</router-link></li>
            <li><router-link to="/a-propos">{{ locale === 'fr' ? 'Qui sommes-nous ?' : 'About Us' }}</router-link></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>{{ locale === 'fr' ? 'Légal' : 'Legal' }}</h4>
          <ul class="footer-links">
            <li><router-link to="/confidentialite">RGPD & Confidentialité</router-link></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p>© {{ new Date().getFullYear() }} GeoLearn.fun</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const mobileMenuOpen = ref(false);
const currentUser = ref(null);
const isDarkMode = ref(false);

const ADMIN_EMAILS = ['lohan.dtr@gmail.com', 'lohan.demeulemester@efrei.net'];

const isAdmin = computed(() => {
  if (!currentUser.value || !currentUser.value.email) return false;
  return ADMIN_EMAILS.includes(currentUser.value.email.toLowerCase());
});

const loadUserFromStorage = () => {
  const saved = localStorage.getItem('geolearn_user');
  if (saved) {
    try { currentUser.value = JSON.parse(saved); } catch (e) { currentUser.value = null; }
  } else { currentUser.value = null; }
};

const toggleLanguage = () => {
  locale.value = locale.value === 'fr' ? 'en' : 'fr';
  localStorage.setItem('geolearn_lang', locale.value);
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('geolearn_theme', isDarkMode.value ? 'dark' : 'light');
  document.body.classList.toggle('dark-theme-active', isDarkMode.value);
};

onMounted(() => {
  const savedLang = localStorage.getItem('geolearn_lang');
  if (savedLang) locale.value = savedLang;
  
  const savedTheme = localStorage.getItem('geolearn_theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true;
    document.body.classList.add('dark-theme-active');
  }

  loadUserFromStorage();
  window.addEventListener('auth-change', loadUserFromStorage);
});

onUnmounted(() => {
  window.removeEventListener('auth-change', loadUserFromStorage);
});
</script>

<style>
/* CSS VARIABLES POUR LE THEME */
:root {
  --bg-main: #f8fafc;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --bg-nav: #ffffff;
  --border-color: #e2e8f0;
  --card-bg: #ffffff;
  --card-hover: #f1f5f9;
}

.dark-theme-active {
  --bg-main: #0f172a;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --bg-nav: #1e293b;
  --border-color: #334155;
  --card-bg: #1e293b;
  --card-hover: #334155;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg-main);
  color: var(--text-main);
  transition: background-color 0.3s ease, color 0.3s ease;
  margin: 0;
}

.app-layout { min-height: 100vh; display: flex; flex-direction: column; }

.main-content {
  flex: 1;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 1.5rem; /* Redonne de l'air en haut et sur les côtés */
}

/* CONTENEUR NAVBAR ÉLARGI */
.navbar {
  background: var(--bg-nav);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: background-color 0.3s;
}

.navbar-container {
  width: 100%;
  max-width: 1600px; /* Beaucoup plus large */
  margin: 0 auto;
  padding: 0.85rem 3%; /* Espace sur les bords */
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-logo { text-decoration: none; font-size: 1.35rem; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 0.5rem;}
.logo-text { background: linear-gradient(135deg, #2563eb, #0ea5e9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

.nav-links { display: flex; gap: 0.5rem; }
.nav-item { text-decoration: none; color: var(--text-muted); font-weight: 600; padding: 0.5rem 0.9rem; border-radius: 10px; transition: 0.2s; }
.nav-item:hover { color: #2563eb; background: var(--card-hover); }
.nav-item.router-link-exact-active { color: #2563eb; background: rgba(37, 99, 235, 0.1); }

.nav-actions { display: flex; align-items: center; gap: 0.8rem; }
.action-btn { background: var(--card-hover); color: var(--text-main); border: 1px solid var(--border-color); padding: 0.45rem 0.75rem; border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.2s; }
.action-btn:hover { filter: brightness(0.95); }

.profile-btn { display: flex; align-items: center; gap: 0.5rem; background: #2563eb; color: #fff; text-decoration: none; padding: 0.45rem 1rem; border-radius: 999px; font-weight: 600; transition: 0.2s; }
.profile-btn:hover { background: #1d4ed8; }
.nav-avatar { width: 24px; height: 24px; border-radius: 50%; }

.site-footer { background: #0b1120; color: #cbd5e1; margin-top: auto; }
.footer-container { max-width: 1400px; margin: 0 auto; padding: 3rem 3%; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 2rem; }
.footer-links { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.footer-links a { color: #94a3b8; text-decoration: none; }
.footer-links a:hover { color: white; }
.footer-bottom { border-top: 1px solid #1e293b; padding: 1.5rem 3%; text-align: center; }
</style>