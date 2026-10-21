<template>
  <div class="max-w-6xl mx-auto space-y-8 pb-12">

    <!-- ========================================================= -->
    <!-- EN-TÊTE DU CLASSEMENT + FILTRE TEMPOREL + ACTUALISER      -->
    <!-- ========================================================= -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <span class="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
          🌍 {{ locale === 'fr' ? 'Compétition Communautaire Officielle' : 'Official Community Competition' }}
        </span>
        <h2 class="text-3xl font-black text-gray-900 dark:text-white">
          {{ locale === 'fr' ? 'Classement Mondial (Leaderboard)' : 'World Leaderboard' }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
          {{ locale === 'fr'
            ? 'Comparez vos records avec les meilleurs joueurs sur les 11 modes et cliquez sur un joueur pour lancer un Face-à-Face.'
            : 'Compare your records with top players across all 11 modes and click any player to view a Head-to-Head comparison.' }}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
        <!-- Sélecteur de période ( valable sur les modes par record ) -->
        <div class="bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center text-xs font-bold">
          <button
            v-for="period in periodOptions"
            :key="period.id"
            type="button"
            @click="selectedPeriod = period.id"
            class="px-3 py-1.5 rounded-lg transition cursor-pointer"
            :class="selectedPeriod === period.id
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
          >
            {{ period.label }}
          </button>
        </div>

        <button
          type="button"
          @click="fetchLeaderboard"
          :disabled="isLoading"
          class="px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200 hover:border-blue-500 transition cursor-pointer flex items-center gap-2 shadow-2xs"
        >
          <i class="fas fa-sync-alt" :class="{ 'animate-spin': isLoading }"></i>
          <span>{{ locale === 'fr' ? 'Actualiser' : 'Refresh' }}</span>
        </button>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- CARTES KPI DE LA COMMUNAUTÉ                               -->
    <!-- ========================================================= -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-2xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl shrink-0">
          👥
        </div>
        <div>
          <span class="text-xs font-bold text-gray-400 block">{{ locale === 'fr' ? 'Joueurs classés' : 'Ranked Players' }}</span>
          <strong class="text-2xl font-black text-gray-900 dark:text-white">{{ generalList.length }}</strong>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-2xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl shrink-0">
          🎮
        </div>
        <div>
          <span class="text-xs font-bold text-gray-400 block">{{ locale === 'fr' ? 'Parties disputées' : 'Total Games' }}</span>
          <strong class="text-2xl font-black text-gray-900 dark:text-white">{{ totalCommunityGames.toLocaleString() }}</strong>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-2xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl shrink-0">
          👑
        </div>
        <div class="min-w-0">
          <span class="text-xs font-bold text-gray-400 block">{{ locale === 'fr' ? ' N°1 Actuel' : 'Current #1' }}</span>
          <strong class="text-base sm:text-lg font-black text-gray-900 dark:text-white truncate block">
            {{ activeRanking[0] ? activeRanking[0].username : '—' }}
          </strong>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-2xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl shrink-0">
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
    <!-- BARRE DES 11 ONGLETS DE CLASSEMENT                        -->
    <!-- ========================================================= -->
    <div class="bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-2 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        @click="activeTab = tab.id"
        class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer whitespace-nowrap flex items-center gap-2"
        :class="activeTab === tab.id
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
      >
        <span>{{ tab.icon }}</span>
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- ========================================================= -->
    <!-- BANNIÈRE DE RANG DU JOUEUR CONNECTÉ + ÉCART RANG SUIVANT  -->
    <!-- ========================================================= -->
    <div
      v-if="currentUserRank"
      class="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white rounded-3xl p-5 sm:p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4"
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
    <div v-if="podiumPlayers.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
      
      <!-- 2e Place (Argent) -->
      <div
        v-if="podiumPlayers[1]"
        @click="openPlayerModal(podiumPlayers[1])"
        class="order-2 md:order-1 bg-white dark:bg-gray-800 rounded-3xl p-6 text-center border-2 border-slate-300 dark:border-slate-600 shadow-md hover:-translate-y-1 transition-all cursor-pointer relative"
      >
        <span class="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
          {{ podiumPlayers[1].league.icon }} {{ podiumPlayers[1].league.name }}
        </span>
        <div class="text-4xl mb-2 mt-2">🥈</div>
        <div class="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-xs">
          {{ getInitials(podiumPlayers[1].username) }}
        </div>
        <h3 class="text-lg font-black text-gray-900 dark:text-white truncate">
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
        class="order-1 md:order-2 bg-gradient-to-b from-amber-50/90 to-white dark:from-amber-950/30 dark:to-gray-800 rounded-3xl p-8 text-center border-2 border-amber-400 shadow-xl md:-translate-y-3 hover:-translate-y-4 transition-all cursor-pointer relative"
      >
        <span class="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200">
          {{ podiumPlayers[0].league.icon }} {{ podiumPlayers[0].league.name }}
        </span>
        <span class="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400 text-amber-950">
          #1 Champion
        </span>
        <div class="text-5xl mb-2 mt-2">👑</div>
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 text-white font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
          {{ getInitials(podiumPlayers[0].username) }}
        </div>
        <h3 class="text-xl font-black text-gray-900 dark:text-white truncate">
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
        class="order-3 bg-white dark:bg-gray-800 rounded-3xl p-6 text-center border-2 border-orange-300 dark:border-orange-700/70 shadow-md hover:-translate-y-1 transition-all cursor-pointer relative"
      >
        <span class="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200">
          {{ podiumPlayers[2].league.icon }} {{ podiumPlayers[2].league.name }}
        </span>
        <div class="text-4xl mb-2 mt-2">🥉</div>
        <div class="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-xs">
          {{ getInitials(podiumPlayers[2].username) }}
        </div>
        <h3 class="text-lg font-black text-gray-900 dark:text-white truncate">
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
        <div>
          <h3 class="text-lg font-black text-gray-900 dark:text-white">
            {{ activeTabLabel }}
          </h3>
          <p class="text-xs text-gray-400">
            {{ locale === 'fr' ? 'Cliquez sur un joueur pour comparer vos profils en Face-à-Face' : 'Click any player to compare profiles Head-to-Head' }}
          </p>
        </div>

        <div class="relative w-full sm:w-64">
          <i class="fas fa-search absolute left-3.5 top-3 text-gray-400 text-xs"></i>
          <input
            v-model="playerSearch"
            type="text"
            :placeholder="locale === 'fr' ? 'Rechercher un joueur...' : 'Search a player...'"
            class="w-full pl-9 pr-8 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
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
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-gray-700 space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center">
              {{ getInitials(inspectedPlayer.username) }}
            </div>
            <div>
              <span class="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                ⚔️ {{ locale === 'fr' ? 'Fiche & Face-à-Face' : 'Player Card & Head-to-Head' }}
              </span>
              <h3 class="text-2xl font-black text-gray-900 dark:text-white">
                {{ inspectedPlayer.username }}
              </h3>
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

        <!-- Comparatif des records par mode -->
        <div class="space-y-2.5">
          <div class="grid grid-cols-3 text-xs font-extrabold uppercase text-gray-400 px-3 pb-1">
            <span>Mode</span>
            <span class="text-center text-blue-600 dark:text-blue-400">{{ inspectedPlayer.username }}</span>
            <span class="text-right text-emerald-600 dark:text-emerald-400">{{ locale === 'fr' ? 'Vous' : 'You' }}</span>
          </div>

          <div
            v-for="comp in headToHeadStats"
            :key="comp.label"
            class="grid grid-cols-3 items-center bg-gray-50 dark:bg-gray-900/70 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700/70 text-xs sm:text-sm"
          >
            <span class="font-bold text-gray-700 dark:text-gray-300 truncate">{{ comp.icon }} {{ comp.label }}</span>
            <strong class="text-center font-black text-gray-900 dark:text-white">{{ comp.theirBest }}</strong>
            <strong
              class="text-right font-black"
              :class="comp.myNumeric >= comp.theirNumeric ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500'"
            >
              {{ comp.myBest }}
            </strong>
          </div>
        </div>

        <div class="flex justify-end pt-2">
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
const selectedPeriod = ref('all'); // 'all' | 'month' | 'today'
const playerSearch = ref('');
const isLoading = ref(false);

const generalList = ref([]);
const recordsList = ref([]);
const currentUser = ref(null);
const inspectedPlayer = ref(null);

const periodOptions = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'all', label: isFr ? 'Tous les temps' : 'All-Time' },
    { id: 'month', label: isFr ? '30 jours' : '30 Days' },
    { id: 'today', label: isFr ? 'Aujourd\'hui' : 'Today' }
  ];
});

// Les 11 Onglets complets (Aucun mode oublié !)
const tabs = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'general', icon: '👑', label: isFr ? 'Général (XP)' : 'Overall (XP)' },
    { id: 'geoguessr', icon: '📍', label: 'GeoGuessr (25 000)' },
    { id: 'mystery', icon: '🧭', label: isFr ? 'Pays Mystère' : 'Mystery Country' },
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
    return { icon: '💎', name: isFr ? 'Diamant' : 'Diamond', badgeClass: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200' };
  }
  if (scoreVal >= 0.65) {
    return { icon: '🟣', name: isFr ? 'Platine' : 'Platinum', badgeClass: 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200' };
  }
  if (scoreVal >= 0.45) {
    return { icon: '🥇', name: isFr ? 'Or' : 'Gold', badgeClass: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200' };
  }
  if (scoreVal >= 0.25) {
    return { icon: '🥈', name: isFr ? 'Argent' : 'Silver', badgeClass: 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200' };
  }
  return { icon: '🥉', name: isFr ? 'Bronze' : 'Bronze', badgeClass: 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200' };
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

// Filtre par période (Tous les temps, 30 jours, Aujourd'hui)
const periodFilteredRecords = computed(() => {
  if (selectedPeriod.value === 'all') return recordsList.value;
  const now = Date.now();
  const maxAgeMs = selectedPeriod.value === 'today' ? 24 * 3600 * 1000 : 30 * 24 * 3600 * 1000;
  return recordsList.value.filter(r => {
    if (!r.played_at) return true;
    const diff = now - new Date(r.played_at).getTime();
    return diff <= maxAgeMs;
  });
});

// Classement actif
const activeRanking = computed(() => {
  const isFr = locale.value === 'fr';

  if (activeTab.value === 'general' && selectedPeriod.value === 'all') {
    return generalList.value.map((item, idx) => {
      const xp = Number(item.total_xp || 0);
      const lvl = Math.max(1, Math.floor(xp / 500) + 1);
      return {
        uniqueKey: `gen-${item.user_id}`,
        rank: idx + 1,
        user_id: item.user_id,
        username: item.username,
        rawMetric: xp,
        metricDisplay: `${xp.toLocaleString()} XP`,
        league: getLeague(xp, true),
        subText: isFr
          ? `Niveau ${lvl} • ${item.games_played} partie(s) jouée(s)`
          : `Level ${lvl} • ${item.games_played} game(s) played`
      };
    });
  }

  // Si mode Général filtré sur 30j ou Aujourd'hui, on recalcule l'XP sur la période
  if (activeTab.value === 'general') {
    const mapUser = new Map();
    for (const r of periodFilteredRecords.value) {
      const prev = mapUser.get(r.user_id) || { user_id: r.user_id, username: r.username, xp: 0, games: 0 };
      prev.xp += Number(r.score || 0) * 10 + 25;
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
    const ratio = sc / mx;
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

const podiumPlayers = computed(() => activeRanking.value.slice(0, 3));

const filteredRanking = computed(() => {
  const q = playerSearch.value.trim().toLowerCase();
  if (!q) return activeRanking.value;
  return activeRanking.value.filter(r => (r.username || '').toLowerCase().includes(q));
});

const currentUserRank = computed(() =>
  activeRanking.value.find(r => isCurrentUser(r)) || null
);

// Calcul de l'écart exact avec le joueur situé juste devant nous
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

// Face-à-Face (Modale de comparaison entre le joueur cliqué et l'utilisateur connecté)
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
    { kw: 'geoguessr', icon: '📍', label: 'GeoGuessr' },
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
</script>