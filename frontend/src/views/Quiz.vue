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
        class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-5 py-2 rounded-full font-medium transition-colors flex items-center gap-2"
      >
        <i class="fas fa-arrow-left"></i> {{ t('quiz.back') }}
      </button>
    </div>

    <!-- MENU PRINCIPAL -->
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

    <!-- MODE QCM -->
    <div v-if="currentMode === 'qcm'" class="max-w-2xl mx-auto mt-8">
      <div v-if="!qcmFini" class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-center mb-8 text-sm font-medium text-gray-500 dark:text-gray-400">
          <span>{{ t('quiz.question_x_of_y', { current: qcmIndex + 1, total: qcmMaxQuestions }) }}</span>
          <span>{{ t('quiz.score', { score: qcmScore }) }}</span>
        </div>
        
        <!-- On utilise getLocalizedName(id) pour afficher le texte traduit en direct -->
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
          <!-- Les boutons sont maintenant basés sur l'ID du pays (choixId) -->
          <button 
            v-for="choixId in qcmOptions" :key="choixId"
            @click="verifierReponseQcm(choixId)"
            :disabled="qcmIsAnswered"
            class="p-4 rounded-xl border-2 font-medium transition-all duration-300"
            :class="[
              !qcmIsAnswered ? 'border-gray-200 hover:border-brandBlue hover:bg-blue-50 text-gray-800 dark:border-gray-600 dark:hover:border-brandBlue dark:hover:bg-gray-700 dark:text-white cursor-pointer' : '',
              qcmIsAnswered && choixId === qcmCorrectAnswer ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/50 dark:border-green-500 dark:text-green-300 scale-[1.02] shadow-sm' : '',
              qcmIsAnswered && choixId === qcmSelected && choixId !== qcmCorrectAnswer ? 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/50 dark:border-red-500 dark:text-red-300 scale-95' : '',
              qcmIsAnswered && choixId !== qcmSelected && choixId !== qcmCorrectAnswer ? 'border-gray-100 text-gray-400 dark:border-gray-800 dark:text-gray-600 opacity-50 cursor-not-allowed' : ''
            ]"
          >
            <!-- Traduction instantanée des réponses sur les boutons -->
            {{ qcmCurrentType === 'capital' ? getLocalizedCapital(choixId) : getLocalizedName(choixId) }}
          </button>
        </div>
      </div>
      
      <div v-else class="text-center py-12 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div class="text-6xl mb-4">🏆</div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('quiz.finished') }}</h3>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-6">{{ t('quiz.your_score', { score: qcmScore, total: qcmMaxQuestions }) }}</p>
        <button @click="lancerMode('qcm', qcmCurrentType)" class="bg-brandBlue text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition">{{ t('quiz.replay') }}</button>
      </div>
    </div>

    <!-- MODE FLASHCARDS -->
    <div v-if="currentMode === 'flashcards'" class="max-w-xl mx-auto mt-8 text-center space-y-6">
      <div class="flex justify-between items-center text-sm font-medium text-gray-500 dark:text-gray-400 px-4">
        <span>{{ t('quiz.card_x_of_y', { current: flashcardIndex + 1, total: localizedCountries.length }) }}</span>
      </div>

      <div 
        @click="flashcardFlipped = !flashcardFlipped"
        class="h-80 w-full bg-white dark:bg-gray-800 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700 cursor-pointer flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg p-6"
      >
        <div v-if="!flashcardFlipped" class="flex flex-col items-center">
          <img :src="`https://flagcdn.com/w160/${localizedCountries[flashcardIndex].iso}.png`" class="h-28 w-auto mb-8 shadow-sm rounded-md" alt="drapeau">
          <span class="text-gray-400 dark:text-gray-500 text-sm"><i class="fas fa-hand-pointer"></i> {{ t('quiz.click_flip') }}</span>
        </div>
        <div v-else class="flex flex-col items-center">
          <h3 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">{{ localizedCountries[flashcardIndex].name }}</h3>
          <p class="text-xl text-gray-600 dark:text-gray-400 mb-6">{{ t('common.capital') }} : {{ localizedCountries[flashcardIndex].capital }}</p>
          <span class="text-gray-400 dark:text-gray-500 text-sm"><i class="fas fa-undo"></i></span>
        </div>
      </div>

      <div class="flex justify-center gap-4">
        <button @click="flashcardPrecedente" class="p-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"><i class="fas fa-arrow-left"></i></button>
        <button @click="flashcardSuivante" class="p-4 bg-brandBlue text-white rounded-full hover:bg-blue-700 transition"><i class="fas fa-arrow-right"></i></button>
      </div>
    </div>

    <!-- MODE CHRONO (DÉFI EUROPE) -->
    <div v-if="currentMode === 'chrono'" class="max-w-4xl mx-auto mt-8">
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        
        <div class="text-center mb-8">
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">{{ t('home.mode_chrono_title') }}</h3>
          
          <div class="w-full h-[550px] bg-[#aadaff] dark:bg-[#1e3a5f] rounded-xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700 relative z-0">
            <l-map 
              ref="map" 
              v-model:zoom="mapZoom" 
              :center="mapCenter" 
              :use-global-leaflet="false"
              :min-zoom="3.5"
              :max-zoom="7"
              :max-bounds="[[30.0, -30.0], [75.0, 50.0]]"
              :max-bounds-viscosity="1.0"
              :zoom-control="true"
            >
              <l-geo-json 
                v-if="geojsonData" 
                :geojson="geojsonData" 
                :options-style="staticStyleFunction"
              ></l-geo-json>
              
              <l-circle-marker 
                v-for="country in targetCountries" 
                :key="'marker-' + country.id" 
                :lat-lng="[country.lat, country.lng]"
                :radius="getMarkerRadius(country.iso)"
                :color="'#9ca3af'"
                :weight="2"
                :fill-color="paysTrouves.includes(country.iso) ? '#22c55e' : '#fdfdff'"
                :fill-opacity="1"
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

        <div v-if="!isChronoStarted" class="text-center py-4">
          <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">{{ t('quiz.chrono_desc', { total: targetCountries.length }) }}</p>
          <button @click="demarrerChrono" class="bg-brandBlue text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-md">
            {{ t('quiz.start_timer') }}
          </button>
        </div>

        <div v-else>
          <div class="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 bg-white dark:bg-gray-800 border-2 border-brandBlue/20 p-4 rounded-2xl shadow-sm">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-inner transition-colors duration-300" :class="chronoTemps <= 15 && !chronoFini ? 'bg-red-500 animate-pulse' : 'bg-brandBlue'">
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
                :placeholder="t('quiz.input_placeholder')" 
                class="w-full pl-6 pr-4 py-4 rounded-xl border-2 border-brandBlue/40 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-brandBlue focus:ring-4 focus:ring-blue-100 dark:focus:ring-brandBlue/20 text-lg font-bold transition-all shadow-sm"
              >
              <i v-if="chronoFini" class="fas fa-lock absolute right-6 top-5 text-gray-400"></i>
            </div>
          </div>

          <div v-if="chronoFini" class="bg-blue-50 dark:bg-blue-900/20 text-brandBlue dark:text-blue-300 p-4 rounded-xl text-center font-medium mb-8">
            <span v-if="paysTrouves.length === targetCountries.length">{{ t('quiz.success_europe') }}</span>
            <span v-else>{{ t('quiz.time_up', { current: paysTrouves.length }) }}</span>
          </div>

          <div class="border-t border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-sm">
              <div 
                v-for="country in targetCountries" :key="country.id"
                class="border-b border-r border-gray-200 dark:border-gray-700 p-2.5 flex items-center justify-between transition-colors duration-300"
                :class="[
                  paysTrouves.includes(country.iso) ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800/50',
                ]"
              >
                <template v-if="paysTrouves.includes(country.iso)">
                  <span class="font-bold text-green-700 dark:text-green-400">{{ country.name }}</span>
                  <img :src="`https://flagcdn.com/w20/${country.iso}.png`" class="w-4 h-auto shadow-sm rounded-sm">
                </template>
                <template v-else-if="chronoFini">
                  <span class="text-red-500 dark:text-red-400 font-medium">{{ country.name }}</span>
                </template>
                <template v-else>
                  <span class="text-gray-400 dark:text-gray-600">-</span>
                </template>
              </div>
            </div>
          </div>
          
          <div v-if="chronoFini" class="mt-8 text-center">
            <button @click="isChronoStarted = false" class="bg-brandBlue text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition">{{ t('quiz.retry') }}</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue';
import { useI18n } from 'vue-i18n'; 

import "leaflet/dist/leaflet.css";
import { LMap, LGeoJson, LPopup, LCircleMarker } from "@vue-leaflet/vue-leaflet";
import L from 'leaflet';

const { t, locale } = useI18n();

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const mapZoom = ref(3.8); 
const mapCenter = ref([54.0, 15.0]); 
const geojsonData = ref(null);

onMounted(async () => {
  try {
    const res = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
    geojsonData.value = await res.json();
  } catch (e) {
    console.error('Erreur chargement GeoJSON', e);
  }
});

const sauvegarderScore = async (mode, score, maxScore) => {
  const savedUser = localStorage.getItem('geolearn_user');
  if (!savedUser) return; 
  const user = JSON.parse(savedUser);
  try {
    await fetch('http://localhost:3000/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, mode: mode, score: score, max_score: maxScore })
    });
  } catch (error) {
    console.error("Erreur serveur:", error);
  }
};

const countriesData = ref([
  { id: 101, name_fr: 'Albanie', name_en: 'Albania', capital_fr: 'Tirana', capital_en: 'Tirana', continent_en: 'Europe', iso: 'al', lat: 41.3275, lng: 19.8187 },
  { id: 102, name_fr: 'Allemagne', name_en: 'Germany', capital_fr: 'Berlin', capital_en: 'Berlin', continent_en: 'Europe', iso: 'de', lat: 51.1657, lng: 10.4515, cities: ['Munich', 'Hambourg'] },
  { id: 103, name_fr: 'Andorre', name_en: 'Andorra', capital_fr: 'Andorre-la-Vieille', capital_en: 'Andorra la Vella', continent_en: 'Europe', iso: 'ad', lat: 42.5063, lng: 1.5218 },
  { id: 104, name_fr: 'Autriche', name_en: 'Austria', capital_fr: 'Vienne', capital_en: 'Vienna', continent_en: 'Europe', iso: 'at', lat: 47.5162, lng: 14.5501 },
  { id: 105, name_fr: 'Belgique', name_en: 'Belgium', capital_fr: 'Bruxelles', capital_en: 'Brussels', continent_en: 'Europe', iso: 'be', lat: 50.5039, lng: 4.4699 },
  { id: 106, name_fr: 'Biélorussie', name_en: 'Belarus', capital_fr: 'Minsk', capital_en: 'Minsk', continent_en: 'Europe', iso: 'by', lat: 53.7098, lng: 27.9534 },
  { id: 107, name_fr: 'Bosnie-Herzégovine', name_en: 'Bosnia and Herzegovina', capital_fr: 'Sarajevo', capital_en: 'Sarajevo', continent_en: 'Europe', iso: 'ba', lat: 43.9159, lng: 17.6791 },
  { id: 108, name_fr: 'Bulgarie', name_en: 'Bulgaria', capital_fr: 'Sofia', capital_en: 'Sofia', continent_en: 'Europe', iso: 'bg', lat: 42.7339, lng: 25.4858 },
  { id: 109, name_fr: 'Chypre', name_en: 'Cyprus', capital_fr: 'Nicosie', capital_en: 'Nicosia', continent_en: 'Europe', iso: 'cy', lat: 35.1264, lng: 33.4299 },
  { id: 110, name_fr: 'Croatie', name_en: 'Croatia', capital_fr: 'Zagreb', capital_en: 'Zagreb', continent_en: 'Europe', iso: 'hr', lat: 45.1000, lng: 15.2000 },
  { id: 111, name_fr: 'Danemark', name_en: 'Denmark', capital_fr: 'Copenhague', capital_en: 'Copenhagen', continent_en: 'Europe', iso: 'dk', lat: 56.2639, lng: 9.5018 },
  { id: 112, name_fr: 'Espagne', name_en: 'Spain', capital_fr: 'Madrid', capital_en: 'Madrid', continent_en: 'Europe', iso: 'es', lat: 40.4637, lng: -3.7492 },
  { id: 113, name_fr: 'Estonie', name_en: 'Estonia', capital_fr: 'Tallinn', capital_en: 'Tallinn', continent_en: 'Europe', iso: 'ee', lat: 58.5953, lng: 25.0136 },
  { id: 114, name_fr: 'Finlande', name_en: 'Finland', capital_fr: 'Helsinki', capital_en: 'Helsinki', continent_en: 'Europe', iso: 'fi', lat: 61.9241, lng: 25.7482 },
  { id: 115, name_fr: 'France', name_en: 'France', capital_fr: 'Paris', capital_en: 'Paris', continent_en: 'Europe', iso: 'fr', lat: 46.2276, lng: 2.2137 },
  { id: 116, name_fr: 'Grèce', name_en: 'Greece', capital_fr: 'Athènes', capital_en: 'Athens', continent_en: 'Europe', iso: 'gr', lat: 39.0742, lng: 21.8243 },
  { id: 117, name_fr: 'Hongrie', name_en: 'Hungary', capital_fr: 'Budapest', capital_en: 'Budapest', continent_en: 'Europe', iso: 'hu', lat: 47.1625, lng: 19.5033 },
  { id: 118, name_fr: 'Irlande', name_en: 'Ireland', capital_fr: 'Dublin', capital_en: 'Dublin', continent_en: 'Europe', iso: 'ie', lat: 53.1424, lng: -7.6921 },
  { id: 119, name_fr: 'Islande', name_en: 'Iceland', capital_fr: 'Reykjavik', capital_en: 'Reykjavik', continent_en: 'Europe', iso: 'is', lat: 64.9631, lng: -19.0208 },
  { id: 120, name_fr: 'Italie', name_en: 'Italy', capital_fr: 'Rome', capital_en: 'Rome', continent_en: 'Europe', iso: 'it', lat: 41.8719, lng: 12.5674 },
  { id: 121, name_fr: 'Kosovo', name_en: 'Kosovo', capital_fr: 'Pristina', capital_en: 'Pristina', continent_en: 'Europe', iso: 'xk', lat: 42.6026, lng: 20.9030 },
  { id: 122, name_fr: 'Lettonie', name_en: 'Latvia', capital_fr: 'Riga', capital_en: 'Riga', continent_en: 'Europe', iso: 'lv', lat: 56.8796, lng: 24.6032 },
  { id: 123, name_fr: 'Liechtenstein', name_en: 'Liechtenstein', capital_fr: 'Vaduz', capital_en: 'Vaduz', continent_en: 'Europe', iso: 'li', lat: 47.1660, lng: 9.5554 },
  { id: 124, name_fr: 'Lituanie', name_en: 'Lithuania', capital_fr: 'Vilnius', capital_en: 'Vilnius', continent_en: 'Europe', iso: 'lt', lat: 55.1694, lng: 23.8813 },
  { id: 125, name_fr: 'Luxembourg', name_en: 'Luxembourg', capital_fr: 'Luxembourg', capital_en: 'Luxembourg', continent_en: 'Europe', iso: 'lu', lat: 49.8153, lng: 6.1296 },
  { id: 126, name_fr: 'Macédoine du Nord', name_en: 'North Macedonia', capital_fr: 'Skopje', capital_en: 'Skopje', continent_en: 'Europe', iso: 'mk', lat: 41.6086, lng: 21.7453 },
  { id: 127, name_fr: 'Malte', name_en: 'Malta', capital_fr: 'La Valette', capital_en: 'Valletta', continent_en: 'Europe', iso: 'mt', lat: 35.9375, lng: 14.3754 },
  { id: 128, name_fr: 'Moldavie', name_en: 'Moldova', capital_fr: 'Chisinau', capital_en: 'Chisinau', continent_en: 'Europe', iso: 'md', lat: 47.4116, lng: 28.3699 },
  { id: 129, name_fr: 'Monaco', name_en: 'Monaco', capital_fr: 'Monaco', capital_en: 'Monaco', continent_en: 'Europe', iso: 'mc', lat: 43.7384, lng: 7.4246 },
  { id: 130, name_fr: 'Monténégro', name_en: 'Montenegro', capital_fr: 'Podgorica', capital_en: 'Podgorica', continent_en: 'Europe', iso: 'me', lat: 42.7087, lng: 19.3744 },
  { id: 131, name_fr: 'Norvège', name_en: 'Norway', capital_fr: 'Oslo', capital_en: 'Oslo', continent_en: 'Europe', iso: 'no', lat: 60.4720, lng: 8.4689 },
  { id: 132, name_fr: 'Pays-Bas', name_en: 'Netherlands', capital_fr: 'Amsterdam', capital_en: 'Amsterdam', continent_en: 'Europe', iso: 'nl', lat: 52.1326, lng: 5.2913 },
  { id: 133, name_fr: 'Pologne', name_en: 'Poland', capital_fr: 'Varsovie', capital_en: 'Warsaw', continent_en: 'Europe', iso: 'pl', lat: 51.9194, lng: 19.1451 },
  { id: 134, name_fr: 'Portugal', name_en: 'Portugal', capital_fr: 'Lisbonne', capital_en: 'Lisbon', continent_en: 'Europe', iso: 'pt', lat: 39.3999, lng: -8.2245 },
  { id: 135, name_fr: 'République tchèque', name_en: 'Czech Republic', capital_fr: 'Prague', capital_en: 'Prague', continent_en: 'Europe', iso: 'cz', lat: 49.8175, lng: 15.4730 },
  { id: 136, name_fr: 'Roumanie', name_en: 'Romania', capital_fr: 'Bucarest', capital_en: 'Bucharest', continent_en: 'Europe', iso: 'ro', lat: 45.9432, lng: 24.9668 },
  { id: 137, name_fr: 'Royaume-Uni', name_en: 'United Kingdom', capital_fr: 'Londres', capital_en: 'London', continent_en: 'Europe', iso: 'gb', lat: 55.3781, lng: -3.4360 },
  { id: 138, name_fr: 'Russie', name_en: 'Russia', capital_fr: 'Moscou', capital_en: 'Moscow', continent_en: 'Europe', iso: 'ru', lat: 55.7558, lng: 37.6173 },
  { id: 139, name_fr: 'Saint-Marin', name_en: 'San Marino', capital_fr: 'Saint-Marin', capital_en: 'San Marino', continent_en: 'Europe', iso: 'sm', lat: 43.9424, lng: 12.4578 },
  { id: 140, name_fr: 'Serbie', name_en: 'Serbia', capital_fr: 'Belgrade', capital_en: 'Belgrade', continent_en: 'Europe', iso: 'rs', lat: 44.0165, lng: 21.0059 },
  { id: 141, name_fr: 'Slovaquie', name_en: 'Slovakia', capital_fr: 'Bratislava', capital_en: 'Bratislava', continent_en: 'Europe', iso: 'sk', lat: 48.6690, lng: 19.6990 },
  { id: 142, name_fr: 'Slovénie', name_en: 'Slovenia', capital_fr: 'Ljubljana', capital_en: 'Ljubljana', continent_en: 'Europe', iso: 'si', lat: 46.1512, lng: 14.9955 },
  { id: 143, name_fr: 'Suède', name_en: 'Sweden', capital_fr: 'Stockholm', capital_en: 'Stockholm', continent_en: 'Europe', iso: 'se', lat: 60.1282, lng: 18.6435 },
  { id: 144, name_fr: 'Suisse', name_en: 'Switzerland', capital_fr: 'Berne', capital_en: 'Bern', continent_en: 'Europe', iso: 'ch', lat: 46.8182, lng: 8.2275 },
  { id: 145, name_fr: 'Ukraine', name_en: 'Ukraine', capital_fr: 'Kiev', capital_en: 'Kyiv', continent_en: 'Europe', iso: 'ua', lat: 48.3794, lng: 31.1656 },
  { id: 146, name_fr: 'Vatican', name_en: 'Vatican City', capital_fr: 'Vatican', capital_en: 'Vatican City', continent_en: 'Europe', iso: 'va', lat: 41.9029, lng: 12.4534 },
  
  { id: 2, name_fr: 'Japon', name_en: 'Japan', capital_fr: 'Tokyo', capital_en: 'Tokyo', continent_en: 'Asia', iso: 'jp', lat: 36.2048, lng: 138.2529 },
  { id: 3, name_fr: 'Brésil', name_en: 'Brazil', capital_fr: 'Brasilia', capital_en: 'Brasilia', continent_en: 'South America', iso: 'br', lat: -14.2350, lng: -51.9253 },
  { id: 18, name_fr: 'États-Unis', name_en: 'United States', capital_fr: 'Washington', capital_en: 'Washington, D.C.', continent_en: 'North America', iso: 'us', lat: 37.0902, lng: -95.7129 }
]);

// On génère la liste avec les noms dans la bonne langue pour le reste du composant
const localizedCountries = computed(() => {
  return countriesData.value.map(c => {
    const isEn = locale.value === 'en';
    return {
      ...c,
      name: isEn ? c.name_en : c.name_fr,
      capital: isEn ? c.capital_en : c.capital_fr,
      continent: c.continent_en 
    }
  });
});

const currentMode = ref('menu'); 
const retourMenu = () => { currentMode.value = 'menu'; arreterChrono(); };
const lancerMode = (mode, type = null) => {
  currentMode.value = mode;
  if (mode === 'qcm') initQcm(type);
  if (mode === 'flashcards') initFlashcards();
  if (mode === 'chrono') { isChronoStarted.value = false; paysTrouves.value = []; chronoFini.value = false; }
};

// --- FONCTIONS UTILITAIRES POUR LA TRADUCTION INSTANTANÉE DES BOUTONS QCM ---
const getCountry = (id) => countriesData.value.find(c => c.id === id);

const getLocalizedName = (id) => {
  const c = getCountry(id);
  if (!c) return '';
  return locale.value === 'en' ? c.name_en : c.name_fr;
};

const getLocalizedCapital = (id) => {
  const c = getCountry(id);
  if (!c) return '';
  return locale.value === 'en' ? c.capital_en : c.capital_fr;
};

const getIso = (id) => {
  const c = getCountry(id);
  return c ? c.iso : '';
};

// --- LOGIQUE QCM ---
const qcmCurrentType = ref('capital'); 
const qcmQuestionsList = ref([]); // Contient maintenant uniquement les ID des pays
const qcmMaxQuestions = 15;
const qcmIndex = ref(0);
const qcmScore = ref(0);
const qcmOptions = ref([]); // Contient les ID des options
const qcmFini = ref(false);
const qcmSelected = ref(null);
const qcmIsAnswered = ref(false);
const qcmCorrectAnswer = ref('');

const initQcm = (type) => {
  qcmCurrentType.value = type;
  let shuffled = [...countriesData.value].sort(() => 0.5 - Math.random());
  // On ne sauvegarde que les ID pour que la traduction reste dynamique !
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

  // Distracteurs
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

// --- LOGIQUE FLASHCARDS ---
const flashcardIndex = ref(0);
const flashcardFlipped = ref(false);
const initFlashcards = () => { flashcardIndex.value = 0; flashcardFlipped.value = false; };
const flashcardSuivante = () => { if (flashcardIndex.value < localizedCountries.value.length - 1) { flashcardFlipped.value = false; setTimeout(() => { flashcardIndex.value++; }, 150); } };
const flashcardPrecedente = () => { if (flashcardIndex.value > 0) { flashcardFlipped.value = false; setTimeout(() => { flashcardIndex.value--; }, 150); } };

// --- LOGIQUE CHRONO & GEOJSON (DÉFI EUROPE) ---
const isChronoStarted = ref(false);
const chronoTemps = ref(180);
const chronoInput = ref('');
const paysTrouves = ref([]);
const chronoFini = ref(false);
let intervalId = null;

const targetCountries = computed(() => {
  return localizedCountries.value.filter(c => c.continent === 'Europe').sort((a, b) => a.name.localeCompare(b.name));
});

const getMarkerRadius = (iso) => {
  const micro = ['ad', 'li', 'mt', 'mc', 'sm', 'va']; 
  const massive = ['ru', 'fr', 'de', 'es', 'se', 'no', 'fi', 'pl', 'it', 'gb', 'ua', 'ro', 'by']; 
  if (micro.includes(iso)) return 5;
  if (massive.includes(iso)) return 14;
  return 9; 
};

const iso2ToIso3 = {
  al: 'ALB', de: 'DEU', ad: 'AND', at: 'AUT', be: 'BEL', by: 'BLR', ba: 'BIH', bg: 'BGR', cy: 'CYP', hr: 'HRV',
  dk: 'DNK', es: 'ESP', ee: 'EST', fi: 'FIN', fr: 'FRA', gr: 'GRC', hu: 'HUN', ie: 'IRL', is: 'ISL', it: 'ITA',
  xk: 'KOS', lv: 'LVA', li: 'LIE', lt: 'LTU', lu: 'LUX', mk: 'MKD', mt: 'MLT', md: 'MDA', mc: 'MCO', me: 'MNE',
  no: 'NOR', nl: 'NLD', pl: 'POL', pt: 'PRT', cz: 'CZE', ro: 'ROU', gb: 'GBR', ru: 'RUS', sm: 'SMR', rs: 'SRB',
  sk: 'SVK', si: 'SVN', se: 'SWE', ch: 'CHE', ua: 'UKR', va: 'VAT'
};

const staticStyleFunction = (feature) => {
  const iso3Feature = feature.properties.ISO_A3 || '';
  const europeIso3 = targetCountries.value.map(c => iso2ToIso3[c.iso]);
  const isEurope = europeIso3.includes(iso3Feature);

  return {
    fillColor: isEurope ? '#ffffff' : '#e5e7eb',
    weight: 1,
    opacity: 1,
    color: '#d1d5db', 
    fillOpacity: 1
  };
};

const demarrerChrono = () => {
  isChronoStarted.value = true;
  arreterChrono();
  chronoTemps.value = 180;
  chronoInput.value = '';
  paysTrouves.value = [];
  chronoFini.value = false;
  
  intervalId = setInterval(() => {
    if (chronoTemps.value > 0) {
      chronoTemps.value--;
    } else {
      chronoFini.value = true;
      arreterChrono();
      sauvegarderScore('Défi Europe', paysTrouves.value.length, targetCountries.value.length);
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
  const pays = targetCountries.value.find(c => c.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() === inputNormalise);

  if (pays && !paysTrouves.value.includes(pays.iso)) {
    paysTrouves.value.push(pays.iso); 
    chronoInput.value = ''; 
    
    if (paysTrouves.value.length === targetCountries.value.length) {
      chronoFini.value = true;
      arreterChrono();
      sauvegarderScore('Défi Europe', paysTrouves.value.length, targetCountries.value.length);
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
  background-color: #aadaff !important;
}
.dark .leaflet-container {
  background-color: #1e3a5f !important;
}
</style>