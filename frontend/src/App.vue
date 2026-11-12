<template>
  <div :class="['app-shell', { 'dark-mode': isDarkMode, 'dark': isDarkMode }]">
    <!-- ========================================================= -->
    <!-- BARRE DE NAVIGATION SUPÉRIEURE                            -->
    <!-- ========================================================= -->
    <header class="top-nav" role="banner">
      <div class="top-nav-inner">
        <!-- GAUCHE : Logo GeoLearn (Icône seule sur mobile, Texte + Icône sur PC) -->
        <router-link to="/" class="brand-mark" @click="mobileMenuOpen = false">
          <div class="brand-icon-box" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <div class="brand-text-group">
            <span class="brand-name">GeoLearn</span>
            <span class="brand-tag">{{ locale === 'fr' ? '196 ÉTATS' : '196 COUNTRIES' }}</span>
          </div>
        </router-link>

        <!-- CENTRE : Pilule de navigation PC / Menu déroulant fixe sur Mobile -->
        <nav :class="['primary-nav', { 'is-open': mobileMenuOpen }]" aria-label="Main Navigation">
          <router-link to="/" class="nav-link" @click="mobileMenuOpen = false">
            <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>{{ t('nav.home') }}</span>
          </router-link>

          <router-link to="/explorer" class="nav-link" @click="mobileMenuOpen = false">
            <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" y1="3" x2="9" y2="18" />
              <line x1="15" y1="6" x2="15" y2="21" />
            </svg>
            <span>{{ t('nav.explore') }}</span>
          </router-link>

          <router-link to="/quiz" class="nav-link" @click="mobileMenuOpen = false">
            <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>{{ t('nav.quiz') }}</span>
          </router-link>

          <router-link to="/geoguessr" class="nav-link" @click="mobileMenuOpen = false">
            <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{{ t('nav.geoguessr') }}</span>
          </router-link>

          <router-link to="/duel" class="nav-link nav-link-duel" @click="mobileMenuOpen = false">
            <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
              <line x1="13" y1="19" x2="19" y2="13" />
              <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
            </svg>
            <span>{{ locale === 'fr' ? 'Duel 1v1' : '1v1 Duel' }}</span>
          </router-link>

          <router-link to="/scores" class="nav-link" @click="mobileMenuOpen = false">
            <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <span>{{ t('nav.scores') }}</span>
          </router-link>

          <router-link to="/collection" class="nav-link" @click="mobileMenuOpen = false">
            <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
            <span>{{ t('nav.collection') }}</span>
          </router-link>

          <router-link to="/classement" class="nav-link" @click="mobileMenuOpen = false">
            <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
            <span>{{ t('nav.leaderboard') }}</span>
          </router-link>

          <router-link
            v-if="isAdmin"
            to="/admin"
            class="nav-link nav-link-admin"
            @click="mobileMenuOpen = false"
          >
            <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Admin</span>
          </router-link>
        </nav>

        <!-- DROITE : Thème, Langue, Profil & Bouton Menu Mobile -->
        <div class="nav-controls">
          <button
            type="button"
            class="control-pill"
            @click="toggleDarkMode"
            :aria-label="isDarkMode ? (locale === 'fr' ? 'Activer le mode clair' : 'Switch to light mode') : (locale === 'fr' ? 'Activer le mode sombre' : 'Switch to dark mode')"
          >
            <svg v-if="isDarkMode" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" /><path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" /><path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </button>

          <button
            type="button"
            class="control-pill font-mono"
            @click="toggleLanguage"
            :title="locale === 'fr' ? 'Switch to English' : 'Passer en Français'"
          >
            {{ locale === 'fr' ? 'FR' : 'EN' }}
          </button>

          <router-link to="/profil" class="user-cta" @click="mobileMenuOpen = false">
            <img v-if="currentUser && currentUser.avatar" :src="currentUser.avatar" alt="" class="user-avatar" />
            <span v-else class="user-initials">{{ userInitials }}</span>
            <span class="user-cta-label">{{ displayNavUser }}</span>
          </router-link>

          <button
            type="button"
            class="mobile-toggle-btn"
            @click.stop="mobileMenuOpen = !mobileMenuOpen"
            :aria-expanded="mobileMenuOpen"
            aria-label="Menu"
          >
            <svg v-if="!mobileMenuOpen" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Voile tactile de fermeture quand le menu mobile est ouvert -->
    <div
      v-if="mobileMenuOpen"
      class="mobile-nav-backdrop"
      @click="mobileMenuOpen = false"
    ></div>

    <!-- ========================================================= -->
    <!-- CONTENU : PLEIN ÉCRAN SUR ACCUEIL / EXPLORER / QUIZ       -->
    <!-- ========================================================= -->
    <main :class="['viewport-main', { 'viewport-home-bleed': isHomePage }]">
      <router-view />
    </main>

    <!-- ========================================================= -->
    <!-- FOOTER ÉPURÉ                                              -->
    <!-- ========================================================= -->
    <footer class="arch-footer" role="contentinfo">
      <div class="arch-footer-grid">
        <div class="footer-brand-col">
          <div class="brand-mark">
            <div class="brand-icon-box" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <span class="brand-name">GeoLearn</span>
          </div>
          <p class="footer-mission">
            {{ t('footer.desc') }}
          </p>
          <a href="mailto:geolearn-webapp@gmail.com" class="footer-email font-mono">
            geolearn-webapp@gmail.com
          </a>
        </div>

        <div class="footer-nav-col">
          <h4 class="footer-heading">{{ t('footer.nav_title') }}</h4>
          <ul class="footer-list">
            <li><router-link to="/">{{ t('nav.home') }}</router-link></li>
            <li><router-link to="/explorer">{{ t('nav.explore') }}</router-link></li>
            <li><router-link to="/quiz">{{ t('nav.quiz') }}</router-link></li>
            <li><router-link to="/geoguessr">{{ t('nav.geoguessr') }}</router-link></li>
            <li><router-link to="/duel">{{ locale === 'fr' ? 'Arène Duel 1v1' : '1v1 Duel Arena' }}</router-link></li>
            <li><router-link to="/scores">{{ t('nav.scores') }}</router-link></li>
            <li><router-link to="/collection">{{ t('nav.collection') }}</router-link></li>
          </ul>
        </div>

        <div class="footer-nav-col">
          <h4 class="footer-heading">{{ t('footer.community_title') }}</h4>
          <ul class="footer-list">
            <li><router-link to="/classement" class="footer-accent-link">{{ t('nav.leaderboard') }}</router-link></li>
            <li><router-link :to="{ path: '/quiz', query: { mode: 'mystery' } }">{{ locale === 'fr' ? 'Pays Mystère (Worldle)' : 'Mystery Country (Worldle)' }}</router-link></li>
            <li><router-link :to="{ path: '/quiz', query: { mode: 'flash60' } }">{{ locale === 'fr' ? 'Sprint 60 Secondes' : '60-Second Sprint' }}</router-link></li>
            <li><router-link :to="{ path: '/quiz', query: { mode: 'custom-builder' } }">{{ locale === 'fr' ? 'Créateur de Défis' : 'Challenge Builder' }}</router-link></li>
            <li><router-link to="/feedback">{{ t('footer.feedback_link') }}</router-link></li>
            <li><router-link to="/a-propos">{{ t('footer.about_link') }}</router-link></li>
            <li v-if="isAdmin">
              <router-link to="/admin" class="footer-admin-link">{{ t('footer.admin_link') }}</router-link>
            </li>
          </ul>
        </div>

        <div class="footer-nav-col">
          <h4 class="footer-heading">{{ t('footer.legal_title') }}</h4>
          <ul class="footer-list">
            <li><router-link to="/confidentialite">{{ t('footer.privacy_link') }}</router-link></li>
            <li><router-link to="/a-propos#contact">{{ t('footer.contact_link') }}</router-link></li>
            <li><router-link to="/profil">{{ t('profil.title') }}</router-link></li>
          </ul>
        </div>
      </div>

      <div class="arch-footer-bar">
        <div class="arch-footer-bar-inner">
          <p class="font-mono text-xs">© {{ new Date().getFullYear() }} GeoLearn (geolearn.fun). {{ t('footer.rights') }}</p>
          <button type="button" class="footer-locale-switch font-mono" @click="toggleLanguage">
            {{ locale === 'fr' ? 'FRANÇAIS (FR)' : 'ENGLISH (EN)' }}
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const route = useRoute();

const mobileMenuOpen = ref(false);
const currentUser = ref(null);
const isDarkMode = ref(true);

const isHomePage = computed(() => ['/', '/explorer', '/quiz', '/geoguessr', '/duel'].includes(route.path));

// Ferme automatiquement le menu mobile dès qu'on change de page
watch(
  () => route.fullPath,
  () => {
    mobileMenuOpen.value = false;
  }
);

const ADMIN_EMAILS = [
  'lohan.dtr@gmail.com',
  'lohan.dtr.muscu@gmail.com',
  'lohan.demeulemester@efrei.net'
];

const isAdmin = computed(() => {
  if (!currentUser.value || !currentUser.value.email) return false;
  return ADMIN_EMAILS.includes(currentUser.value.email.toLowerCase());
});

const displayNavUser = computed(() => {
  if (!currentUser.value) return t('nav.login');
  return (
    currentUser.value.name ||
    currentUser.value.username ||
    currentUser.value.pseudo ||
    (currentUser.value.user && (currentUser.value.user.name || currentUser.value.user.username)) ||
    t('nav.login')
  );
});

const userInitials = computed(() => {
  const name = displayNavUser.value || 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
});

const loadUserFromStorage = () => {
  const saved = localStorage.getItem('geolearn_user');
  if (saved) {
    try {
      currentUser.value = JSON.parse(saved);
    } catch (e) {
      currentUser.value = null;
    }
  } else {
    currentUser.value = null;
  }
};

const toggleLanguage = () => {
  locale.value = locale.value === 'fr' ? 'en' : 'fr';
  localStorage.setItem('geolearn_lang', locale.value);
};

const applyThemeClasses = (dark) => {
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.classList.toggle('dark-mode', dark);
  document.body.classList.toggle('dark', dark);
  document.body.classList.toggle('dark-mode', dark);
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('geolearn_theme', isDarkMode.value ? 'dark' : 'light');
  applyThemeClasses(isDarkMode.value);
};

onMounted(() => {
  const savedLang = localStorage.getItem('geolearn_lang');
  if (savedLang) {
    locale.value = savedLang;
  }

  const savedTheme = localStorage.getItem('geolearn_theme');
  if (savedTheme === 'light') {
    isDarkMode.value = false;
    applyThemeClasses(false);
  } else {
    isDarkMode.value = true;
    applyThemeClasses(true);
  }

  loadUserFromStorage();
  window.addEventListener('auth-change', loadUserFromStorage);
});

onUnmounted(() => {
  window.removeEventListener('auth-change', loadUserFromStorage);
});
</script>

<style>
:root {
  --bg-main: #f4f6f9;
  --bg-elevated: #ffffff;
  --bg-subtle: #e9eef5;
  --bg-nav: rgba(244, 246, 249, 0.85);
  --card-bg: #ffffff;
  --card-hover: #f1f5f9;
  --text-main: #0b1120;
  --text-secondary: #334155;
  --text-muted: #64748b;
  --border-color: rgba(15, 23, 42, 0.08);
  --border-strong: rgba(15, 23, 42, 0.16);
  --accent-primary: #0284c7;
  --accent-bright: #0ea5e9;
  --accent-emerald: #10b981;
  --accent-rose: #e11d48;
  --input-bg: #f8fafc;
  --shadow-sm: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
  --shadow-lg: 0 24px 48px -12px rgba(15, 23, 42, 0.18);
}

body.dark-mode,
body.dark,
.dark-mode {
  --bg-main: #04070f;
  --bg-elevated: #090e1a;
  --bg-subtle: #101829;
  --bg-nav: rgba(4, 7, 15, 0.85);
  --card-bg: #090e1a;
  --card-hover: #131c2e;
  --text-main: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #64748b;
  --border-color: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.18);
  --accent-primary: #0ea5e9;
  --accent-bright: #38bdf8;
  --accent-emerald: #10b981;
  --accent-rose: #fb7185;
  --input-bg: #060a14;
  --shadow-sm: 0 4px 24px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 28px 60px -12px rgba(0, 0, 0, 0.85);
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg-main);
  color: var(--text-main);
  line-height: 1.5;
  margin: 0;
  overflow-x: hidden;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.font-mono {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-variant-numeric: tabular-nums;
}

* {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.25) transparent;
}
*::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
*::-webkit-scrollbar-track {
  background: transparent;
}
*::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.25);
  border-radius: 9999px;
}

body.dark-mode .auth-card,
body.dark-mode .profile-card,
body.dark-mode .country-card,
body.dark-mode .quiz-card,
body.dark-mode .mode-select-card,
body.dark-mode .score-card,
body.dark-mode .stat-card,
body.dark-mode .history-card,
body.dark-mode .flashcard-inner,
body.dark-mode .card {
  background-color: var(--card-bg) !important;
  border-color: var(--border-color) !important;
  color: var(--text-main) !important;
}

body.dark-mode input,
body.dark-mode select,
body.dark-mode textarea {
  background-color: var(--input-bg) !important;
  border-color: var(--border-color) !important;
  color: var(--text-main) !important;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.viewport-main {
  flex: 1;
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 2.25rem 1.75rem 4rem;
}

.viewport-home-bleed {
  max-width: 100% !important;
  width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}

/* ========================================================= */
/* BARRE DE NAVIGATION (SANS OVERFLOW CLIPPING SUR LE MENU)  */
/* ========================================================= */
.top-nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  background: var(--bg-nav);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  overflow: visible !important;
}

.top-nav-inner {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0.65rem 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  box-sizing: border-box;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
  color: var(--text-main);
  flex-shrink: 0;
}

.brand-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.18), rgba(16, 185, 129, 0.12));
  border: 1px solid rgba(56, 189, 248, 0.35);
  color: var(--accent-bright);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}

.brand-mark:hover .brand-icon-box {
  transform: rotate(-8deg) scale(1.06);
}

.brand-text-group {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--text-main);
}

.brand-tag {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  white-space: nowrap;
  margin-top: 2px;
}

.primary-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  padding: 0.25rem;
  border-radius: 9999px;
  background: rgba(148, 163, 184, 0.07);
  border: 1px solid var(--border-color);
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.42rem 0.78rem;
  border-radius: 9999px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}

.nav-svg {
  width: 15px;
  height: 15px;
  opacity: 0.8;
  flex-shrink: 0;
}

.nav-link:hover {
  color: var(--text-main);
  background: rgba(148, 163, 184, 0.1);
}

.nav-link.router-link-exact-active {
  color: var(--text-main);
  background: var(--card-bg);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
}

.nav-link.router-link-exact-active .nav-svg {
  color: var(--accent-bright);
  opacity: 1;
}

.nav-link-duel {
  color: var(--accent-rose);
}

.nav-link-duel.router-link-exact-active {
  background: rgba(244, 63, 94, 0.14);
  color: var(--accent-rose);
}

.nav-link-admin {
  color: #f59e0b;
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.control-pill {
  height: 36px;
  min-width: 36px;
  padding: 0 0.65rem;
  border-radius: 9999px;
  background: rgba(148, 163, 184, 0.08);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.74rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.user-cta {
  height: 36px;
  padding: 0.25rem 1rem 0.25rem 0.4rem;
  border-radius: 9999px;
  background: var(--text-main);
  color: var(--bg-main) !important;
  font-size: 0.82rem;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  flex-shrink: 0;
  max-width: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.user-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.user-initials {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5e9, #10b981);
  color: #ffffff;
  font-size: 0.68rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-cta-label {
  display: inline-block;
  white-space: nowrap;
}

.mobile-toggle-btn {
  display: none;
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  background: rgba(148, 163, 184, 0.12);
  border: 1px solid var(--border-strong);
  color: var(--text-main);
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.mobile-nav-backdrop {
  position: fixed;
  inset: 0;
  z-index: 990;
  background: rgba(2, 6, 23, 0.55);
  backdrop-filter: blur(4px);
}

/* ========================================================= */
/* FOOTER                                                    */
/* ========================================================= */
.arch-footer {
  margin-top: auto;
  background: #03050b;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  color: #94a3b8;
}

.arch-footer-grid {
  max-width: 1320px;
  margin: 0 auto;
  padding: 3.5rem 2rem 2.5rem;
  display: grid;
  grid-template-columns: 1.6fr 1fr 1.2fr 1fr;
  gap: 2.5rem;
}

.arch-footer .brand-name {
  color: #f8fafc;
}

.footer-mission {
  font-size: 0.85rem;
  line-height: 1.6;
  color: #64748b;
  margin: 0.9rem 0 1.1rem;
  max-width: 340px;
}

.footer-email {
  display: inline-block;
  font-size: 0.78rem;
  color: #38bdf8;
  text-decoration: none;
  padding: 0.4rem 0.8rem;
  border-radius: 9999px;
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.2);
}

.footer-heading {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #f1f5f9;
  margin: 0 0 1rem;
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.footer-list a {
  color: #64748b;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.15s ease;
}

.footer-list a:hover {
  color: #f8fafc;
}

.footer-accent-link {
  color: #38bdf8 !important;
  font-weight: 600;
}

.footer-admin-link {
  color: #fbbf24 !important;
  font-weight: 600;
}

.arch-footer-bar {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: #020307;
}

.arch-footer-bar-inner {
  max-width: 1320px;
  margin: 0 auto;
  padding: 1.1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #475569;
}

.footer-locale-switch {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.72rem;
  cursor: pointer;
}

/* ========================================================= */
/* RESPONSIVE MOBILE & TABLETTE (MENU FIXE GARANTI VISIBLE)  */
/* ========================================================= */
@media (max-width: 1220px) {
  .mobile-toggle-btn {
    display: inline-flex;
  }

  .primary-nav {
    display: none;
    position: fixed;
    top: 58px;
    left: 0.75rem;
    right: 0.75rem;
    z-index: 9999;
    border-radius: 1.5rem;
    background: var(--card-bg);
    border: 1px solid var(--border-strong);
    box-shadow: 0 28px 60px rgba(0, 0, 0, 0.85);
    flex-direction: column;
    align-items: stretch;
    padding: 0.85rem;
    gap: 0.35rem;
    max-height: calc(100vh - 80px);
    overflow-y: auto;
  }

  .primary-nav.is-open {
    display: flex !important;
  }

  .nav-link {
    padding: 0.75rem 1rem;
    border-radius: 0.9rem;
    font-size: 0.92rem;
  }
}

@media (max-width: 900px) {
  .arch-footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  html,
  body,
  .app-shell {
    max-width: 100vw !important;
    overflow-x: hidden !important;
  }

  .top-nav-inner {
    padding: 0.55rem 0.9rem;
    gap: 0.5rem;
  }

  /* Garde uniquement le logo sur mobile */
  .top-nav .brand-text-group {
    display: none !important;
  }

  /* Garde uniquement le badge initiales/avatar sur mobile */
  .user-cta-label {
    display: none !important;
  }

  .user-cta {
    width: 36px;
    height: 36px;
    padding: 0 !important;
    border-radius: 50%;
    justify-content: center;
  }

  .nav-controls {
    gap: 0.4rem;
  }

  .viewport-main:not(.viewport-home-bleed) {
    padding: 1.25rem 0.85rem 2.5rem !important;
  }

  .arch-footer-grid {
    grid-template-columns: 1fr;
    padding: 2.5rem 1.25rem;
  }

  .arch-footer-bar-inner {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
}
</style>