<template>
  <div class="space-y-24 pb-12">
    
    <!-- SECTION HERO (En-tête principal) -->
    <section class="relative pt-12 lg:pt-20 text-center">
      <!-- Éléments de décoration en arrière-plan -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent -z-10 rounded-b-full blur-3xl opacity-60"></div>
      
      <div class="max-w-4xl mx-auto px-4">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-brandBlue dark:text-blue-400 font-semibold text-sm mb-6 shadow-sm">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandBlue opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-brandBlue"></span>
          </span>
          {{ $t('home.new_version') }}
        </div>
        
        <h1 class="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white tracking-tight mb-6 leading-tight">
          {{ $t('home.title_1') }} <span class="text-transparent bg-clip-text bg-gradient-to-r from-brandBlue to-cyan-500">GeoLearn</span>
        </h1>
        
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          {{ $t('home.desc') }}
        </p>
        
        <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
          <router-link 
            :to="isLoggedIn ? '/quiz' : '/profil'" 
            class="w-full sm:w-auto px-8 py-4 bg-brandBlue text-white rounded-full font-bold text-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
          >
            {{ isLoggedIn ? $t('home.play_btn') : $t('home.register_btn') }}
            <i class="fas fa-arrow-right"></i>
          </router-link>
          
          <router-link 
            to="/explorer" 
            class="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-full font-bold text-lg hover:border-brandBlue dark:hover:border-brandBlue transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <i class="fas fa-globe-europe text-brandBlue"></i>
            {{ $t('home.explore_btn') }}
          </router-link>
        </div>
      </div>
    </section>

    <!-- SECTION DES MODES DE JEU -->
    <section class="max-w-6xl mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{{ $t('home.ways_title') }}</h2>
        <p class="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">{{ $t('home.ways_desc') }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Carte Défi Chrono -->
        <div class="bg-gradient-to-br from-red-50 to-white dark:from-gray-800 dark:to-gray-800 p-8 rounded-3xl border border-red-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="absolute -right-4 -bottom-4 text-9xl opacity-5 group-hover:scale-110 transition-transform duration-500">⏱️</div>
          <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">⏱️</div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">{{ $t('home.mode_chrono_title') }}</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{{ $t('home.mode_chrono_desc') }}</p>
          <router-link to="/quiz" class="text-red-600 dark:text-red-400 font-bold hover:underline inline-flex items-center gap-2">{{ $t('home.try_mode') }} <i class="fas fa-play text-xs"></i></router-link>
        </div>

        <!-- Carte QCM Capitales -->
        <div class="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-800 p-8 rounded-3xl border border-blue-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="absolute -right-4 -bottom-4 text-9xl opacity-5 group-hover:scale-110 transition-transform duration-500">🏛️</div>
          <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-brandBlue dark:text-blue-400 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">🏛️</div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">{{ $t('home.mode_caps_title') }}</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{{ $t('home.mode_caps_desc') }}</p>
          <router-link to="/quiz" class="text-brandBlue dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-2">{{ $t('home.try_mode') }} <i class="fas fa-play text-xs"></i></router-link>
        </div>

        <!-- Carte QCM Drapeaux -->
        <div class="bg-gradient-to-br from-orange-50 to-white dark:from-gray-800 dark:to-gray-800 p-8 rounded-3xl border border-orange-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="absolute -right-4 -bottom-4 text-9xl opacity-5 group-hover:scale-110 transition-transform duration-500">🚩</div>
          <div class="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">🚩</div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">{{ $t('home.mode_flags_title') }}</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{{ $t('home.mode_flags_desc') }}</p>
          <router-link to="/quiz" class="text-orange-600 dark:text-orange-400 font-bold hover:underline inline-flex items-center gap-2">{{ $t('home.try_mode') }} <i class="fas fa-play text-xs"></i></router-link>
        </div>

        <!-- Carte Flashcards -->
        <div class="bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-800 p-8 rounded-3xl border border-green-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div class="absolute -right-4 -bottom-4 text-9xl opacity-5 group-hover:scale-110 transition-transform duration-500">🃏</div>
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">🃏</div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">{{ $t('home.mode_flash_title') }}</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{{ $t('home.mode_flash_desc') }}</p>
          <router-link to="/quiz" class="text-green-600 dark:text-green-400 font-bold hover:underline inline-flex items-center gap-2">{{ $t('home.try_mode') }} <i class="fas fa-play text-xs"></i></router-link>
        </div>
      </div>
    </section>

    <!-- SECTION STATISTIQUES RAPIDES -->
    <section class="max-w-5xl mx-auto px-4">
      <div class="bg-gray-900 dark:bg-gray-800 rounded-3xl p-10 text-center relative overflow-hidden shadow-xl">
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-brandBlue rounded-full blur-3xl opacity-20"></div>
        <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500 rounded-full blur-3xl opacity-20"></div>
        
        <div class="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div class="text-4xl font-black text-white mb-2">190+</div>
            <div class="text-gray-400 font-medium">{{ $t('home.stat_countries') }}</div>
          </div>
          <div>
            <div class="text-4xl font-black text-white mb-2">100%</div>
            <div class="text-gray-400 font-medium">{{ $t('home.stat_free') }}</div>
          </div>
          <div>
            <div class="text-4xl font-black text-white mb-2"><i class="fas fa-chart-line"></i></div>
            <div class="text-gray-400 font-medium">{{ $t('home.stat_tracking') }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CALL TO ACTION FINAL -->
    <section v-if="!isLoggedIn" class="text-center px-4 pt-8">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">{{ $t('home.cta_title') }}</h2>
      <router-link 
        to="/profil" 
        class="inline-block px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg"
      >
        {{ $t('home.cta_btn') }}
      </router-link>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isLoggedIn = ref(false);

const checkAuthStatus = () => {
  isLoggedIn.value = !!localStorage.getItem('geolearn_user');
};

onMounted(() => {
  checkAuthStatus();
  window.addEventListener('auth-change', checkAuthStatus);
});

onUnmounted(() => {
  window.removeEventListener('auth-change', checkAuthStatus);
});
</script>