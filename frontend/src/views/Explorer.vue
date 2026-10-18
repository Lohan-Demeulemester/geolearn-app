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

    <!-- CARTE INTERACTIVE LEAFLET (VERROUILLÉE SUR LE MONDE SANS RÉPÉTITION) -->
    <div class="h-[500px] w-full rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 relative z-0 bg-[#aad3df] dark:bg-[#1e293b]">
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
        
        <!-- Marqueurs filtrés dynamiquement -->
        <l-marker 
          v-for="country in filteredCountries.filter(c => c.lat && c.lng)" 
          :key="country.id" 
          :lat-lng="[country.lat, country.lng]"
        >
          <l-popup>
            <div class="text-center p-2 min-w-[140px]">
              <img :src="`https://flagcdn.com/w80/${country.iso}.png`" class="mx-auto mb-3 shadow-sm rounded-sm h-12 w-auto" :alt="country.name">
              <h4 class="font-bold text-gray-900 text-base mb-1">{{ country.name }}</h4>
              <p class="text-sm text-gray-600">{{ t('common.capital') }} : <strong>{{ country.capital }}</strong></p>
              <p class="text-xs text-blue-600 font-semibold mt-1">{{ country.subregion }}</p>
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
          class="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 px-1.5 py-0.5 text-sm font-bold"
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

    <!-- GRILLE PAGINÉE DES CARTES PAYS (MAX 4 x 10 = 40 CARTES PAR PAGE) -->
    <div v-if="paginatedCountries.length > 0" class="space-y-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <CountryCard 
          v-for="country in paginatedCountries" 
          :key="country.id" 
          :country="country" 
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
            class="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            ← {{ locale === 'fr' ? 'Précédent' : 'Prev' }}
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            type="button"
            @click="goToPage(page)"
            class="w-10 h-10 rounded-xl text-sm font-bold transition"
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
            class="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
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

  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
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

// Vue mondiale initiale équilibrée
const zoom = ref(2);
const center = ref([20.0, 10.0]);

const searchQuery = ref('');
const selectedContinent = ref('');
const sortBy = ref('name_asc');

// Pagination : 4 colonnes x 10 lignes = 40 cartes par page
const itemsPerPage = 40;
const currentPage = ref(1);

const countriesData = ref(ALL_COUNTRIES);

// Recentre automatiquement la carte quand l'utilisateur filtre par continent
const mapRef = ref(null);

// Recentre parfaitement la carte et force le rafraîchissement Leaflet
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
  
  // Applique les nouvelles coordonnées
  center.value = [...view.center];
  zoom.value = view.zoom;

  // Force Leaflet à recalculer l'affichage pour éviter tout bug de rendu visuel
  await nextTick();
  if (mapRef.value && mapRef.value.leafletObject) {
    mapRef.value.leafletObject.invalidateSize();
    mapRef.value.leafletObject.setView(view.center, view.zoom);
  }
};

// Remettre à la page 1 dès qu'on tape une recherche ou qu'on change de filtre
watch([searchQuery, selectedContinent, sortBy], () => {
  currentPage.value = 1;
});

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
</style>