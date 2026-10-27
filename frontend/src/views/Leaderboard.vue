<template>
  <div class="max-w-6xl mx-auto space-y-8 pb-12">

    <!-- ========================================================= -->
    <!-- EN-TÊTE DU CLASSEMENT + FILTRE TEMPOREL SUR UNE LIGNE     -->
    <!-- ========================================================= -->
    <div class="flex flex-col xl:flex-row xl:items-end justify-between gap-5">
      <div>
        <span class="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
          🌍 {{ locale === 'fr' ? 'Compétition Communautaire & Ligues' : 'Official Community Competition & Leagues' }}
        </span>
        <h2 class="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          {{ locale === 'fr' ? 'Classement Mondial & Ligues' : 'World Leaderboard & Leagues' }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base max-w-2xl">
          {{ locale === 'fr'
            ? 'Comparez vos records sur les 12 modes, progressez de la ligue Bronze jusqu\'au rang Diamant et cliquez sur un joueur pour lancer un Face-à-Face.'
            : 'Compare your records across all 12 modes, climb from Bronze to Diamond league, and click any player for a Head-to-Head comparison.' }}
        </p>
      </div>

      <!-- Sélecteur de période + Bouton Actualiser alignés proprement -->
      <div class="flex flex-wrap sm:flex-nowrap items-center gap-2.5 self-start xl:self-auto shrink-0">
        <div class="bg-white dark:bg-gray-800/90 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-700/80 flex items-center gap-1 text-xs font-bold shadow-2xs overflow-x-auto no-scrollbar">
          <button
            v-for="period in periodOptions"
            :key="period.id"
            type="button"
            @click="selectedPeriod = period.id"
            class="px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            :class="selectedPeriod === period.id
              ? 'bg-blue-600 text-white shadow-xs font-extrabold'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/60'"
          >
            <span v-if="period.icon">{{ period.icon }}</span>
            <span>{{ period.label }}</span>
          </button>
        </div>

        <button
          type="button"
          @click="fetchLeaderboard"
          :disabled="isLoading"
          class="px-4 py-3 rounded-2xl bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700/80 text-xs font-extrabold text-gray-700 dark:text-gray-200 hover:border-blue-500 dark:hover:border-blue-400 transition cursor-pointer flex items-center gap-2 shadow-2xs whitespace-nowrap shrink-0"
        >
          <span class="text-sm leading-none inline-block" :class="{ 'animate-spin': isLoading }">↻</span>
          <span>{{ locale === 'fr' ? 'Actualiser' : 'Refresh' }}</span>
        </button>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- BANNIÈRE SAISON MENSUELLE & FILTRE PAR DIVISION DE LIGUE  -->
    <!-- ========================================================= -->
    <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-500/25 space-y-6">
      <div class="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl"></div>

      <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div class="flex items-start sm:items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/25 to-orange-500/20 border border-amber-400/35 flex items-center justify-center text-3xl shrink-0 shadow-inner">
            🏆
          </div>
          <div>
            <div class="flex items-center gap-2.5 flex-wrap">
              <span class="px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                {{ currentSeasonLabel }}
              </span>
              <span class="text-xs font-bold text-amber-300 flex items-center gap-1">
                <span>⏳</span>
                <span>{{ seasonResetCountdown }}</span>
              </span>
            </div>
            <h3 class="text-xl sm:text-2xl font-black mt-1">
              {{ locale === 'fr' ? 'Ligues Officielles GeoLearn (Bronze → Diamant)' : 'Official GeoLearn Leagues (Bronze → Diamond)' }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-300 mt-0.5">
              {{ locale === 'fr'
                ? 'Cliquez sur une division ci-dessous pour filtrer les joueurs appartenant à cette ligue.'
                : 'Click on any division below to filter players belonging to that league.' }}
            </p>
          </div>
        </div>

        <button
          type="button"
          @click="selectedPeriod = selectedPeriod === 'season' ? 'all' : 'season'"
          class="self-start lg:self-center px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border shrink-0 flex items-center gap-2"
          :class="selectedPeriod === 'season'
            ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
            : 'bg-white/10 hover:bg-white/15 text-white border-white/20'"
        >
          <span>📅</span>
          <span>
            {{ selectedPeriod === 'season'
              ? (locale === 'fr' ? '✓ Classement de la Saison Mensuelle actif' : '✓ Monthly Season Ranking Active')
              : (locale === 'fr' ? 'Filtrer sur la Saison du Mois' : 'Filter by Current Month Season') }}
          </span>
        </button>
      </div>

      <!-- Les 6 cartes de filtrage de Ligues -->
      <div class="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          type="button"
          @click="selectedLeagueFilter = 'all'"
          class="p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between"
          :class="selectedLeagueFilter === 'all'
            ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/25 scale-[1.02]'
            : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'"
        >
          <div class="flex items-center justify-between w-full">
            <span class="text-xl">🌍</span>
            <span class="text-xs font-black px-2.5 py-0.5 rounded-full bg-black/30 text-white">
              {{ activeRanking.length }}
            </span>
          </div>
          <div class="mt-3">
            <strong class="text-xs sm:text-sm font-black block">{{ locale === 'fr' ? 'Toutes Ligues' : 'All Leagues' }}</strong>
            <span class="text-[11px] opacity-75 block mt-0.5">{{ locale === 'fr' ? 'Classement complet' : 'Full ranking' }}</span>
          </div>
        </button>

        <button
          v-for="lg in leagueTiersOverview"
          :key="lg.key"
          type="button"
          @click="selectedLeagueFilter = selectedLeagueFilter === lg.key ? 'all' : lg.key"
          class="p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between"
          :class="selectedLeagueFilter === lg.key
            ? 'bg-white text-slate-900 border-cyan-400 shadow-lg scale-[1.02]'
            : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'"
        >
          <div class="flex items-center justify-between w-full">
            <span class="text-xl">{{ lg.icon }}</span>
            <span
              class="text-xs font-black px-2.5 py-0.5 rounded-full"
              :class="selectedLeagueFilter === lg.key ? 'bg-slate-900 text-white' : 'bg-black/30 text-cyan-300'"
            >
              {{ lg.count }}
            </span>
          </div>
          <div class="mt-3">
            <strong class="text-xs sm:text-sm font-black block">{{ lg.name }}</strong>
            <span class="text-[11px] opacity-75 block truncate mt-0.5">{{ lg.requirement }}</span>
          </div>
        </button>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- CARTES KPI DE LA COMMUNAUTÉ                               -->
    <!-- ========================================================= -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/80 shadow-2xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl shrink-0">
          👥
        </div>
        <div class="min-w-0">
          <span class="text-xs font-bold text-gray-400 block">{{ locale === 'fr' ? 'Joueurs classés' : 'Ranked Players' }}</span>
          <strong class="text-2xl font-black text-gray-900 dark:text-white">{{ generalList.length }}</strong>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/80 shadow-2xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl shrink-0">
          🎮
        </div>
        <div class="min-w-0">
          <span class="text-xs font-bold text-gray-400 block">{{ locale === 'fr' ? 'Parties disputées' : 'Total Games' }}</span>
          <strong class="text-2xl font-black text-gray-900 dark:text-white">{{ totalCommunityGames.toLocaleString() }}</strong>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/80 shadow-2xs flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl shrink-0">
          👑
        </div>
        <div class="min-w-0 flex-1">
          <span class="text-xs font-bold text-gray-400 block">{{ locale === 'fr' ? 'N°1 Actuel' : 'Current #1' }}</span>
          <strong
            class="text-sm sm:text-base font-black text-gray-900 dark:text-white truncate block"
            :title="activeRanking[0] ? activeRanking[0].username : ''"
          >
            {{ activeRanking[0] ? activeRanking[0].username : '—' }}
          </strong>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700/80 shadow-2xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl shrink-0">
          🔥
        </div>
        <div class="min-w-0">
          <span class="text-xs font-bold text-gray-400 block">{{ locale === 'fr' ? 'Record du mode' : 'Mode Record' }}</span>
          <strong class="text-base sm:text-lg font-black text-purple-600 dark:text-purple-400 truncate block">
            {{ activeRanking[0] ? activeRanking[0].metricDisplay : '—' }}
          </strong>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- GRILLE DES 12 ONGLETS DE MODES (SANS SCROLLBAR BLANCHE)   -->
    <!-- ========================================================= -->
    <div class="bg-white dark:bg-gray-800 p-3 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700/80">
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          @click="activeTab = tab.id"
          class="px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 border"
          :class="activeTab === tab.id
            ? 'bg-blue-600 text-white border-blue-500 shadow-sm scale-[1.02]'
            : 'bg-gray-50/80 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 border-gray-200/70 dark:border-gray-700/70 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
        >
          <span>{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- BANNIÈRE DE RANG DU JOUEUR CONNECTÉ + ÉCART RANG SUIVANT  -->
    <!-- ========================================================= -->
    <div
      v-if="currentUserRank"
      class="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white rounded-3xl p-5 sm:p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 border border-blue-400/30"
    >
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex flex-col items-center justify-center font-black border border-white/25 shrink-0">
          <span class="text-[10px] uppercase tracking-wider text-blue-100">{{ locale === 'fr' ? 'Rang' : 'Rank' }}</span>
          <span class="text-xl leading-none">#{{ currentUserRank.rank }}</span>
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-bold uppercase tracking-wider text-blue-100">
              {{ locale === 'fr' ? 'Votre position actuelle' : 'Your current standing' }}
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-white/20 text-white">
              {{ currentUserRank.league.icon }} {{ currentUserRank.league.name }}
            </span>
          </div>
          <h3 class="text-lg sm:text-xl font-black mt-0.5">
            {{ currentUserRank.username }} — {{ currentUserRank.metricDisplay }}
          </h3>
          <p v-if="nextRankGapText" class="text-xs text-cyan-100 font-semibold mt-0.5">
            🎯 {{ nextRankGapText }}
          </p>
        </div>
      </div>

      <router-link
        :to="activeTab === 'geoguessr' ? '/geoguessr' : '/quiz'"
        class="px-5 py-3 rounded-xl bg-white text-blue-700 font-extrabold text-xs sm:text-sm hover:bg-blue-50 transition shrink-0 shadow-xs"
      >
        🚀 {{ locale === 'fr' ? 'Améliorer mon record' : 'Improve my record' }}
      </router-link>
    </div>

    <!-- ========================================================= -->
    <!-- PODIUM TOP 3 (OR, ARGENT, BRONZE)                         -->
    <!-- ========================================================= -->
    <div v-if="podiumPlayers.length > 0 && selectedLeagueFilter === 'all'" class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
      
      <!-- 2e Place (Argent) -->
      <div
        v-if="podiumPlayers[1]"
        @click="openPlayerModal(podiumPlayers[1])"
        class="order-2 md:order-1 bg-white dark:bg-gray-800 rounded-3xl p-6 text-center border-2 border-slate-300 dark:border-slate-600 shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center"
      >
        <div class="w-full flex items-center justify-between mb-3">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {{ podiumPlayers[1].league.icon }} {{ podiumPlayers[1].league.name }}
          </span>
          <span class="text-xs font-black text-slate-400">#2</span>
        </div>
        <div class="text-4xl mb-2">🥈</div>
        <div class="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-xs">
          {{ getInitials(podiumPlayers[1].username) }}
        </div>
        <h3 class="text-lg font-black text-gray-900 dark:text-white truncate max-w-full">
          {{ podiumPlayers[1].username }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {{ podiumPlayers[1].subText }}
        </p>
        <span class="inline-block px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-black text-sm">
          {{ podiumPlayers[1].metricDisplay }}
        </span>
      </div>

      <!-- 1re Place (Or - Surélevé) -->
      <div
        v-if="podiumPlayers[0]"
        @click="openPlayerModal(podiumPlayers[0])"
        class="order-1 md:order-2 bg-gradient-to-b from-amber-50/90 to-white dark:from-amber-950/30 dark:to-gray-800 rounded-3xl p-7 text-center border-2 border-amber-400 shadow-xl md:-translate-y-3 hover:-translate-y-4 transition-all cursor-pointer flex flex-col items-center"
      >
        <div class="w-full flex items-center justify-between mb-3">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200">
            {{ podiumPlayers[0].league.icon }} {{ podiumPlayers[0].league.name }}
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400 text-amber-950">
            #1 Champion
          </span>
        </div>
        <div class="text-5xl mb-2">👑</div>
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 text-white font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
          {{ getInitials(podiumPlayers[0].username) }}
        </div>
        <h3 class="text-xl font-black text-gray-900 dark:text-white truncate max-w-full">
          {{ podiumPlayers[0].username }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
          {{ podiumPlayers[0].subText }}
        </p>
        <span class="inline-block px-5 py-2 rounded-xl bg-amber-400 text-amber-950 font-black text-base shadow-xs">
          {{ podiumPlayers[0].metricDisplay }}
        </span>
      </div>

      <!-- 3e Place (Bronze) -->
      <div
        v-if="podiumPlayers[2]"
        @click="openPlayerModal(podiumPlayers[2])"
        class="order-3 bg-white dark:bg-gray-800 rounded-3xl p-6 text-center border-2 border-orange-300 dark:border-orange-700/70 shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center"
      >
        <div class="w-full flex items-center justify-between mb-3">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200">
            {{ podiumPlayers[2].league.icon }} {{ podiumPlayers[2].league.name }}
          </span>
          <span class="text-xs font-black text-orange-400">#3</span>
        </div>
        <div class="text-4xl mb-2">🥉</div>
        <div class="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-xs">
          {{ getInitials(podiumPlayers[2].username) }}
        </div>
        <h3 class="text-lg font-black text-gray-900 dark:text-white truncate max-w-full">
          {{ podiumPlayers[2].username }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {{ podiumPlayers[2].subText }}
        </p>
        <span class="inline-block px-4 py-1.5 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 font-black text-sm">
          {{ podiumPlayers[2].metricDisplay }}
        </span>
      </div>

    </div>

    <!-- ========================================================= -->
    <!-- TABLEAU COMPLET DU CLASSEMENT AVEC RECHERCHE              -->
    <!-- ========================================================= -->
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div class="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3 flex-wrap">
          <div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white">
              {{ activeTabLabel }}
            </h3>
            <p class="text-xs text-gray-400">
              {{ locale === 'fr' ? 'Cliquez sur un joueur pour comparer vos profils en Face-à-Face' : 'Click any player to compare profiles Head-to-Head' }}
            </p>
          </div>
          <span
            v-if="selectedLeagueFilter !== 'all'"
            class="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5"
          >
            <span>{{ locale === 'fr' ? 'Filtre ligue actif' : 'League filter active' }}</span>
            <button type="button" @click="selectedLeagueFilter = 'all'" class="hover:text-red-500 cursor-pointer">✕</button>
          </span>
        </div>

        <div class="relative w-full sm:w-64">
          <input
            v-model="playerSearch"
            type="text"
            :placeholder="locale === 'fr' ? '🔍 Rechercher un joueur...' : '🔍 Search a player...'"
            class="w-full pl-4 pr-8 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
          <button
            v-if="playerSearch"
            type="button"
            @click="playerSearch = ''"
            class="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      <div v-if="filteredRanking.length === 0" class="p-12 text-center text-gray-500 dark:text-gray-400 text-sm">
        {{ locale === 'fr'
          ? 'Aucun score enregistré pour ce filtre pour le moment. Soyez le premier à établir un record !'
          : 'No scores recorded for this filter yet. Be the first to set a record!' }}
      </div>

      <div v-else class="divide-y divide-gray-100 dark:divide-gray-700/70">
        <div
          v-for="row in filteredRanking"
          :key="row.uniqueKey"
          @click="openPlayerModal(row)"
          class="p-4 sm:px-6 flex items-center justify-between gap-4 transition-colors cursor-pointer"
          :class="isCurrentUser(row)
            ? 'bg-blue-50/80 dark:bg-blue-950/40'
            : 'hover:bg-gray-50 dark:hover:bg-gray-700/40'"
        >
          <!-- Gauche : Rang + Avatar Initiales + Nom + Badge Ligue -->
          <div class="flex items-center gap-3.5 sm:gap-4 min-w-0">
            <div
              class="w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center shrink-0"
              :class="[
                row.rank === 1 ? 'bg-amber-400 text-amber-950 shadow-2xs' : '',
                row.rank === 2 ? 'bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white' : '',
                row.rank === 3 ? 'bg-orange-200 dark:bg-orange-800 text-orange-950 dark:text-orange-100' : '',
                row.rank > 3 ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300' : ''
              ]"
            >
              #{{ row.rank }}
            </div>

            <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 font-bold text-sm flex items-center justify-center shrink-0">
              {{ getInitials(row.username) }}
            </div>

            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <strong class="font-bold text-gray-900 dark:text-white truncate">
                  {{ row.username }}
                </strong>
                <span
                  v-if="isCurrentUser(row)"
                  class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-600 text-white"
                >
                  {{ locale === 'fr' ? 'Vous' : 'You' }}
                </span>
                <span
                  class="px-2 py-0.5 rounded-md text-[10px] font-extrabold"
                  :class="row.league.badgeClass"
                >
                  {{ row.league.icon }} {{ row.league.name }}
                </span>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {{ row.subText }}
              </p>
            </div>
          </div>

          <!-- Droite : Score / XP + Bouton Face-à-Face -->
          <div class="flex items-center gap-3 shrink-0">
            <span class="hidden sm:inline-block text-xs font-bold text-blue-600 dark:text-blue-400 opacity-75">
              ⚔️ {{ locale === 'fr' ? 'Comparer' : 'Compare' }}
            </span>
            <span class="px-3.5 py-1.5 rounded-xl font-black text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
              {{ row.metricDisplay }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- MODALE FACE-À-FACE (COMPARATIF JOUEUR VS VOUS)            -->
    <!-- ========================================================= -->
    <div
      v-if="inspectedPlayer"
      class="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-md"
      @click.self="inspectedPlayer = null"
    >
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-gray-700 space-y-6 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center">
              {{ getInitials(inspectedPlayer.username) }}
            </div>
            <div>
              <span class="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                ⚔️ {{ locale === 'fr' ? 'Fiche & Face-à-Face' : 'Player Card & Head-to-Head' }}
              </span>
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-2xl font-black text-gray-900 dark:text-white">
                  {{ inspectedPlayer.username }}
                </h3>
                <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold" :class="inspectedPlayer.league?.badgeClass">
                  {{ inspectedPlayer.league?.icon }} {{ inspectedPlayer.league?.name }}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            @click="inspectedPlayer = null"
            class="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-100 hover:text-red-600 text-gray-600 dark:text-gray-300 font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <!-- Bilan global du duel Face-à-Face -->
        <div class="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-gray-900 dark:to-gray-900 p-4 rounded-2xl border border-blue-100 dark:border-gray-700 flex items-center justify-between text-xs sm:text-sm font-black">
          <span class="text-blue-600 dark:text-blue-400">
            {{ inspectedPlayer.username }} : {{ headToHeadSummary.theirWins }}
          </span>
          <span class="text-gray-400 uppercase text-[11px]">{{ locale === 'fr' ? 'Modes dominés' : 'Modes led' }}</span>
          <span class="text-emerald-600 dark:text-emerald-400">
            {{ locale === 'fr' ? 'Vous' : 'You' }} : {{ headToHeadSummary.myWins }}
          </span>
        </div>

        <!-- Comparatif des records par mode -->
        <div class="space-y-2">
          <div class="grid grid-cols-3 text-xs font-extrabold uppercase text-gray-400 px-3 pb-1">
            <span>Mode</span>
            <span class="text-center text-blue-600 dark:text-blue-400 truncate">{{ inspectedPlayer.username }}</span>
            <span class="text-right text-emerald-600 dark:text-emerald-400">{{ locale === 'fr' ? 'Vous' : 'You' }}</span>
          </div>

          <div
            v-for="comp in headToHeadStats"
            :key="comp.label"
            class="grid grid-cols-3 items-center bg-gray-50 dark:bg-gray-900/70 px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-700/70 text-xs sm:text-sm"
          >
            <span class="font-bold text-gray-700 dark:text-gray-300 truncate">{{ comp.icon }} {{ comp.label }}</span>
            <strong
              class="text-center font-black"
              :class="comp.theirNumeric > comp.myNumeric ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'"
            >
              {{ comp.theirBest }}
            </strong>
            <strong
              class="text-right font-black"
              :class="comp.myNumeric >= comp.theirNumeric && comp.myNumeric >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500'"
            >
              {{ comp.myBest }}
            </strong>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
          <router-link
            :to="{ path: '/quiz', query: { mode: 'custom-builder' } }"
            class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm transition"
          >
            ⚔️ {{ locale === 'fr' ? 'Créer un Défi sur-mesure' : 'Create Custom Duel' }}
          </router-link>

          <button
            type="button"
            @click="inspectedPlayer = null"
            class="px-6 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold text-sm cursor-pointer"
          >
            {{ locale === 'fr' ? 'Fermer' : 'Close' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const API_URL = 'https://geolearn-backend-bj65.onrender.com';

const activeTab = ref('general');
const selectedPeriod = ref('all'); // 'all' | 'season' | 'month' | 'today'
const selectedLeagueFilter = ref('all'); // 'all' | 'diamond' | 'platinum' | 'gold' | 'silver' | 'bronze'
const playerSearch = ref('');
const isLoading = ref(false);

const generalList = ref([]);
const recordsList = ref([]);
const currentUser = ref(null);
const inspectedPlayer = ref(null);

const periodOptions = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'all', icon: '', label: isFr ? 'Tous les temps' : 'All-Time' },
    { id: 'season', icon: '🏆', label: isFr ? 'Saison du Mois' : 'Monthly Season' },
    { id: 'month', icon: '', label: isFr ? '30 jours' : '30 Days' },
    { id: 'today', icon: '', label: isFr ? 'Aujourd\'hui' : 'Today' }
  ];
});

// Nom de la saison mensuelle en cours + compte à rebours avant le 1er du mois suivant
const currentSeasonLabel = computed(() => {
  const now = new Date();
  const monthName = now.toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
    month: 'long',
    year: 'numeric'
  });
  return locale.value === 'fr'
    ? `Saison ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`
    : `Season ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`;
});

const seasonResetCountdown = computed(() => {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
  const diffMs = Math.max(0, nextMonth.getTime() - now.getTime());
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  return locale.value === 'fr'
    ? `Réinitialisation mensuelle dans ${days}j ${hours}h`
    : `Monthly reset in ${days}d ${hours}h`;
});

const tabs = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'general', icon: '👑', label: isFr ? 'Général (XP)' : 'Overall (XP)' },
    { id: 'geoguessr', icon: '🛰️', label: 'PinDrop (25 000)' },
    { id: 'mystery', icon: '🧭', label: isFr ? 'Pays Mystère' : 'Mystery Country' },
    { id: 'flash60', icon: '⚡', label: isFr ? 'QCM Flash (60s)' : '60s Flash Quiz' },
    { id: 'detective', icon: '🕵️', label: isFr ? 'Enquête 5 Indices' : '5-Clue Detective' },
    { id: 'mapclick', icon: '🖱️', label: isFr ? 'Cliquez Carte' : 'Map Click' },
    { id: 'world', icon: '🌍', label: isFr ? 'Défi Monde (196)' : 'World Challenge (196)' },
    { id: 'europe', icon: '🇪🇺', label: isFr ? 'Défi Europe (47)' : 'Europe Challenge (47)' },
    { id: 'grid', icon: '🏳️', label: isFr ? 'Grille Drapeaux' : 'Flag Grid' },
    { id: 'capitals', icon: '🏛️', label: isFr ? 'QCM Capitales' : 'Capitals Quiz' },
    { id: 'flags', icon: '🚩', label: isFr ? 'QCM Drapeaux' : 'Flags Quiz' },
    { id: 'culture', icon: '🗣️', label: isFr ? 'QCM Culture' : 'Culture Quiz' }
  ];
});

const activeTabLabel = computed(() => {
  const found = tabs.value.find(t => t.id === activeTab.value);
  return found ? found.label : '';
});

const totalCommunityGames = computed(() =>
  generalList.value.reduce((acc, row) => acc + Number(row.games_played || 0), 0)
);

const getInitials = (name = '') => {
  const clean = (name || 'J').trim();
  return clean.slice(0, 2).toUpperCase();
};

const getLeague = (ratioOrXp, isGeneral = false) => {
  const isFr = locale.value === 'fr';
  const scoreVal = isGeneral ? ratioOrXp / 10000 : ratioOrXp;
  if (scoreVal >= 0.85) {
    return { key: 'diamond', icon: '💎', name: isFr ? 'Diamant' : 'Diamond', badgeClass: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200' };
  }
  if (scoreVal >= 0.65) {
    return { key: 'platinum', icon: '🟣', name: isFr ? 'Platine' : 'Platinum', badgeClass: 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200' };
  }
  if (scoreVal >= 0.45) {
    return { key: 'gold', icon: '🥇', name: isFr ? 'Or' : 'Gold', badgeClass: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200' };
  }
  if (scoreVal >= 0.25) {
    return { key: 'silver', icon: '🥈', name: isFr ? 'Argent' : 'Silver', badgeClass: 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200' };
  }
  return { key: 'bronze', icon: '🥉', name: 'Bronze', badgeClass: 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200' };
};

// Calcule l'XP d'une partie en normalisant les parties GeoGuessr (sur 25 000 pts)
const computeRecordXp = (r) => {
  const score = Number(r.score || 0);
  const maxScore = Number(r.max_score || 15);
  const mode = (r.mode || '').toLowerCase();

  if (mode.includes('geoguessr') || maxScore >= 1000) {
    const normalizedScore = Math.round((score / Math.max(1, maxScore)) * 20);
    return normalizedScore * 10 + 25;
  }
  return score * 10 + 25;
};

const isCurrentUser = (row) => {
  if (!currentUser.value) return false;
  const myId = currentUser.value.id || (currentUser.value.user && currentUser.value.user.id);
  if (myId && Number(row.user_id) === Number(myId)) return true;
  const myName = (currentUser.value.username || currentUser.value.name || currentUser.value.pseudo || '').toLowerCase();
  return myName && (row.username || '').toLowerCase() === myName;
};

const fetchLeaderboard = async () => {
  isLoading.value = true;
  try {
    const res = await fetch(`${API_URL}/api/leaderboard`);
    if (res.ok) {
      const data = await res.json();
      generalList.value = data.general || [];
      recordsList.value = data.records || [];
    }
  } catch (e) {
    console.error('Erreur chargement leaderboard:', e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const saved = localStorage.getItem('geolearn_user');
  if (saved) {
    try { currentUser.value = JSON.parse(saved); } catch (e) {}
  }
  fetchLeaderboard();
});

// Filtre par période (Tous les temps, Saison du mois en cours, 30 jours, Aujourd'hui)
const periodFilteredRecords = computed(() => {
  if (selectedPeriod.value === 'all') return recordsList.value;
  const now = new Date();

  if (selectedPeriod.value === 'season') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    return recordsList.value.filter(r => {
      if (!r.played_at) return true;
      return new Date(r.played_at).getTime() >= startOfMonth;
    });
  }

  const maxAgeMs = selectedPeriod.value === 'today' ? 24 * 3600 * 1000 : 30 * 24 * 3600 * 1000;
  return recordsList.value.filter(r => {
    if (!r.played_at) return true;
    const diff = now.getTime() - new Date(r.played_at).getTime();
    return diff <= maxAgeMs;
  });
});

// Classement actif
const activeRanking = computed(() => {
  const isFr = locale.value === 'fr';

  // Mode Général ("Tous les temps") avec correction automatique de l'inflation XP GeoGuessr
  if (activeTab.value === 'general' && selectedPeriod.value === 'all') {
    const correctedUsers = generalList.value.map((item) => {
      const userRecs = recordsList.value.filter(r => Number(r.user_id) === Number(item.user_id));
      const gamesCount = Number(item.games_played || userRecs.length || 0);
      let xp = Number(item.total_xp || 0);

      if (userRecs.length > 0 && userRecs.length === gamesCount) {
        xp = userRecs.reduce((sum, r) => sum + computeRecordXp(r), 0);
      } else {
        for (const r of userRecs) {
          const mode = (r.mode || '').toLowerCase();
          if (mode.includes('geoguessr') || Number(r.max_score) >= 1000) {
            const rawSqlXp = Number(r.score || 0) * 10 + 25;
            xp -= (rawSqlXp - computeRecordXp(r));
          }
        }
        if (gamesCount > 0 && xp > gamesCount * 2000) {
          xp = Math.round(xp / 1250) + gamesCount * 25;
        }
      }

      xp = Math.max(0, Math.round(xp));
      return {
        user_id: item.user_id,
        username: item.username,
        xp,
        games_played: gamesCount
      };
    });

    return correctedUsers
      .sort((a, b) => b.xp - a.xp)
      .map((item, idx) => {
        const lvl = Math.max(1, Math.floor(item.xp / 500) + 1);
        return {
          uniqueKey: `gen-${item.user_id}`,
          rank: idx + 1,
          user_id: item.user_id,
          username: item.username,
          rawMetric: item.xp,
          metricDisplay: `${item.xp.toLocaleString()} XP`,
          league: getLeague(item.xp, true),
          subText: isFr
            ? `Niveau ${lvl} • ${item.games_played} partie(s) jouée(s)`
            : `Level ${lvl} • ${item.games_played} game(s) played`
        };
      });
  }

  // Si mode Général filtré sur Saison du Mois, 30j ou Aujourd'hui
  if (activeTab.value === 'general') {
    const mapUser = new Map();
    for (const r of periodFilteredRecords.value) {
      const prev = mapUser.get(r.user_id) || { user_id: r.user_id, username: r.username, xp: 0, games: 0 };
      prev.xp += computeRecordXp(r);
      prev.games += 1;
      mapUser.set(r.user_id, prev);
    }
    return [...mapUser.values()]
      .sort((a, b) => b.xp - a.xp)
      .map((item, idx) => ({
        uniqueKey: `gen-per-${item.user_id}`,
        rank: idx + 1,
        user_id: item.user_id,
        username: item.username,
        rawMetric: item.xp,
        metricDisplay: `${item.xp.toLocaleString()} XP`,
        league: getLeague(item.xp, true),
        subText: isFr ? `${item.games} partie(s) sur la période` : `${item.games} game(s) in period`
      }));
  }

  const modeKeywords = {
    geoguessr: 'geoguessr',
    mystery: 'myst',
    flash60: 'flash',
    detective: 'enqu',
    mapclick: 'cliquez',
    world: 'monde',
    europe: 'europe',
    grid: 'grille',
    capitals: 'capitale',
    flags: 'qcm drapeaux',
    culture: 'culture'
  };
  const keyword = modeKeywords[activeTab.value] || '';

  const matchingRecords = periodFilteredRecords.value.filter(r =>
    (r.mode || '').toLowerCase().includes(keyword)
  );

  const bestPerUser = new Map();
  for (const rec of matchingRecords) {
    const existing = bestPerUser.get(rec.user_id);
    if (!existing || Number(rec.score) > Number(existing.score)) {
      bestPerUser.set(rec.user_id, rec);
    }
  }

  const sorted = [...bestPerUser.values()].sort((a, b) => Number(b.score) - Number(a.score));

  return sorted.map((item, idx) => {
    const sc = Number(item.score || 0);
    const mx = Math.max(1, Number(item.max_score || 15));
    const ratio = Math.min(1, sc / mx);
    return {
      uniqueKey: `${activeTab.value}-${item.user_id}`,
      rank: idx + 1,
      user_id: item.user_id,
      username: item.username,
      rawMetric: sc,
      metricDisplay: `${sc.toLocaleString()} / ${mx.toLocaleString()}`,
      league: getLeague(ratio, false),
      subText: `${item.mode} • ${Math.round(ratio * 100)}%`
    };
  });
});

// Vue d'ensemble des 5 Ligues avec nombre de joueurs dans chacune
const leagueTiersOverview = computed(() => {
  const isFr = locale.value === 'fr';
  const isGen = activeTab.value === 'general';
  const list = activeRanking.value;

  const countByKey = (k) => list.filter(r => r.league.key === k).length;

  return [
    {
      key: 'diamond',
      icon: '💎',
      name: isFr ? 'Diamant' : 'Diamond',
      requirement: isGen ? '8 500+ XP' : '85%+ score',
      count: countByKey('diamond')
    },
    {
      key: 'platinum',
      icon: '🟣',
      name: isFr ? 'Platine' : 'Platinum',
      requirement: isGen ? '6 500+ XP' : '65%+ score',
      count: countByKey('platinum')
    },
    {
      key: 'gold',
      icon: '🥇',
      name: isFr ? 'Or' : 'Gold',
      requirement: isGen ? '4 500+ XP' : '45%+ score',
      count: countByKey('gold')
    },
    {
      key: 'silver',
      icon: '🥈',
      name: isFr ? 'Argent' : 'Silver',
      requirement: isGen ? '2 500+ XP' : '25%+ score',
      count: countByKey('silver')
    },
    {
      key: 'bronze',
      icon: '🥉',
      name: 'Bronze',
      requirement: isFr ? 'Départ (<25%)' : 'Starter (<25%)',
      count: countByKey('bronze')
    }
  ];
});

const podiumPlayers = computed(() => activeRanking.value.slice(0, 3));

const filteredRanking = computed(() => {
  const q = playerSearch.value.trim().toLowerCase();
  return activeRanking.value.filter(r => {
    if (selectedLeagueFilter.value !== 'all' && r.league.key !== selectedLeagueFilter.value) {
      return false;
    }
    if (q && !(r.username || '').toLowerCase().includes(q)) {
      return false;
    }
    return true;
  });
});

const currentUserRank = computed(() =>
  activeRanking.value.find(r => isCurrentUser(r)) || null
);

const nextRankGapText = computed(() => {
  const me = currentUserRank.value;
  if (!me) return '';
  if (me.rank === 1) {
    return locale.value === 'fr'
      ? 'Vous êtes N°1 mondial de cette catégorie ! 👑'
      : 'You are #1 in the world in this category! 👑';
  }
  const abovePlayer = activeRanking.value.find(r => r.rank === me.rank - 1);
  if (!abovePlayer) return '';
  const diff = Math.max(1, abovePlayer.rawMetric - me.rawMetric + 1);
  const unit = activeTab.value === 'general' ? 'XP' : 'pts';
  return locale.value === 'fr'
    ? `Plus que ${diff.toLocaleString()} ${unit} pour dépasser ${abovePlayer.username} (#${abovePlayer.rank}) !`
    : `Only ${diff.toLocaleString()} ${unit} needed to overtake ${abovePlayer.username} (#${abovePlayer.rank})!`;
});

const openPlayerModal = (playerRow) => {
  inspectedPlayer.value = playerRow;
};

const getBestForUserAndKeyword = (userId, kw) => {
  const matches = recordsList.value.filter(
    r => Number(r.user_id) === Number(userId) && (r.mode || '').toLowerCase().includes(kw)
  );
  if (matches.length === 0) return { text: '—', num: -1 };
  const best = matches.reduce((a, b) => (Number(b.score) > Number(a.score) ? b : a), matches[0]);
  return {
    text: `${Number(best.score).toLocaleString()} / ${Number(best.max_score).toLocaleString()}`,
    num: Number(best.score)
  };
};

const headToHeadStats = computed(() => {
  if (!inspectedPlayer.value) return [];
  const theirId = inspectedPlayer.value.user_id;
  const myId = currentUser.value ? (currentUser.value.id || currentUser.value.user?.id) : null;
  const isFr = locale.value === 'fr';

  const modesToCompare = [
    { kw: 'geoguessr', icon: '🛰️', label: 'PinDrop' },
    { kw: 'myst', icon: '🧭', label: isFr ? 'Pays Mystère' : 'Mystery Country' },
    { kw: 'flash', icon: '⚡', label: 'QCM Flash 60s' },
    { kw: 'enqu', icon: '🕵️', label: isFr ? 'Enquête 5 Indices' : '5-Clue Detective' },
    { kw: 'cliquez', icon: '🖱️', label: isFr ? 'Cliquez Carte' : 'Map Click' },
    { kw: 'monde', icon: '🌍', label: isFr ? 'Défi Monde' : 'World Challenge' },
    { kw: 'europe', icon: '🇪🇺', label: isFr ? 'Défi Europe' : 'Europe Challenge' },
    { kw: 'grille', icon: '🏳️', label: isFr ? 'Grille Drapeaux' : 'Flag Grid' },
    { kw: 'capitale', icon: '🏛️', label: isFr ? 'QCM Capitales' : 'Capitals Quiz' },
    { kw: 'qcm drapeaux', icon: '🚩', label: isFr ? 'QCM Drapeaux' : 'Flags Quiz' },
    { kw: 'culture', icon: '🗣️', label: isFr ? 'QCM Culture' : 'Culture Quiz' }
  ];

  return modesToCompare.map(m => {
    const theirs = getBestForUserAndKeyword(theirId, m.kw);
    const mine = myId ? getBestForUserAndKeyword(myId, m.kw) : { text: '—', num: -1 };
    return {
      icon: m.icon,
      label: m.label,
      theirBest: theirs.text,
      theirNumeric: theirs.num,
      myBest: mine.text,
      myNumeric: mine.num
    };
  });
});

const headToHeadSummary = computed(() => {
  let myWins = 0;
  let theirWins = 0;
  for (const s of headToHeadStats.value) {
    if (s.myNumeric < 0 && s.theirNumeric < 0) continue;
    if (s.myNumeric > s.theirNumeric) myWins++;
    else if (s.theirNumeric > s.myNumeric) theirWins++;
  }
  return { myWins, theirWins };
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>