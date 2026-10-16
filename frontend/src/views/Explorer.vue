<template>
  <div class="max-w-6xl mx-auto space-y-8">
    
    <!-- En-tête -->
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-500 mb-2">{{ t('explorer.title') }}</h2>
        <p class="text-gray-600 dark:text-gray-400 transition-colors duration-500">{{ t('explorer.subtitle') }}</p>
      </div>
    </div>

    <!-- CARTE INTERACTIVE LEAFLET -->
    <div class="h-[500px] w-full rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 relative z-0">
      <l-map ref="map" v-model:zoom="zoom" :center="center" :use-global-leaflet="false">
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        ></l-tile-layer>
        
        <!-- Marqueurs filtrés dynamiquement -->
        <l-marker 
          v-for="country in filteredCountries.filter(c => c.lat && c.lng)" 
          :key="country.id" 
          :lat-lng="[country.lat, country.lng]"
        >
          <l-popup>
            <div class="text-center p-2 min-w-[120px]">
              <img :src="`https://flagcdn.com/w80/${country.iso}.png`" class="mx-auto mb-3 shadow-sm rounded-sm h-12 w-auto" :alt="country.name">
              <h4 class="font-bold text-gray-900 text-base mb-1">{{ country.name }}</h4>
              <p class="text-sm text-gray-600">{{ t('common.capital') }} : {{ country.capital }}</p>
            </div>
          </l-popup>
        </l-marker>
      </l-map>
    </div>

    <!-- Barre de recherche et filtres fonctionnels -->
    <div class="flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
      <div class="flex-1 relative">
        <i class="fas fa-search absolute left-4 top-3.5 text-gray-400"></i>
        <input 
          type="text" 
          v-model="searchQuery"
          :placeholder="t('explorer.search')" 
          class="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brandBlue transition-all"
        >
      </div>
      <select 
        v-model="selectedContinent"
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
    </div>

    <!-- Grille des cartes pays filtrées -->
    <div v-if="filteredCountries.length > 0" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <!-- Nous passons le pays "traduit" à la carte -->
      <CountryCard 
        v-for="country in filteredCountries" 
        :key="country.id" 
        :country="country" 
      />
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
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n'; 
import CountryCard from '../components/CountryCard.vue';

import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import L from 'leaflet';

const { t, locale } = useI18n(); // On extrait locale pour savoir si on est en 'fr' ou 'en'

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const zoom = ref(4);
const center = ref([48.8566, 2.3522]); 

const searchQuery = ref('');
const selectedContinent = ref('');

// BASE DE DONNÉES BILINGUE
const countriesData = ref([
  { id: 101, name_fr: 'Albanie', name_en: 'Albania', capital_fr: 'Tirana', capital_en: 'Tirana', continent_en: 'Europe', iso: 'al', lat: 41.3275, lng: 19.8187 },
  { id: 102, name_fr: 'Allemagne', name_en: 'Germany', capital_fr: 'Berlin', capital_en: 'Berlin', continent_en: 'Europe', iso: 'de', lat: 51.1657, lng: 10.4515 },
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
  { id: 4, name_fr: 'Canada', name_en: 'Canada', capital_fr: 'Ottawa', capital_en: 'Ottawa', continent_en: 'North America', iso: 'ca', lat: 56.1304, lng: -106.3468 },
  { id: 5, name_fr: 'Maroc', name_en: 'Morocco', capital_fr: 'Rabat', capital_en: 'Rabat', continent_en: 'Africa', iso: 'ma', lat: 31.7917, lng: -7.0926 },
  { id: 6, name_fr: 'Australie', name_en: 'Australia', capital_fr: 'Canberra', capital_en: 'Canberra', continent_en: 'Oceania', iso: 'au', lat: -25.2744, lng: 133.7751 },
  { id: 7, name_fr: 'Inde', name_en: 'India', capital_fr: 'New Delhi', capital_en: 'New Delhi', continent_en: 'Asia', iso: 'in', lat: 20.5937, lng: 78.9629 },
  { id: 18, name_fr: 'États-Unis', name_en: 'United States', capital_fr: 'Washington', capital_en: 'Washington, D.C.', continent_en: 'North America', iso: 'us', lat: 37.0902, lng: -95.7129 },
  { id: 19, name_fr: 'Chine', name_en: 'China', capital_fr: 'Pékin', capital_en: 'Beijing', continent_en: 'Asia', iso: 'cn', lat: 35.8617, lng: 104.1954 },
  { id: 21, name_fr: 'Égypte', name_en: 'Egypt', capital_fr: 'Le Caire', capital_en: 'Cairo', continent_en: 'Africa', iso: 'eg', lat: 26.8206, lng: 30.8025 }
]);

// LA VARIABLE INTELLIGENTE : Elle génère à la volée "name" et "capital" dans la bonne langue !
const localizedCountries = computed(() => {
  return countriesData.value.map(c => {
    // Si anglais, on utilise name_en, sinon name_fr
    const isEn = locale.value === 'en';
    return {
      ...c,
      name: isEn ? c.name_en : c.name_fr,
      capital: isEn ? c.capital_en : c.capital_fr,
      continent: isEn ? c.continent_en : c.continent_en // Pour simplifier le filtre
    }
  });
});

const filteredCountries = computed(() => {
  // On filtre sur la liste traduite (localizedCountries)
  return localizedCountries.value.filter(country => {
    const matchRecherche = country.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                           country.capital.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchContinent = selectedContinent.value === '' || country.continent === selectedContinent.value;
    return matchRecherche && matchContinent;
  });
});
</script>

<style scoped>
.leaflet-container {
  z-index: 10;
}
</style>