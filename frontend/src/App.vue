<template>
  <div :class="['app-layout', { 'dark-mode': isDarkMode, 'dark': isDarkMode }]">
    <!-- ========================================== -->
    <!-- BARRE DE NAVIGATION (PLEINE LARGEUR)       -->
    <!-- ========================================== -->
    <header class="navbar">
      <div class="navbar-container">
        <!-- GAUCHE : Logo -->
        <router-link to="/" class="brand-logo" @click="mobileMenuOpen = false">
          <!-- Logo GeoLearn Vectoriel -->
          <svg 
            class="logo-svg" 
            width="34" 
            height="34" 
            viewBox="0 0 64 64" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="geolearn-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#2563eb" />
                <stop offset="100%" stop-color="#0ea5e9" />
              </linearGradient>
            </defs>
            
            <!-- Tracé continu : Épingle de carte + Lettre G -->
            <path 
              d="M49.5 20C46.2 13.5 39.6 9 32 9C21.5 9 13 17.5 13 28C13 40.2 32 56 32 56C32 56 51 40.2 51 28H34" 
              stroke="url(#geolearn-grad)" 
              stroke-width="5.2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            />
            
            <!-- Chapeau de diplômé (Mortier) au centre -->
            <path 
              d="M32 20L21 25L32 30L43 25L32 20Z" 
              fill="url(#geolearn-grad)" 
            />
            <path 
              d="M25.5 28.2V33.5C25.5 35.5 28.4 37.2 32 37.2C35.6 37.2 38.5 35.5 38.5 33.5V28.2" 
              stroke="url(#geolearn-grad)" 
              stroke-width="3.2" 
              stroke-linecap="round"
            />
            <path 
              d="M41.5 26V33.5" 
              stroke="url(#geolearn-grad)" 
              stroke-width="2.5" 
              stroke-linecap="round"
            />
          </svg>
          <span class="logo-text">GeoLearn</span>
        </router-link>

        <!-- CENTRE : Liens de navigation complets -->
        <nav :class="['nav-links', { 'nav-open': mobileMenuOpen }]">
          <router-link to="/" class="nav-item" @click="mobileMenuOpen = false">
            {{ t('nav.home') }}
          </router-link>
          <router-link to="/explorer" class="nav-item" @click="mobileMenuOpen = false">
            {{ t('nav.explore') }}
          </router-link>
          <router-link to="/quiz" class="nav-item" @click="mobileMenuOpen = false">
            {{ t('nav.quiz') }}
          </router-link>
          <router-link to="/geoguessr" class="nav-item" @click="mobileMenuOpen = false">
            {{ t('nav.geoguessr') }}
          </router-link>
          <router-link to="/duel" class="nav-item duel-nav-item" @click="mobileMenuOpen = false">
            {{ locale === 'fr' ? 'Duel 1v1' : '1v1 Duel' }}
          </router-link>
          <router-link to="/scores" class="nav-item" @click="mobileMenuOpen = false">
            {{ t('nav.scores') }}
          </router-link>
          <router-link to="/collection" class="nav-item" @click="mobileMenuOpen = false">
            {{ t('nav.collection') }}
          </router-link>
          <router-link to="/classement" class="nav-item" @click="mobileMenuOpen = false">
            {{ t('nav.leaderboard') }}
          </router-link>

          <!-- Bouton Admin visible uniquement par toi -->
          <router-link
            v-if="isAdmin"
            to="/admin"
            class="nav-item admin-badge"
            @click="mobileMenuOpen = false"
          >
            Admin
          </router-link>
        </nav>

        <!-- DROITE : Thème + Langue + Profil -->
        <div class="nav-actions">
          <!-- Bouton Mode Sombre / Clair -->
          <button
            type="button"
            class="action-btn theme-btn"
            @click="toggleDarkMode"
            :title="isDarkMode ? (locale === 'fr' ? 'Passer en mode clair' : 'Switch to light mode') : (locale === 'fr' ? 'Passer en mode sombre' : 'Switch to dark mode')"
          >
            <svg v-if="!isDarkMode" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>

          <!-- Sélecteur de langue -->
          <button
            type="button"
            class="action-btn lang-btn"
            @click="toggleLanguage"
            :title="locale === 'fr' ? 'Switch to English' : 'Passer en Français'"
          >
            <span class="lang-code">{{ locale === 'fr' ? 'FR' : 'EN' }}</span>
          </button>

          <!-- Bouton Profil / Connexion -->
          <router-link to="/profil" class="profile-btn" @click="mobileMenuOpen = false">
            <img v-if="currentUser && currentUser.avatar" :src="currentUser.avatar" alt="Avatar" class="nav-avatar" />
            <span class="profile-name">
              {{ displayNavUser }}
            </span>
          </router-link>

          <!-- Bouton Burger (Accessible sur mobile même non connecté) -->
          <button type="button" class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Menu">
            <span v-if="!mobileMenuOpen">☰</span>
            <span v-else>✕</span>
          </button>
        </div>
      </div>
    </header>

    <!-- ========================================== -->
    <!-- CONTENU DES PAGES (CENTRÉ & AÉRÉ)          -->
    <!-- ========================================== -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- ========================================== -->
    <!-- FOOTER GLOBAL (SANS EMOJIS)                -->
    <!-- ========================================== -->
    <footer class="site-footer">
      <div class="footer-container">
        <div class="footer-col brand-col">
          <div class="footer-logo">
            <span class="logo-text">GeoLearn</span>
          </div>
          <p class="footer-desc">
            {{ t('footer.desc') }}
          </p>
          <a href="mailto:geolearn-webapp@gmail.com" class="footer-mail">
            geolearn-webapp@gmail.com
          </a>
        </div>

        <div class="footer-col">
          <h4>{{ t('footer.nav_title') }}</h4>
          <ul class="footer-links">
            <li><router-link to="/">{{ t('nav.home') }}</router-link></li>
            <li><router-link to="/explorer">{{ t('nav.explore') }}</router-link></li>
            <li><router-link to="/quiz">{{ t('nav.quiz') }}</router-link></li>
            <li><router-link to="/geoguessr">{{ t('nav.geoguessr') }}</router-link></li>
            <li><router-link :to="{ path: '/quiz', query: { mode: 'flash60' } }">{{ locale === 'fr' ? 'Sprint QCM 60 secondes' : '60s Flash Quiz Sprint' }}</router-link></li>
            <li><router-link to="/scores">{{ t('nav.scores') }}</router-link></li>
            <li><router-link to="/collection">{{ t('nav.collection') }}</router-link></li>
            <li><router-link to="/profil">{{ t('profil.title') }}</router-link></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>{{ t('footer.community_title') }}</h4>
          <ul class="footer-links">
            <li><router-link to="/classement" class="highlight-link">{{ t('nav.leaderboard') }}</router-link></li>
            <li><router-link :to="{ path: '/quiz', query: { mode: 'mystery' } }">{{ locale === 'fr' ? 'Le Pays Mystère (Worldle)' : 'Mystery Country (Worldle)' }}</router-link></li>
            <li><router-link to="/duel">{{ locale === 'fr' ? 'Duel Face-à-Face (1v1)' : 'Head-to-Head Duel (1v1)' }}</router-link></li>
            <li><router-link :to="{ path: '/quiz', query: { mode: 'custom-builder' } }">{{ locale === 'fr' ? 'Créateur de Défis' : 'Challenge Builder' }}</router-link></li>
            <li>
              <router-link to="/feedback">
                {{ t('footer.feedback_link') }}
              </router-link>
            </li>
            <li>
              <router-link to="/a-propos">
                {{ t('footer.about_link') }}
              </router-link>
            </li>
            <li v-if="isAdmin">
              <router-link to="/admin" class="admin-footer-link">
                {{ t('footer.admin_link') }}
              </router-link>
            </li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>{{ t('footer.legal_title') }}</h4>
          <ul class="footer-links">
            <li>
              <router-link to="/confidentialite">
                {{ t('footer.privacy_link') }}
              </router-link>
            </li>
            <li>
              <router-link to="/a-propos#contact">
                {{ t('footer.contact_link') }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p>© {{ new Date().getFullYear() }} GeoLearn (geolearn.fun). {{ t('footer.rights') }}</p>
          <div class="footer-bottom-right">
            <button type="button" class="footer-lang-btn" @click="toggleLanguage">
              {{ locale === 'fr' ? 'Français (FR)' : 'English (EN)' }}
            </button>
          </div>
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
  if (savedTheme === 'dark') {
    isDarkMode.value = true;
    applyThemeClasses(true);
  } else {
    isDarkMode.value = false;
    applyThemeClasses(false);
  }

  loadUserFromStorage();
  window.addEventListener('auth-change', loadUserFromStorage);
});

onUnmounted(() => {
  window.removeEventListener('auth-change', loadUserFromStorage);
});
</script>

<style>
/* ========================================== */
/* VARIABLES GLOBALES & MODE SOMBRE UNIVERSEL */
/* ========================================== */
:root {
  --bg-main: #f8fafc;
  --bg-nav: rgba(255, 255, 255, 0.92);
  --card-bg: #ffffff;
  --card-hover: #f1f5f9;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border-color: #e2e8f0;
  --input-bg: #f8fafc;
  --shadow-sm: 0 4px 12px rgba(15, 23, 42, 0.04);
  --shadow-lg: 0 20px 35px -5px rgba(15, 23, 42, 0.08);
}

body.dark-mode,
body.dark,
.dark-mode {
  --bg-main: #0b1120;
  --bg-nav: rgba(15, 23, 42, 0.92);
  --card-bg: #1e293b;
  --card-hover: #334155;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --border-color: #334155;
  --input-bg: #0f172a;
  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.25);
  --shadow-lg: 0 20px 35px -5px rgba(0, 0, 0, 0.45);
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg-main);
  color: var(--text-main);
  line-height: 1.5;
  transition: background-color 0.25s ease, color 0.25s ease;
}

body.dark-mode h1,
body.dark-mode h2,
body.dark-mode h3,
body.dark-mode h4,
body.dark-mode strong {
  color: var(--text-main);
}

body.dark-mode p,
body.dark-mode span:not(.logo-text):not(.brand-gradient):not(.stat-val):not(.mode-cta),
body.dark-mode label,
body.dark-mode small {
  color: inherit;
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

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ========================================== */
/* CONTENEUR CENTRAL AÉRÉ (TOUTES LES PAGES)  */
/* ========================================== */
.main-content {
  flex: 1;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 2rem 4rem;
}

/* ========================================== */
/* NAVBAR PLEINE LARGEUR                      */
/* ========================================== */
.navbar {
  background: var(--bg-nav);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  transition: background-color 0.25s ease, border-color 0.25s ease;
}

.navbar-container {
  width: 100%;
  max-width: 100%; 
  margin: 0 auto;
  padding: 0.9rem 2rem;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-self: start;
  gap: 0.6rem;
  text-decoration: none;
  font-size: 1.45rem;
  font-weight: 800;
}

.logo-text {
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links {
  display: flex;
  align-items: center;
  justify-self: center;
  gap: 0.35rem;
}

.nav-item {
  text-decoration: none;
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.92rem;
  padding: 0.5rem 0.95rem;
  border-radius: 10px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.nav-item:hover {
  color: #2563eb;
  background: var(--card-hover);
}

.nav-item.router-link-exact-active {
  color: #2563eb;
  background: rgba(37, 99, 235, 0.12);
}

.duel-nav-item {
  color: #e11d48;
  font-weight: 700;
}

body.dark-mode .duel-nav-item {
  color: #fb7185;
}

.duel-nav-item.router-link-exact-active {
  color: #e11d48 !important;
  background: rgba(225, 29, 72, 0.12) !important;
}

.admin-badge {
  background: rgba(245, 158, 11, 0.15);
  color: #d97706 !important;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.nav-actions {
  display: flex;
  justify-self: end;
  align-items: center;
  gap: 0.75rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  min-width: 42px;
  padding: 0 0.85rem;
  background: var(--card-bg);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: #2563eb;
  background: var(--card-hover);
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  height: 40px;
  text-decoration: none;
  background: #2563eb;
  color: #ffffff !important;
  padding: 0 1.1rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.profile-btn:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
}

body.dark-mode .profile-btn {
  background: #2563eb;
}

.nav-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

/* STRICTEMENT CACHÉ SUR PC */
.mobile-menu-btn {
  display: none !important;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  width: 40px;
  height: 40px;
  border-radius: 10px;
  font-size: 1.25rem;
  cursor: pointer;
}

/* ========================================== */
/* FOOTER GLOBAL                              */
/* ========================================== */
.site-footer {
  background: #090e1a;
  color: #cbd5e1;
  margin-top: auto;
  border-top: 1px solid #1e293b;
  width: 100%;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 3.5rem 2.5rem 2.5rem;
  display: grid;
  grid-template-columns: 1.8fr 1fr 1.2fr 1fr;
  gap: 2.5rem;
}

.footer-logo {
  font-size: 1.45rem;
  font-weight: 800;
  margin-bottom: 0.8rem;
}

.footer-desc {
  font-size: 0.9rem;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 1.2rem;
  max-width: 360px;
}

.footer-mail {
  display: inline-block;
  color: #38bdf8;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  background: rgba(56, 189, 248, 0.1);
  padding: 0.45rem 0.9rem;
  border-radius: 8px;
  border: 1px solid rgba(56, 189, 248, 0.2);
  transition: all 0.2s;
}

.footer-mail:hover {
  background: rgba(56, 189, 248, 0.2);
}

.footer-col h4 {
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1.1rem;
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.footer-links a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #ffffff;
}

.highlight-link {
  color: #60a5fa !important;
  font-weight: 600;
}

.admin-footer-link {
  color: #fbbf24 !important;
  font-weight: 600;
}

.footer-bottom {
  border-top: 1px solid #1e293b;
  background: #060911;
}

.footer-bottom-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.25rem 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #64748b;
}

.footer-lang-btn {
  background: #1e293b;
  color: #cbd5e1;
  border: 1px solid #334155;
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

.footer-lang-btn:hover {
  color: #ffffff;
  border-color: #475569;
}

/* ========================================== */
/* RESPONSIVE TABLETTE & MOBILE               */
/* ========================================== */
@media (max-width: 1080px) {
  .navbar-container {
    display: flex; 
    justify-content: space-between;
    padding: 0.75rem 1rem;
    gap: 0.3rem;
  }
  .nav-actions {
    gap: 0.4rem;
  }
  .profile-btn .profile-name {
    display: inline;
  }
  .profile-btn:has(.nav-avatar) .profile-name { display: none; }
  .profile-btn:has(.nav-avatar) { 
    padding: 0.35rem; 
    border-radius: 50%;
  }
  .profile-btn:not(:has(.nav-avatar)) {
    border-radius: 10px !important;
    padding: 0 0.85rem;
    height: 38px;
    font-size: 0.85rem;
  }
  .mobile-menu-btn {
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
  }
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--card-bg);
    flex-direction: column;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    box-shadow: var(--shadow-lg);
  }
  .nav-links.nav-open {
    display: flex;
  }
}

@media (max-width: 900px) {
  .footer-container {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 2rem 1.25rem;
  }
  .footer-container {
    grid-template-columns: 1fr;
    padding: 2.5rem 1.25rem;
    gap: 2rem;
  }
  .footer-bottom-content {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
}
</style>