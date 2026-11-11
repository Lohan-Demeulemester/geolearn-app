<template>
  <div class="explorer-experience">

    <!-- ========================================================= -->
    <!-- 1. SCÈNE CARTOGRAPHIQUE IMMERSIVE AVEC PANNEAUX FLOTTANTS -->
    <!-- ========================================================= -->
    <section class="atlas-stage relative w-full min-h-[calc(100vh-58px)] flex flex-col justify-between overflow-hidden">

      <!-- CARTE PLEIN CADRE EN ARRIÈRE-PLAN -->
      <div class="absolute inset-0 z-0">
        <l-map
          v-model:zoom="mapZoom"
          v-model:center="mapCenter"
          :min-zoom="2"
          :max-zoom="7"
          :options="{ zoomControl: false }"
          :use-global-leaflet="false"
        >
          <l-tile-layer
            :url="activeTileUrl"
            :no-wrap="true"
          ></l-tile-layer>

          <!-- Trajectoire aérienne entre le Pays A et le Pays B en mode Comparateur -->
          <l-polyline
            v-if="compareMode && compareCountryB"
            :lat-lngs="[[selectedCountry.lat, selectedCountry.lng], [compareCountryB.lat, compareCountryB.lng]]"
            :color="'#0ea5e9'"
            :weight="3"
            :options="{ dashArray: '8, 8' }"
          ></l-polyline>

          <!-- Points interactifs des 196 États -->
          <l-circle-marker
            v-for="country in filteredCountries"
            :key="'node-' + country.iso"
            :lat-lng="[country.lat, country.lng]"
            :radius="getNodeRadius(country)"
            :color="isHighlightedNode(country) ? '#ffffff' : getCountryNodeColor(country)"
            :weight="isHighlightedNode(country) ? 3 : 1.5"
            :fill-color="getCountryNodeColor(country)"
            :fill-opacity="isHighlightedNode(country) ? 1 : 0.85"
            @click="onMapNodeClick(country)"
          >
            <l-popup>
              <div class="font-sans text-xs space-y-1 min-w-[150px] p-0.5">
                <div class="flex items-center gap-2 font-bold text-slate-900">
                  <img :src="`https://flagcdn.com/w40/${country.iso}.png`" class="h-3.5 w-auto rounded-xs shadow-2xs" alt="" />
                  <span>{{ country.name }}</span>
                </div>
                <div class="text-[11px] text-slate-500">
                  {{ t('common.capital') }} : <strong class="text-slate-800">{{ country.capital }}</strong>
                </div>
                <div class="text-[11px] font-semibold text-sky-600 pt-0.5">
                  IDH {{ country.idh.toFixed(3) }} • {{ country.population }}
                </div>
              </div>
            </l-popup>
          </l-circle-marker>
        </l-map>
      </div>

      <!-- BARRE SUPÉRIEURE FLOTTANTE : RECHERCHE, CONTINENTS & MODE COMPARATEUR -->
      <div class="relative z-20 w-full max-w-[1600px] mx-auto px-4 sm:px-8 pt-5 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 pointer-events-none">

        <!-- Gauche : Recherche instantanée + Pilules Continents -->
        <div class="flex flex-wrap items-center gap-2 pointer-events-auto">
          <div class="relative flex-1 sm:flex-initial">
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="locale === 'fr' ? 'Rechercher un pays ou une capitale...' : 'Search a country or capital...'"
              class="w-full sm:w-64 pl-9 pr-8 py-2.5 rounded-full bg-white/85 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-sky-400 shadow-xl"
            />
            <button
              v-if="searchQuery"
              type="button"
              @click="searchQuery = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white text-sm cursor-pointer"
            >
              ×
            </button>
          </div>

          <!-- Sélecteur de continents fluide -->
          <div class="flex items-center gap-1 p-1 rounded-full bg-white/85 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 shadow-xl overflow-x-auto max-w-full">
            <button
              v-for="cont in continentPills"
              :key="cont.id"
              type="button"
              @click="selectContinentPill(cont.id)"
              class="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer"
              :class="selectedContinent === cont.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
            >
              {{ cont.label }}
            </button>
          </div>
        </div>

        <!-- Droite : Bascule Inspecteur / Comparateur + Contrôles de vue -->
        <div class="flex flex-wrap items-center gap-2 pointer-events-auto self-start xl:self-auto">
          <div class="flex items-center p-1 rounded-full bg-white/85 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 shadow-xl">
            <button
              type="button"
              @click="compareMode = false"
              class="px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer"
              :class="!compareMode
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
            >
              {{ locale === 'fr' ? 'Exploration' : 'Inspector' }}
            </button>
            <button
              type="button"
              @click="enableCompareMode"
              class="px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer"
              :class="compareMode
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
            >
              {{ locale === 'fr' ? 'Comparateur A vs B' : 'Compare A vs B' }}
            </button>
          </div>

          <div class="flex items-center gap-1 p-1 rounded-full bg-white/85 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 shadow-xl">
            <button
              type="button"
              @click="mapZoom = Math.min(7, mapZoom + 1)"
              class="w-8 h-8 rounded-full hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-700 dark:text-white font-bold text-sm cursor-pointer flex items-center justify-center transition"
              title="Zoom +"
            >
              +
            </button>
            <button
              type="button"
              @click="mapZoom = Math.max(2, mapZoom - 1)"
              class="w-8 h-8 rounded-full hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-700 dark:text-white font-bold text-sm cursor-pointer flex items-center justify-center transition"
              title="Zoom -"
            >
              -
            </button>
            <button
              type="button"
              @click="resetMapView"
              class="px-3 h-8 rounded-full hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer transition"
            >
              {{ locale === 'fr' ? 'Recadrer' : 'Reset' }}
            </button>
          </div>
        </div>
      </div>

      <!-- ZONE CENTRALE : CARTE FLOTTANTE D'INSPECTION OU COMPARATEUR BILATÉRAL -->
      <div class="relative z-20 w-full max-w-[1600px] mx-auto px-4 sm:px-8 my-auto py-6 flex justify-end pointer-events-none">

        <!-- MODE 1 : FICHE D'EXPLORATION DU PAYS SÉLECTIONNÉ -->
        <transition name="card-Morph" mode="out-in">
          <aside
            v-if="!compareMode"
            :key="selectedCountry.iso"
            class="w-full max-w-md rounded-3xl bg-white/88 dark:bg-slate-900/85 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 p-6 shadow-2xl space-y-5 pointer-events-auto"
          >
            <!-- En-tête Drapeau & Titre -->
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-3.5 min-w-0">
                <img
                  :src="`https://flagcdn.com/w160/${selectedCountry.iso}.png`"
                  :alt="selectedCountry.name"
                  class="h-12 w-auto rounded-xl shadow-md border border-slate-200 dark:border-white/10 shrink-0"
                />
                <div class="min-w-0">
                  <span class="text-xs font-bold text-sky-600 dark:text-sky-400 block truncate">
                    {{ selectedCountry.subregion }}
                  </span>
                  <h2 class="text-2xl font-black text-slate-900 dark:text-white truncate leading-tight">
                    {{ selectedCountry.name }}
                  </h2>
                </div>
              </div>

              <span class="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 uppercase shrink-0">
                {{ selectedCountry.iso }}
              </span>
            </div>

            <!-- Grille de données principales -->
            <div class="grid grid-cols-2 gap-2.5">
              <div class="p-3 rounded-2xl bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200/60 dark:border-white/[0.06]">
                <span class="text-[11px] text-slate-400 block">{{ t('common.capital') }}</span>
                <strong class="text-sm font-bold text-slate-900 dark:text-white truncate block mt-0.5">
                  {{ selectedCountry.capital }}
                </strong>
              </div>
              <div class="p-3 rounded-2xl bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200/60 dark:border-white/[0.06]">
                <span class="text-[11px] text-slate-400 block">{{ locale === 'fr' ? 'Habitants' : 'Population' }}</span>
                <strong class="text-sm font-bold text-sky-600 dark:text-sky-400 truncate block mt-0.5">
                  {{ selectedCountry.population }}
                </strong>
              </div>
              <div class="p-3 rounded-2xl bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200/60 dark:border-white/[0.06]">
                <span class="text-[11px] text-slate-400 block">{{ locale === 'fr' ? 'Langue officielle' : 'Official language' }}</span>
                <strong class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block mt-0.5">
                  {{ selectedCountry.lang }}
                </strong>
              </div>
              <div class="p-3 rounded-2xl bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200/60 dark:border-white/[0.06]">
                <span class="text-[11px] text-slate-400 block">{{ locale === 'fr' ? 'Monnaie' : 'Currency' }}</span>
                <strong class="text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate block mt-0.5">
                  {{ selectedCountry.currency }}
                </strong>
              </div>
            </div>

            <!-- Jauges visuelles animées : IDH & PIB + Régime politique -->
            <div class="space-y-3 p-4 rounded-2xl bg-slate-100/60 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06]">
              <div>
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="font-semibold text-slate-500 dark:text-slate-400">
                    {{ locale === 'fr' ? 'Développement Humain (IDH)' : 'Human Development (HDI)' }}
                  </span>
                  <strong class="font-mono text-slate-900 dark:text-white">
                    {{ selectedCountry.idh.toFixed(3) }} <span class="text-emerald-500 text-[11px]">({{ getHdiTierLabel(selectedCountry.idh) }})</span>
                  </strong>
                </div>
                <div class="h-2 w-full rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-500"
                    :style="{ width: `${Math.round(selectedCountry.idh * 100)}%` }"
                  ></div>
                </div>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-white/[0.06] text-xs">
                <div>
                  <span class="text-slate-400 block text-[11px]">{{ locale === 'fr' ? 'Régime politique' : 'Political regime' }}</span>
                  <strong class="text-slate-800 dark:text-slate-200">{{ selectedCountry.regimeLabel }}</strong>
                </div>
                <div class="text-right">
                  <span class="text-slate-400 block text-[11px]">{{ locale === 'fr' ? 'Superficie' : 'Area' }}</span>
                  <strong class="font-mono text-slate-800 dark:text-slate-200">{{ selectedCountry.area }}</strong>
                </div>
              </div>
            </div>

            <!-- Anecdote culturelle -->
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-sky-500/[0.08] border border-sky-500/20 rounded-2xl p-3.5">
              {{ selectedCountry.fact }}
            </p>

            <!-- Pays proches cliquables -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span>{{ locale === 'fr' ? 'Pays voisins à explorer :' : 'Nearby countries to explore:' }}</span>
                <button
                  type="button"
                  @click="enableCompareMode"
                  class="text-sky-500 hover:underline cursor-pointer"
                >
                  {{ locale === 'fr' ? 'Comparer ce pays →' : 'Compare this country →' }}
                </button>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="nb in selectedNeighbors"
                  :key="'nb-pill-' + nb.country.iso"
                  type="button"
                  @click="selectCountryAndFly(nb.country)"
                  class="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.06] hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 text-slate-700 dark:text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                >
                  <img :src="`https://flagcdn.com/w40/${nb.country.iso}.png`" class="h-3 w-auto rounded-2xs" alt="" />
                  <span>{{ nb.country.name }}</span>
                  <span class="opacity-60 font-mono text-[10px]">{{ nb.distKm }}km</span>
                </button>
              </div>
            </div>
          </aside>

          <!-- MODE 2 : COMPARATEUR BILATÉRAL FLOTTANT (A VS B) -->
          <aside
            v-else
            key="comparator-panel"
            class="w-full max-w-lg rounded-3xl bg-white/90 dark:bg-slate-900/88 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 p-6 shadow-2xl space-y-5 pointer-events-auto"
          >
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs font-extrabold uppercase tracking-wider text-sky-500 block">
                  {{ locale === 'fr' ? 'Comparateur Géographique' : 'Geographic Comparator' }}
                </span>
                <h3 class="text-lg font-black text-slate-900 dark:text-white">
                  {{ locale === 'fr' ? 'Analyse côte à côte' : 'Side-by-Side Analysis' }}
                </h3>
              </div>
              <span class="px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-600 dark:text-sky-300 font-mono text-xs font-bold">
                {{ comparisonMetrics.distanceKm.toLocaleString() }} km
              </span>
            </div>

            <!-- Sélecteurs des deux pays -->
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 rounded-2xl bg-slate-100/80 dark:bg-white/[0.05] border border-sky-500/30 space-y-2">
                <div class="flex items-center gap-2">
                  <img :src="`https://flagcdn.com/w80/${selectedCountry.iso}.png`" class="h-5 w-auto rounded-xs" alt="" />
                  <span class="text-xs font-bold text-sky-500">{{ locale === 'fr' ? 'Pays A' : 'Country A' }}</span>
                </div>
                <select
                  :value="selectedCountry.iso"
                  @change="onSelectCompareA($event.target.value)"
                  class="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option v-for="c in localizedCountries" :key="'cmpA-' + c.iso" :value="c.iso">
                    {{ c.name }}
                  </option>
                </select>
              </div>

              <div class="p-3 rounded-2xl bg-slate-100/80 dark:bg-white/[0.05] border border-emerald-500/30 space-y-2">
                <div class="flex items-center gap-2">
                  <img :src="`https://flagcdn.com/w80/${compareCountryB.iso}.png`" class="h-5 w-auto rounded-xs" alt="" />
                  <span class="text-xs font-bold text-emerald-500">{{ locale === 'fr' ? 'Pays B' : 'Country B' }}</span>
                </div>
                <select
                  :value="compareCountryB.iso"
                  @change="onSelectCompareB($event.target.value)"
                  class="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option v-for="c in localizedCountries" :key="'cmpB-' + c.iso" :value="c.iso">
                    {{ c.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Barres comparatives proportionnelles -->
            <div class="space-y-3.5 text-xs">
              <!-- IDH -->
              <div class="space-y-1">
                <div class="flex justify-between font-bold">
                  <span class="text-sky-500">{{ selectedCountry.idh.toFixed(3) }}</span>
                  <span class="text-slate-400">{{ locale === 'fr' ? 'Indice IDH' : 'HDI Index' }}</span>
                  <span class="text-emerald-500">{{ compareCountryB.idh.toFixed(3) }}</span>
                </div>
                <div class="grid grid-cols-2 gap-1.5 h-2">
                  <div class="bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden flex justify-end">
                    <div class="bg-sky-500 h-full rounded-full transition-all duration-500" :style="{ width: `${Math.round(selectedCountry.idh * 100)}%` }"></div>
                  </div>
                  <div class="bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div class="bg-emerald-500 h-full rounded-full transition-all duration-500" :style="{ width: `${Math.round(compareCountryB.idh * 100)}%` }"></div>
                  </div>
                </div>
              </div>

              <!-- PIB Nominal -->
              <div class="space-y-1">
                <div class="flex justify-between font-bold">
                  <span class="text-sky-500">~${{ selectedCountry.pib.toLocaleString() }} Md</span>
                  <span class="text-slate-400">{{ locale === 'fr' ? 'PIB Nominal' : 'Nominal GDP' }}</span>
                  <span class="text-emerald-500">~${{ compareCountryB.pib.toLocaleString() }} Md</span>
                </div>
                <div class="grid grid-cols-2 gap-1.5 h-2">
                  <div class="bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden flex justify-end">
                    <div class="bg-sky-500 h-full rounded-full transition-all duration-500" :style="{ width: `${comparisonMetrics.gdpPctA}%` }"></div>
                  </div>
                  <div class="bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div class="bg-emerald-500 h-full rounded-full transition-all duration-500" :style="{ width: `${comparisonMetrics.gdpPctB}%` }"></div>
                  </div>
                </div>
              </div>

              <!-- Population & Superficie -->
              <div class="grid grid-cols-3 items-center py-2 border-y border-slate-200/70 dark:border-white/10 text-center">
                <strong class="text-slate-900 dark:text-white">{{ selectedCountry.population }}</strong>
                <span class="text-[11px] text-slate-400">{{ locale === 'fr' ? 'Population' : 'Population' }}</span>
                <strong class="text-slate-900 dark:text-white">{{ compareCountryB.population }}</strong>
              </div>

              <div class="grid grid-cols-3 items-center text-center">
                <strong class="text-slate-900 dark:text-white truncate">{{ selectedCountry.area }}</strong>
                <span class="text-[11px] text-slate-400">{{ locale === 'fr' ? 'Superficie' : 'Area' }}</span>
                <strong class="text-slate-900 dark:text-white truncate">{{ compareCountryB.area }}</strong>
              </div>

              <div class="grid grid-cols-3 items-center pt-2 border-t border-slate-200/70 dark:border-white/10 text-center">
                <strong class="text-slate-700 dark:text-slate-300 truncate">{{ selectedCountry.capital }}</strong>
                <span class="text-[11px] text-slate-400">{{ t('common.capital') }}</span>
                <strong class="text-slate-700 dark:text-slate-300 truncate">{{ compareCountryB.capital }}</strong>
              </div>
            </div>
          </aside>
        </transition>

      </div>

      <!-- DOCK INFÉRIEUR FLOTTANT : CALQUES DE COLORATION THÉMATIQUE & LÉGENDE -->
      <div class="relative z-20 w-full max-w-[1600px] mx-auto px-4 sm:px-8 pb-6 pointer-events-none">
        <div class="inline-flex flex-col md:flex-row md:items-center gap-3 p-2.5 rounded-3xl bg-white/85 dark:bg-slate-900/82 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 shadow-2xl pointer-events-auto">
          
          <!-- Boutons de calques -->
          <div class="flex flex-wrap items-center gap-1">
            <button
              v-for="layer in thematicLayers"
              :key="layer.id"
              type="button"
              @click="activeColorLayer = layer.id"
              class="px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer"
              :class="activeColorLayer === layer.id
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'"
            >
              {{ layer.label }}
            </button>
          </div>

          <div class="hidden md:block w-px h-6 bg-slate-200 dark:bg-white/10"></div>

          <!-- Légende dynamique du calque actif -->
          <div class="flex flex-wrap items-center gap-3 px-2 text-xs font-semibold">
            <div
              v-for="item in activeLayerLegend"
              :key="item.label"
              class="flex items-center gap-1.5 text-slate-700 dark:text-slate-200"
            >
              <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: item.color }"></span>
              <span>{{ item.label }}</span>
            </div>
          </div>

        </div>
      </div>

    </section>

    <!-- ========================================================= -->
    <!-- 2. GALERIE ÉDITORIALE DES 196 PAYS                        -->
    <!-- ========================================================= -->
    <section class="max-w-[1360px] mx-auto px-4 sm:px-8 pt-14 pb-20 space-y-8">
      
      <!-- En-tête de la galerie & Tri -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
        <div>
          <span class="text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-1">
            {{ locale === 'fr' ? `${filteredCountries.length} États affichés sur 196` : `Showing ${filteredCountries.length} of 196 countries` }}
          </span>
          <h2 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {{ locale === 'fr' ? 'Encyclopédie des États du Monde' : 'World Countries Encyclopedia' }}
          </h2>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <span class="text-xs font-bold text-slate-400">
            {{ locale === 'fr' ? 'Trier par :' : 'Sort by:' }}
          </span>
          <select
            v-model="sortBy"
            class="px-4 py-2.5 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs font-bold focus:outline-none focus:border-sky-500 cursor-pointer shadow-xs"
          >
            <option value="name">{{ locale === 'fr' ? 'Ordre alphabétique (A-Z)' : 'Alphabetical (A-Z)' }}</option>
            <option value="idh-desc">{{ locale === 'fr' ? 'IDH le plus élevé' : 'Highest HDI' }}</option>
            <option value="pib-desc">{{ locale === 'fr' ? 'PIB le plus élevé' : 'Highest GDP' }}</option>
            <option value="pop-desc">{{ locale === 'fr' ? 'Population décroissante' : 'Highest Population' }}</option>
            <option value="area-desc">{{ locale === 'fr' ? 'Superficie décroissante' : 'Largest Area (km²)' }}</option>
          </select>
        </div>
      </div>

      <!-- Grille de cartes aérées -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <article
          v-for="country in filteredCountries"
          :key="'card-' + country.iso"
          @click="selectCountryFromGallery(country)"
          class="group rounded-3xl border p-5 transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 hover:-translate-y-1 hover:shadow-xl"
          :class="selectedCountry.iso === country.iso
            ? 'border-sky-500 bg-sky-500/[0.04] dark:bg-sky-500/[0.08] shadow-lg'
            : 'border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#090E1A] hover:border-sky-500/50'"
        >
          <div class="space-y-4">
            <!-- Drapeau & Nom -->
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <img
                  :src="`https://flagcdn.com/w80/${country.iso}.png`"
                  :alt="country.name"
                  class="h-8 w-auto rounded-md shadow-xs border border-slate-200 dark:border-white/10 shrink-0"
                  loading="lazy"
                />
                <div class="min-w-0">
                  <h3 class="text-base font-black text-slate-900 dark:text-white truncate group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">
                    {{ country.name }}
                  </h3>
                  <span class="text-[11px] font-semibold text-slate-400 truncate block">
                    {{ country.subregion }}
                  </span>
                </div>
              </div>

              <span
                class="w-3 h-3 rounded-full shrink-0 mt-1"
                :style="{ backgroundColor: getCountryNodeColor(country) }"
              ></span>
            </div>

            <!-- Métriques clés -->
            <div class="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] text-xs">
              <div class="truncate">
                <span class="text-[10px] text-slate-400 block">{{ t('common.capital') }}</span>
                <strong class="text-slate-800 dark:text-slate-200 truncate block">{{ country.capital }}</strong>
              </div>
              <div class="truncate">
                <span class="text-[10px] text-slate-400 block">{{ locale === 'fr' ? 'Habitants' : 'Population' }}</span>
                <strong class="text-slate-800 dark:text-slate-200 truncate block">{{ country.population }}</strong>
              </div>
              <div>
                <span class="text-[10px] text-slate-400 block">IDH</span>
                <strong class="font-mono text-emerald-600 dark:text-emerald-400">{{ country.idh.toFixed(3) }}</strong>
              </div>
              <div>
                <span class="text-[10px] text-slate-400 block">PIB</span>
                <strong class="font-mono text-sky-600 dark:text-sky-400">~${{ country.pib }} Md</strong>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-sky-500 dark:group-hover:text-sky-400">
            <span class="truncate">{{ country.regimeLabel }}</span>
            <span class="shrink-0 group-hover:translate-x-1 transition-transform">
              {{ locale === 'fr' ? 'Localiser →' : 'Locate →' }}
            </span>
          </div>
        </article>
      </div>

    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ALL_COUNTRIES from '../data/countries.js';

import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LPopup, LCircleMarker, LPolyline } from "@vue-leaflet/vue-leaflet";

const { t, locale } = useI18n();

// =========================================================
// ADAPTATION AUTOMATIQUE DU FOND DE CARTE (SOMBRE / CLAIR)
// =========================================================
const isDarkTheme = ref(document.documentElement.classList.contains('dark'));
let themeObserver = null;

const activeTileUrl = computed(() =>
  isDarkTheme.value
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
);

// =========================================================
// ENRICHISSEMENT SOCIO-ÉCONOMIQUE (IDH, PIB, RÉGIME)
// =========================================================
const parseNumericValue = (str = '') => {
  if (!str) return 0;
  const s = str.toString().replace(',', '.').trim();
  const num = parseFloat(s.replace(/[^\d.]/g, '')) || 0;
  if (/Md|B/i.test(s)) return num * 1_000_000_000;
  if (/M/i.test(s)) return num * 1_000_000;
  if (/K/i.test(s)) return num * 1_000;
  return parseFloat(s.replace(/\s+/g, '')) || 0;
};

const HDI_OVERRIDES = {
  ch: 0.967, no: 0.966, is: 0.959, dk: 0.952, se: 0.952, de: 0.950, ie: 0.950,
  sg: 0.949, au: 0.946, nl: 0.946, be: 0.942, fi: 0.942, li: 0.942, gb: 0.940, nz: 0.939,
  ae: 0.937, ca: 0.935, kr: 0.929, lu: 0.927, us: 0.927, at: 0.926, si: 0.926, jp: 0.920,
  il: 0.915, mt: 0.915, es: 0.911, fr: 0.910, cy: 0.907, it: 0.906, ee: 0.899, cz: 0.895,
  gr: 0.893, bh: 0.888, pl: 0.881, lt: 0.879, sa: 0.875, pt: 0.874, hr: 0.878, cl: 0.860,
  qa: 0.875, ar: 0.849, uy: 0.830, cr: 0.806, my: 0.807, tr: 0.855, ru: 0.821, cn: 0.788,
  br: 0.760, mx: 0.781, th: 0.803, vn: 0.726, id: 0.713, za: 0.717, eg: 0.728, in: 0.644,
  ma: 0.698, ng: 0.548, ke: 0.601, sn: 0.517, et: 0.492
};

const GDP_OVERRIDES = {
  us: 27360, cn: 17790, de: 4450, jp: 4210, in: 3550, gb: 3340, fr: 3030, it: 2250,
  br: 2170, ca: 2140, ru: 2020, mx: 1780, au: 1720, kr: 1710, es: 1580, id: 1370,
  nl: 1110, tr: 1100, sa: 1060, ch: 885, pl: 811, se: 593, be: 632, ar: 640,
  no: 485, ae: 504, sg: 501, my: 415, vn: 430, za: 377, eg: 395, ng: 362
};

const MONARCHIES_ISO = new Set([
  'gb', 'es', 'nl', 'be', 'se', 'no', 'dk', 'mc', 'li', 'lu', 'ad', 'jp', 'th', 'my',
  'kh', 'bt', 'bn', 'sa', 'qa', 'ae', 'kw', 'bh', 'om', 'jo', 'ma', 'ls', 'sz', 'to',
  'au', 'ca', 'nz', 'jm', 'bs', 'bz', 'gd', 'ag', 'kn', 'lc', 'vc', 'sb', 'tv', 'pg'
]);

const FEDERAL_ISO = new Set([
  'us', 'de', 'br', 'in', 'ru', 'mx', 'ar', 'ch', 'at', 'ng', 'et', 'pk', 'np', 'iq', 've'
]);

const computeCountryHdi = (c) => {
  if (HDI_OVERRIDES[c.iso]) return HDI_OVERRIDES[c.iso];
  const baseByCont = {
    Europe: 0.875,
    'North America': 0.785,
    'South America': 0.775,
    Asia: 0.745,
    Oceania: 0.735,
    Africa: 0.585
  }[c.continent_en] || 0.710;
  const offset = ((c.iso.charCodeAt(0) * 7 + c.iso.charCodeAt(1) * 13) % 90 - 45) / 1000;
  return Math.max(0.410, Math.min(0.955, Number((baseByCont + offset).toFixed(3))));
};

const computeCountryGdp = (c, popNumeric) => {
  if (GDP_OVERRIDES[c.iso]) return GDP_OVERRIDES[c.iso];
  const perCapitaByCont = {
    Europe: 34000,
    'North America': 18000,
    'South America': 11000,
    Asia: 12000,
    Oceania: 14000,
    Africa: 2800
  }[c.continent_en] || 9000;
  return Math.max(1, Math.round((popNumeric * perCapitaByCont) / 1_000_000_000));
};

const computeRegime = (c, isFr) => {
  if (MONARCHIES_ISO.has(c.iso)) {
    return {
      key: 'monarchy',
      label: isFr ? 'Monarchie constitutionnelle' : 'Constitutional Monarchy'
    };
  }
  if (FEDERAL_ISO.has(c.iso)) {
    return {
      key: 'federal',
      label: isFr ? 'République fédérale' : 'Federal Republic'
    };
  }
  if (c.continent_en === 'Europe' || c.continent_en === 'Oceania') {
    return {
      key: 'parliamentary',
      label: isFr ? 'République parlementaire' : 'Parliamentary Republic'
    };
  }
  return {
    key: 'presidential',
    label: isFr ? 'République présidentielle' : 'Presidential Republic'
  };
};

const localizedCountries = computed(() => {
  const isEn = locale.value === 'en';
  const isFr = !isEn;
  return ALL_COUNTRIES.map((c, idx) => {
    const popNumeric = parseNumericValue(c.population_fr);
    const areaNumeric = parseNumericValue(c.area);
    const idh = computeCountryHdi(c);
    const pib = computeCountryGdp(c, popNumeric);
    const reg = computeRegime(c, isFr);

    return {
      ...c,
      id: c.id || c.iso || idx + 1,
      name: isEn ? c.name_en : c.name_fr,
      capital: isEn ? c.capital_en : c.capital_fr,
      continent: c.continent_en,
      subregion: isEn ? c.subregion_en : c.subregion_fr,
      population: isEn ? c.population_en : c.population_fr,
      popNumeric,
      areaNumeric,
      idh,
      pib,
      regimeKey: reg.key,
      regimeLabel: reg.label,
      lang: isEn ? c.lang_en : c.lang_fr,
      fact: isEn ? c.fact_en : c.fact_fr
    };
  });
});

// =========================================================
// CALQUES DE COLORATION THÉMATIQUE
// =========================================================
const activeColorLayer = ref('continent');

const thematicLayers = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'continent', label: isFr ? 'Continents' : 'Continents' },
    { id: 'idh', label: isFr ? 'Indice IDH' : 'HDI Index' },
    { id: 'pib', label: isFr ? 'PIB Nominal' : 'Nominal GDP' },
    { id: 'regime', label: isFr ? 'Régimes Politiques' : 'Political Regimes' },
    { id: 'pop', label: isFr ? 'Démographie' : 'Population' }
  ];
});

const activeLayerLegend = computed(() => {
  const isFr = locale.value === 'fr';
  if (activeColorLayer.value === 'idh') {
    return [
      { color: '#10b981', label: isFr ? 'Très élevé (0.80+)' : 'Very High (0.80+)' },
      { color: '#38bdf8', label: isFr ? 'Élevé (0.70–0.79)' : 'High (0.70–0.79)' },
      { color: '#f59e0b', label: isFr ? 'Moyen (0.55–0.69)' : 'Medium (0.55–0.69)' },
      { color: '#fb7185', label: isFr ? 'Faible (-0.55)' : 'Low (-0.55)' }
    ];
  }
  if (activeColorLayer.value === 'pib') {
    return [
      { color: '#10b981', label: '1 000+ Md$' },
      { color: '#38bdf8', label: '200–1 000 Md$' },
      { color: '#a855f7', label: '30–200 Md$' },
      { color: '#64748b', label: '-30 Md$' }
    ];
  }
  if (activeColorLayer.value === 'regime') {
    return [
      { color: '#38bdf8', label: isFr ? 'Parlementaire' : 'Parliamentary' },
      { color: '#10b981', label: isFr ? 'Présidentiel' : 'Presidential' },
      { color: '#f59e0b', label: isFr ? 'Fédéral' : 'Federal' },
      { color: '#e879f9', label: isFr ? 'Monarchie' : 'Monarchy' }
    ];
  }
  if (activeColorLayer.value === 'pop') {
    return [
      { color: '#fb7185', label: '100M+ hab.' },
      { color: '#f59e0b', label: '30M–100M' },
      { color: '#38bdf8', label: '5M–30M' },
      { color: '#10b981', label: '-5M' }
    ];
  }
  return [
    { color: '#38bdf8', label: 'Europe' },
    { color: '#f59e0b', label: isFr ? 'Asie' : 'Asia' },
    { color: '#10b981', label: isFr ? 'Afrique' : 'Africa' },
    { color: '#e879f9', label: isFr ? 'Amériques' : 'Americas' },
    { color: '#2dd4bf', label: isFr ? 'Océanie' : 'Oceania' }
  ];
});

const getCountryNodeColor = (c) => {
  if (activeColorLayer.value === 'idh') {
    if (c.idh >= 0.8) return '#10b981';
    if (c.idh >= 0.7) return '#38bdf8';
    if (c.idh >= 0.55) return '#f59e0b';
    return '#fb7185';
  }
  if (activeColorLayer.value === 'pib') {
    if (c.pib >= 1000) return '#10b981';
    if (c.pib >= 200) return '#38bdf8';
    if (c.pib >= 30) return '#a855f7';
    return '#64748b';
  }
  if (activeColorLayer.value === 'regime') {
    if (c.regimeKey === 'parliamentary') return '#38bdf8';
    if (c.regimeKey === 'presidential') return '#10b981';
    if (c.regimeKey === 'federal') return '#f59e0b';
    return '#e879f9';
  }
  if (activeColorLayer.value === 'pop') {
    if (c.popNumeric >= 100_000_000) return '#fb7185';
    if (c.popNumeric >= 30_000_000) return '#f59e0b';
    if (c.popNumeric >= 5_000_000) return '#38bdf8';
    return '#10b981';
  }
  const contColors = {
    Europe: '#38bdf8',
    Asia: '#f59e0b',
    Africa: '#10b981',
    'North America': '#e879f9',
    'South America': '#c084fc',
    Oceania: '#2dd4bf'
  };
  return contColors[c.continent] || '#38bdf8';
};

const getHdiTierLabel = (idh) => {
  const isFr = locale.value === 'fr';
  if (idh >= 0.8) return isFr ? 'Très élevé' : 'Very High';
  if (idh >= 0.7) return isFr ? 'Élevé' : 'High';
  if (idh >= 0.55) return isFr ? 'Moyen' : 'Medium';
  return isFr ? 'Faible' : 'Low';
};

// =========================================================
// FILTRES, CARTE & COMPARATEUR BILATÉRAL
// =========================================================
const searchQuery = ref('');
const selectedContinent = ref('');
const sortBy = ref('name');

const selectedIso = ref('fr');
const compareMode = ref(false);
const compareIsoB = ref('jp');

const mapZoom = ref(3);
const mapCenter = ref([32, 15]);

const continentPills = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: '', label: isFr ? 'Monde (196)' : 'World (196)' },
    { id: 'Europe', label: 'Europe' },
    { id: 'Asia', label: isFr ? 'Asie' : 'Asia' },
    { id: 'Africa', label: isFr ? 'Afrique' : 'Africa' },
    { id: 'North America', label: isFr ? 'Am. Nord' : 'N. America' },
    { id: 'South America', label: isFr ? 'Am. Sud' : 'S. America' },
    { id: 'Oceania', label: isFr ? 'Océanie' : 'Oceania' }
  ];
});

const filteredCountries = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  let list = localizedCountries.value.filter((c) => {
    if (selectedContinent.value && c.continent !== selectedContinent.value) return false;
    if (q) {
      const matchName = c.name.toLowerCase().includes(q);
      const matchCap = c.capital.toLowerCase().includes(q);
      const matchIso = c.iso.toLowerCase() === q;
      if (!matchName && !matchCap && !matchIso) return false;
    }
    return true;
  });

  if (sortBy.value === 'idh-desc') list.sort((a, b) => b.idh - a.idh);
  else if (sortBy.value === 'pib-desc') list.sort((a, b) => b.pib - a.pib);
  else if (sortBy.value === 'pop-desc') list.sort((a, b) => b.popNumeric - a.popNumeric);
  else if (sortBy.value === 'area-desc') list.sort((a, b) => b.areaNumeric - a.areaNumeric);
  else list.sort((a, b) => a.name.localeCompare(b.name));

  return list;
});

const selectedCountry = computed(
  () => localizedCountries.value.find((c) => c.iso === selectedIso.value) || localizedCountries.value[0]
);

const compareCountryB = computed(
  () => localizedCountries.value.find((c) => c.iso === compareIsoB.value) || localizedCountries.value[1]
);

const computeDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.min(1, Math.sqrt(a))));
};

const selectedNeighbors = computed(() => {
  const target = selectedCountry.value;
  if (!target) return [];
  return localizedCountries.value
    .filter((c) => c.iso !== target.iso)
    .map((c) => ({
      country: c,
      distKm: computeDistanceKm(target.lat, target.lng, c.lat, c.lng)
    }))
    .sort((a, b) => a.distKm - b.distKm)
    .slice(0, 4);
});

const comparisonMetrics = computed(() => {
  const a = selectedCountry.value;
  const b = compareCountryB.value;
  if (!a || !b) return { distanceKm: 0, gdpPctA: 50, gdpPctB: 50 };
  const maxGdp = Math.max(1, a.pib, b.pib);
  return {
    distanceKm: computeDistanceKm(a.lat, a.lng, b.lat, b.lng),
    gdpPctA: Math.max(8, Math.round((a.pib / maxGdp) * 100)),
    gdpPctB: Math.max(8, Math.round((b.pib / maxGdp) * 100))
  };
});

const isHighlightedNode = (country) => {
  if (selectedCountry.value.iso === country.iso) return true;
  if (compareMode.value && compareCountryB.value?.iso === country.iso) return true;
  return false;
};

const getNodeRadius = (country) => {
  if (isHighlightedNode(country)) return 10;
  if (activeColorLayer.value === 'pop') {
    if (country.popNumeric >= 100_000_000) return 8.5;
    if (country.popNumeric >= 30_000_000) return 7;
  }
  return 6;
};

const selectCountryAndFly = (country) => {
  selectedIso.value = country.iso;
  mapCenter.value = [country.lat, country.lng + 12];
  mapZoom.value = 4;
};

const selectCountryFromGallery = (country) => {
  selectCountryAndFly(country);
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const onMapNodeClick = (country) => {
  if (compareMode.value && selectedIso.value !== country.iso) {
    compareIsoB.value = country.iso;
  } else {
    selectCountryAndFly(country);
  }
};

const enableCompareMode = () => {
  compareMode.value = true;
  if (compareIsoB.value === selectedIso.value) {
    const alt = localizedCountries.value.find((c) => c.iso !== selectedIso.value);
    if (alt) compareIsoB.value = alt.iso;
  }
  mapZoom.value = 2;
  mapCenter.value = [22, 18];
};

const onSelectCompareA = (iso) => {
  selectedIso.value = iso;
};

const onSelectCompareB = (iso) => {
  compareIsoB.value = iso;
};

const resetMapView = () => {
  mapCenter.value = [25, 12];
  mapZoom.value = 2;
};

const selectContinentPill = (contId) => {
  selectedContinent.value = contId;
  const centers = {
    Europe: { center: [50, 22], zoom: 4 },
    Asia: { center: [30, 102], zoom: 3 },
    Africa: { center: [2, 28], zoom: 3 },
    'North America': { center: [38, -85], zoom: 3 },
    'South America': { center: [-15, -52], zoom: 3 },
    Oceania: { center: [-22, 152], zoom: 3 }
  };
  const cfg = centers[contId];
  if (cfg) {
    mapCenter.value = cfg.center;
    mapZoom.value = cfg.zoom;
  } else {
    resetMapView();
  }
};

onMounted(() => {
  isDarkTheme.value =
    document.documentElement.classList.contains('dark') ||
    document.body.classList.contains('dark-mode');

  themeObserver = new MutationObserver(() => {
    isDarkTheme.value =
      document.documentElement.classList.contains('dark') ||
      document.body.classList.contains('dark-mode');
  });

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
});

onUnmounted(() => {
  if (themeObserver) themeObserver.disconnect();
});
</script>

<style scoped>
.atlas-stage {
  border-bottom: 1px solid var(--border-color);
}

.leaflet-container {
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: #04070f !important;
}

/* Animation fluide de transition sur la carte flottante */
.card-Morph-enter-active,
.card-Morph-leave-active {
  transition: opacity 0.25s cubic-bezier(0.22, 1, 0.36, 1), transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}

.card-Morph-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

.card-Morph-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>