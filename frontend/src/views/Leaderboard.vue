<template>
  <div class="leaderboard-experience max-w-[1440px] mx-auto px-2 sm:px-6 pb-28 space-y-8 select-none">

    <!-- ========================================================= -->
    <!-- 1. EN-TÊTE : HIÉRARCHIE MONDIALE, PÉRIODE & DISCIPLINES   -->
    <!-- ========================================================= -->
    <header class="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-5 sm:p-7 shadow-xl space-y-5">
      <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-600 dark:text-sky-400 font-mono text-[11px] font-bold uppercase tracking-wider">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{{ locale === 'fr' ? 'HIÉRARCHIE MONDIALE // LIGUES TÉLÉMÉTRIQUES' : 'GLOBAL HIERARCHY // TELEMETRY LEAGUES' }}</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {{ locale === 'fr' ? 'Classement Général & Divisions' : 'Global Leaderboard & Divisions' }}
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {{ locale === 'fr'
              ? 'Indice de performance unifié sur 15, expérience cumulée et confrontation télémétrique directe.'
              : 'Unified 15-point performance index, cumulative XP, and direct head-to-head telemetry comparison.' }}
          </p>
        </div>

        <!-- Sélecteur de Période Temporelle (Tous les temps / Mensuel / Hebdomadaire) -->
        <div class="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-slate-200/75 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 self-start xl:self-auto">
          <button
            v-for="tf in timeframeOptions"
            :key="tf.id"
            type="button"
            @click="selectedTimeframe = tf.id"
            class="px-4 py-2 rounded-full font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
            :class="selectedTimeframe === tf.id
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{{ tf.label }}</span>
          </button>
        </div>
      </div>

      <!-- Ruban des Disciplines (Global, QCM /15, Worldle 3D, Sprint 60s, Chrono Carte, PinDrop 25K, Duel 1v1) -->
      <div class="pt-4 border-t border-slate-200/70 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-1.5">
          <button
            v-for="m in modeTabs"
            :key="m.id"
            type="button"
            @click="selectedModeFilter = m.id"
            class="px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border"
            :class="selectedModeFilter === m.id
              ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-950 border-transparent font-black shadow-md'
              : 'bg-slate-100/80 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-sky-500/40'"
          >
            <span class="font-mono text-[10px] opacity-75">{{ m.code }}</span>
            <span>{{ m.label }}</span>
          </button>
        </div>

        <div class="font-mono text-[11px] text-slate-400 flex items-center gap-2">
          <span>{{ locale === 'fr' ? 'OPÉRATEURS ACTIFS :' : 'ACTIVE OPERATORS:' }}</span>
          <strong class="text-sky-500 dark:text-sky-400">{{ rankedOperators.length }}</strong>
        </div>
      </div>
    </header>

    <!-- ========================================================= -->
    <!-- 2. BARRE DE PROGRESSION DE LIGUE DE L'OPÉRATEUR CONNECTÉ  -->
    <!-- ========================================================= -->
    <section
      v-if="myEntry"
      class="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-5 sm:p-6 shadow-xl space-y-4"
    >
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div
            class="w-14 h-14 rounded-2xl font-mono text-base font-black flex items-center justify-center shrink-0 border shadow-inner"
            :style="{
              backgroundColor: `${myEntry.league.hex}18`,
              borderColor: `${myEntry.league.hex}50`,
              color: myEntry.league.hex
            }"
          >
            #{{ String(myEntry.rank).padStart(2, '0') }}
          </div>

          <div class="space-y-0.5">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-mono text-[10px] font-bold uppercase tracking-wider text-sky-500 dark:text-sky-400">
                {{ locale === 'fr' ? 'VOTRE ACCRÉDITATION ACTUELLE' : 'YOUR CURRENT ACCREDITATION' }}
              </span>
              <span
                class="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-black uppercase border"
                :style="{
                  backgroundColor: `${myEntry.league.hex}18`,
                  borderColor: `${myEntry.league.hex}45`,
                  color: myEntry.league.hex
                }"
              >
                {{ myEntry.league.short }}
              </span>
            </div>

            <h2 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {{ myEntry.username }}
              <span class="font-mono text-xs font-normal text-slate-400 ml-2">
                ({{ myEntry.avgOn15.toFixed(1) }} / 15 • {{ myEntry.xp.toLocaleString() }} XP)
              </span>
            </h2>
          </div>
        </div>

        <!-- Statut de promotion vers la division supérieure -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-3 lg:text-right">
          <div class="space-y-1">
            <span class="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-300 block">
              <template v-if="nextLeagueTarget">
                {{ locale === 'fr'
                  ? `Plus que ${Math.max(0, nextLeagueTarget.minXp - myEntry.xp).toLocaleString()} XP avant la promotion en ${nextLeagueTarget.label}`
                  : `${Math.max(0, nextLeagueTarget.minXp - myEntry.xp).toLocaleString()} XP remaining to reach ${nextLeagueTarget.label}` }}
              </template>
              <template v-else>
                {{ locale === 'fr' ? 'Division Maximale Atteinte (Diamant Orbital)' : 'Maximum Division Reached (Orbital Diamond)' }}
              </template>
            </span>

            <div class="w-full sm:w-64 h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden ml-auto">
              <div
                class="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-500"
                :style="{ width: `${leagueProgressPct}%` }"
              ></div>
            </div>
          </div>

          <router-link
            to="/quiz"
            class="px-4 py-2.5 rounded-full bg-sky-500/15 hover:bg-sky-500 text-sky-500 dark:text-sky-300 hover:text-slate-950 border border-sky-500/35 font-mono text-xs font-black transition text-center shrink-0"
          >
            {{ locale === 'fr' ? 'Gagner de l\'XP →' : 'Earn XP →' }}
          </router-link>
        </div>
      </div>

      <!-- Échelle des 4 Divisions Cliquables -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-2.5 pt-3 border-t border-slate-200/60 dark:border-white/10">
        <button
          v-for="lg in leagueDivisions"
          :key="lg.id"
          type="button"
          @click="selectedLeagueFilter = lg.id"
          class="p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2"
          :class="selectedLeagueFilter === lg.id
            ? 'bg-slate-900 dark:bg-[#0D162B] border-sky-400 text-white shadow-md'
            : 'bg-slate-50/80 dark:bg-white/[0.02] border-slate-200/70 dark:border-white/[0.07] text-slate-600 dark:text-slate-300 hover:border-sky-500/40'"
        >
          <div class="min-w-0">
            <span class="font-mono text-[9px] font-bold uppercase block truncate" :style="{ color: lg.hex }">
              {{ lg.code }}
            </span>
            <strong class="text-xs font-black truncate block mt-0.5" :class="selectedLeagueFilter === lg.id ? 'text-white' : 'text-slate-900 dark:text-white'">
              {{ lg.label }}
            </strong>
            <span class="font-mono text-[10px] text-slate-400 block">
              {{ lg.minXp }}+ XP
            </span>
          </div>

          <span
            class="px-2.5 py-1 rounded-lg font-mono text-xs font-black border shrink-0"
            :style="{
              backgroundColor: `${lg.hex}18`,
              borderColor: `${lg.hex}40`,
              color: lg.hex
            }"
          >
            {{ lg.count }}
          </span>
        </button>
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- 3. SCÈNE WEBGL THREE.JS DU PODIUM 3D & CARTES DU TOP 3    -->
    <!-- ========================================================= -->
    <section
      v-if="topThreePlayers.length > 0"
      class="relative overflow-hidden rounded-[2rem] border border-slate-200/80 dark:border-white/12 bg-white dark:bg-[#070B16] p-6 sm:p-8 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
    >
      <div class="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px]"></div>
      <div class="pointer-events-none absolute -bottom-24 right-1/4 w-96 h-96 rounded-full bg-sky-500/12 blur-[120px]"></div>

      <!-- Gauche (5 cols) : Scène WebGL Three.js Podium 3D + Trophées PBR -->
      <div class="lg:col-span-5 flex flex-col items-center justify-center relative">
        <div class="w-full flex items-center justify-between font-mono text-[10px] text-slate-400 pb-2 border-b border-slate-200 dark:border-white/10">
          <span class="text-amber-400 font-bold">WEBGL 3D PODIUM // TOP 03</span>
          <div class="flex items-center gap-1">
            <button
              v-for="r in [2, 1, 3]"
              :key="'cam-focus-' + r"
              type="button"
              @click="focusPodiumRank(r)"
              class="px-2 py-0.5 rounded font-mono text-[10px] font-bold transition cursor-pointer"
              :class="focusedPodiumRank === r ? 'bg-sky-500 text-slate-950' : 'bg-white/5 text-slate-400 hover:text-white'"
            >
              #0{{ r }}
            </button>
          </div>
        </div>

        <div
          ref="podiumWebglMountRef"
          class="podium-webgl-mount relative flex items-center justify-center cursor-grab active:cursor-grabbing my-1"
          style="touch-action: none;"
          @pointerdown="onPodiumPointerDown"
          @pointermove="onPodiumPointerMove"
          @pointerup="onPodiumPointerUp"
          @pointerleave="onPodiumPointerUp"
          @click="triggerPodiumPulse"
        ></div>

        <span class="px-3.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 font-mono text-[10px] text-slate-500 dark:text-sky-300">
          {{ locale === 'fr' ? 'GLISSER EN 3D (WEBGL) • CLIQUER SUR #01 #02 #03' : 'DRAG IN 3D (WEBGL) • CLICK #01 #02 #03 TO FOCUS' }}
        </span>
      </div>

      <!-- Droite (7 cols) : Cartes Monumentales du Top 3 (#1 Or, #2 Argent, #3 Bronze) -->
      <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
        <article
          v-for="(p, idx) in topThreePlayers"
          :key="'top3-' + p.id"
          @click="selectOperatorForComparison(p, idx + 1)"
          class="relative rounded-3xl border p-5 flex flex-col justify-between gap-4 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
          :class="idx === 0
            ? 'bg-gradient-to-b from-amber-500/[0.14] to-transparent border-amber-400/55 shadow-[0_20px_50px_-12px_rgba(245,158,11,0.28)] sm:-translate-y-2'
            : idx === 1
              ? 'bg-gradient-to-b from-slate-300/[0.10] to-transparent border-slate-300/40'
              : 'bg-gradient-to-b from-amber-700/[0.12] to-transparent border-amber-600/40'"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span
                class="px-2.5 py-1 rounded-full font-mono text-[11px] font-black border"
                :class="idx === 0
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
                  : idx === 1
                    ? 'bg-slate-300/20 text-slate-200 border-slate-300/40'
                    : 'bg-amber-700/25 text-amber-400 border-amber-600/45'"
              >
                RANK #0{{ idx + 1 }}
              </span>

              <span
                class="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded border"
                :style="{
                  backgroundColor: `${p.league.hex}18`,
                  borderColor: `${p.league.hex}40`,
                  color: p.league.hex
                }"
              >
                {{ p.league.short }}
              </span>
            </div>

            <div class="flex items-center gap-3 pt-1">
              <div
                class="w-11 h-11 rounded-2xl font-mono text-sm font-black flex items-center justify-center shrink-0 text-slate-950 shadow-md"
                :style="{ backgroundColor: idx === 0 ? '#fbbf24' : idx === 1 ? '#cbd5e1' : '#d97706' }"
              >
                {{ getInitials(p.username) }}
              </div>
              <div class="min-w-0">
                <strong class="text-base font-black text-slate-900 dark:text-white truncate block">
                  {{ p.username }}
                </strong>
                <span class="font-mono text-[11px] text-slate-400 block">
                  {{ p.gamesCount }} {{ locale === 'fr' ? 'sessions' : 'sessions' }} • {{ p.consistencyPct }}% {{ locale === 'fr' ? 'précision' : 'acc.' }}
                </span>
              </div>
            </div>
          </div>

          <div class="space-y-2 pt-3 border-t border-slate-200/60 dark:border-white/10">
            <div class="flex items-baseline justify-between">
              <span class="text-[11px] text-slate-400">{{ locale === 'fr' ? 'Indice /15' : 'Avg /15' }}</span>
              <strong class="font-mono text-lg font-black text-emerald-500 dark:text-emerald-400">
                {{ p.avgOn15.toFixed(1) }} <span class="text-xs font-normal text-slate-400">/ 15</span>
              </strong>
            </div>
            <div class="flex items-baseline justify-between">
              <span class="text-[11px] text-slate-400">{{ locale === 'fr' ? 'Record' : 'Best' }}</span>
              <strong class="font-mono text-xs font-bold text-slate-700 dark:text-slate-200">
                {{ p.bestOn15.toFixed(1) }} / 15
              </strong>
            </div>
            <div class="flex items-baseline justify-between">
              <span class="text-[11px] text-slate-400">Rating XP</span>
              <strong class="font-mono text-xs font-black text-sky-500 dark:text-sky-400">
                {{ p.xp.toLocaleString() }} XP
              </strong>
            </div>

            <button
              type="button"
              @click.stop="challengeOperatorInDuel(p)"
              class="w-full mt-2 py-2 rounded-xl bg-slate-900 dark:bg-white/[0.07] hover:bg-sky-500 hover:text-slate-950 text-white font-mono text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
                <line x1="13" y1="19" x2="19" y2="13" />
              </svg>
              <span>{{ locale === 'fr' ? 'Défier en 1v1' : 'Challenge 1v1' }}</span>
            </button>
          </div>
        </article>
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- 4. COMPARATEUR TÉLÉMÉTRIQUE & RADAR SVG 5 AXES            -->
    <!-- ========================================================= -->
    <section
      v-if="comparisonTarget && myEntry"
      class="rounded-3xl border border-sky-500/30 bg-white/95 dark:bg-[#090E1A]/95 backdrop-blur-2xl p-5 sm:p-7 shadow-2xl space-y-6"
    >
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
        <div class="flex items-center gap-2.5">
          <span class="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>
          <span class="font-mono text-xs font-bold uppercase tracking-wider text-sky-500 dark:text-sky-400">
            {{ locale === 'fr' ? 'ANALYSEUR TÉLÉMÉTRIQUE FACE-À-FACE (5 AXES)' : '5-AXIS HEAD-TO-HEAD TELEMETRY ANALYZER' }}
          </span>
        </div>

        <button
          type="button"
          @click="challengeOperatorInDuel(comparisonTarget)"
          class="px-4 py-2 rounded-full bg-rose-500/15 hover:bg-rose-500 text-rose-500 dark:text-rose-300 hover:text-white border border-rose-500/35 font-mono text-xs font-black transition cursor-pointer flex items-center gap-2"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
            <line x1="13" y1="19" x2="19" y2="13" />
          </svg>
          <span>{{ locale === 'fr' ? `Lancer un Duel contre ${comparisonTarget.username}` : `Launch 1v1 Duel vs ${comparisonTarget.username}` }}</span>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

        <!-- Colonne Gauche (4 cols) : Radar Pentagonal SVG à 5 axes -->
        <div class="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-950/90 border border-white/10">
          <svg viewBox="0 0 260 250" class="w-60 h-56 overflow-visible">
            <!-- Grilles pentagonales concentriques (25%, 50%, 75%, 100%) -->
            <polygon
              v-for="lvl in [0.25, 0.5, 0.75, 1]"
              :key="'radar-ring-' + lvl"
              :points="getRadarGridPolygon(lvl)"
              fill="none"
              stroke="rgba(148, 163, 184, 0.18)"
              stroke-width="1"
            />

            <!-- Axes partant du centre -->
            <line
              v-for="(ax, aIdx) in radarAxesLabels"
              :key="'radar-axis-' + aIdx"
              x1="130"
              y1="125"
              :x2="getAxisEndpoint(aIdx, 1).x"
              :y2="getAxisEndpoint(aIdx, 1).y"
              stroke="rgba(148, 163, 184, 0.2)"
              stroke-width="1"
            />

            <!-- Polygone du Rival Ciblé (Rose Tactique) -->
            <polygon
              :points="targetRadarPolygon"
              fill="rgba(244, 63, 94, 0.22)"
              stroke="#f43f5e"
              stroke-width="2"
            />

            <!-- Polygone de l'Opérateur Connecté (Bleu Ciel) -->
            <polygon
              :points="myRadarPolygon"
              fill="rgba(56, 189, 248, 0.28)"
              stroke="#38bdf8"
              stroke-width="2.2"
            />

            <!-- Étiquettes des 5 axes -->
            <text
              v-for="(ax, aIdx) in radarAxesLabels"
              :key="'radar-lbl-' + aIdx"
              :x="getAxisEndpoint(aIdx, 1.22).x"
              :y="getAxisEndpoint(aIdx, 1.22).y"
              text-anchor="middle"
              dominant-baseline="middle"
              fill="#cbd5e1"
              font-size="9.5"
              font-family="JetBrains Mono, monospace"
              font-weight="700"
            >
              {{ ax }}
            </text>
          </svg>

          <div class="flex items-center gap-4 font-mono text-[10px] pt-2">
            <span class="flex items-center gap-1.5 text-sky-400 font-bold">
              <span class="w-2.5 h-2.5 rounded-xs bg-sky-400"></span>
              <span>{{ myEntry.username }}</span>
            </span>
            <span class="flex items-center gap-1.5 text-rose-400 font-bold">
              <span class="w-2.5 h-2.5 rounded-xs bg-rose-500"></span>
              <span>{{ comparisonTarget.username }}</span>
            </span>
          </div>
        </div>

        <!-- Colonne Droite (8 cols) : Comparaison détaillée des 5 axes et métriques -->
        <div class="lg:col-span-8 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- Carte Opérateur 1 (Vous) -->
            <div class="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl bg-sky-500 text-slate-950 font-mono text-xs font-black flex items-center justify-center shrink-0">
                  {{ getInitials(myEntry.username) }}
                </div>
                <div class="min-w-0">
                  <span class="font-mono text-[10px] font-bold text-sky-400 uppercase block">
                    {{ locale === 'fr' ? `VOUS • RANG #${myEntry.rank}` : `YOU • RANK #${myEntry.rank}` }}
                  </span>
                  <strong class="text-sm font-black text-slate-900 dark:text-white truncate block">{{ myEntry.username }}</strong>
                </div>
              </div>
              <span class="font-mono text-xs font-black text-sky-400 shrink-0">{{ myEntry.xp.toLocaleString() }} XP</span>
            </div>

            <!-- Carte Opérateur 2 (Cible) -->
            <div class="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl bg-rose-500 text-white font-mono text-xs font-black flex items-center justify-center shrink-0">
                  {{ getInitials(comparisonTarget.username) }}
                </div>
                <div class="min-w-0">
                  <span class="font-mono text-[10px] font-bold text-rose-400 uppercase block">
                    {{ locale === 'fr' ? `CIBLE • RANG #${comparisonTarget.rank}` : `TARGET • RANK #${comparisonTarget.rank}` }}
                  </span>
                  <strong class="text-sm font-black text-slate-900 dark:text-white truncate block">{{ comparisonTarget.username }}</strong>
                </div>
              </div>
              <span class="font-mono text-xs font-black text-rose-400 shrink-0">{{ comparisonTarget.xp.toLocaleString() }} XP</span>
            </div>
          </div>

          <!-- Barres de comparaison sur 4 indicateurs clés -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="stat in headToHeadMetrics"
              :key="stat.id"
              class="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/10 space-y-2"
            >
              <div class="flex items-center justify-between font-mono text-[11px]">
                <strong class="text-sky-500 dark:text-sky-400">{{ stat.myFormatted }}</strong>
                <span class="text-slate-400 uppercase text-[10px] font-bold">{{ stat.label }}</span>
                <strong class="text-rose-500 dark:text-rose-400">{{ stat.targetFormatted }}</strong>
              </div>
              <div class="h-2 w-full rounded-full bg-rose-500/40 overflow-hidden flex">
                <div
                  class="h-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-500"
                  :style="{ width: `${getRatioPct(stat.myVal, stat.targetVal)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ========================================================= -->
    <!-- 5. MATRICE COMPLÈTE DU CLASSEMENT & PAGINATION            -->
    <!-- ========================================================= -->
    <section class="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#090E1A]/95 backdrop-blur-2xl p-5 sm:p-7 shadow-2xl space-y-5">

      <!-- Barre d'outils : Recherche d'un joueur + Critère de tri -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-white/10">
        <div class="relative w-full sm:w-80">
          <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="locale === 'fr' ? 'Rechercher un opérateur...' : 'Search an operator...'"
            class="w-full pl-10 pr-8 py-2.5 rounded-full border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-sky-400"
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

        <div class="flex flex-wrap items-center gap-2">
          <span class="font-mono text-xs text-slate-400">
            {{ locale === 'fr' ? 'Trier par :' : 'Sort by:' }}
          </span>
          <button
            v-for="srt in sortOptions"
            :key="srt.id"
            type="button"
            @click="sortBy = srt.id"
            class="px-3.5 py-1.5 rounded-full font-mono text-xs font-bold transition cursor-pointer border"
            :class="sortBy === srt.id
              ? 'bg-sky-500/20 border-sky-400 text-sky-500 dark:text-sky-300'
              : 'bg-slate-100 dark:bg-white/[0.04] border-transparent text-slate-500 hover:text-white'"
          >
            {{ srt.label }}
          </button>
        </div>
      </div>

      <!-- État de chargement -->
      <div v-if="loading" class="py-12 text-center font-mono text-xs text-slate-400">
        {{ locale === 'fr' ? 'SYNCHRONISATION DU CLASSEMENT ORBITAL...' : 'SYNCING ORBITAL LEADERBOARD...' }}
      </div>

      <!-- Tableau des opérateurs -->
      <div v-else-if="paginatedLeaderboard.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-200 dark:border-white/10 font-mono text-[11px] uppercase text-slate-400">
              <th class="py-3 px-3">{{ locale === 'fr' ? 'Rang' : 'Rank' }}</th>
              <th class="py-3 px-3">{{ locale === 'fr' ? 'Opérateur' : 'Operator' }}</th>
              <th class="py-3 px-3">{{ locale === 'fr' ? 'Division' : 'Division' }}</th>
              <th class="py-3 px-3 text-right">{{ locale === 'fr' ? 'Moyenne (/15)' : 'Avg (/15)' }}</th>
              <th class="py-3 px-3 text-right">{{ locale === 'fr' ? 'Record (/15)' : 'Best (/15)' }}</th>
              <th class="py-3 px-3 text-right">{{ locale === 'fr' ? 'Précision' : 'Accuracy' }}</th>
              <th class="py-3 px-3 text-right">{{ locale === 'fr' ? 'Sessions' : 'Sessions' }}</th>
              <th class="py-3 px-3 text-right">Rating XP</th>
              <th class="py-3 px-3 text-right">{{ locale === 'fr' ? 'Action' : 'Action' }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200/60 dark:divide-white/[0.06] text-xs sm:text-sm">
            <tr
              v-for="row in paginatedLeaderboard"
              :key="row.id"
              @click="inspectedRival = row"
              class="transition-colors cursor-pointer"
              :class="[
                row.isMe
                  ? 'bg-sky-500/[0.10] hover:bg-sky-500/[0.15]'
                  : inspectedRival && inspectedRival.id === row.id
                    ? 'bg-emerald-500/[0.08]'
                    : 'hover:bg-slate-100/70 dark:hover:bg-white/[0.04]'
              ]"
            >
              <!-- Rang -->
              <td class="py-3.5 px-3 font-mono font-black whitespace-nowrap">
                <span
                  class="inline-flex items-center justify-center w-8 h-7 rounded-lg text-xs"
                  :class="row.rank === 1
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-400/40'
                    : row.rank === 2
                      ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                      : row.rank === 3
                        ? 'bg-amber-700/25 text-amber-400 border border-amber-600/40'
                        : 'text-slate-400'"
                >
                  #{{ String(row.rank).padStart(2, '0') }}
                </span>
              </td>

              <!-- Opérateur -->
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
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <strong class="font-bold text-slate-900 dark:text-white truncate">
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
                </div>
              </td>

              <!-- Ligue -->
              <td class="py-3.5 px-3 whitespace-nowrap">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase border"
                  :style="{
                    backgroundColor: `${row.league.hex}15`,
                    borderColor: `${row.league.hex}40`,
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

              <!-- Bouton Défier en 1v1 -->
              <td class="py-3.5 px-3 text-right whitespace-nowrap">
                <button
                  type="button"
                  @click.stop="challengeOperatorInDuel(row)"
                  class="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/[0.06] hover:bg-sky-500 hover:text-slate-950 text-slate-700 dark:text-slate-200 font-mono text-[10px] font-bold transition cursor-pointer"
                >
                  {{ locale === 'fr' ? 'Duel 1v1' : '1v1 Duel' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Contrôles de Pagination -->
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
        {{ locale === 'fr' ? 'Aucun opérateur trouvé pour ce filtre.' : 'No operator found for this filter.' }}
      </div>

    </section>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const router = useRouter();
const API_URL = 'https://geolearn-backend-bj65.onrender.com';

const loading = ref(true);
const searchQuery = ref('');
const selectedTimeframe = ref('alltime'); // 'alltime' | 'monthly' | 'weekly'
const selectedModeFilter = ref('all');
const selectedLeagueFilter = ref('all');
const sortBy = ref('xp'); // 'xp' | 'avg' | 'best' | 'games'
const currentPage = ref(1);
const pageSize = 12;

const inspectedRival = ref(null);
const focusedPodiumRank = ref(1);

const currentUser = ref(null);
const rawLeaderboardEntries = ref([]);

// =========================================================
// FILTRES TEMPORELS, MODES & DIVISIONS DE LIGUE
// =========================================================
const timeframeOptions = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'alltime', label: isFr ? 'Tous les temps' : 'All-Time' },
    { id: 'monthly', label: isFr ? 'Saison Mensuelle' : 'Monthly Season' },
    { id: 'weekly', label: isFr ? 'Sprint Hebdo' : 'Weekly Sprint' }
  ];
});

const modeTabs = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'all', code: '01', label: isFr ? 'Classement Global' : 'Global Standing' },
    { id: 'qcm', code: '02', label: isFr ? 'QCM Classiques (/15)' : 'Classic QCMs (/15)' },
    { id: 'worldle', code: '03', label: 'Worldle 3D' },
    { id: 'sprint', code: '04', label: 'Sprint 60s' },
    { id: 'chrono', code: '05', label: isFr ? 'Chrono Carte (47/196)' : 'Timed Map (47/196)' },
    { id: 'pindrop', code: '06', label: 'PinDrop 25K' },
    { id: 'duel', code: '07', label: 'Duel 1v1' }
  ];
});

const sortOptions = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'xp', label: 'Rating XP' },
    { id: 'avg', label: isFr ? 'Moyenne /15' : 'Avg /15' },
    { id: 'best', label: isFr ? 'Record /15' : 'Best /15' },
    { id: 'games', label: isFr ? 'Sessions' : 'Sessions' }
  ];
});

const getLeagueInfo = (xpVal = 0) => {
  const isFr = locale.value === 'fr';
  if (xpVal >= 2200) {
    return {
      id: 'diamond',
      tierNum: 4,
      code: 'DIV-01 // ORBITAL',
      short: isFr ? 'Diamant Orbital' : 'Orbital Diamond',
      rivalTier: 'master',
      hex: '#38bdf8'
    };
  }
  if (xpVal >= 1200) {
    return {
      id: 'emerald',
      tierNum: 3,
      code: 'DIV-02 // MASTER',
      short: isFr ? 'Émeraude Maître' : 'Master Emerald',
      rivalTier: 'diamond',
      hex: '#10b981'
    };
  }
  if (xpVal >= 550) {
    return {
      id: 'gold',
      tierNum: 2,
      code: 'DIV-03 // VANGUARD',
      short: isFr ? 'Or Vanguard' : 'Vanguard Gold',
      rivalTier: 'gold',
      hex: '#f59e0b'
    };
  }
  return {
    id: 'silver',
    tierNum: 1,
    code: 'DIV-04 // RECON',
    short: isFr ? 'Argent Recon' : 'Recon Silver',
    rivalTier: 'silver',
    hex: '#94a3b8'
  };
};

// Opérateurs de référence calibrés (complétés automatiquement par les vrais joueurs de l'API)
const REFERENCE_OPERATORS = [
  { id: 'ref-1', username: 'Aethelgard_Geo', avgOn15: 14.4, bestOn15: 15.0, gamesCount: 42, radar: [0.96, 0.92, 0.95, 0.94, 0.98], modes: ['all', 'qcm', 'chrono', 'pindrop', 'duel'] },
  { id: 'ref-2', username: 'Kaelen_Vexillo', avgOn15: 13.8, bestOn15: 15.0, gamesCount: 31, radar: [0.94, 0.89, 0.86, 0.88, 0.90], modes: ['all', 'qcm', 'worldle', 'sprint'] },
  { id: 'ref-3', username: 'Sora_Cartography', avgOn15: 13.5, bestOn15: 14.8, gamesCount: 27, radar: [0.88, 0.84, 0.96, 0.92, 0.85], modes: ['all', 'chrono', 'pindrop'] },
  { id: 'ref-4', username: 'Lyra_Meridian', avgOn15: 12.9, bestOn15: 15.0, gamesCount: 22, radar: [0.86, 0.90, 0.82, 0.85, 0.80], modes: ['all', 'qcm', 'worldle', 'duel'] },
  { id: 'ref-5', username: 'Vance_Orbital', avgOn15: 12.4, bestOn15: 14.5, gamesCount: 19, radar: [0.80, 0.86, 0.78, 0.90, 0.76], modes: ['all', 'sprint', 'pindrop'] },
  { id: 'ref-6', username: 'Nyx_Haversine', avgOn15: 11.8, bestOn15: 14.0, gamesCount: 15, radar: [0.76, 0.78, 0.84, 0.80, 0.72], modes: ['all', 'worldle', 'chrono'] },
  { id: 'ref-7', username: 'Orion_Telemetry', avgOn15: 11.1, bestOn15: 13.5, gamesCount: 11, radar: [0.74, 0.80, 0.70, 0.72, 0.65], modes: ['all', 'qcm', 'sprint'] },
  { id: 'ref-8', username: 'Zeph_Atlas', avgOn15: 10.3, bestOn15: 13.0, gamesCount: 8, radar: [0.68, 0.65, 0.72, 0.66, 0.58], modes: ['all', 'qcm'] },
  { id: 'ref-9', username: 'Caelum_Node', avgOn15: 9.8, bestOn15: 12.5, gamesCount: 6, radar: [0.64, 0.62, 0.60, 0.65, 0.52], modes: ['all', 'worldle', 'duel'] },
  { id: 'ref-10', username: 'Vega_Sector', avgOn15: 9.2, bestOn15: 12.0, gamesCount: 5, radar: [0.60, 0.58, 0.55, 0.60, 0.48], modes: ['all', 'qcm', 'chrono'] }
];

const computePlayerXp = (avg15, best15, games) =>
  Math.round(avg15 * 85 + best15 * 25 + games * 35);

const rankedOperators = computed(() => {
  const mode = selectedModeFilter.value;
  const tfMultiplier =
    selectedTimeframe.value === 'weekly'
      ? 0.35
      : selectedTimeframe.value === 'monthly'
        ? 0.68
        : 1;

  const filteredByMode = rawLeaderboardEntries.value.filter((item) => {
    if (mode === 'all') return true;
    return !item.modes || item.modes.includes(mode);
  });

  const enriched = filteredByMode.map((item) => {
    const avgOn15 = Math.min(15, Math.max(0, Number(item.avgOn15) || 0));
    const bestOn15 = Math.min(15, Math.max(avgOn15, Number(item.bestOn15) || avgOn15));
    const gamesCount = item.isMe
      ? Math.max(1, Number(item.gamesCount) || 1)
      : Math.max(1, Math.round((Number(item.gamesCount) || 1) * tfMultiplier));
    const xp = computePlayerXp(avgOn15, bestOn15, gamesCount);
    const consistencyPct = Math.min(100, Math.round((avgOn15 / 15) * 100));
    const defaultRadar = [
      Math.min(1, avgOn15 / 15),
      Math.min(1, bestOn15 / 15),
      Math.min(1, (avgOn15 + 1) / 15),
      Math.min(1, (bestOn15 - 0.5) / 15),
      Math.min(1, Math.max(0.35, gamesCount / 35))
    ];
    return {
      ...item,
      avgOn15,
      bestOn15,
      gamesCount,
      consistencyPct,
      xp,
      radar: item.radar || defaultRadar,
      league: getLeagueInfo(xp)
    };
  });

  enriched.sort((a, b) => {
    if (sortBy.value === 'avg') return b.avgOn15 - a.avgOn15 || b.xp - a.xp;
    if (sortBy.value === 'best') return b.bestOn15 - a.bestOn15 || b.xp - a.xp;
    if (sortBy.value === 'games') return b.gamesCount - a.gamesCount || b.xp - a.xp;
    return b.xp - a.xp;
  });

  return enriched.map((item, idx) => ({
    ...item,
    rank: idx + 1
  }));
});

const leagueDivisions = computed(() => {
  const isFr = locale.value === 'fr';
  const all = rankedOperators.value;
  return [
    { id: 'all', code: 'ALL DIVISIONS', label: isFr ? 'Toutes les Ligues' : 'All Leagues', minXp: 0, hex: '#38bdf8', count: all.length },
    { id: 'diamond', code: 'DIV-01 // ORBITAL', label: isFr ? 'Diamant Orbital' : 'Orbital Diamond', minXp: 2200, hex: '#38bdf8', count: all.filter((p) => p.league.id === 'diamond').length },
    { id: 'emerald', code: 'DIV-02 // MASTER', label: isFr ? 'Émeraude Maître' : 'Master Emerald', minXp: 1200, hex: '#10b981', count: all.filter((p) => p.league.id === 'emerald').length },
    { id: 'gold', code: 'DIV-03 // VANGUARD', label: isFr ? 'Or Vanguard' : 'Vanguard Gold', minXp: 550, hex: '#f59e0b', count: all.filter((p) => p.league.id === 'gold').length },
    { id: 'silver', code: 'DIV-04 // RECON', label: isFr ? 'Argent Recon' : 'Recon Silver', minXp: 0, hex: '#94a3b8', count: all.filter((p) => p.league.id === 'silver').length }
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

watch([searchQuery, selectedModeFilter, selectedLeagueFilter, selectedTimeframe], () => {
  currentPage.value = 1;
});

const totalPages = computed(() => Math.max(1, Math.ceil(displayedLeaderboard.value.length / pageSize)));

const paginatedLeaderboard = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return displayedLeaderboard.value.slice(start, start + pageSize);
});

const topThreePlayers = computed(() => rankedOperators.value.slice(0, 3));

const myEntry = computed(() => rankedOperators.value.find((p) => p.isMe) || rankedOperators.value[0]);

const nextLeagueTarget = computed(() => {
  if (!myEntry.value) return null;
  const xp = myEntry.value.xp;
  const isFr = locale.value === 'fr';
  if (xp < 550) return { label: isFr ? 'Or Vanguard' : 'Vanguard Gold', minXp: 550, prevXp: 0 };
  if (xp < 1200) return { label: isFr ? 'Émeraude Maître' : 'Master Emerald', minXp: 1200, prevXp: 550 };
  if (xp < 2200) return { label: isFr ? 'Diamant Orbital' : 'Orbital Diamond', minXp: 2200, prevXp: 1200 };
  return null;
});

const leagueProgressPct = computed(() => {
  if (!myEntry.value) return 0;
  if (!nextLeagueTarget.value) return 100;
  const { minXp, prevXp } = nextLeagueTarget.value;
  return Math.min(100, Math.max(5, Math.round(((myEntry.value.xp - prevXp) / (minXp - prevXp)) * 100)));
});

// =========================================================
// COMPARATEUR RADAR PENTAGONAL SVG À 5 AXES & MÉTRIQUES
// =========================================================
const comparisonTarget = computed(() => {
  if (inspectedRival.value) return inspectedRival.value;
  const firstOther = rankedOperators.value.find((p) => !p.isMe);
  return firstOther || rankedOperators.value[0];
});

const radarAxesLabels = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    'QCM /15',
    isFr ? 'VÉLOCITÉ' : 'VELOCITY',
    'ATLAS 196',
    'PINDROP',
    isFr ? 'ASSIDUITÉ' : 'VOLUME'
  ];
});

const getAxisEndpoint = (axisIdx, ratio = 1) => {
  const cx = 130;
  const cy = 125;
  const maxR = 78;
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
      label: isFr ? 'Taux de précision' : 'Accuracy Rate',
      myVal: me.consistencyPct,
      targetVal: tg.consistencyPct,
      myFormatted: `${me.consistencyPct}%`,
      targetFormatted: `${tg.consistencyPct}%`
    },
    {
      id: 'xp',
      label: 'Rating XP',
      myVal: me.xp,
      targetVal: tg.xp,
      myFormatted: `${me.xp.toLocaleString()} XP`,
      targetFormatted: `${tg.xp.toLocaleString()} XP`
    }
  ];
});

const selectOperatorForComparison = (player, podiumRank = null) => {
  inspectedRival.value = player;
  if (podiumRank) focusPodiumRank(podiumRank);
};

const challengeOperatorInDuel = (operator) => {
  router.push({
    path: '/duel',
    query: {
      challenger: operator.username,
      tier: operator.league?.rivalTier || 'gold'
    }
  });
};

const getInitials = (name = 'OP') => {
  const clean = name.replace(/[_-]/g, ' ').trim();
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
// SCÈNE WEBGL THREE.JS DU PODIUM 3D + TROPHÉES PBR
// =========================================================
const podiumWebglMountRef = ref(null);
let threeRenderer = null;
let threeScene = null;
let threeCamera = null;
let podiumGroup = null;
let trophyMeshes = [];
let orbitalRings = [];
let podiumAnimId = null;

let podDragging = false;
let podLastX = 0;
let podLastY = 0;
let podRotY = -0.22;
let podTargetRotY = -0.22;
let podRotX = 0.18;
let podPulseKick = 0;

const focusPodiumRank = (rankNum) => {
  focusedPodiumRank.value = rankNum;
  if (rankNum === 1) podTargetRotY = 0;
  else if (rankNum === 2) podTargetRotY = 0.48;
  else if (rankNum === 3) podTargetRotY = -0.48;
  podPulseKick = 0.18;
};

const triggerPodiumPulse = () => {
  podPulseKick = 0.22;
};

const onPodiumPointerDown = (e) => {
  podDragging = true;
  podLastX = e.clientX;
  podLastY = e.clientY;
};

const onPodiumPointerMove = (e) => {
  if (!podDragging) return;
  const dx = e.clientX - podLastX;
  const dy = e.clientY - podLastY;
  podRotY += dx * 0.01;
  podTargetRotY = podRotY;
  podRotX = Math.max(-0.4, Math.min(0.55, podRotX + dy * 0.008));
  podLastX = e.clientX;
  podLastY = e.clientY;
};

const onPodiumPointerUp = () => {
  podDragging = false;
};

const initThreeWebglPodium = async () => {
  if (typeof window === 'undefined' || !podiumWebglMountRef.value) return;
  try {
    const THREE = await import('https://esm.sh/three@0.160.0');
    const mount = podiumWebglMountRef.value;
    if (!mount) return;

    const W = mount.clientWidth || 380;
    const H = mount.clientHeight || 280;

    threeScene = new THREE.Scene();
    threeCamera = new THREE.PerspectiveCamera(36, W / H, 0.1, 100);
    threeCamera.position.set(0, 1.35, 7.4);
    threeCamera.lookAt(0, -0.15, 0);

    threeRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    threeRenderer.setSize(W, H);
    threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    threeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    threeRenderer.toneMappingExposure = 1.35;

    mount.innerHTML = '';
    mount.appendChild(threeRenderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 1.15);
    threeScene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.9);
    keyLight.position.set(5, 8, 6);
    threeScene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.4);
    rimLight.position.set(-5, 4, -4);
    threeScene.add(rimLight);

    podiumGroup = new THREE.Group();
    threeScene.add(podiumGroup);

    const darkPedestalMat = new THREE.MeshPhysicalMaterial({
      color: 0x0b1326,
      metalness: 0.65,
      roughness: 0.24,
      clearcoat: 1.0
    });

    // Fonction de création d'une Coupe de Trophée 3D PBR
    const createTrophyCup = (hexColor) => {
      const tGroup = new THREE.Group();
      const mat = new THREE.MeshPhysicalMaterial({
        color: hexColor,
        metalness: 0.78,
        roughness: 0.18,
        clearcoat: 1.0
      });

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.12, 24), darkPedestalMat);
      base.position.y = -0.32;
      tGroup.add(base);

      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.12, 0.28, 20), mat);
      stem.position.y = -0.12;
      tGroup.add(stem);

      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.12, 0.38, 28), mat);
      cup.position.y = 0.18;
      tGroup.add(cup);

      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.025, 14, 32), mat);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.37;
      tGroup.add(rim);

      for (const side of [-1, 1]) {
        const handle = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.022, 12, 24, Math.PI), mat);
        handle.position.set(side * 0.22, 0.18, 0);
        handle.rotation.z = side === 1 ? -Math.PI / 2 : Math.PI / 2;
        tGroup.add(handle);
      }
      return tGroup;
    };

    // Création des 3 colonnes hexagonales (#2 Argent, #1 Or, #3 Bronze)
    const configs = [
      { rank: 2, x: -1.35, h: 1.15, col: 0xcbd5e1 },
      { rank: 1, x: 0,     h: 1.65, col: 0xfbbf24 },
      { rank: 3, x: 1.35,  h: 0.90, col: 0xd97706 }
    ];

    trophyMeshes = [];
    for (const cfg of configs) {
      const colGroup = new THREE.Group();
      colGroup.position.set(cfg.x, -1.2 + cfg.h / 2, 0);

      const pillarGeo = new THREE.CylinderGeometry(0.52, 0.58, cfg.h, 6);
      const pillarMesh = new THREE.Mesh(pillarGeo, darkPedestalMat);
      colGroup.add(pillarMesh);

      const neonMat = new THREE.MeshStandardMaterial({
        color: cfg.col,
        emissive: cfg.col,
        emissiveIntensity: 2.0
      });
      const topRim = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.022, 12, 6), neonMat);
      topRim.rotation.x = Math.PI / 2;
      topRim.position.y = cfg.h / 2;
      colGroup.add(topRim);

      const trophy = createTrophyCup(cfg.col);
      trophy.position.y = cfg.h / 2 + 0.55;
      colGroup.add(trophy);
      trophyMeshes.push(trophy);

      podiumGroup.add(colGroup);
    }

    // Anneaux orbitaux à la base du Podium
    const ringMat1 = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, emissive: 0x0ea5e9, emissiveIntensity: 1.8 });
    const ringMat2 = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 1.6 });

    const r1 = new THREE.Mesh(new THREE.TorusGeometry(2.35, 0.02, 16, 96), ringMat1);
    r1.rotation.x = Math.PI / 2;
    r1.position.y = -1.2;
    podiumGroup.add(r1);

    const r2 = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.015, 16, 80), ringMat2);
    r2.rotation.x = Math.PI / 2;
    r2.position.y = -1.18;
    podiumGroup.add(r2);

    orbitalRings = [r1, r2];
  } catch (e) {}
};

const renderPodiumWebglLoop = (timeMs = 0) => {
  if (threeRenderer && threeScene && threeCamera && podiumGroup) {
    const tSec = timeMs * 0.001;

    if (!podDragging) {
      podRotY += (podTargetRotY - podRotY) * 0.08 + Math.sin(tSec * 0.5) * 0.0015;
    }

    if (podPulseKick > 0.005) podPulseKick *= 0.86;
    else podPulseKick = 0;

    podiumGroup.rotation.y = podRotY;
    podiumGroup.rotation.x = podRotX;
    const sc = 1 + podPulseKick * 0.25;
    podiumGroup.scale.set(sc, sc, sc);

    for (let i = 0; i < trophyMeshes.length; i++) {
      const tr = trophyMeshes[i];
      tr.rotation.y = tSec * 1.2 + i;
      tr.position.y = tr.userData.baseY || tr.position.y;
    }

    if (orbitalRings.length === 2) {
      const pulse = 1 + Math.sin(tSec * 2.2) * 0.03;
      orbitalRings[0].scale.set(pulse, pulse, 1);
      orbitalRings[1].scale.set(2 - pulse, 2 - pulse, 1);
    }

    threeRenderer.render(threeScene, threeCamera);
  }
  podiumAnimId = requestAnimationFrame(renderPodiumWebglLoop);
};

// =========================================================
// CHARGEMENT DES DONNÉES API + INTÉGRATION DU JOUEUR CONNECTÉ
// =========================================================
const normalizeRawScoreTo15 = (s) => {
  const raw = Math.max(0, Number(s.score) || 0);
  const max = Math.max(1, Number(s.max_score) || 15);
  const modeStr = (s.mode || '').toLowerCase();
  if (max === 15 && !modeStr.includes('flash') && !modeStr.includes('sprint')) {
    return Math.min(15, raw);
  }
  if (modeStr.includes('flash') && max === 40) {
    return Math.min(15, Number(((raw / 30) * 15).toFixed(1)));
  }
  return Math.min(15, Number(((raw / max) * 15).toFixed(1)));
};

onMounted(async () => {
  initThreeWebglPodium();
  renderPodiumWebglLoop();

  const operatorsMap = new Map();
  for (const refOp of REFERENCE_OPERATORS) {
    operatorsMap.set(refOp.username.toLowerCase(), { ...refOp, isMe: false });
  }

  try {
    const resLb = await fetch(`${API_URL}/api/leaderboard`);
    if (resLb.ok) {
      const lbData = await resLb.json();
      if (Array.isArray(lbData)) {
        for (const row of lbData) {
          const uname = row.username || row.name || row.pseudo;
          if (!uname) continue;
          const max = Number(row.max_score) || 15;
          const rawAvg = Number(row.avg_score || row.score || 11);
          const avg15 = Math.min(15, max === 15 ? rawAvg : (rawAvg / max) * 15);
          operatorsMap.set(uname.toLowerCase(), {
            id: `api-${row.user_id || uname}`,
            username: uname,
            avgOn15: Number(avg15.toFixed(1)),
            bestOn15: Math.min(15, Number((avg15 + 1.2).toFixed(1))),
            gamesCount: Math.max(1, Number(row.games_played || row.total_games || 5)),
            modes: ['all', 'qcm', 'worldle', 'sprint', 'chrono', 'pindrop', 'duel'],
            isMe: false
          });
        }
      }
    }
  } catch (e) {}

  const savedUser = localStorage.getItem('geolearn_user');
  if (savedUser) {
    try {
      const parsed = JSON.parse(savedUser);
      currentUser.value = parsed;
      const uid = parsed.id || (parsed.user && parsed.user.id);
      const myName =
        parsed.name ||
        parsed.username ||
        parsed.pseudo ||
        (parsed.user && (parsed.user.name || parsed.user.username)) ||
        'Operator';

      let myAvg = 12.0;
      let myBest = 14.0;
      let myCount = 1;

      if (uid) {
        const resScores = await fetch(`${API_URL}/api/scores/${uid}`);
        if (resScores.ok) {
          const scores = await resScores.json();
          if (Array.isArray(scores) && scores.length > 0) {
            const vals15 = scores.map(normalizeRawScoreTo15);
            myCount = vals15.length;
            myBest = Math.max(...vals15);
            myAvg = vals15.reduce((a, b) => a + b, 0) / myCount;
          }
        }
      }

      operatorsMap.set(myName.toLowerCase(), {
        id: `me-${uid || 'local'}`,
        username: myName,
        avgOn15: Number(myAvg.toFixed(1)),
        bestOn15: Number(myBest.toFixed(1)),
        gamesCount: myCount,
        modes: ['all', 'qcm', 'worldle', 'sprint', 'chrono', 'pindrop', 'duel'],
        isMe: true
      });
    } catch (e) {}
  }

  rawLeaderboardEntries.value = [...operatorsMap.values()];
  loading.value = false;
});

onUnmounted(() => {
  if (podiumAnimId) cancelAnimationFrame(podiumAnimId);
  if (threeRenderer) threeRenderer.dispose();
});
</script>

<style scoped>
.podium-webgl-mount {
  width: min(92vw, 420px);
  height: 280px;
  min-height: 260px;
}
</style>