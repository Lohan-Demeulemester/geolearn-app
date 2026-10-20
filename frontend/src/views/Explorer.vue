<template>
  <div class="max-w-6xl mx-auto space-y-8">
    
    <!-- EN-TÊTE + COMPTEUR DYNAMIQUE -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-500 mb-2">
          {{ t('explorer.title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 transition-colors duration-500">
          {{ t('explorer.subtitle') }}
        </p>
      </div>

      <div class="inline-flex items-center gap-2 bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-xl text-sm font-bold border border-blue-100 dark:border-gray-700">
        <span>{{ filteredCountries.length }}</span>
        <span>{{ locale === 'fr' ? 'pays affichés' : 'countries displayed' }}</span>
      </div>
    </div>

    <!-- CARTE INTERACTIVE LEAFLET -->
    <div ref="mapWrapperRef" class="h-[500px] w-full rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 relative z-0 bg-[#aad3df] dark:bg-[#1e293b]">
      <l-map
        ref="mapRef"
        v-model:zoom="zoom"
        v-model:center="center"
        :min-zoom="2"
        :max-zoom="8"
        :max-bounds="[[-85, -180], [85, 180]]"
        :max-bounds-viscosity="1.0"
        :world-copy-jump="false"
        :use-global-leaflet="false"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
          :no-wrap="true"
          :bounds="[[-85, -180], [85, 180]]"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        ></l-tile-layer>
        
        <!-- Marqueurs cliquables : ouvre directement la carte 3D animée -->
        <l-marker 
          v-for="country in filteredCountries.filter(c => c.lat && c.lng)" 
          :key="country.id" 
          :lat-lng="[country.lat, country.lng]"
          @click="openCountryModal(country)"
        >
          <l-popup>
            <div class="text-center p-2 min-w-[150px]">
              <img :src="`https://flagcdn.com/w80/${country.iso}.png`" class="mx-auto mb-2 shadow-sm rounded-sm h-10 w-auto" :alt="country.name">
              <h4 class="font-bold text-gray-900 text-base mb-0.5">{{ country.name }}</h4>
              <p class="text-xs text-gray-600 mb-2">{{ t('common.capital') }} : <strong>{{ country.capital }}</strong></p>
              <button 
                type="button"
                @click="openCountryModal(country)"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition cursor-pointer"
              >
                {{ locale === 'fr' ? 'Retourner la carte ↻' : 'Flip country card ↻' }}
              </button>
            </div>
          </l-popup>
        </l-marker>
      </l-map>
    </div>

    <!-- BARRE DE RECHERCHE, FILTRE CONTINENT ET TRI -->
    <div class="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <div class="flex-1 relative">
        <i class="fas fa-search absolute left-4 top-3.5 text-gray-400"></i>
        <input 
          type="text" 
          v-model="searchQuery"
          :placeholder="t('explorer.search')" 
          class="w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brandBlue transition-all"
        >
        <button
          v-if="searchQuery"
          type="button"
          @click="searchQuery = ''"
          class="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 px-1.5 py-0.5 text-sm font-bold cursor-pointer"
        >
          ✕
        </button>
      </div>

      <select 
        v-model="selectedContinent"
        @change="onContinentChange"
        class="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brandBlue transition-all min-w-[200px]"
      >
        <option value="">{{ t('common.all_continents') }}</option>
        <option value="Europe">{{ t('common.europe') }}</option>
        <option value="Asia">{{ t('common.asia') }}</option>
        <option value="Africa">{{ t('common.africa') }}</option>
        <option value="North America">{{ t('common.north_america') }}</option>
        <option value="South America">{{ t('common.south_america') }}</option>
        <option value="Oceania">{{ t('common.oceania') }}</option>
      </select>

      <select 
        v-model="sortBy"
        class="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brandBlue transition-all min-w-[180px]"
      >
        <option value="name_asc">{{ locale === 'fr' ? 'Tri : Pays (A → Z)' : 'Sort: Country (A → Z)' }}</option>
        <option value="name_desc">{{ locale === 'fr' ? 'Tri : Pays (Z → A)' : 'Sort: Country (Z → A)' }}</option>
        <option value="capital_asc">{{ locale === 'fr' ? 'Tri : Capitale (A → Z)' : 'Sort: Capital (A → Z)' }}</option>
      </select>
    </div>

    <!-- GRILLE PAGINÉE DES CARTES PAYS (4 x 10 = 40 CARTES PAR PAGE) -->
    <div v-if="paginatedCountries.length > 0" class="space-y-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <CountryCard 
          v-for="country in paginatedCountries" 
          :key="country.id" 
          :country="country"
          @select="openCountryModal"
        />
      </div>

      <!-- CONTRÔLES DE PAGINATION -->
      <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ locale === 'fr'
            ? `Affichage de ${startIndex + 1} à ${Math.min(endIndex, filteredCountries.length)} sur ${filteredCountries.length} pays`
            : `Showing ${startIndex + 1} to ${Math.min(endIndex, filteredCountries.length)} of ${filteredCountries.length} countries` }}
        </p>

        <div class="flex items-center gap-2 flex-wrap justify-center">
          <button
            type="button"
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            ← {{ locale === 'fr' ? 'Précédent' : 'Prev' }}
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            type="button"
            @click="goToPage(page)"
            class="w-10 h-10 rounded-xl text-sm font-bold transition cursor-pointer"
            :class="page === currentPage
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-500'"
          >
            {{ page }}
          </button>

          <button
            type="button"
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            {{ locale === 'fr' ? 'Suivant' : 'Next' }} →
          </button>
        </div>
      </div>
    </div>
    
    <!-- Message si aucun résultat -->
    <div v-else class="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
      <div class="text-4xl mb-4">🌍</div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ t('explorer.no_results') }}</h3>
      <p class="text-gray-500 dark:text-gray-400 mt-2">{{ t('explorer.no_results_desc') }}</p>
    </div>

    <!-- ========================================================================= -->
    <!-- MODALE D'ANIMATION 3D : AGRANDISSEMENT AU CENTRE + RETOURNEMENT (FLIP)     -->
    <!-- ========================================================================= -->
    <transition name="modal-zoom">
      <div 
        v-if="selectedCountry" 
        class="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-md"
        @click.self="closeCountryModal"
      >
        <div class="flip-scene w-full max-w-lg">
          <div 
            class="flip-card-inner" 
            :class="{ 'is-flipped': isModalFlipped }"
            @click="isModalFlipped = !isModalFlipped"
          >
            <!-- ==================== FACE RECTO (AVANT LE FLIP) ==================== -->
            <div class="flip-card-face flip-card-front bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center">
              <img 
                :src="`https://flagcdn.com/w320/${selectedCountry.iso}.png`" 
                :alt="selectedCountry.name"
                class="h-28 w-auto rounded-xl shadow-md mb-6 border border-gray-200 dark:border-gray-700"
              >
              <span class="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300 mb-3">
                {{ selectedCountry.subregion }}
              </span>
              <h3 class="text-3xl font-black text-gray-900 dark:text-white mb-2">
                {{ selectedCountry.name }}
              </h3>
              <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {{ t('common.capital') }} : <strong>{{ selectedCountry.capital }}</strong>
              </p>
              <span class="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {{ locale === 'fr' ? 'Cliquez pour retourner au verso ↻' : 'Click to flip to back ↻' }}
              </span>
            </div>

            <!-- ==================== FACE VERSO (RÉCAPITULATIF COMPLET + FUN FACT) ==================== -->
            <div class="flip-card-face flip-card-back bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col justify-between text-left">
              
              <!-- En-tête du dos de la carte -->
              <div>
                <div class="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-gray-100 dark:border-gray-700">
                  <div class="flex items-center gap-3.5">
                    <img 
                      :src="`https://flagcdn.com/w160/${selectedCountry.iso}.png`" 
                      :alt="selectedCountry.name"
                      class="h-12 w-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 shrink-0"
                    >
                    <div>
                      <span class="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                        {{ selectedCountry.subregion }}
                      </span>
                      <h3 class="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                        {{ selectedCountry.name }}
                      </h3>
                    </div>
                  </div>

                  <button 
                    type="button"
                    @click.stop="closeCountryModal"
                    class="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/40 text-gray-600 dark:text-gray-300 flex items-center justify-center font-bold transition cursor-pointer shrink-0"
                    aria-label="Fermer"
                  >
                    ✕
                  </button>
                </div>

                <!-- Grille des informations clés -->
                <div class="grid grid-cols-2 gap-3 mb-5">
                  <div class="bg-gray-50 dark:bg-gray-900/70 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/70">
                    <span class="text-xs font-semibold text-gray-400 dark:text-gray-500 block mb-0.5">
                      🏛️ {{ t('common.capital') }}
                    </span>
                    <strong class="text-sm font-bold text-gray-900 dark:text-white">
                      {{ selectedCountry.capital }}
                    </strong>
                  </div>

                  <div class="bg-gray-50 dark:bg-gray-900/70 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/70">
                    <span class="text-xs font-semibold text-gray-400 dark:text-gray-500 block mb-0.5">
                      👥 {{ locale === 'fr' ? 'Habitants' : 'Population' }}
                    </span>
                    <strong class="text-sm font-bold text-gray-900 dark:text-white">
                      {{ selectedCountry.population }}
                    </strong>
                  </div>

                  <div class="bg-gray-50 dark:bg-gray-900/70 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/70">
                    <span class="text-xs font-semibold text-gray-400 dark:text-gray-500 block mb-0.5">
                      🗣️ {{ locale === 'fr' ? 'Langue(s) officielle(s)' : 'Official Language(s)' }}
                    </span>
                    <strong class="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">
                      {{ selectedCountry.lang }}
                    </strong>
                  </div>

                  <div class="bg-gray-50 dark:bg-gray-900/70 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/70">
                    <span class="text-xs font-semibold text-gray-400 dark:text-gray-500 block mb-0.5">
                      💶 {{ locale === 'fr' ? 'Monnaie' : 'Currency' }}
                    </span>
                    <strong class="text-sm font-bold text-gray-900 dark:text-white">
                      {{ selectedCountry.currency }}
                    </strong>
                  </div>

                  <div class="bg-gray-50 dark:bg-gray-900/70 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/70">
                    <span class="text-xs font-semibold text-gray-400 dark:text-gray-500 block mb-0.5">
                      📐 {{ locale === 'fr' ? 'Superficie' : 'Area' }}
                    </span>
                    <strong class="text-sm font-bold text-gray-900 dark:text-white">
                      {{ selectedCountry.area }}
                    </strong>
                  </div>

                  <div class="bg-gray-50 dark:bg-gray-900/70 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/70">
                    <span class="text-xs font-semibold text-gray-400 dark:text-gray-500 block mb-0.5">
                      🧭 {{ locale === 'fr' ? 'Code ISO / GPS' : 'ISO / Coordinates' }}
                    </span>
                    <strong class="text-sm font-bold text-gray-900 dark:text-white">
                      {{ selectedCountry.iso3 }} ({{ selectedCountry.lat.toFixed(1) }}°, {{ selectedCountry.lng.toFixed(1) }}°)
                    </strong>
                  </div>
                </div>

                <!-- Encadré Fun Fact -->
                <div class="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/60 rounded-2xl p-4 mb-5">
                  <div class="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300 mb-1.5">
                    <span>💡 {{ locale === 'fr' ? 'Le saviez-vous ? (Fun Fact)' : 'Did you know? (Fun Fact)' }}</span>
                  </div>
                  <p class="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                    {{ selectedCountry.fact }}
                  </p>
                </div>
              </div>

              <!-- Actions de pied de carte -->
              <div class="flex items-center justify-between gap-3 pt-2">
                <button 
                  type="button"
                  @click.stop="focusCountryOnMap(selectedCountry)"
                  class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-4 rounded-xl transition shadow-sm cursor-pointer"
                >
                  📍 {{ locale === 'fr' ? 'Localiser sur la carte' : 'Locate on map' }}
                </button>
                <button 
                  type="button"
                  @click.stop="isModalFlipped = !isModalFlipped"
                  class="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-bold transition cursor-pointer"
                >
                  ↻ {{ locale === 'fr' ? 'Recto' : 'Front' }}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n'; 
import CountryCard from '../components/CountryCard.vue';
import ALL_COUNTRIES from '../data/countries.js';

import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import L from 'leaflet';

const { t, locale } = useI18n();

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const mapRef = ref(null);
const mapWrapperRef = ref(null);
const zoom = ref(2);
const center = ref([20.0, 10.0]);

const searchQuery = ref('');
const selectedContinent = ref('');
const sortBy = ref('name_asc');

// Pagination : 4 colonnes x 10 lignes = 40 cartes par page
const itemsPerPage = 40;
const currentPage = ref(1);

const countriesData = ref(ALL_COUNTRIES);

// État de la carte 3D animée
const selectedCountryId = ref(null);
const isModalFlipped = ref(false);
let flipTimeout = null;

// Récupère le pays sélectionné traduit en temps réel (si l'utilisateur change FR/EN pendant que la carte est ouverte)
const selectedCountry = computed(() => {
  if (!selectedCountryId.value) return null;
  return localizedCountries.value.find(c => c.id === selectedCountryId.value) || null;
});

// Ouvre la carte au centre, puis déclenche le retournement 3D automatique
const openCountryModal = (country) => {
  if (flipTimeout) clearTimeout(flipTimeout);
  selectedCountryId.value = country.id;
  isModalFlipped.value = false;

  // Lance la rotation 3D à 180° juste après l'apparition au centre
  flipTimeout = setTimeout(() => {
    isModalFlipped.value = true;
  }, 160);
};

const closeCountryModal = () => {
  if (flipTimeout) clearTimeout(flipTimeout);
  isModalFlipped.value = false;
  setTimeout(() => {
    selectedCountryId.value = null;
  }, 180);
};

// Permet de fermer avec la touche Échap
const handleKeydown = (e) => {
  if (e.key === 'Escape' && selectedCountryId.value) {
    closeCountryModal();
  }
};

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));

// Bouton "Localiser sur la carte" depuis le verso de la fiche
const focusCountryOnMap = async (country) => {
  closeCountryModal();
  await nextTick();
  if (mapWrapperRef.value) {
    mapWrapperRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  center.value = [country.lat, country.lng];
  zoom.value = 5;
  if (mapRef.value && mapRef.value.leafletObject) {
    mapRef.value.leafletObject.invalidateSize();
    mapRef.value.leafletObject.setView([country.lat, country.lng], 5, { animate: true });
  }
};

// Recentre parfaitement la carte lors du choix d'un continent
const CONTINENT_VIEWS = {
  '': { center: [20.0, 10.0], zoom: 2 },
  'Europe': { center: [52.0, 15.0], zoom: 4 },
  'Asia': { center: [34.0, 90.0], zoom: 3 },
  'Africa': { center: [2.0, 20.0], zoom: 3 },
  'North America': { center: [40.0, -100.0], zoom: 3 },
  'South America': { center: [-15.0, -60.0], zoom: 3 },
  'Oceania': { center: [-25.0, 135.0], zoom: 3 }
};

const onContinentChange = async () => {
  const view = CONTINENT_VIEWS[selectedContinent.value] || CONTINENT_VIEWS[''];
  center.value = [...view.center];
  zoom.value = view.zoom;

  await nextTick();
  if (mapRef.value && mapRef.value.leafletObject) {
    mapRef.value.leafletObject.invalidateSize();
    mapRef.value.leafletObject.setView(view.center, view.zoom);
  }
};

watch([searchQuery, selectedContinent, sortBy], () => {
  currentPage.value = 1;
});

// Génère toutes les données traduites dynamiquement (FR / EN)
const localizedCountries = computed(() => {
  const isEn = locale.value === 'en';
  return countriesData.value.map(c => ({
    ...c,
    name: isEn ? c.name_en : c.name_fr,
    capital: isEn ? c.capital_en : c.capital_fr,
    continent: c.continent_en,
    subregion: isEn ? c.subregion_en : c.subregion_fr,
    population: isEn ? c.population_en : c.population_fr,
    lang: isEn ? c.lang_en : c.lang_fr,
    fact: isEn ? c.fact_en : c.fact_fr
  }));
});

const filteredCountries = computed(() => {
  const q = searchQuery.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  const filtered = localizedCountries.value.filter(country => {
    const cleanName = country.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const cleanCap = country.capital.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const matchRecherche = !q || cleanName.includes(q) || cleanCap.includes(q);
    const matchContinent = selectedContinent.value === '' || country.continent === selectedContinent.value;
    return matchRecherche && matchContinent;
  });

  return [...filtered].sort((a, b) => {
    if (sortBy.value === 'name_desc') return b.name.localeCompare(a.name);
    if (sortBy.value === 'capital_asc') return a.capital.localeCompare(b.capital);
    return a.name.localeCompare(b.name);
  });
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredCountries.value.length / itemsPerPage)));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => startIndex.value + itemsPerPage);

const paginatedCountries = computed(() => {
  return filteredCountries.value.slice(startIndex.value, endIndex.value);
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
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

/* ========================================================= */
/* ANIMATION 3D : PERSPECTIVE, ZOOM CENTRAL ET FLIP 180°     */
/* ========================================================= */
.flip-scene {
  perspective: 1500px;
  margin-bottom: 1.5rem;
}

.flip-card-inner {
  display: grid;
  grid-template-columns: 1fr;
  position: relative;
  width: 100%;
  min-height: 580px;
  transform-style: preserve-3d;
  transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
  cursor: pointer;
}

.flip-card-inner.is-flipped {
  transform: rotateY(180deg);
}

.flip-card-face {
  grid-area: 1 / 1;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.flip-card-front {
  transform: rotateY(0deg);
}

.flip-card-back {
  transform: rotateY(180deg);
}

/* Transition d'ouverture et d'agrandissement au centre de l'écran */
.modal-zoom-enter-active,
.modal-zoom-leave-active {
  transition: opacity 0.3s ease;
}

.modal-zoom-enter-active .flip-scene,
.modal-zoom-leave-active .flip-scene {
  transition: transform 0.38s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-zoom-enter-from,
.modal-zoom-leave-to {
  opacity: 0;
}

.modal-zoom-enter-from .flip-scene,
.modal-zoom-leave-to .flip-scene {
  transform: scale(0.55) translateY(30px);
}
</style>