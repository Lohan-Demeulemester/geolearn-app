<template>
  <div class="max-w-6xl mx-auto space-y-8 pb-12">

    <!-- EN-TÊTE -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <span class="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
          🏆 {{ locale === 'fr' ? 'Progression & Trophées Évolutifs' : 'Progression & Evolving Trophies' }}
        </span>
        <h2 class="text-3xl font-black text-gray-900 dark:text-white">
          {{ locale === 'fr' ? 'Ma Collection de Badges (I → V)' : 'My Badge Collection (I → V)' }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          {{ locale === 'fr'
            ? 'Débloquez les 14 badges officiels et faites-les évoluer du rang I (Bronze) jusqu\'au rang V (Diamant).'
            : 'Unlock all 14 official badges and upgrade them from Tier I (Bronze) to Tier V (Diamond).' }}
        </p>
      </div>

      <div class="flex items-center gap-3 self-start sm:self-auto">
        <router-link
          to="/leaderboard"
          class="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold transition shadow-xs"
        >
          🏆 {{ locale === 'fr' ? 'Ligues & Classement' : 'Leagues & Leaderboard' }}
        </router-link>
        <router-link
          to="/geoguessr"
          class="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-gray-700 text-white text-xs sm:text-sm font-bold transition"
        >
          🛰️ PinDrop
        </router-link>
        <router-link
          to="/quiz"
          class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition shadow-sm"
        >
          🎮 {{ locale === 'fr' ? 'Jouer aux Quiz' : 'Play Quizzes' }}
        </router-link>
      </div>
    </div>

    <!-- BANNIÈRE PROFIL RPG : NIVEAU GLOBAL, TITRE, BADGE ÉPINGLÉ & JAUGE D'XP -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-blue-500/20">
      <div class="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl"></div>

      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div class="lg:col-span-5 flex items-center gap-5">
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex flex-col items-center justify-center shadow-lg border-2 border-white/30 shrink-0">
            <span class="text-[10px] font-extrabold uppercase tracking-wider text-blue-950">LVL</span>
            <strong class="text-3xl font-black text-white leading-none">{{ playerLevel.level }}</strong>
          </div>

          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-2xl font-black text-white truncate">{{ displayUsername }}</h3>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                {{ playerLevel.title }}
              </span>
            </div>

            <!-- Badge favori équipé par le joueur -->
            <div v-if="pinnedBadgeObj" class="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-xs font-bold text-amber-300">
              <span>{{ pinnedBadgeObj.icon }}</span>
              <span>{{ pinnedBadgeObj.title }} {{ toRoman(pinnedBadgeObj.currentTier) }}</span>
            </div>

            <p class="text-xs sm:text-sm text-slate-300 mt-1">
              {{ locale === 'fr'
                ? `${totalTiersUnlocked} / ${maxTotalTiers} paliers débloqués (${unlockedBadgesCount}/${evaluatedBadges.length} badges actifs)`
                : `${totalTiersUnlocked} / ${maxTotalTiers} tiers unlocked (${unlockedBadgesCount}/${evaluatedBadges.length} active badges)` }}
            </p>
          </div>
        </div>

        <div class="lg:col-span-4 space-y-2">
          <div class="flex justify-between text-xs font-bold">
            <span class="text-cyan-300">{{ totalXp.toLocaleString() }} XP</span>
            <span class="text-slate-400">
              {{ locale === 'fr' ? `Prochain niveau : ${playerLevel.nextLevelXp.toLocaleString()} XP` : `Next level: ${playerLevel.nextLevelXp.toLocaleString()} XP` }}
            </span>
          </div>
          <div class="h-3.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              class="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
              :style="{ width: `${playerLevel.progressPercent}%` }"
            ></div>
          </div>
          <p class="text-[11px] text-slate-400">
            {{ locale === 'fr'
              ? 'Chaque palier de badge débloqué vous rapporte +100 XP bonus !'
              : 'Each unlocked badge tier grants you +100 bonus XP!' }}
          </p>
        </div>

        <div class="lg:col-span-3 grid grid-cols-3 gap-2 text-center">
          <div class="bg-white/5 border border-white/10 rounded-2xl p-3">
            <strong class="text-xl font-black text-amber-400 block">{{ statsSummary.totalGames }}</strong>
            <span class="text-[11px] text-slate-300">{{ locale === 'fr' ? 'Parties' : 'Games' }}</span>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-2xl p-3">
            <strong class="text-xl font-black text-emerald-400 block">{{ statsSummary.perfectGames }}</strong>
            <span class="text-[11px] text-slate-300">{{ locale === 'fr' ? 'Sans-faute' : 'Perfects' }}</span>
          </div>
          <div class="bg-white/5 border border-white/10 rounded-2xl p-3">
            <strong class="text-xl font-black text-cyan-300 block">{{ diamondCount }}</strong>
            <span class="text-[11px] text-slate-300">{{ locale === 'fr' ? 'Rang V 💎' : 'Tier V 💎' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- BARRE DE FILTRES & TRI DE LA COLLECTION -->
    <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="f in filterTabs"
          :key="f.id"
          type="button"
          @click="activeFilter = f.id"
          class="px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer border"
          :class="activeFilter === f.id
            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
            : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-400'"
        >
          {{ f.label }}
        </button>
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
        <span class="text-xs font-bold text-gray-400">{{ locale === 'fr' ? 'Trier par :' : 'Sort by:' }}</span>
        <select
          v-model="sortBy"
          class="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white text-xs font-bold focus:outline-none"
        >
          <option value="default">{{ locale === 'fr' ? 'Ordre officiel' : 'Official order' }}</option>
          <option value="tier-desc">{{ locale === 'fr' ? 'Rang le plus élevé (V → I)' : 'Highest Tier (V → I)' }}</option>
          <option value="progress-desc">{{ locale === 'fr' ? 'Proche du prochain palier' : 'Closest to next tier' }}</option>
        </select>
      </div>
    </div>

    <!-- GRILLE DES 14 BADGES ÉVOLUTIFS (PALIERS I, II, III, IV, V) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="badge in filteredAndSortedBadges"
        :key="badge.id"
        class="rounded-3xl p-6 transition-all duration-300 border-2 flex flex-col justify-between relative overflow-hidden"
        :class="badge.cardStyle"
      >
        <div class="flex items-start justify-between gap-4 mb-4">
          <div class="flex items-center gap-4">
            <div
              class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md shrink-0 relative"
              :class="badge.iconBgStyle"
            >
              <span>{{ badge.icon }}</span>
              <span
                v-if="badge.currentTier > 0"
                class="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-md text-[10px] font-black shadow"
                :class="badge.romanBadgeStyle"
              >
                {{ toRoman(badge.currentTier) }}
              </span>
            </div>

            <div>
              <h3 class="text-xl font-black text-gray-900 dark:text-white">
                {{ badge.title }}
                <span v-if="badge.currentTier > 0" class="ml-1">{{ toRoman(badge.currentTier) }}</span>
              </h3>
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
                {{ badge.subtitle }}
              </p>
            </div>
          </div>

          <div class="flex flex-col items-end gap-1.5 shrink-0">
            <span
              class="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider"
              :class="badge.rarityPillStyle"
            >
              {{ badge.rarityLabel }}
            </span>

            <!-- Bouton pour épingler le badge sur sa bannière RPG -->
            <button
              v-if="badge.currentTier > 0"
              type="button"
              @click="togglePinBadge(badge.id)"
              class="text-[11px] font-bold px-2 py-0.5 rounded-lg transition cursor-pointer"
              :class="pinnedBadgeId === badge.id
                ? 'bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/50'
                : 'text-gray-400 hover:text-amber-500'"
            >
              {{ pinnedBadgeId === badge.id ? (locale === 'fr' ? '★ Épinglé' : '★ Pinned') : (locale === 'fr' ? '☆ Épingler' : '☆ Pin') }}
            </button>
          </div>
        </div>

        <!-- Jetons des 5 paliers (I, II, III, IV, V) -->
        <div class="grid grid-cols-5 gap-2 my-4">
          <div
            v-for="(tierTarget, idx) in badge.tiers"
            :key="badge.id + '-tier-' + idx"
            class="rounded-xl p-2 text-center border transition-all"
            :class="idx + 1 <= badge.currentTier
              ? badge.activeStepStyle
              : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 opacity-70'"
          >
            <span class="text-[11px] font-black block">{{ toRoman(idx + 1) }}</span>
            <span class="text-[11px] font-bold block truncate">{{ tierTarget.toLocaleString() }}{{ badge.unit }}</span>
          </div>
        </div>

        <!-- Jauge vers le prochain palier + Lien direct vers le mode -->
        <div class="space-y-2.5 pt-2 border-t border-gray-100 dark:border-gray-700/70">
          <div class="flex items-center justify-between text-xs font-bold">
            <span class="text-gray-600 dark:text-gray-300">
              {{ badge.nextTierLabel }}
            </span>
            <span class="text-gray-900 dark:text-white font-extrabold">
              {{ badge.currentValue.toLocaleString() }} / {{ badge.nextTarget.toLocaleString() }}{{ badge.unit }}
            </span>
          </div>

          <div class="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="badge.progressBarStyle"
              :style="{ width: `${badge.progressPercent}%` }"
            ></div>
          </div>

          <div class="flex items-center justify-between pt-1">
            <span class="text-[11px] font-semibold text-gray-400">
              +{{ badge.currentTier * 100 }} XP bonus acquis
            </span>
            <router-link
              :to="badge.playLink"
              class="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>{{ locale === 'fr' ? 'S\'entraîner sur ce mode' : 'Train on this mode' }}</span>
              <span>→</span>
            </router-link>
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

const currentUser = ref(null);
const scoresList = ref([]);
const activeFilter = ref('all');
const sortBy = ref('default');
const pinnedBadgeId = ref(localStorage.getItem('geolearn_pinned_badge') || '');

const togglePinBadge = (id) => {
  if (pinnedBadgeId.value === id) {
    pinnedBadgeId.value = '';
    localStorage.removeItem('geolearn_pinned_badge');
  } else {
    pinnedBadgeId.value = id;
    localStorage.setItem('geolearn_pinned_badge', id);
  }
};

const displayUsername = computed(() => {
  if (!currentUser.value) return locale.value === 'fr' ? 'Explorateur' : 'Explorer';
  return (
    currentUser.value.username ||
    currentUser.value.pseudo ||
    currentUser.value.name ||
    (currentUser.value.user && (currentUser.value.user.username || currentUser.value.user.name)) ||
    (currentUser.value.email ? currentUser.value.email.split('@')[0] : 'Explorateur')
  );
});

const toRoman = (num) => ['', 'I', 'II', 'III', 'IV', 'V'][num] || '';

onMounted(async () => {
  const savedUser = localStorage.getItem('geolearn_user');
  if (!savedUser) return;
  try {
    const parsed = JSON.parse(savedUser);
    currentUser.value = parsed;
    const userId = parsed.id || (parsed.user && parsed.user.id);
    if (!userId) return;

    const res = await fetch(`${API_URL}/api/scores/${userId}`);
    if (res.ok) {
      const data = await res.json();
      scoresList.value = Array.isArray(data) ? data : (data.scores || []);
    }
  } catch (e) {
    console.error('Erreur chargement collection badges:', e);
  }
});

// Agrégation complète de tous les modes de jeu (incluant QCM Flash 60s et Satellite)
const statsSummary = computed(() => {
  const list = scoresList.value;
  const totalGames = list.length;

  let capitalsPoints = 0;
  let flagsPoints = 0;
  let culturePoints = 0;
  let bestFlagGrid = 0;
  let bestEurope = 0;
  let bestWorld = 0;
  let bestGeoGuessr = 0;
  let bestFlash60 = 0;
  let mapClickPoints = 0;
  let detectivePoints = 0;
  let mysteryWins = 0;
  let perfectGames = 0;
  let totalNormalizedPoints = 0;
  const distinctModesSet = new Set();

  for (const s of list) {
    const mode = (s.mode || '').toLowerCase();
    const score = Number(s.score || 0);
    const max = Number(s.max_score || 15);

    if (mode) distinctModesSet.add(mode);
    if (score >= max && max > 0) perfectGames++;

    if (mode.includes('geoguessr')) {
      if (score > bestGeoGuessr) bestGeoGuessr = score;
      totalNormalizedPoints += Math.round(score / 250);
    } else {
      totalNormalizedPoints += score;
    }

    if (mode.includes('capitale')) capitalsPoints += score;
    if (mode.includes('drapeau')) flagsPoints += score;
    if (mode.includes('culture')) culturePoints += score;
    if (mode.includes('grille') && score > bestFlagGrid) bestFlagGrid = score;
    if (mode.includes('europe') && score > bestEurope) bestEurope = score;
    if (mode.includes('monde') && score > bestWorld) bestWorld = score;
    if (mode.includes('flash') && score > bestFlash60) bestFlash60 = score;
    if (mode.includes('cliquez')) mapClickPoints += score;
    if (mode.includes('enquête') || mode.includes('enquete')) detectivePoints += score;
    if (mode.includes('mystère') || mode.includes('mystere')) {
      if (score > 0) mysteryWins++;
    }
  }

  return {
    totalGames,
    capitalsPoints,
    flagsPoints,
    culturePoints,
    bestFlagGrid,
    bestEurope,
    bestWorld,
    bestGeoGuessr,
    bestFlash60,
    mapClickPoints,
    detectivePoints,
    mysteryWins,
    perfectGames,
    distinctModesCount: distinctModesSet.size,
    totalNormalizedPoints
  };
});

// Les 14 Familles de Badges Évolutifs (I -> V)
const rawBadgesConfig = computed(() => {
  const isFr = locale.value === 'fr';
  const st = statsSummary.value;

  return [
    {
      id: 'player',
      icon: '🎮',
      title: isFr ? 'Joueur Assidu' : 'Dedicated Player',
      subtitle: isFr ? 'Nombre total de parties jouées sur GeoLearn' : 'Total number of games played on GeoLearn',
      tiers: [1, 5, 25, 50, 100],
      value: st.totalGames,
      unit: '',
      playLink: '/quiz'
    },
    {
      id: 'geoguessr',
      icon: '🛰️',
      title: isFr ? 'Explorateur PinDrop (Satellite & Photo)' : 'PinDrop Explorer (Satellite & Photo)',
      subtitle: isFr ? 'Meilleur score sur une partie de GeoGuessr (/ 25 000 pts)' : 'Best score in a 5-round GeoGuessr game (/ 25,000 pts)',
      tiers: [5000, 12000, 18000, 22000, 24500],
      value: st.bestGeoGuessr,
      unit: '',
      playLink: '/geoguessr'
    },
    {
      id: 'capitals',
      icon: '🏛️',
      title: isFr ? 'Maître des Capitales' : 'Capitals Master',
      subtitle: isFr ? 'Cumul de bonnes réponses en QCM Capitales' : 'Cumulative correct answers in Capitals Quiz',
      tiers: [10, 50, 150, 300, 500],
      value: st.capitalsPoints,
      unit: '',
      playLink: { path: '/quiz', query: { mode: 'qcm', type: 'capital' } }
    },
    {
      id: 'vexillologist',
      icon: '🚩',
      title: isFr ? 'Expert des Drapeaux' : 'Flag Expert',
      subtitle: isFr ? 'Cumul de drapeaux identifiés (QCM & Grille)' : 'Cumulative flags identified (Quiz & Grid)',
      tiers: [15, 75, 200, 500, 1000],
      value: st.flagsPoints,
      unit: '',
      playLink: { path: '/quiz', query: { mode: 'qcm', type: 'flag' } }
    },
    {
      id: 'culture',
      icon: '🗣️',
      title: isFr ? 'Démographe & Polyglotte' : 'Demographer & Polyglot',
      subtitle: isFr ? 'Bonnes réponses au QCM Population, Langues & Monnaies' : 'Correct answers in Population, Languages & Currencies Quiz',
      tiers: [10, 40, 100, 250, 500],
      value: st.culturePoints,
      unit: '',
      playLink: { path: '/quiz', query: { mode: 'qcm', type: 'culture' } }
    },
    {
      id: 'flash60',
      icon: '⚡',
      title: isFr ? 'Éclair du Sprint (60s)' : '60s Sprint Lightning',
      subtitle: isFr ? 'Meilleur score en mode Contre-la-montre 60 secondes (QCM Flash)' : 'Best score in 60-Second Flash Quiz mode',
      tiers: [10, 20, 30, 45, 60],
      value: st.bestFlash60,
      unit: ' pts',
      playLink: { path: '/quiz', query: { mode: 'flash60' } }
    },
    {
      id: 'flag_grid',
      icon: '🏳️',
      title: isFr ? 'Dompteur de la Grille' : 'Grid Conqueror',
      subtitle: isFr ? 'Record de drapeaux validés en une seule Grille' : 'Record flags validated in a single Flag Grid game',
      tiers: [10, 30, 60, 120, 196],
      value: st.bestFlagGrid,
      unit: '',
      playLink: { path: '/quiz', query: { mode: 'flag-grid' } }
    },
    {
      id: 'map_click',
      icon: '🖱️',
      title: isFr ? 'Boussole Chirurgicale' : 'Surgical Compass',
      subtitle: isFr ? 'Pays localisés du 1er coup dans "Cliquez sur la Carte"' : 'Countries located on the 1st try in "Click on the Map"',
      tiers: [15, 50, 150, 300, 600],
      value: st.mapClickPoints,
      unit: '',
      playLink: { path: '/quiz', query: { mode: 'map-click' } }
    },
    {
      id: 'detective',
      icon: '🕵️',
      title: isFr ? 'Détective Géographique' : 'Geographic Detective',
      subtitle: isFr ? 'Points cumulés dans le mode "Enquête aux 5 Indices"' : 'Cumulative points in "5-Clue Detective" mode',
      tiers: [15, 60, 150, 350, 750],
      value: st.detectivePoints,
      unit: '',
      playLink: { path: '/quiz', query: { mode: 'detective' } }
    },
    {
      id: 'mystery',
      icon: '🧭',
      title: isFr ? 'Oracle du Pays Mystère' : 'Mystery Country Oracle',
      subtitle: isFr ? 'Pays Mystères découverts en moins de 6 essais (Worldle)' : 'Mystery Countries solved within 6 tries (Worldle)',
      tiers: [1, 5, 15, 30, 60],
      value: st.mysteryWins,
      unit: '',
      playLink: { path: '/quiz', query: { mode: 'mystery' } }
    },
    {
      id: 'europe_chrono',
      icon: '🇪🇺',
      title: isFr ? 'Conquérant d\'Europe' : 'Europe Conqueror',
      subtitle: isFr ? 'Meilleur score au Défi Chrono Europe (sur 47)' : 'Best score in the Europe Timed Challenge (out of 47)',
      tiers: [10, 20, 30, 40, 47],
      value: st.bestEurope,
      unit: '',
      playLink: { path: '/quiz', query: { mode: 'chrono' } }
    },
    {
      id: 'world_chrono',
      icon: '🌍',
      title: isFr ? 'Empereur du Monde' : 'World Emperor',
      subtitle: isFr ? 'Meilleur score au Défi Chrono Monde (sur 196)' : 'Best score in the World Timed Challenge (out of 196)',
      tiers: [15, 40, 80, 130, 196],
      value: st.bestWorld,
      unit: '',
      playLink: { path: '/quiz', query: { mode: 'chrono' } }
    },
    {
      id: 'polyvalent',
      icon: '🌟',
      title: isFr ? 'Explorateur Polyvalent' : 'Versatile Explorer',
      subtitle: isFr ? 'Nombre de modes de jeu différents joués sur GeoLearn' : 'Number of distinct game modes played on GeoLearn',
      tiers: [2, 4, 6, 8, 10],
      value: st.distinctModesCount,
      unit: '',
      playLink: '/quiz'
    },
    {
      id: 'sniper',
      icon: '🎯',
      title: isFr ? 'Tireur d\'Élite' : 'Sharpshooter',
      subtitle: isFr ? 'Parties terminées avec 100 % de réussite (Sans-faute)' : 'Games completed with 100% accuracy (Perfect score)',
      tiers: [1, 3, 10, 25, 50],
      value: st.perfectGames,
      unit: '',
      playLink: '/quiz'
    }
  ];
});

const getTierTheme = (tier, isFr) => {
  switch (tier) {
    case 5:
      return {
        rarityLabel: isFr ? '💎 Diamant (V)' : '💎 Diamond (V)',
        cardStyle: 'bg-gradient-to-br from-cyan-50/90 via-white to-blue-50/90 dark:from-cyan-950/40 dark:via-gray-800 dark:to-blue-950/40 border-cyan-400 shadow-lg',
        iconBgStyle: 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white',
        romanBadgeStyle: 'bg-cyan-300 text-slate-950',
        rarityPillStyle: 'bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-700',
        activeStepStyle: 'bg-cyan-500/15 dark:bg-cyan-500/20 border-cyan-500 text-cyan-700 dark:text-cyan-300',
        progressBarStyle: 'bg-gradient-to-r from-cyan-400 to-blue-600'
      };
    case 4:
      return {
        rarityLabel: isFr ? '🟣 Platine (IV)' : '🟣 Platinum (IV)',
        cardStyle: 'bg-white dark:bg-gray-800 border-purple-400/80 shadow-md',
        iconBgStyle: 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white',
        romanBadgeStyle: 'bg-purple-200 text-purple-950',
        rarityPillStyle: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300',
        activeStepStyle: 'bg-purple-500/15 border-purple-500 text-purple-700 dark:text-purple-300',
        progressBarStyle: 'bg-gradient-to-r from-purple-500 to-indigo-500'
      };
    case 3:
      return {
        rarityLabel: isFr ? '🥇 Or (III)' : '🥇 Gold (III)',
        cardStyle: 'bg-white dark:bg-gray-800 border-amber-400/90 shadow-md',
        iconBgStyle: 'bg-gradient-to-br from-amber-400 to-yellow-600 text-white',
        romanBadgeStyle: 'bg-amber-200 text-amber-950',
        rarityPillStyle: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300',
        activeStepStyle: 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300',
        progressBarStyle: 'bg-gradient-to-r from-amber-400 to-orange-500'
      };
    case 2:
      return {
        rarityLabel: isFr ? '🥈 Argent (II)' : '🥈 Silver (II)',
        cardStyle: 'bg-white dark:bg-gray-800 border-slate-300 dark:border-slate-500 shadow-sm',
        iconBgStyle: 'bg-gradient-to-br from-slate-300 to-slate-500 text-white',
        romanBadgeStyle: 'bg-slate-200 text-slate-900',
        rarityPillStyle: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200',
        activeStepStyle: 'bg-slate-500/15 border-slate-400 text-slate-700 dark:text-slate-200',
        progressBarStyle: 'bg-gradient-to-r from-slate-400 to-blue-500'
      };
    case 1:
      return {
        rarityLabel: isFr ? '🥉 Bronze (I)' : '🥉 Bronze (I)',
        cardStyle: 'bg-white dark:bg-gray-800 border-orange-300 dark:border-orange-700/70 shadow-sm',
        iconBgStyle: 'bg-gradient-to-br from-orange-400 to-amber-700 text-white',
        romanBadgeStyle: 'bg-orange-200 text-orange-950',
        rarityPillStyle: 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300',
        activeStepStyle: 'bg-orange-500/15 border-orange-400 text-orange-700 dark:text-orange-300',
        progressBarStyle: 'bg-gradient-to-r from-orange-400 to-amber-600'
      };
    default:
      return {
        rarityLabel: isFr ? '🔒 Non débloqué' : '🔒 Locked',
        cardStyle: 'bg-white/80 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700',
        iconBgStyle: 'bg-gray-100 dark:bg-gray-700 text-gray-400 grayscale',
        romanBadgeStyle: 'bg-gray-200 text-gray-700',
        rarityPillStyle: 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
        activeStepStyle: '',
        progressBarStyle: 'bg-blue-600'
      };
  }
};

const evaluatedBadges = computed(() => {
  const isFr = locale.value === 'fr';
  return rawBadgesConfig.value.map(b => {
    let currentTier = 0;
    for (let i = 0; i < b.tiers.length; i++) {
      if (b.value >= b.tiers[i]) currentTier = i + 1;
    }
    const nextTarget = currentTier < 5 ? b.tiers[currentTier] : b.tiers[4];
    const progressPercent = Math.min(100, Math.round((b.value / nextTarget) * 100));
    const nextTierLabel = currentTier >= 5
      ? (isFr ? 'Palier maximum atteint ! 🎉' : 'Maximum tier reached! 🎉')
      : (isFr ? `Prochain palier : ${toRoman(currentTier + 1)}` : `Next tier: ${toRoman(currentTier + 1)}`);

    return {
      ...b,
      currentValue: b.value,
      currentTier,
      nextTarget,
      progressPercent,
      nextTierLabel,
      ...getTierTheme(currentTier, isFr)
    };
  });
});

const unlockedBadgesCount = computed(() => evaluatedBadges.value.filter(b => b.currentTier > 0).length);
const totalTiersUnlocked = computed(() => evaluatedBadges.value.reduce((acc, b) => acc + b.currentTier, 0));
const maxTotalTiers = computed(() => evaluatedBadges.value.length * 5);
const diamondCount = computed(() => evaluatedBadges.value.filter(b => b.currentTier === 5).length);

const pinnedBadgeObj = computed(() =>
  evaluatedBadges.value.find(b => b.id === pinnedBadgeId.value && b.currentTier > 0) ||
  evaluatedBadges.value.find(b => b.currentTier > 0) ||
  null
);

const filterTabs = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'all', label: isFr ? `Tous (${evaluatedBadges.value.length})` : `All (${evaluatedBadges.value.length})` },
    { id: 'unlocked', label: isFr ? `Débloqués (${unlockedBadgesCount.value})` : `Unlocked (${unlockedBadgesCount.value})` },
    { id: 'locked', label: isFr ? 'À débloquer' : 'Locked' },
    { id: 'diamond', label: isFr ? `Rang V 💎 (${diamondCount.value})` : `Tier V 💎 (${diamondCount.value})` }
  ];
});

const filteredAndSortedBadges = computed(() => {
  let list = [...evaluatedBadges.value];
  if (activeFilter.value === 'unlocked') list = list.filter(b => b.currentTier > 0);
  else if (activeFilter.value === 'locked') list = list.filter(b => b.currentTier === 0);
  else if (activeFilter.value === 'diamond') list = list.filter(b => b.currentTier === 5);

  if (sortBy.value === 'tier-desc') {
    list.sort((a, b) => b.currentTier - a.currentTier || b.progressPercent - a.progressPercent);
  } else if (sortBy.value === 'progress-desc') {
    list.sort((a, b) => {
      const aDone = a.currentTier >= 5 ? -1 : a.progressPercent;
      const bDone = b.currentTier >= 5 ? -1 : b.progressPercent;
      return bDone - aDone;
    });
  }
  return list;
});

const totalXp = computed(() => {
  const st = statsSummary.value;
  return (st.totalNormalizedPoints * 10) + (st.totalGames * 25) + (totalTiersUnlocked.value * 100);
});

const playerLevel = computed(() => {
  const isFr = locale.value === 'fr';
  const xp = totalXp.value;
  const level = Math.max(1, Math.floor(xp / 500) + 1);
  const currentLevelStartXp = (level - 1) * 500;
  const nextLevelXp = level * 500;
  const progressPercent = Math.min(100, Math.round(((xp - currentLevelStartXp) / 500) * 100));

  let title = isFr ? 'Apprenti Voyageur' : 'Novice Traveler';
  if (level >= 25) title = isFr ? 'Légende de GeoLearn' : 'GeoLearn Legend';
  else if (level >= 15) title = isFr ? 'Maître Cartographe' : 'Master Cartographer';
  else if (level >= 8) title = isFr ? 'Globe-Trotter Émérite' : 'Seasoned Globetrotter';
  else if (level >= 3) title = isFr ? 'Explorateur Confirmé' : 'Skilled Explorer';

  return { level, nextLevelXp, progressPercent, title };
});
</script>