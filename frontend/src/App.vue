<template>
  <div :class="['app-shell', { 'dark-mode': isDarkMode, 'dark': isDarkMode }]">
    <!-- ========================================================= -->
    <!-- TOP COMMAND NAVIGATION BAR                                -->
    <!-- ========================================================= -->
    <header class="top-nav" role="banner">
      <div class="top-nav-inner">
        <!-- Brand Identity -->
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
            <span class="brand-tag">ATLAS // 196</span>
          </div>
        </router-link>

        <!-- Primary Navigation Links -->
        <nav :class="['primary-nav', { 'is-open': mobileMenuOpen }]" aria-label="Main Navigation">
          <router-link to="/" class="nav-link" @click="mobileMenuOpen = false">
            <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>{{ t('nav.home') }}</span>
          </router-link>

          <router-link to="/explorer" class="nav-link" @click="mobileMenuOpen = false">
            <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" y1="3" x2="9" y2="18" />
              <line x1="15" y1="6" x2="15" y2="21" />
            </svg>
            <span>{{ t('nav.explore') }}</span>
          </router-link>

          <router-link to="/quiz" class="nav-link" @click="mobileMenuOpen = false">
            <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>{{ t('nav.quiz') }}</span>
          </router-link>

          <router-link to="/geoguessr" class="nav-link" @click="mobileMenuOpen = false">
            <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{{ t('nav.geoguessr') }}</span>
          </router-link>

          <router-link to="/duel" class="nav-link nav-link-duel" @click="mobileMenuOpen = false">
            <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
              <line x1="13" y1="19" x2="19" y2="13" />
              <line x1="16" y1="16" x2="20" y2="20" />
              <line x1="19" y1="21" x2="21" y2="19" />
              <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
              <line x1="5" y1="14" x2="9" y2="18" />
              <line x1="7" y1="17" x2="4" y2="20" />
              <line x1="3" y1="19" x2="5" y2="21" />
            </svg>
            <span>{{ locale === 'fr' ? 'Duel 1v1' : '1v1 Duel' }}</span>
          </router-link>

          <router-link to="/scores" class="nav-link" @click="mobileMenuOpen = false">
            <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <span>{{ t('nav.scores') }}</span>
          </router-link>

          <router-link to="/collection" class="nav-link" @click="mobileMenuOpen = false">
            <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
            <span>{{ t('nav.collection') }}</span>
          </router-link>

          <router-link to="/classement" class="nav-link" @click="mobileMenuOpen = false">
            <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
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
            <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Admin</span>
          </router-link>
        </nav>

        <!-- Right Controls: Theme, Locale, Profile, Mobile Trigger -->
        <div class="nav-controls">
          <button
            type="button"
            class="control-pill"
            @click="toggleDarkMode"
            :aria-label="isDarkMode ? (locale === 'fr' ? 'Activer le mode clair' : 'Switch to light mode') : (locale === 'fr' ? 'Activer le mode sombre' : 'Switch to dark mode')"
            :title="isDarkMode ? (locale === 'fr' ? 'Mode clair' : 'Light mode') : (locale === 'fr' ? 'Mode sombre' : 'Dark mode')"
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
            <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span class="user-cta-label">{{ displayNavUser }}</span>
          </router-link>

          <button
            type="button"
            class="mobile-toggle-btn"
            @click="mobileMenuOpen = !mobileMenuOpen"
            :aria-expanded="mobileMenuOpen"
            aria-label="Toggle navigation menu"
          >
            <svg v-if="!mobileMenuOpen" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- ========================================================= -->
    <!-- MAIN VIEWPORT                                             -->
    <!-- ========================================================= -->
    <main class="viewport-main">
      <router-view />
    </main>

    <!-- ========================================================= -->
    <!-- ARCHITECTURAL FOOTER                                      -->
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
          <div class="footer-telemetry">
            <span class="telemetry-dot"></span>
            <span class="font-mono text-xs">196 UN/ISO STATES INDEXED</span>
          </div>
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
            {{ locale === 'fr' ? 'LOCALE: FR_FR' : 'LOCALE: EN_US' }}
          </button>
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
const isDarkMode = ref(true);

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
/* ========================================================= */
/* DESIGN SYSTEM TOKENS: ORBITAL CARTOGRAPHY                 */
/* ========================================================= */
:root {
  --bg-main: #f6f8fa;
  --bg-elevated: #ffffff;
  --bg-subtle: #eef2f6;
  --bg-nav: rgba(246, 248, 250, 0.86);
  --card-bg: #ffffff;
  --card-hover: #f1f5f9;
  --text-main: #090d16;
  --text-secondary: #334155;
  --text-muted: #64748b;
  --border-color: #e2e8f0;
  --border-strong: #cbd5e1;
  --accent-primary: #0284c7;
  --accent-bright: #0ea5e9;
  --accent-emerald: #10b981;
  --accent-rose: #e11d48;
  --input-bg: #f8fafc;
  --shadow-sm: 0 1px 2px rgba(9, 13, 22, 0.04), 0 4px 12px rgba(9, 13, 22, 0.03);
  --shadow-lg: 0 20px 40px -12px rgba(9, 13, 22, 0.08);
}

body.dark-mode,
body.dark,
.dark-mode {
  --bg-main: #07090e;
  --bg-elevated: #0c1017;
  --bg-subtle: #111722;
  --bg-nav: rgba(7, 9, 14, 0.84);
  --card-bg: #0c1017;
  --card-hover: #131a26;
  --text-main: #f1f5f9;
  --text-secondary: #cbd5e1;
  --text-muted: #64748b;
  --border-color: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.16);
  --accent-primary: #0ea5e9;
  --accent-bright: #38bdf8;
  --accent-emerald: #10b981;
  --accent-rose: #f43f5e;
  --input-bg: #090c12;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.35);
  --shadow-lg: 0 24px 48px -12px rgba(0, 0, 0, 0.65);
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
  transition: background-color 0.2s ease, color 0.2s ease;
}

.font-mono {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-variant-numeric: tabular-nums;
}

/* Legacy view compatibility in Dark Mode */
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
  max-width: 1280px;
  margin: 0 auto;
  padding: 2.5rem 2rem 4rem;
}

/* ========================================================= */
/* COMMAND BAR NAVIGATION                                    */
/* ========================================================= */
.top-nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  background: var(--bg-nav);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-color);
}

.top-nav-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.75rem 2rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1.5rem;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  text-decoration: none;
  color: var(--text-main);
}

.brand-icon-box {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: rgba(14, 165, 233, 0.12);
  border: 1px solid rgba(14, 165, 233, 0.3);
  color: var(--accent-bright);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.brand-mark:hover .brand-icon-box {
  transform: scale(1.04);
  border-color: var(--accent-bright);
}

.brand-text-group {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.1;
  color: var(--text-main);
}

.brand-tag {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-top: 2px;
}

.primary-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.8rem;
  border-radius: 8px;
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--text-muted);
  text-decoration: none;
  white-space: nowrap;
  border: 1px solid transparent;
  transition: color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;
}

.nav-svg {
  width: 15px;
  height: 15px;
  opacity: 0.75;
  flex-shrink: 0;
}

.nav-link:hover {
  color: var(--text-main);
  background: var(--card-hover);
}

.nav-link.router-link-exact-active {
  color: var(--text-main);
  background: var(--bg-subtle);
  border-color: var(--border-color);
}

.nav-link.router-link-exact-active .nav-svg {
  color: var(--accent-bright);
  opacity: 1;
}

.nav-link-duel {
  color: var(--accent-rose);
}

.nav-link-duel.router-link-exact-active {
  background: rgba(244, 63, 94, 0.1);
  border-color: rgba(244, 63, 94, 0.28);
  color: var(--accent-rose);
}

.nav-link-admin {
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.25);
  background: rgba(245, 158, 11, 0.08);
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-pill {
  height: 36px;
  min-width: 36px;
  padding: 0 0.65rem;
  border-radius: 8px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.75rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease;
}

.control-pill:hover {
  border-color: var(--border-strong);
  color: var(--text-main);
}

.user-cta {
  height: 36px;
  padding: 0 0.9rem;
  border-radius: 8px;
  background: var(--text-main);
  color: var(--bg-main) !important;
  font-size: 0.82rem;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  white-space: nowrap;
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.user-cta:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

.user-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
}

.mobile-toggle-btn {
  display: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* ========================================================= */
/* ARCHITECTURAL FOOTER                                      */
/* ========================================================= */
.arch-footer {
  margin-top: auto;
  background: #05070b;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  color: #94a3b8;
}

.arch-footer-grid {
  max-width: 1280px;
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
  margin: 0.9rem 0;
  max-width: 340px;
}

.footer-telemetry {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #94a3b8;
  margin-bottom: 1rem;
}

.telemetry-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.footer-email {
  display: inline-block;
  font-size: 0.78rem;
  color: #38bdf8;
  text-decoration: none;
  padding: 0.35rem 0.7rem;
  border-radius: 6px;
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
  background: #030407;
}

.arch-footer-bar-inner {
  max-width: 1280px;
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
  padding: 0.3rem 0.65rem;
  border-radius: 6px;
  font-size: 0.72rem;
  cursor: pointer;
}

.footer-locale-switch:hover {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
}

/* ========================================================= */
/* RESPONSIVE BREAKPOINTS & MOBILE OVERFLOW GUARD            */
/* ========================================================= */
@media (max-width: 1120px) {
  .top-nav-inner {
    display: flex;
    justify-content: space-between;
    padding: 0.7rem 1.25rem;
  }

  .mobile-toggle-btn {
    display: inline-flex;
  }

  .primary-nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--card-bg);
    border-bottom: 1px solid var(--border-color);
    box-shadow: var(--shadow-lg);
    flex-direction: column;
    align-items: stretch;
    padding: 0.75rem 1rem 1rem;
    gap: 0.25rem;
  }

  .primary-nav.is-open {
    display: flex;
  }

  .nav-link {
    padding: 0.65rem 0.85rem;
    font-size: 0.92rem;
  }
}

@media (max-width: 900px) {
  .arch-footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  html,
  body,
  .app-shell {
    max-width: 100vw;
    overflow-x: clip;
  }

  input,
  select,
  textarea,
  button {
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
  }

  .viewport-main {
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