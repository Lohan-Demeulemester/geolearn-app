<template>
  <div class="max-w-6xl mx-auto space-y-8 pb-12">
    
    <!-- EN-TÊTE + BOUTON COMPARATEUR + PAYS ALÉATOIRE + COMPTEUR -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-500 mb-2">
          {{ t('explorer.title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 transition-colors duration-500">
          {{ t('explorer.subtitle') }}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <!-- Bouton Découverte Aléatoire -->
        <button
          type="button"
          @click="openRandomCountryModal"
          class="px-4 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer flex items-center gap-2 shadow-xs border bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700 hover:border-blue-500"
        >
          <span>🎲</span>
          <span>{{ locale === 'fr' ? 'Pays au hasard' : 'Random Country' }}</span>
        </button>

        <!-- Bouton d'ouverture du Comparateur de Pays -->
        <button
          type="button"
          @click="showComparator = !showComparator"
          class="px-4 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer flex items-center gap-2 shadow-xs border"
          :class="showComparator
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700 hover:border-blue-500'"
        >
          <span>⚖️</span>
          <span>{{ locale === 'fr' ? 'Comparateur de pays' : 'Country Comparator' }}</span>
        </button>

        <div class="inline-flex items-center gap-2 bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-blue-400 px-4 py-2.5 rounded-xl text-sm font-bold border border-blue-100 dark:border-gray-700">
          <span>{{ filteredCountries.length }}</span>
          <span>{{ locale === 'fr' ? 'pays affichés' : 'countries displayed' }}</span>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- PANNEAU COMPARATEUR DE PAYS CÔTE À CÔTE ENRICHI           -->
    <!-- ========================================================= -->
    <div
      v-if="showComparator"
      class="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-md border-2 border-blue-500/30 dark:border-blue-500/30 space-y-6 transition-all"
    >
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-700">
        <div>
          <span class="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
            ⚖️ {{ locale === 'fr' ? 'Outil d\'analyse géographique' : 'Geographic Analysis Tool' }}
          </span>
          <h3 class="text-2xl font-black text-gray-900 dark:text-white">
            {{ locale === 'fr' ? 'Comparateur de Pays Côte à Côte' : 'Side-by-Side Country Comparator' }}
          </h3>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="randomizeComparison"
            class="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-xs font-bold transition cursor-pointer"
          >
            🎲 {{ locale === 'fr' ? 'Duel aléatoire' : 'Random Duel' }}
          </button>
          <button
            type="button"
            @click="showComparator = false"
            class="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-100 hover:text-red-600 font-bold transition cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Sélecteurs des 2 pays + Badge de distance à vol d'oiseau -->
      <div class="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        <div class="md:col-span-5">
          <label class="block text-xs font-bold uppercase text-gray-400 mb-1.5">
            {{ locale === 'fr' ? 'Premier pays' : 'First Country' }}
          </label>
          <select
            v-model="compareIdA"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="c in sortedAllCountries" :key="'compA-' + c.id" :value="c.id">
              {{ c.name }} ({{ c.capital }})
            </option>
          </select>
        </div>

        <div class="md:col-span-1 flex flex-col items-center justify-center py-2">
          <span class="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-black text-xs">
            VS
          </span>
        </div>

        <div class="md:col-span-5">
          <label class="block text-xs font-bold uppercase text-gray-400 mb-1.5">
            {{ locale === 'fr' ? 'Second pays' : 'Second Country' }}
          </label>
          <select
            v-model="compareIdB"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="c in sortedAllCountries" :key="'compB-' + c.id" :value="c.id">
              {{ c.name }} ({{ c.capital }})
            </option>
          </select>
        </div>
      </div>

      <!-- Distance calculée entre les deux pays + Jauge comparative directe -->
      <div v-if="compareCountryA && compareCountryB" class="space-y-4">
        <div class="bg-blue-50/70 dark:bg-gray-900/80 border border-blue-100 dark:border-gray-700 rounded-2xl p-3.5 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
          ✈️ {{ locale === 'fr' ? 'Distance à vol d\'oiseau entre' : 'Flight distance between' }}
          <strong class="text-blue-600 dark:text-blue-400">{{ compareCountryA.name }}</strong>
          {{ locale === 'fr' ? 'et' : 'and' }}
          <strong class="text-emerald-600 dark:text-emerald-400">{{ compareCountryB.name }}</strong> :
          <span class="font-black text-gray-900 dark:text-white ml-1">{{ distanceBetweenCountries }} km</span>
        </div>

        <!-- Barres comparatives visuelles (Population, Superficie, Densité) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-50 dark:bg-gray-900/60 p-4 rounded-2xl border border-gray-200/70 dark:border-gray-700">
          <div v-for="metric in comparisonBars" :key="metric.label" class="space-y-1.5">
            <div class="flex items-center justify-between text-xs font-bold">
              <span class="text-blue-600 dark:text-blue-400">{{ metric.valA }}</span>
              <span class="text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-wider">{{ metric.label }}</span>
              <span class="text-emerald-600 dark:text-emerald-400">{{ metric.valB }}</span>
            </div>
            <div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex">
              <div class="h-full bg-blue-600 transition-all duration-500" :style="{ width: `${metric.pctA}%` }"></div>
              <div class="h-full bg-emerald-500 transition-all duration-500" :style="{ width: `${metric.pctB}%` }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cartes comparatives côte à côte -->
      <div v-if="compareCountryA && compareCountryB" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="(item, idx) in [compareCountryA, compareCountryB]"
          :key="'comp-card-' + idx + '-' + item.id"
          class="bg-gray-50 dark:bg-gray-900/60 rounded-2xl p-5 border border-gray-200/80 dark:border-gray-700 space-y-4"
        >
          <div class="flex items-center justify-between gap-4 pb-3 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-4">
              <img :src="`https://flagcdn.com/w160/${item.iso}.png`" :alt="item.name" class="h-12 w-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" />
              <div>
                <span class="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                  {{ item.subregion }}
                </span>
                <h4 class="text-xl font-black text-gray-900 dark:text-white">{{ item.name }}</h4>
              </div>
            </div>
            <button
              type="button"
              @click="focusCountryOnMap(item)"
              class="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 hover:bg-blue-600 hover:text-white text-gray-700 dark:text-gray-200 text-xs font-bold border border-gray-200 dark:border-gray-700 transition cursor-pointer"
            >
              📍 {{ locale === 'fr' ? 'Voir' : 'Map' }}
            </button>
          </div>

          <div class="grid grid-cols-2 gap-2.5 text-xs">
            <div class="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
              <span class="text-gray-400 block mb-0.5">🏛️ {{ t('common.capital') }}</span>
              <strong class="text-sm font-bold text-gray-900 dark:text-white">{{ item.capital }}</strong>
            </div>
            <div class="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
              <span class="text-gray-400 block mb-0.5">👥 {{ locale === 'fr' ? 'Habitants' : 'Population' }}</span>
              <strong class="text-sm font-bold text-gray-900 dark:text-white">{{ item.population }}</strong>
            </div>
            <div class="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
              <span class="text-gray-400 block mb-0.5">📐 {{ locale === 'fr' ? 'Superficie' : 'Area' }}</span>
              <strong class="text-sm font-bold text-gray-900 dark:text-white">{{ item.area }}</strong>
            </div>
            <div class="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
              <span class="text-gray-400 block mb-0.5">📊 {{ locale === 'fr' ? 'Densité' : 'Density' }}</span>
              <strong class="text-sm font-bold text-gray-900 dark:text-white">{{ item.densityDisplay }}</strong>
            </div>
            <div class="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
              <span class="text-gray-400 block mb-0.5">💶 {{ locale === 'fr' ? 'Monnaie' : 'Currency' }}</span>
              <strong class="text-sm font-bold text-gray-900 dark:text-white">{{ item.currency }}</strong>
            </div>
            <div class="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
              <span class="text-gray-400 block mb-0.5">🗣️ {{ locale === 'fr' ? 'Langue(s)' : 'Language(s)' }}</span>
              <strong class="text-sm font-bold text-gray-900 dark:text-white truncate block" :title="item.lang">{{ item.lang }}</strong>
            </div>
          </div>

          <div class="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/50 rounded-xl p-3.5 text-xs text-gray-700 dark:text-gray-200 leading-relaxed">
            <strong class="text-blue-700 dark:text-blue-300 block mb-1">💡 Fun Fact :</strong>
            {{ item.fact }}
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- CARTE INTERACTIVE LEAFLET (CALQUES COLORÉS + PLEIN ÉCRAN) -->
    <!-- ========================================================= -->
    <div 
      ref="mapWrapperRef" 
      :class="isMapFullscreen 
        ? 'fixed inset-3 sm:inset-6 z-[1500] rounded-3xl overflow-hidden shadow-2xl border-2 border-blue-500 bg-[#aad3df] dark:bg-[#1e293b]' 
        : 'h-[520px] w-full rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 relative z-0 bg-[#aad3df] dark:bg-[#1e293b]'"
    >
      <!-- Sélecteur de coloration thématique en haut à gauche -->
      <div class="absolute top-4 left-14 z-[1000] flex flex-wrap items-center gap-1.5 bg-white/95 dark:bg-gray-900/95 p-1.5 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 backdrop-blur-xs">
        <button
          v-for="mode in mapLayerModes"
          :key="mode.id"
          type="button"
          @click="mapColorMode = mode.id"
          class="px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
          :class="mapColorMode === mode.id
            ? 'bg-blue-600 text-white shadow-2xs'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
        >
          <span>{{ mode.icon }}</span>
          <span class="hidden sm:inline">{{ mode.label }}</span>
        </button>
      </div>

      <!-- Boutons flottants en haut à droite (Recentrage + Plein Écran) -->
      <div class="absolute top-4 right-4 z-[1000] flex items-center gap-2">
        <button
          type="button"
          @click="resetMapView"
          class="bg-white/95 dark:bg-gray-900/95 hover:bg-blue-600 hover:text-white text-gray-800 dark:text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition cursor-pointer flex items-center gap-1.5"
        >
          🌍 {{ locale === 'fr' ? 'Vue Monde' : 'World View' }}
        </button>

        <button
          type="button"
          @click="toggleMapFullscreen"
          class="bg-white/95 dark:bg-gray-900/95 hover:bg-blue-600 hover:text-white text-gray-800 dark:text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition cursor-pointer flex items-center gap-1.5"
        >
          <span>{{ isMapFullscreen ? '✕' : '⛶' }}</span>
          <span>{{ isMapFullscreen ? (locale === 'fr' ? 'Quitter le plein écran' : 'Exit Fullscreen') : (locale === 'fr' ? 'Plein écran' : 'Fullscreen') }}</span>
        </button>
      </div>

      <!-- Légende interactive en bas à gauche (quand un calque thématique est actif) -->
      <div
        v-if="mapColorMode !== 'pins' && activeMapLegend.length > 0"
        class="
          absolute bottom-4 left-4 z-[1000]
          bg-white/95 dark:bg-gray-900/95 backdrop-blur-xs
          px-3.5 py-2.5 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700
          flex flex-wrap items-center gap-3 text-[11px] font-bold text-gray-800 dark:text-gray-200
        "
      >
        <div
          v-for="leg in activeMapLegend"
          :key="leg.label"
          class="flex items-center gap-1.5"
        >
          <span class="w-3 h-3 rounded-full inline-block border border-white/60 shadow-2xs" :style="{ backgroundColor: leg.color }"></span>
          <span>{{ leg.label }}</span>
        </div>
      </div>

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
        
        <!-- Mode 1 : Épingles classiques -->
        <template v-if="mapColorMode === 'pins'">
          <l-marker 
            v-for="country in filteredCountries.filter(c => c.lat && c.lng)" 
            :key="'pin-' + country.id" 
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
        </template>

        <!-- Mode 2 : Cercles thématiques colorés (Continent, Population, Superficie, Densité) -->
        <template v-else>
          <l-circle-marker
            v-for="country in filteredCountries.filter(c => c.lat && c.lng)"
            :key="'cm-' + country.id"
            :lat-lng="[country.lat, country.lng]"
            :radius="getThematicMarkerRadius(country)"
            :color="'#ffffff'"
            :weight="2"
            :fill-color="getThematicMarkerColor(country)"
            :fill-opacity="0.92"
            @click="openCountryModal(country)"
          >
            <l-popup>
              <div class="text-center p-2 min-w-[160px]">
                <img :src="`https://flagcdn.com/w80/${country.iso}.png`" class="mx-auto mb-2 shadow-sm rounded-sm h-9 w-auto" :alt="country.name">
                <h4 class="font-bold text-gray-900 text-base mb-0.5">{{ country.name }}</h4>
                <p class="text-xs text-gray-600 mb-1">{{ t('common.capital') }} : <strong>{{ country.capital }}</strong></p>
                <p class="text-[11px] font-bold text-blue-600 mb-2">
                  👥 {{ country.population }} • 📐 {{ country.area }}
                </p>
                <button 
                  type="button"
                  @click="openCountryModal(country)"
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition cursor-pointer"
                >
                  {{ locale === 'fr' ? 'Ouvrir la fiche 3D ↻' : 'Open 3D card ↻' }}
                </button>
              </div>
            </l-popup>
          </l-circle-marker>
        </template>
      </l-map>
    </div>

    <!-- ========================================================= -->
    <!-- BARRE DE RECHERCHE & FILTRES AVANCÉS (6 CRITÈRES)         -->
    <!-- ========================================================= -->
    <div class="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4 transition-colors">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- 1. Recherche (Pays, Capitale, Langue, Monnaie, ISO) -->
        <div class="relative">
          <i class="fas fa-search absolute left-4 top-3.5 text-gray-400"></i>
          <input 
            type="text" 
            v-model="searchQuery"
            :placeholder="locale === 'fr' ? 'Pays, capitale, langue, monnaie...' : 'Country, capital, language, currency...'" 
            class="w-full pl-11 pr-9 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brandBlue transition-all"
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

        <!-- 2. Continent -->
        <select 
          v-model="selectedContinent"
          @change="onContinentChange"
          class="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brandBlue transition-all"
        >
          <option value="">{{ t('common.all_continents') }}</option>
          <option value="Europe">{{ t('common.europe') }}</option>
          <option value="Asia">{{ t('common.asia') }}</option>
          <option value="Africa">{{ t('common.africa') }}</option>
          <option value="North America">{{ t('common.north_america') }}</option>
          <option value="South America">{{ t('common.south_america') }}</option>
          <option value="Oceania">{{ t('common.oceania') }}</option>
        </select>

        <!-- 3. Sous-région dynamique -->
        <select 
          v-model="selectedSubregion"
          class="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brandBlue transition-all"
        >
          <option value="">{{ locale === 'fr' ? 'Toutes les sous-régions' : 'All Subregions' }}</option>
          <option v-for="sub in availableSubregions" :key="sub" :value="sub">
            {{ sub }}
          </option>
        </select>

        <!-- 4. NOUVEAU : Filtre par tranche de Population -->
        <select 
          v-model="selectedPopBracket"
          class="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brandBlue transition-all"
        >
          <option value="">👥 {{ locale === 'fr' ? 'Toutes les populations' : 'All Populations' }}</option>
          <option value="under1m">{{ locale === 'fr' ? 'Moins de 1 million d\'hab.' : 'Under 1M inhabitants' }}</option>
          <option value="1m_10m">{{ locale === 'fr' ? 'De 1 M à 10 millions d\'hab.' : '1M to 10M inhabitants' }}</option>
          <option value="10m_50m">{{ locale === 'fr' ? 'De 10 M à 50 millions d\'hab.' : '10M to 50M inhabitants' }}</option>
          <option value="over50m">{{ locale === 'fr' ? 'Plus de 50 millions d\'hab.' : 'Over 50M inhabitants' }}</option>
        </select>

        <!-- 5. NOUVEAU : Filtre par tranche de Superficie -->
        <select 
          v-model="selectedAreaBracket"
          class="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brandBlue transition-all"
        >
          <option value="">📐 {{ locale === 'fr' ? 'Toutes les superficies' : 'All Areas' }}</option>
          <option value="micro">{{ locale === 'fr' ? 'Petits États (< 25 000 km²)' : 'Small States (< 25,000 km²)' }}</option>
          <option value="medium">{{ locale === 'fr' ? 'Taille moyenne (25k – 300k km²)' : 'Medium Size (25k – 300k km²)' }}</option>
          <option value="large">{{ locale === 'fr' ? 'Grands pays (300k – 1M km²)' : 'Large Countries (300k – 1M km²)' }}</option>
          <option value="giant">{{ locale === 'fr' ? 'États-Continents (> 1M km²)' : 'Giant States (> 1M km²)' }}</option>
        </select>

        <!-- 6. Tri enrichi (Alphabétique, Population, Superficie, Densité) -->
        <select 
          v-model="sortBy"
          class="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brandBlue transition-all"
        >
          <option value="name_asc">{{ locale === 'fr' ? 'Tri : Pays (A → Z)' : 'Sort: Country (A → Z)' }}</option>
          <option value="name_desc">{{ locale === 'fr' ? 'Tri : Pays (Z → A)' : 'Sort: Country (Z → A)' }}</option>
          <option value="capital_asc">{{ locale === 'fr' ? 'Tri : Capitale (A → Z)' : 'Sort: Capital (A → Z)' }}</option>
          <option value="pop_desc">👥 {{ locale === 'fr' ? 'Tri : Population (+ vers -)' : 'Sort: Population (High → Low)' }}</option>
          <option value="pop_asc">👥 {{ locale === 'fr' ? 'Tri : Population (- vers +)' : 'Sort: Population (Low → High)' }}</option>
          <option value="area_desc">📐 {{ locale === 'fr' ? 'Tri : Superficie (+ vers -)' : 'Sort: Area (High → Low)' }}</option>
          <option value="area_asc">📐 {{ locale === 'fr' ? 'Tri : Superficie (- vers +)' : 'Sort: Area (Low → High)' }}</option>
          <option value="density_desc">📊 {{ locale === 'fr' ? 'Tri : Densité hab./km² (+ vers -)' : 'Sort: Density (High → Low)' }}</option>
        </select>
      </div>

      <!-- Bouton de réinitialisation rapide si au moins un filtre est actif -->
      <div v-if="hasActiveFilters" class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700 text-xs">
        <span class="text-gray-500 dark:text-gray-400 font-semibold">
          {{ locale === 'fr'
            ? `${filteredCountries.length} pays correspondent à vos filtres actifs.`
            : `${filteredCountries.length} countries match your active filters.` }}
        </span>
        <button
          type="button"
          @click="clearAllFilters"
          class="text-red-600 dark:text-red-400 font-extrabold hover:underline cursor-pointer"
        >
          ✕ {{ locale === 'fr' ? 'Réinitialiser tous les filtres' : 'Reset all filters' }}
        </button>
      </div>
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
        class="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-md overflow-y-auto"
        @click.self="closeCountryModal"
      >
        <div class="flip-scene w-full max-w-lg my-auto">
          <div 
            class="flip-card-inner" 
            :class="{ 'is-flipped': isModalFlipped }"
            @click="isModalFlipped = !isModalFlipped"
          >
            <!-- FACE RECTO -->
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

            <!-- FACE VERSO -->
            <div class="flip-card-face flip-card-back bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col justify-between text-left">
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
                      📊 {{ locale === 'fr' ? 'Densité' : 'Density' }}
                    </span>
                    <strong class="text-sm font-bold text-gray-900 dark:text-white">
                      {{ selectedCountry.densityDisplay }}
                    </strong>
                  </div>
                </div>

                <div class="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/60 rounded-2xl p-4 mb-5">
                  <div class="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300 mb-1.5">
                    <span>💡 {{ locale === 'fr' ? 'Le saviez-vous ? (Fun Fact)' : 'Did you know? (Fun Fact)' }}</span>
                  </div>
                  <p class="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                    {{ selectedCountry.fact }}
                  </p>
                </div>
              </div>

              <!-- Actions de pied de carte : Localiser + Comparer + Recto -->
              <div class="flex flex-wrap items-center justify-between gap-2.5 pt-2">
                <button 
                  type="button"
                  @click.stop="focusCountryOnMap(selectedCountry)"
                  class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition shadow-sm cursor-pointer"
                >
                  📍 {{ locale === 'fr' ? 'Localiser' : 'Locate' }}
                </button>
                <button 
                  type="button"
                  @click.stop="sendToComparator(selectedCountry)"
                  class="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-xs sm:text-sm font-bold transition cursor-pointer"
                >
                  ⚖️ {{ locale === 'fr' ? 'Comparer' : 'Compare' }}
                </button>
                <button 
                  type="button"
                  @click.stop="isModalFlipped = !isModalFlipped"
                  class="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs sm:text-sm font-bold transition cursor-pointer"
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
import { LMap, LTileLayer, LMarker, LPopup, LCircleMarker } from "@vue-leaflet/vue-leaflet";
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
const isMapFullscreen = ref(false);
const mapColorMode = ref('continent'); // 'pins' | 'continent' | 'population' | 'area' | 'density'

const searchQuery = ref('');
const selectedContinent = ref('');
const selectedSubregion = ref('');
const selectedPopBracket = ref('');
const selectedAreaBracket = ref('');
const sortBy = ref('name_asc');

const itemsPerPage = 40;
const currentPage = ref(1);

const countriesData = ref(ALL_COUNTRIES);

// Convertit les chaînes de population ("68,4 M", "1,42 Md", "38 000") en nombre exact
const parseNumericPopulation = (popStr = '') => {
  if (!popStr) return 0;
  const s = popStr.toString().replace(',', '.').trim();
  const num = parseFloat(s.replace(/[^\d.]/g, '')) || 0;
  if (/Md|B/i.test(s)) return num * 1_000_000_000;
  if (/M/i.test(s)) return num * 1_000_000;
  if (/K/i.test(s)) return num * 1_000;
  return parseFloat(s.replace(/\s+/g, '')) || 0;
};

// Convertit les chaînes de superficie ("551 695 km²") en nombre exact en km²
const parseNumericArea = (areaStr = '') => {
  if (!areaStr) return 0;
  const cleaned = areaStr.toString().replace(/km²|km2/gi, '').replace(/\s+/g, '').replace(',', '.').trim();
  return parseFloat(cleaned.replace(/[^\d.]/g, '')) || 0;
};

// Mode Plein Écran de la carte Leaflet
const toggleMapFullscreen = async () => {
  isMapFullscreen.value = !isMapFullscreen.value;
  await nextTick();
  setTimeout(() => {
    if (mapRef.value && mapRef.value.leafletObject) {
      mapRef.value.leafletObject.invalidateSize();
    }
  }, 150);
};

const resetMapView = async () => {
  selectedContinent.value = '';
  selectedSubregion.value = '';
  await onContinentChange();
};

// Données traduites dynamiquement avec calcul de Population, Superficie et Densité
const localizedCountries = computed(() => {
  const isEn = locale.value === 'en';
  return countriesData.value.map((c, idx) => {
    const popNum = parseNumericPopulation(c.population_fr);
    const areaNum = parseNumericArea(c.area);
    const density = areaNum > 0 ? Math.round(popNum / areaNum) : 0;
    return {
      ...c,
      id: c.id ?? idx + 1,
      name: isEn ? c.name_en : c.name_fr,
      capital: isEn ? c.capital_en : c.capital_fr,
      continent: c.continent_en,
      subregion: isEn ? c.subregion_en : c.subregion_fr,
      population: isEn ? c.population_en : c.population_fr,
      populationNumeric: popNum,
      areaNumeric: areaNum,
      densityNumeric: density,
      densityDisplay: `${density.toLocaleString()} hab./km²`,
      lang: isEn ? c.lang_en : c.lang_fr,
      fact: isEn ? c.fact_en : c.fact_fr
    };
  });
});

// Modes de calques thématiques sur la carte
const mapLayerModes = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'continent', icon: '🌍', label: isFr ? 'Continents' : 'Continents' },
    { id: 'population', icon: '👥', label: isFr ? 'Population' : 'Population' },
    { id: 'area', icon: '📐', label: isFr ? 'Superficie' : 'Area' },
    { id: 'density', icon: '📊', label: isFr ? 'Densité' : 'Density' },
    { id: 'pins', icon: '📍', label: isFr ? 'Épingles' : 'Pins' }
  ];
});

const CONTINENT_COLORS = {
  'Europe': '#3b82f6',
  'Asia': '#ef4444',
  'Africa': '#f59e0b',
  'North America': '#10b981',
  'South America': '#8b5cf6',
  'Oceania': '#06b6d4'
};

const getThematicMarkerColor = (country) => {
  if (mapColorMode.value === 'continent') {
    return CONTINENT_COLORS[country.continent] || '#3b82f6';
  }
  if (mapColorMode.value === 'population') {
    const p = country.populationNumeric;
    if (p >= 50_000_000) return '#dc2626';
    if (p >= 10_000_000) return '#f97316';
    if (p >= 1_000_000) return '#eab308';
    return '#22c55e';
  }
  if (mapColorMode.value === 'area') {
    const a = country.areaNumeric;
    if (a >= 1_000_000) return '#7c3aed';
    if (a >= 300_000) return '#2563eb';
    if (a >= 25_000) return '#06b6d4';
    return '#10b981';
  }
  if (mapColorMode.value === 'density') {
    const d = country.densityNumeric;
    if (d >= 300) return '#be123c';
    if (d >= 100) return '#f59e0b';
    if (d >= 30) return '#3b82f6';
    return '#10b981';
  }
  return '#2563eb';
};

const getThematicMarkerRadius = (country) => {
  if (mapColorMode.value === 'population') {
    const p = country.populationNumeric;
    if (p >= 100_000_000) return 12;
    if (p >= 20_000_000) return 9;
    if (p >= 2_000_000) return 7;
    return 5.5;
  }
  if (mapColorMode.value === 'area') {
    const a = country.areaNumeric;
    if (a >= 1_000_000) return 12;
    if (a >= 300_000) return 9;
    if (a >= 25_000) return 7;
    return 5.5;
  }
  return 7.5;
};

const activeMapLegend = computed(() => {
  const isFr = locale.value === 'fr';
  if (mapColorMode.value === 'continent') {
    return [
      { color: '#3b82f6', label: 'Europe' },
      { color: '#ef4444', label: isFr ? 'Asie' : 'Asia' },
      { color: '#f59e0b', label: isFr ? 'Afrique' : 'Africa' },
      { color: '#10b981', label: isFr ? 'Am. Nord' : 'N. America' },
      { color: '#8b5cf6', label: isFr ? 'Am. Sud' : 'S. America' },
      { color: '#06b6d4', label: isFr ? 'Océanie' : 'Oceania' }
    ];
  }
  if (mapColorMode.value === 'population') {
    return [
      { color: '#22c55e', label: '< 1 M' },
      { color: '#eab308', label: '1 M – 10 M' },
      { color: '#f97316', label: '10 M – 50 M' },
      { color: '#dc2626', label: '> 50 M' }
    ];
  }
  if (mapColorMode.value === 'area') {
    return [
      { color: '#10b981', label: '< 25k km²' },
      { color: '#06b6d4', label: '25k – 300k km²' },
      { color: '#2563eb', label: '300k – 1M km²' },
      { color: '#7c3aed', label: '> 1M km²' }
    ];
  }
  if (mapColorMode.value === 'density') {
    return [
      { color: '#10b981', label: '< 30 hab./km²' },
      { color: '#3b82f6', label: '30 – 100' },
      { color: '#f59e0b', label: '100 – 300' },
      { color: '#be123c', label: '> 300 hab./km²' }
    ];
  }
  return [];
});

const sortedAllCountries = computed(() =>
  [...localizedCountries.value].sort((a, b) => a.name.localeCompare(b.name))
);

// Sous-régions disponibles selon le continent choisi
const availableSubregions = computed(() => {
  let base = localizedCountries.value;
  if (selectedContinent.value) {
    base = base.filter(c => c.continent === selectedContinent.value);
  }
  const set = new Set(base.map(c => c.subregion).filter(Boolean));
  return [...set].sort((a, b) => a.localeCompare(b));
});

// Comparateur de pays côte à côte
const showComparator = ref(false);
const compareIdA = ref(15); // France par défaut
const compareIdB = ref(67); // Japon par défaut

const compareCountryA = computed(() =>
  localizedCountries.value.find(c => c.id === compareIdA.value) || localizedCountries.value[0]
);
const compareCountryB = computed(() =>
  localizedCountries.value.find(c => c.id === compareIdB.value) || localizedCountries.value[1]
);

const comparisonBars = computed(() => {
  const a = compareCountryA.value;
  const b = compareCountryB.value;
  if (!a || !b) return [];
  const isFr = locale.value === 'fr';

  const buildBar = (label, numA, numB, textA, textB) => {
    const sum = Math.max(1, numA + numB);
    const pctA = Math.max(8, Math.min(92, Math.round((numA / sum) * 100)));
    return { label, valA: textA, valB: textB, pctA, pctB: 100 - pctA };
  };

  return [
    buildBar(isFr ? 'Population' : 'Population', a.populationNumeric, b.populationNumeric, a.population, b.population),
    buildBar(isFr ? 'Superficie' : 'Area', a.areaNumeric, b.areaNumeric, a.area, b.area),
    buildBar(isFr ? 'Densité' : 'Density', a.densityNumeric, b.densityNumeric, a.densityDisplay, b.densityDisplay)
  ];
});

const randomizeComparison = () => {
  const list = localizedCountries.value;
  const idxA = Math.floor(Math.random() * list.length);
  let idxB = Math.floor(Math.random() * list.length);
  if (idxB === idxA) idxB = (idxA + 1) % list.length;
  compareIdA.value = list[idxA].id;
  compareIdB.value = list[idxB].id;
};

const sendToComparator = (country) => {
  compareIdA.value = country.id;
  closeCountryModal();
  showComparator.value = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Calcul de la distance à vol d'oiseau (Formule de Haversine en km)
const distanceBetweenCountries = computed(() => {
  const a = compareCountryA.value;
  const b = compareCountryB.value;
  if (!a || !b) return 0;
  const toRad = deg => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  const dist = 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
  return Math.round(dist).toLocaleString(locale.value === 'fr' ? 'fr-FR' : 'en-US');
});

// État de la carte 3D animée
const selectedCountryId = ref(null);
const isModalFlipped = ref(false);
let flipTimeout = null;

const selectedCountry = computed(() => {
  if (!selectedCountryId.value) return null;
  return localizedCountries.value.find(c => c.id === selectedCountryId.value) || null;
});

const openCountryModal = (country) => {
  if (flipTimeout) clearTimeout(flipTimeout);
  selectedCountryId.value = country.id;
  isModalFlipped.value = false;

  flipTimeout = setTimeout(() => {
    isModalFlipped.value = true;
  }, 160);
};

const openRandomCountryModal = () => {
  const pool = filteredCountries.value.length > 0 ? filteredCountries.value : localizedCountries.value;
  const randomItem = pool[Math.floor(Math.random() * pool.length)];
  if (randomItem) openCountryModal(randomItem);
};

const closeCountryModal = () => {
  if (flipTimeout) clearTimeout(flipTimeout);
  isModalFlipped.value = false;
  setTimeout(() => {
    selectedCountryId.value = null;
  }, 180);
};

const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    if (selectedCountryId.value) closeCountryModal();
    else if (isMapFullscreen.value) toggleMapFullscreen();
  }
};

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));

const focusCountryOnMap = async (country) => {
  closeCountryModal();
  await nextTick();
  if (mapWrapperRef.value && !isMapFullscreen.value) {
    mapWrapperRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  center.value = [country.lat, country.lng];
  zoom.value = 5;
  if (mapRef.value && mapRef.value.leafletObject) {
    mapRef.value.leafletObject.invalidateSize();
    mapRef.value.leafletObject.setView([country.lat, country.lng], 5, { animate: true });
  }
};

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
  selectedSubregion.value = '';
  const view = CONTINENT_VIEWS[selectedContinent.value] || CONTINENT_VIEWS[''];
  center.value = [...view.center];
  zoom.value = view.zoom;

  await nextTick();
  if (mapRef.value && mapRef.value.leafletObject) {
    mapRef.value.leafletObject.invalidateSize();
    mapRef.value.leafletObject.setView(view.center, view.zoom);
  }
};

const hasActiveFilters = computed(() =>
  Boolean(
    searchQuery.value ||
    selectedContinent.value ||
    selectedSubregion.value ||
    selectedPopBracket.value ||
    selectedAreaBracket.value
  )
);

const clearAllFilters = () => {
  searchQuery.value = '';
  selectedContinent.value = '';
  selectedSubregion.value = '';
  selectedPopBracket.value = '';
  selectedAreaBracket.value = '';
  sortBy.value = 'name_asc';
  onContinentChange();
};

watch([searchQuery, selectedContinent, selectedSubregion, selectedPopBracket, selectedAreaBracket, sortBy], () => {
  currentPage.value = 1;
});

const filteredCountries = computed(() => {
  const q = searchQuery.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  const filtered = localizedCountries.value.filter(country => {
    const cleanName = country.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const cleanCap = country.capital.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const cleanLang = (country.lang || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const cleanCurr = (country.currency || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const cleanIso = (country.iso || '').toLowerCase();

    const matchRecherche =
      !q ||
      cleanName.includes(q) ||
      cleanCap.includes(q) ||
      cleanLang.includes(q) ||
      cleanCurr.includes(q) ||
      cleanIso === q;

    const matchContinent = selectedContinent.value === '' || country.continent === selectedContinent.value;
    const matchSubregion = selectedSubregion.value === '' || country.subregion === selectedSubregion.value;

    let matchPop = true;
    const p = country.populationNumeric;
    if (selectedPopBracket.value === 'under1m') matchPop = p < 1_000_000;
    else if (selectedPopBracket.value === '1m_10m') matchPop = p >= 1_000_000 && p <= 10_000_000;
    else if (selectedPopBracket.value === '10m_50m') matchPop = p > 10_000_000 && p <= 50_000_000;
    else if (selectedPopBracket.value === 'over50m') matchPop = p > 50_000_000;

    let matchArea = true;
    const a = country.areaNumeric;
    if (selectedAreaBracket.value === 'micro') matchArea = a < 25_000;
    else if (selectedAreaBracket.value === 'medium') matchArea = a >= 25_000 && a <= 300_000;
    else if (selectedAreaBracket.value === 'large') matchArea = a > 300_000 && a <= 1_000_000;
    else if (selectedAreaBracket.value === 'giant') matchArea = a > 1_000_000;

    return matchRecherche && matchContinent && matchSubregion && matchPop && matchArea;
  });

  return [...filtered].sort((a, b) => {
    if (sortBy.value === 'name_desc') return b.name.localeCompare(a.name);
    if (sortBy.value === 'capital_asc') return a.capital.localeCompare(b.capital);
    if (sortBy.value === 'pop_desc') return b.populationNumeric - a.populationNumeric;
    if (sortBy.value === 'pop_asc') return a.populationNumeric - b.populationNumeric;
    if (sortBy.value === 'area_desc') return b.areaNumeric - a.areaNumeric;
    if (sortBy.value === 'area_asc') return a.areaNumeric - b.areaNumeric;
    if (sortBy.value === 'density_desc') return b.densityNumeric - a.densityNumeric;
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

.flip-scene {
  perspective: 1500px;
}

.flip-card-inner {
  display: grid;
  grid-template-columns: 1fr;
  position: relative;
  width: 100%;
  min-height: 520px;
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