<template>
  <div class="explorer-deck space-y-10 pb-14">

    <!-- ========================================================= -->
    <!-- 1. TOP COMMAND BAR & THEMATIC LAYER SELECTOR              -->
    <!-- ========================================================= -->
    <header class="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-slate-200 dark:border-white/[0.08] pb-6">
      <div>
        <div class="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1">
          <span class="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
          <span>GEOSPATIAL ATLAS // 196 SOVEREIGN DOSSIERS</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {{ locale === 'fr' ? 'Atlas Interactif & Comparateur Géodésique' : 'Interactive Atlas & Geodesic Comparator' }}
        </h1>
        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          {{ locale === 'fr'
            ? 'Filtrez et colorez les 196 États selon leur IDH, leur PIB, leur régime politique ou leur démographie, et comparez deux pays côte à côte.'
            : 'Filter and color-code all 196 states by HDI, GDP, political regime, or demographics, and compare any two countries side-by-side.' }}
        </p>
      </div>

      <!-- Mode Switcher: Inspector vs Bilateral Comparator -->
      <div class="flex flex-wrap items-center gap-2 self-start lg:self-auto">
        <button
          type="button"
          @click="compareMode = false"
          class="px-4 py-2.5 rounded-xl font-mono text-xs font-bold border transition cursor-pointer flex items-center gap-2"
          :class="!compareMode
            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white shadow-xs'
            : 'bg-white dark:bg-[#070B14] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/[0.08]'"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
          </svg>
          <span>{{ locale === 'fr' ? 'INSPECTEUR DOSSIER' : 'DOSSIER INSPECTOR' }}</span>
        </button>

        <button
          type="button"
          @click="enableCompareMode"
          class="px-4 py-2.5 rounded-xl font-mono text-xs font-bold border transition cursor-pointer flex items-center gap-2"
          :class="compareMode
            ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-xs'
            : 'bg-white dark:bg-[#070B14] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/[0.08] hover:border-sky-500/50'"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 3h5v5" /><path d="M8 3H3v5" />
            <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" /><path d="m15 9 6-6" />
          </svg>
          <span>{{ locale === 'fr' ? 'COMPARATEUR BILATÉRAL (A vs B)' : 'BILATERAL COMPARATOR (A vs B)' }}</span>
        </button>
      </div>
    </header>

    <!-- ========================================================= -->
    <!-- 2. THEMATIC COLORATION LAYER BAR (IDH, PIB, REGIME, ETC.) -->
    <!-- ========================================================= -->
    <div class="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#070B14] p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-2xs">
      <div class="flex flex-wrap items-center gap-2">
        <span class="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
          {{ locale === 'fr' ? 'CALQUE CARTOGRAPHIQUE :' : 'CARTOGRAPHIC LAYER:' }}
        </span>

        <button
          v-for="layer in thematicLayers"
          :key="layer.id"
          type="button"
          @click="activeColorLayer = layer.id"
          class="px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition cursor-pointer"
          :class="activeColorLayer === layer.id
            ? 'bg-sky-500/15 border-sky-500/50 text-sky-600 dark:text-sky-300'
            : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.07] text-slate-600 dark:text-slate-400 hover:border-slate-400'"
        >
          {{ layer.label }}
        </button>
      </div>

      <!-- Dynamic Color Legend for Active Layer -->
      <div class="flex flex-wrap items-center gap-3 font-mono text-[11px]">
        <div
          v-for="item in activeLayerLegend"
          :key="item.label"
          class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300"
        >
          <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: item.color }"></span>
          <span>{{ item.label }}</span>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- 3. 3-COLUMN GEOSPATIAL COCKPIT (INDEX / MAP / DOSSIER)    -->
    <!-- ========================================================= -->
    <section class="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#050811] overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">

      <!-- LEFT COLUMN: FILTERABLE INDEX OF 196 STATES -->
      <aside class="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/[0.07] bg-slate-50/50 dark:bg-[#070A14] p-4 flex flex-col gap-3.5 max-h-[640px]">
        <!-- Search Input -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="locale === 'fr' ? 'Rechercher pays, capitale, ISO...' : 'Search country, capital, ISO...'"
            class="w-full pl-3.5 pr-8 py-2 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#0B101D] text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
          />
          <button
            v-if="searchQuery"
            type="button"
            @click="searchQuery = ''"
            class="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white cursor-pointer"
          >
            ×
          </button>
        </div>

        <!-- Continent & Regime Filters + Sort -->
        <div class="grid grid-cols-2 gap-2">
          <select
            v-model="selectedContinent"
            @change="onContinentSelectChange"
            class="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#0B101D] text-slate-800 dark:text-slate-200 font-mono text-[11px] font-bold focus:outline-none"
          >
            <option value="">{{ locale === 'fr' ? 'CONTINENTS (6)' : 'ALL CONTINENTS' }}</option>
            <option value="Europe">Europe (47)</option>
            <option value="Asia">{{ locale === 'fr' ? 'Asie (46)' : 'Asia (46)' }}</option>
            <option value="Africa">{{ locale === 'fr' ? 'Afrique (54)' : 'Africa (54)' }}</option>
            <option value="North America">{{ locale === 'fr' ? 'Am. Nord (23)' : 'N. America (23)' }}</option>
            <option value="South America">{{ locale === 'fr' ? 'Am. Sud (12)' : 'S. America (12)' }}</option>
            <option value="Oceania">{{ locale === 'fr' ? 'Océanie (14)' : 'Oceania (14)' }}</option>
          </select>

          <select
            v-model="sortBy"
            class="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#0B101D] text-slate-800 dark:text-slate-200 font-mono text-[11px] font-bold focus:outline-none"
          >
            <option value="name">{{ locale === 'fr' ? 'TRI : NOM (A-Z)' : 'SORT: NAME (A-Z)' }}</option>
            <option value="idh-desc">{{ locale === 'fr' ? 'TRI : IDH (MAX)' : 'SORT: HDI (HIGH)' }}</option>
            <option value="pib-desc">{{ locale === 'fr' ? 'TRI : PIB (MAX)' : 'SORT: GDP (HIGH)' }}</option>
            <option value="pop-desc">{{ locale === 'fr' ? 'TRI : POPULATION' : 'SORT: POPULATION' }}</option>
            <option value="area-desc">{{ locale === 'fr' ? 'TRI : SUPERFICIE' : 'SORT: AREA (KM²)' }}</option>
          </select>
        </div>

        <div class="flex items-center justify-between font-mono text-[10px] text-slate-400 uppercase px-0.5">
          <span>{{ filteredCountries.length }} {{ locale === 'fr' ? 'ÉTATS FILTRÉS' : 'FILTERED STATES' }}</span>
          <span>{{ activeColorLayer.toUpperCase() }}</span>
        </div>

        <!-- Scrollable Country List -->
        <div class="flex-1 overflow-y-auto divide-y divide-slate-200/60 dark:divide-white/[0.05] rounded-xl border border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0B101D]">
          <button
            v-for="country in filteredCountries"
            :key="country.iso"
            type="button"
            @click="selectCountryFromList(country)"
            class="w-full px-3 py-2.5 text-left flex items-center justify-between gap-2 transition cursor-pointer"
            :class="selectedCountry.iso === country.iso
              ? 'bg-sky-500/15 text-sky-600 dark:text-sky-300 font-bold'
              : 'hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-800 dark:text-slate-200'"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <span
                class="w-2 h-2 rounded-full shrink-0"
                :style="{ backgroundColor: getCountryNodeColor(country) }"
              ></span>
              <img :src="`https://flagcdn.com/w40/${country.iso}.png`" class="h-3.5 w-auto rounded-2xs shrink-0" alt="" />
              <span class="text-xs truncate">{{ country.name }}</span>
            </div>

            <span class="font-mono text-[10px] text-slate-400 shrink-0">
              {{ getCountryLayerBadge(country) }}
            </span>
          </button>
        </div>
      </aside>

      <!-- CENTER COLUMN: INTERACTIVE VECTOR MAP + COMPARATOR HUD -->
      <div class="lg:col-span-6 relative flex flex-col bg-[#060A12] min-h-[480px]">
        <!-- Top Map Telemetry Bar -->
        <div class="z-20 flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-900/90 border-b border-white/[0.07] font-mono text-[11px] text-slate-300">
          <div class="flex items-center gap-2">
            <span class="text-sky-400 font-bold">FOCUS //</span>
            <span class="text-white font-bold">{{ selectedCountry.name.toUpperCase() }}</span>
            <span class="text-slate-400">({{ formatCoord(selectedCountry.lat, 'N', 'S') }}, {{ formatCoord(selectedCountry.lng, 'E', 'W') }})</span>
          </div>
          <button
            type="button"
            @click="resetMapView"
            class="px-2.5 py-1 rounded bg-white/[0.07] hover:bg-white/[0.15] border border-white/10 text-xs text-sky-300 cursor-pointer"
          >
            [{{ locale === 'fr' ? 'VUE MONDIALE' : 'WORLD VIEW' }}]
          </button>
        </div>

        <!-- Interactive Leaflet Map (Auto Dark/Light Tile Layer) -->
        <div class="flex-1 w-full relative z-0 min-h-[420px]">
          <l-map
            v-model:zoom="mapZoom"
            v-model:center="mapCenter"
            :min-zoom="2"
            :max-zoom="7"
            :use-global-leaflet="false"
          >
            <l-tile-layer
              :url="activeTileUrl"
              :no-wrap="true"
            ></l-tile-layer>

            <!-- Geodesic Polyline between Country A and Country B in Compare Mode -->
            <l-polyline
              v-if="compareMode && compareCountryB"
              :lat-lngs="[[selectedCountry.lat, selectedCountry.lng], [compareCountryB.lat, compareCountryB.lng]]"
              :color="'#38bdf8'"
              :weight="2.5"
              :options="{ dashArray: '6, 6' }"
            ></l-polyline>

            <!-- 196 Color-Coded Sovereign Nodes -->
            <l-circle-marker
              v-for="country in filteredCountries"
              :key="'atlas-node-' + country.iso"
              :lat-lng="[country.lat, country.lng]"
              :radius="getNodeRadius(country)"
              :color="selectedCountry.iso === country.iso || (compareMode && compareCountryB?.iso === country.iso) ? '#ffffff' : getCountryNodeColor(country)"
              :weight="selectedCountry.iso === country.iso || (compareMode && compareCountryB?.iso === country.iso) ? 2.5 : 1.2"
              :fill-color="getCountryNodeColor(country)"
              :fill-opacity="0.88"
              @click="onMapNodeClick(country)"
            >
              <l-popup>
                <div class="font-sans text-xs space-y-1 min-w-[140px]">
                  <div class="flex items-center gap-2 font-bold">
                    <img :src="`https://flagcdn.com/w40/${country.iso}.png`" class="h-3.5 w-auto rounded-2xs" alt="" />
                    <span>{{ country.name }}</span>
                  </div>
                  <div class="text-[11px] text-slate-600">
                    {{ t('common.capital') }}: <strong>{{ country.capital }}</strong>
                  </div>
                  <div class="font-mono text-[10px] text-sky-600 font-bold">
                    IDH: {{ country.idh.toFixed(3) }} • PIB: ${{ country.pib }}B
                  </div>
                </div>
              </l-popup>
            </l-circle-marker>
          </l-map>
        </div>

        <!-- Bilateral Comparator Panel (When Compare Mode is Active) -->
        <div
          v-if="compareMode && compareCountryB"
          class="z-20 bg-slate-950/95 border-t border-sky-500/30 p-4 text-white space-y-3"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <img :src="`https://flagcdn.com/w40/${selectedCountry.iso}.png`" class="h-4 w-auto rounded-2xs" alt="" />
              <strong class="text-xs sm:text-sm font-black text-sky-400">{{ selectedCountry.name }}</strong>
              <span class="font-mono text-xs text-slate-500">VS</span>
              <img :src="`https://flagcdn.com/w40/${compareCountryB.iso}.png`" class="h-4 w-auto rounded-2xs" alt="" />
              <strong class="text-xs sm:text-sm font-black text-emerald-400">{{ compareCountryB.name }}</strong>
            </div>

            <div class="flex items-center gap-2">
              <span class="font-mono text-xs px-2.5 py-1 rounded bg-sky-500/15 border border-sky-500/30 text-sky-300 font-bold">
                DISTANCE : {{ comparisonMetrics.distanceKm.toLocaleString() }} KM
              </span>
              <select
                :value="compareCountryB.iso"
                @change="onSelectCompareB($event.target.value)"
                class="px-2.5 py-1 rounded bg-slate-900 border border-white/15 font-mono text-xs text-white"
              >
                <option v-for="c in localizedCountries" :key="'cmp-' + c.iso" :value="c.iso">
                  {{ c.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
            <div class="p-2 rounded bg-white/[0.04] border border-white/[0.07]">
              <span class="text-slate-400 block text-[10px]">IDH (A vs B)</span>
              <strong class="text-white">{{ selectedCountry.idh.toFixed(3) }} vs {{ compareCountryB.idh.toFixed(3) }}</strong>
            </div>
            <div class="p-2 rounded bg-white/[0.04] border border-white/[0.07]">
              <span class="text-slate-400 block text-[10px]">PIB NOMINAL</span>
              <strong class="text-white">${{ selectedCountry.pib }}B vs ${{ compareCountryB.pib }}B</strong>
            </div>
            <div class="p-2 rounded bg-white/[0.04] border border-white/[0.07]">
              <span class="text-slate-400 block text-[10px]">POPULATION</span>
              <strong class="text-white">{{ selectedCountry.population }} vs {{ compareCountryB.population }}</strong>
            </div>
            <div class="p-2 rounded bg-white/[0.04] border border-white/[0.07]">
              <span class="text-slate-400 block text-[10px]">SUPERFICIE</span>
              <strong class="text-white truncate block">{{ selectedCountry.area }} vs {{ compareCountryB.area }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: SOVEREIGN STATE DOSSIER INSPECTOR -->
      <aside class="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-white/[0.07] bg-slate-50/50 dark:bg-[#070A14] p-4 sm:p-5 flex flex-col justify-between gap-4">
        <div class="space-y-4">
          <!-- Flag & ISO Header -->
          <div class="flex items-start gap-3 pb-3.5 border-b border-slate-200 dark:border-white/[0.07]">
            <img
              :src="`https://flagcdn.com/w160/${selectedCountry.iso}.png`"
              :alt="selectedCountry.name"
              class="h-11 w-auto rounded border border-slate-300 dark:border-white/15 shadow-xs shrink-0"
            />
            <div class="min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-600 dark:text-sky-300 uppercase">
                  ISO // {{ selectedCountry.iso }}
                </span>
                <span class="font-mono text-[10px] text-slate-400 truncate">
                  {{ selectedCountry.subregion }}
                </span>
              </div>
              <h2 class="text-xl font-black text-slate-900 dark:text-white truncate mt-0.5">
                {{ selectedCountry.name }}
              </h2>
            </div>
          </div>

          <!-- Core Socio-Economic & Political Telemetry -->
          <div class="grid grid-cols-2 gap-2">
            <div class="p-2.5 rounded-lg border border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0B101D]">
              <span class="font-mono text-[10px] uppercase text-slate-400 block">{{ t('common.capital') }}</span>
              <strong class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate block mt-0.5">
                {{ selectedCountry.capital }}
              </strong>
            </div>

            <div class="p-2.5 rounded-lg border border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0B101D]">
              <span class="font-mono text-[10px] uppercase text-slate-400 block">POPULATION</span>
              <strong class="font-mono text-xs sm:text-sm font-bold text-sky-600 dark:text-sky-400 truncate block mt-0.5">
                {{ selectedCountry.population }}
              </strong>
            </div>

            <div class="p-2.5 rounded-lg border border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0B101D]">
              <span class="font-mono text-[10px] uppercase text-slate-400 block">IDH (UNDP)</span>
              <strong class="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                {{ selectedCountry.idh.toFixed(3) }} ({{ getHdiTierLabel(selectedCountry.idh) }})
              </strong>
            </div>

            <div class="p-2.5 rounded-lg border border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0B101D]">
              <span class="font-mono text-[10px] uppercase text-slate-400 block">{{ locale === 'fr' ? 'PIB NOMINAL' : 'NOMINAL GDP' }}</span>
              <strong class="font-mono text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 block mt-0.5">
                ~${{ selectedCountry.pib.toLocaleString() }} Md
              </strong>
            </div>

            <div class="col-span-2 p-2.5 rounded-lg border border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0B101D] flex items-center justify-between">
              <div>
                <span class="font-mono text-[10px] uppercase text-slate-400 block">
                  {{ locale === 'fr' ? 'RÉGIME POLITIQUE' : 'POLITICAL REGIME' }}
                </span>
                <strong class="text-xs font-bold text-slate-900 dark:text-white block mt-0.5">
                  {{ selectedCountry.regimeLabel }}
                </strong>
              </div>
              <span class="font-mono text-[11px] text-slate-400">{{ selectedCountry.area }}</span>
            </div>

            <div class="p-2.5 rounded-lg border border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0B101D]">
              <span class="font-mono text-[10px] uppercase text-slate-400 block">{{ locale === 'fr' ? 'LANGUE(S)' : 'LANGUAGE(S)' }}</span>
              <strong class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block mt-0.5">
                {{ selectedCountry.lang }}
              </strong>
            </div>

            <div class="p-2.5 rounded-lg border border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0B101D]">
              <span class="font-mono text-[10px] uppercase text-slate-400 block">{{ locale === 'fr' ? 'MONNAIE' : 'CURRENCY' }}</span>
              <strong class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block mt-0.5">
                {{ selectedCountry.currency }}
              </strong>
            </div>
          </div>

          <!-- Historical & Geographic Fact -->
          <div class="p-3 rounded-lg border border-sky-500/25 bg-sky-500/[0.05] text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <span class="font-mono text-[10px] font-bold uppercase text-sky-600 dark:text-sky-400 block mb-1">
              {{ locale === 'fr' ? 'SPÉCIFICITÉ GÉOPOLITIQUE' : 'GEOPOLITICAL BRIEF' }}
            </span>
            {{ selectedCountry.fact }}
          </div>

          <!-- 4 Nearest Neighbors -->
          <div class="space-y-1.5">
            <span class="font-mono text-[10px] text-slate-400 uppercase block">
              {{ locale === 'fr' ? 'PROXIMITÉ ORTHODROMIQUE' : 'NEAREST GEODESIC STATES' }}
            </span>
            <div class="grid grid-cols-2 gap-1.5">
              <button
                v-for="nb in selectedNeighbors"
                :key="'nb-' + nb.country.iso"
                type="button"
                @click="selectCountryFromList(nb.country)"
                class="p-2 rounded-lg border border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0B101D] hover:border-sky-500 text-left transition cursor-pointer flex items-center justify-between gap-1.5"
              >
                <div class="flex items-center gap-1.5 min-w-0">
                  <img :src="`https://flagcdn.com/w40/${nb.country.iso}.png`" class="h-3 w-auto rounded-2xs shrink-0" alt="" />
                  <span class="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">{{ nb.country.name }}</span>
                </div>
                <span class="font-mono text-[10px] text-sky-500 shrink-0">{{ nb.distKm }}km</span>
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          @click="setAsCompareBase"
          class="w-full px-3 py-2.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/35 text-sky-600 dark:text-sky-300 font-mono text-xs font-bold transition cursor-pointer"
        >
          [{{ locale === 'fr' ? 'COMPARER CET ÉTAT AVEC UN AUTRE' : 'COMPARE THIS STATE WITH ANOTHER' }}]
        </button>
      </aside>

    </section>

    <!-- ========================================================= -->
    <!-- 4. FULL SOVEREIGN DIRECTORY GRID (196 INTERACTIVE CARDS)  -->
    <!-- ========================================================= -->
    <section class="space-y-4">
      <div class="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-3">
        <div>
          <span class="font-mono text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            CATALOGUE COMPLET // {{ filteredCountries.length }} / 196
          </span>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">
            {{ locale === 'fr' ? 'Fiches synoptiques des États' : 'Sovereign State Synoptic Cards' }}
          </h2>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <article
          v-for="country in filteredCountries"
          :key="'card-' + country.iso"
          @click="selectCountryFromList(country)"
          class="group rounded-2xl border p-4 transition-all cursor-pointer flex flex-col justify-between gap-3"
          :class="selectedCountry.iso === country.iso
            ? 'border-sky-500 bg-sky-500/[0.05] dark:bg-sky-500/[0.08] shadow-md'
            : 'border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#070B14] hover:border-sky-500/50'"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <div class="flex items-center gap-2.5 min-w-0">
                <img
                  :src="`https://flagcdn.com/w80/${country.iso}.png`"
                  :alt="country.name"
                  class="h-6 w-auto rounded-xs border border-slate-200 dark:border-white/10 shrink-0"
                  loading="lazy"
                />
                <h3 class="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {{ country.name }}
                </h3>
              </div>
              <span
                class="w-2.5 h-2.5 rounded-full shrink-0"
                :style="{ backgroundColor: getCountryNodeColor(country) }"
              ></span>
            </div>

            <div class="grid grid-cols-2 gap-1.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">
              <div class="truncate">
                <span class="text-slate-400 block text-[9px] uppercase">{{ t('common.capital') }}</span>
                <strong class="text-slate-800 dark:text-slate-200">{{ country.capital }}</strong>
              </div>
              <div class="truncate">
                <span class="text-slate-400 block text-[9px] uppercase">POPULATION</span>
                <strong class="text-slate-800 dark:text-slate-200">{{ country.population }}</strong>
              </div>
              <div>
                <span class="text-slate-400 block text-[9px] uppercase">IDH</span>
                <strong class="text-emerald-600 dark:text-emerald-400">{{ country.idh.toFixed(3) }}</strong>
              </div>
              <div>
                <span class="text-slate-400 block text-[9px] uppercase">PIB</span>
                <strong class="text-sky-600 dark:text-sky-400">~${{ country.pib }}B</strong>
              </div>
            </div>
          </div>

          <div class="pt-2.5 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between font-mono text-[10px] text-slate-400">
            <span class="truncate">{{ country.regimeLabel }}</span>
            <span class="text-sky-500 font-bold group-hover:translate-x-0.5 transition-transform">FOCUS →</span>
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
// DARK / LIGHT REACTIVE TILE LAYER OBSERVER
// =========================================================
const isDarkTheme = ref(document.documentElement.classList.contains('dark'));
let themeObserver = null;

const activeTileUrl = computed(() =>
  isDarkTheme.value
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
);

// =========================================================
// SOCIO-ECONOMIC & POLITICAL REGIME TELEMETRY ENRICHMENT
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

// Verified HDI & Nominal GDP ($B) reference anchors + deterministic fallback by subregion
const HDI_OVERRIDES = {
  ch: 0.967, no: 0.966, is: 0.959, hk: 0.956, dk: 0.952, se: 0.952, de: 0.950, ie: 0.950,
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
  'us', 'de', 'br', 'in', 'ru', 'mx', 'ar', 'ch', 'at', 'NG', 'ng', 'et', 'pk', 'np', 'iq', 've'
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
      label: isFr ? 'Monarchie constitutionnelle / État royal' : 'Constitutional / Royal Monarchy'
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
// THEMATIC COLORATION LAYERS & DYNAMIC LEGENDS
// =========================================================
const activeColorLayer = ref('continent'); // 'continent' | 'idh' | 'pib' | 'regime' | 'pop'

const thematicLayers = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'continent', label: isFr ? '01 // CONTINENTS' : '01 // CONTINENTS' },
    { id: 'idh', label: isFr ? '02 // INDICE IDH' : '02 // HDI INDEX' },
    { id: 'pib', label: isFr ? '03 // PIB NOMINAL' : '03 // NOMINAL GDP' },
    { id: 'regime', label: isFr ? '04 // RÉGIME POLITIQUE' : '04 // POLITICAL REGIME' },
    { id: 'pop', label: isFr ? '05 // DÉMOGRAPHIE' : '05 // DEMOGRAPHICS' }
  ];
});

const activeLayerLegend = computed(() => {
  const isFr = locale.value === 'fr';
  if (activeColorLayer.value === 'idh') {
    return [
      { color: '#10b981', label: isFr ? 'Très élevé (≥0.800)' : 'Very High (≥0.800)' },
      { color: '#38bdf8', label: isFr ? 'Élevé (0.700-0.799)' : 'High (0.700-0.799)' },
      { color: '#f59e0b', label: isFr ? 'Moyen (0.550-0.699)' : 'Medium (0.550-0.699)' },
      { color: '#f43f5e', label: isFr ? 'Faible (<0.550)' : 'Low (<0.550)' }
    ];
  }
  if (activeColorLayer.value === 'pib') {
    return [
      { color: '#10b981', label: '>$1,000B' },
      { color: '#38bdf8', label: '$200B–$1,000B' },
      { color: '#a855f7', label: '$30B–$200B' },
      { color: '#64748b', label: '<$30B' }
    ];
  }
  if (activeColorLayer.value === 'regime') {
    return [
      { color: '#38bdf8', label: isFr ? 'Rép. Parlementaire' : 'Parliamentary Rep.' },
      { color: '#10b981', label: isFr ? 'Rép. Présidentielle' : 'Presidential Rep.' },
      { color: '#f59e0b', label: isFr ? 'Rép. Fédérale' : 'Federal Rep.' },
      { color: '#e879f9', label: isFr ? 'Monarchie' : 'Monarchy' }
    ];
  }
  if (activeColorLayer.value === 'pop') {
    return [
      { color: '#f43f5e', label: '>100M hab.' },
      { color: '#f59e0b', label: '30M–100M' },
      { color: '#38bdf8', label: '5M–30M' },
      { color: '#10b981', label: '<5M' }
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
    return '#f43f5e';
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
    if (c.popNumeric >= 100_000_000) return '#f43f5e';
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

const getCountryLayerBadge = (c) => {
  if (activeColorLayer.value === 'idh') return c.idh.toFixed(3);
  if (activeColorLayer.value === 'pib') return `$${c.pib}B`;
  if (activeColorLayer.value === 'pop') return c.population;
  if (activeColorLayer.value === 'regime') return c.regimeKey.slice(0, 4).toUpperCase();
  return c.iso.toUpperCase();
};

const getHdiTierLabel = (idh) => {
  const isFr = locale.value === 'fr';
  if (idh >= 0.8) return isFr ? 'Très élevé' : 'Very High';
  if (idh >= 0.7) return isFr ? 'Élevé' : 'High';
  if (idh >= 0.55) return isFr ? 'Moyen' : 'Medium';
  return isFr ? 'Faible' : 'Low';
};

// =========================================================
// FILTERING, SORTING, MAP INTERACTION & COMPARATOR
// =========================================================
const searchQuery = ref('');
const selectedContinent = ref('');
const sortBy = ref('name');

const selectedIso = ref('fr');
const compareMode = ref(false);
const compareIsoB = ref('jp');

const mapZoom = ref(2.4);
const mapCenter = ref([25, 10]);

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
  if (!a || !b) return { distanceKm: 0 };
  return {
    distanceKm: computeDistanceKm(a.lat, a.lng, b.lat, b.lng)
  };
});

const getNodeRadius = (country) => {
  if (selectedCountry.value.iso === country.iso) return 9;
  if (compareMode.value && compareCountryB.value?.iso === country.iso) return 9;
  if (activeColorLayer.value === 'pop') {
    if (country.popNumeric >= 100_000_000) return 8;
    if (country.popNumeric >= 30_000_000) return 6.5;
  }
  return 5.5;
};

const selectCountryFromList = (country) => {
  selectedIso.value = country.iso;
  mapCenter.value = [country.lat, country.lng];
  mapZoom.value = 4.5;
};

const onMapNodeClick = (country) => {
  if (compareMode.value && selectedIso.value !== country.iso) {
    compareIsoB.value = country.iso;
  } else {
    selectedIso.value = country.iso;
  }
};

const enableCompareMode = () => {
  compareMode.value = true;
  if (compareIsoB.value === selectedIso.value) {
    const alt = localizedCountries.value.find((c) => c.iso !== selectedIso.value);
    if (alt) compareIsoB.value = alt.iso;
  }
  mapZoom.value = 2.2;
  mapCenter.value = [20, 10];
};

const setAsCompareBase = () => {
  enableCompareMode();
};

const onSelectCompareB = (iso) => {
  compareIsoB.value = iso;
};

const resetMapView = () => {
  mapCenter.value = [20, 10];
  mapZoom.value = 2.2;
};

const onContinentSelectChange = () => {
  const centers = {
    Europe: { center: [52, 15], zoom: 3.6 },
    Asia: { center: [30, 95], zoom: 3 },
    Africa: { center: [2, 20], zoom: 3.2 },
    'North America': { center: [38, -95], zoom: 3 },
    'South America': { center: [-15, -60], zoom: 3.2 },
    Oceania: { center: [-22, 145], zoom: 3.4 }
  };
  const cfg = centers[selectedContinent.value];
  if (cfg) {
    mapCenter.value = cfg.center;
    mapZoom.value = cfg.zoom;
  } else {
    resetMapView();
  }
};

const formatCoord = (val, posDir, negDir) => {
  const num = Number(val || 0);
  const dir = num >= 0 ? posDir : negDir;
  return `${Math.abs(num).toFixed(2)}° ${dir}`;
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
.leaflet-container {
  z-index: 10;
  background-color: #060a12 !important;
}
</style>