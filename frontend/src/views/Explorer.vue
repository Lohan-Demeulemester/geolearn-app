<template>
  <div class="explorer-experience relative w-full h-[calc(100vh-58px)] overflow-hidden select-none">

    <!-- ========================================================= -->
    <!-- 1. CARTE INTERACTIVE PLEIN ÉCRAN (AVEC MARGE DE DÉZOOM)   -->
    <!-- ========================================================= -->
    <div class="absolute inset-0 z-0 w-full h-full">
      <l-map
        ref="mapRef"
        v-model:zoom="mapZoom"
        v-model:center="mapCenter"
        :min-zoom="2.25"
        :max-zoom="8"
        :max-bounds="[[-68, -210], [84, 210]]"
        :options="{
          zoomControl: false,
          zoomSnap: 0.25,
          zoomDelta: 0.5,
          maxBoundsViscosity: 0.85,
          worldCopyJump: true
        }"
        :use-global-leaflet="false"
      >
        <l-tile-layer
          :key="activeTileStyle"
          :url="activeTileUrl"
          :no-wrap="false"
        ></l-tile-layer>

        <!-- Liaisons géodésiques vers les pays voisins (Mode Exploration) -->
        <template v-if="!compareMode && showNeighborLinks">
          <l-polyline
            v-for="nb in selectedNeighbors"
            :key="'link-' + nb.country.iso"
            :lat-lngs="[[selectedCountry.lat, selectedCountry.lng], [nb.country.lat, nb.country.lng]]"
            :color="'#38bdf8'"
            :weight="1.8"
            :options="{ dashArray: '5, 7', opacity: 0.65 }"
          ></l-polyline>
        </template>

        <!-- Trajectoire aérienne directe A vs B (Mode Comparateur) -->
        <l-polyline
          v-if="compareMode && compareCountryB"
          :lat-lngs="[[selectedCountry.lat, selectedCountry.lng], [compareCountryB.lat, compareCountryB.lng]]"
          :color="'#38bdf8'"
          :weight="3.5"
          :options="{ dashArray: '8, 8' }"
        ></l-polyline>

        <!-- Marqueurs interactifs des 196 États -->
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
            <div class="font-sans text-xs space-y-1.5 min-w-[165px] p-0.5">
              <div class="flex items-center gap-2 font-black text-slate-900">
                <img :src="`https://flagcdn.com/w40/${country.iso}.png`" class="h-4 w-auto rounded-xs shadow-2xs" alt="" />
                <span>{{ country.name }}</span>
              </div>
              <div class="text-[11px] text-slate-600">
                {{ t('common.capital') }} : <strong class="text-slate-900">{{ country.capital }}</strong>
              </div>
              <div class="text-[11px] font-semibold text-sky-600">
                {{ country.population }} • {{ country.area }}
              </div>
            </div>
          </l-popup>
        </l-circle-marker>
      </l-map>
    </div>

    <!-- ========================================================= -->
    <!-- 2. BARRE SUPÉRIEURE FLOTTANTE : CONTINENTS PRÉCIS & VUES  -->
    <!-- ========================================================= -->
    <div class="relative z-20 w-full max-w-[1720px] mx-auto px-4 sm:px-8 pt-4 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-2.5 pointer-events-none">

      <!-- Gauche : Recherche instantanée + Continents avec Zoom Précis + Aléatoire -->
      <div class="flex flex-wrap items-center gap-2 pointer-events-auto">
        <div class="relative flex-1 sm:flex-initial">
          <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="locale === 'fr' ? 'Pays, capitale, langue, monnaie...' : 'Country, capital, language, currency...'"
            class="w-full sm:w-60 pl-9 pr-8 py-2 rounded-full bg-white/90 dark:bg-slate-900/85 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-sky-400 shadow-xl"
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

        <!-- Pilules Continents (Zoom et cadrage précis au clic) -->
        <div class="flex items-center gap-1 p-1 rounded-full bg-white/90 dark:bg-slate-900/85 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 shadow-xl overflow-x-auto max-w-full">
          <button
            v-for="cont in continentPills"
            :key="cont.id"
            type="button"
            @click="selectContinentPill(cont.id)"
            class="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer"
            :class="selectedContinent === cont.id
              ? 'bg-sky-500 text-white shadow-sm scale-[1.02]'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
          >
            {{ cont.label }}
          </button>
        </div>

        <!-- Bouton Pays Aléatoire -->
        <button
          type="button"
          @click="pickRandomCountry"
          class="px-3.5 py-2 rounded-full bg-white/90 dark:bg-slate-900/85 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 text-slate-700 dark:text-slate-200 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 text-xs font-bold shadow-xl transition cursor-pointer flex items-center gap-1.5"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" />
            <polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" />
            <line x1="4" y1="4" x2="9" y2="9" />
          </svg>
          <span>{{ locale === 'fr' ? 'Aléatoire' : 'Random' }}</span>
        </button>
      </div>

      <!-- Droite : Style de Carte + Comparateur + Zoom souple -->
      <div class="flex flex-wrap items-center gap-2 pointer-events-auto self-start xl:self-auto">
        <div class="flex items-center p-1 rounded-full bg-white/90 dark:bg-slate-900/85 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 shadow-xl">
          <button
            v-for="style in mapStyles"
            :key="style.id"
            type="button"
            @click="manualTileStyle = style.id"
            class="px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer"
            :class="activeTileStyle === style.id
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
          >
            {{ style.label }}
          </button>
        </div>

        <div class="flex items-center p-1 rounded-full bg-white/90 dark:bg-slate-900/85 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 shadow-xl">
          <button
            type="button"
            @click="switchToInspector"
            class="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer"
            :class="!compareMode
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
          >
            {{ locale === 'fr' ? 'Fiche 3D' : '3D Card' }}
          </button>
          <button
            type="button"
            @click="enableCompareMode"
            class="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer"
            :class="compareMode
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
          >
            {{ locale === 'fr' ? 'Comparer A vs B' : 'Compare A vs B' }}
          </button>
        </div>

        <div class="flex items-center gap-1 p-1 rounded-full bg-white/90 dark:bg-slate-900/85 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 shadow-xl">
          <button
            type="button"
            @click="stepZoom(0.5)"
            class="w-7 h-7 rounded-full hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-700 dark:text-white font-bold text-sm cursor-pointer flex items-center justify-center"
            title="Zoom +"
          >
            +
          </button>
          <button
            type="button"
            @click="stepZoom(-0.5)"
            class="w-7 h-7 rounded-full hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-700 dark:text-white font-bold text-sm cursor-pointer flex items-center justify-center"
            title="Zoom -"
          >
            −
          </button>
          <button
            type="button"
            @click="resetMapView"
            class="px-2.5 h-7 rounded-full hover:bg-slate-200/60 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-[11px] font-bold cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- 3. ZONE MÉDIANE : FICHE PAYS 3D OU COMPARATEUR (AVEC "−") -->
    <!-- ========================================================= -->
    <div class="relative z-20 w-full max-w-[1720px] mx-auto px-4 sm:px-8 my-auto flex justify-end pointer-events-none">

      <!-- CAPSULE RÉDUITE QUAND ON CLIQUE SUR LE BOUTON "−" -->
      <transition name="minimize-pill">
        <button
          v-if="inspectorCollapsed"
          type="button"
          @click="inspectorCollapsed = false"
          class="pointer-events-auto mt-2 px-4 py-2.5 rounded-full bg-white/92 dark:bg-slate-900/90 backdrop-blur-2xl border border-sky-500/40 shadow-2xl flex items-center gap-3 hover:scale-105 transition-all cursor-pointer group"
        >
          <template v-if="!compareMode">
            <img :src="`https://flagcdn.com/w40/${selectedCountry.iso}.png`" class="h-4 w-auto rounded-xs shadow-2xs" alt="" />
            <span class="text-xs font-black text-slate-900 dark:text-white">{{ selectedCountry.name }}</span>
          </template>
          <template v-else>
            <div class="flex items-center gap-1.5">
              <img :src="`https://flagcdn.com/w40/${selectedCountry.iso}.png`" class="h-3.5 w-auto rounded-2xs" alt="" />
              <span class="text-xs font-black text-sky-500">{{ selectedCountry.iso.toUpperCase() }}</span>
              <span class="text-[10px] text-slate-400">vs</span>
              <img :src="`https://flagcdn.com/w40/${compareCountryB.iso}.png`" class="h-3.5 w-auto rounded-2xs" alt="" />
              <span class="text-xs font-black text-emerald-500">{{ compareCountryB.iso.toUpperCase() }}</span>
            </div>
          </template>
          <span class="w-6 h-6 rounded-full bg-sky-500/15 group-hover:bg-sky-500 text-sky-500 group-hover:text-white flex items-center justify-center font-bold text-xs transition">
            +
          </span>
        </button>
      </transition>

      <!-- PANNEAU COMPLET (ANIMATION D'AGRANDISSEMENT / RÉDUCTION) -->
      <transition name="window-minimize" mode="out-in">
        <!-- MODE 1 : INSPECTEUR AVEC CARTE 3D RECTO-VERSO -->
        <aside
          v-if="!inspectorCollapsed && !compareMode"
          :key="'inspector-' + selectedCountry.iso"
          class="w-full max-w-md pointer-events-auto"
        >
          <div
            class="inspector-flip-scene"
            @click="inspectorFlipped = !inspectorFlipped"
          >
            <div class="inspector-flip-inner" :class="{ 'is-flipped': inspectorFlipped }">

              <!-- RECTO DE LA FICHE INSPECTEUR -->
              <div class="inspector-flip-face inspector-flip-front rounded-3xl bg-white/92 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 p-5 shadow-2xl space-y-3.5">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center gap-3.5 min-w-0">
                    <img
                      :src="`https://flagcdn.com/w160/${selectedCountry.iso}.png`"
                      :alt="selectedCountry.name"
                      class="h-11 w-auto rounded-xl shadow-md border border-slate-200 dark:border-white/10 shrink-0"
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

                  <!-- Boutons Flip 3D + Bouton "−" de réduction -->
                  <div class="flex items-center gap-1.5 shrink-0" @click.stop>
                    <button
                      type="button"
                      @click="inspectorFlipped = !inspectorFlipped"
                      class="px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-600 dark:text-sky-300 text-[11px] font-bold cursor-pointer hover:bg-sky-500 hover:text-white transition"
                    >
                      ↻ Flip 3D
                    </button>
                    <button
                      type="button"
                      @click="inspectorCollapsed = true"
                      class="w-7 h-7 rounded-full bg-slate-200/70 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 font-black text-sm flex items-center justify-center transition cursor-pointer"
                      :title="locale === 'fr' ? 'Réduire la fiche' : 'Minimize card'"
                    >
                      −
                    </button>
                  </div>
                </div>

                <!-- 4 Indicateurs clés -->
                <div class="grid grid-cols-2 gap-2">
                  <div class="p-2.5 rounded-2xl bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200/60 dark:border-white/[0.06]">
                    <span class="text-[10px] text-slate-400 block">{{ t('common.capital') }}</span>
                    <strong class="text-sm font-bold text-slate-900 dark:text-white truncate block">
                      {{ selectedCountry.capital }}
                    </strong>
                  </div>
                  <div class="p-2.5 rounded-2xl bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200/60 dark:border-white/[0.06]">
                    <span class="text-[10px] text-slate-400 block">{{ locale === 'fr' ? 'Habitants' : 'Population' }}</span>
                    <strong class="text-sm font-bold text-sky-600 dark:text-sky-400 truncate block">
                      {{ selectedCountry.population }}
                    </strong>
                  </div>
                  <div class="p-2.5 rounded-2xl bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200/60 dark:border-white/[0.06]">
                    <span class="text-[10px] text-slate-400 block">{{ locale === 'fr' ? 'Langue officielle' : 'Official language' }}</span>
                    <strong class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                      {{ selectedCountry.lang }}
                    </strong>
                  </div>
                  <div class="p-2.5 rounded-2xl bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200/60 dark:border-white/[0.06]">
                    <span class="text-[10px] text-slate-400 block">{{ locale === 'fr' ? 'Monnaie' : 'Currency' }}</span>
                    <strong class="text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate block">
                      {{ selectedCountry.currency }}
                    </strong>
                  </div>
                </div>

                <!-- Jauge IDH & Superficie -->
                <div class="space-y-2 p-3 rounded-2xl bg-slate-100/60 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06]">
                  <div>
                    <div class="flex items-center justify-between text-xs mb-1">
                      <span class="font-semibold text-slate-500 dark:text-slate-400">
                        {{ locale === 'fr' ? 'Développement Humain (IDH)' : 'Human Development (HDI)' }}
                      </span>
                      <strong class="font-mono text-slate-900 dark:text-white">
                        {{ selectedCountry.idh.toFixed(3) }} <span class="text-emerald-500 text-[11px]">({{ getHdiTierLabel(selectedCountry.idh) }})</span>
                      </strong>
                    </div>
                    <div class="h-1.5 w-full rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                      <div
                        class="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-500"
                        :style="{ width: `${Math.round(selectedCountry.idh * 100)}%` }"
                      ></div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between pt-1.5 border-t border-slate-200/60 dark:border-white/[0.06] text-xs">
                    <div>
                      <span class="text-slate-400 block text-[10px]">{{ locale === 'fr' ? 'Régime politique' : 'Political regime' }}</span>
                      <strong class="text-slate-800 dark:text-slate-200">{{ selectedCountry.regimeLabel }}</strong>
                    </div>
                    <div class="text-right">
                      <span class="text-slate-400 block text-[10px]">{{ locale === 'fr' ? 'Superficie' : 'Area' }}</span>
                      <strong class="font-mono text-slate-800 dark:text-slate-200">{{ selectedCountry.area }}</strong>
                    </div>
                  </div>
                </div>

                <!-- Pays voisins cliquables -->
                <div class="space-y-1.5" @click.stop>
                  <div class="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>{{ locale === 'fr' ? 'Voyager vers un voisin :' : 'Fly to a neighbor:' }}</span>
                    <button
                      type="button"
                      @click="enableCompareMode"
                      class="text-sky-500 hover:underline cursor-pointer"
                    >
                      {{ locale === 'fr' ? 'Comparer avec un pays →' : 'Compare country →' }}
                    </button>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    <button
                      v-for="nb in selectedNeighbors"
                      :key="'nb-pill-' + nb.country.iso"
                      type="button"
                      @click="selectCountryAndFly(nb.country)"
                      class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.06] hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 text-slate-700 dark:text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                    >
                      <img :src="`https://flagcdn.com/w40/${nb.country.iso}.png`" class="h-3 w-auto rounded-2xs" alt="" />
                      <span>{{ nb.country.name }}</span>
                      <span class="opacity-60 font-mono text-[10px]">{{ nb.distKm }}km</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- VERSO DE LA FICHE INSPECTEUR -->
              <div class="inspector-flip-face inspector-flip-back rounded-3xl bg-slate-900/95 text-white border border-sky-400/40 p-5 shadow-2xl flex flex-col justify-between space-y-4">
                <div class="space-y-3.5">
                  <div class="flex items-center justify-between pb-2.5 border-b border-white/10">
                    <div class="flex items-center gap-3">
                      <img :src="`https://flagcdn.com/w80/${selectedCountry.iso}.png`" class="h-8 w-auto rounded shadow" alt="" />
                      <div>
                        <h3 class="text-lg font-black leading-tight">{{ selectedCountry.name }}</h3>
                        <span class="font-mono text-[11px] text-sky-400">
                          {{ formatCoord(selectedCountry.lat, 'N', 'S') }} • {{ formatCoord(selectedCountry.lng, 'E', 'W') }}
                        </span>
                      </div>
                    </div>
                    <div class="flex items-center gap-1.5" @click.stop>
                      <button
                        type="button"
                        @click="inspectorFlipped = !inspectorFlipped"
                        class="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold cursor-pointer"
                      >
                        ↻ Recto
                      </button>
                      <button
                        type="button"
                        @click="inspectorCollapsed = true"
                        class="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white font-black text-sm flex items-center justify-center cursor-pointer"
                      >
                        −
                      </button>
                    </div>
                  </div>

                  <div class="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-400/25 text-xs leading-relaxed text-slate-200">
                    <strong class="text-sky-300 block mb-1 uppercase tracking-wider text-[10px]">
                      {{ locale === 'fr' ? 'Anecdote & Spécificité Géographique' : 'Geographic & Cultural Fact' }}
                    </strong>
                    {{ selectedCountry.fact }}
                  </div>

                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <div class="p-2.5 rounded-xl bg-white/[0.05]">
                      <span class="text-slate-400 block text-[10px]">{{ locale === 'fr' ? 'PIB Nominal estimé' : 'Est. Nominal GDP' }}</span>
                      <strong class="font-mono text-sm text-amber-300">~${{ selectedCountry.pib.toLocaleString() }} Md</strong>
                    </div>
                    <div class="p-2.5 rounded-xl bg-white/[0.05]">
                      <span class="text-slate-400 block text-[10px]">{{ locale === 'fr' ? 'Continent ONU' : 'UN Continent' }}</span>
                      <strong class="text-sm text-white">{{ selectedCountry.continent }}</strong>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2 pt-1" @click.stop>
                  <button
                    type="button"
                    @click="isDrawerOpen = true"
                    class="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs text-center transition cursor-pointer"
                  >
                    {{ locale === 'fr' ? 'Ouvrir les 196 Fiches' : 'Open 196 Cards' }}
                  </button>
                  <button
                    type="button"
                    @click="enableCompareMode"
                    class="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer"
                  >
                    {{ locale === 'fr' ? 'Comparer (A vs B)' : 'Compare (A vs B)' }}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </aside>

        <!-- MODE 2 : COMPARATEUR BILATÉRAL FLOTTANT (AVEC BOUTON "−") -->
        <aside
          v-else-if="!inspectorCollapsed && compareMode"
          key="comparator-panel"
          class="w-full max-w-lg rounded-3xl bg-white/92 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 p-5 shadow-2xl space-y-3.5 pointer-events-auto"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <span class="text-xs font-extrabold uppercase tracking-wider text-sky-500 block">
                {{ locale === 'fr' ? 'Comparateur Bilatéral' : 'Bilateral Comparator' }}
              </span>
              <h3 class="text-lg font-black text-slate-900 dark:text-white">
                {{ selectedCountry.name }} <span class="text-slate-400 font-normal">vs</span> {{ compareCountryB.name }}
              </h3>
            </div>
            <div class="flex items-center gap-2">
              <div class="text-right">
                <span class="px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-600 dark:text-sky-300 font-mono text-xs font-bold block">
                  {{ comparisonMetrics.distanceKm.toLocaleString() }} km
                </span>
                <span class="text-[10px] text-slate-400 font-mono">
                  ~{{ comparisonMetrics.flightHours }}h {{ locale === 'fr' ? 'de vol' : 'flight' }}
                </span>
              </div>
              <button
                type="button"
                @click="inspectorCollapsed = true"
                class="w-7 h-7 rounded-full bg-slate-200/70 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 font-black text-sm flex items-center justify-center transition cursor-pointer shrink-0"
                :title="locale === 'fr' ? 'Réduire le comparateur' : 'Minimize comparator'"
              >
                −
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="p-2.5 rounded-2xl bg-slate-100/80 dark:bg-white/[0.05] border border-sky-500/30 space-y-1.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <img :src="`https://flagcdn.com/w80/${selectedCountry.iso}.png`" class="h-4 w-auto rounded-xs" alt="" />
                  <span class="text-xs font-bold text-sky-500">{{ locale === 'fr' ? 'Pays A' : 'Country A' }}</span>
                </div>
                <button
                  type="button"
                  @click="selectCountryAndFly(selectedCountry)"
                  class="text-[10px] font-bold text-sky-400 hover:underline cursor-pointer"
                >
                  Zoom
                </button>
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

            <div class="p-2.5 rounded-2xl bg-slate-100/80 dark:bg-white/[0.05] border border-emerald-500/30 space-y-1.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <img :src="`https://flagcdn.com/w80/${compareCountryB.iso}.png`" class="h-4 w-auto rounded-xs" alt="" />
                  <span class="text-xs font-bold text-emerald-500">{{ locale === 'fr' ? 'Pays B' : 'Country B' }}</span>
                </div>
                <button
                  type="button"
                  @click="selectCountryAndFly(compareCountryB)"
                  class="text-[10px] font-bold text-emerald-400 hover:underline cursor-pointer"
                >
                  Zoom
                </button>
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

          <div class="space-y-2.5 text-xs">
            <div class="space-y-1">
              <div class="flex justify-between font-bold">
                <span class="text-sky-500">{{ selectedCountry.idh.toFixed(3) }}</span>
                <span class="text-slate-400">{{ locale === 'fr' ? 'Indice IDH' : 'HDI Index' }}</span>
                <span class="text-emerald-500">{{ compareCountryB.idh.toFixed(3) }}</span>
              </div>
              <div class="grid grid-cols-2 gap-1.5 h-1.5">
                <div class="bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden flex justify-end">
                  <div class="bg-sky-500 h-full rounded-full transition-all duration-500" :style="{ width: `${Math.round(selectedCountry.idh * 100)}%` }"></div>
                </div>
                <div class="bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div class="bg-emerald-500 h-full rounded-full transition-all duration-500" :style="{ width: `${Math.round(compareCountryB.idh * 100)}%` }"></div>
                </div>
              </div>
            </div>

            <div class="space-y-1">
              <div class="flex justify-between font-bold">
                <span class="text-sky-500">~${{ selectedCountry.pib.toLocaleString() }} Md</span>
                <span class="text-slate-400">{{ locale === 'fr' ? 'PIB Nominal' : 'Nominal GDP' }}</span>
                <span class="text-emerald-500">~${{ compareCountryB.pib.toLocaleString() }} Md</span>
              </div>
              <div class="grid grid-cols-2 gap-1.5 h-1.5">
                <div class="bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden flex justify-end">
                  <div class="bg-sky-500 h-full rounded-full transition-all duration-500" :style="{ width: `${comparisonMetrics.gdpPctA}%` }"></div>
                </div>
                <div class="bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div class="bg-emerald-500 h-full rounded-full transition-all duration-500" :style="{ width: `${comparisonMetrics.gdpPctB}%` }"></div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-3 items-center py-1.5 border-y border-slate-200/70 dark:border-white/10 text-center">
              <strong class="text-slate-900 dark:text-white">{{ selectedCountry.population }}</strong>
              <span class="text-[11px] text-slate-400">{{ locale === 'fr' ? 'Population' : 'Population' }}</span>
              <strong class="text-slate-900 dark:text-white">{{ compareCountryB.population }}</strong>
            </div>

            <div class="grid grid-cols-3 items-center text-center">
              <strong class="text-slate-900 dark:text-white truncate">{{ selectedCountry.area }}</strong>
              <span class="text-[11px] text-slate-400">{{ locale === 'fr' ? 'Superficie' : 'Area' }}</span>
              <strong class="text-slate-900 dark:text-white truncate">{{ compareCountryB.area }}</strong>
            </div>
          </div>
        </aside>
      </transition>
    </div>

    <!-- ========================================================= -->
    <!-- 4. DOCK DES CALQUES THÉMATIQUES (JUSTE AU-DESSUS DU TIROIR)-->
    <!-- ========================================================= -->
    <div class="relative z-20 w-full max-w-[1720px] mx-auto px-4 sm:px-8 pb-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
      <div class="inline-flex flex-col md:flex-row md:items-center gap-3 p-2 rounded-3xl bg-white/90 dark:bg-slate-900/85 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 shadow-2xl pointer-events-auto">
        <div class="flex flex-wrap items-center gap-1">
          <button
            v-for="layer in thematicLayers"
            :key="layer.id"
            type="button"
            @click="activeColorLayer = layer.id"
            class="px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer"
            :class="activeColorLayer === layer.id
              ? 'bg-sky-500 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'"
          >
            {{ layer.label }}
          </button>
        </div>

        <div class="hidden md:block w-px h-5 bg-slate-200 dark:bg-white/10"></div>

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

    <!-- ========================================================= -->
    <!-- 5. TIROIR COULISSANT (BOTTOM SHEET) DES 196 FICHES 3D     -->
    <!-- ========================================================= -->
    <!-- Voile d'arrière-plan quand le tiroir est ouvert -->
    <transition name="fade-backdrop">
      <div
        v-if="isDrawerOpen"
        class="fixed inset-0 z-30 bg-slate-950/55 backdrop-blur-xs"
        @click="isDrawerOpen = false"
      ></div>
    </transition>

    <section
      class="cards-drawer fixed left-0 right-0 bottom-0 z-40 flex flex-col rounded-t-[2rem] bg-white/95 dark:bg-[#080D18]/95 backdrop-blur-2xl border-t border-slate-200/90 dark:border-white/15 shadow-[0_-20px_60px_rgba(0,0,0,0.45)]"
      :class="isDrawerOpen ? 'is-open' : 'is-closed'"
    >
      <!-- Poignée de tirage du tiroir (Clic ou Glissement haut/bas) -->
      <div
        class="w-full px-6 pt-3 pb-4 cursor-pointer select-none border-b border-slate-200/70 dark:border-white/10"
        @click="isDrawerOpen = !isDrawerOpen"
        @pointerdown="onDrawerPointerDown"
      >
        <!-- Barre de préhension centrale -->
        <div class="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/25 mx-auto mb-2.5 transition-transform group-hover:scale-x-110"></div>

        <div class="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-600 dark:text-sky-300 font-mono text-xs font-extrabold">
              {{ filteredCountries.length }} / 196
            </span>
            <div>
              <h2 class="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                {{ locale === 'fr' ? 'Tiroir des 196 Fiches Pays 3D' : '196 3D Country Cards Drawer' }}
              </h2>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                {{ isDrawerOpen
                  ? (locale === 'fr' ? 'Cliquez sur une carte pour la retourner en 3D ou cliquez ici pour rabattre le tiroir' : 'Click any card to flip in 3D or click here to close the drawer')
                  : (locale === 'fr' ? 'Tirez vers le haut ou cliquez pour déployer les 196 flashcards interactives' : 'Pull up or click to expand all 196 interactive 3D flashcards') }}
              </p>
            </div>
          </div>

          <button
            type="button"
            @click.stop="isDrawerOpen = !isDrawerOpen"
            class="px-4 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-xs shadow-md hover:scale-105 transition cursor-pointer flex items-center gap-2"
          >
            <span>{{ isDrawerOpen ? (locale === 'fr' ? 'Rabattre le tiroir' : 'Close drawer') : (locale === 'fr' ? 'Ouvrir les 196 Fiches 3D' : 'Open 196 3D Cards') }}</span>
            <span class="inline-block transition-transform duration-300" :class="isDrawerOpen ? 'rotate-180' : ''">↑</span>
          </button>
        </div>
      </div>

      <!-- Contenu déroulant du tiroir : Filtres + Grille des 196 Cartes 3D -->
      <div class="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
        <div class="max-w-[1440px] mx-auto space-y-6 pb-12">

          <!-- Barre d'outils interne au tiroir -->
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-2.5">
              <select
                v-model="selectedSubregion"
                class="px-4 py-2 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs font-bold focus:outline-none focus:border-sky-500 cursor-pointer shadow-xs"
              >
                <option value="">{{ locale === 'fr' ? 'Toutes les sous-régions' : 'All subregions' }}</option>
                <option v-for="sub in availableSubregions" :key="sub" :value="sub">
                  {{ sub }}
                </option>
              </select>

              <select
                v-model="sortBy"
                class="px-4 py-2 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs font-bold focus:outline-none focus:border-sky-500 cursor-pointer shadow-xs"
              >
                <option value="name">{{ locale === 'fr' ? 'Nom (A → Z)' : 'Name (A → Z)' }}</option>
                <option value="name-desc">{{ locale === 'fr' ? 'Nom (Z → A)' : 'Name (Z → A)' }}</option>
                <option value="pop-desc">{{ locale === 'fr' ? 'Population (+ vers -)' : 'Population (High → Low)' }}</option>
                <option value="pop-asc">{{ locale === 'fr' ? 'Population (- vers +)' : 'Population (Low → High)' }}</option>
                <option value="area-desc">{{ locale === 'fr' ? 'Superficie (+ vers -)' : 'Area (Largest first)' }}</option>
                <option value="idh-desc">{{ locale === 'fr' ? 'Indice IDH (+ vers -)' : 'HDI Index (Highest)' }}</option>
                <option value="pib-desc">{{ locale === 'fr' ? 'PIB Nominal (+ vers -)' : 'Nominal GDP (Highest)' }}</option>
              </select>
            </div>

            <button
              type="button"
              @click="toggleAllCardsFlip"
              class="px-4 py-2 rounded-full border border-sky-500/35 bg-sky-500/10 hover:bg-sky-500 hover:text-white text-sky-600 dark:text-sky-300 text-xs font-bold transition cursor-pointer"
            >
              ↻ {{ flippedIsos.size > 0 ? (locale === 'fr' ? 'Remettre au recto' : 'Reset all cards') : (locale === 'fr' ? 'Tout retourner en 3D' : 'Flip all in 3D') }}
            </button>
          </div>

          <!-- État vide -->
          <div
            v-if="filteredCountries.length === 0"
            class="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#090E1A] p-12 text-center space-y-4"
          >
            <p class="text-base font-bold text-slate-700 dark:text-slate-300">
              {{ locale === 'fr' ? 'Aucun pays ne correspond à votre recherche.' : 'No country matches your current filters.' }}
            </p>
            <button
              type="button"
              @click="resetAllFilters"
              class="px-5 py-2.5 rounded-full bg-sky-500 text-white text-xs font-bold cursor-pointer"
            >
              {{ locale === 'fr' ? 'Réinitialiser les filtres' : 'Reset filters' }}
            </button>
          </div>

          <!-- Grille des 196 Cartes 3D Recto-Verso -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              v-for="country in filteredCountries"
              :key="'flip-card-' + country.iso"
              class="country-flip-scene"
              @click="toggleCardFlip(country.iso)"
            >
              <div class="country-flip-inner" :class="{ 'is-flipped': flippedIsos.has(country.iso) }">

                <!-- RECTO DE LA CARTE 3D -->
                <div
                  class="country-flip-face country-flip-front rounded-3xl border p-5 flex flex-col justify-between transition-colors"
                  :class="selectedCountry.iso === country.iso
                    ? 'border-sky-500 bg-sky-500/[0.04] dark:bg-sky-500/[0.08] shadow-lg'
                    : 'border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#090E1A] hover:border-sky-500/50'"
                >
                  <div>
                    <div class="flex items-center justify-between gap-2 mb-4">
                      <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 truncate">
                        {{ country.subregion }}
                      </span>
                      <div class="flex items-center gap-2 shrink-0">
                        <span
                          class="w-2.5 h-2.5 rounded-full"
                          :style="{ backgroundColor: getCountryNodeColor(country) }"
                        ></span>
                        <span class="text-[11px] font-bold text-sky-500">↻ 3D</span>
                      </div>
                    </div>

                    <div class="my-3 flex flex-col items-center text-center">
                      <img
                        :src="`https://flagcdn.com/w160/${country.iso}.png`"
                        :alt="country.name"
                        class="h-16 w-auto rounded-xl shadow-md border border-slate-200 dark:border-white/10 mb-3"
                        loading="lazy"
                      />
                      <h3 class="text-lg font-black text-slate-900 dark:text-white leading-snug">
                        {{ country.name }}
                      </h3>
                      <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {{ t('common.capital') }} : <strong class="text-slate-800 dark:text-slate-200">{{ country.capital }}</strong>
                      </p>
                    </div>

                    <div class="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] text-xs mt-3">
                      <div>
                        <span class="text-[10px] text-slate-400 block">{{ locale === 'fr' ? 'Habitants' : 'Population' }}</span>
                        <strong class="text-slate-800 dark:text-slate-200 truncate block">{{ country.population }}</strong>
                      </div>
                      <div>
                        <span class="text-[10px] text-slate-400 block">IDH / PIB</span>
                        <strong class="font-mono text-emerald-600 dark:text-emerald-400">{{ country.idh.toFixed(3) }}</strong>
                      </div>
                    </div>
                  </div>

                  <div class="pt-3 mt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between gap-2 text-xs" @click.stop>
                    <button
                      type="button"
                      @click="selectCountryFromGallery(country)"
                      class="font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>{{ locale === 'fr' ? 'Voir sur la carte ↑' : 'Locate on map ↑' }}</span>
                    </button>
                    <button
                      type="button"
                      @click="compareFromGallery(country)"
                      class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.06] hover:bg-sky-500 hover:text-white text-slate-600 dark:text-slate-300 font-bold text-[11px] transition cursor-pointer"
                    >
                      {{ locale === 'fr' ? 'Comparer' : 'Compare' }}
                    </button>
                  </div>
                </div>

                <!-- VERSO DE LA CARTE 3D -->
                <div class="country-flip-face country-flip-back rounded-3xl border border-sky-500/40 bg-slate-900 text-white p-5 flex flex-col justify-between shadow-xl">
                  <div class="space-y-3">
                    <div class="flex items-center justify-between pb-2.5 border-b border-white/10">
                      <div class="flex items-center gap-2.5 min-w-0">
                        <img :src="`https://flagcdn.com/w80/${country.iso}.png`" class="h-6 w-auto rounded shadow-xs shrink-0" alt="" />
                        <h4 class="font-black text-base text-white truncate">{{ country.name }}</h4>
                      </div>
                      <span class="text-xs text-sky-400 font-bold shrink-0">↻</span>
                    </div>

                    <div class="grid grid-cols-2 gap-2 text-xs">
                      <div class="bg-white/[0.06] p-2 rounded-xl">
                        <span class="text-slate-400 block text-[10px]">{{ t('common.capital') }}</span>
                        <strong class="text-white truncate block">{{ country.capital }}</strong>
                      </div>
                      <div class="bg-white/[0.06] p-2 rounded-xl">
                        <span class="text-slate-400 block text-[10px]">{{ locale === 'fr' ? 'Superficie' : 'Area' }}</span>
                        <strong class="text-white truncate block">{{ country.area }}</strong>
                      </div>
                      <div class="bg-white/[0.06] p-2 rounded-xl">
                        <span class="text-slate-400 block text-[10px]">{{ locale === 'fr' ? 'Langue' : 'Language' }}</span>
                        <strong class="text-white truncate block">{{ country.lang }}</strong>
                      </div>
                      <div class="bg-white/[0.06] p-2 rounded-xl">
                        <span class="text-slate-400 block text-[10px]">{{ locale === 'fr' ? 'Monnaie' : 'Currency' }}</span>
                        <strong class="text-emerald-300 truncate block">{{ country.currency }}</strong>
                      </div>
                    </div>

                    <p class="bg-sky-500/15 border border-sky-400/25 rounded-xl p-2.5 text-[11px] text-slate-200 leading-relaxed line-clamp-3">
                      {{ country.fact }}
                    </p>
                  </div>

                  <div class="pt-2 border-t border-white/10 flex items-center justify-between text-xs" @click.stop>
                    <span class="font-mono text-[10px] text-slate-400">{{ country.regimeLabel }}</span>
                    <button
                      type="button"
                      @click="selectCountryFromGallery(country)"
                      class="font-bold text-sky-400 hover:underline cursor-pointer"
                    >
                      {{ locale === 'fr' ? 'Zoom Carte ↑' : 'Map Zoom ↑' }}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
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
const mapRef = ref(null);

// =========================================================
// FONDS DE CARTE ESRI ARCGIS (100% GRATUITS SANS CLÉ API)
// =========================================================
const isDarkTheme = ref(document.documentElement.classList.contains('dark'));
const manualTileStyle = ref('auto');
let themeObserver = null;

const mapStyles = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'dark', label: isFr ? 'Sombre' : 'Dark' },
    { id: 'satellite', label: 'Satellite' },
    { id: 'light', label: isFr ? 'Atlas Clair' : 'Light Atlas' }
  ];
});

const activeTileStyle = computed(() => {
  if (manualTileStyle.value !== 'auto') return manualTileStyle.value;
  return isDarkTheme.value ? 'dark' : 'light';
});

const activeTileUrl = computed(() => {
  if (activeTileStyle.value === 'satellite') {
    return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  }
  if (activeTileStyle.value === 'light') {
    return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
  }
  return 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
});

// =========================================================
// ENRICHISSEMENT SOCIO-ÉCONOMIQUE (IDH, PIB, RÉGIMES)
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
    { id: 'pop', label: isFr ? 'Population' : 'Population' }
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
// FILTRES, TRI, TIROIR COULISSANT & CAMÉRA CARTE FLUIDE
// =========================================================
const searchQuery = ref('');
const selectedContinent = ref('');
const selectedSubregion = ref('');
const sortBy = ref('name');

const selectedIso = ref('fr');
const compareMode = ref(false);
const compareIsoB = ref('jp');

const inspectorFlipped = ref(false);
const inspectorCollapsed = ref(false);
const isDrawerOpen = ref(false);
const showNeighborLinks = ref(true);

const flippedIsos = ref(new Set());

// Zoom initial 2.5 avec marge de dézoom jusqu'à 2.25
const mapZoom = ref(2.5);
const mapCenter = ref([25, 12]);

const smoothFlyTo = (center, zoom) => {
  const leafletMap = mapRef.value?.leafletObject;
  if (leafletMap && typeof leafletMap.flyTo === 'function') {
    leafletMap.flyTo(center, zoom, { duration: 1.05 });
  } else {
    mapCenter.value = center;
    mapZoom.value = zoom;
  }
};

const stepZoom = (delta) => {
  const next = Math.max(2.25, Math.min(8, Number((mapZoom.value + delta).toFixed(2))));
  const leafletMap = mapRef.value?.leafletObject;
  if (leafletMap) leafletMap.setZoom(next);
  else mapZoom.value = next;
};

// Glissement tactile / souris sur la barre du tiroir
let drawerStartY = 0;
const onDrawerPointerDown = (e) => {
  drawerStartY = e.clientY;
  const onMove = (moveEvt) => {
    const dy = moveEvt.clientY - drawerStartY;
    if (dy < -35 && !isDrawerOpen.value) {
      isDrawerOpen.value = true;
      cleanup();
    } else if (dy > 35 && isDrawerOpen.value) {
      isDrawerOpen.value = false;
      cleanup();
    }
  };
  const cleanup = () => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', cleanup);
  };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', cleanup);
};

const continentPills = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: '', label: isFr ? 'Monde (196)' : 'World (196)' },
    { id: 'Europe', label: 'Europe (47)' },
    { id: 'Asia', label: isFr ? 'Asie (46)' : 'Asia (46)' },
    { id: 'Africa', label: isFr ? 'Afrique (54)' : 'Africa (54)' },
    { id: 'North America', label: isFr ? 'Am. Nord (23)' : 'N. America (23)' },
    { id: 'South America', label: isFr ? 'Am. Sud (12)' : 'S. America (12)' },
    { id: 'Oceania', label: isFr ? 'Océanie (14)' : 'Oceania (14)' }
  ];
});

const availableSubregions = computed(() => {
  const set = new Set();
  for (const c of localizedCountries.value) {
    if (!selectedContinent.value || c.continent === selectedContinent.value) {
      if (c.subregion) set.add(c.subregion);
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b));
});

const filteredCountries = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  let list = localizedCountries.value.filter((c) => {
    if (selectedContinent.value && c.continent !== selectedContinent.value) return false;
    if (selectedSubregion.value && c.subregion !== selectedSubregion.value) return false;
    if (q) {
      const matchName = c.name.toLowerCase().includes(q);
      const matchCap = c.capital.toLowerCase().includes(q);
      const matchIso = c.iso.toLowerCase() === q;
      const matchLang = (c.lang || '').toLowerCase().includes(q);
      const matchCurr = (c.currency || '').toLowerCase().includes(q);
      if (!matchName && !matchCap && !matchIso && !matchLang && !matchCurr) return false;
    }
    return true;
  });

  if (sortBy.value === 'name-desc') list.sort((a, b) => b.name.localeCompare(a.name));
  else if (sortBy.value === 'idh-desc') list.sort((a, b) => b.idh - a.idh);
  else if (sortBy.value === 'pib-desc') list.sort((a, b) => b.pib - a.pib);
  else if (sortBy.value === 'pop-desc') list.sort((a, b) => b.popNumeric - a.popNumeric);
  else if (sortBy.value === 'pop-asc') list.sort((a, b) => a.popNumeric - b.popNumeric);
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
  if (!a || !b) return { distanceKm: 0, flightHours: '0.0', gdpPctA: 50, gdpPctB: 50 };
  const dist = computeDistanceKm(a.lat, a.lng, b.lat, b.lng);
  const maxGdp = Math.max(1, a.pib, b.pib);
  return {
    distanceKm: dist,
    flightHours: Math.max(0.5, dist / 850).toFixed(1),
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

const clampLat = (lat) => Math.max(-48, Math.min(68, Number(lat || 0)));

const selectCountryAndFly = (country) => {
  inspectorFlipped.value = false;
  inspectorCollapsed.value = false;
  selectedIso.value = country.iso;
  // Léger décalage longitudinal quand la fiche est ouverte à droite pour centrer le pays dans la zone libre
  const lngOffset = inspectorCollapsed.value ? 0 : 8;
  smoothFlyTo([clampLat(country.lat), country.lng + lngOffset], 4.5);
};

const selectCountryFromGallery = (country) => {
  isDrawerOpen.value = false;
  selectCountryAndFly(country);
};

const compareFromGallery = (country) => {
  isDrawerOpen.value = false;
  compareMode.value = true;
  inspectorCollapsed.value = false;
  if (selectedIso.value !== country.iso) {
    compareIsoB.value = country.iso;
  }
};

const pickRandomCountry = () => {
  const pool = filteredCountries.value.length > 0 ? filteredCountries.value : localizedCountries.value;
  const random = pool[Math.floor(Math.random() * pool.length)];
  if (random) selectCountryAndFly(random);
};

const onMapNodeClick = (country) => {
  if (compareMode.value && selectedIso.value !== country.iso) {
    compareIsoB.value = country.iso;
    inspectorCollapsed.value = false;
  } else {
    selectCountryAndFly(country);
  }
};

const switchToInspector = () => {
  compareMode.value = false;
  inspectorCollapsed.value = false;
};

const enableCompareMode = () => {
  compareMode.value = true;
  inspectorCollapsed.value = false;
  if (compareIsoB.value === selectedIso.value) {
    const alt = localizedCountries.value.find((c) => c.iso !== selectedIso.value);
    if (alt) compareIsoB.value = alt.iso;
  }
  smoothFlyTo([25, 14], 2.5);
};

const onSelectCompareA = (iso) => {
  selectedIso.value = iso;
};

const onSelectCompareB = (iso) => {
  compareIsoB.value = iso;
};

const resetMapView = () => {
  smoothFlyTo([25, 12], 2.5);
};

// Zoom et cadrage précis sur chaque continent sélectionné
const selectContinentPill = (contId) => {
  selectedContinent.value = contId;
  selectedSubregion.value = '';
  const centers = {
    Europe: { center: [51, 16], zoom: 4.25 },
    Asia: { center: [31, 94], zoom: 3.5 },
    Africa: { center: [3, 21], zoom: 3.5 },
    'North America': { center: [40, -96], zoom: 3.5 },
    'South America': { center: [-18, -58], zoom: 3.5 },
    Oceania: { center: [-24, 144], zoom: 3.75 }
  };
  const cfg = centers[contId];
  if (cfg) {
    smoothFlyTo(cfg.center, cfg.zoom);
  } else {
    resetMapView();
  }
};

const resetAllFilters = () => {
  searchQuery.value = '';
  selectedContinent.value = '';
  selectedSubregion.value = '';
  sortBy.value = 'name';
};

const toggleCardFlip = (iso) => {
  const next = new Set(flippedIsos.value);
  if (next.has(iso)) next.delete(iso);
  else next.add(iso);
  flippedIsos.value = next;
};

const toggleAllCardsFlip = () => {
  if (flippedIsos.value.size > 0) {
    flippedIsos.value = new Set();
  } else {
    flippedIsos.value = new Set(filteredCountries.value.map((c) => c.iso));
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
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: #1b222c !important;
}

/* ========================================================= */
/* TIROIR COULISSANT (BOTTOM SHEET) POUR LES 196 FICHES 3D   */
/* ========================================================= */
.cards-drawer {
  height: 85vh;
  max-height: calc(100vh - 72px);
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

/* Quand le tiroir est fermé, seule la barre d'en-tête (72px) dépasse en bas */
.cards-drawer.is-closed {
  transform: translateY(calc(100% - 72px));
}

.cards-drawer.is-open {
  transform: translateY(0);
}

.fade-backdrop-enter-active,
.fade-backdrop-leave-active {
  transition: opacity 0.35s ease;
}
.fade-backdrop-enter-from,
.fade-backdrop-leave-to {
  opacity: 0;
}

/* ========================================================= */
/* ANIMATION STYLE APP POUR LE BOUTON DE RÉDUCTION "−"       */
/* ========================================================= */
.window-minimize-enter-active,
.window-minimize-leave-active {
  transition:
    opacity 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
  transform-origin: top right;
}

.window-minimize-enter-from,
.window-minimize-leave-to {
  opacity: 0;
  transform: translate(28px, -24px) scale(0.72);
}

.minimize-pill-enter-active,
.minimize-pill-leave-active {
  transition:
    opacity 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.minimize-pill-enter-from,
.minimize-pill-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.9);
}

/* ========================================================= */
/* ANIMATION 3D FLIP : INSPECTEUR FLOTTANT & CARTES PAYS     */
/* ========================================================= */
.inspector-flip-scene,
.country-flip-scene {
  perspective: 1400px;
  cursor: pointer;
}

.inspector-flip-inner {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  transform-style: preserve-3d;
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.country-flip-inner {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  min-height: 310px;
  transform-style: preserve-3d;
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.country-flip-scene:hover .country-flip-inner:not(.is-flipped) {
  transform: translateY(-4px) rotateX(2deg) rotateY(-3deg);
}

.inspector-flip-inner.is-flipped,
.country-flip-inner.is-flipped {
  transform: rotateY(180deg);
}

.inspector-flip-face,
.country-flip-face {
  grid-area: 1 / 1;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.inspector-flip-front,
.country-flip-front {
  transform: rotateY(0deg);
}

.inspector-flip-back,
.country-flip-back {
  transform: rotateY(180deg);
}
</style>