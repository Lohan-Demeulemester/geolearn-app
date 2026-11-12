<template>
  <div class="leaderboard-experience max-w-[1360px] mx-auto px-2 sm:px-6 pb-24 space-y-8 select-none">

    <!-- ========================================================= -->
    <!-- 1. EN-TÊTE : TITRE & BASCULE QCM (/15) VS TOUS LES MODES  -->
    <!-- ========================================================= -->
    <header class="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-5 sm:p-7 shadow-xl space-y-5">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-600 dark:text-sky-400 font-mono text-[11px] font-bold uppercase tracking-wider">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{{ locale === 'fr' ? 'BASE DE DONNÉES TEMPS RÉEL // CLASSEMENT OFFICIEL' : 'LIVE DATABASE // OFFICIAL STANDINGS' }}</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {{ locale === 'fr' ? 'Classement Général & Ligues' : 'Global Leaderboard & Leagues' }}
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {{ locale === 'fr'
              ? 'Classement calculé exclusivement à partir des scores réels enregistrés dans la base de données.'
              : 'Standings computed exclusively from real player scores recorded in the database.' }}
          </p>
        </div>

        <!-- Même sélecteur de barème que dans Scores.vue (QCM Classiques /15 vs Tous ramenés sur 15) -->
        <div class="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-slate-200/70 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 self-start lg:self-auto">
          <button
            type="button"
            @click="scoreCalcMode = 'strict15'"
            class="px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer"
            :class="scoreCalcMode === 'strict15'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
          >
            {{ locale === 'fr' ? 'QCM Classiques (/15)' : 'Classic QCMs (/15)' }}
          </button>
          <button
            type="button"
            @click="scoreCalcMode = 'normalized15'"
            class="px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer"
            :class="scoreCalcMode === 'normalized15'
              ? 'bg-sky-500 text-slate-950 font-black shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
          >
            {{ locale === 'fr' ? 'Tous ramenés sur 15' : 'All Normalized (/15)' }}
          </button>
        </div>
      </div>

      <!-- Filtres par Mode de jeu -->
      <div class="pt-4 border-t border-slate-200/70 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-1.5">
          <button
            v-for="m in modeTabs"
            :key="m.id"
            type="button"
            @click="selectedModeFilter = m.id"
            class="px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer border"
            :class="selectedModeFilter === m.id
              ? 'bg-sky-500 text-slate-950 border-sky-400 font-black'
              : 'bg-slate-100 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
          >
            {{ m.label }}
          </button>
        </div>

        <button
          type="button"
          @click="fetchRealDatabaseLeaderboard"
          class="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300 transition cursor-pointer flex items-center gap-1.5"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <polyline points="21 3 21 8 16 8" />
          </svg>
          <span>{{ locale === 'fr' ? 'Actualiser BDD' : 'Refresh DB' }}</span>
        </button>
      </div>
    </header>

    <!-- ========================================================= -->
    <!-- 2. 4 CARTES KPI DE LA BASE DE DONNÉES (STYLE SCORES.VUE)  -->
    <!-- ========================================================= -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-xl p-5 flex items-center gap-4 shadow-lg">
        <div class="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/25 text-sky-400 flex items-center justify-center shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div class="min-w-0">
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 block truncate">
            {{ locale === 'fr' ? 'Joueurs classés (BDD)' : 'Ranked Players (DB)' }}
          </span>
          <strong class="font-mono text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5 block">
            {{ rankedOperators.length }}
          </strong>
        </div>
      </div>

      <div class="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-xl p-5 flex items-center gap-4 shadow-lg">
        <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </div>
        <div class="min-w-0">
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 block truncate">
            {{ locale === 'fr' ? 'Moyenne globale (/15)' : 'Global Average (/15)' }}
          </span>
          <strong class="font-mono text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5 block">
            {{ globalAverageOn15 }} <span class="text-sm font-bold text-slate-400">/ 15</span>
          </strong>
        </div>
      </div>

      <div class="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-xl p-5 flex items-center gap-4 shadow-lg">
        <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
        </div>
        <div class="min-w-0">
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 block truncate">
            {{ locale === 'fr' ? 'Meilleur score enregistré' : 'Highest Recorded Score' }}
          </span>
          <strong class="font-mono text-2xl sm:text-3xl font-black text-emerald-500 dark:text-emerald-400 mt-0.5 block">
            {{ globalBestOn15 }} <span class="text-sm font-bold text-slate-400">/ 15</span>
          </strong>
        </div>
      </div>

      <div class="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-xl p-5 flex items-center gap-4 shadow-lg">
        <div class="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/25 text-purple-400 flex items-center justify-center shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        </div>
        <div class="min-w-0">
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 block truncate">
            {{ locale === 'fr' ? 'Votre position actuelle' : 'Your Current Standing' }}
          </span>
          <strong class="font-mono text-2xl sm:text-3xl font-black text-sky-500 dark:text-sky-400 mt-0.5 block">
            {{ myEntry ? `#${myEntry.rank}` : '—' }}
            <span v-if="myEntry" class="text-xs font-bold text-slate-400">({{ myEntry.avgOn15.toFixed(1) }}/15)</span>
          </strong>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- 3. PODIUM 3D PLEINE LARGEUR + CARTES TOP 3 NON COMPRESSÉES-->
    <!-- ========================================================= -->
    <section class="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-5 sm:p-8 shadow-xl space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 dark:border-white/10 pb-4">
        <div>
          <span class="font-mono text-[10px] font-bold uppercase tracking-wider text-sky-500 dark:text-sky-400 block">
            PODIUM 3D INTERACTIF // TOP OPÉRATEURS BDD
          </span>
          <h2 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
            {{ locale === 'fr' ? 'Podium Officiel des Joueurs' : 'Official Player Podium' }}
          </h2>
        </div>

        <span class="font-mono text-xs text-slate-400">
          {{ locale === 'fr'
            ? `${totalDatabaseGames} parties analysées en base`
            : `${totalDatabaseGames} database sessions analyzed` }}
        </span>
      </div>

      <!-- Canvas 3D du Podium (Toujours monté dans le DOM, grandes coupes 3D Or / Argent / Bronze) -->
      <div class="w-full rounded-2xl bg-slate-950/90 border border-white/[0.07] py-4 px-2 flex flex-col items-center justify-center">
        <canvas
          ref="podiumCanvasRef"
          width="860"
          height="290"
          class="w-full max-w-[820px] h-[230px] sm:h-[270px] cursor-grab active:cursor-grabbing"
          style="touch-action: none;"
          @pointerdown="onPodiumPointerDown"
          @pointermove="onPodiumPointerMove"
          @pointerup="onPodiumPointerUp"
          @pointerleave="onPodiumPointerUp"
        ></canvas>
      </div>

      <!-- Cartes du Top 3 sur toute la largeur (12 colonnes = aucun texte tronqué) -->
      <div v-if="topThreePlayers.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <article
          v-for="(p, idx) in topThreePlayers"
          :key="'top3-' + p.id"
          @click="inspectedRival = p"
          class="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] hover:border-sky-500/40 p-5 flex flex-col justify-between gap-5 transition-all cursor-pointer"
        >
          <div class="space-y-4">
            <!-- Ligne supérieure : Rang + Ligue sur une seule ligne aérée -->
            <div class="flex items-center justify-between gap-2">
              <span
                class="px-3 py-1 rounded-full font-mono text-xs font-black border"
                :class="idx === 0
                  ? 'bg-yellow-400/15 text-yellow-300 border-yellow-400/40'
                  : idx === 1
                    ? 'bg-slate-300/15 text-slate-200 border-slate-300/35'
                    : 'bg-orange-700/20 text-orange-300 border-orange-500/40'"
              >
                {{ locale === 'fr' ? `RANG #0${idx + 1}` : `RANK #0${idx + 1}` }}
              </span>

              <span
                class="px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase border"
                :style="{
                  backgroundColor: `${p.league.hex}14`,
                  borderColor: `${p.league.hex}38`,
                  color: p.league.hex
                }"
              >
                {{ p.league.short }}
              </span>
            </div>

            <!-- Identité complète du joueur (sans coupure) -->
            <div class="flex items-center gap-3.5">
              <div
                class="w-12 h-12 rounded-2xl font-mono text-sm font-black flex items-center justify-center shrink-0 text-slate-950"
                :style="{ backgroundColor: idx === 0 ? '#facc15' : idx === 1 ? '#cbd5e1' : '#b85d38' }"
              >
                {{ getInitials(p.username) }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <strong class="text-base sm:text-lg font-black text-slate-900 dark:text-white break-words leading-snug">
                    {{ p.username }}
                  </strong>
                  <span
                    v-if="p.isMe"
                    class="px-2 py-0.5 rounded-full bg-sky-500 text-slate-950 font-mono text-[9px] font-black uppercase"
                  >
                    {{ locale === 'fr' ? 'VOUS' : 'YOU' }}
                  </span>
                </div>
                <span class="font-mono text-xs text-slate-400 block mt-0.5">
                  {{ p.gamesCount }} {{ locale === 'fr' ? 'partie(s) enregistrée(s)' : 'recorded session(s)' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Statistiques claires et sobres -->
          <div class="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200/60 dark:border-white/[0.07] font-mono text-center">
            <div class="p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/[0.05]">
              <span class="text-[10px] text-slate-400 block">{{ locale === 'fr' ? 'MOYENNE' : 'AVG' }}</span>
              <strong class="text-sm font-black text-emerald-500 dark:text-emerald-400 mt-0.5 block">
                {{ p.avgOn15.toFixed(1) }}/15
              </strong>
            </div>
            <div class="p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/[0.05]">
              <span class="text-[10px] text-slate-400 block">RECORD</span>
              <strong class="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">
                {{ p.bestOn15.toFixed(1) }}/15
              </strong>
            </div>
            <div class="p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/[0.05]">
              <span class="text-[10px] text-slate-400 block">PRÉCISION</span>
              <strong class="text-sm font-black text-sky-500 dark:text-sky-400 mt-0.5 block">
                {{ p.consistencyPct }}%
              </strong>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- 4. TABLEAU COMPLET DES JOUEURS DE LA BDD & LIGUES         -->
    <!-- ========================================================= -->
    <section class="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-5 sm:p-7 shadow-xl space-y-5">

      <!-- Filtres de Ligue + Recherche + Tri -->
      <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-200/70 dark:border-white/10">
        <!-- Filtres par Ligue -->
        <div class="flex flex-wrap items-center gap-1.5">
          <button
            v-for="lg in leagueDivisions"
            :key="lg.id"
            type="button"
            @click="selectedLeagueFilter = lg.id"
            class="px-3.5 py-1.5 rounded-full font-mono text-xs font-bold transition cursor-pointer border flex items-center gap-2"
            :class="selectedLeagueFilter === lg.id
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-transparent'
              : 'bg-slate-100 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400'"
          >
            <span>{{ lg.label }}</span>
            <span class="opacity-70">({{ lg.count }})</span>
          </button>
        </div>

        <!-- Recherche & Tri -->
        <div class="flex flex-wrap items-center gap-2.5">
          <div class="relative w-full sm:w-64">
            <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="locale === 'fr' ? 'Chercher un joueur...' : 'Search a player...'"
              class="w-full pl-10 pr-8 py-2 rounded-full border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-sky-400"
            />
            <button
              v-if="searchQuery"
              type="button"
              @click="searchQuery = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              ×
            </button>
          </div>

          <div class="flex items-center gap-1 p-1 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10">
            <button
              v-for="srt in sortOptions"
              :key="srt.id"
              type="button"
              @click="sortBy = srt.id"
              class="px-3 py-1 rounded-full font-mono text-[11px] font-bold transition cursor-pointer"
              :class="sortBy === srt.id
                ? 'bg-sky-500 text-slate-950 font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-white'"
            >
              {{ srt.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- État de chargement -->
      <div v-if="loading" class="py-12 text-center font-mono text-xs text-slate-400">
        {{ locale === 'fr' ? 'CHARGEMENT DES DONNÉES DE LA BASE...' : 'LOADING DATABASE RECORDS...' }}
      </div>

      <!-- Tableau des vrais joueurs de la BDD -->
      <div v-else-if="paginatedLeaderboard.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-200 dark:border-white/10 font-mono text-[11px] uppercase text-slate-400">
              <th class="py-3 px-3">{{ locale === 'fr' ? 'Rang' : 'Rank' }}</th>
              <th class="py-3 px-3">{{ locale === 'fr' ? 'Joueur' : 'Player' }}</th>
              <th class="py-3 px-3">{{ locale === 'fr' ? 'Division' : 'Division' }}</th>
              <th class="py-3 px-3 text-right">{{ locale === 'fr' ? 'Moyenne (/15)' : 'Avg (/15)' }}</th>
              <th class="py-3 px-3 text-right">{{ locale === 'fr' ? 'Record (/15)' : 'Best (/15)' }}</th>
              <th class="py-3 px-3 text-right">{{ locale === 'fr' ? 'Taux' : 'Accuracy' }}</th>
              <th class="py-3 px-3 text-right">{{ locale === 'fr' ? 'Parties' : 'Games' }}</th>
              <th class="py-3 px-3 text-right">XP</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200/60 dark:divide-white/[0.06] text-xs sm:text-sm">
            <tr
              v-for="row in paginatedLeaderboard"
              :key="row.id"
              @click="inspectedRival = row"
              class="transition-colors cursor-pointer"
              :class="row.isMe
                ? 'bg-sky-500/[0.07] hover:bg-sky-500/[0.12]'
                : 'hover:bg-slate-100/70 dark:hover:bg-white/[0.03]'"
            >
              <!-- Rang -->
              <td class="py-3.5 px-3 font-mono font-black whitespace-nowrap">
                <span
                  class="inline-flex items-center justify-center w-8 h-7 rounded-lg text-xs"
                  :class="row.rank === 1
                    ? 'bg-yellow-400/15 text-yellow-300 border border-yellow-400/35'
                    : row.rank === 2
                      ? 'bg-slate-300/15 text-slate-200 border border-slate-300/35'
                      : row.rank === 3
                        ? 'bg-orange-700/20 text-orange-300 border border-orange-500/35'
                        : 'text-slate-400'"
                >
                  #{{ String(row.rank).padStart(2, '0') }}
                </span>
              </td>

              <!-- Joueur -->
              <td class="py-3.5 px-3">
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-xl font-mono text-xs font-black flex items-center justify-center shrink-0"
                    :class="row.isMe
                      ? 'bg-sky-500 text-slate-950'
                      : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200'"
                  >
                    {{ getInitials(row.username) }}
                  </div>
                  <div class="flex items-center gap-2">
                    <strong class="font-bold text-slate-900 dark:text-white">
                      {{ row.username }}
                    </strong>
                    <span
                      v-if="row.isMe"
                      class="px-2 py-0.5 rounded-full bg-sky-500 text-slate-950 font-mono text-[9px] font-black uppercase"
                    >
                      {{ locale === 'fr' ? 'VOUS' : 'YOU' }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Ligue -->
              <td class="py-3.5 px-3 whitespace-nowrap">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase border"
                  :style="{
                    backgroundColor: `${row.league.hex}14`,
                    borderColor: `${row.league.hex}38`,
                    color: row.league.hex
                  }"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: row.league.hex }"></span>
                  <span>{{ row.league.short }}</span>
                </span>
              </td>

              <!-- Moyenne /15 -->
              <td class="py-3.5 px-3 text-right font-mono font-black text-emerald-500 dark:text-emerald-400 whitespace-nowrap">
                {{ row.avgOn15.toFixed(1) }} <span class="text-[11px] font-normal text-slate-400">/ 15</span>
              </td>

              <!-- Record /15 -->
              <td class="py-3.5 px-3 text-right font-mono font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                {{ row.bestOn15.toFixed(1) }} <span class="text-[11px] font-normal text-slate-400">/ 15</span>
              </td>

              <!-- Précision % -->
              <td class="py-3.5 px-3 text-right font-mono text-xs text-slate-500 dark:text-slate-300 whitespace-nowrap">
                {{ row.consistencyPct }}%
              </td>

              <!-- Parties jouées -->
              <td class="py-3.5 px-3 text-right font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                {{ row.gamesCount }}
              </td>

              <!-- XP -->
              <td class="py-3.5 px-3 text-right font-mono font-black text-sky-500 dark:text-sky-400 whitespace-nowrap">
                {{ row.xp.toLocaleString() }} XP
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div
          v-if="totalPages > 1"
          class="flex items-center justify-between pt-4 mt-4 border-t border-slate-200/60 dark:border-white/10 font-mono text-xs"
        >
          <span class="text-slate-400">
            {{ locale === 'fr' ? `Page ${currentPage} sur ${totalPages}` : `Page ${currentPage} of ${totalPages}` }}
          </span>
          <div class="flex items-center gap-2">
            <button
              type="button"
              :disabled="currentPage <= 1"
              @click="currentPage--"
              class="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 disabled:opacity-35 text-slate-800 dark:text-white font-bold cursor-pointer"
            >
              ← {{ locale === 'fr' ? 'Précédent' : 'Prev' }}
            </button>
            <button
              type="button"
              :disabled="currentPage >= totalPages"
              @click="currentPage++"
              class="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 disabled:opacity-35 text-slate-800 dark:text-white font-bold cursor-pointer"
            >
              {{ locale === 'fr' ? 'Suivant' : 'Next' }} →
            </button>
          </div>
        </div>
      </div>

      <div v-else class="py-10 text-center font-mono text-xs text-slate-400">
        {{ locale === 'fr'
          ? 'Aucune partie enregistrée dans la base de données pour cette catégorie.'
          : 'No recorded sessions in the database for this category.' }}
      </div>

    </section>

    <!-- ========================================================= -->
    <!-- 5. COMPARATEUR FACE-À-FACE (ENTRE 2 VRAIS JOUEURS BDD)    -->
    <!-- ========================================================= -->
    <section
      v-if="comparisonTarget && myEntry && rankedOperators.length > 1"
      class="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-5 sm:p-7 shadow-xl space-y-5"
    >
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 dark:border-white/10 pb-4">
        <span class="font-mono text-xs font-bold uppercase tracking-wider text-sky-500 dark:text-sky-400">
          {{ locale === 'fr' ? 'COMPARAISON DIRECTE ENTRE JOUEURS' : 'DIRECT PLAYER COMPARISON' }}
        </span>
        <span class="font-mono text-[11px] text-slate-400">
          {{ locale === 'fr' ? 'Cliquez sur une ligne du classement pour comparer vos scores' : 'Click any row in the table above to compare scores' }}
        </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <!-- Radar 5 Axes -->
        <div class="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/90 border border-white/[0.07]">
          <svg viewBox="0 0 260 240" class="w-56 h-52 overflow-visible">
            <polygon
              v-for="lvl in [0.25, 0.5, 0.75, 1]"
              :key="'radar-ring-' + lvl"
              :points="getRadarGridPolygon(lvl)"
              fill="none"
              stroke="rgba(148, 163, 184, 0.16)"
              stroke-width="1"
            />
            <line
              v-for="(ax, aIdx) in radarAxesLabels"
              :key="'radar-axis-' + aIdx"
              x1="130"
              y1="120"
              :x2="getAxisEndpoint(aIdx, 1).x"
              :y2="getAxisEndpoint(aIdx, 1).y"
              stroke="rgba(148, 163, 184, 0.18)"
              stroke-width="1"
            />
            <polygon
              :points="targetRadarPolygon"
              fill="rgba(244, 63, 94, 0.20)"
              stroke="#f43f5e"
              stroke-width="2"
            />
            <polygon
              :points="myRadarPolygon"
              fill="rgba(56, 189, 248, 0.25)"
              stroke="#38bdf8"
              stroke-width="2"
            />
            <text
              v-for="(ax, aIdx) in radarAxesLabels"
              :key="'radar-lbl-' + aIdx"
              :x="getAxisEndpoint(aIdx, 1.22).x"
              :y="getAxisEndpoint(aIdx, 1.22).y"
              text-anchor="middle"
              dominant-baseline="middle"
              fill="#94a3b8"
              font-size="9.5"
              font-family="JetBrains Mono, monospace"
              font-weight="700"
            >
              {{ ax }}
            </text>
          </svg>
        </div>

        <!-- Barres de comparaison -->
        <div class="lg:col-span-8 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <strong class="text-sm font-black text-sky-400">{{ myEntry.username }} (#{{ myEntry.rank }})</strong>
              <span class="font-mono text-xs font-bold text-slate-400">{{ myEntry.xp.toLocaleString() }} XP</span>
            </div>
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <strong class="text-sm font-black text-rose-400">{{ comparisonTarget.username }} (#{{ comparisonTarget.rank }})</strong>
              <span class="font-mono text-xs font-bold text-slate-400">{{ comparisonTarget.xp.toLocaleString() }} XP</span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="stat in headToHeadMetrics"
              :key="stat.id"
              class="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/[0.07] space-y-2"
            >
              <div class="flex items-center justify-between font-mono text-[11px]">
                <strong class="text-sky-400">{{ stat.myFormatted }}</strong>
                <span class="text-slate-400 uppercase text-[10px] font-bold">{{ stat.label }}</span>
                <strong class="text-rose-400">{{ stat.targetFormatted }}</strong>
              </div>
              <div class="h-2 w-full rounded-full bg-rose-500/35 overflow-hidden flex">
                <div
                  class="h-full bg-sky-400 transition-all duration-500"
                  :style="{ width: `${getRatioPct(stat.myVal, stat.targetVal)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const API_URL = 'https://geolearn-backend-bj65.onrender.com';

const loading = ref(true);
const searchQuery = ref('');
// 'strict15' = QCM Classiques (/15) par défaut comme dans Scores.vue | 'normalized15' = Tous les modes ramenés sur 15
const scoreCalcMode = ref('normalized15');
const selectedModeFilter = ref('all');
const selectedLeagueFilter = ref('all');
const sortBy = ref('avg'); // Tri par Moyenne /15 par défaut pour valoriser la précision réelle
const currentPage = ref(1);
const pageSize = 15;

const inspectedRival = ref(null);
const currentUser = ref(null);

// Stocke les joueurs et leurs parties réelles récupérées depuis la BDD
const dbPlayersList = ref([]);

// =========================================================
// NORMALISATION IDENTIQUE À SCORES.VUE (ZÉRO DONNÉE INVENTÉE)
// =========================================================
const isClassicQcm15 = (s) => {
  const modeStr = (s.mode || '').toLowerCase();
  const max = Number(s.max_score || 15);
  return max === 15 && !modeStr.includes('flash') && !modeStr.includes('sprint');
};

const normalizeScoreTo15 = (s) => {
  const raw = Math.max(0, Number(s.score) || 0);
  const max = Math.max(1, Number(s.max_score) || 15);
  const modeStr = (s.mode || '').toLowerCase();
  if (isClassicQcm15(s)) {
    return Math.min(15, Math.round(raw * 10) / 10);
  }
  if (modeStr.includes('flash') && max === 40) {
    return Math.min(15, Math.round(((raw / 30) * 15) * 10) / 10);
  }
  return Math.min(15, Math.round(((raw / max) * 15) * 10) / 10);
};

const getModeCategoryKey = (mode = '') => {
  const m = mode.toLowerCase();
  if (m.includes('myst') || m.includes('worldle')) return 'worldle';
  if (m.includes('flash') || m.includes('sprint')) return 'sprint';
  if (m.includes('enqu') || m.includes('indice') || m.includes('detective')) return 'detective';
  if (m.includes('europe') || m.includes('monde') || m.includes('196') || m.includes('cliquez')) return 'chrono';
  if (m.includes('geoguessr') || m.includes('pindrop')) return 'pindrop';
  if (m.includes('duel')) return 'duel';
  return 'qcm';
};

const modeTabs = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'all', label: isFr ? 'Tous les modes' : 'All Modes' },
    { id: 'qcm', label: isFr ? 'QCM Classiques (/15)' : 'Classic QCMs (/15)' },
    { id: 'worldle', label: 'Pays Mystère (Worldle)' },
    { id: 'detective', label: isFr ? 'Enquête 5 Indices' : '5-Clue Detective' },
    { id: 'sprint', label: 'Sprint 60s' },
    { id: 'chrono', label: isFr ? 'Cartes (Europe / Monde)' : 'Map Challenges' },
    { id: 'pindrop', label: 'PinDrop 25K' },
    { id: 'duel', label: 'Duel 1v1' }
  ];
});

const sortOptions = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'avg', label: isFr ? 'Moyenne /15' : 'Avg /15' },
    { id: 'best', label: isFr ? 'Record /15' : 'Best /15' },
    { id: 'xp', label: 'XP' },
    { id: 'games', label: isFr ? 'Parties' : 'Games' }
  ];
});

const getLeagueInfo = (xpVal = 0) => {
  const isFr = locale.value === 'fr';
  if (xpVal >= 2200) {
    return { id: 'diamond', short: isFr ? 'Diamant Orbital' : 'Orbital Diamond', hex: '#38bdf8' };
  }
  if (xpVal >= 1200) {
    return { id: 'emerald', short: isFr ? 'Émeraude Maître' : 'Master Emerald', hex: '#10b981' };
  }
  if (xpVal >= 550) {
    return { id: 'gold', short: isFr ? 'Or Vanguard' : 'Vanguard Gold', hex: '#facc15' };
  }
  return { id: 'silver', short: isFr ? 'Argent Recon' : 'Recon Silver', hex: '#94a3b8' };
};

// =========================================================
// CALCUL DYNAMIQUE DU CLASSEMENT À PARTIR DES VRAIS JOUEURS BDD
// =========================================================
const rankedOperators = computed(() => {
  const results = [];

  for (const player of dbPlayersList.value) {
    // Si le joueur possède le détail de ses parties (`rawScores`), on applique le filtre exact (strict15 vs normalized15 et filtre de mode)
    if (Array.isArray(player.rawScores) && player.rawScores.length > 0) {
      let filteredScores = player.rawScores;

      if (selectedModeFilter.value !== 'all') {
        filteredScores = filteredScores.filter((s) => getModeCategoryKey(s.mode) === selectedModeFilter.value);
      } else if (scoreCalcMode.value === 'strict15') {
        const classicOnly = filteredScores.filter(isClassicQcm15);
        if (classicOnly.length > 0) filteredScores = classicOnly;
      }

      if (filteredScores.length === 0) continue;

      const vals15 = filteredScores.map(normalizeScoreTo15);
      const gamesCount = vals15.length;
      const bestOn15 = Math.max(...vals15);
      const avgOn15 = Number((vals15.reduce((a, b) => a + b, 0) / gamesCount).toFixed(1));
      const consistencyPct = Math.min(100, Math.round((avgOn15 / 15) * 100));
      const xp = Math.round(avgOn15 * 85 + bestOn15 * 25 + player.rawScores.length * 35);

      results.push({
        id: player.id,
        username: player.username,
        isMe: player.isMe,
        avgOn15,
        bestOn15,
        gamesCount,
        totalDbGames: player.rawScores.length,
        consistencyPct,
        xp,
        league: getLeagueInfo(xp),
        radar: [
          Math.min(1, avgOn15 / 15),
          Math.min(1, bestOn15 / 15),
          Math.min(1, consistencyPct / 100),
          Math.min(1, Math.max(0.3, gamesCount / 20)),
          Math.min(1, Math.max(0.3, player.rawScores.length / 40))
        ]
      });
    } else if (player.avgOn15 !== undefined) {
      // Joueur agrégé renvoyé directement par /api/leaderboard
      const avgOn15 = Math.min(15, Math.max(0, Number(player.avgOn15) || 0));
      const bestOn15 = Math.min(15, Math.max(avgOn15, Number(player.bestOn15) || avgOn15));
      const gamesCount = Math.max(1, Number(player.gamesCount) || 1);
      const consistencyPct = Math.min(100, Math.round((avgOn15 / 15) * 100));
      const xp = Math.round(avgOn15 * 85 + bestOn15 * 25 + gamesCount * 35);

      results.push({
        id: player.id,
        username: player.username,
        isMe: player.isMe,
        avgOn15,
        bestOn15,
        gamesCount,
        totalDbGames: gamesCount,
        consistencyPct,
        xp,
        league: getLeagueInfo(xp),
        radar: [
          Math.min(1, avgOn15 / 15),
          Math.min(1, bestOn15 / 15),
          Math.min(1, consistencyPct / 100),
          Math.min(1, Math.max(0.3, gamesCount / 20)),
          Math.min(1, Math.max(0.3, gamesCount / 40))
        ]
      });
    }
  }

  results.sort((a, b) => {
    if (sortBy.value === 'avg') return b.avgOn15 - a.avgOn15 || b.bestOn15 - a.bestOn15 || b.xp - a.xp;
    if (sortBy.value === 'best') return b.bestOn15 - a.bestOn15 || b.avgOn15 - a.avgOn15;
    if (sortBy.value === 'games') return b.gamesCount - a.gamesCount || b.avgOn15 - a.avgOn15;
    return b.xp - a.xp;
  });

  return results.map((item, idx) => ({
    ...item,
    rank: idx + 1
  }));
});

const totalDatabaseGames = computed(() =>
  rankedOperators.value.reduce((acc, p) => acc + (p.gamesCount || 0), 0)
);

const globalAverageOn15 = computed(() => {
  if (!rankedOperators.value.length) return '0.0';
  const sum = rankedOperators.value.reduce((acc, p) => acc + p.avgOn15, 0);
  return (sum / rankedOperators.value.length).toFixed(1);
});

const globalBestOn15 = computed(() => {
  if (!rankedOperators.value.length) return '0.0';
  return Math.max(...rankedOperators.value.map((p) => p.bestOn15)).toFixed(1);
});

const leagueDivisions = computed(() => {
  const isFr = locale.value === 'fr';
  const all = rankedOperators.value;
  return [
    { id: 'all', label: isFr ? 'Toutes les Ligues' : 'All Leagues', count: all.length },
    { id: 'diamond', label: isFr ? 'Diamant Orbital' : 'Orbital Diamond', count: all.filter((p) => p.league.id === 'diamond').length },
    { id: 'emerald', label: isFr ? 'Émeraude Maître' : 'Master Emerald', count: all.filter((p) => p.league.id === 'emerald').length },
    { id: 'gold', label: isFr ? 'Or Vanguard' : 'Vanguard Gold', count: all.filter((p) => p.league.id === 'gold').length },
    { id: 'silver', label: isFr ? 'Argent Recon' : 'Recon Silver', count: all.filter((p) => p.league.id === 'silver').length }
  ];
});

const displayedLeaderboard = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  return rankedOperators.value.filter((p) => {
    if (selectedLeagueFilter.value !== 'all' && p.league.id !== selectedLeagueFilter.value) return false;
    if (q && !p.username.toLowerCase().includes(q)) return false;
    return true;
  });
});

watch([searchQuery, selectedModeFilter, selectedLeagueFilter, scoreCalcMode], () => {
  currentPage.value = 1;
});

const totalPages = computed(() => Math.max(1, Math.ceil(displayedLeaderboard.value.length / pageSize)));

const paginatedLeaderboard = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return displayedLeaderboard.value.slice(start, start + pageSize);
});

const topThreePlayers = computed(() => rankedOperators.value.slice(0, 3));

const myEntry = computed(() => rankedOperators.value.find((p) => p.isMe) || rankedOperators.value[0] || null);

const comparisonTarget = computed(() => {
  if (inspectedRival.value) return inspectedRival.value;
  return rankedOperators.value.find((p) => !p.isMe) || rankedOperators.value[0] || null;
});

const radarAxesLabels = computed(() => {
  const isFr = locale.value === 'fr';
  return ['MOYENNE', 'RECORD', isFr ? 'PRÉCISION' : 'ACCURACY', isFr ? 'RÉGULARITÉ' : 'REGULARITY', 'VOLUME'];
});

const getAxisEndpoint = (axisIdx, ratio = 1) => {
  const cx = 130;
  const cy = 120;
  const maxR = 74;
  const angle = -Math.PI / 2 + (axisIdx * 2 * Math.PI) / 5;
  return {
    x: Number((cx + Math.cos(angle) * maxR * ratio).toFixed(1)),
    y: Number((cy + Math.sin(angle) * maxR * ratio).toFixed(1))
  };
};

const getRadarGridPolygon = (levelRatio) => {
  const pts = [];
  for (let i = 0; i < 5; i++) {
    const p = getAxisEndpoint(i, levelRatio);
    pts.push(`${p.x},${p.y}`);
  }
  return pts.join(' ');
};

const buildOperatorRadarPolygon = (op) => {
  const values = op?.radar || [0.7, 0.7, 0.7, 0.7, 0.7];
  return values
    .map((v, idx) => {
      const clamped = Math.max(0.18, Math.min(1, Number(v) || 0.5));
      const p = getAxisEndpoint(idx, clamped);
      return `${p.x},${p.y}`;
    })
    .join(' ');
};

const myRadarPolygon = computed(() => buildOperatorRadarPolygon(myEntry.value));
const targetRadarPolygon = computed(() => buildOperatorRadarPolygon(comparisonTarget.value));

const headToHeadMetrics = computed(() => {
  const isFr = locale.value === 'fr';
  const me = myEntry.value;
  const tg = comparisonTarget.value;
  if (!me || !tg) return [];
  return [
    {
      id: 'avg',
      label: isFr ? 'Moyenne (/15)' : 'Average (/15)',
      myVal: me.avgOn15,
      targetVal: tg.avgOn15,
      myFormatted: `${me.avgOn15.toFixed(1)} / 15`,
      targetFormatted: `${tg.avgOn15.toFixed(1)} / 15`
    },
    {
      id: 'best',
      label: isFr ? 'Record (/15)' : 'Best (/15)',
      myVal: me.bestOn15,
      targetVal: tg.bestOn15,
      myFormatted: `${me.bestOn15.toFixed(1)} / 15`,
      targetFormatted: `${tg.bestOn15.toFixed(1)} / 15`
    },
    {
      id: 'acc',
      label: isFr ? 'Précision' : 'Accuracy',
      myVal: me.consistencyPct,
      targetVal: tg.consistencyPct,
      myFormatted: `${me.consistencyPct}%`,
      targetFormatted: `${tg.consistencyPct}%`
    },
    {
      id: 'games',
      label: isFr ? 'Parties jouées' : 'Sessions Played',
      myVal: me.gamesCount,
      targetVal: tg.gamesCount,
      myFormatted: `${me.gamesCount}`,
      targetFormatted: `${tg.gamesCount}`
    }
  ];
});

const getInitials = (name = 'OP') => {
  const clean = name.toString().replace(/[_-]/g, ' ').trim();
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return clean.slice(0, 2).toUpperCase();
};

const getRatioPct = (valA, valB) => {
  const sum = Number(valA || 0) + Number(valB || 0);
  if (sum <= 0) return 50;
  return Math.max(12, Math.min(88, Math.round((Number(valA) / sum) * 100)));
};

// =========================================================
// MOTEUR 3D DU PODIUM & VRAIES COUPES DE TROPHÉES (OR / ARGENT / BRONZE)
// =========================================================
const podiumCanvasRef = ref(null);
let podiumAnimId = null;
let podYaw = 0.18;
let podPitch = 0.20;
let podVelYaw = 0;
let podDragging = false;
let podLastX = 0;
let podLastY = 0;
let podPhase = 0;

const onPodiumPointerDown = (e) => {
  podDragging = true;
  podVelYaw = 0;
  podLastX = e.clientX;
  podLastY = e.clientY;
};

const onPodiumPointerMove = (e) => {
  if (!podDragging) return;
  const dx = e.clientX - podLastX;
  const dy = e.clientY - podLastY;
  // Même sens naturel gauche/droite que dans Collection.vue
  podYaw -= dx * 0.01;
  podPitch = Math.max(-0.35, Math.min(0.48, podPitch + dy * 0.008));
  podVelYaw = -dx * 0.007;
  podLastX = e.clientX;
  podLastY = e.clientY;
};

const onPodiumPointerUp = () => {
  podDragging = false;
};

// Dessine une vraie Coupe de Trophée 3D au-dessus d'une marche du podium
const drawMini3DTrophyCup = (ctx, projectFn, offsetX, baseY, scaleCup, palette, rotAngle) => {
  const profile = [
    { y: 0,   r: 14 },
    { y: -5,  r: 12 },
    { y: -14, r: 5 },
    { y: -22, r: 14 },
    { y: -36, r: 22 },
    { y: -48, r: 25 }
  ];
  const segs = 14;
  const quads = [];

  for (let r = 0; r < profile.length - 1; r++) {
    const rA = profile[r];
    const rB = profile[r + 1];
    for (let i = 0; i < segs; i++) {
      const a0 = rotAngle + (i / segs) * Math.PI * 2;
      const a1 = rotAngle + ((i + 1) / segs) * Math.PI * 2;

      const p0 = projectFn(offsetX + rA.r * scaleCup * Math.cos(a0), baseY + rA.y * scaleCup, rA.r * scaleCup * Math.sin(a0));
      const p1 = projectFn(offsetX + rA.r * scaleCup * Math.cos(a1), baseY + rA.y * scaleCup, rA.r * scaleCup * Math.sin(a1));
      const p2 = projectFn(offsetX + rB.r * scaleCup * Math.cos(a1), baseY + rB.y * scaleCup, rB.r * scaleCup * Math.sin(a1));
      const p3 = projectFn(offsetX + rB.r * scaleCup * Math.cos(a0), baseY + rB.y * scaleCup, rB.r * scaleCup * Math.sin(a0));

      const avgZ = (p0.z + p1.z + p2.z + p3.z) * 0.25;
      const light = Math.cos(a0);
      quads.push({ p0, p1, p2, p3, avgZ, light });
    }
  }

  quads.sort((a, b) => b.avgZ - a.avgZ);

  for (const q of quads) {
    ctx.beginPath();
    ctx.moveTo(q.p0.x, q.p0.y);
    ctx.lineTo(q.p1.x, q.p1.y);
    ctx.lineTo(q.p2.x, q.p2.y);
    ctx.lineTo(q.p3.x, q.p3.y);
    ctx.closePath();
    ctx.fillStyle = q.light > 0.45 ? palette.spec : q.light > -0.15 ? palette.main : palette.dark;
    ctx.strokeStyle = palette.dark;
    ctx.lineWidth = 0.6;
    ctx.fill();
    ctx.stroke();
  }
};

const renderPodium3DLoop = () => {
  const canvas = podiumCanvasRef.value;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2 + 38;
    ctx.clearRect(0, 0, W, H);

    podPhase += 0.025;
    if (!podDragging) {
      if (Math.abs(podVelYaw) > 0.0004) {
        podYaw += podVelYaw;
        podVelYaw *= 0.94;
      } else {
        podYaw = Math.sin(podPhase * 0.45) * 0.24;
      }
    }

    const cosY = Math.cos(podYaw), sinY = Math.sin(podYaw);
    const cosP = Math.cos(podPitch), sinP = Math.sin(podPitch);

    const project = (x, y, z) => {
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      const y2 = y * cosP - z1 * sinP;
      const z2 = y * sinP + z1 * cosP;
      const s = 540 / (540 + z2 + 90);
      return { x: cx + x1 * s, y: cy + y2 * s, z: z2, s };
    };

    // Anneau orbital au sol
    ctx.beginPath();
    for (let a = 0; a <= Math.PI * 2; a += 0.08) {
      const p = project(275 * Math.cos(a), 56, 110 * Math.sin(a));
      if (a === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const p1 = topThreePlayers.value[0];
    const p2 = topThreePlayers.value[1];
    const p3 = topThreePlayers.value[2];

    const steps = [
      {
        rank: '#02',
        x: -165,
        topY: -6,
        bottomY: 56,
        w: 52,
        palette: { main: '#cbd5e1', dark: '#475569', spec: '#ffffff' },
        player: p2
      },
      {
        rank: '#03',
        x: 165,
        topY: 10,
        bottomY: 56,
        w: 52,
        palette: { main: '#b85d38', dark: '#5c2410', spec: '#f0a686' },
        player: p3
      },
      {
        rank: '#01',
        x: 0,
        topY: -32,
        bottomY: 56,
        w: 60,
        palette: { main: '#facc15', dark: '#854d0e', spec: '#fef9c3' },
        player: p1
      }
    ];

    for (const st of steps) {
      const hw = st.w;
      const hz = 38;
      const tY = st.topY;
      const bY = st.bottomY;

      const v = [
        project(st.x - hw, tY, -hz),
        project(st.x + hw, tY, -hz),
        project(st.x + hw, tY, hz),
        project(st.x - hw, tY, hz),
        project(st.x - hw, bY, -hz),
        project(st.x + hw, bY, -hz),
        project(st.x + hw, bY, hz),
        project(st.x - hw, bY, hz)
      ];

      const drawFace = (i0, i1, i2, i3, fill, stroke) => {
        ctx.beginPath();
        ctx.moveTo(v[i0].x, v[i0].y);
        ctx.lineTo(v[i1].x, v[i1].y);
        ctx.lineTo(v[i2].x, v[i2].y);
        ctx.lineTo(v[i3].x, v[i3].y);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      };

      drawFace(0, 3, 7, 4, '#080e1c', st.palette.main);
      drawFace(1, 2, 6, 5, '#080e1c', st.palette.main);
      drawFace(3, 2, 6, 7, '#0c1428', st.palette.main);
      drawFace(0, 1, 2, 3, '#111c36', st.palette.spec);

      // Coupe 3D en rotation au-dessus du pilier
      const bob = Math.sin(podPhase * 1.5 + st.x) * 3;
      drawMini3DTrophyCup(
        ctx,
        project,
        st.x,
        tY - 8 + bob,
        st.rank === '#01' ? 1.18 : 0.96,
        st.palette,
        podPhase * 0.9 + st.x
      );

      // Rang sur la face avant du pilier
      const frontPt = project(st.x, (tY + bY) * 0.5, hz + 2);
      ctx.font = `900 ${Math.round(15 * frontPt.s)}px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = st.palette.main;
      ctx.fillText(st.rank, frontPt.x, frontPt.y);

      // Nom du vrai joueur BDD au-dessus de sa coupe
      if (st.player) {
        const namePt = project(st.x, tY - 72 + bob, 0);
        ctx.font = `800 ${Math.round(12.5 * namePt.s)}px "Inter", sans-serif`;
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(st.player.username, namePt.x, namePt.y);

        ctx.font = `700 ${Math.round(10.5 * namePt.s)}px "JetBrains Mono", monospace`;
        ctx.fillStyle = '#34d399';
        ctx.fillText(`${st.player.avgOn15.toFixed(1)} / 15`, namePt.x, namePt.y + 15 * namePt.s);
      }
    }
  }
  podiumAnimId = requestAnimationFrame(renderPodium3DLoop);
};

// =========================================================
// SYNCHRONISATION MULTI-ENDPOINTS AVEC VOTRE VRAIE BDD
// =========================================================
const fetchRealDatabaseLeaderboard = async () => {
  loading.value = true;
  const playersByKey = new Map();

  let myUid = null;
  let myUsername = null;
  let authHeaders = {};

  const savedUser = localStorage.getItem('geolearn_user');
  const savedToken = localStorage.getItem('geolearn_token');
  if (savedUser) {
    try {
      const parsed = JSON.parse(savedUser);
      currentUser.value = parsed;
      myUid = parsed.id || (parsed.user && parsed.user.id);
      myUsername =
        parsed.name ||
        parsed.username ||
        parsed.pseudo ||
        (parsed.user && (parsed.user.name || parsed.user.username)) ||
        null;
      const tok = savedToken || parsed.token || (parsed.user && parsed.user.token);
      if (tok) {
        authHeaders = { Authorization: `Bearer ${tok}` };
      }
    } catch (e) {}
  }

  // Fonction d'ingestion universelle (accepte des lignes agrégées ou des scores individuels)
  const ingestRows = (rows) => {
    if (!Array.isArray(rows)) return;
    for (const row of rows) {
      const uid = row.user_id ?? row.utilisateur_id ?? row.userId ?? row.id;
      const uname =
        row.username ||
        row.name ||
        row.pseudo ||
        row.nom ||
        row.user_name ||
        (row.user && (row.user.username || row.user.name || row.user.pseudo)) ||
        (row.email ? row.email.split('@')[0] : null);

      if (!uname && !uid) continue;
      const displayUname = uname || `Joueur #${uid}`;
      const key = uid ? `uid-${uid}` : `name-${displayUname.toLowerCase()}`;
      const isMe =
        (myUid && String(uid) === String(myUid)) ||
        (myUsername && displayUname.toLowerCase() === myUsername.toLowerCase());

      // Cas A : ligne de score individuel
      if (row.score !== undefined && row.avg_score === undefined && row.moyenne === undefined && row.games_played === undefined && row.total_games === undefined) {
        if (!playersByKey.has(key)) {
          playersByKey.set(key, {
            id: key,
            uid,
            username: displayUname,
            isMe,
            rawScores: []
          });
        }
        playersByKey.get(key).rawScores.push({
          mode: row.mode || 'QCM',
          score: Number(row.score) || 0,
          max_score: Number(row.max_score) || 15
        });
      } else if (row.avg_score !== undefined || row.moyenne !== undefined || row.best_score !== undefined || row.total_games !== undefined || row.games_played !== undefined) {
        // Cas B : ligne déjà agrégée par SQL
        const max = Number(row.max_score) || 15;
        const rawAvg = Number(row.avg_score ?? row.moyenne ?? row.average_score ?? row.score ?? 0);
        const rawBest = Number(row.best_score ?? row.meilleur_score ?? row.max ?? rawAvg);
        const avg15 = max === 15 ? Math.min(15, rawAvg) : Math.min(15, (rawAvg / max) * 15);
        const best15 = max === 15 ? Math.min(15, rawBest) : Math.min(15, (rawBest / max) * 15);
        const count = Math.max(1, Number(row.games_played ?? row.total_games ?? row.parties_jouees ?? row.count ?? 1));

        playersByKey.set(key, {
          id: key,
          uid,
          username: displayUname,
          isMe,
          avgOn15: Number(avg15.toFixed(1)),
          bestOn15: Number(best15.toFixed(1)),
          gamesCount: count,
          rawScores: Array.isArray(row.scores) ? row.scores : null
        });
      }
    }
  };

  // 1. Teste les routes de classement et de scores globaux du backend
  const leaderboardEndpoints = [
    `${API_URL}/api/leaderboard`,
    `${API_URL}/api/classement`,
    `${API_URL}/api/scores`,
    `${API_URL}/api/admin/scores`
  ];

  for (const endpoint of leaderboardEndpoints) {
    try {
      const res = await fetch(endpoint, { headers: authHeaders });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data?.leaderboard || data?.scores || data?.data || []);
        if (list.length > 0) ingestRows(list);
      }
    } catch (e) {}
  }

  // 2. Récupère la liste des utilisateurs inscrits (/api/admin/users ou /api/users) et leurs scores
  const userEndpoints = [`${API_URL}/api/admin/users`, `${API_URL}/api/users`];
  for (const uEndpoint of userEndpoints) {
    try {
      const resU = await fetch(uEndpoint, { headers: authHeaders });
      if (resU.ok) {
        const uData = await resU.json();
        const usersList = Array.isArray(uData) ? uData : (uData?.users || uData?.data || []);
        if (usersList.length > 0) {
          await Promise.all(
            usersList.slice(0, 50).map(async (u) => {
              const uid = u.id || u.user_id;
              const uname = u.name || u.username || u.pseudo || (u.email ? u.email.split('@')[0] : null);
              if (!uid || !uname) return;
              const key = `uid-${uid}`;
              const isMe =
                (myUid && String(uid) === String(myUid)) ||
                (myUsername && uname.toLowerCase() === myUsername.toLowerCase());
              try {
                const rSc = await fetch(`${API_URL}/api/scores/${uid}`, { headers: authHeaders });
                if (rSc.ok) {
                  const scList = await rSc.json();
                  if (Array.isArray(scList) && scList.length > 0) {
                    playersByKey.set(key, {
                      id: key,
                      uid,
                      username: uname,
                      isMe,
                      rawScores: scList
                    });
                  }
                }
              } catch (err) {}
            })
          );
          break;
        }
      }
    } catch (e) {}
  }

  // 3. Charge toujours l'historique complet de l'opérateur connecté
  if (myUid && myUsername) {
    try {
      const resMyScores = await fetch(`${API_URL}/api/scores/${myUid}`, { headers: authHeaders });
      if (resMyScores.ok) {
        const myScores = await resMyScores.json();
        if (Array.isArray(myScores) && myScores.length > 0) {
          for (const [k, v] of playersByKey.entries()) {
            if (v.username.toLowerCase() === myUsername.toLowerCase()) {
              playersByKey.delete(k);
            }
          }
          playersByKey.set(`uid-${myUid}`, {
            id: `uid-${myUid}`,
            uid: myUid,
            username: myUsername,
            isMe: true,
            rawScores: myScores
          });
        }
      }
    } catch (e) {}
  }

  dbPlayersList.value = [...playersByKey.values()];
  loading.value = false;
};

onMounted(() => {
  renderPodium3DLoop();
  fetchRealDatabaseLeaderboard();
});

onUnmounted(() => {
  if (podiumAnimId) cancelAnimationFrame(podiumAnimId);
});
</script>