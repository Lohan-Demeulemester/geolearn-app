<template>
  <div class="max-w-6xl mx-auto space-y-16 pb-12">

    <!-- ========================================================= -->
    <!-- 1. HERO SECTION MODERNE (SANS BADGE CLIGNOTANT)           -->
    <!-- ========================================================= -->
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-12 lg:p-14 shadow-xl border border-blue-500/20">
      <!-- Halos lumineux décoratifs en arrière-plan -->
      <div class="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-cyan-400/15 blur-3xl"></div>

      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        <!-- Colonne Gauche : Accroche & Actions -->
        <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            {{ locale === 'fr' ? 'Explorez et maîtrisez' : 'Explore and master' }}
            <span class="block bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent mt-1">
              {{ locale === 'fr' ? 'les 196 pays du monde.' : 'all 196 countries.' }}
            </span>
          </h1>

          <p class="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            {{ locale === 'fr'
              ? 'Cartes interactives, fiches pays 3D complètes avec anecdotes historiques, grille mondiale des drapeaux et défis chronométrés pour apprendre la géographie autrement.'
              : 'Interactive maps, 3D country cards with historical fun facts, world flag grid, and timed challenges to learn geography in a whole new way.' }}
          </p>

          <!-- Boutons d'action principaux -->
          <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <router-link
              to="/quiz"
              class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-base shadow-lg shadow-blue-600/30 hover:-translate-y-0.5 transition-all text-center"
            >
              🎮 {{ locale === 'fr' ? 'Lancer un Quiz' : 'Start a Quiz' }}
            </router-link>

            <router-link
              to="/explorer"
              class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-base border border-white/15 backdrop-blur-sm hover:-translate-y-0.5 transition-all text-center"
            >
              🗺️ {{ locale === 'fr' ? 'Explorer l\'Atlas 3D' : 'Explore 3D Atlas' }}
            </router-link>
          </div>

          <!-- Chiffres clés -->
          <div class="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
            <div>
              <strong class="text-2xl sm:text-3xl font-black text-white block">196</strong>
              <span class="text-xs sm:text-sm text-slate-400 font-medium">
                {{ locale === 'fr' ? 'Pays & Fiches' : 'Countries & Cards' }}
              </span>
            </div>
            <div>
              <strong class="text-2xl sm:text-3xl font-black text-cyan-300 block">5</strong>
              <span class="text-xs sm:text-sm text-slate-400 font-medium">
                {{ locale === 'fr' ? 'Modes de jeu' : 'Game Modes' }}
              </span>
            </div>
            <div>
              <strong class="text-2xl sm:text-3xl font-black text-emerald-300 block">100%</strong>
              <span class="text-xs sm:text-sm text-slate-400 font-medium">
                {{ locale === 'fr' ? 'Interactif & Bilingue' : 'Interactive & Bilingual' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Colonne Droite : Carte Pays 3D Interactive en direct -->
        <div class="lg:col-span-5 flex flex-col items-center">
          <div class="w-full max-w-sm">
            <div class="flex items-center justify-between text-xs font-bold text-slate-300 mb-2.5 px-1">
              <span>✨ {{ locale === 'fr' ? 'Aperçu Fiche 3D (Cliquez dessus !)' : '3D Card Preview (Click it!)' }}</span>
              <button
                type="button"
                @click="pickRandomHeroCountry"
                class="text-cyan-300 hover:text-white transition cursor-pointer flex items-center gap-1"
              >
                🎲 {{ locale === 'fr' ? 'Autre pays' : 'Random' }}
              </button>
            </div>

            <!-- Scène 3D de démonstration -->
            <div class="hero-flip-scene" @click="heroCardFlipped = !heroCardFlipped">
              <div class="hero-flip-inner" :class="{ 'is-flipped': heroCardFlipped }">
                
                <!-- Recto de la carte démo -->
                <div class="hero-flip-face hero-flip-front bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-7 flex flex-col items-center justify-between text-center shadow-2xl">
                  <div class="w-full flex justify-between items-center">
                    <span class="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/30 text-cyan-200">
                      {{ heroCountry.subregion }}
                    </span>
                    <span class="text-xs text-slate-300 font-semibold">↻ Flip 3D</span>
                  </div>

                  <div class="my-6 flex flex-col items-center">
                    <img
                      :src="`https://flagcdn.com/w320/${heroCountry.iso}.png`"
                      :alt="heroCountry.name"
                      class="h-24 w-auto rounded-xl shadow-lg mb-4 border border-white/20"
                    />
                    <h3 class="text-2xl font-black text-white mb-1">{{ heroCountry.name }}</h3>
                    <p class="text-sm text-slate-300">
                      {{ t('common.capital') }} : <strong class="text-white">{{ heroCountry.capital }}</strong>
                    </p>
                  </div>

                  <div class="w-full pt-3 border-t border-white/10 text-xs font-bold text-cyan-300">
                    {{ locale === 'fr' ? 'Cliquez pour retourner la carte ↻' : 'Click to flip card ↻' }}
                  </div>
                </div>

                <!-- Verso de la carte démo -->
                <div class="hero-flip-face hero-flip-back bg-slate-900/95 border border-cyan-400/40 rounded-3xl p-6 flex flex-col justify-between text-left shadow-2xl">
                  <div>
                    <div class="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-white/10">
                      <div class="flex items-center gap-3">
                        <img
                          :src="`https://flagcdn.com/w80/${heroCountry.iso}.png`"
                          :alt="heroCountry.name"
                          class="h-8 w-auto rounded shadow-sm"
                        />
                        <h4 class="font-black text-lg text-white leading-tight">{{ heroCountry.name }}</h4>
                      </div>
                      <span class="text-xs text-cyan-300 font-bold">↻</span>
                    </div>

                    <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div class="bg-white/5 p-2.5 rounded-xl">
                        <span class="text-slate-400 block">🏛️ {{ t('common.capital') }}</span>
                        <strong class="text-white">{{ heroCountry.capital }}</strong>
                      </div>
                      <div class="bg-white/5 p-2.5 rounded-xl">
                        <span class="text-slate-400 block">👥 {{ locale === 'fr' ? 'Habitants' : 'Population' }}</span>
                        <strong class="text-white">{{ heroCountry.population }}</strong>
                      </div>
                      <div class="bg-white/5 p-2.5 rounded-xl">
                        <span class="text-slate-400 block">🗣️ {{ locale === 'fr' ? 'Langue' : 'Language' }}</span>
                        <strong class="text-white truncate block">{{ heroCountry.lang }}</strong>
                      </div>
                      <div class="bg-white/5 p-2.5 rounded-xl">
                        <span class="text-slate-400 block">💶 {{ locale === 'fr' ? 'Monnaie' : 'Currency' }}</span>
                        <strong class="text-white truncate block">{{ heroCountry.currency }}</strong>
                      </div>
                    </div>

                    <div class="bg-blue-500/15 border border-blue-400/30 rounded-xl p-3 text-xs text-slate-200 leading-relaxed">
                      <strong class="text-cyan-300 block mb-0.5">💡 Fun Fact :</strong>
                      {{ heroCountry.fact }}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ========================================================= -->
    <!-- 2. BARRE DE REPRISE RAPIDE (SI L'UTILISATEUR EST CONNECTÉ)-->
    <!-- ========================================================= -->
    <section
      v-if="currentUser"
      class="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-6"
    >
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl font-black shrink-0">
          👋
        </div>
        <div>
          <h2 class="text-xl font-black text-gray-900 dark:text-white">
            {{ locale === 'fr' ? `Bon retour parmi nous, ${displayUsername} !` : `Welcome back, ${displayUsername} !` }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            <template v-if="userStats.totalGames > 0">
              {{ locale === 'fr'
                ? `Vous avez déjà joué ${userStats.totalGames} partie(s). Dernier mode joué : ${userStats.lastMode} (${userStats.lastScore}).`
                : `You have played ${userStats.totalGames} game(s). Last played: ${userStats.lastMode} (${userStats.lastScore}).` }}
            </template>
            <template v-else>
              {{ locale === 'fr'
                ? 'Prêt à enregistrer votre tout premier score aujourd\'hui ?'
                : 'Ready to record your very first score today?' }}
            </template>
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto justify-end shrink-0">
        <router-link
          to="/scores"
          class="px-5 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-sm font-bold transition"
        >
          📊 {{ locale === 'fr' ? 'Mes statistiques' : 'My Statistics' }}
        </router-link>
        <router-link
          to="/quiz"
          class="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition shadow-sm"
        >
          🚀 {{ locale === 'fr' ? 'Continuer à jouer' : 'Keep Playing' }}
        </router-link>
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- 3. VITRINE DES 5 MODES DE JEU                             -->
    <!-- ========================================================= -->
    <section class="space-y-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span class="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
            {{ locale === 'fr' ? 'Apprentissage par le jeu' : 'Gamified Learning' }}
          </span>
          <h2 class="text-3xl font-black text-gray-900 dark:text-white">
            {{ locale === 'fr' ? '5 Modes de Jeu Complémentaires' : '5 Complementary Game Modes' }}
          </h2>
        </div>
        <router-link
          to="/quiz"
          class="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          {{ locale === 'fr' ? 'Accéder à tous les quiz →' : 'Go to all quizzes →' }}
        </router-link>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Mode 1 : QCM Capitales -->
        <router-link
          to="/quiz"
          class="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
        >
          <div>
            <div class="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              🏛️
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {{ t('home.mode_caps_title') }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ t('home.mode_caps_desc') }}
            </p>
          </div>
          <span class="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700/60 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center justify-between">
            <span>{{ locale === 'fr' ? '15 questions aléatoires' : '15 random questions' }}</span>
            <span>→</span>
          </span>
        </router-link>

        <!-- Mode 2 : Reconnaissance de Drapeaux -->
        <router-link
          to="/quiz"
          class="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
        >
          <div>
            <div class="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              🚩
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {{ t('home.mode_flags_title') }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ t('home.mode_flags_desc') }}
            </p>
          </div>
          <span class="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700/60 text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center justify-between">
            <span>{{ locale === 'fr' ? 'Drapeaux HD des 6 continents' : 'HD flags from 6 continents' }}</span>
            <span>→</span>
          </span>
        </router-link>

        <!-- Mode 3 : Grille Mondiale des Drapeaux -->
        <router-link
          to="/quiz"
          class="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border-2 border-emerald-500/30 hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between relative"
        >
          <span class="absolute top-5 right-5 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
            {{ locale === 'fr' ? 'Populaire' : 'Popular' }}
          </span>
          <div>
            <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              🏳️
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {{ locale === 'fr' ? 'Grille des 196 Drapeaux' : '196 World Flag Grid' }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ locale === 'fr'
                ? 'Tous les drapeaux du monde ou d\'un continent affichés devant vous : saisissez le pays sous chaque drapeau pour verdir la grille !'
                : 'All flags from the world or a continent in front of you: type the country under each flag to turn the grid green!' }}
            </p>
          </div>
          <span class="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700/60 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
            <span>{{ locale === 'fr' ? 'Validation instantanée' : 'Instant validation' }}</span>
            <span>→</span>
          </span>
        </router-link>

        <!-- Mode 4 : Flashcards 3D Enrichies -->
        <router-link
          to="/quiz"
          class="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
        >
          <div>
            <div class="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              🃏
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {{ locale === 'fr' ? 'Flashcards 3D & Fiches Pays' : '3D Flashcards & Fact Sheets' }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ locale === 'fr'
                ? 'Révisez à votre rythme avec nos vraies cartes 3D retournables : population, langues, monnaie, superficie et anecdotes.'
                : 'Review at your own pace with our 3D flip cards: population, languages, currency, area, and fun facts.' }}
            </p>
          </div>
          <span class="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700/60 text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center justify-between">
            <span>{{ locale === 'fr' ? 'Tri "À revoir" & "Maîtrisé"' : '"To Review" & "Mastered" sorting' }}</span>
            <span>→</span>
          </span>
        </router-link>

        <!-- Mode 5 : Défis Chronométrés Carte -->
        <router-link
          to="/quiz"
          class="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
        >
          <div>
            <div class="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              ⏱️
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {{ locale === 'fr' ? 'Défis Carte (Europe & Monde)' : 'Map Challenges (Europe & World)' }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ locale === 'fr'
                ? '3 minutes pour les 47 pays d\'Europe ou 15 minutes pour les 196 pays du monde en direct sur la carte muette interactive.'
                : '3 minutes for all 47 European countries or 15 minutes for all 196 world countries live on the interactive blank map.' }}
            </p>
          </div>
          <span class="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700/60 text-xs font-bold text-red-600 dark:text-red-400 flex items-center justify-between">
            <span>{{ locale === 'fr' ? 'Contre-la-montre sur carte' : 'Time trial on interactive map' }}</span>
            <span>→</span>
          </span>
        </router-link>

        <!-- Mode 6 : Atlas & Comparateur de Pays -->
        <router-link
          to="/explorer"
          class="group bg-gradient-to-br from-blue-600 to-cyan-600 text-white p-6 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
        >
          <div>
            <div class="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              ⚖️
            </div>
            <h3 class="text-xl font-bold mb-2">
              {{ locale === 'fr' ? 'Atlas Plein Écran & Comparateur' : 'Fullscreen Atlas & Comparator' }}
            </h3>
            <p class="text-sm text-blue-100 leading-relaxed">
              {{ locale === 'fr'
                ? 'Comparez deux pays côte à côte (superficie, habitants, distance à vol d\'oiseau) et explorez la carte en mode plein écran.'
                : 'Compare any two countries side-by-side (area, population, flight distance) and explore the map in fullscreen mode.' }}
            </p>
          </div>
          <span class="mt-5 pt-4 border-t border-white/20 text-xs font-bold text-white flex items-center justify-between">
            <span>{{ locale === 'fr' ? 'Ouvrir l\'Explorateur' : 'Open Explorer' }}</span>
            <span>→</span>
          </span>
        </router-link>
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- 4. WIDGET « LE SAVIEZ-VOUS ? » (ANECDOTE GÉOGRAPHIQUE)     -->
    <!-- ========================================================= -->
    <section class="bg-gradient-to-r from-blue-50 via-indigo-50/60 to-cyan-50 dark:from-gray-800 dark:via-gray-800 dark:to-slate-800 rounded-3xl p-6 sm:p-10 border border-blue-100 dark:border-gray-700 shadow-sm">
      <div class="flex flex-col lg:flex-row items-center justify-between gap-8">
        
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left flex-1">
          <img
            :src="`https://flagcdn.com/w160/${spotlightCountry.iso}.png`"
            :alt="spotlightCountry.name"
            class="h-20 w-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700 shrink-0"
          />
          <div class="space-y-2">
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span class="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-blue-600 text-white">
                💡 {{ locale === 'fr' ? 'Le saviez-vous ?' : 'Did you know?' }}
              </span>
              <span class="text-xs font-bold text-gray-500 dark:text-gray-400">
                {{ spotlightCountry.name }} • {{ t('common.capital') }} : {{ spotlightCountry.capital }} ({{ spotlightCountry.population }})
              </span>
            </div>

            <p class="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-relaxed">
              « {{ spotlightCountry.fact }} »
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <button
            type="button"
            @click="pickRandomSpotlight"
            class="px-5 py-3 rounded-xl bg-white dark:bg-gray-900 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-gray-800 dark:text-white font-bold text-sm border border-gray-200 dark:border-gray-700 transition shadow-xs cursor-pointer flex items-center gap-2"
          >
            🎲 {{ locale === 'fr' ? 'Autre anecdote' : 'Another fact' }}
          </button>
        </div>

      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ALL_COUNTRIES from '../data/countries.js';

const { t, locale } = useI18n();
const API_URL = 'https://geolearn-backend-bj65.onrender.com';

const localizedCountries = computed(() => {
  const isEn = locale.value === 'en';
  return ALL_COUNTRIES.map(c => ({
    ...c,
    name: isEn ? c.name_en : c.name_fr,
    capital: isEn ? c.capital_en : c.capital_fr,
    subregion: isEn ? c.subregion_en : c.subregion_fr,
    population: isEn ? c.population_en : c.population_fr,
    lang: isEn ? c.lang_en : c.lang_fr,
    fact: isEn ? c.fact_en : c.fact_fr
  }));
});

// Carte 3D interactive du Hero
const heroIndex = ref(14); // France par défaut
const heroCardFlipped = ref(false);
const heroCountry = computed(() => localizedCountries.value[heroIndex.value] || localizedCountries.value[0]);

const pickRandomHeroCountry = () => {
  heroCardFlipped.value = false;
  heroIndex.value = Math.floor(Math.random() * localizedCountries.value.length);
};

// Widget "Le saviez-vous ?"
const spotlightIndex = ref(Math.floor(Math.random() * ALL_COUNTRIES.length));
const spotlightCountry = computed(() => localizedCountries.value[spotlightIndex.value] || localizedCountries.value[0]);

const pickRandomSpotlight = () => {
  let next = Math.floor(Math.random() * localizedCountries.value.length);
  if (next === spotlightIndex.value) next = (next + 1) % localizedCountries.value.length;
  spotlightIndex.value = next;
};

// Informations rapides de l'utilisateur connecté
const currentUser = ref(null);

const displayUsername = computed(() => {
  if (!currentUser.value) return '';
  return (
    currentUser.value.username ||
    currentUser.value.pseudo ||
    currentUser.value.name ||
    (currentUser.value.user && (currentUser.value.user.username || currentUser.value.user.name)) ||
    (currentUser.value.email ? currentUser.value.email.split('@')[0] : 'Explorateur')
  );
});

const userStats = ref({
  totalGames: 0,
  lastMode: '',
  lastScore: ''
});

onMounted(async () => {
  const savedUser = localStorage.getItem('geolearn_user');
  if (!savedUser) return;
  try {
    const parsed = JSON.parse(savedUser);
    currentUser.value = parsed;
    if (parsed && parsed.id) {
      const res = await fetch(`${API_URL}/api/scores/${parsed.id}`);
      if (res.ok) {
        const scores = await res.json();
        if (Array.isArray(scores) && scores.length > 0) {
          userStats.value.totalGames = scores.length;
          userStats.value.lastMode = scores[0].mode;
          userStats.value.lastScore = `${scores[0].score}/${scores[0].max_score}`;
        }
      }
    }
  } catch (e) {
    // Silencieux si hors-ligne
  }
});
</script>

<style scoped>
.hero-flip-scene {
  perspective: 1400px;
  cursor: pointer;
}

.hero-flip-inner {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  min-height: 340px;
  transform-style: preserve-3d;
  transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
}

.hero-flip-inner.is-flipped {
  transform: rotateY(180deg);
}

.hero-flip-face {
  grid-area: 1 / 1;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.hero-flip-front {
  transform: rotateY(0deg);
}

.hero-flip-back {
  transform: rotateY(180deg);
}
</style>