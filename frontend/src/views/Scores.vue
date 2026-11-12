<template>
  <div class="scores-experience max-w-[1320px] mx-auto px-2 sm:px-6 pb-20 space-y-8">

    <!-- ========================================================= -->
    <!-- 1. EN-TÊTE & SÉLECTEUR DE CALCUL (QCM /15 VS NORMALISÉ)   -->
    <!-- ========================================================= -->
    <header class="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-[#090E1A]/85 backdrop-blur-2xl p-5 sm:p-7 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="space-y-1">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-600 dark:text-sky-400 font-mono text-[11px] font-bold uppercase tracking-wider">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{{ locale === 'fr' ? 'TÉLÉMÉTRIE & PERFORMANCES' : 'TELEMETRY & PERFORMANCE' }}</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {{ t('scores.title') }}
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {{ t('scores.subtitle') }}
        </p>
      </div>

      <!-- Bascule : Uniquement QCM basiques sur 15 vs Tous les scores ramenés sur 15 -->
      <div
        v-if="isLoggedIn && rawScores.length > 0"
        class="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-slate-200/70 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 self-start lg:self-auto"
      >
        <button
          type="button"
          @click="scoreCalcMode = 'strict15'"
          class="px-3.5 py-2 rounded-full text-xs font-bold transition cursor-pointer"
          :class="scoreCalcMode === 'strict15'
            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
        >
          {{ locale === 'fr' ? 'QCM Classiques (/15)' : 'Classic QCMs (/15)' }}
        </button>
        <button
          type="button"
          @click="scoreCalcMode = 'normalized15'"
          class="px-3.5 py-2 rounded-full text-xs font-bold transition cursor-pointer"
          :class="scoreCalcMode === 'normalized15'
            ? 'bg-sky-500 text-slate-950 font-black shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
        >
          {{ locale === 'fr' ? 'Tous ramenés sur 15' : 'All Normalized (/15)' }}
        </button>
      </div>
    </header>

    <!-- ========================================================= -->
    <!-- 2. ÉTAT NON CONNECTÉ                                      -->
    <!-- ========================================================= -->
    <div
      v-if="!isLoggedIn"
      class="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-10 sm:p-14 text-center max-w-xl mx-auto shadow-2xl space-y-5"
    >
      <div class="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/25 text-sky-400 mx-auto flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
        {{ t('scores.login_required') }}
      </h2>
      <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        {{ t('scores.login_desc') }}
      </p>
      <router-link
        to="/profil"
        class="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs sm:text-sm transition shadow-lg shadow-sky-500/20"
      >
        <span>{{ t('scores.login_btn') }}</span>
        <span>→</span>
      </router-link>
    </div>

    <!-- ========================================================= -->
    <!-- 3. CHARGEMENT                                             -->
    <!-- ========================================================= -->
    <div
      v-else-if="loading"
      class="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#090E1A]/80 p-12 text-center font-mono text-xs text-slate-400"
    >
      {{ t('scores.loading') }}
    </div>

    <!-- ========================================================= -->
    <!-- 4. TABLEAU DE BORD DES SCORES                             -->
    <!-- ========================================================= -->
    <template v-else>

      <!-- A. 4 CARTES KPI PRINCIPALES (GARANTIES SUR /15) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Parties jouées -->
        <div class="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-xl p-5 flex items-center gap-4 shadow-lg">
          <div class="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/25 text-sky-400 flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div class="min-w-0">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 block truncate">
              {{ t('scores.kpi_games') }}
            </span>
            <div class="flex items-baseline gap-2 mt-0.5">
              <strong class="font-mono text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {{ activeDatasetOn15.length }}
              </strong>
              <span v-if="scoreCalcMode === 'strict15'" class="font-mono text-[11px] text-slate-400">
                / {{ rawScores.length }} total
              </span>
            </div>
          </div>
        </div>

        <!-- Score Moyen (/15) -->
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
              {{ scoreCalcMode === 'strict15' ? t('scores.kpi_avg') : (locale === 'fr' ? 'Moyenne globale (/15)' : 'Global Avg (/15)') }}
            </span>
            <strong class="font-mono text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5 block">
              {{ averageScoreOn15 }} <span class="text-sm font-bold text-slate-400">/ 15</span>
            </strong>
          </div>
        </div>

        <!-- Meilleur Score (/15 - Corrigé : ne dépasse jamais 15/15) -->
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
              {{ scoreCalcMode === 'strict15' ? t('scores.kpi_best') : (locale === 'fr' ? 'Meilleur score (/15)' : 'Best Score (/15)') }}
            </span>
            <strong class="font-mono text-2xl sm:text-3xl font-black text-emerald-500 dark:text-emerald-400 mt-0.5 block">
              {{ bestScoreOn15 }} <span class="text-sm font-bold text-slate-400">/ 15</span>
            </strong>
          </div>
        </div>

        <!-- Précision moyenne (%) -->
        <div class="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-xl p-5 flex items-center gap-4 shadow-lg">
          <div class="w-12 h-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/25 text-fuchsia-400 flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <div class="min-w-0">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 block truncate">
              {{ locale === 'fr' ? 'Taux de réussite' : 'Accuracy Rate' }}
            </span>
            <strong class="font-mono text-2xl sm:text-3xl font-black text-sky-500 dark:text-sky-400 mt-0.5 block">
              {{ averageAccuracyPct }}%
            </strong>
          </div>
        </div>
      </div>

      <!-- B. GRAPHIQUE D'ÉVOLUTION SUR /15 & HISTORIQUE RÉCENT -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        <!-- Colonne Gauche (7 cols) : Courbe d'évolution sur 15 -->
        <section class="lg:col-span-7 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-5 sm:p-7 shadow-xl space-y-5">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {{ scoreCalcMode === 'strict15'
                  ? t('scores.chart_title')
                  : (locale === 'fr' ? 'Évolution des scores (ramenés sur 15)' : 'Score Progression (normalized /15)') }}
              </h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {{ scoreCalcMode === 'strict15'
                  ? (locale === 'fr' ? 'Inclut uniquement vos QCM classiques notés sur 15 questions' : 'Includes only classic 15-question QCMs')
                  : (locale === 'fr' ? 'Toutes vos parties converties proportionnellement sur une échelle de 0 à 15' : 'All sessions scaled proportionally from 0 to 15') }}
              </p>
            </div>

            <span class="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.06] font-mono text-xs font-bold text-slate-600 dark:text-slate-300">
              {{ chartPoints.length }} {{ t('scores.last_games') }}
            </span>
          </div>

          <!-- Zone du Graphique SVG (/15) -->
          <div v-if="chartPoints.length > 0" class="rounded-2xl bg-slate-950/95 border border-white/[0.07] p-4 sm:p-6">
            <svg viewBox="0 0 600 230" class="w-full h-52 sm:h-60 overflow-visible">
              <defs>
                <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.42" />
                  <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0" />
                </linearGradient>
              </defs>

              <!-- Lignes de repère horizontales (0, 5, 10, 15) -->
              <g v-for="lvl in [0, 5, 10, 15]" :key="'grid-' + lvl">
                <line
                  x1="36"
                  :y1="getYCoord(lvl)"
                  x2="580"
                  :y2="getYCoord(lvl)"
                  stroke="rgba(148, 163, 184, 0.14)"
                  stroke-dasharray="4 4"
                  stroke-width="1"
                />
                <text
                  x="10"
                  :y="getYCoord(lvl) + 4"
                  fill="#64748b"
                  font-size="11"
                  font-family="JetBrains Mono, monospace"
                  font-weight="700"
                >
                  {{ lvl }}
                </text>
              </g>

              <!-- Aire sous la courbe -->
              <path
                v-if="chartPoints.length > 1"
                :d="areaPath"
                fill="url(#scoreAreaGrad)"
              />

              <!-- Ligne de progression -->
              <polyline
                v-if="chartPoints.length > 1"
                fill="none"
                stroke="#38bdf8"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                :points="linePoints"
              />

              <!-- Points de données (/15) -->
              <g
                v-for="(pt, idx) in chartPoints"
                :key="'pt-' + idx"
                class="cursor-pointer group"
              >
                <circle
                  :cx="pt.x"
                  :cy="pt.y"
                  r="5.5"
                  fill="#090e1a"
                  stroke="#38bdf8"
                  stroke-width="3"
                />
                <text
                  :x="pt.x"
                  :y="pt.y - 12"
                  text-anchor="middle"
                  fill="#f8fafc"
                  font-size="11"
                  font-family="JetBrains Mono, monospace"
                  font-weight="700"
                >
                  {{ pt.scoreOn15 }}/15
                </text>
              </g>
            </svg>
          </div>

          <div
            v-else
            class="rounded-2xl border border-dashed border-slate-200 dark:border-white/10 p-10 text-center text-xs text-slate-400"
          >
            {{ t('scores.no_qcm_chart') }}
          </div>

          <!-- Synthèse par type de jeu (ramenée sur 15) -->
          <div v-if="modeBreakdown.length > 0" class="pt-4 border-t border-slate-200/70 dark:border-white/10 space-y-3">
            <h3 class="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
              {{ locale === 'fr' ? 'MOYENNE PAR MODE (RAMENÉE SUR 15)' : 'AVERAGE BY MODE (NORMALIZED /15)' }}
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div
                v-for="m in modeBreakdown"
                :key="m.mode"
                class="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] space-y-1.5"
              >
                <div class="flex items-center justify-between text-xs">
                  <strong class="font-bold text-slate-800 dark:text-slate-200 truncate">{{ m.mode }}</strong>
                  <span class="font-mono font-black text-sky-500">{{ m.avgOn15 }} / 15</span>
                </div>
                <div class="h-1.5 w-full rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400"
                    :style="{ width: `${Math.round((m.avgOn15 / 15) * 100)}%` }"
                  ></div>
                </div>
                <div class="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>{{ m.count }} {{ locale === 'fr' ? 'partie(s)' : 'game(s)' }}</span>
                  <span>Max : {{ m.bestOn15 }}/15</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Colonne Droite (5 cols) : Historique récent avec filtre -->
        <section class="lg:col-span-5 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-5 sm:p-7 shadow-xl space-y-5">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h2 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {{ t('scores.recent_title') }}
            </h2>

            <div class="flex items-center gap-1 p-1 rounded-full bg-slate-100 dark:bg-white/[0.05]">
              <button
                type="button"
                @click="historyFilter = 'all'"
                class="px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer"
                :class="historyFilter === 'all' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950' : 'text-slate-500'"
              >
                {{ locale === 'fr' ? 'Tous' : 'All' }}
              </button>
              <button
                type="button"
                @click="historyFilter = 'qcm15'"
                class="px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer"
                :class="historyFilter === 'qcm15' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950' : 'text-slate-500'"
              >
                QCM /15
              </button>
            </div>
          </div>

          <div v-if="filteredHistory.length > 0" class="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
            <div
              v-for="item in filteredHistory"
              :key="item.id || item.created_at"
              class="p-3.5 rounded-2xl border border-slate-200/70 dark:border-white/[0.07] bg-slate-50/70 dark:bg-white/[0.02] flex items-center justify-between gap-3"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" :class="getBadgeBgClass(item.scoreOn15)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div class="min-w-0">
                  <strong class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block truncate">
                    {{ formatModeLabel(item.mode) }}
                  </strong>
                  <span class="text-[11px] text-slate-400 block">
                    {{ formatDate(item.created_at) }}
                  </span>
                </div>
              </div>

              <!-- Score ramené sur 15 + score brut en sous-texte si mode différent de 15 -->
              <div class="text-right shrink-0">
                <span
                  class="inline-block px-3 py-1 rounded-full font-mono text-xs font-black border"
                  :class="getBadgeBgClass(item.scoreOn15)"
                >
                  {{ item.scoreOn15 }} / 15
                </span>
                <span
                  v-if="!item.isClassic15"
                  class="block font-mono text-[10px] text-slate-400 mt-0.5"
                >
                  ({{ formatRawScore(item) }})
                </span>
              </div>
            </div>
          </div>

          <div v-else class="p-8 text-center text-xs text-slate-400">
            {{ t('scores.empty_history') }}
          </div>
        </section>

      </div>

    </template>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const API_URL = 'https://geolearn-backend-bj65.onrender.com';

const isLoggedIn = ref(false);
const loading = ref(true);
const rawScores = ref([]);

// 'strict15' = uniquement les QCM basiques sur 15 | 'normalized15' = tous les modes ramenés sur 15
const scoreCalcMode = ref('strict15');
const historyFilter = ref('all');

// Détecte si une partie est un vrai QCM classique sur 15 (exclut "QCM Flash 60s")
const isClassicQcm15 = (s) => {
  const modeStr = (s.mode || '').toLowerCase();
  const max = Number(s.max_score);
  return max === 15 && !modeStr.includes('flash');
};

// Convertit n'importe quel score (Worldle /6, Enquête /25, Sprint 60s, Carte /47, PinDrop /25000) sur 15 (plafonné à 15)
const normalizeScoreTo15 = (s) => {
  const raw = Math.max(0, Number(s.score) || 0);
  const max = Math.max(1, Number(s.max_score) || 15);
  if (isClassicQcm15(s)) {
    return Math.min(15, Math.round(raw));
  }
  const scaled = (raw / max) * 15;
  return Math.min(15, Math.round(scaled * 10) / 10);
};

const enrichedScores = computed(() =>
  rawScores.value.map((s) => ({
    ...s,
    isClassic15: isClassicQcm15(s),
    scoreOn15: normalizeScoreTo15(s)
  }))
);

// Jeu de données actif selon le bouton choisi en haut
const activeDatasetOn15 = computed(() => {
  if (scoreCalcMode.value === 'strict15') {
    return enrichedScores.value.filter((s) => s.isClassic15);
  }
  return enrichedScores.value;
});

const bestScoreOn15 = computed(() => {
  if (!activeDatasetOn15.value.length) return 0;
  return Math.max(...activeDatasetOn15.value.map((s) => s.scoreOn15));
});

const averageScoreOn15 = computed(() => {
  if (!activeDatasetOn15.value.length) return 0;
  const sum = activeDatasetOn15.value.reduce((acc, s) => acc + s.scoreOn15, 0);
  return (sum / activeDatasetOn15.value.length).toFixed(1);
});

const averageAccuracyPct = computed(() => {
  if (!activeDatasetOn15.value.length) return 0;
  const avg15 = parseFloat(averageScoreOn15.value) || 0;
  return Math.min(100, Math.round((avg15 / 15) * 100));
});

// =========================================================
// GRAPHIQUE SVG (10 DERNIÈRES PARTIES SUR /15)
// =========================================================
const getYCoord = (valOn15) => {
  const clamped = Math.max(0, Math.min(15, Number(valOn15) || 0));
  return 195 - (clamped / 15) * 155;
};

const chartPoints = computed(() => {
  const recent = [...activeDatasetOn15.value].slice(0, 10).reverse();
  if (!recent.length) return [];
  const startX = 65;
  const endX = 560;
  const stepX = recent.length > 1 ? (endX - startX) / (recent.length - 1) : 0;

  return recent.map((s, idx) => ({
    x: recent.length === 1 ? 310 : Math.round(startX + idx * stepX),
    y: Math.round(getYCoord(s.scoreOn15)),
    scoreOn15: s.scoreOn15,
    mode: s.mode
  }));
});

const linePoints = computed(() =>
  chartPoints.value.map((p) => `${p.x},${p.y}`).join(' ')
);

const areaPath = computed(() => {
  if (chartPoints.value.length < 2) return '';
  const first = chartPoints.value[0];
  const last = chartPoints.value[chartPoints.value.length - 1];
  const line = chartPoints.value.map((p) => `L ${p.x} ${p.y}`).join(' ');
  return `M ${first.x} 195 ${line} L ${last.x} 195 Z`;
});

// =========================================================
// SYNTHÈSE PAR MODE & HISTORIQUE FILTRÉ
// =========================================================
const modeBreakdown = computed(() => {
  const groups = new Map();
  for (const s of enrichedScores.value) {
    const key = formatModeLabel(s.mode);
    if (!groups.has(key)) {
      groups.set(key, { mode: key, count: 0, sum15: 0, bestOn15: 0 });
    }
    const g = groups.get(key);
    g.count++;
    g.sum15 += s.scoreOn15;
    if (s.scoreOn15 > g.bestOn15) g.bestOn15 = s.scoreOn15;
  }
  return [...groups.values()].map((g) => ({
    ...g,
    avgOn15: Number((g.sum15 / g.count).toFixed(1))
  }));
});

const filteredHistory = computed(() => {
  const base = enrichedScores.value.slice(0, 20);
  if (historyFilter.value === 'qcm15') {
    return base.filter((s) => s.isClassic15);
  }
  return base;
});

const formatModeLabel = (mode = '') => {
  if (mode === 'QCM Flash 60s') {
    return locale.value === 'fr' ? 'Sprint 60s (Flash)' : '60s Flash Sprint';
  }
  return mode;
};

const formatRawScore = (item) => {
  const m = (item.mode || '').toLowerCase();
  if (m.includes('flash')) return `${item.score} pts`;
  return `${item.score}/${item.max_score}`;
};

const getBadgeBgClass = (scoreOn15) => {
  if (scoreOn15 >= 12) return 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30';
  if (scoreOn15 >= 8) return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
  return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(async () => {
  const savedUser = localStorage.getItem('geolearn_user');
  if (!savedUser) {
    loading.value = false;
    return;
  }
  try {
    const parsed = JSON.parse(savedUser);
    const uid = parsed.id || (parsed.user && parsed.user.id);
    if (!uid) {
      loading.value = false;
      return;
    }
    isLoggedIn.value = true;
    const res = await fetch(`${API_URL}/api/scores/${uid}`);
    if (res.ok) {
      const data = await res.json();
      rawScores.value = Array.isArray(data) ? data : [];
    }
  } catch (e) {
  } finally {
    loading.value = false;
  }
});
</script>