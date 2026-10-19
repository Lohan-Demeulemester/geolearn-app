<template>
  <div class="max-w-6xl mx-auto space-y-8">
    
    <!-- EN-TÊTE -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-500 mb-2">
          {{ locale === 'fr' ? 'Mes statistiques' : 'My Statistics' }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 transition-colors duration-500">
          {{ locale === 'fr' ? 'Suivez votre progression et analysez vos performances.' : 'Track your progress and analyze your performance.' }}
        </p>
      </div>

      <button
        type="button"
        @click="fetchScores"
        :disabled="isLoading"
        class="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-blue-500 transition cursor-pointer flex items-center gap-2 shadow-sm"
      >
        <i class="fas fa-sync-alt" :class="{ 'animate-spin': isLoading }"></i>
        {{ locale === 'fr' ? 'Actualiser' : 'Refresh' }}
      </button>
    </div>

    <!-- CARTES DE STATISTIQUES PRINCIPALES (KPI) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Parties jouées -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5">
        <div class="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl shrink-0">
          🎮
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ locale === 'fr' ? 'Parties jouées' : 'Games Played' }}
          </p>
          <strong class="text-3xl font-black text-gray-900 dark:text-white">
            {{ totalGames }}
          </strong>
        </div>
      </div>

      <!-- Score moyen (QCM) -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5">
        <div class="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl shrink-0">
          📈
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ locale === 'fr' ? 'Score moyen (QCM)' : 'Average Score (Quiz)' }}
          </p>
          <div class="flex items-baseline gap-1">
            <strong class="text-3xl font-black text-gray-900 dark:text-white">
              {{ averageQcmScore }}
            </strong>
            <span class="text-sm font-bold text-gray-400">/ 15</span>
          </div>
        </div>
      </div>

      <!-- Meilleur score (QCM) -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5">
        <div class="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl shrink-0">
          🏆
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            {{ locale === 'fr' ? 'Meilleur score (QCM)' : 'Best Score (Quiz)' }}
          </p>
          <div class="flex items-baseline gap-1">
            <strong class="text-3xl font-black text-gray-900 dark:text-white">
              {{ bestQcmScore }}
            </strong>
            <span class="text-sm font-bold text-gray-400">/ 15</span>
          </div>
        </div>
      </div>
    </div>

    <!-- GRAPHIQUE D'ÉVOLUTION + HISTORIQUE RÉCENT -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      
      <!-- COLONNE GAUCHE (2/3) : ÉVOLUTION DES SCORES QCM -->
      <div class="lg:col-span-2 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ locale === 'fr' ? 'Évolution des scores QCM' : 'QCM Score Progression' }}
          </h3>
          <span v-if="qcmChronological.length >= 2" class="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300">
            {{ locale === 'fr' ? `${qcmChronological.length} dernières parties` : `Last ${qcmChronological.length} games` }}
          </span>
        </div>

        <div v-if="qcmChronological.length < 2" class="h-64 rounded-2xl bg-gray-50 dark:bg-gray-900/60 flex items-center justify-center p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
          {{ locale === 'fr'
            ? 'Jouez au moins 2 parties de QCM pour voir votre graphique de progression.'
            : 'Play at least 2 QCM games to see your progression chart.' }}
        </div>

        <!-- Graphique SVG interactif -->
        <div v-else class="space-y-4">
          <div class="relative h-64 w-full bg-gray-50/70 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700/60">
            <svg viewBox="0 0 600 200" class="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#2563eb" stop-opacity="0.32" />
                  <stop offset="100%" stop-color="#2563eb" stop-opacity="0.0" />
                </linearGradient>
              </defs>

              <!-- Lignes de repère horizontales (0, 5, 10, 15) -->
              <g v-for="level in [0, 5, 10, 15]" :key="level">
                <line
                  x1="30"
                  :y1="180 - (level / 15) * 155"
                  x2="580"
                  :y2="180 - (level / 15) * 155"
                  stroke="currentColor"
                  class="text-gray-200 dark:text-gray-700"
                  stroke-dasharray="4 4"
                  stroke-width="1"
                />
                <text
                  x="5"
                  :y="184 - (level / 15) * 155"
                  class="text-[11px] fill-gray-400 font-semibold"
                >
                  {{ level }}
                </text>
              </g>

              <!-- Zone remplie sous la courbe -->
              <path :d="chartAreaPath" fill="url(#scoreAreaGrad)" />

              <!-- Courbe principale -->
              <polyline
                fill="none"
                stroke="#2563eb"
                stroke-width="3.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                :points="chartPointsString"
              />

              <!-- Points de chaque partie -->
              <g v-for="(pt, idx) in chartPoints" :key="idx">
                <circle
                  :cx="pt.x"
                  :cy="pt.y"
                  r="6"
                  class="fill-white dark:fill-gray-900 stroke-blue-600"
                  stroke-width="3"
                />
                <text
                  :x="pt.x"
                  :y="pt.y - 12"
                  text-anchor="middle"
                  class="text-[11px] font-bold fill-gray-700 dark:fill-gray-200"
                >
                  {{ pt.score }}/15
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      <!-- COLONNE DROITE (1/3) : HISTORIQUE RÉCENT -->
      <div class="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {{ locale === 'fr' ? 'Historique récent' : 'Recent History' }}
        </h3>

        <div v-if="scoresList.length === 0" class="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          {{ locale === 'fr' ? 'Aucune partie jouée pour le moment.' : 'No games played yet.' }}
        </div>

        <div v-else class="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          <div
            v-for="item in scoresList"
            :key="item.id"
            class="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-700/70 flex items-center justify-between gap-3"
          >
            <div class="min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-base">{{ getModeIcon(item.mode) }}</span>
                <strong class="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {{ translateMode(item.mode) }}
                </strong>
              </div>
              <p class="text-xs text-gray-400 dark:text-gray-500">
                {{ formatDate(item.played_at || item.created_at) }}
              </p>
            </div>

            <div
              class="px-3 py-1.5 rounded-xl font-extrabold text-sm shrink-0"
              :class="getScoreBadgeClass(item.score, item.max_score)"
            >
              {{ item.score }} / {{ item.max_score }}
            </div>
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

const scoresList = ref([]);
const isLoading = ref(false);

const fetchScores = async () => {
  const savedUser = localStorage.getItem('geolearn_user');
  if (!savedUser) return;

  let user = null;
  try {
    user = JSON.parse(savedUser);
  } catch (e) {
    return;
  }
  if (!user || !user.id) return;

  isLoading.value = true;
  try {
    // Essai 1 : route standard /api/scores/:userId
    let res = await fetch(`${API_URL}/api/scores/${user.id}`);
    
    // Essai 2 (fallback) : si le backend attend /api/scores?user_id=...
    if (!res.ok) {
      res = await fetch(`${API_URL}/api/scores?user_id=${user.id}`);
    }

    if (res.ok) {
      const data = await res.json();
      const rawArray = Array.isArray(data) ? data : (data.scores || []);
      // Tri du plus récent au plus ancien
      scoresList.value = rawArray.sort((a, b) => {
        const dA = new Date(a.played_at || a.created_at || 0).getTime();
        const dB = new Date(b.played_at || b.created_at || 0).getTime();
        return dB - dA || (b.id - a.id);
      });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des scores :', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchScores);

// Total des parties jouées tous modes confondus
const totalGames = computed(() => scoresList.value.length);

// Parties de type QCM (sur 15)
const qcmGames = computed(() =>
  scoresList.value.filter(s => Number(s.max_score) === 15 || (s.mode && s.mode.toLowerCase().includes('qcm')))
);

const averageQcmScore = computed(() => {
  if (qcmGames.value.length === 0) return 0;
  const sum = qcmGames.value.reduce((acc, cur) => acc + Number(cur.score || 0), 0);
  return (sum / qcmGames.value.length).toFixed(1).replace('.0', '');
});

const bestQcmScore = computed(() => {
  if (qcmGames.value.length === 0) return 0;
  return Math.max(...qcmGames.value.map(s => Number(s.score || 0)));
});

// 10 dernières parties QCM dans l'ordre chronologique pour le graphique
const qcmChronological = computed(() => {
  return [...qcmGames.value].slice(0, 10).reverse();
});

const chartPoints = computed(() => {
  const list = qcmChronological.value;
  if (list.length < 2) return [];
  const minX = 50;
  const maxX = 560;
  const stepX = (maxX - minX) / (list.length - 1);

  return list.map((item, index) => {
    const score = Math.min(15, Math.max(0, Number(item.score || 0)));
    const x = Math.round(minX + index * stepX);
    const y = Math.round(180 - (score / 15) * 155);
    return { x, y, score };
  });
});

const chartPointsString = computed(() =>
  chartPoints.value.map(p => `${p.x},${p.y}`).join(' ')
);

const chartAreaPath = computed(() => {
  const pts = chartPoints.value;
  if (pts.length < 2) return '';
  const first = pts[0];
  const last = pts[pts.length - 1];
  const lineCoords = pts.map(p => `L ${p.x} ${p.y}`).join(' ');
  return `M ${first.x} 180 ${lineCoords} L ${last.x} 180 Z`;
});

const getModeIcon = (mode = '') => {
  const m = mode.toLowerCase();
  if (m.includes('capitale')) return '🏛️';
  if (m.includes('grille')) return '🏳️';
  if (m.includes('drapeau')) return '🚩';
  if (m.includes('monde')) return '🌍';
  if (m.includes('europe') || m.includes('défi')) return '⏱️';
  return '🎯';
};

const translateMode = (mode = '') => {
  if (locale.value === 'fr') return mode;
  const map = {
    'QCM Capitales': 'Capitals Quiz',
    'QCM Drapeaux': 'Flags Quiz',
    'Grille Drapeaux': 'Flag Grid Challenge',
    'Défi Europe': 'Europe Challenge',
    'Défi Monde': 'World Challenge'
  };
  return map[mode] || mode;
};

const getScoreBadgeClass = (score, max) => {
  const ratio = max > 0 ? score / max : 0;
  if (ratio >= 0.75) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
  if (ratio >= 0.45) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
  return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>