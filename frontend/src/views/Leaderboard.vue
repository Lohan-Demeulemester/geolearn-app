<template>
  <div class="max-w-6xl mx-auto space-y-8 pb-12">

    <!-- EN-TÊTE DU CLASSEMENT -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <span class="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
          🌍 {{ locale === 'fr' ? 'Compétition Communautaire' : 'Community Competition' }}
        </span>
        <h2 class="text-3xl font-black text-gray-900 dark:text-white">
          {{ locale === 'fr' ? 'Classement Mondial (Leaderboard)' : 'World Leaderboard' }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          {{ locale === 'fr'
            ? 'Comparez vos records avec les meilleurs joueurs de GeoLearn sur chaque mode de jeu.'
            : 'Compare your records with the top GeoLearn players across every game mode.' }}
        </p>
      </div>

      <button
        type="button"
        @click="fetchLeaderboard"
        :disabled="isLoading"
        class="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-700 dark:text-gray-200 hover:border-blue-500 transition cursor-pointer flex items-center gap-2 shadow-xs"
      >
        <i class="fas fa-sync-alt" :class="{ 'animate-spin': isLoading }"></i>
        {{ locale === 'fr' ? 'Actualiser' : 'Refresh' }}
      </button>
    </div>

    <!-- BARRE D'ONGLETS DES MODES DE CLASSEMENT -->
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

    <!-- BANNIÈRE DE RANG DU JOUEUR CONNECTÉ -->
    <div
      v-if="currentUserRank"
      class="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl p-4 sm:p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-black text-xl">
          #{{ currentUserRank.rank }}
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-wider text-blue-100">
            {{ locale === 'fr' ? 'Votre position actuelle dans ce classement' : 'Your current position in this leaderboard' }}
          </p>
          <h3 class="text-lg font-black">
            {{ currentUserRank.username }} — {{ currentUserRank.metricDisplay }}
          </h3>
        </div>
      </div>

      <router-link
        to="/quiz"
        class="px-4 py-2 rounded-xl bg-white text-blue-700 font-extrabold text-xs sm:text-sm hover:bg-blue-50 transition shrink-0"
      >
        🚀 {{ locale === 'fr' ? 'Améliorer mon score' : 'Improve my score' }}
      </router-link>
    </div>

    <!-- ========================================================= -->
    <!-- PODIUM TOP 3 (OR, ARGENT, BRONZE)                         -->
    <!-- ========================================================= -->
    <div v-if="podiumPlayers.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
      
      <!-- 2e Place (Argent) -->
      <div
        v-if="podiumPlayers[1]"
        class="order-2 md:order-1 bg-white dark:bg-gray-800 rounded-3xl p-6 text-center border-2 border-slate-300 dark:border-slate-600 shadow-md relative"
      >
        <div class="text-4xl mb-2">🥈</div>
        <div class="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-black text-xl flex items-center justify-center mx-auto mb-3">
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
        class="order-1 md:order-2 bg-gradient-to-b from-amber-50/90 to-white dark:from-amber-950/30 dark:to-gray-800 rounded-3xl p-8 text-center border-2 border-amber-400 shadow-xl md:-translate-y-3 relative"
      >
        <span class="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400 text-amber-950">
          #1 Champion
        </span>
        <div class="text-5xl mb-2">👑</div>
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
        class="order-3 bg-white dark:bg-gray-800 rounded-3xl p-6 text-center border-2 border-orange-300 dark:border-orange-700/70 shadow-md relative"
      >
        <div class="text-4xl mb-2">🥉</div>
        <div class="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 font-black text-xl flex items-center justify-center mx-auto mb-3">
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
    <!-- TABLEAU COMPLET DU CLASSEMENT                             -->
    <!-- ========================================================= -->
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div class="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 class="text-lg font-black text-gray-900 dark:text-white">
          {{ activeTabLabel }}
        </h3>

        <input
          v-model="playerSearch"
          type="text"
          :placeholder="locale === 'fr' ? 'Rechercher un joueur...' : 'Search a player...'"
          class="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      <div v-if="filteredRanking.length === 0" class="p-12 text-center text-gray-500 dark:text-gray-400 text-sm">
        {{ locale === 'fr' ? 'Aucun score enregistré pour ce mode pour le moment. Soyez le premier !' : 'No scores recorded for this mode yet. Be the first!' }}
      </div>

      <div v-else class="divide-y divide-gray-100 dark:divide-gray-700/70">
        <div
          v-for="row in filteredRanking"
          :key="row.uniqueKey"
          class="p-4 sm:px-6 flex items-center justify-between gap-4 transition-colors"
          :class="isCurrentUser(row)
            ? 'bg-blue-50/80 dark:bg-blue-950/40'
            : 'hover:bg-gray-50 dark:hover:bg-gray-700/40'"
        >
          <!-- Rang + Avatar + Nom -->
          <div class="flex items-center gap-4 min-w-0">
            <div
              class="w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center shrink-0"
              :class="[
                row.rank === 1 ? 'bg-amber-400 text-amber-950' : '',
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
              <div class="flex items-center gap-2">
                <strong class="font-bold text-gray-900 dark:text-white truncate">
                  {{ row.username }}
                </strong>
                <span
                  v-if="isCurrentUser(row)"
                  class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-600 text-white"
                >
                  {{ locale === 'fr' ? 'Vous' : 'You' }}
                </span>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ row.subText }}
              </p>
            </div>
          </div>

          <!-- Score / XP -->
          <div class="text-right shrink-0">
            <span class="px-3.5 py-1.5 rounded-xl font-black text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
              {{ row.metricDisplay }}
            </span>
          </div>
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
const playerSearch = ref('');
const isLoading = ref(false);

const generalList = ref([]);
const recordsList = ref([]);
const currentUser = ref(null);

const tabs = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'general', icon: '👑', label: isFr ? 'Général (XP)' : 'Overall (XP)' },
    { id: 'world', icon: '🌍', label: isFr ? 'Défi Monde (196)' : 'World Challenge (196)' },
    { id: 'europe', icon: '🇪🇺', label: isFr ? 'Défi Europe (47)' : 'Europe Challenge (47)' },
    { id: 'grid', icon: '🏳️', label: isFr ? 'Grille Drapeaux' : 'Flag Grid' },
    { id: 'capitals', icon: '🏛️', label: isFr ? 'QCM Capitales' : 'Capitals Quiz' },
    { id: 'flags', icon: '🚩', label: isFr ? 'QCM Drapeaux' : 'Flags Quiz' }
  ];
});

const activeTabLabel = computed(() => {
  const found = tabs.value.find(t => t.id === activeTab.value);
  return found ? found.label : '';
});

const getInitials = (name = '') => {
  const clean = (name || 'J').trim();
  return clean.slice(0, 2).toUpperCase();
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

// Construit le classement selon l'onglet actif (meilleur score unique par joueur)
const activeRanking = computed(() => {
  const isFr = locale.value === 'fr';

  if (activeTab.value === 'general') {
    return generalList.value.map((item, idx) => {
      const xp = Number(item.total_xp || 0);
      const lvl = Math.max(1, Math.floor(xp / 500) + 1);
      return {
        uniqueKey: `gen-${item.user_id}`,
        rank: idx + 1,
        user_id: item.user_id,
        username: item.username,
        metricDisplay: `${xp.toLocaleString()} XP`,
        subText: isFr
          ? `Niveau ${lvl} • ${item.games_played} partie(s) jouée(s)`
          : `Level ${lvl} • ${item.games_played} game(s) played`
      };
    });
  }

  // Filtrage par mode de jeu en gardant le meilleur record de chaque joueur
  const modeKeywords = {
    world: 'monde',
    europe: 'europe',
    grid: 'grille',
    capitals: 'capitale',
    flags: 'qcm drapeaux'
  };
  const keyword = modeKeywords[activeTab.value] || '';

  const matchingRecords = recordsList.value.filter(r =>
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

  return sorted.map((item, idx) => ({
    uniqueKey: `${activeTab.value}-${item.user_id}`,
    rank: idx + 1,
    user_id: item.user_id,
    username: item.username,
    metricDisplay: `${item.score} / ${item.max_score}`,
    subText: `${item.mode} • ${Math.round((item.score / Math.max(1, item.max_score)) * 100)}%`
  }));
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
</script>