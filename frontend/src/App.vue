<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 text-gray-900 dark:text-gray-100 font-sans">
    
    <!-- BARRE DE NAVIGATION GLOBALE (En haut) -->
    <!-- BARRE DE NAVIGATION GLOBALE (En haut) -->
    <!-- BARRE DE NAVIGATION GLOBALE (En haut) -->
    <nav class="relative bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-5 flex justify-between items-center transition-colors duration-500 sticky top-0 z-50 shadow-sm">
      
      <!-- Côté gauche : Logo (Avec z-10 pour rester cliquable au-dessus du centre) -->
      <div class="flex items-center z-10">
        <router-link to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
          <span class="text-3xl">🌍</span>
          <h1 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight transition-colors duration-500">
            Geo<span class="text-brandBlue">Learn</span>
          </h1>
        </router-link>
      </div>

      <!-- Centre : Liens de navigation (Absolument centrés et très aérés avec gap-16) -->
      <div class="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-16 items-center font-medium text-gray-600 dark:text-gray-300">
        <router-link to="/" class="hover:text-brandBlue transition-colors" active-class="text-brandBlue font-bold">{{ $t('nav.home') }}</router-link>
        <router-link to="/explorer" class="hover:text-brandBlue transition-colors" active-class="text-brandBlue font-bold">{{ $t('nav.explore') }}</router-link>
        <router-link to="/quiz" class="hover:text-brandBlue transition-colors" active-class="text-brandBlue font-bold">{{ $t('nav.quiz') }}</router-link>
        <router-link to="/scores" class="hover:text-brandBlue transition-colors" active-class="text-brandBlue font-bold">{{ $t('nav.scores') }}</router-link>
      </div>

      <!-- Côté droit : Boutons et Profil (Avec z-10) -->
      <div class="flex items-center justify-end gap-5 z-10">
        
        <!-- Bouton Changement de Langue -->
        <div class="relative">
          <button 
            @click="showLangMenu = !showLangMenu" 
            class="flex items-center gap-2 px-3 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition shadow-sm"
          >
            {{ locale === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN' }}
            <i class="fas fa-chevron-down text-xs"></i>
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
          class="p-2 w-10 h-10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition shadow-sm"
        >
          <i :class="isDarkMode ? 'fas fa-moon' : 'fas fa-sun'"></i>
        </button>

        <!-- Bouton Profil ou Connexion -->
        <router-link 
          v-if="currentUser" 
          to="/profil" 
          class="flex items-center gap-3 cursor-pointer bg-white dark:bg-gray-800 p-1.5 pr-4 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all ml-2"
        >
          <img :src="currentUser.avatar" alt="Avatar" class="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600">
          <span class="font-bold text-sm text-gray-700 dark:text-gray-200">{{ currentUser.name }}</span>
        </router-link>
        
        <router-link 
          v-else 
          to="/profil" 
          class="bg-brandBlue text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition shadow-sm flex items-center gap-2 ml-2"
        >
          <i class="fas fa-user-circle"></i> {{ $t('nav.login') }}
        </router-link>
        
      </div>
    </nav>

    <!-- ZONE DE CONTENU DYNAMIQUE -->
    <main class="p-4 md:p-8" @click="showLangMenu = false">
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

// --- 1. GESTION DE LA LANGUE (i18n) ---
const { locale } = useI18n();
const showLangMenu = ref(false);

const setLanguage = (lang) => {
  locale.value = lang;
  localStorage.setItem('geolearn_lang', lang);
  showLangMenu.value = false;
};

// --- 2. GESTION DU MODE SOMBRE ---
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

// --- 3. GESTION DE L'UTILISATEUR CONNECTÉ ---
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>