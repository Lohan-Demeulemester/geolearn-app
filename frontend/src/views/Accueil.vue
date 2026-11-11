<template>
  <div class="command-center space-y-10 pb-14">

    <!-- ========================================================= -->
    <!-- 1. GEOSPATIAL 3D COMMAND DECK (3-COLUMN ORBITAL COCKPIT)  -->
    <!-- ========================================================= -->
    <section class="cockpit-shell relative rounded-2xl border border-slate-300/80 dark:border-white/[0.08] bg-white dark:bg-[#050811] overflow-hidden shadow-2xl">
      
      <!-- Top Telemetry Status Bar -->
      <div class="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-2.5 border-b border-slate-200 dark:border-white/[0.07] bg-slate-50/90 dark:bg-[#070B16] font-mono text-[11px]">
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ORBITAL TELEMETRY // ONLINE</span>
          </span>
          <span class="hidden sm:inline text-slate-300 dark:text-white/15">|</span>
          <span class="hidden sm:inline text-slate-500 dark:text-slate-400">
            VECTOR BORDERS: <strong class="text-slate-800 dark:text-slate-200">{{ worldPolygonsLoaded ? '196 SOVEREIGN POLYGONS' : 'SYNCING...' }}</strong>
          </span>
        </div>

        <!-- Layer Toggles (Borders, Geodesic Arcs, Grid, Auto-Rotate) -->
        <div class="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            @click="showBorders = !showBorders"
            class="px-2.5 py-1 rounded border transition cursor-pointer font-semibold"
            :class="showBorders
              ? 'bg-sky-500/15 border-sky-500/40 text-sky-600 dark:text-sky-300'
              : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-400'"
          >
            {{ locale === 'fr' ? 'FRONTIÈRES' : 'BORDERS' }}
          </button>
          <button
            type="button"
            @click="showArcs = !showArcs"
            class="px-2.5 py-1 rounded border transition cursor-pointer font-semibold"
            :class="showArcs
              ? 'bg-fuchsia-500/15 border-fuchsia-500/40 text-fuchsia-600 dark:text-fuchsia-300'
              : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-400'"
          >
            {{ locale === 'fr' ? 'ARCS 3D' : '3D ARCS' }}
          </button>
          <button
            type="button"
            @click="showGraticule = !showGraticule"
            class="px-2.5 py-1 rounded border transition cursor-pointer font-semibold"
            :class="showGraticule
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-300'
              : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-400'"
          >
            GRATICULE
          </button>
          <button
            type="button"
            @click="autoRotate = !autoRotate"
            class="px-2.5 py-1 rounded border transition cursor-pointer font-semibold"
            :class="autoRotate
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-300'
              : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-400'"
          >
            {{ autoRotate ? 'ROTATION: ON' : 'ROTATION: OFF' }}
          </button>
        </div>
      </div>

      <!-- Main 3-Column Command Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">

        <!-- ===================================================== -->
        <!-- LEFT DOCK: SEARCH, CONTINENT SECTORS & MODE LAUNCHER  -->
        <!-- ===================================================== -->
        <aside class="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/[0.07] bg-slate-50/50 dark:bg-[#070A14]/90 p-4 sm:p-5 flex flex-col justify-between gap-5">
          <div class="space-y-4">
            <div>
              <span class="font-mono text-[10px] font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400 block">
                {{ locale === 'fr' ? 'INDEX GÉOSPATIAL' : 'GEOSPATIAL INDEX' }}
              </span>
              <h1 class="text-lg font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                {{ locale === 'fr' ? 'Poste de Contrôle Global' : 'Global Command Deck' }}
              </h1>
            </div>

            <!-- Instant Country Search on Globe -->
            <div class="relative">
              <input
                v-model="globeSearchQuery"
                type="text"
                :placeholder="locale === 'fr' ? 'Localiser un État ou capitale...' : 'Locate state or capital...'"
                class="w-full pl-3.5 pr-8 py-2 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#0B101D] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
              <button
                v-if="globeSearchQuery"
                type="button"
                @click="globeSearchQuery = ''"
                class="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ×
              </button>

              <!-- Search Dropdown Results -->
              <div
                v-if="searchResults.length > 0"
                class="absolute left-0 right-0 top-full mt-1 z-30 rounded-lg border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0C1222] shadow-xl divide-y divide-slate-100 dark:divide-white/[0.06] max-h-52 overflow-y-auto"
              >
                <button
                  v-for="item in searchResults"
                  :key="item.iso"
                  type="button"
                  @click="lockOnCountry(item); globeSearchQuery = ''"
                  class="w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-sky-500/10 transition cursor-pointer"
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <img :src="`https://flagcdn.com/w40/${item.iso}.png`" class="h-3.5 w-auto rounded-2xs shrink-0" alt="" />
                    <span class="font-bold text-slate-900 dark:text-white truncate">{{ item.name }}</span>
                  </div>
                  <span class="font-mono text-[10px] text-sky-400 uppercase">{{ item.iso }}</span>
                </button>
              </div>
            </div>

            <!-- Continent Sector Filters -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between font-mono text-[10px] text-slate-400 uppercase">
                <span>{{ locale === 'fr' ? 'SECTEURS CONTINENTAUX' : 'CONTINENTAL SECTORS' }}</span>
                <span>{{ filteredGlobeCountries.length }} {{ locale === 'fr' ? 'ÉTATS' : 'STATES' }}</span>
              </div>
              <div class="grid grid-cols-2 gap-1.5">
                <button
                  v-for="sec in continentSectors"
                  :key="sec.id"
                  type="button"
                  @click="selectContinentSector(sec)"
                  class="px-2.5 py-1.5 rounded-md text-left font-mono text-[11px] border transition cursor-pointer flex items-center justify-between"
                  :class="activeContinent === sec.id
                    ? 'bg-sky-500/15 border-sky-500/50 text-sky-600 dark:text-sky-300 font-bold'
                    : 'bg-white/60 dark:bg-white/[0.02] border-slate-200/70 dark:border-white/[0.06] text-slate-600 dark:text-slate-400 hover:border-slate-400'"
                >
                  <span class="truncate">{{ sec.label }}</span>
                  <span class="text-[10px] opacity-75">{{ sec.count }}</span>
                </button>
              </div>
            </div>

            <!-- Direct Protocol Launcher List (Inspired by Left Sidebar in Reference) -->
            <div class="space-y-1.5 pt-2 border-t border-slate-200/80 dark:border-white/[0.07]">
              <span class="font-mono text-[10px] text-slate-400 uppercase block">
                {{ locale === 'fr' ? 'PROTOCOLES D\'ENTRAÎNEMENT DIRECTS' : 'DIRECT TRAINING PROTOCOLS' }}
              </span>

              <div class="space-y-1 max-h-[250px] overflow-y-auto pr-1">
                <router-link
                  v-for="proto in quickProtocols"
                  :key="proto.id"
                  :to="proto.to"
                  class="group px-2.5 py-2 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-white/[0.08] hover:bg-white dark:hover:bg-white/[0.04] flex items-center justify-between transition"
                >
                  <div class="flex items-center gap-2.5 min-w-0">
                    <span class="w-2 h-2 rounded-full shrink-0" :class="proto.dotClass"></span>
                    <span class="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-sky-500 dark:group-hover:text-sky-300 truncate">
                      {{ proto.title }}
                    </span>
                  </div>
                  <span class="font-mono text-[10px] text-slate-400 group-hover:text-sky-400 shrink-0">
                    {{ proto.tag }}
                  </span>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Primary Quick Launch CTA -->
          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 dark:border-white/[0.07]">
            <router-link
              to="/geoguessr"
              class="px-3 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs text-center transition shadow-lg shadow-sky-500/20"
            >
              PINDROP 25K
            </router-link>
            <router-link
              to="/duel"
              class="px-3 py-2.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-600 dark:text-rose-300 font-black text-xs text-center transition"
            >
              DUEL 1V1
            </router-link>
          </div>
        </aside>

        <!-- ===================================================== -->
        <!-- CENTERPIECE: INTERACTIVE 3D VECTOR GLOBE VIEWPORT     -->
        <!-- ===================================================== -->
        <div class="lg:col-span-6 relative flex flex-col items-center justify-between bg-slate-950 overflow-hidden min-h-[460px] sm:min-h-[560px]">
          <!-- Deep Space Radial Backdrop -->
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.14),rgba(5,8,17,0.96)_72%)]"></div>

          <!-- Top Floating HUD Overlay inside Globe Viewport -->
          <div class="relative z-10 w-full flex items-center justify-between px-4 pt-3 text-[11px] font-mono text-slate-400">
            <div>
              <span class="text-sky-400 font-bold">TARGET //</span>
              <span class="text-white ml-1.5 font-bold">{{ heroCountry.name.toUpperCase() }}</span>
              <span class="text-slate-500 ml-1">[{{ heroCountry.iso.toUpperCase() }}]</span>
            </div>

            <!-- Zoom & Reset Controls -->
            <div class="flex items-center gap-1">
              <button
                type="button"
                @click="adjustGlobeZoom(0.25)"
                class="w-7 h-7 rounded bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 text-white font-bold cursor-pointer flex items-center justify-center"
                title="Zoom In"
              >
                +
              </button>
              <button
                type="button"
                @click="adjustGlobeZoom(-0.25)"
                class="w-7 h-7 rounded bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 text-white font-bold cursor-pointer flex items-center justify-center"
                title="Zoom Out"
              >
                -
              </button>
              <button
                type="button"
                @click="selectRandomGlobeCountry"
                class="px-2.5 h-7 rounded bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/35 text-sky-300 font-semibold cursor-pointer"
              >
                {{ locale === 'fr' ? 'ALÉATOIRE' : 'RANDOM' }}
              </button>
            </div>
          </div>

          <!-- High-DPI 3D Vector Globe Canvas -->
          <div class="relative z-10 flex-1 w-full flex items-center justify-center select-none my-auto">
            <canvas
              ref="globeCanvasRef"
              class="w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] xl:w-[500px] xl:h-[500px] cursor-grab active:cursor-grabbing"
              @pointerdown="onGlobePointerDown"
              @pointermove="onGlobePointerMove"
              @pointerup="onGlobePointerUp"
              @pointerleave="onGlobePointerLeave"
              @wheel.prevent="onGlobeWheel"
            ></canvas>

            <!-- Hover Tooltip on 3D Globe -->
            <div
              v-if="hoveredCountry"
              class="pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-slate-900/95 border border-sky-400/50 text-white font-mono text-xs flex items-center gap-2 shadow-xl"
            >
              <img :src="`https://flagcdn.com/w40/${hoveredCountry.iso}.png`" class="h-3.5 w-auto rounded-2xs" alt="" />
              <span class="font-bold">{{ hoveredCountry.name }}</span>
              <span class="text-sky-400">({{ hoveredCountry.capital }})</span>
            </div>
          </div>

          <!-- Bottom Telemetry Readout Bar -->
          <div class="relative z-10 w-full px-4 pb-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-slate-400 border-t border-white/[0.05] pt-2.5 bg-slate-950/60">
            <div class="flex items-center gap-3">
              <span>LAT: <strong class="text-sky-300">{{ formatCoord(heroCountry.lat, 'N', 'S') }}</strong></span>
              <span>LON: <strong class="text-sky-300">{{ formatCoord(heroCountry.lng, 'E', 'W') }}</strong></span>
              <span>ZOOM: <strong class="text-emerald-400">{{ globeZoom.toFixed(2) }}x</strong></span>
            </div>
            <div class="text-slate-500">
              {{ locale === 'fr' ? 'GLISSER POUR TOURNER • CLIC SUR NŒUD POUR INSPECTER' : 'DRAG TO ROTATE • CLICK NODE TO INSPECT' }}
            </div>
          </div>
        </div>

        <!-- ===================================================== -->
        <!-- RIGHT DOCK: TARGET TELEMETRY & GEODESIC NEIGHBORS     -->
        <!-- ===================================================== -->
        <aside class="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-white/[0.07] bg-slate-50/50 dark:bg-[#070A14]/90 p-4 sm:p-5 flex flex-col justify-between gap-5">
          <div class="space-y-4">
            <!-- Country Header -->
            <div class="flex items-start justify-between gap-3 pb-3.5 border-b border-slate-200 dark:border-white/[0.07]">
              <div class="flex items-center gap-3 min-w-0">
                <img
                  :src="`https://flagcdn.com/w160/${heroCountry.iso}.png`"
                  :alt="heroCountry.name"
                  class="h-10 w-auto rounded border border-slate-300 dark:border-white/15 shadow-xs shrink-0"
                />
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5">
                    <span class="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-600 dark:text-sky-300 uppercase">
                      ISO // {{ heroCountry.iso }}
                    </span>
                    <span class="font-mono text-[10px] text-slate-400 truncate">
                      {{ heroCountry.subregion }}
                    </span>
                  </div>
                  <h2 class="text-xl font-black text-slate-900 dark:text-white truncate mt-0.5">
                    {{ heroCountry.name }}
                  </h2>
                </div>
              </div>
            </div>

            <!-- Primary Telemetry Metrics (2x2 Grid like Manchester Cluster Card) -->
            <div class="grid grid-cols-2 gap-2">
              <div class="p-2.5 rounded-lg border border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0B101D]">
                <span class="font-mono text-[10px] uppercase text-slate-400 block">
                  {{ t('common.capital') }}
                </span>
                <strong class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate block mt-0.5">
                  {{ heroCountry.capital }}
                </strong>
              </div>

              <div class="p-2.5 rounded-lg border border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0B101D]">
                <span class="font-mono text-[10px] uppercase text-slate-400 block">
                  {{ locale === 'fr' ? 'POPULATION' : 'POPULATION' }}
                </span>
                <strong class="font-mono text-xs sm:text-sm font-bold text-sky-600 dark:text-sky-400 truncate block mt-0.5">
                  {{ heroCountry.population }}
                </strong>
              </div>

              <div class="p-2.5 rounded-lg border border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0B101D]">
                <span class="font-mono text-[10px] uppercase text-slate-400 block">
                  {{ locale === 'fr' ? 'LANGUE OFF.' : 'OFFICIAL LANG' }}
                </span>
                <strong class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block mt-0.5">
                  {{ heroCountry.lang }}
                </strong>
              </div>

              <div class="p-2.5 rounded-lg border border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0B101D]">
                <span class="font-mono text-[10px] uppercase text-slate-400 block">
                  {{ locale === 'fr' ? 'DEVISE' : 'CURRENCY' }}
                </span>
                <strong class="text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate block mt-0.5">
                  {{ heroCountry.currency }}
                </strong>
              </div>
            </div>

            <!-- Intelligence Brief -->
            <div class="p-3 rounded-lg border border-sky-500/25 bg-sky-500/[0.05] text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <span class="font-mono text-[10px] font-bold uppercase text-sky-600 dark:text-sky-400 block mb-1">
                {{ locale === 'fr' ? 'NOTE D\'ARCHIVE GÉOGRAPHIQUE' : 'GEOGRAPHIC INTELLIGENCE BRIEF' }}
              </span>
              {{ heroCountry.fact }}
            </div>

            <!-- Connected Geodesic Neighbors (Clicking rotates 3D globe along the arc) -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between font-mono text-[10px] text-slate-400 uppercase">
                <span>{{ locale === 'fr' ? 'LIAISONS GÉODÉSIQUES PROCHES' : 'CONNECTED GEODESIC ARCS' }}</span>
                <span>DIST (KM)</span>
              </div>

              <div class="divide-y divide-slate-200/60 dark:divide-white/[0.05] rounded-lg border border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0B101D] overflow-hidden">
                <button
                  v-for="nb in nearestNeighbors"
                  :key="nb.country.iso"
                  type="button"
                  @click="lockOnCountry(nb.country)"
                  class="w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-sky-500/10 transition cursor-pointer group"
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <img :src="`https://flagcdn.com/w40/${nb.country.iso}.png`" class="h-3.5 w-auto rounded-2xs shrink-0" alt="" />
                    <span class="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-sky-400 truncate">
                      {{ nb.country.name }}
                    </span>
                  </div>
                  <span class="font-mono text-[11px] text-fuchsia-500 dark:text-fuchsia-400 font-bold shrink-0">
                    {{ nb.distKm.toLocaleString() }} km
                  </span>
                </button>
              </div>
            </div>
          </div>

          <!-- Action Buttons on Selected State -->
          <div class="flex items-center gap-2 pt-2 border-t border-slate-200/80 dark:border-white/[0.07]">
            <router-link
              :to="{ path: '/quiz', query: { mode: 'mystery' } }"
              class="flex-1 px-3 py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs text-center hover:opacity-90 transition"
            >
              {{ locale === 'fr' ? 'Jouer Pays Mystère' : 'Play Mystery Mode' }}
            </router-link>
            <router-link
              to="/explorer"
              class="px-3 py-2.5 rounded-lg border border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:border-sky-400 font-mono text-xs font-bold transition"
            >
              ATLAS
            </router-link>
          </div>
        </aside>

      </div>
    </section>

    <!-- ========================================================= -->
    <!-- 2. OPERATOR TELEMETRY & ACHIEVEMENT MATRIX                -->
    <!-- ========================================================= -->
    <section
      v-if="currentUser"
      class="rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#070B14] p-6 sm:p-7 shadow-xs space-y-5"
    >
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5 flex-wrap">
            <span class="font-mono text-[11px] uppercase tracking-wider text-sky-600 dark:text-sky-400 font-bold">
              OPERATOR TELEMETRY // {{ displayUsername.toUpperCase() }}
            </span>
            <router-link
              to="/collection"
              class="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
            >
              {{ unlockedBadgesCount }} / {{ userBadges.length }} {{ locale === 'fr' ? 'BADGES ACTIFS' : 'ACTIVE BADGES' }}
            </router-link>
          </div>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            <template v-if="userStats.totalGames > 0">
              {{ locale === 'fr'
                ? `${userStats.totalGames} sessions validées. Dernier rapport : ${userStats.lastMode} (${userStats.lastScore}).`
                : `${userStats.totalGames} sessions completed. Latest report: ${userStats.lastMode} (${userStats.lastScore}).` }}
            </template>
            <template v-else>
              {{ locale === 'fr'
                ? 'Aucune session enregistrée. Lancez un protocole ci-dessous pour initialiser vos statistiques.'
                : 'No recorded sessions yet. Launch a protocol below to initialize your statistics.' }}
            </template>
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <router-link
            to="/collection"
            class="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-white/[0.03] hover:border-sky-500 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 transition"
          >
            COLLECTION (I→V)
          </router-link>
          <router-link
            to="/classement"
            class="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-white/[0.03] hover:border-sky-500 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 transition"
          >
            LEADERBOARD
          </router-link>
          <router-link
            to="/scores"
            class="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-white/[0.03] hover:border-sky-500 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 transition"
          >
            LOGS
          </router-link>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
        <router-link
          v-for="badge in userBadges"
          :key="badge.id"
          to="/collection"
          class="p-3 rounded-xl border transition-all flex flex-col justify-between gap-1.5"
          :class="badge.unlocked
            ? 'bg-sky-500/[0.06] border-sky-500/35 text-slate-900 dark:text-white'
            : 'bg-slate-50/40 dark:bg-white/[0.01] border-slate-200/60 dark:border-white/[0.05] opacity-45'"
        >
          <div class="flex items-center justify-between">
            <span class="font-mono text-[10px] font-bold text-sky-600 dark:text-sky-400">{{ badge.code }}</span>
            <span class="w-1.5 h-1.5 rounded-full" :class="badge.unlocked ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-slate-500'"></span>
          </div>
          <div>
            <strong class="text-xs font-bold block truncate">{{ badge.title }}</strong>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 block truncate">{{ badge.desc }}</span>
          </div>
        </router-link>
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- 3. FULL 12-MODULE TRAINING ARCHITECTURE                   -->
    <!-- ========================================================= -->
    <div class="space-y-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-5">
        <div>
          <span class="font-mono text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-1">
            {{ locale === 'fr' ? 'RÉPERTOIRE OPÉRATIONNEL // 12 MODULES' : 'OPERATIONAL DIRECTORY // 12 MODULES' }}
          </span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {{ locale === 'fr' ? 'Tous les protocoles d\'évaluation et de révision' : 'All Evaluation & Cartographic Study Protocols' }}
          </h2>
        </div>

        <div class="flex flex-wrap items-center gap-1.5">
          <button
            v-for="tab in categoryTabs"
            :key="tab.id"
            type="button"
            @click="selectedCategory = tab.id"
            class="px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition cursor-pointer border"
            :class="selectedCategory === tab.id
              ? 'bg-sky-500 text-slate-950 border-sky-400'
              : 'bg-white dark:bg-[#070B14] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/[0.08] hover:border-slate-400'"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Grid of Filtered Modules -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <router-link
          v-for="mod in visibleModules"
          :key="mod.id"
          :to="mod.to"
          class="group rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#070B14] hover:border-sky-500/60 dark:hover:border-sky-400/50 p-5 flex flex-col justify-between transition-all hover:-translate-y-0.5 shadow-2xs"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-4">
              <span class="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border" :class="mod.badgeClass">
                {{ mod.code }}
              </span>
              <span class="font-mono text-[11px] text-slate-400">
                {{ mod.metric }}
              </span>
            </div>

            <h3 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mb-1.5">
              {{ mod.title }}
            </h3>

            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {{ mod.desc }}
            </p>
          </div>

          <div class="mt-5 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between font-mono text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-sky-500 dark:group-hover:text-sky-400">
            <span>{{ mod.footer }}</span>
            <span class="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ALL_COUNTRIES from '../data/countries.js';

const { t, locale } = useI18n();
const API_URL = 'https://geolearn-backend-bj65.onrender.com';

// =========================================================
// LOCALIZED COUNTRIES & HAVERSINE GEODESIC MATH
// =========================================================
const localizedCountries = computed(() => {
  const isEn = locale.value === 'en';
  return ALL_COUNTRIES.map((c, idx) => ({
    ...c,
    id: c.id || c.iso || idx + 1,
    name: isEn ? c.name_en : c.name_fr,
    capital: isEn ? c.capital_en : c.capital_fr,
    continent: c.continent_en,
    subregion: isEn ? c.subregion_en : c.subregion_fr,
    population: isEn ? c.population_en : c.population_fr,
    lang: isEn ? c.lang_en : c.lang_fr,
    fact: isEn ? c.fact_en : c.fact_fr
  }));
});

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

const formatCoord = (val, posDir, negDir) => {
  const num = Number(val || 0);
  const dir = num >= 0 ? posDir : negDir;
  return `${Math.abs(num).toFixed(2)}° ${dir}`;
};

// =========================================================
// GLOBE SEARCH, CONTINENT SECTORS & TARGET NEIGHBORS
// =========================================================
const globeSearchQuery = ref('');
const activeContinent = ref('all');
const heroIndex = ref(14); // France default
const hoveredCountry = ref(null);

const heroCountry = computed(() => localizedCountries.value[heroIndex.value] || localizedCountries.value[0]);

const searchResults = computed(() => {
  const q = globeSearchQuery.value.trim().toLowerCase();
  if (!q) return [];
  return localizedCountries.value
    .filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q) ||
        c.iso.toLowerCase() === q
    )
    .slice(0, 6);
});

const continentSectors = computed(() => {
  const isFr = locale.value === 'fr';
  const countIn = (cont) => localizedCountries.value.filter((c) => c.continent === cont).length;
  return [
    { id: 'all', label: isFr ? 'GLOBAL' : 'GLOBAL', count: localizedCountries.value.length, lat: 20, lng: 10 },
    { id: 'Europe', label: 'EUROPE', count: countIn('Europe'), lat: 50, lng: 14 },
    { id: 'Asia', label: isFr ? 'ASIE' : 'ASIA', count: countIn('Asia'), lat: 30, lng: 95 },
    { id: 'Africa', label: isFr ? 'AFRIQUE' : 'AFRICA', count: countIn('Africa'), lat: 4, lng: 20 },
    { id: 'Americas', label: isFr ? 'AMÉRIQUES' : 'AMERICAS', count: countIn('North America') + countIn('South America'), lat: 10, lng: -75 },
    { id: 'Oceania', label: isFr ? 'OCÉANIE' : 'OCEANIA', count: countIn('Oceania'), lat: -22, lng: 145 }
  ];
});

const filteredGlobeCountries = computed(() => {
  if (activeContinent.value === 'all') return localizedCountries.value;
  if (activeContinent.value === 'Americas') {
    return localizedCountries.value.filter(
      (c) => c.continent === 'North America' || c.continent === 'South America'
    );
  }
  return localizedCountries.value.filter((c) => c.continent === activeContinent.value);
});

// 6 Nearest Neighbors to draw 3D Geodesic Arcs & populate Right Dock Table
const nearestNeighbors = computed(() => {
  const target = heroCountry.value;
  if (!target) return [];
  return localizedCountries.value
    .filter((c) => c.iso !== target.iso)
    .map((c) => ({
      country: c,
      distKm: computeDistanceKm(target.lat, target.lng, c.lat, c.lng)
    }))
    .sort((a, b) => a.distKm - b.distKm)
    .slice(0, 5);
});

// =========================================================
// REAL WORLD VECTOR BORDERS (TOPOJSON / GEOJSON) + 3D GLOBE
// =========================================================
const globeCanvasRef = ref(null);
const worldPolygonsLoaded = ref(false);
const showBorders = ref(true);
const showArcs = ref(true);
const showGraticule = ref(true);
const autoRotate = ref(true);
const globeZoom = ref(1.0);

let worldRings = []; // Array of [ [lon, lat], ... ] rings for all world countries
let animFrameId = null;

// Smooth camera angles (current vs target for spring interpolation)
let rotLon = -12;
let rotLat = -32;
let targetLon = -12;
let targetLat = -32;
let isCameraLocked = false;
let isDragging = false;
let lastPointerX = 0;
let lastPointerY = 0;
let dragDistance = 0;
let projectedNodes = [];
let pulsePhase = 0;

// Pure 20-line TopoJSON parser to decode world-atlas countries-110m.json
const extractRingsFromTopoJSON = (topology) => {
  const rings = [];
  if (!topology || !topology.objects || !topology.arcs) return rings;
  const { scale, translate } = topology.transform || { scale: [1, 1], translate: [0, 0] };

  const decodedArcs = topology.arcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
    });
  });

  const stitchArcs = (arcIndices) => {
    const coords = [];
    for (const idx of arcIndices) {
      const arc = idx >= 0 ? decodedArcs[idx] : [...decodedArcs[~idx]].reverse();
      if (arc) coords.push(...arc);
    }
    return coords;
  };

  const objKey = Object.keys(topology.objects)[0];
  const geometries = topology.objects[objKey]?.geometries || [];

  for (const geom of geometries) {
    if (geom.type === 'Polygon') {
      for (const ringIdx of geom.arcs) {
        rings.push(stitchArcs(ringIdx));
      }
    } else if (geom.type === 'MultiPolygon') {
      for (const poly of geom.arcs) {
        for (const ringIdx of poly) {
          rings.push(stitchArcs(ringIdx));
        }
      }
    }
  }
  return rings;
};

const loadWorldVectorBorders = async () => {
  try {
    const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
    if (res.ok) {
      const topo = await res.json();
      worldRings = extractRingsFromTopoJSON(topo);
      worldPolygonsLoaded.value = worldRings.length > 0;
      return;
    }
  } catch (e) {}

  // Fallback to standard GeoJSON if jsDelivr is blocked
  try {
    const resGeo = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
    if (resGeo.ok) {
      const geo = await resGeo.json();
      const rings = [];
      for (const feat of geo.features || []) {
        const g = feat.geometry;
        if (!g) continue;
        if (g.type === 'Polygon') {
          rings.push(...g.coordinates);
        } else if (g.type === 'MultiPolygon') {
          for (const poly of g.coordinates) rings.push(...poly);
        }
      }
      worldRings = rings;
      worldPolygonsLoaded.value = worldRings.length > 0;
    }
  } catch (e) {}
};

const lockOnCountry = (country) => {
  if (!country) return;
  const idx = localizedCountries.value.findIndex((c) => c.iso === country.iso);
  if (idx !== -1) heroIndex.value = idx;
  targetLon = -Number(country.lng || 0);
  targetLat = -Math.max(-65, Math.min(65, Number(country.lat || 0)));
  isCameraLocked = true;
};

const selectContinentSector = (sector) => {
  activeContinent.value = sector.id;
  targetLon = -sector.lng;
  targetLat = -sector.lat;
  isCameraLocked = true;
};

const selectRandomGlobeCountry = () => {
  const pool = filteredGlobeCountries.value;
  if (!pool.length) return;
  const randomCountry = pool[Math.floor(Math.random() * pool.length)];
  lockOnCountry(randomCountry);
};

const adjustGlobeZoom = (delta) => {
  globeZoom.value = Math.max(0.85, Math.min(2.8, Number((globeZoom.value + delta).toFixed(2))));
};

const onGlobeWheel = (e) => {
  const delta = e.deltaY < 0 ? 0.12 : -0.12;
  adjustGlobeZoom(delta);
};

const onGlobePointerDown = (e) => {
  isDragging = true;
  isCameraLocked = false;
  dragDistance = 0;
  lastPointerX = e.clientX;
  lastPointerY = e.clientY;
};

const onGlobePointerMove = (e) => {
  const canvas = globeCanvasRef.value;
  if (!canvas) return;

  if (isDragging) {
    const dx = e.clientX - lastPointerX;
    const dy = e.clientY - lastPointerY;
    dragDistance += Math.hypot(dx, dy);
    rotLon += dx * (0.42 / globeZoom.value);
    rotLat = Math.max(-72, Math.min(72, rotLat + dy * (0.35 / globeZoom.value)));
    targetLon = rotLon;
    targetLat = rotLat;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    return;
  }

  // Hover detection over 196 Country Nodes
  const rect = canvas.getBoundingClientRect();
  const cx = e.clientX - rect.left;
  const cy = e.clientY - rect.top;
  let closest = null;
  let minD = 14;
  for (const node of projectedNodes) {
    const d = Math.hypot(node.x - cx, node.y - cy);
    if (d < minD) {
      minD = d;
      closest = localizedCountries.value[node.idx];
    }
  }
  hoveredCountry.value = closest;
};

const onGlobePointerUp = (e) => {
  if (isDragging && dragDistance < 6 && globeCanvasRef.value && e?.clientX) {
    const rect = globeCanvasRef.value.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    let closestIdx = -1;
    let minD = 16;
    for (const node of projectedNodes) {
      const d = Math.hypot(node.x - cx, node.y - cy);
      if (d < minD) {
        minD = d;
        closestIdx = node.idx;
      }
    }
    if (closestIdx !== -1) {
      lockOnCountry(localizedCountries.value[closestIdx]);
    }
  }
  isDragging = false;
};

const onGlobePointerLeave = () => {
  isDragging = false;
  hoveredCountry.value = null;
};

// Spherical Linear Interpolation (Slerp) for 3D Great-Circle Geodesic Arcs
const slerpLatLon = (lat1, lon1, lat2, lon2, tParam) => {
  const toRad = (d) => (d * Math.PI) / 180;
  const toDeg = (r) => (r * 180) / Math.PI;
  const p1 = toRad(lat1), l1 = toRad(lon1);
  const p2 = toRad(lat2), l2 = toRad(lon2);

  const x1 = Math.cos(p1) * Math.cos(l1);
  const y1 = Math.cos(p1) * Math.sin(l1);
  const z1 = Math.sin(p1);

  const x2 = Math.cos(p2) * Math.cos(l2);
  const y2 = Math.cos(p2) * Math.sin(l2);
  const z2 = Math.sin(p2);

  const dot = Math.max(-1, Math.min(1, x1 * x2 + y1 * y2 + z1 * z2));
  const omega = Math.acos(dot);
  if (omega < 0.0001) return [lat1, lon1];

  const sinOmega = Math.sin(omega);
  const a = Math.sin((1 - tParam) * omega) / sinOmega;
  const b = Math.sin(tParam * omega) / sinOmega;

  const x = a * x1 + b * x2;
  const y = a * y1 + b * y2;
  const z = a * z1 + b * z2;

  const lat = toDeg(Math.atan2(z, Math.hypot(x, y)));
  const lon = toDeg(Math.atan2(y, x));
  return [lat, lon];
};

const renderGlobe = () => {
  const canvas = globeCanvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = rect.width || 440;
  const H = rect.height || 440;

  if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
  }

  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const cx = W / 2;
  const cy = H / 2;
  const R = Math.min(W, H) * 0.42 * globeZoom.value;

  // Smooth spring camera rotation
  if (isCameraLocked && !isDragging) {
    const dLon = ((targetLon - rotLon + 540) % 360) - 180;
    const dLat = targetLat - rotLat;
    rotLon += dLon * 0.08;
    rotLat += dLat * 0.08;
    if (Math.abs(dLon) < 0.15 && Math.abs(dLat) < 0.15) {
      isCameraLocked = false;
    }
  } else if (autoRotate.value && !isDragging) {
    rotLon -= 0.14;
    targetLon = rotLon;
  }

  pulsePhase = (pulsePhase + 0.018) % 1;

  // 1. Outer Atmospheric Glow Halo
  const outerHalo = ctx.createRadialGradient(cx, cy, R * 0.88, cx, cy, R * 1.14);
  outerHalo.addColorStop(0, 'rgba(14, 165, 233, 0)');
  outerHalo.addColorStop(0.65, 'rgba(14, 165, 233, 0.14)');
  outerHalo.addColorStop(1, 'rgba(14, 165, 233, 0)');
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.14, 0, Math.PI * 2);
  ctx.fillStyle = outerHalo;
  ctx.fill();

  // 2. Ocean Sphere Core
  const oceanGrad = ctx.createRadialGradient(cx - R * 0.28, cy - R * 0.28, R * 0.08, cx, cy, R);
  oceanGrad.addColorStop(0, '#0a1628');
  oceanGrad.addColorStop(0.7, '#050b16');
  oceanGrad.addColorStop(1, '#02050b');

  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fillStyle = oceanGrad;
  ctx.fill();

  // Clip everything inside the sphere
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.clip();

  const toRad = (d) => (d * Math.PI) / 180;
  const lam0 = toRad(-rotLon);
  const phi0 = toRad(-rotLat);
  const sinPhi0 = Math.sin(phi0);
  const cosPhi0 = Math.cos(phi0);

  const projectLatLon = (latDeg, lonDeg, altitudeRatio = 1) => {
    const phi = toRad(latDeg);
    const lam = toRad(lonDeg);
    const dLam = lam - lam0;
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);
    const cosC = sinPhi0 * sinPhi + cosPhi0 * cosPhi * Math.cos(dLam);
    if (cosC < 0) return null;
    const rad = R * altitudeRatio;
    const x = cx + rad * (cosPhi * Math.sin(dLam));
    const y = cy - rad * (cosPhi0 * sinPhi - sinPhi0 * cosPhi * Math.cos(dLam));
    return { x, y, z: cosC };
  };

  // 3. Geodesic Graticule Grid (15 deg)
  if (showGraticule.value) {
    ctx.lineWidth = 0.55;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.11)';
    for (let lon = -180; lon < 180; lon += 20) {
      ctx.beginPath();
      let started = false;
      for (let lat = -80; lat <= 80; lat += 6) {
        const p = projectLatLon(lat, lon);
        if (p) {
          if (!started) { ctx.moveTo(p.x, p.y); started = true; }
          else ctx.lineTo(p.x, p.y);
        } else started = false;
      }
      ctx.stroke();
    }
    for (let lat = -60; lat <= 60; lat += 20) {
      ctx.beginPath();
      let started = false;
      for (let lon = -180; lon <= 180; lon += 6) {
        const p = projectLatLon(lat, lon);
        if (p) {
          if (!started) { ctx.moveTo(p.x, p.y); started = true; }
          else ctx.lineTo(p.x, p.y);
        } else started = false;
      }
      ctx.stroke();
    }
  }

  // 4. REAL COUNTRY BORDERS & LANDMASS POLYGONS
  if (showBorders.value && worldRings.length > 0) {
    ctx.fillStyle = 'rgba(14, 34, 64, 0.72)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.48)';
    ctx.lineWidth = 0.85;

    for (const ring of worldRings) {
      ctx.beginPath();
      let visiblePts = 0;
      let prevPt = null;
      for (let i = 0; i < ring.length; i++) {
        const [lon, lat] = ring[i];
        const p = projectLatLon(lat, lon);
        if (p) {
          if (!prevPt || Math.hypot(p.x - prevPt.x, p.y - prevPt.y) > R * 0.35) {
            ctx.moveTo(p.x, p.y);
          } else {
            ctx.lineTo(p.x, p.y);
          }
          prevPt = p;
          visiblePts++;
        } else {
          prevPt = null;
        }
      }
      if (visiblePts > 2) {
        ctx.fill();
        ctx.stroke();
      }
    }
  }

  // 5. 3D GEODESIC ARCS & TRAVELING TELEMETRY PULSES
  const activeTarget = heroCountry.value;
  if (showArcs.value && activeTarget) {
    for (const nb of nearestNeighbors.value) {
      const dest = nb.country;
      ctx.beginPath();
      let started = false;
      const steps = 28;
      for (let s = 0; s <= steps; s++) {
        const tStep = s / steps;
        const [lat, lon] = slerpLatLon(activeTarget.lat, activeTarget.lng, dest.lat, dest.lng, tStep);
        // Parabolic 3D loft above the globe surface
        const loft = 1 + Math.sin(tStep * Math.PI) * 0.055;
        const p = projectLatLon(lat, lon, loft);
        if (p) {
          if (!started) { ctx.moveTo(p.x, p.y); started = true; }
          else ctx.lineTo(p.x, p.y);
        } else {
          started = false;
        }
      }
      ctx.strokeStyle = 'rgba(217, 70, 239, 0.55)';
      ctx.lineWidth = 1.35;
      ctx.stroke();

      // Animated photon pulse along the 3D arc
      const [pLat, pLon] = slerpLatLon(activeTarget.lat, activeTarget.lng, dest.lat, dest.lng, pulsePhase);
      const pLoft = 1 + Math.sin(pulsePhase * Math.PI) * 0.055;
      const pulsePt = projectLatLon(pLat, pLon, pLoft);
      if (pulsePt) {
        ctx.beginPath();
        ctx.arc(pulsePt.x, pulsePt.y, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = '#f0abfc';
        ctx.fill();
      }
    }
  }

  // 6. SOVEREIGN CAPITAL CLUSTERS (WITH NEON HALOS LIKE REFERENCE)
  const nextNodes = [];
  const allList = localizedCountries.value;
  const activeSectorSet = new Set(filteredGlobeCountries.value.map((c) => c.iso));
  const neighborIsos = new Set(nearestNeighbors.value.map((n) => n.country.iso));
  let targetProjected = null;

  for (let i = 0; i < allList.length; i++) {
    const c = allList[i];
    const p = projectLatLon(c.lat, c.lng);
    if (!p) continue;

    nextNodes.push({ x: p.x, y: p.y, z: p.z, idx: i });

    if (i === heroIndex.value) {
      targetProjected = p;
      continue;
    }

    const inSector = activeSectorSet.has(c.iso);
    const isNeighbor = neighborIsos.has(c.iso);

    if (isNeighbor) {
      // Magenta glowing cluster for connected neighbors
      const glow = ctx.createRadialGradient(p.x, p.y, 0.5, p.x, p.y, 8);
      glow.addColorStop(0, 'rgba(232, 121, 249, 0.9)');
      glow.addColorStop(1, 'rgba(232, 121, 249, 0)');
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = '#f5d0fe';
      ctx.fill();
    } else if (inSector) {
      // Cyan telemetry node
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${0.45 + p.z * 0.55})`;
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.fill();
    }
  }

  // 7. ACTIVE TARGET LOCK RETICLE ON 3D GLOBE
  if (targetProjected) {
    const { x, y } = targetProjected;
    const bloom = ctx.createRadialGradient(x, y, 1, x, y, 18);
    bloom.addColorStop(0, 'rgba(16, 185, 129, 0.85)');
    bloom.addColorStop(0.5, 'rgba(56, 189, 248, 0.35)');
    bloom.addColorStop(1, 'rgba(16, 185, 129, 0)');
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fillStyle = bloom;
    ctx.fill();

    // Expanding radar ring
    const ringRadius = 6 + pulsePhase * 12;
    ctx.beginPath();
    ctx.arc(x, y, ringRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(52, 211, 153, ${1 - pulsePhase})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, 4.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#10b981';
    ctx.stroke();
  }

  ctx.restore(); // End sphere clip

  // 8. Specular Atmospheric Rim Border
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.stroke();

  projectedNodes = nextNodes;
  ctx.restore();
  animFrameId = requestAnimationFrame(renderGlobe);
};

// =========================================================
// MODULES & PROTOCOLS DIRECTORY
// =========================================================
const selectedCategory = ref('all');
const categoryTabs = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'all', label: isFr ? 'TOUS (12)' : 'ALL (12)' },
    { id: 'featured', label: isFr ? '01 // PHARES & DUEL' : '01 // FLAGSHIP & DUEL' },
    { id: 'classics', label: isFr ? '02 // CLASSIQUES & SPRINT' : '02 // CLASSICS & SPRINT' },
    { id: 'innovation', label: isFr ? '03 // DÉDUCTION & CUSTOM' : '03 // DEDUCTION & CUSTOM' },
    { id: 'revision', label: isFr ? '04 // ATLAS & ÉTUDE' : '04 // ATLAS & STUDY' }
  ];
});

const allModules = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    {
      id: 'mystery',
      cat: 'featured',
      code: 'MOD-01 // WORLDLE',
      metric: '6 TRIES',
      title: isFr ? 'Le Pays Mystère (Worldle)' : 'Mystery Country (Worldle)',
      desc: isFr
        ? 'Triangulez l\'État cible en 6 essais grâce à la distance orthodromique en kilomètres, l\'azimut boussole et le pourcentage de proximité.'
        : 'Triangulate the target state in 6 tries using great-circle distance in km, compass bearing, and proximity percentage.',
      footer: 'HAVERSINE TELEMETRY',
      badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
      dotClass: 'bg-amber-400',
      tag: 'WORLDLE',
      to: { path: '/quiz', query: { mode: 'mystery' } }
    },
    {
      id: 'pindrop',
      cat: 'featured',
      code: 'MOD-02 // ORBITAL',
      metric: '25,000 PTS',
      title: 'GeoLearn PinDrop (Satellite & Photo)',
      desc: isFr
        ? 'Analysez une vue satellite orbitale sans étiquette ou un cliché géolocalisé, placez votre épingle et mesurez votre écart au mètre près.'
        : 'Inspect an unlabeled orbital satellite view or geotagged photograph, drop your pin, and measure your metric offset.',
      footer: '5 ROUNDS // SATELLITE',
      badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      dotClass: 'bg-sky-400',
      tag: '25K PTS',
      to: '/geoguessr'
    },
    {
      id: 'duel',
      cat: 'featured',
      code: 'MOD-03 // ARENA 1V1',
      metric: 'REAL-TIME',
      title: isFr ? 'Arène Duel & Face-à-Face' : '1v1 Live Duel Arena',
      desc: isFr
        ? 'Affrontez un ami à distance via lien de salon, jouez à 2 sur le même clavier (A-Z-E-R vs 1-2-3-4) ou défiez un rival de ligue.'
        : 'Battle a friend remotely via room link, play 2P split-keyboard on one screen, or face a live league rival.',
      footer: 'BLITZ // SNIPER // RACE',
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      dotClass: 'bg-rose-500',
      tag: '1V1 LIVE',
      to: '/duel'
    },
    {
      id: 'capitals',
      cat: 'classics',
      code: 'MOD-04 // CAPITALS',
      metric: '15 QCM',
      title: t('home.mode_caps_title'),
      desc: t('home.mode_caps_desc'),
      footer: 'OFFICIAL CAPITALS',
      badgeClass: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
      dotClass: 'bg-blue-400',
      tag: '15 QCM',
      to: { path: '/quiz', query: { mode: 'qcm', type: 'capital' } }
    },
    {
      id: 'flags',
      cat: 'classics',
      code: 'MOD-05 // FLAGS',
      metric: '196 STATES',
      title: t('home.mode_flags_title'),
      desc: t('home.mode_flags_desc'),
      footer: 'VEXILLOLOGY IDENTIFICATION',
      badgeClass: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
      dotClass: 'bg-indigo-400',
      tag: 'FLAGS',
      to: { path: '/quiz', query: { mode: 'qcm', type: 'flag' } }
    },
    {
      id: 'flash60',
      cat: 'classics',
      code: 'MOD-06 // SPRINT 60S',
      metric: 'COMBO X4',
      title: isFr ? 'Contre-la-montre 60s (QCM Flash)' : '60-Second Time Trial (Flash)',
      desc: isFr
        ? 'Enchaînez un maximum de capitales et drapeaux en 60 secondes avec multiplicateur de combo et bonus de +2 secondes.'
        : 'Chain as many capitals and flags as possible in 60 seconds with combo multipliers and +2s time extensions.',
      footer: 'SPEED MULTIPLIER',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dotClass: 'bg-amber-400',
      tag: '60S SPRINT',
      to: { path: '/quiz', query: { mode: 'flash60' } }
    },
    {
      id: 'chrono',
      cat: 'classics',
      code: 'MOD-07 // JETPUNK',
      metric: '47 / 196',
      title: isFr ? 'Défis Chrono Carte (Clavier)' : 'Timed Map Typing (JetPunk)',
      desc: isFr
        ? 'Saisissez au clavier les 47 pays d\'Europe ou les 196 pays du Monde sur carte muette avec grilles continentales.'
        : 'Type all 47 European countries or all 196 World countries on a blank map with continental grids.',
      footer: 'EUROPE 47 // WORLD 196',
      badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      dotClass: 'bg-cyan-400',
      tag: 'CHRONO',
      to: { path: '/quiz', query: { mode: 'chrono' } }
    },
    {
      id: 'detective',
      cat: 'innovation',
      code: 'MOD-08 // DEDUCTION',
      metric: '25 PTS MAX',
      title: isFr ? 'Enquête Géographique (5 Indices)' : '5-Clue Geographic Detective',
      desc: isFr
        ? 'Identifiez l\'État mystère en dévoilant le moins d\'indices possible (superficie, devise, anecdote masquée, capitale).'
        : 'Identify the mystery state while revealing as few progressive clues as possible.',
      footer: '5 PROGRESSIVE CLUES',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dotClass: 'bg-emerald-400',
      tag: '5 CLUES',
      to: { path: '/quiz', query: { mode: 'detective' } }
    },
    {
      id: 'map-click',
      cat: 'innovation',
      code: 'MOD-09 // SETERRA',
      metric: 'ZERO TYPING',
      title: isFr ? 'Cliquez sur la Carte Muette' : 'Blank Map Precision Click',
      desc: isFr
        ? 'Pointez directement chaque État demandé sur la carte muette sans aucune saisie clavier.'
        : 'Click directly on each requested sovereign state on the blank map with zero keyboard input.',
      footer: 'PINPOINT ACCURACY',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dotClass: 'bg-teal-400',
      tag: 'MAP CLICK',
      to: { path: '/quiz', query: { mode: 'map-click' } }
    },
    {
      id: 'culture',
      cat: 'innovation',
      code: 'MOD-10 // DEMOGRAPHICS',
      metric: 'POP & LANG',
      title: isFr ? 'Population, Langues & Monnaies' : 'Population, Languages & Currencies',
      desc: isFr
        ? 'Comparez les ordres de grandeur démographiques, les langues officielles et les devises nationales.'
        : 'Compare demographic magnitudes, official languages, and national currencies.',
      footer: 'CULTURAL TELEMETRY',
      badgeClass: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30',
      dotClass: 'bg-fuchsia-400',
      tag: 'CULTURE',
      to: { path: '/quiz', query: { mode: 'qcm', type: 'culture' } }
    },
    {
      id: 'custom-builder',
      cat: 'innovation',
      code: 'MOD-11 // CUSTOM SEED',
      metric: '5 TO 15',
      title: isFr ? 'Créateur de Défis sur-mesure' : 'Custom Challenge Builder',
      desc: isFr
        ? 'Sélectionnez manuellement de 5 à 15 pays pour générer un lien de défi personnalisé partageable.'
        : 'Manually pick 5 to 15 countries to generate a shareable custom challenge link.',
      footer: 'SHAREABLE SEED LINK',
      badgeClass: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30',
      dotClass: 'bg-pink-400',
      tag: 'BUILDER',
      to: { path: '/quiz', query: { mode: 'custom-builder' } }
    },
    {
      id: 'atlas',
      cat: 'revision',
      code: 'MOD-12 // ATLAS & DECK',
      metric: '196 DOSSIERS',
      title: isFr ? 'Atlas Comparateur & Flashcards 3D' : 'Comparator Atlas & 3D Flashcards',
      desc: isFr
        ? 'Comparez deux États côte à côte, explorez la grille des 196 drapeaux et révisez avec les cartes mémoire.'
        : 'Compare two states side-by-side, inspect the 196-flag matrix, and study with memory cards.',
      footer: 'OPEN ATLAS & STUDY',
      badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      dotClass: 'bg-sky-400',
      tag: 'ATLAS',
      to: '/explorer'
    }
  ];
});

const quickProtocols = computed(() => allModules.value);

const visibleModules = computed(() => {
  if (selectedCategory.value === 'all') return allModules.value;
  return allModules.value.filter((m) => m.cat === selectedCategory.value);
});

// =========================================================
// USER TELEMETRY & BADGES
// =========================================================
const currentUser = ref(null);
const userScoresList = ref([]);

const displayUsername = computed(() => {
  if (!currentUser.value) return '';
  return (
    currentUser.value.username ||
    currentUser.value.pseudo ||
    currentUser.value.name ||
    (currentUser.value.user && (currentUser.value.user.username || currentUser.value.user.name)) ||
    (currentUser.value.email ? currentUser.value.email.split('@')[0] : 'Operator')
  );
});

const userStats = ref({
  totalGames: 0,
  lastMode: '',
  lastScore: ''
});

const userBadges = computed(() => {
  const isFr = locale.value === 'fr';
  const scores = userScoresList.value;
  const total = scores.length;

  const hasPerfectQcm = scores.some((s) => Number(s.max_score) === 15 && Number(s.score) >= 14);
  const hasEuropeMaster = scores.some((s) => (s.mode || '').includes('Europe') && Number(s.score) >= 40);
  const hasWorldExplorer = scores.some((s) => (s.mode || '').includes('Monde') && Number(s.score) >= 100);
  const hasPinDropAce = scores.some((s) => (s.mode || '').includes('GeoGuessr') && Number(s.score) >= 18000);
  const hasVeteran = total >= 10;

  return [
    {
      id: 'first-step',
      code: 'INIT-01',
      title: isFr ? 'Premier Pas' : 'First Step',
      desc: isFr ? '1re session validée' : '1st session completed',
      unlocked: total >= 1
    },
    {
      id: 'qcm-ace',
      code: 'QCM-90',
      title: isFr ? 'Précision QCM' : 'Quiz Precision',
      desc: isFr ? '14/15 ou 15/15 en QCM' : '14/15 or 15/15 in QCM',
      unlocked: hasPerfectQcm
    },
    {
      id: 'europe-master',
      code: 'EUR-40',
      title: isFr ? 'Maître d\'Europe' : 'Europe Master',
      desc: isFr ? '40+ pays en Défi Europe' : '40+ in Europe Challenge',
      unlocked: hasEuropeMaster
    },
    {
      id: 'world-globetrotter',
      code: 'WLD-100',
      title: 'Globetrotter',
      desc: isFr ? '100+ pays en Défi Monde' : '100+ in World Challenge',
      unlocked: hasWorldExplorer
    },
    {
      id: 'pindrop-hawk',
      code: 'SAT-18K',
      title: isFr ? 'Œil Orbital' : 'Orbital Eye',
      desc: isFr ? '18 000+ pts sur PinDrop' : '18,000+ pts on PinDrop',
      unlocked: hasPinDropAce
    },
    {
      id: 'veteran',
      code: 'VET-10',
      title: isFr ? 'Vétéran GeoLearn' : 'GeoLearn Veteran',
      desc: isFr ? '10+ sessions complétées' : '10+ sessions completed',
      unlocked: hasVeteran
    }
  ];
});

const unlockedBadgesCount = computed(() => userBadges.value.filter((b) => b.unlocked).length);

onMounted(async () => {
  loadWorldVectorBorders();
  renderGlobe();

  const savedUser = localStorage.getItem('geolearn_user');
  if (!savedUser) return;
  try {
    const parsed = JSON.parse(savedUser);
    currentUser.value = parsed;
    const uid = parsed.id || (parsed.user && parsed.user.id);
    if (uid) {
      const res = await fetch(`${API_URL}/api/scores/${uid}`);
      if (res.ok) {
        const scores = await res.json();
        if (Array.isArray(scores) && scores.length > 0) {
          userScoresList.value = scores;
          userStats.value.totalGames = scores.length;
          userStats.value.lastMode = scores[0].mode;
          userStats.value.lastScore = `${scores[0].score}/${scores[0].max_score}`;
        }
      }
    }
  } catch (e) {}
});

onUnmounted(() => {
  if (animFrameId) cancelAnimationFrame(animFrameId);
});
</script>