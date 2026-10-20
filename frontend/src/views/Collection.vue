<template>
  <div class="max-w-6xl mx-auto space-y-8 pb-12">

    <!-- EN-TÊTE DE LA COLLECTION -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <span class="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
          🏆 {{ locale === 'fr' ? 'Progression & Récompenses' : 'Progression & Rewards' }}
        </span>
        <h2 class="text-3xl font-black text-gray-900 dark:text-white">
          {{ locale === 'fr' ? 'Ma Collection de Badges' : 'My Badge Collection' }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          {{ locale === 'fr'
            ? 'Faites évoluer vos badges du palier I (Bronze) jusqu\'au palier V (Diamant) en jouant aux différents modes.'
            : 'Upgrade your badges from Tier I (Bronze) up to Tier V (Diamond) by playing different game modes.' }}
        </p>
      </div>

      <router-link
        to="/quiz"
        class="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition shadow-sm"
      >
        🎮 {{ locale === 'fr' ? 'Jouer pour débloquer' : 'Play to unlock' }}
      </router-link>
    </div>

    <!-- ========================================================= -->
    <!-- BANNIÈRE PROFIL RPG : NIVEAU GLOBAL, TITRE & JAUGE D'XP   -->
    <!-- ========================================================= -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-blue-500/20">
      <div class="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl"></div>

      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        <!-- Avatar de Niveau + Nom + Titre honorifique -->
        <div class="lg:col-span-5 flex items-center gap-5">
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex flex-col items-center justify-center shadow-lg border-2 border-white/30 shrink-0">
            <span class="text-[10px] font-extrabold uppercase tracking-wider text-blue-950">LVL</span>
            <strong class="text-3xl font-black text-white leading-none">{{ playerLevel.level }}</strong>
          </div>

          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-2xl font-black text-white">{{ displayUsername }}</h3>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                {{ playerLevel.title }}
              </span>
            </div>
            <p class="text-sm text-slate-300 mt-1">
              {{ locale === 'fr'
                ? `${totalTiersUnlocked} / ${maxTotalTiers} paliers de badges débloqués`
                : `${totalTiersUnlocked} / ${maxTotalTiers} badge tiers unlocked` }}
            </p>
          </div>
        </div>

        <!-- Barre d'XP vers le niveau suivant -->
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
        </div>

        <!-- Résumé des raretés débloquées -->
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

    <!-- MESSAGE SI NON CONNECTÉ -->
    <div
      v-if="!currentUser"
      class="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <p class="text-sm font-semibold text-amber-900 dark:text-amber-200">
        🔒 {{ locale === 'fr'
          ? 'Connectez-vous à votre compte pour sauvegarder vos scores et faire évoluer vos badges du palier I au palier V !'
          : 'Log in to your account to save your scores and upgrade your badges from Tier I to Tier V!' }}
      </p>
      <router-link
        to="/profil"
        class="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shrink-0"
      >
        {{ locale === 'fr' ? 'Se connecter' : 'Log In' }}
      </router-link>
    </div>

    <!-- ========================================================= -->
    <!-- GRILLE DES 8 BADGES ÉVOLUTIFS (PALIERS I, II, III, IV, V) -->
    <!-- ========================================================= -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="badge in evaluatedBadges"
        :key="badge.id"
        class="rounded-3xl p-6 transition-all duration-300 border-2 flex flex-col justify-between relative overflow-hidden"
        :class="badge.cardStyle"
      >
        <!-- Ruban de Rareté en haut à droite -->
        <div class="flex items-start justify-between gap-4 mb-4">
          <div class="flex items-center gap-4">
            <!-- Icône du Badge avec halo selon le palier -->
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
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-xl font-black text-gray-900 dark:text-white">
                  {{ badge.title }}
                  <span v-if="badge.currentTier > 0" class="ml-1">{{ toRoman(badge.currentTier) }}</span>
                </h3>
              </div>
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
                {{ badge.subtitle }}
              </p>
            </div>
          </div>

          <span
            class="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider shrink-0"
            :class="badge.rarityPillStyle"
          >
            {{ badge.rarityLabel }}
          </span>
        </div>

        <!-- Paliers I, II, III, IV, V sous forme de jetons d'étape -->
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
            <span class="text-[11px] font-bold block truncate">{{ tierTarget }}{{ badge.unit }}</span>
          </div>
        </div>

        <!-- Jauge de progression vers le prochain palier -->
        <div class="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-700/70">
          <div class="flex items-center justify-between text-xs font-bold">
            <span class="text-gray-600 dark:text-gray-300">
              {{ badge.nextTierLabel }}
            </span>
            <span class="text-gray-900 dark:text-white font-extrabold">
              {{ badge.currentValue }} / {{ badge.nextTarget }}{{ badge.unit }}
            </span>
          </div>

          <div class="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="badge.progressBarStyle"
              :style="{ width: `${badge.progressPercent}%` }"
            ></div>
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

const toRoman = (num) => {
  const romans = ['', 'I', 'II', 'III', 'IV', 'V'];
  return romans[num] || '';
};

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

// Calcul des statistiques globales du joueur à partir de ses scores MySQL
const statsSummary = computed(() => {
  const list = scoresList.value;
  const totalGames = list.length;

  let capitalsPoints = 0;
  let flagsPoints = 0;
  let bestFlagGrid = 0;
  let bestEurope = 0;
  let bestWorld = 0;
  let perfectGames = 0;
  let totalPointsAllModes = 0;

  for (const s of list) {
    const mode = (s.mode || '').toLowerCase();
    const score = Number(s.score || 0);
    const max = Number(s.max_score || 15);
    totalPointsAllModes += score;

    if (score >= max && max > 0) {
      perfectGames++;
    }
    if (mode.includes('capitale')) {
      capitalsPoints += score;
    }
    if (mode.includes('drapeau')) {
      flagsPoints += score;
    }
    if (mode.includes('grille')) {
      if (score > bestFlagGrid) bestFlagGrid = score;
    }
    if (mode.includes('europe')) {
      if (score > bestEurope) bestEurope = score;
    }
    if (mode.includes('monde')) {
      if (score > bestWorld) bestWorld = score;
    }
  }

  return {
    totalGames,
    capitalsPoints,
    flagsPoints,
    bestFlagGrid,
    bestEurope,
    bestWorld,
    perfectGames,
    totalPointsAllModes
  };
});

// Définition des 8 Familles de Badges Évolutifs (5 Paliers : I, II, III, IV, V)
const rawBadgesConfig = computed(() => {
  const isFr = locale.value === 'fr';
  const st = statsSummary.value;

  return [
    {
      id: 'player',
      icon: '🎮',
      title: isFr ? 'Joueur' : 'Player',
      subtitle: isFr ? 'Nombre total de parties jouées sur GeoLearn' : 'Total number of games played on GeoLearn',
      tiers: [1, 5, 25, 50, 100],
      value: st.totalGames,
      unit: ''
    },
    {
      id: 'capitals',
      icon: '🏛️',
      title: isFr ? 'Maître des Capitales' : 'Capitals Master',
      subtitle: isFr ? 'Cumul de bonnes réponses en QCM Capitales' : 'Cumulative correct answers in Capitals Quiz',
      tiers: [10, 50, 150, 300, 500],
      value: st.capitalsPoints,
      unit: ''
    },
    {
      id: 'vexillologist',
      icon: '🚩',
      title: isFr ? 'Expert des Drapeaux' : 'Flag Expert',
      subtitle: isFr ? 'Cumul de drapeaux identifiés (QCM & Grille)' : 'Cumulative flags identified (Quiz & Grid)',
      tiers: [15, 75, 200, 500, 1000],
      value: st.flagsPoints,
      unit: ''
    },
    {
      id: 'flag_grid',
      icon: '🏳️',
      title: isFr ? 'Dompteur de la Grille' : 'Grid Conqueror',
      subtitle: isFr ? 'Record de drapeaux trouvés en une seule Grille' : 'Record flags found in a single Flag Grid game',
      tiers: [10, 30, 60, 120, 196],
      value: st.bestFlagGrid,
      unit: ''
    },
    {
      id: 'europe_chrono',
      icon: '🇪🇺',
      title: isFr ? 'Conquérant d\'Europe' : 'Europe Conqueror',
      subtitle: isFr ? 'Meilleur score au Défi Chrono Europe (sur 47)' : 'Best score in the Europe Timed Challenge (out of 47)',
      tiers: [10, 20, 30, 40, 47],
      value: st.bestEurope,
      unit: ''
    },
    {
      id: 'world_chrono',
      icon: '🌍',
      title: isFr ? 'Empereur du Monde' : 'World Emperor',
      subtitle: isFr ? 'Meilleur score au Défi Chrono Monde (sur 196)' : 'Best score in the World Timed Challenge (out of 196)',
      tiers: [15, 40, 80, 130, 196],
      value: st.bestWorld,
      unit: ''
    },
    {
      id: 'sniper',
      icon: '🎯',
      title: isFr ? 'Tireur d\'Élite' : 'Sharpshooter',
      subtitle: isFr ? 'Parties terminées avec 100 % de bonnes réponses (Sans-faute)' : 'Games completed with 100% accuracy (Perfect score)',
      tiers: [1, 3, 10, 25, 50],
      value: st.perfectGames,
      unit: ''
    },
    {
      id: 'scholar',
      icon: '🧠',
      title: isFr ? 'Grand Géographe' : 'Grand Geographer',
      subtitle: isFr ? 'Total de bonnes réponses cumulées tous modes confondus' : 'Total correct answers accumulated across all modes',
      tiers: [25, 100, 300, 750, 1500],
      value: st.totalPointsAllModes,
      unit: ''
    }
  ];
});

// Styles visuels par palier (0 = Verrouillé, 1 = Bronze, 2 = Argent, 3 = Or, 4 = Platine, 5 = Diamant)
const getTierTheme = (tier, isFr) => {
  switch (tier) {
    case 5:
      return {
        rarityLabel: isFr ? '💎 Diamant (Max)' : '💎 Diamond (Max)',
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
      : (isFr ? `Progression vers le palier ${toRoman(currentTier + 1)}` : `Progress to Tier ${toRoman(currentTier + 1)}`);

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

const totalTiersUnlocked = computed(() =>
  evaluatedBadges.value.reduce((acc, b) => acc + b.currentTier, 0)
);
const maxTotalTiers = computed(() => evaluatedBadges.value.length * 5);
const diamondCount = computed(() => evaluatedBadges.value.filter(b => b.currentTier === 5).length);

// Calcul de l'XP Totale (Points + Parties + Bonus par palier de badge débloqué)
const totalXp = computed(() => {
  const st = statsSummary.value;
  return (st.totalPointsAllModes * 10) + (st.totalGames * 25) + (totalTiersUnlocked.value * 100);
});

const playerLevel = computed(() => {
  const isFr = locale.value === 'fr';
  const xp = totalXp.value;
  const level = Math.max(1, Math.floor(xp / 500) + 1);
  const currentLevelStartXp = (level - 1) * 500;
  const nextLevelXp = level * 500;
  const progressPercent = Math.min(100, Math.round(((xp - currentLevelStartXp) / 500) * 100));

  let title = isFr ? 'Apprenti Voyageur' : 'Novice Traveler';
  if (level >= 20) title = isFr ? 'Légende de GeoLearn' : 'GeoLearn Legend';
  else if (level >= 12) title = isFr ? 'Maître Cartographe' : 'Master Cartographer';
  else if (level >= 7) title = isFr ? 'Globe-Trotter Émérite' : 'Seasoned Globetrotter';
  else if (level >= 3) title = isFr ? 'Explorateur Confirmé' : 'Skilled Explorer';

  return { level, nextLevelXp, progressPercent, title };
});
</script>