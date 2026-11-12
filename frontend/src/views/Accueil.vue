<template>
  <div class="home-experience">

    <!-- ========================================================= -->
    <!-- 1. SCÈNE IMMERSIVE PLEIN ÉCRAN (GLOBE 3D SPHÉRIQUE FIXE)  -->
    <!-- ========================================================= -->
    <section
      class="orbital-stage relative w-full min-h-[calc(100vh-58px)] flex flex-col justify-between overflow-hidden select-none"
      @pointermove="onStagePointerMove"
    >
      <!-- Halos lumineux organiques & Typographie monumentale en arrière-plan -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          class="ambient-orb ambient-orb-primary"
          :style="{ transform: `translate3d(${parallaxX * -28}px, ${parallaxY * -28}px, 0)` }"
        ></div>
        <div
          class="ambient-orb ambient-orb-secondary"
          :style="{ transform: `translate3d(${parallaxX * 24}px, ${parallaxY * 24}px, 0)` }"
        ></div>

        <!-- Typographie monumentale en filigrane derrière le Globe -->
        <div
          class="watermark-display"
          :style="{ transform: `translate3d(calc(-50% + ${parallaxX * -16}px), calc(-50% + ${parallaxY * -10}px), 0)` }"
        >
          <span>GEOLEARN</span>
          <span class="watermark-sub">WORLD ATLAS • 196</span>
        </div>
      </div>

      <!-- GLOBE 3D AU CENTRE DE L'ÉCRAN (TAILLE FIXE, ZÉRO COUPURE CARRÉE) -->
      <div class="globe-centerpiece absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div class="relative flex items-center justify-center pointer-events-auto">
          <canvas
            ref="globeCanvasRef"
            class="globe-canvas cursor-grab active:cursor-grabbing"
            @pointerdown="onGlobePointerDown"
            @pointermove="onGlobePointerMove"
            @pointerup="onGlobePointerUp"
            @pointerleave="onGlobePointerLeave"
          ></canvas>

          <!-- Infobulle flottante au survol d'un pays sur le Globe -->
          <transition name="fade-up">
            <div
              v-if="hoveredCountry"
              class="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-slate-900/92 dark:bg-white/95 text-white dark:text-slate-950 font-sans text-xs font-bold flex items-center gap-2.5 shadow-2xl backdrop-blur-md"
            >
              <img :src="`https://flagcdn.com/w40/${hoveredCountry.iso}.png`" class="h-4 w-auto rounded-xs" alt="" />
              <span>{{ hoveredCountry.name }}</span>
              <span class="opacity-60 font-mono text-[11px]">{{ hoveredCountry.capital }}</span>
            </div>
          </transition>
        </div>
      </div>

      <!-- BARRE SUPÉRIEURE FLOTTANTE : RECHERCHE & FILTRES CONTINENTS -->
      <div class="relative z-20 w-full max-w-[1600px] mx-auto px-4 sm:px-8 pt-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pointer-events-none">
        
        <!-- Recherche rapide + Sélecteur de continents en pilules -->
        <div class="flex flex-wrap items-center gap-2 pointer-events-auto">
          <div class="relative">
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              v-model="globeSearchQuery"
              type="text"
              :placeholder="locale === 'fr' ? 'Chercher un pays sur le globe...' : 'Search a country on the globe...'"
              class="w-56 sm:w-64 pl-9 pr-8 py-2 rounded-full bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-sky-400 shadow-lg"
            />
            <button
              v-if="globeSearchQuery"
              type="button"
              @click="globeSearchQuery = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              ×
            </button>

            <!-- Résultats de recherche flottants -->
            <div
              v-if="searchResults.length > 0"
              class="absolute left-0 right-0 top-full mt-2 z-40 rounded-2xl border border-slate-200/80 dark:border-white/15 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden divide-y divide-slate-100 dark:divide-white/5"
            >
              <button
                v-for="item in searchResults"
                :key="item.iso"
                type="button"
                @click="lockOnCountry(item); globeSearchQuery = ''"
                class="w-full px-4 py-2.5 text-left text-xs flex items-center justify-between hover:bg-sky-500/10 transition cursor-pointer"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <img :src="`https://flagcdn.com/w40/${item.iso}.png`" class="h-3.5 w-auto rounded-2xs shrink-0" alt="" />
                  <span class="font-bold text-slate-900 dark:text-white truncate">{{ item.name }}</span>
                </div>
                <span class="font-mono text-[10px] text-sky-500 uppercase">{{ item.capital }}</span>
              </button>
            </div>
          </div>

          <!-- Pilules Continents -->
          <div class="hidden xl:flex items-center gap-1 p-1 rounded-full bg-white/80 dark:bg-slate-900/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-lg">
            <button
              v-for="sec in continentSectors"
              :key="sec.id"
              type="button"
              @click="selectContinentSector(sec)"
              class="px-3 py-1.5 rounded-full text-[11px] font-bold transition cursor-pointer"
              :class="activeContinent === sec.id
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
            >
              {{ sec.label }}
            </button>
          </div>
        </div>

        <!-- Contrôles visuels du Globe (Sans zoom déformant) -->
        <div class="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-white/80 dark:bg-slate-900/75 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-lg pointer-events-auto">
          <button
            type="button"
            @click="showBorders = !showBorders"
            class="px-3 py-1.5 rounded-full text-[11px] font-bold transition cursor-pointer"
            :class="showBorders ? 'bg-sky-500/20 text-sky-600 dark:text-sky-300' : 'text-slate-400'"
          >
            {{ locale === 'fr' ? 'Frontières' : 'Borders' }}
          </button>
          <button
            type="button"
            @click="showArcs = !showArcs"
            class="px-3 py-1.5 rounded-full text-[11px] font-bold transition cursor-pointer"
            :class="showArcs ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' : 'text-slate-400'"
          >
            {{ locale === 'fr' ? 'Liaisons 3D' : '3D Arcs' }}
          </button>
          <button
            type="button"
            @click="autoRotate = !autoRotate"
            class="px-3 py-1.5 rounded-full text-[11px] font-bold transition cursor-pointer"
            :class="autoRotate ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300' : 'text-slate-400'"
          >
            {{ autoRotate ? (locale === 'fr' ? 'Rotation Auto' : 'Auto Spin') : (locale === 'fr' ? 'Pause' : 'Paused') }}
          </button>
          <button
            type="button"
            @click="selectRandomGlobeCountry"
            class="px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[11px] font-extrabold transition cursor-pointer hover:scale-105"
          >
            {{ locale === 'fr' ? 'Pays Aléatoire ↻' : 'Random Country ↻' }}
          </button>
        </div>
      </div>

      <!-- ZONE MÉDIANE : ACCROCHE ÉDITORIALE FLOTTANTE (GAUCHE) & CARTE PAYS 3D (DROITE) -->
      <div class="relative z-20 w-full max-w-[1600px] mx-auto px-4 sm:px-8 my-auto py-6 grid grid-cols-1 lg:grid-cols-12 items-center gap-8 pointer-events-none">
        
        <!-- Colonne Gauche Flottante : Titre corrigé (sans lettres coupées en bas) & Accès Direct -->
        <div
          class="lg:col-span-4 space-y-5 pointer-events-auto"
          :style="{ transform: `translate3d(${parallaxX * 6}px, ${parallaxY * 6}px, 0)` }"
        >
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-600 dark:text-sky-300 text-xs font-bold backdrop-blur-md">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{{ locale === 'fr' ? 'Explorez la planète en temps réel' : 'Explore the planet in real time' }}</span>
          </div>

          <h1 class="text-4xl sm:text-5xl xl:text-[3.35rem] font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            <span class="block">{{ locale === 'fr' ? 'Le monde entier' : 'The entire world' }}</span>
            <span class="block pb-2 pt-0.5 bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              {{ locale === 'fr' ? 'au bout des doigts.' : 'at your fingertips.' }}
            </span>
          </h1>

          <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300/90 max-w-md leading-relaxed">
            {{ locale === 'fr'
              ? 'Faites tourner le globe à la souris, cliquez sur n\'importe lequel des 196 États pour inspecter ses frontières et lancez vos défis géographiques.'
              : 'Spin the globe by hand, click any of the 196 sovereign states to inspect its borders, and launch your geography challenges.' }}
          </p>

          <div class="flex flex-wrap items-center gap-3 pt-1">
            <router-link
              to="/quiz"
              class="px-6 py-3.5 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-sky-500/25 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <span>{{ locale === 'fr' ? 'Lancer un Quiz' : 'Start a Quiz' }}</span>
              <span>→</span>
            </router-link>

            <router-link
              to="/geoguessr"
              class="px-5 py-3.5 rounded-full bg-white/85 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200/80 dark:border-white/15 font-bold text-sm backdrop-blur-xl shadow-lg hover:-translate-y-0.5 transition-all"
            >
              PinDrop 25K
            </router-link>

            <router-link
              to="/duel"
              class="px-5 py-3.5 rounded-full bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-300 border border-rose-500/35 font-bold text-sm backdrop-blur-xl hover:-translate-y-0.5 transition-all"
            >
              {{ locale === 'fr' ? 'Duel 1v1' : '1v1 Duel' }}
            </router-link>
          </div>
        </div>

        <!-- Espace central laissé libre pour manipuler le Globe 3D -->
        <div class="hidden lg:block lg:col-span-4"></div>

        <!-- Colonne Droite Flottante : Carte d'Exploration du Pays Ciblé -->
        <div
          class="lg:col-span-4 flex justify-end pointer-events-auto"
          :style="{ transform: `translate3d(${parallaxX * -8}px, ${parallaxY * -8}px, 0)` }"
        >
          <transition name="card-fade" mode="out-in">
            <div
              :key="heroCountry.iso"
              class="w-full max-w-sm rounded-3xl bg-white/85 dark:bg-slate-900/78 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 p-5 sm:p-6 shadow-2xl space-y-4"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3.5 min-w-0">
                  <img
                    :src="`https://flagcdn.com/w160/${heroCountry.iso}.png`"
                    :alt="heroCountry.name"
                    class="h-11 w-auto rounded-lg shadow-md border border-slate-200 dark:border-white/10 shrink-0"
                  />
                  <div class="min-w-0">
                    <span class="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block truncate">
                      {{ heroCountry.subregion }}
                    </span>
                    <h2 class="text-2xl font-black text-slate-900 dark:text-white truncate leading-tight">
                      {{ heroCountry.name }}
                    </h2>
                  </div>
                </div>
                <span class="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 uppercase shrink-0">
                  {{ heroCountry.iso }}
                </span>
              </div>

              <div class="grid grid-cols-2 gap-2.5">
                <div class="p-3 rounded-2xl bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200/60 dark:border-white/[0.06]">
                  <span class="text-[11px] text-slate-400 block">{{ t('common.capital') }}</span>
                  <strong class="text-sm font-bold text-slate-900 dark:text-white truncate block mt-0.5">{{ heroCountry.capital }}</strong>
                </div>
                <div class="p-3 rounded-2xl bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200/60 dark:border-white/[0.06]">
                  <span class="text-[11px] text-slate-400 block">{{ locale === 'fr' ? 'Habitants' : 'Population' }}</span>
                  <strong class="text-sm font-bold text-sky-600 dark:text-sky-400 truncate block mt-0.5">{{ heroCountry.population }}</strong>
                </div>
                <div class="p-3 rounded-2xl bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200/60 dark:border-white/[0.06]">
                  <span class="text-[11px] text-slate-400 block">{{ locale === 'fr' ? 'Langue' : 'Language' }}</span>
                  <strong class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block mt-0.5">{{ heroCountry.lang }}</strong>
                </div>
                <div class="p-3 rounded-2xl bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200/60 dark:border-white/[0.06]">
                  <span class="text-[11px] text-slate-400 block">{{ locale === 'fr' ? 'Monnaie' : 'Currency' }}</span>
                  <strong class="text-xs font-bold text-emerald-600 dark:text-emerald-400 truncate block mt-0.5">{{ heroCountry.currency }}</strong>
                </div>
              </div>

              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-sky-500/[0.07] border border-sky-500/20 rounded-2xl p-3.5">
                {{ heroCountry.fact }}
              </p>

              <!-- Pays voisins cliquables en pilules fluides -->
              <div class="space-y-2 pt-1">
                <div class="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>{{ locale === 'fr' ? 'Voyager vers un pays voisin :' : 'Fly to a neighboring country:' }}</span>
                  <span class="font-mono text-[10px]">{{ formatCoord(heroCountry.lat, 'N', 'S') }}</span>
                </div>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="nb in nearestNeighbors"
                    :key="nb.country.iso"
                    type="button"
                    @click="lockOnCountry(nb.country)"
                    class="px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.06] hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 text-slate-700 dark:text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <img :src="`https://flagcdn.com/w40/${nb.country.iso}.png`" class="h-3 w-auto rounded-2xs" alt="" />
                    <span>{{ nb.country.name }}</span>
                  </button>
                </div>
              </div>
            </div>
          </transition>
        </div>

      </div>

      <!-- DOCK FLOTTANT INFÉRIEUR : ACCÈS IMMÉDIAT AUX EXPÉRIENCES PHARES -->
      <div class="relative z-20 w-full max-w-[1400px] mx-auto px-4 sm:px-8 pb-6 pointer-events-auto">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 p-2.5 rounded-3xl bg-white/80 dark:bg-slate-900/75 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-2xl">
          <router-link
            v-for="feat in featuredDockModes"
            :key="feat.id"
            :to="feat.to"
            class="group p-3.5 rounded-2xl hover:bg-slate-100/90 dark:hover:bg-white/[0.06] transition-all flex items-center justify-between gap-3"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" :class="feat.iconBg">
                <span class="w-2.5 h-2.5 rounded-full" :class="feat.dotColor"></span>
              </div>
              <div class="min-w-0">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{{ feat.tag }}</span>
                <strong class="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate block">{{ feat.title }}</strong>
              </div>
            </div>
            <span class="text-slate-400 group-hover:text-sky-400 group-hover:translate-x-1 transition-all font-bold">→</span>
          </router-link>
        </div>
      </div>

    </section>

    <!-- ========================================================= -->
    <!-- 2. SECTION CONTENU FLUIDE : PROFIL & CATALOGUE DES 12 JEUX-->
    <!-- ========================================================= -->
    <div class="max-w-[1320px] mx-auto px-4 sm:px-8 pt-14 pb-20 space-y-16">

      <!-- Bandeau Joueur Connecté -->
      <section
        v-if="currentUser"
        class="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 shadow-xl space-y-6"
      >
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2.5 flex-wrap">
              <span class="text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                {{ locale === 'fr' ? 'Tableau de bord joueur' : 'Player Dashboard' }}
              </span>
              <router-link
                to="/collection"
                class="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30"
              >
                {{ unlockedBadgesCount }} / {{ userBadges.length }} {{ locale === 'fr' ? 'Trophées débloqués' : 'Trophies unlocked' }}
              </router-link>
            </div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {{ displayUsername }}
            </h2>
            <p class="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              <template v-if="userStats.totalGames > 0">
                {{ locale === 'fr'
                  ? `${userStats.totalGames} parties jouées • Dernière session : ${userStats.lastMode} (${userStats.lastScore}).`
                  : `${userStats.totalGames} games played • Latest session: ${userStats.lastMode} (${userStats.lastScore}).` }}
              </template>
              <template v-else>
                {{ locale === 'fr'
                  ? 'Lancez votre première partie pour débloquer vos badges de progression.'
                  : 'Play your first game to unlock your progression badges.' }}
              </template>
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <router-link
              to="/collection"
              class="px-4 py-2.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] hover:border-sky-500 text-xs font-bold text-slate-800 dark:text-slate-200 transition"
            >
              {{ locale === 'fr' ? 'Ma Collection (I→V)' : 'My Badges (I→V)' }}
            </router-link>
            <router-link
              to="/classement"
              class="px-4 py-2.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] hover:border-sky-500 text-xs font-bold text-slate-800 dark:text-slate-200 transition"
            >
              {{ locale === 'fr' ? 'Classement & Ligues' : 'Leaderboard & Leagues' }}
            </router-link>
            <router-link
              to="/scores"
              class="px-4 py-2.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] hover:border-sky-500 text-xs font-bold text-slate-800 dark:text-slate-200 transition"
            >
              {{ locale === 'fr' ? 'Mes Scores' : 'My Scores' }}
            </router-link>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-100 dark:border-white/[0.06]">
          <router-link
            v-for="badge in userBadges"
            :key="badge.id"
            to="/collection"
            class="p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2 hover:-translate-y-0.5"
            :class="badge.unlocked
              ? 'bg-sky-500/[0.07] border-sky-500/35 text-slate-900 dark:text-white'
              : 'bg-slate-50/40 dark:bg-white/[0.02] border-slate-200/60 dark:border-white/[0.05] opacity-45'"
          >
            <div class="flex items-center justify-between">
              <span class="font-mono text-[10px] font-bold text-sky-600 dark:text-sky-400">{{ badge.code }}</span>
              <span class="w-2 h-2 rounded-full" :class="badge.unlocked ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-slate-500'"></span>
            </div>
            <div>
              <strong class="text-xs font-bold block truncate">{{ badge.title }}</strong>
              <span class="text-[11px] text-slate-500 dark:text-slate-400 block truncate">{{ badge.desc }}</span>
            </div>
          </router-link>
        </div>
      </section>

      <!-- Galerie des 12 Modes de Jeu -->
      <section class="space-y-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span class="text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-1">
              {{ locale === 'fr' ? '12 Expériences Interactives' : '12 Interactive Experiences' }}
            </span>
            <h2 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {{ locale === 'fr' ? 'Choisissez votre terrain de jeu' : 'Choose your playground' }}
            </h2>
          </div>

          <div class="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-slate-200/60 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10">
            <button
              v-for="tab in categoryTabs"
              :key="tab.id"
              type="button"
              @click="selectedCategory = tab.id"
              class="px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer"
              :class="selectedCategory === tab.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <router-link
            v-for="mod in visibleModules"
            :key="mod.id"
            :to="mod.to"
            class="group rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#090E1A] hover:border-sky-500/60 dark:hover:border-sky-400/50 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-2xl"
          >
            <div>
              <div class="flex items-center justify-between gap-2 mb-4">
                <span class="font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border" :class="mod.badgeClass">
                  {{ mod.tag }}
                </span>
                <span class="font-mono text-xs text-slate-400">
                  {{ mod.metric }}
                </span>
              </div>

              <h3 class="text-xl font-black text-slate-900 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors mb-2">
                {{ mod.title }}
              </h3>

              <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {{ mod.desc }}
              </p>
            </div>

            <div class="mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-sky-500 dark:group-hover:text-sky-400">
              <span>{{ mod.footer }}</span>
              <span class="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/5 group-hover:bg-sky-500 group-hover:text-white flex items-center justify-center transition-all">→</span>
            </div>
          </router-link>
        </div>
      </section>

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
// PARALLAXE DOUCE AU MOUVEMENT DE LA SOURIS
// =========================================================
const parallaxX = ref(0);
const parallaxY = ref(0);

const onStagePointerMove = (e) => {
  if (typeof window === 'undefined') return;
  const nx = (e.clientX / window.innerWidth - 0.5) * 2;
  const ny = (e.clientY / window.innerHeight - 0.5) * 2;
  parallaxX.value = Number(nx.toFixed(3));
  parallaxY.value = Number(ny.toFixed(3));
};

// =========================================================
// PAYS LOCALISÉS & DISTANCE ORTHODROMIQUE
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
// RECHERCHE, SECTEURS & VOISINS DU GLOBE
// =========================================================
const globeSearchQuery = ref('');
const activeContinent = ref('all');
const heroIndex = ref(14); // France par défaut
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
  return [
    { id: 'all', label: isFr ? 'Monde (196)' : 'World (196)', lat: 22, lng: 10 },
    { id: 'Europe', label: 'Europe', lat: 48, lng: 12 },
    { id: 'Asia', label: isFr ? 'Asie' : 'Asia', lat: 28, lng: 92 },
    { id: 'Africa', label: isFr ? 'Afrique' : 'Africa', lat: 4, lng: 18 },
    { id: 'Americas', label: isFr ? 'Amériques' : 'Americas', lat: 12, lng: -75 },
    { id: 'Oceania', label: isFr ? 'Océanie' : 'Oceania', lat: -22, lng: 145 }
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
// MOTEUR 3D DU GLOBE AVEC INERTIE PHYSIQUE & CONTROLES EXACTS
// =========================================================
const globeCanvasRef = ref(null);
const showBorders = ref(true);
const showArcs = ref(true);
const autoRotate = ref(true);

let worldRings = [];
let animFrameId = null;

// Angles de la caméra et vitesses d'inertie
let rotLon = -8;
let rotLat = -34;
let targetLon = -8;
let targetLat = -34;
let velocityLon = 0;
let velocityLat = 0;

let isCameraLocked = false;
let isDragging = false;
let lastPointerX = 0;
let lastPointerY = 0;
let dragDistance = 0;
let projectedNodes = [];
let pulsePhase = 0;

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
      for (const ringIdx of geom.arcs) rings.push(stitchArcs(ringIdx));
    } else if (geom.type === 'MultiPolygon') {
      for (const poly of geom.arcs) {
        for (const ringIdx of poly) rings.push(stitchArcs(ringIdx));
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
      return;
    }
  } catch (e) {}

  try {
    const resGeo = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
    if (resGeo.ok) {
      const geo = await resGeo.json();
      const rings = [];
      for (const feat of geo.features || []) {
        const g = feat.geometry;
        if (!g) continue;
        if (g.type === 'Polygon') rings.push(...g.coordinates);
        else if (g.type === 'MultiPolygon') {
          for (const poly of g.coordinates) rings.push(...poly);
        }
      }
      worldRings = rings;
    }
  } catch (e) {}
};

const lockOnCountry = (country) => {
  if (!country) return;
  const idx = localizedCountries.value.findIndex((c) => c.iso === country.iso);
  if (idx !== -1) heroIndex.value = idx;
  velocityLon = 0;
  velocityLat = 0;
  targetLon = -Number(country.lng || 0);
  targetLat = -Math.max(-65, Math.min(65, Number(country.lat || 0)));
  isCameraLocked = true;
};

const selectContinentSector = (sector) => {
  activeContinent.value = sector.id;
  velocityLon = 0;
  velocityLat = 0;
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

const onGlobePointerDown = (e) => {
  isDragging = true;
  isCameraLocked = false;
  velocityLon = 0;
  velocityLat = 0;
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

    // Gauche / Droite naturel (+) et Haut / Bas corrigé (-)
    const deltaLon = dx * 0.38;
    const deltaLat = -dy * 0.36;

    rotLon += deltaLon;
    rotLat = Math.max(-68, Math.min(68, rotLat + deltaLat));

    // Mémorise la vitesse du geste pour l'inertie au relâchement
    velocityLon = deltaLon * 0.85;
    velocityLat = deltaLat * 0.85;

    targetLon = rotLon;
    targetLat = rotLat;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const cx = e.clientX - rect.left;
  const cy = e.clientY - rect.top;
  let closest = null;
  let minD = 15;
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

  return [toDeg(Math.atan2(z, Math.hypot(x, y))), toDeg(Math.atan2(y, x))];
};

const renderGlobe = () => {
  const canvas = globeCanvasRef.value;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = rect.width || 640;
  const H = rect.height || 640;

  if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
  }

  const isDark = document.documentElement.classList.contains('dark');
  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const cx = W / 2;
  const cy = H / 2;
  // Rayon sphérique fixe calibré pour que le globe entier et son atmosphère ne soient jamais coupés
  const R = Math.min(W, H) * 0.42;

  if (isCameraLocked && !isDragging) {
    const dLon = ((targetLon - rotLon + 540) % 360) - 180;
    const dLat = targetLat - rotLat;
    rotLon += dLon * 0.085;
    rotLat += dLat * 0.085;
    if (Math.abs(dLon) < 0.12 && Math.abs(dLat) < 0.12) isCameraLocked = false;
  } else if (!isDragging) {
    // Application de l'inertie physique du lancer à la main
    if (Math.abs(velocityLon) > 0.01 || Math.abs(velocityLat) > 0.01) {
      rotLon += velocityLon;
      rotLat = Math.max(-68, Math.min(68, rotLat + velocityLat));
      velocityLon *= 0.93;
      velocityLat *= 0.93;
    } else if (autoRotate.value) {
      rotLon -= 0.11;
    }
    targetLon = rotLon;
    targetLat = rotLat;
  }

  pulsePhase = (pulsePhase + 0.015) % 1;

  // 1. Anneau orbital subtil autour de la planète
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.28);
  ctx.beginPath();
  ctx.ellipse(0, 0, R * 1.15, R * 0.28, 0, 0, Math.PI * 2);
  ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(2, 132, 199, 0.14)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  // 2. Halo atmosphérique doux autour du Globe
  const outerHalo = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.15);
  if (isDark) {
    outerHalo.addColorStop(0, 'rgba(14, 165, 233, 0)');
    outerHalo.addColorStop(0.65, 'rgba(56, 189, 248, 0.18)');
    outerHalo.addColorStop(1, 'rgba(16, 185, 129, 0)');
  } else {
    outerHalo.addColorStop(0, 'rgba(2, 132, 199, 0)');
    outerHalo.addColorStop(0.65, 'rgba(14, 165, 233, 0.15)');
    outerHalo.addColorStop(1, 'rgba(14, 165, 233, 0)');
  }
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.15, 0, Math.PI * 2);
  ctx.fillStyle = outerHalo;
  ctx.fill();

  // 3. Sphère océanique 3D
  const oceanGrad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.08, cx, cy, R);
  if (isDark) {
    oceanGrad.addColorStop(0, '#102648');
    oceanGrad.addColorStop(0.65, '#071226');
    oceanGrad.addColorStop(1, '#030711');
  } else {
    oceanGrad.addColorStop(0, '#e0f2fe');
    oceanGrad.addColorStop(0.7, '#bae6fd');
    oceanGrad.addColorStop(1, '#7dd3fc');
  }

  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fillStyle = oceanGrad;
  ctx.fill();

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

  // 4. Grille géodésique subtile
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.09)' : 'rgba(2, 132, 199, 0.14)';
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

  // 5. CONTINENTS & FRONTIÈRES VECTORIELLES DES PAYS
  if (showBorders.value && worldRings.length > 0) {
    ctx.fillStyle = isDark ? 'rgba(22, 52, 94, 0.80)' : 'rgba(255, 255, 255, 0.86)';
    ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.54)' : 'rgba(2, 132, 199, 0.45)';
    ctx.lineWidth = 0.9;

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

  // 6. ARCS GÉODÉSIQUES 3D ANIMÉS
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
        const loft = 1 + Math.sin(tStep * Math.PI) * 0.06;
        const p = projectLatLon(lat, lon, loft);
        if (p) {
          if (!started) { ctx.moveTo(p.x, p.y); started = true; }
          else ctx.lineTo(p.x, p.y);
        } else started = false;
      }
      ctx.strokeStyle = isDark ? 'rgba(52, 211, 153, 0.58)' : 'rgba(2, 132, 199, 0.58)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const [pLat, pLon] = slerpLatLon(activeTarget.lat, activeTarget.lng, dest.lat, dest.lng, pulsePhase);
      const pLoft = 1 + Math.sin(pulsePhase * Math.PI) * 0.06;
      const pulsePt = projectLatLon(pLat, pLon, pLoft);
      if (pulsePt) {
        ctx.beginPath();
        ctx.arc(pulsePt.x, pulsePt.y, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = '#34d399';
        ctx.fill();
      }
    }
  }

  // 7. CAPITALES MONDIALES SUR LE GLOBE
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
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = '#34d399';
      ctx.fill();
    } else if (inSector) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(56, 189, 248, ${0.45 + p.z * 0.55})`
        : `rgba(2, 132, 199, ${0.5 + p.z * 0.5})`;
      ctx.fill();
    }
  }

  // 8. MARQUEUR LUMINEUX DU PAYS SÉLECTIONNÉ
  if (targetProjected) {
    const { x, y } = targetProjected;
    const bloom = ctx.createRadialGradient(x, y, 1, x, y, 20);
    bloom.addColorStop(0, 'rgba(16, 185, 129, 0.9)');
    bloom.addColorStop(0.5, 'rgba(56, 189, 248, 0.35)');
    bloom.addColorStop(1, 'rgba(16, 185, 129, 0)');
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fillStyle = bloom;
    ctx.fill();

    const ringRadius = 6 + pulsePhase * 13;
    ctx.beginPath();
    ctx.arc(x, y, ringRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(52, 211, 153, ${1 - pulsePhase})`;
    ctx.lineWidth = 1.6;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#10b981';
    ctx.stroke();
  }

  ctx.restore();

  // Anneau atmosphérique externe
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.48)' : 'rgba(2, 132, 199, 0.42)';
  ctx.stroke();

  projectedNodes = nextNodes;
  ctx.restore();
  animFrameId = requestAnimationFrame(renderGlobe);
};

// =========================================================
// DOCK RAPIDE & CATALOGUE DES 12 MODES
// =========================================================
const featuredDockModes = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    {
      id: 'mystery',
      tag: isFr ? 'Défi Quotidien' : 'Daily Challenge',
      title: isFr ? 'Pays Mystère (Worldle)' : 'Mystery Country',
      iconBg: 'bg-amber-500/15 border border-amber-500/30',
      dotColor: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]',
      to: { path: '/quiz', query: { mode: 'mystery' } }
    },
    {
      id: 'pindrop',
      tag: '25 000 PTS',
      title: 'GeoLearn PinDrop',
      iconBg: 'bg-sky-500/15 border border-sky-500/30',
      dotColor: 'bg-sky-400 shadow-[0_0_8px_#38bdf8]',
      to: '/geoguessr'
    },
    {
      id: 'duel',
      tag: isFr ? 'Multijoueur' : 'Multiplayer',
      title: isFr ? 'Arène Duel 1v1' : '1v1 Live Duel',
      iconBg: 'bg-rose-500/15 border border-rose-500/30',
      dotColor: 'bg-rose-400 shadow-[0_0_8px_#fb7185]',
      to: '/duel'
    },
    {
      id: 'flash60',
      tag: 'Combo x4',
      title: isFr ? 'Sprint 60 Secondes' : '60s Flash Sprint',
      iconBg: 'bg-emerald-500/15 border border-emerald-500/30',
      dotColor: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
      to: { path: '/quiz', query: { mode: 'flash60' } }
    }
  ];
});

const selectedCategory = ref('all');
const categoryTabs = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'all', label: isFr ? 'Tous les modes (12)' : 'All Modes (12)' },
    { id: 'featured', label: isFr ? 'Phares & Duel' : 'Featured & Duel' },
    { id: 'classics', label: isFr ? 'Classiques & Sprint' : 'Classics & Sprint' },
    { id: 'innovation', label: isFr ? 'Déduction & Sur-mesure' : 'Deduction & Custom' },
    { id: 'revision', label: isFr ? 'Atlas & Révision' : 'Atlas & Study' }
  ];
});

const allModules = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    {
      id: 'mystery',
      cat: 'featured',
      tag: 'WORLDLE',
      metric: '6 ESSAIS',
      title: isFr ? 'Le Pays Mystère (Worldle)' : 'Mystery Country (Worldle)',
      desc: isFr
        ? 'Devinez le pays secret en 6 essais grâce à la distance en kilomètres, la direction boussole et le pourcentage de proximité.'
        : 'Guess the secret country in 6 tries using distance in km, compass direction, and proximity percentage.',
      footer: isFr ? 'Lancer le défi' : 'Start challenge',
      badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
      to: { path: '/quiz', query: { mode: 'mystery' } }
    },
    {
      id: 'pindrop',
      cat: 'featured',
      tag: 'SATELLITE & PHOTO',
      metric: '25 000 PTS',
      title: 'GeoLearn PinDrop',
      desc: isFr
        ? 'Explorez une vue satellite orbitale sans étiquette ou une photo géolocalisée et placez votre épingle au plus près.'
        : 'Inspect an unlabeled satellite view or geotagged photo and drop your pin as close as possible.',
      footer: isFr ? 'Ouvrir PinDrop' : 'Open PinDrop',
      badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      to: '/geoguessr'
    },
    {
      id: 'duel',
      cat: 'featured',
      tag: '1V1 LIVE',
      metric: 'MULTIJOUEUR',
      title: isFr ? 'Arène Duel & Face-à-Face' : '1v1 Live Duel Arena',
      desc: isFr
        ? 'Affrontez un ami à distance via lien de salon, jouez à 2 sur le même écran ou défiez un rival de ligue.'
        : 'Battle a friend remotely via room link, play 2-player split-screen, or face a live league rival.',
      footer: isFr ? 'Entrer dans l\'arène' : 'Enter arena',
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      to: '/duel'
    },
    {
      id: 'capitals',
      cat: 'classics',
      tag: 'CAPITALES',
      metric: '15 QUESTIONS',
      title: t('home.mode_caps_title'),
      desc: t('home.mode_caps_desc'),
      footer: isFr ? 'Jouer aux capitales' : 'Play capitals',
      badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      to: { path: '/quiz', query: { mode: 'qcm', type: 'capital' } }
    },
    {
      id: 'flags',
      cat: 'classics',
      tag: 'DRAPEAUX',
      metric: '196 ÉTATS',
      title: t('home.mode_flags_title'),
      desc: t('home.mode_flags_desc'),
      footer: isFr ? 'Jouer aux drapeaux' : 'Play flags',
      badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      to: { path: '/quiz', query: { mode: 'qcm', type: 'flag' } }
    },
    {
      id: 'flash60',
      cat: 'classics',
      tag: 'SPRINT 60S',
      metric: 'COMBO X4',
      title: isFr ? 'Contre-la-montre 60 secondes' : '60-Second Flash Quiz',
      desc: isFr
        ? 'Enchaînez un maximum de capitales et drapeaux en 60 secondes avec multiplicateur de combo et bonus de +2 secondes.'
        : 'Chain as many capitals and flags as possible in 60 seconds with combo multipliers and +2s time bonuses.',
      footer: isFr ? 'Lancer les 60s' : 'Start 60s sprint',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      to: { path: '/quiz', query: { mode: 'flash60' } }
    },
    {
      id: 'chrono',
      cat: 'classics',
      tag: 'STYLE JETPUNK',
      metric: '47 / 196',
      title: isFr ? 'Défis Chrono Carte (Clavier)' : 'Timed Map Typing',
      desc: isFr
        ? 'Saisissez au clavier les 47 pays d\'Europe ou les 196 pays du Monde sur carte muette avec grilles continentales.'
        : 'Type all 47 European countries or all 196 World countries on a blank map with continental grids.',
      footer: isFr ? 'Démarrer le chrono' : 'Start timer',
      badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      to: { path: '/quiz', query: { mode: 'chrono' } }
    },
    {
      id: 'detective',
      cat: 'innovation',
      tag: '5 INDICES',
      metric: '25 PTS MAX',
      title: isFr ? 'Enquête aux 5 Indices' : '5-Clue Detective',
      desc: isFr
        ? 'Identifiez le pays mystère en dévoilant le moins d\'indices possible (superficie, monnaie, anecdote, capitale).'
        : 'Identify the mystery country while revealing as few progressive clues as possible.',
      footer: isFr ? 'Mener l\'enquête' : 'Start investigation',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      to: { path: '/quiz', query: { mode: 'detective' } }
    },
    {
      id: 'map-click',
      cat: 'innovation',
      tag: 'SETERRA',
      metric: 'SANS CLAVIER',
      title: isFr ? 'Cliquez sur la Carte Muette' : 'Click on the Blank Map',
      desc: isFr
        ? 'Pointez directement chaque pays demandé sur la carte muette sans aucune saisie clavier.'
        : 'Click directly on each requested country on the blank map with zero typing.',
      footer: isFr ? 'Tester ma précision' : 'Test accuracy',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      to: { path: '/quiz', query: { mode: 'map-click' } }
    },
    {
      id: 'culture',
      cat: 'innovation',
      tag: 'CULTURE & DÉMO',
      metric: '15 QUESTIONS',
      title: isFr ? 'Population, Langues & Monnaies' : 'Population, Languages & Currencies',
      desc: isFr
        ? 'Comparez la population des pays et identifiez leurs langues officielles et leurs devises nationales.'
        : 'Compare country populations and identify their official languages and national currencies.',
      footer: isFr ? 'Lancer le quiz culture' : 'Start culture quiz',
      badgeClass: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30',
      to: { path: '/quiz', query: { mode: 'qcm', type: 'culture' } }
    },
    {
      id: 'custom-builder',
      cat: 'innovation',
      tag: 'SUR-MESURE',
      metric: '5 À 15 PAYS',
      title: isFr ? 'Créateur de Défis Personnalisés' : 'Custom Challenge Builder',
      desc: isFr
        ? 'Sélectionnez de 5 à 15 pays dans la liste pour générer un lien de défi sur-mesure à envoyer à vos amis.'
        : 'Select 5 to 15 countries from the list to generate a custom challenge link for your friends.',
      footer: isFr ? 'Créer un défi' : 'Build challenge',
      badgeClass: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30',
      to: { path: '/quiz', query: { mode: 'custom-builder' } }
    },
    {
      id: 'atlas',
      cat: 'revision',
      tag: 'ATLAS & ÉTUDE',
      metric: '196 FICHES',
      title: isFr ? 'Atlas Comparateur & Flashcards 3D' : 'Comparator Atlas & 3D Flashcards',
      desc: isFr
        ? 'Comparez deux États côte à côte, explorez la grille des 196 drapeaux et révisez avec les cartes mémoire.'
        : 'Compare two states side-by-side, inspect the 196-flag grid, and study with memory cards.',
      footer: isFr ? 'Ouvrir l\'Atlas' : 'Open Atlas',
      badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      to: '/explorer'
    }
  ];
});

const visibleModules = computed(() => {
  if (selectedCategory.value === 'all') return allModules.value;
  return allModules.value.filter((m) => m.cat === selectedCategory.value);
});

// =========================================================
// PROFIL JOUEUR & BADGES
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
    (currentUser.value.email ? currentUser.value.email.split('@')[0] : 'Explorateur')
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

<style scoped>
.orbital-stage {
  background: radial-gradient(circle at 50% 48%, rgba(14, 165, 233, 0.12) 0%, rgba(16, 185, 129, 0.04) 38%, transparent 72%);
  border-bottom: 1px solid var(--border-color);
}

.globe-canvas {
  width: min(86vw, 72vh);
  height: min(86vw, 72vh);
  max-width: 700px;
  max-height: 700px;
}

.ambient-orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(90px);
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}

.ambient-orb-primary {
  width: 38vw;
  height: 38vw;
  top: 8%;
  left: 18%;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.16), transparent 70%);
}

.ambient-orb-secondary {
  width: 34vw;
  height: 34vw;
  bottom: 6%;
  right: 16%;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.13), transparent 70%);
}

.watermark-display {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-weight: 900;
  font-size: clamp(4.5rem, 15vw, 14rem);
  letter-spacing: -0.05em;
  line-height: 0.85;
  color: rgba(148, 163, 184, 0.045);
  pointer-events: none;
  user-select: none;
  transition: transform 0.2s ease-out;
}

.watermark-sub {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: clamp(0.9rem, 2.2vw, 2rem);
  letter-spacing: 0.38em;
  margin-top: 1rem;
  opacity: 0.7;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 6px);
}

.card-fade-enter-active,
.card-fade-leave-active {
  transition: opacity 0.22s cubic-bezier(0.22, 1, 0.36, 1), transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
.card-fade-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}
.card-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}

@media (max-width: 1023px) {
  .orbital-stage {
    min-height: auto;
    padding-bottom: 1.5rem;
  }

  /* Place le Globe 3D proprement entre le texte d'accroche et la fiche pays sur mobile */
  .globe-centerpiece {
    position: relative !important;
    inset: auto !important;
    margin: 0.5rem auto;
    order: 2;
  }

  .globe-canvas {
    width: min(88vw, 340px);
    height: min(88vw, 340px);
  }

  .watermark-display {
    font-size: 18vw;
    top: 38%;
  }
}
</style>