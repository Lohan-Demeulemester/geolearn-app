<template>
  <div class="space-y-16 pb-12">

    <!-- ========================================================= -->
    <!-- 1. HERO: INTERACTIVE 3D GEODESIC GLOBE & TELEMETRY        -->
    <!-- ========================================================= -->
    <section class="hero-surface relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B0F17] p-6 sm:p-10 lg:p-12 shadow-sm">
      <!-- Subtle Cartographic Grid Backdrop -->
      <div class="hero-grid-overlay pointer-events-none absolute inset-0 opacity-40 dark:opacity-25"></div>

      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        <!-- Left Column: Editorial Typography & Primary Actions -->
        <div class="lg:col-span-7 space-y-6 text-left">
          <div class="inline-flex items-center gap-2.5 px-3 py-1 rounded-md bg-sky-500/10 border border-sky-500/25 text-sky-600 dark:text-sky-400 font-mono text-[11px] font-semibold uppercase tracking-wider">
            <span class="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
            <span>{{ locale === 'fr' ? 'SYSTÈME CARTOGRAPHIQUE INTERACTIF // 196 ÉTATS' : 'INTERACTIVE CARTOGRAPHIC SYSTEM // 196 STATES' }}</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-[3.35rem] font-black tracking-tight text-slate-900 dark:text-white leading-[1.06]">
            {{ locale === 'fr' ? 'Maîtrisez la géographie mondiale avec' : 'Master world geography with' }}
            <span class="text-sky-600 dark:text-sky-400">
              {{ locale === 'fr' ? 'précision.' : 'precision.' }}
            </span>
          </h1>

          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
            {{ locale === 'fr'
              ? 'Localisation satellite sans étiquettes, défis quotidiens par relèvement boussole, duels 1v1 en temps réel et grilles continentales chronométrées sur les 196 pays reconnus.'
              : 'Unlabeled satellite pin-dropping, daily compass-bearing challenges, real-time 1v1 duels, and timed continental grids across all 196 recognized sovereign states.' }}
          </p>

          <!-- Primary Action Controls -->
          <div class="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-1">
            <router-link
              to="/quiz"
              class="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm hover:opacity-90 transition shadow-xs"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>{{ locale === 'fr' ? 'Lancer une session Quiz' : 'Start Quiz Session' }}</span>
            </router-link>

            <router-link
              to="/geoguessr"
              class="inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30 font-bold text-sm transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>GeoLearn PinDrop</span>
            </router-link>

            <router-link
              to="/duel"
              class="inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/25 font-bold text-sm transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.5 17.5 3 6V3h3l11.5 11.5" />
                <path d="m13 19 6-6" /><path d="m16 16 4 4" />
              </svg>
              <span>{{ locale === 'fr' ? 'Arène Duel 1v1' : '1v1 Duel Arena' }}</span>
            </router-link>

            <router-link
              to="/explorer"
              class="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200/70 dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] font-semibold text-sm transition"
            >
              <span>{{ locale === 'fr' ? 'Atlas & Comparateur' : 'Atlas & Comparator' }}</span>
            </router-link>
          </div>

          <!-- Verified Dataset Telemetry Bar -->
          <div class="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/80 dark:border-white/[0.08] max-w-lg">
            <div>
              <span class="font-mono text-xs uppercase tracking-wider text-slate-400 block">
                {{ locale === 'fr' ? 'Base Géodésique' : 'Geodesic Index' }}
              </span>
              <strong class="font-mono text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5 block">
                {{ localizedCountries.length }}
              </strong>
              <span class="text-xs text-slate-500">{{ locale === 'fr' ? 'États souverains' : 'Sovereign states' }}</span>
            </div>

            <div>
              <span class="font-mono text-xs uppercase tracking-wider text-slate-400 block">
                {{ locale === 'fr' ? 'Modules Actifs' : 'Active Modules' }}
              </span>
              <strong class="font-mono text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400 mt-0.5 block">
                12
              </strong>
              <span class="text-xs text-slate-500">{{ locale === 'fr' ? 'Modes d\'entraînement' : 'Training modes' }}</span>
            </div>

            <div>
              <span class="font-mono text-xs uppercase tracking-wider text-slate-400 block">
                {{ locale === 'fr' ? 'Régions ONU' : 'UN Continents' }}
              </span>
              <strong class="font-mono text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                6
              </strong>
              <span class="text-xs text-slate-500">{{ locale === 'fr' ? 'Couverture complète' : 'Full coverage' }}</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Interactive 3D Geodesic Globe + Live Telemetry Readout -->
        <div class="lg:col-span-5 flex flex-col items-center">
          <div class="w-full max-w-md rounded-2xl border border-slate-200/90 dark:border-white/[0.09] bg-slate-50/70 dark:bg-[#070A10] p-4 sm:p-5 shadow-inner">
            <!-- Globe Top Telemetry Header -->
            <div class="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pb-3 mb-2 border-b border-slate-200/70 dark:border-white/[0.06]">
              <span class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{{ locale === 'fr' ? 'GLOBE 3D INTERACTIF (GLISSER)' : '3D INTERACTIVE GLOBE (DRAG)' }}</span>
              </span>
              <button
                type="button"
                @click="selectRandomGlobeCountry"
                class="text-sky-600 dark:text-sky-400 hover:underline cursor-pointer font-semibold"
              >
                [{{ locale === 'fr' ? 'CIBLE ALÉATOIRE' : 'RANDOM TARGET' }}]
              </button>
            </div>

            <!-- 3D Canvas Viewport -->
            <div class="relative flex items-center justify-center my-1 select-none">
              <canvas
                ref="globeCanvasRef"
                width="320"
                height="320"
                class="w-[270px] h-[270px] sm:w-[300px] sm:h-[300px] cursor-grab active:cursor-grabbing"
                @pointerdown="onGlobePointerDown"
                @pointermove="onGlobePointerMove"
                @pointerup="onGlobePointerUp"
                @pointerleave="onGlobePointerUp"
              ></canvas>
            </div>

            <!-- Active Country Telemetry Readout Card -->
            <div class="mt-2 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0D121C] p-3.5 transition-all">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <img
                    :src="`https://flagcdn.com/w80/${heroCountry.iso}.png`"
                    :alt="heroCountry.name"
                    class="h-7 w-auto rounded-xs border border-slate-200 dark:border-white/10 shrink-0"
                  />
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <h3 class="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {{ heroCountry.name }}
                      </h3>
                      <span class="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400 uppercase">
                        {{ heroCountry.iso }}
                      </span>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {{ t('common.capital') }}: <strong class="text-slate-800 dark:text-slate-200">{{ heroCountry.capital }}</strong>
                    </p>
                  </div>
                </div>

                <div class="text-right font-mono text-[11px] text-sky-600 dark:text-sky-400 shrink-0">
                  <div>{{ formatCoord(heroCountry.lat, 'N', 'S') }}</div>
                  <div>{{ formatCoord(heroCountry.lng, 'E', 'W') }}</div>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-white/[0.06] text-[11px]">
                <div>
                  <span class="text-slate-400 block">{{ locale === 'fr' ? 'Sous-région' : 'Subregion' }}</span>
                  <strong class="text-slate-700 dark:text-slate-200 truncate block">{{ heroCountry.subregion }}</strong>
                </div>
                <div>
                  <span class="text-slate-400 block">{{ locale === 'fr' ? 'Population' : 'Population' }}</span>
                  <strong class="font-mono text-slate-700 dark:text-slate-200 truncate block">{{ heroCountry.population }}</strong>
                </div>
                <div>
                  <span class="text-slate-400 block">{{ locale === 'fr' ? 'Monnaie' : 'Currency' }}</span>
                  <strong class="text-slate-700 dark:text-slate-200 truncate block">{{ heroCountry.currency }}</strong>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>

    <!-- ========================================================= -->
    <!-- 2. AUTHENTICATED PLAYER TELEMETRY & TROPHY PROGRESSION    -->
    <!-- ========================================================= -->
    <section
      v-if="currentUser"
      class="rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B0F17] p-6 sm:p-8 shadow-xs space-y-6"
    >
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-1">
          <div class="flex items-center gap-2.5 flex-wrap">
            <span class="font-mono text-xs uppercase tracking-wider text-sky-600 dark:text-sky-400 font-bold">
              {{ locale === 'fr' ? 'PROFIL OPÉRATEUR ACTIF' : 'ACTIVE OPERATOR PROFILE' }}
            </span>
            <router-link
              to="/collection"
              class="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 hover:bg-amber-500/20 transition"
            >
              {{ unlockedBadgesCount }} / {{ userBadges.length }} {{ locale === 'fr' ? 'BADGES VALIDÉS' : 'BADGES UNLOCKED' }}
            </router-link>
          </div>

          <h2 class="text-2xl font-black text-slate-900 dark:text-white">
            {{ displayUsername }}
          </h2>

          <p class="text-sm text-slate-600 dark:text-slate-400">
            <template v-if="userStats.totalGames > 0">
              {{ locale === 'fr'
                ? `${userStats.totalGames} session(s) enregistrée(s). Dernière activité : ${userStats.lastMode} (${userStats.lastScore}).`
                : `${userStats.totalGames} recorded session(s). Latest activity: ${userStats.lastMode} (${userStats.lastScore}).` }}
            </template>
            <template v-else>
              {{ locale === 'fr'
                ? 'Aucune session enregistrée. Lancez un mode pour initialiser vos statistiques.'
                : 'No recorded sessions yet. Launch any mode to initialize your telemetry.' }}
            </template>
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5 shrink-0">
          <router-link
            to="/collection"
            class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-white/[0.04] hover:border-sky-500 text-slate-800 dark:text-slate-200 text-xs font-bold transition"
          >
            {{ locale === 'fr' ? 'Collection (I → V)' : 'Badges (I → V)' }}
          </router-link>
          <router-link
            to="/classement"
            class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-white/[0.04] hover:border-sky-500 text-slate-800 dark:text-slate-200 text-xs font-bold transition"
          >
            {{ locale === 'fr' ? 'Classement & Ligues' : 'Leaderboard & Leagues' }}
          </router-link>
          <router-link
            to="/scores"
            class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-white/[0.04] hover:border-sky-500 text-slate-800 dark:text-slate-200 text-xs font-bold transition"
          >
            {{ locale === 'fr' ? 'Historique' : 'History' }}
          </router-link>
        </div>
      </div>

      <!-- Achievement Matrix -->
      <div class="pt-5 border-t border-slate-100 dark:border-white/[0.06]">
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <router-link
            v-for="badge in userBadges"
            :key="badge.id"
            to="/collection"
            class="p-3 rounded-xl border transition-all flex flex-col justify-between gap-2"
            :class="badge.unlocked
              ? 'bg-sky-500/[0.06] border-sky-500/30 text-slate-900 dark:text-white'
              : 'bg-slate-50/50 dark:bg-white/[0.02] border-slate-200/60 dark:border-white/[0.05] opacity-50'"
          >
            <div class="flex items-center justify-between">
              <span class="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300">
                {{ badge.code }}
              </span>
              <span
                class="w-2 h-2 rounded-full"
                :class="badge.unlocked ? 'bg-emerald-500' : 'bg-slate-400'"
              ></span>
            </div>
            <div>
              <strong class="text-xs font-bold block truncate">{{ badge.title }}</strong>
              <span class="text-[11px] text-slate-500 dark:text-slate-400 block truncate">{{ badge.desc }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- 3. TRAINING & COMPETITION DIRECTORY (4 THEMATIC PILLARS)  -->
    <!-- ========================================================= -->
    <div class="space-y-12">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-6">
        <div>
          <span class="font-mono text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-1">
            {{ locale === 'fr' ? 'ARCHITECTURE D\'ENTRAÎNEMENT // 4 SECTIONS' : 'TRAINING ARCHITECTURE // 4 PILLARS' }}
          </span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {{ locale === 'fr' ? 'Sélectionnez votre protocole de jeu' : 'Select Your Training Protocol' }}
          </h2>
        </div>

        <!-- Category Filter Pills -->
        <div class="flex flex-wrap items-center gap-1.5">
          <button
            v-for="tab in categoryTabs"
            :key="tab.id"
            type="button"
            @click="selectedCategory = tab.id"
            class="px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer border"
            :class="selectedCategory === tab.id
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white'
              : 'bg-white dark:bg-[#0B0F17] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/[0.08] hover:border-slate-400'"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- SECTION 01: FLAGSHIP & MULTIPLAYER ARENA                -->
      <!-- ======================================================= -->
      <section v-if="selectedCategory === 'all' || selectedCategory === 'featured'" class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <span class="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              01 // {{ locale === 'fr' ? 'EXPÉRIENCES PHARES & MULTIJOUEUR' : 'FLAGSHIP & MULTIPLAYER ARENA' }}
            </span>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">
              {{ locale === 'fr' ? 'Orientation géodésique, imagerie orbitale et duel temps réel' : 'Geodesic bearing, orbital imagery, and real-time duel' }}
            </h3>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <!-- Mode 1: Mystery Country (Worldle) -->
          <router-link
            :to="{ path: '/quiz', query: { mode: 'mystery' } }"
            class="mode-card group rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0B0F17] p-6 flex flex-col justify-between hover:border-amber-500/60 transition-all"
          >
            <div>
              <div class="flex items-center justify-between mb-5">
                <div class="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                  </svg>
                </div>
                <span class="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  DAILY + INFINITE
                </span>
              </div>
              <h4 class="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {{ locale === 'fr' ? 'Le Pays Mystère (Worldle)' : 'Mystery Country (Worldle)' }}
              </h4>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {{ locale === 'fr'
                  ? '6 tentatives pour trianguler l\'État cible via la distance orthodromique en kilomètres, l\'azimut boussole et l\'indice de proximité.'
                  : '6 attempts to triangulate the target state using great-circle distance in km, compass bearing, and proximity index.' }}
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between font-mono text-xs text-amber-600 dark:text-amber-400 font-bold">
              <span>6 TRIES // HAVERSINE</span>
              <span class="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </router-link>

          <!-- Mode 2: GeoLearn PinDrop -->
          <router-link
            to="/geoguessr"
            class="mode-card group rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0B0F17] p-6 flex flex-col justify-between hover:border-sky-500/60 transition-all"
          >
            <div>
              <div class="flex items-center justify-between mb-5">
                <div class="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/25 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span class="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  25,000 PTS MAX
                </span>
              </div>
              <h4 class="text-lg font-bold text-slate-900 dark:text-white mb-2">
                GeoLearn PinDrop
              </h4>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Analysez une vue satellite orbitale sans étiquette ou un cliché géolocalisé, placez votre marqueur et comparez votre écart métrique.'
                  : 'Inspect an unlabeled orbital satellite feed or geotagged photograph, drop your coordinate pin, and measure your metric offset.' }}
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between font-mono text-xs text-sky-600 dark:text-sky-400 font-bold">
              <span>5 ROUNDS // SATELLITE & PHOTO</span>
              <span class="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </router-link>

          <!-- Mode 3: 1v1 Duel Arena -->
          <router-link
            to="/duel"
            class="mode-card group rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0B0F17] p-6 flex flex-col justify-between hover:border-rose-500/60 transition-all"
          >
            <div>
              <div class="flex items-center justify-between mb-5">
                <div class="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
                    <line x1="13" y1="19" x2="19" y2="13" />
                    <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
                  </svg>
                </div>
                <span class="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  1V1 MULTIPLAYER
                </span>
              </div>
              <h4 class="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {{ locale === 'fr' ? 'Arène Duel & Face-à-Face' : '1v1 Live Duel Arena' }}
              </h4>
              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Affrontez le fantôme d\'un ami via lien de salon, jouez à deux sur le même clavier (A-Z-E-R vs 1-2-3-4) ou défiez un rival de ligue.'
                  : 'Battle a friend\'s recorded ghost via room link, play 2-player split-keyboard on one screen, or face a league rival.' }}
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between font-mono text-xs text-rose-600 dark:text-rose-400 font-bold">
              <span>BLITZ // SNIPER // TYPE RACE</span>
              <span class="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </router-link>
        </div>
      </section>

      <!-- ======================================================= -->
      <!-- SECTION 02: CLASSICS, SPRINT & TIMED COMPETITION        -->
      <!-- ======================================================= -->
      <section v-if="selectedCategory === 'all' || selectedCategory === 'classics'" class="space-y-4">
        <div>
          <span class="font-mono text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            02 // {{ locale === 'fr' ? 'CLASSIQUES & COMPÉTITION CHRONOMÉTRÉE' : 'CLASSICS & TIMED COMPETITION' }}
          </span>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">
            {{ locale === 'fr' ? 'Épreuves fondamentales de rapidité et d\'exactitude' : 'Core speed and accuracy evaluations' }}
          </h3>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <router-link
            :to="{ path: '/quiz', query: { mode: 'qcm', type: 'capital' } }"
            class="mode-card group rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0B0F17] p-5 flex flex-col justify-between hover:border-sky-500/60 transition-all"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-200 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <line x1="3" y1="22" x2="21" y2="22" /><line x1="6" y1="18" x2="6" y2="11" />
                    <line x1="10" y1="18" x2="10" y2="11" /><line x1="14" y1="18" x2="14" y2="11" />
                    <line x1="18" y1="18" x2="18" y2="11" /><polygon points="12 2 20 7 4 7" />
                  </svg>
                </div>
                <span class="font-mono text-[10px] text-slate-400">15 QCM</span>
              </div>
              <h4 class="text-base font-bold text-slate-900 dark:text-white mb-1.5">{{ t('home.mode_caps_title') }}</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ t('home.mode_caps_desc') }}</p>
            </div>
            <span class="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] font-mono text-[11px] font-bold text-sky-600 dark:text-sky-400 flex items-center justify-between">
              <span>CAPITALS // DUEL LINK</span>
              <span>→</span>
            </span>
          </router-link>

          <router-link
            :to="{ path: '/quiz', query: { mode: 'qcm', type: 'flag' } }"
            class="mode-card group rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0B0F17] p-5 flex flex-col justify-between hover:border-sky-500/60 transition-all"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-200 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                    <line x1="4" y1="22" x2="4" y2="15" />
                  </svg>
                </div>
                <span class="font-mono text-[10px] text-slate-400">VEXILLOLOGY</span>
              </div>
              <h4 class="text-base font-bold text-slate-900 dark:text-white mb-1.5">{{ t('home.mode_flags_title') }}</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ t('home.mode_flags_desc') }}</p>
            </div>
            <span class="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] font-mono text-[11px] font-bold text-sky-600 dark:text-sky-400 flex items-center justify-between">
              <span>196 OFFICIAL FLAGS</span>
              <span>→</span>
            </span>
          </router-link>

          <router-link
            :to="{ path: '/quiz', query: { mode: 'flash60' } }"
            class="mode-card group rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0B0F17] p-5 flex flex-col justify-between hover:border-amber-500/60 transition-all"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <span class="font-mono text-[10px] text-amber-500 font-bold">COMBO X4</span>
              </div>
              <h4 class="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                {{ locale === 'fr' ? 'Sprint QCM (60s)' : '60s Flash Sprint' }}
              </h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Enchaînez un maximum de bonnes réponses en 60 secondes avec multiplicateur de série et bonus de +2s.'
                  : 'Chain as many answers as possible in 60 seconds with streak multipliers and +2s time extensions.' }}
              </p>
            </div>
            <span class="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center justify-between">
              <span>60S TIME TRIAL</span>
              <span>→</span>
            </span>
          </router-link>

          <router-link
            :to="{ path: '/quiz', query: { mode: 'chrono' } }"
            class="mode-card group rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0B0F17] p-5 flex flex-col justify-between hover:border-sky-500/60 transition-all"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-200 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <circle cx="12" cy="13" r="8" />
                    <path d="M12 9v4l2 2" /><path d="M5 3 2 6" /><path d="m22 6-3-3" />
                  </svg>
                </div>
                <span class="font-mono text-[10px] text-slate-400">JETPUNK GRID</span>
              </div>
              <h4 class="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                {{ locale === 'fr' ? 'Défis Chrono (Clavier)' : 'Timed Map Typing' }}
              </h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Saisissez les 47 pays d\'Europe ou les 196 pays du Monde sur carte muette avec grilles continentales.'
                  : 'Type all 47 European countries or all 196 World countries on a blank map with continental grids.' }}
              </p>
            </div>
            <span class="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] font-mono text-[11px] font-bold text-sky-600 dark:text-sky-400 flex items-center justify-between">
              <span>EUROPE 47 // WORLD 196</span>
              <span>→</span>
            </span>
          </router-link>
        </div>
      </section>

      <!-- ======================================================= -->
      <!-- SECTION 03: INNOVATION & CUSTOM CHALLENGE BUILDER       -->
      <!-- ======================================================= -->
      <section v-if="selectedCategory === 'all' || selectedCategory === 'innovation'" class="space-y-4">
        <div>
          <span class="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            03 // {{ locale === 'fr' ? 'INNOVATION, DÉDUCTION & DÉFIS SUR-MESURE' : 'INNOVATION, DEDUCTION & CUSTOM BUILDER' }}
          </span>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">
            {{ locale === 'fr' ? 'Mécaniques d\'investigation, pointage sur carte muette et création de salons' : 'Investigative mechanics, blank-map pointing, and custom challenge creation' }}
          </h3>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <router-link
            :to="{ path: '/quiz', query: { mode: 'detective' } }"
            class="mode-card group rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0B0F17] p-5 flex flex-col justify-between hover:border-emerald-500/60 transition-all"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <span class="font-mono text-[10px] text-emerald-500 font-bold">5 CLUES</span>
              </div>
              <h4 class="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                {{ locale === 'fr' ? 'Enquête aux 5 Indices' : '5-Clue Detective' }}
              </h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Identifiez l\'État cible en dévoilant un minimum d\'indices (superficie, devise, anecdote masquée, capitale).'
                  : 'Identify the target state while revealing as few progressive clues as possible.' }}
              </p>
            </div>
            <span class="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
              <span>DEDUCTION // 25 PTS</span>
              <span>→</span>
            </span>
          </router-link>

          <router-link
            :to="{ path: '/quiz', query: { mode: 'map-click' } }"
            class="mode-card group rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0B0F17] p-5 flex flex-col justify-between hover:border-emerald-500/60 transition-all"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <circle cx="12" cy="12" r="10" /><line x1="22" y1="12" x2="18" y2="12" />
                    <line x1="6" y1="12" x2="2" y2="12" /><line x1="12" y1="6" x2="12" y2="2" />
                    <line x1="12" y1="22" x2="12" y2="18" />
                  </svg>
                </div>
                <span class="font-mono text-[10px] text-emerald-500 font-bold">ZERO TYPING</span>
              </div>
              <h4 class="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                {{ locale === 'fr' ? 'Cliquez sur la Carte' : 'Click on the Map' }}
              </h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Pointez directement chaque État demandé sur la carte muette sans saisie clavier.'
                  : 'Click directly on each requested sovereign state on the blank map with zero keyboard input.' }}
              </p>
            </div>
            <span class="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
              <span>SETERRA PRECISION</span>
              <span>→</span>
            </span>
          </router-link>

          <router-link
            :to="{ path: '/quiz', query: { mode: 'qcm', type: 'culture' } }"
            class="mode-card group rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0B0F17] p-5 flex flex-col justify-between hover:border-emerald-500/60 transition-all"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-200 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <span class="font-mono text-[10px] text-slate-400">DEMOGRAPHICS</span>
              </div>
              <h4 class="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                {{ locale === 'fr' ? 'Population, Langues & Devises' : 'Population, Languages & Currencies' }}
              </h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Comparez les ordres de grandeur démographiques, les langues officielles et les monnaies.'
                  : 'Compare demographic magnitudes, official languages, and national currencies.' }}
              </p>
            </div>
            <span class="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
              <span>CULTURE & DATA</span>
              <span>→</span>
            </span>
          </router-link>

          <router-link
            :to="{ path: '/quiz', query: { mode: 'custom-builder' } }"
            class="mode-card group rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0B0F17] p-5 flex flex-col justify-between hover:border-emerald-500/60 transition-all"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-200 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>
                <span class="font-mono text-[10px] text-slate-400">CUSTOM SEED</span>
              </div>
              <h4 class="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                {{ locale === 'fr' ? 'Créateur de Défis' : 'Custom Challenge Builder' }}
              </h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Sélectionnez de 5 à 15 pays précis pour générer un lien de défi sur-mesure partageable.'
                  : 'Pick 5 to 15 specific countries to generate a shareable custom challenge link.' }}
              </p>
            </div>
            <span class="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
              <span>5 TO 15 COUNTRIES</span>
              <span>→</span>
            </span>
          </router-link>
        </div>
      </section>

      <!-- ======================================================= -->
      <!-- SECTION 04: STUDY, FLASHCARDS & CARTOGRAPHIC ATLAS      -->
      <!-- ======================================================= -->
      <section v-if="selectedCategory === 'all' || selectedCategory === 'revision'" class="space-y-4">
        <div>
          <span class="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            04 // {{ locale === 'fr' ? 'RÉVISION ACTIVE & EXPLORATION ATLAS' : 'ACTIVE STUDY & ATLAS EXPLORATION' }}
          </span>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">
            {{ locale === 'fr' ? 'Mémorisation sans chronomètre et comparateur géodésique' : 'Untimed memory training and geodesic country comparator' }}
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <router-link
            :to="{ path: '/quiz', query: { mode: 'flashcards' } }"
            class="mode-card group rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0B0F17] p-6 flex flex-col justify-between hover:border-sky-500/60 transition-all"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-200 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M12 4v16" />
                  </svg>
                </div>
                <span class="font-mono text-[10px] text-slate-400">STUDY DECK</span>
              </div>
              <h4 class="text-lg font-bold text-slate-900 dark:text-white mb-1.5">{{ t('home.mode_flash_title') }}</h4>
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Cartes mémoire recto-verso filtrables par continent avec navigation au clavier (flèches & espace).'
                  : 'Double-sided memory cards filterable by continent with keyboard navigation (arrow keys & space).' }}
              </p>
            </div>
            <span class="mt-5 pt-3 border-t border-slate-100 dark:border-white/[0.06] font-mono text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center justify-between">
              <span>196 CARDS // KEYBOARD NAV</span>
              <span>→</span>
            </span>
          </router-link>

          <router-link
            :to="{ path: '/quiz', query: { mode: 'flag-grid' } }"
            class="mode-card group rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#0B0F17] p-6 flex flex-col justify-between hover:border-sky-500/60 transition-all"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-9 h-9 rounded-lg bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-200 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                  </svg>
                </div>
                <span class="font-mono text-[10px] text-slate-400">VISUAL MATRIX</span>
              </div>
              <h4 class="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
                {{ locale === 'fr' ? 'Grille Mondiale des Drapeaux' : 'World Flag Matrix' }}
              </h4>
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Visualisez simultanément tous les drapeaux d\'un continent ou du monde avec validation instantanée.'
                  : 'View all flags from a continent or the world simultaneously with auto-advancing input validation.' }}
              </p>
            </div>
            <span class="mt-5 pt-3 border-t border-slate-100 dark:border-white/[0.06] font-mono text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center justify-between">
              <span>AUTO-FOCUS INPUT</span>
              <span>→</span>
            </span>
          </router-link>

          <router-link
            to="/explorer"
            class="mode-card group rounded-2xl border border-sky-500/30 bg-sky-500/[0.04] dark:bg-sky-500/[0.06] p-6 flex flex-col justify-between hover:border-sky-500 transition-all"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-9 h-9 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                    <line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
                  </svg>
                </div>
                <span class="font-mono text-[10px] text-sky-600 dark:text-sky-400 font-bold">ATLAS + COMPARATOR</span>
              </div>
              <h4 class="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
                {{ locale === 'fr' ? 'Atlas Interactif & Comparateur' : 'Interactive Atlas & Comparator' }}
              </h4>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Comparez deux États côte à côte (superficie, démographie, distance orthodromique) et inspectez les 196 fiches.'
                  : 'Compare any two states side-by-side (area, demographics, great-circle distance) and inspect all 196 dossiers.' }}
              </p>
            </div>
            <span class="mt-5 pt-3 border-t border-sky-500/20 font-mono text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center justify-between">
              <span>OPEN CARTOGRAPHIC ATLAS</span>
              <span>→</span>
            </span>
          </router-link>
        </div>
      </section>

    </div>

    <!-- ========================================================= -->
    <!-- 4. GEOGRAPHIC INTELLIGENCE BRIEFING                       -->
    <!-- ========================================================= -->
    <section class="rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#0B0F17] p-6 sm:p-8 shadow-xs">
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1">
          <img
            :src="`https://flagcdn.com/w160/${spotlightCountry.iso}.png`"
            :alt="spotlightCountry.name"
            class="h-14 w-auto rounded border border-slate-200 dark:border-white/10 shrink-0"
          />
          <div class="space-y-1.5">
            <div class="flex flex-wrap items-center gap-2.5 font-mono text-xs">
              <span class="px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold">
                {{ locale === 'fr' ? 'ARCHIVE GÉOGRAPHIQUE' : 'GEOGRAPHIC DOSSIER' }}
              </span>
              <span class="text-slate-500 dark:text-slate-400">
                [{{ spotlightCountry.iso.toUpperCase() }}] {{ spotlightCountry.name }} // {{ t('common.capital') }}: {{ spotlightCountry.capital }} ({{ spotlightCountry.population }})
              </span>
            </div>
            <p class="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              {{ spotlightCountry.fact }}
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="pickRandomSpotlight"
          class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-white/[0.04] hover:border-sky-500 text-slate-800 dark:text-white font-mono text-xs font-bold transition cursor-pointer shrink-0"
        >
          [{{ locale === 'fr' ? 'DOSSIER SUIVANT' : 'NEXT DOSSIER' }}]
        </button>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ALL_COUNTRIES from '../data/countries.js';

const { t, locale } = useI18n();
const API_URL = 'https://geolearn-backend-bj65.onrender.com';

const selectedCategory = ref('all');
const categoryTabs = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'all', label: isFr ? 'Tous les modules (12)' : 'All Modules (12)' },
    { id: 'featured', label: isFr ? '01 // Phares & Duel' : '01 // Flagship & Duel' },
    { id: 'classics', label: isFr ? '02 // Classiques & Sprint' : '02 // Classics & Sprint' },
    { id: 'innovation', label: isFr ? '03 // Innovation' : '03 // Innovation' },
    { id: 'revision', label: isFr ? '04 // Révision & Atlas' : '04 // Study & Atlas' }
  ];
});

const localizedCountries = computed(() => {
  const isEn = locale.value === 'en';
  return ALL_COUNTRIES.map((c, idx) => ({
    ...c,
    id: c.id || c.iso || idx + 1,
    name: isEn ? c.name_en : c.name_fr,
    capital: isEn ? c.capital_en : c.capital_fr,
    subregion: isEn ? c.subregion_en : c.subregion_fr,
    population: isEn ? c.population_en : c.population_fr,
    lang: isEn ? c.lang_en : c.lang_fr,
    fact: isEn ? c.fact_en : c.fact_fr
  }));
});

const formatCoord = (val, posDir, negDir) => {
  const num = Number(val || 0);
  const dir = num >= 0 ? posDir : negDir;
  return `${Math.abs(num).toFixed(2)}° ${dir}`;
};

// =========================================================
// INTERACTIVE 3D ORTHOGRAPHIC GEODESIC GLOBE ENGINE
// =========================================================
const globeCanvasRef = ref(null);
const heroIndex = ref(14); // France by default
const heroCountry = computed(() => localizedCountries.value[heroIndex.value] || localizedCountries.value[0]);

let animFrameId = null;
let rotLon = -10;
let rotLat = -22;
let velLon = 0.18;
let isDragging = false;
let lastPointerX = 0;
let lastPointerY = 0;
let dragDistance = 0;
let projectedNodes = [];

const focusGlobeOnCountry = (country) => {
  if (!country) return;
  rotLon = -Number(country.lng || 0);
  rotLat = -Number(country.lat || 0) * 0.65;
};

const selectRandomGlobeCountry = () => {
  const nextIdx = Math.floor(Math.random() * localizedCountries.value.length);
  heroIndex.value = nextIdx;
  focusGlobeOnCountry(localizedCountries.value[nextIdx]);
};

const onGlobePointerDown = (e) => {
  isDragging = true;
  dragDistance = 0;
  lastPointerX = e.clientX;
  lastPointerY = e.clientY;
};

const onGlobePointerMove = (e) => {
  if (!isDragging) return;
  const dx = e.clientX - lastPointerX;
  const dy = e.clientY - lastPointerY;
  dragDistance += Math.hypot(dx, dy);
  rotLon += dx * 0.45;
  rotLat = Math.max(-65, Math.min(65, rotLat + dy * 0.35));
  lastPointerX = e.clientX;
  lastPointerY = e.clientY;
};

const onGlobePointerUp = (e) => {
  if (isDragging && dragDistance < 6 && globeCanvasRef.value && e?.clientX) {
    // Raycast click against projected 3D country coordinates
    const rect = globeCanvasRef.value.getBoundingClientRect();
    const scaleX = globeCanvasRef.value.width / rect.width;
    const scaleY = globeCanvasRef.value.height / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;

    let closestIdx = -1;
    let minD = 18;
    for (const node of projectedNodes) {
      const d = Math.hypot(node.x - cx, node.y - cy);
      if (d < minD) {
        minD = d;
        closestIdx = node.idx;
      }
    }
    if (closestIdx !== -1) {
      heroIndex.value = closestIdx;
    }
  }
  isDragging = false;
};

const renderGlobe = () => {
  const canvas = globeCanvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2;
  const R = W * 0.41;

  const isDark = document.documentElement.classList.contains('dark');
  ctx.clearRect(0, 0, W, H);

  if (!isDragging) {
    rotLon += velLon;
  }

  // 1. Sphere Base & Atmosphere Halo
  const grad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
  if (isDark) {
    grad.addColorStop(0, '#132038');
    grad.addColorStop(1, '#070b14');
  } else {
    grad.addColorStop(0, '#f0f7ff');
    grad.addColorStop(1, '#dbeafe');
  }

  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.32)' : 'rgba(2, 132, 199, 0.35)';
  ctx.stroke();

  const toRad = (d) => (d * Math.PI) / 180;
  const lam0 = toRad(-rotLon);
  const phi0 = toRad(-rotLat);
  const sinPhi0 = Math.sin(phi0);
  const cosPhi0 = Math.cos(phi0);

  const projectLatLon = (latDeg, lonDeg) => {
    const phi = toRad(latDeg);
    const lam = toRad(lonDeg);
    const dLam = lam - lam0;
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);
    const cosC = sinPhi0 * sinPhi + cosPhi0 * cosPhi * Math.cos(dLam);
    if (cosC < 0) return null;
    const x = cx + R * (cosPhi * Math.sin(dLam));
    const y = cy - R * (cosPhi0 * sinPhi - sinPhi0 * cosPhi * Math.cos(dLam));
    return { x, y, z: cosC };
  };

  // 2. Graticule Meridians & Parallels
  ctx.lineWidth = 0.6;
  ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(71, 85, 105, 0.14)';

  for (let lon = -180; lon < 180; lon += 30) {
    ctx.beginPath();
    let started = false;
    for (let lat = -80; lat <= 80; lat += 8) {
      const p = projectLatLon(lat, lon);
      if (p) {
        if (!started) { ctx.moveTo(p.x, p.y); started = true; }
        else ctx.lineTo(p.x, p.y);
      } else {
        started = false;
      }
    }
    ctx.stroke();
  }

  for (let lat = -60; lat <= 60; lat += 30) {
    ctx.beginPath();
    let started = false;
    for (let lon = -180; lon <= 180; lon += 8) {
      const p = projectLatLon(lat, lon);
      if (p) {
        if (!started) { ctx.moveTo(p.x, p.y); started = true; }
        else ctx.lineTo(p.x, p.y);
      } else {
        started = false;
      }
    }
    ctx.stroke();
  }

  // 3. Plot all 196 Country Coordinates from ALL_COUNTRIES
  const nextProjected = [];
  const countries = localizedCountries.value;
  let activeProj = null;

  for (let i = 0; i < countries.length; i++) {
    const c = countries[i];
    const p = projectLatLon(c.lat, c.lng);
    if (!p) continue;
    nextProjected.push({ x: p.x, y: p.y, z: p.z, idx: i });

    if (i === heroIndex.value) {
      activeProj = p;
      continue;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = isDark
      ? `rgba(56, 189, 248, ${0.35 + p.z * 0.55})`
      : `rgba(2, 132, 199, ${0.4 + p.z * 0.55})`;
    ctx.fill();
  }

  // 4. Highlight Active Target Country on Globe
  if (activeProj) {
    ctx.beginPath();
    ctx.arc(activeProj.x, activeProj.y, 8.5, 0, Math.PI * 2);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(activeProj.x, activeProj.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.fill();
  }

  projectedNodes = nextProjected;
  animFrameId = requestAnimationFrame(renderGlobe);
};

// Geographic Dossier Spotlight
const spotlightIndex = ref(Math.floor(Math.random() * ALL_COUNTRIES.length));
const spotlightCountry = computed(() => localizedCountries.value[spotlightIndex.value] || localizedCountries.value[0]);

const pickRandomSpotlight = () => {
  let next = Math.floor(Math.random() * localizedCountries.value.length);
  if (next === spotlightIndex.value) next = (next + 1) % localizedCountries.value.length;
  spotlightIndex.value = next;
};

// User Telemetry & Achievement Matrix
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

  const hasPerfectQcm = scores.some(s => Number(s.max_score) === 15 && Number(s.score) >= 14);
  const hasEuropeMaster = scores.some(s => (s.mode || '').includes('Europe') && Number(s.score) >= 40);
  const hasWorldExplorer = scores.some(s => (s.mode || '').includes('Monde') && Number(s.score) >= 100);
  const hasPinDropAce = scores.some(s => (s.mode || '').includes('GeoGuessr') && Number(s.score) >= 18000);
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

const unlockedBadgesCount = computed(() => userBadges.value.filter(b => b.unlocked).length);

onMounted(async () => {
  focusGlobeOnCountry(heroCountry.value);
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
  } catch (e) {
    // Offline fallback
  }
});

onUnmounted(() => {
  if (animFrameId) cancelAnimationFrame(animFrameId);
});
</script>

<style scoped>
.hero-grid-overlay {
  background-image:
    linear-gradient(to right, rgba(148, 163, 184, 0.12) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(148, 163, 184, 0.12) 1px, transparent 1px);
  background-size: 32px 32px;
}

.mode-card {
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.2s ease, box-shadow 0.2s ease;
}

.mode-card:hover {
  transform: translateY(-2px);
}
</style>