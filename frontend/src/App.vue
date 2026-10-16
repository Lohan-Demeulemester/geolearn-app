<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 text-gray-900 dark:text-gray-100 font-sans">
    
    <!-- BARRE DE NAVIGATION GLOBALE (En haut) -->
    <nav class="relative bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-8 py-3 md:py-5 flex justify-between items-center transition-colors duration-500 sticky top-0 z-50 shadow-sm">
      
      <!-- Côté gauche : Menu Mobile + Logo -->
      <div class="flex items-center gap-3 z-20">
        <!-- Bouton Menu Hamburger (Visible uniquement sur mobile) -->
        <button @click.stop="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden p-1 text-gray-600 dark:text-gray-300 hover:text-brandBlue transition-colors">
          <i :class="isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'" class="text-xl w-6"></i>
        </button>
        
        <router-link to="/" class="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity cursor-pointer">
          <span class="text-2xl md:text-3xl">🌍</span>
          <h1 class="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight transition-colors duration-500">
            Geo<span class="text-brandBlue">Learn</span>
          </h1>
        </router-link>
      </div>

      <!-- Centre : Liens de navigation (Cachés sur mobile, centrés sur PC) -->
      <div class="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-16 items-center font-medium text-gray-600 dark:text-gray-300">
        <router-link to="/" class="hover:text-brandBlue transition-colors" active-class="text-brandBlue font-bold">{{ $t('nav.home') }}</router-link>
        <router-link to="/explorer" class="hover:text-brandBlue transition-colors" active-class="text-brandBlue font-bold">{{ $t('nav.explore') }}</router-link>
        <router-link to="/quiz" class="hover:text-brandBlue transition-colors" active-class="text-brandBlue font-bold">{{ $t('nav.quiz') }}</router-link>
        <router-link to="/scores" class="hover:text-brandBlue transition-colors" active-class="text-brandBlue font-bold">{{ $t('nav.scores') }}</router-link>
      </div>

      <!-- Côté droit : Boutons et Profil -->
      <div class="flex items-center justify-end gap-2 md:gap-5 z-20">
        
        <!-- Bouton Changement de Langue -->
        <div class="relative">
          <button 
            @click.stop="showLangMenu = !showLangMenu" 
            class="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition shadow-sm"
          >
            {{ locale === 'fr' ? '🇫🇷' : '🇬🇧' }} <span class="hidden md:inline">{{ locale === 'fr' ? 'FR' : 'EN' }}</span>
            <i class="fas fa-chevron-down text-[10px] md:text-xs"></i>
          </button>
          
          <div v-if="showLangMenu" class="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
            <button @click="setLanguage('fr')" class="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              🇫🇷 Français
            </button>
            <button @click="setLanguage('en')" class="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition border-t border-gray-100 dark:border-gray-700">
              🇬🇧 English
            </button>
          </div>
        </div>

        <!-- Bouton Mode Sombre -->
        <button 
          @click="toggleDarkMode" 
          class="p-2 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition shadow-sm"
        >
          <i :class="isDarkMode ? 'fas fa-moon' : 'fas fa-sun'" class="text-sm md:text-base"></i>
        </button>

        <!-- Bouton Profil ou Connexion -->
        <router-link 
          v-if="currentUser" 
          to="/profil" 
          class="flex items-center gap-2 md:gap-3 cursor-pointer bg-white dark:bg-gray-800 p-1 md:p-1.5 pr-1 md:pr-4 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all ml-1"
        >
          <img :src="currentUser.avatar" alt="Avatar" class="w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-200 dark:border-gray-600">
          <span class="hidden md:inline font-bold text-sm text-gray-700 dark:text-gray-200">{{ currentUser.name }}</span>
        </router-link>
        
        <router-link 
          v-else 
          to="/profil" 
          class="bg-brandBlue text-white px-3 md:px-6 py-1.5 md:py-2 rounded-full font-medium hover:bg-blue-700 transition shadow-sm flex items-center gap-2 ml-1 text-xs md:text-base"
        >
          <i class="fas fa-user-circle"></i> <span class="hidden md:inline">{{ $t('nav.login') }}</span>
        </router-link>
        
      </div>

      <!-- Menu Déroulant Mobile (Apparaît quand on clique sur le Hamburger) -->
      <transition name="slide-down">
        <div v-if="isMobileMenuOpen" class="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-xl flex flex-col py-4 px-6 gap-4 z-10">
          <router-link @click="isMobileMenuOpen = false" to="/" class="text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-brandBlue" active-class="text-brandBlue font-bold">{{ $t('nav.home') }}</router-link>
          <router-link @click="isMobileMenuOpen = false" to="/explorer" class="text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-brandBlue" active-class="text-brandBlue font-bold">{{ $t('nav.explore') }}</router-link>
          <router-link @click="isMobileMenuOpen = false" to="/quiz" class="text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-brandBlue" active-class="text-brandBlue font-bold">{{ $t('nav.quiz') }}</router-link>
          <router-link @click="isMobileMenuOpen = false" to="/scores" class="text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-brandBlue" active-class="text-brandBlue font-bold">{{ $t('nav.scores') }}</router-link>
        </div>
      </transition>
    </nav>

    <!-- ZONE DE CONTENU DYNAMIQUE -->
    <!-- On écoute le clic n'importe où pour refermer les menus déroulants -->
    <main class="p-4 md:p-8" @click="closeMenus">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

// --- GESTION DES MENUS ET DE LA LANGUE ---
const { locale } = useI18n();
const showLangMenu = ref(false);
const isMobileMenuOpen = ref(false);

const setLanguage = (lang) => {
  locale.value = lang;
  localStorage.setItem('geolearn_lang', lang);
  showLangMenu.value = false;
};

const closeMenus = () => {
  showLangMenu.value = false;
  isMobileMenuOpen.value = false;
};

// --- GESTION DU MODE SOMBRE ---
const isDarkMode = ref(localStorage.getItem('geolearn_theme') === 'dark');

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('geolearn_theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('geolearn_theme', 'light');
  }
};

// --- GESTION DE L'UTILISATEUR CONNECTÉ ---
const currentUser = ref(null);

const updateAuth = () => {
  const savedUser = localStorage.getItem('geolearn_user');
  if (savedUser) {
    currentUser.value = JSON.parse(savedUser);
  } else {
    currentUser.value = null;
  }
};

onMounted(() => {
  updateAuth();
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  window.addEventListener('auth-change', updateAuth);
});

onUnmounted(() => {
  window.removeEventListener('auth-change', updateAuth);
});
</script>

<style>
/* Transition classique entre les pages */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Transition du menu mobile (Glissement vers le bas) */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-in-out;
  transform-origin: top;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>