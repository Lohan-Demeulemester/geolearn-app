<template>
  <div class="max-w-5xl mx-auto space-y-8">
    
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-500 mb-2">{{ t('quiz.title') }}</h2>
        <p class="text-gray-600 dark:text-gray-400 transition-colors duration-500">{{ t('quiz.subtitle') }}</p>
      </div>
      <button 
        v-if="currentMode !== 'menu'" 
        @click="retourMenu"
        class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-5 py-2 rounded-full font-medium transition-colors flex items-center gap-2 cursor-pointer"
      >
        <i class="fas fa-arrow-left"></i> {{ t('quiz.back') }}
      </button>
    </div>

    <!-- MENU PRINCIPAL DES MODES DE JEU -->
    <div v-if="currentMode === 'menu'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      <div @click="lancerMode('qcm', 'capital')" class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center group">
        <div class="w-14 h-14 bg-blue-100 dark:bg-gray-700 text-brandBlue dark:text-blue-400 rounded-full flex items-center justify-center text-xl mx-auto mb-4 group-hover:scale-110 transition-transform">🏛️</div>
        <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">{{ t('home.mode_caps_title') }}</h3>
        <p class="text-gray-500 dark:text-gray-400 text-xs">{{ t('home.mode_caps_desc') }}</p>
      </div>

      <div @click="lancerMode('qcm', 'flag')" class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center group">
        <div class="w-14 h-14 bg-orange-100 dark:bg-gray-700 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center text-xl mx-auto mb-4 group-hover:scale-110 transition-transform">🚩</div>
        <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">{{ t('home.mode_flags_title') }}</h3>
        <p class="text-gray-500 dark:text-gray-400 text-xs">{{ t('home.mode_flags_desc') }}</p>
      </div>
      
      <div @click="lancerMode('flashcards')" class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center group">
        <div class="w-14 h-14 bg-green-100 dark:bg-gray-700 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xl mx-auto mb-4 group-hover:scale-110 transition-transform">🃏</div>
        <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">{{ t('home.mode_flash_title') }}</h3>
        <p class="text-gray-500 dark:text-gray-400 text-xs">{{ t('home.mode_flash_desc') }}</p>
      </div>

      <div @click="lancerMode('chrono')" class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center group">
        <div class="w-14 h-14 bg-red-100 dark:bg-gray-700 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center text-xl mx-auto mb-4 group-hover:scale-110 transition-transform">⏱️</div>
        <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">{{ t('home.mode_chrono_title') }}</h3>
        <p class="text-gray-500 dark:text-gray-400 text-xs">{{ t('home.mode_chrono_desc') }}</p>
      </div>
    </div>

    <!-- MODE QCM (CAPITALES & DRAPEAUX SUR 195 PAYS) -->
    <div v-if="currentMode === 'qcm'" class="max-w-2xl mx-auto mt-8">
      <div v-if="!qcmFini" class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-center mb-8 text-sm font-medium text-gray-500 dark:text-gray-400">
          <span>{{ t('quiz.question_x_of_y', { current: qcmIndex + 1, total: qcmMaxQuestions }) }}</span>
          <span>{{ t('quiz.score', { score: qcmScore }) }}</span>
        </div>
        
        <h3 v-if="qcmCurrentType === 'capital'" class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8 flex flex-col items-center gap-4">
          {{ t('quiz.ask_capital', { country: getLocalizedName(qcmQuestionsList[qcmIndex]) }) }}
          <img :src="`https://flagcdn.com/w80/${getIso(qcmQuestionsList[qcmIndex])}.png`" class="h-10 w-auto shadow-sm rounded-sm" alt="drapeau">
        </h3>
        <div v-else class="text-center mb-8">
          <img :src="`https://flagcdn.com/w160/${getIso(qcmQuestionsList[qcmIndex])}.png`" class="h-24 w-auto mx-auto mb-6 shadow-md rounded-md" alt="drapeau">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ t('quiz.ask_flag') }}
          </h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            v-for="choixId in qcmOptions" :key="choixId"
            @click="verifierReponseQcm(choixId)"
            :disabled="qcmIsAnswered"
            class="p-4 rounded-xl border-2 font-medium transition-all duration-300 cursor-pointer"
            :class="[
              !qcmIsAnswered ? 'border-gray-200 hover:border-brandBlue hover:bg-blue-50 text-gray-800 dark:border-gray-600 dark:hover:border-brandBlue dark:hover:bg-gray-700 dark:text-white' : '',
              qcmIsAnswered && choixId === qcmCorrectAnswer ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/50 dark:border-green-500 dark:text-green-300 scale-[1.02] shadow-sm' : '',
              qcmIsAnswered && choixId === qcmSelected && choixId !== qcmCorrectAnswer ? 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/50 dark:border-red-500 dark:text-red-300 scale-95' : '',
              qcmIsAnswered && choixId !== qcmSelected && choixId !== qcmCorrectAnswer ? 'border-gray-100 text-gray-400 dark:border-gray-800 dark:text-gray-600 opacity-50 cursor-not-allowed' : ''
            ]"
          >
            {{ qcmCurrentType === 'capital' ? getLocalizedCapital(choixId) : getLocalizedName(choixId) }}
          </button>
        </div>
      </div>
      
      <div v-else class="text-center py-12 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div class="text-6xl mb-4">🏆</div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('quiz.finished') }}</h3>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-6">{{ t('quiz.your_score', { score: qcmScore, total: qcmMaxQuestions }) }}</p>
        <button @click="lancerMode('qcm', qcmCurrentType)" class="bg-brandBlue text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition cursor-pointer">{{ t('quiz.replay') }}</button>
      </div>
    </div>

    <!-- MODE FLASHCARDS ENRICHI (AVEC FILTRE CONTINENT & MÉLANGER) -->
    <div v-if="currentMode === 'flashcards'" class="max-w-xl mx-auto mt-8 text-center space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-3 px-2">
        <select 
          v-model="flashcardContinent"
          @change="resetFlashcards"
          class="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium focus:outline-none"
        >
          <option value="">{{ locale === 'fr' ? 'Tous les continents (196)' : 'All Continents (196)' }}</option>
          <option value="Europe">Europe</option>
          <option value="Asia">Asia</option>
          <option value="Africa">Africa</option>
          <option value="North America">North America</option>
          <option value="South America">South America</option>
          <option value="Oceania">Oceania</option>
        </select>

        <button 
          type="button"
          @click="shuffleFlashcards"
          class="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer flex items-center gap-2"
        >
          <i class="fas fa-random"></i> {{ locale === 'fr' ? 'Mélanger' : 'Shuffle' }}
        </button>

        <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
          {{ t('quiz.card_x_of_y', { current: flashcardIndex + 1, total: activeFlashcards.length }) }}
        </span>
      </div>

      <div 
        @click="flashcardFlipped = !flashcardFlipped"
        class="h-80 w-full bg-white dark:bg-gray-800 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700 cursor-pointer flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg p-6 relative overflow-hidden group"
      >
        <span class="absolute top-4 right-4 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300">
          {{ activeFlashcards[flashcardIndex]?.continent }}
        </span>

        <div v-if="!flashcardFlipped" class="flex flex-col items-center">
          <img :src="`https://flagcdn.com/w160/${activeFlashcards[flashcardIndex].iso}.png`" class="h-28 w-auto mb-8 shadow-sm rounded-md" alt="drapeau">
          <span class="text-gray-400 dark:text-gray-500 text-sm"><i class="fas fa-hand-pointer"></i> {{ t('quiz.click_flip') }}</span>
        </div>
        <div v-else class="flex flex-col items-center">
          <h3 class="text-4xl font-bold text-gray-900 dark:text-white mb-3">{{ activeFlashcards[flashcardIndex].name }}</h3>
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-2">{{ t('common.capital') }} : <strong>{{ activeFlashcards[flashcardIndex].capital }}</strong></p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mb-4">{{ activeFlashcards[flashcardIndex].subregion }}</p>
          <span class="text-gray-400 dark:text-gray-500 text-sm"><i class="fas fa-undo"></i></span>
        </div>
      </div>

      <div class="flex justify-center gap-4">
        <button @click="flashcardPrecedente" class="p-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"><i class="fas fa-arrow-left"></i></button>
        <button @click="flashcardSuivante" class="p-4 bg-brandBlue text-white rounded-full hover:bg-blue-700 transition cursor-pointer"><i class="fas fa-arrow-right"></i></button>
      </div>
    </div>

    <!-- MODE CHRONO (DÉFI EUROPE & DÉFI MONDE) -->
    <div v-if="currentMode === 'chrono'" class="max-w-4xl mx-auto mt-8">
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        
        <!-- CHOIX DU DÉFI CHRONO -->
        <div v-if="!isChronoStarted && !chronoFini" class="text-center py-4 space-y-6">
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ locale === 'fr' ? 'Choisissez votre Défi Chrono' : 'Choose Your Timed Challenge' }}</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mt-6">
            <div 
              @click="selectChronoMode('europe')" 
              class="p-6 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col gap-3"
              :class="chronoRegion === 'europe' ? 'border-brandBlue bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-brandBlue'"
            >
              <div class="text-3xl">🇪🇺</div>
              <h4 class="font-bold text-lg text-gray-900 dark:text-white">{{ t('home.mode_chrono_title') }}</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ locale === 'fr' ? 'Retrouvez les 47 pays d\'Europe en 3 minutes.' : 'Find all 47 European countries in 3 minutes.' }}</p>
            </div>

            <div 
              @click="selectChronoMode('world')" 
              class="p-6 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col gap-3"
              :class="chronoRegion === 'world' ? 'border-brandBlue bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-brandBlue'"
            >
              <div class="text-3xl">🌍</div>
              <h4 class="font-bold text-lg text-gray-900 dark:text-white">{{ locale === 'fr' ? 'Défi Monde (196 pays)' : 'World Challenge (196 countries)' }}</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ locale === 'fr' ? 'Le test ultime : retrouvez le maximum de pays de la planète en 15 minutes !' : 'The ultimate test: find as many countries as possible in 15 minutes!' }}</p>
            </div>
          </div>

          <button @click="demarrerChrono" class="bg-brandBlue text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-md cursor-pointer mt-6">
            {{ t('quiz.start_timer') }}
          </button>
        </div>

        <!-- PENDANT LA PARTIE CHRONO -->
        <div v-else>
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {{ chronoRegion === 'europe' ? t('home.mode_chrono_title') : (locale === 'fr' ? 'Défi Mondial Chrono' : 'World Timed Challenge') }}
            </h3>
            
            <div class="w-full h-[480px] bg-[#aad3df] dark:bg-[#1e293b] rounded-2xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700 relative z-0">
              <l-map 
                ref="map" 
                v-model:zoom="mapZoom" 
                v-model:center="mapCenter" 
                :min-zoom="2"
                :max-zoom="7"
                :use-global-leaflet="false"
              >
                <l-tile-layer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  :no-wrap="true"
                  attribution='&copy; OpenStreetMap contributors'
                ></l-tile-layer>
                
                <l-circle-marker 
                  v-for="country in targetCountries" 
                  :key="'marker-' + country.id" 
                  :lat-lng="[country.lat, country.lng]"
                  :radius="getMarkerRadius(country.iso)"
                  :color="'#9ca3af'"
                  :weight="1.5"
                  :fill-color="paysTrouves.includes(country.iso) ? '#22c55e' : '#ffffff'"
                  :fill-opacity="0.9"
                >
                  <l-popup>
                    <div class="text-center p-1">
                      <template v-if="paysTrouves.includes(country.iso)">
                        <img :src="`https://flagcdn.com/w40/${country.iso}.png`" class="mx-auto mb-1 shadow-sm rounded-sm" :alt="country.name">
                        <strong class="text-sm font-bold text-green-600">{{ country.name }}</strong>
                      </template>
                      <template v-else>
                        <strong class="text-sm font-bold text-gray-500">???</strong>
                      </template>
                    </div>
                  </l-popup>
                </l-circle-marker>
              </l-map>
            </div>
          </div>

          <div class="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 bg-white dark:bg-gray-800 border-2 border-brandBlue/20 p-4 rounded-2xl shadow-sm">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-inner transition-colors duration-300" :class="chronoTemps <= 20 && !chronoFini ? 'bg-red-500 animate-pulse' : 'bg-brandBlue'">
                {{ formatTime(chronoTemps) }}
              </div>
              <div>
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ t('quiz.progression') }}</p>
                <h3 class="font-bold text-gray-900 dark:text-white text-xl">{{ t('quiz.found', { current: paysTrouves.length, total: targetCountries.length }) }}</h3>
              </div>
            </div>
            
            <div class="w-full md:w-1/2 relative">
              <input 
                v-model="chronoInput"
                @input="verifierSaisieChrono"
                :disabled="chronoFini"
                type="text" 
                :placeholder="locale === 'fr' ? 'Tapez le nom d\'un pays...' : 'Type a country name...'" 
                class="w-full pl-6 pr-4 py-4 rounded-xl border-2 border-brandBlue/40 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-brandBlue focus:ring-4 focus:ring-blue-100 dark:focus:ring-brandBlue/20 text-lg font-bold transition-all shadow-sm"
              >
            </div>
          </div>

          <div v-if="chronoFini" class="bg-blue-50 dark:bg-blue-900/20 text-brandBlue dark:text-blue-300 p-4 rounded-xl text-center font-medium mb-8">
            <span v-if="paysTrouves.length === targetCountries.length">{{ locale === 'fr' ? 'Incroyable ! Vous avez trouvé tous les pays ! 🎉' : 'Incredible! You found all countries! 🎉' }}</span>
            <span v-else>{{ t('quiz.time_up', { current: paysTrouves.length }) }}</span>
          </div>

          <!-- LISTE DES PAYS TROUVÉS / MANQUANTS -->
          <div class="border-t border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm max-h-96 overflow-y-auto">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-sm">
              <div 
                v-for="country in targetCountries" :key="country.id"
                class="border-b border-r border-gray-200 dark:border-gray-700 p-2.5 flex items-center justify-between transition-colors duration-300"
                :class="[
                  paysTrouves.includes(country.iso) ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800/50',
                ]"
              >
                <template v-if="paysTrouves.includes(country.iso)">
                  <span class="font-bold text-green-700 dark:text-green-400 truncate pr-2">{{ country.name }}</span>
                  <img :src="`https://flagcdn.com/w20/${country.iso}.png`" class="w-4 h-auto shadow-sm rounded-sm shrink-0">
                </template>
                <template v-else-if="chronoFini">
                  <span class="text-red-500 dark:text-red-400 font-medium truncate pr-2">{{ country.name }}</span>
                </template>
                <template v-else>
                  <span class="text-gray-400 dark:text-gray-600">???</span>
                </template>
              </div>
            </div>
          </div>
          
          <div v-if="chronoFini" class="mt-8 text-center">
            <button @click="isChronoStarted = false; chronoFini = false;" class="bg-brandBlue text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition cursor-pointer">{{ t('quiz.retry') }}</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n'; 
import ALL_COUNTRIES from '../data/countries.js';

import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LPopup, LCircleMarker } from "@vue-leaflet/vue-leaflet";
import L from 'leaflet';

const { t, locale } = useI18n();

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const API_URL = 'https://geolearn-backend-bj65.onrender.com';

const countriesData = ref(ALL_COUNTRIES);

const currentMode = ref('menu'); 
const retourMenu = () => { currentMode.value = 'menu'; arreterChrono(); };

const lancerMode = (mode, type = null) => {
  currentMode.value = mode;
  if (mode === 'qcm') initQcm(type);
  if (mode === 'flashcards') initFlashcards();
  if (mode === 'chrono') { isChronoStarted.value = false; paysTrouves.value = []; chronoFini.value = false; }
};

const sauvegarderScore = async (mode, score, maxScore) => {
  const savedUser = localStorage.getItem('geolearn_user');
  if (!savedUser) return; 
  try {
    const user = JSON.parse(savedUser);
    await fetch(`${API_URL}/api/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, mode: mode, score: score, max_score: maxScore })
    });
  } catch (error) {
    console.error("Erreur serveur scores:", error);
  }
};

const localizedCountries = computed(() => {
  const isEn = locale.value === 'en';
  return countriesData.value.map(c => ({
    ...c,
    name: isEn ? c.name_en : c.name_fr,
    capital: isEn ? c.capital_en : c.capital_fr,
    continent: c.continent_en,
    subregion: isEn ? c.subregion_en : c.subregion_fr
  }));
});

const getCountry = (id) => localizedCountries.value.find(c => c.id === id);
const getLocalizedName = (id) => getCountry(id)?.name || '';
const getLocalizedCapital = (id) => getCountry(id)?.capital || '';
const getIso = (id) => getCountry(id)?.iso || '';

// --- LOGIQUE QCM SUR 195 PAYS ---
const qcmCurrentType = ref('capital'); 
const qcmQuestionsList = ref([]);
const qcmMaxQuestions = 15;
const qcmIndex = ref(0);
const qcmScore = ref(0);
const qcmOptions = ref([]); 
const qcmFini = ref(false);
const qcmSelected = ref(null);
const qcmIsAnswered = ref(false);
const qcmCorrectAnswer = ref('');

const initQcm = (type) => {
  qcmCurrentType.value = type;
  let shuffled = [...countriesData.value].sort(() => 0.5 - Math.random());
  qcmQuestionsList.value = shuffled.slice(0, Math.min(qcmMaxQuestions, shuffled.length)).map(c => c.id);
  qcmIndex.value = 0; 
  qcmScore.value = 0; 
  qcmFini.value = false;
  genererOptionsQcm();
};

const genererOptionsQcm = () => {
  qcmIsAnswered.value = false;
  qcmSelected.value = null;
  const correctId = qcmQuestionsList.value[qcmIndex.value];
  qcmCorrectAnswer.value = correctId;
  const correctCountry = getCountry(correctId);

  let sameContinent = countriesData.value
    .filter(c => c.id !== correctId && c.continent_en === correctCountry.continent_en)
    .map(c => c.id);
    
  let distractors = [...sameContinent].sort(() => 0.5 - Math.random()).slice(0, 3);
  
  while (distractors.length < 3) {
    const randomC = countriesData.value[Math.floor(Math.random() * countriesData.value.length)].id;
    if (randomC !== correctId && !distractors.includes(randomC)) {
      distractors.push(randomC);
    }
  }
  
  qcmOptions.value = [correctId, ...distractors].sort(() => 0.5 - Math.random());
};

const verifierReponseQcm = (choixId) => {
  if (qcmIsAnswered.value) return; 
  qcmSelected.value = choixId;
  qcmIsAnswered.value = true;
  if (choixId === qcmCorrectAnswer.value) qcmScore.value++;
  setTimeout(() => {
    if (qcmIndex.value < qcmMaxQuestions - 1) {
      qcmIndex.value++;
      genererOptionsQcm();
    } else {
      qcmFini.value = true;
      sauvegarderScore(qcmCurrentType.value === 'capital' ? 'QCM Capitales' : 'QCM Drapeaux', qcmScore.value, qcmMaxQuestions);
    }
  }, 1000);
};

// --- LOGIQUE FLASHCARDS AVEC FILTRE & MÉLANGE ---
const flashcardIndex = ref(0);
const flashcardFlipped = ref(false);
const flashcardContinent = ref('');
const flashcardList = ref([]);

const initFlashcards = () => {
  flashcardContinent.value = '';
  resetFlashcards();
};

const resetFlashcards = () => {
  let list = localizedCountries.value;
  if (flashcardContinent.value) {
    list = list.filter(c => c.continent === flashcardContinent.value);
  }
  flashcardList.value = [...list];
  flashcardIndex.value = 0;
  flashcardFlipped.value = false;
};

const shuffleFlashcards = () => {
  flashcardList.value.sort(() => 0.5 - Math.random());
  flashcardIndex.value = 0;
  flashcardFlipped.value = false;
};

const activeFlashcards = computed(() => flashcardList.value.length > 0 ? flashcardList.value : localizedCountries.value);

const flashcardSuivante = () => { 
  if (flashcardIndex.value < activeFlashcards.value.length - 1) { 
    flashcardFlipped.value = false; 
    setTimeout(() => { flashcardIndex.value++; }, 150); 
  } 
};

const flashcardPrecedente = () => { 
  if (flashcardIndex.value > 0) { 
    flashcardFlipped.value = false; 
    setTimeout(() => { flashcardIndex.value--; }, 150); 
  } 
};

// --- LOGIQUE CHRONO (DÉFI EUROPE & DÉFI MONDE) ---
const isChronoStarted = ref(false);
const chronoRegion = ref('europe');
const chronoTemps = ref(180);
const chronoInput = ref('');
const paysTrouves = ref([]);
const chronoFini = ref(false);
let intervalId = null;

const mapZoom = ref(3.8);
const mapCenter = ref([50.0, 10.0]);

const selectChronoMode = (region) => {
  chronoRegion.value = region;
  if (region === 'europe') {
    chronoTemps.value = 180;
    mapCenter.value = [54.0, 15.0];
    mapZoom.value = 3.8;
  } else {
    chronoTemps.value = 900; // 15 minutes pour le monde
    mapCenter.value = [20.0, 10.0];
    mapZoom.value = 2;
  }
};

const targetCountries = computed(() => {
  if (chronoRegion.value === 'europe') {
    return localizedCountries.value.filter(c => c.continent === 'Europe').sort((a, b) => a.name.localeCompare(b.name));
  }
  return localizedCountries.value.sort((a, b) => a.name.localeCompare(b.name));
});

const getMarkerRadius = (iso) => {
  if (chronoRegion.value === 'europe') {
    const micro = ['ad', 'li', 'mt', 'mc', 'sm', 'va']; 
    const massive = ['ru', 'fr', 'de', 'es', 'se', 'no', 'fi', 'pl', 'it', 'gb', 'ua', 'ro', 'by']; 
    if (micro.includes(iso)) return 5;
    if (massive.includes(iso)) return 14;
    return 9;
  }
  return 6;
};

const demarrerChrono = () => {
  isChronoStarted.value = true;
  arreterChrono();
  chronoInput.value = '';
  paysTrouves.value = [];
  chronoFini.value = false;
  
  intervalId = setInterval(() => {
    if (chronoTemps.value > 0) {
      chronoTemps.value--;
    } else {
      chronoFini.value = true;
      arreterChrono();
      sauvegarderScore(chronoRegion.value === 'europe' ? 'Défi Europe' : 'Défi Monde', paysTrouves.value.length, targetCountries.value.length);
    }
  }, 1000);
};

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const verifierSaisieChrono = () => {
  if (chronoFini.value) return;
  const inputNormalise = chronoInput.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  
  const pays = targetCountries.value.find(c => {
    const mainName = c.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const altNames = (c.aliases || []).map(a => a.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase());
    return mainName === inputNormalise || altNames.includes(inputNormalise);
  });

  if (pays && !paysTrouves.value.includes(pays.iso)) {
    paysTrouves.value.push(pays.iso); 
    chronoInput.value = ''; 
    
    if (paysTrouves.value.length === targetCountries.value.length) {
      chronoFini.value = true;
      arreterChrono();
      sauvegarderScore(chronoRegion.value === 'europe' ? 'Défi Europe' : 'Défi Monde', paysTrouves.value.length, targetCountries.value.length);
    }
  }
};

const arreterChrono = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

onUnmounted(() => {
  arreterChrono();
});
</script>

<style scoped>
.leaflet-container {
  z-index: 10;
  background-color: #aad3df !important;
}
:global(.dark) .leaflet-container,
:global(body.dark-mode) .leaflet-container {
  background-color: #1e293b !important;
}
</style>