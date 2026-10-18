<template>
  <div class="app-layout">
    <!-- NAVBAR -->
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
          <router-link to="/progression" class="nav-item" @click="mobileMenuOpen = false">
            {{ t ? t('nav.progress', 'Progression') : 'Progression' }}
          </router-link>

          <router-link
            v-if="isAdmin"
            to="/admin"
            class="nav-item admin-badge"
            @click="mobileMenuOpen = false"
          >
            Admin
          </router-link>
        </nav>

        <div class="nav-actions">
          <button class="lang-switch" @click="toggleLanguage">
            {{ locale === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN' }}
          </button>

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

    <!-- CONTENU PRINCIPAL (Centré et aéré comme avant) -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- FOOTER (Sans emojis) -->
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
            <li><router-link to="/progression">{{ locale === 'fr' ? 'Ma Progression' : 'My Progress' }}</router-link></li>
            <li><router-link to="/profil">{{ locale === 'fr' ? 'Mon Compte' : 'My Account' }}</router-link></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>{{ locale === 'fr' ? 'Communauté' : 'Community' }}</h4>
          <ul class="footer-links">
            <li>
              <router-link to="/feedback" class="highlight-link">
                {{ locale === 'fr' ? 'Suggérer une idée / Signaler un bug' : 'Suggest an idea / Report a bug' }}
              </router-link>
            </li>
            <li>
              <router-link to="/a-propos">
                {{ locale === 'fr' ? 'Qui sommes-nous ?' : 'About Us' }}
              </router-link>
            </li>
            <li v-if="isAdmin">
              <router-link to="/admin" class="admin-footer-link">
                {{ locale === 'fr' ? 'Panneau Administrateur' : 'Admin Dashboard' }}
              </router-link>
            </li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>{{ locale === 'fr' ? 'Légal & RGPD' : 'Legal & Privacy' }}</h4>
          <ul class="footer-links">
            <li>
              <router-link to="/confidentialite">
                {{ locale === 'fr' ? 'Politique de confidentialité (RGPD)' : 'Privacy Policy (GDPR)' }}
              </router-link>
            </li>
            <li>
              <router-link to="/a-propos#contact">
                {{ locale === 'fr' ? 'Nous contacter' : 'Contact Us' }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p>© {{ new Date().getFullYear() }} GeoLearn (geolearn.fun). {{ locale === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.' }}</p>
          <div class="footer-bottom-right">
            <button class="footer-lang-btn" @click="toggleLanguage">
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

const ADMIN_EMAILS = [
  'lohan.dtr@gmail.com',
  'lohan.demeulemester@efrei.net'
];

const isAdmin = computed(() => {
  if (!currentUser.value || !currentUser.value.email) return false;
  return ADMIN_EMAILS.includes(currentUser.value.email.toLowerCase());
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

onMounted(() => {
  const savedLang = localStorage.getItem('geolearn_lang');
  if (savedLang) {
    locale.value = savedLang;
  }
  loadUserFromStorage();
  window.addEventListener('auth-change', loadUserFromStorage);
});

onUnmounted(() => {
  window.removeEventListener('auth-change', loadUserFromStorage);
});
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f8fafc;
  color: #0f172a;
  line-height: 1.5;
}

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.navbar {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
  width: 100%;
}

.navbar-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.85rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  text-decoration: none;
  font-size: 1.35rem;
  font-weight: 800;
  color: #1e293b;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-item {
  text-decoration: none;
  color: #475569;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.5rem 0.9rem;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.nav-item:hover {
  color: #2563eb;
  background: #f1f5f9;
}

.nav-item.router-link-exact-active {
  color: #2563eb;
  background: #eff6ff;
}

.admin-badge {
  background: #fef3c7;
  color: #d97706 !important;
  border: 1px solid #fde68a;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.lang-switch {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 0.45rem 0.75rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;
}

.lang-switch:hover {
  background: #e2e8f0;
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  background: #0f172a;
  color: #ffffff;
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.profile-btn:hover {
  background: #1e293b;
}

.nav-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #334155;
}

.site-footer {
  background: #0f172a;
  color: #cbd5e1;
  margin-top: 4rem;
  border-top: 1px solid #1e293b;
  width: 100%;
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 3.5rem 1.5rem 2.5rem;
  display: grid;
  grid-template-columns: 1.6fr 1fr 1.2fr 1fr;
  gap: 2.5rem;
}

.footer-logo {
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 0.8rem;
  color: #ffffff;
}

.footer-desc {
  font-size: 0.9rem;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 1.2rem;
}

.footer-mail {
  display: inline-block;
  color: #38bdf8;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.92rem;
  background: rgba(56, 189, 248, 0.1);
  padding: 0.45rem 0.85rem;
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
  background: #090e1a;
}

.footer-bottom-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
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
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.82rem;
  cursor: pointer;
}

.footer-lang-btn:hover {
  color: #ffffff;
  border-color: #475569;
}

@media (max-width: 900px) {
  .footer-container {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .mobile-menu-btn {
    display: block;
  }
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #ffffff;
    flex-direction: column;
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 10px 15px rgba(0,0,0,0.05);
  }
  .nav-links.nav-open {
    display: flex;
  }
  .footer-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .footer-bottom-content {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
}
</style>