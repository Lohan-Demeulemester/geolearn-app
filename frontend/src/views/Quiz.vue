<template>
  <div class="quiz-experience w-full">

    <!-- ========================================================= -->
    <!-- 1. BARRE SUPÉRIEURE D'EN-JEU (VISIBLE PENDANT UNE PARTIE) -->
    <!-- ========================================================= -->
    <div v-if="currentMode !== 'menu'" class="max-w-[1400px] mx-auto px-3 sm:px-8 pt-6">
      <header class="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-[#090E1A]/85 backdrop-blur-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-600 dark:text-sky-400 font-mono text-[11px] font-bold uppercase tracking-wider">
            <span class="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span>{{ activeModeBadge }}</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {{ activeModeTitle }}
          </h1>
        </div>

        <div class="flex items-center gap-2.5 self-start sm:self-auto w-full sm:w-auto justify-between sm:justify-end shrink-0">
          <button
            type="button"
            @click="toggleSound"
            class="px-4 py-2.5 rounded-full text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            :class="soundEnabled
              ? 'bg-sky-500/10 text-sky-600 dark:text-sky-300 border-sky-500/30'
              : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10'"
          >
            <svg v-if="soundEnabled" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
            <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
            <span>{{ soundEnabled ? (locale === 'fr' ? 'Sons activés' : 'Sound ON') : (locale === 'fr' ? 'Muet' : 'Muted') }}</span>
          </button>

          <button
            type="button"
            @click="retourMenu"
            class="px-4 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:opacity-90 text-xs font-black transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-md"
          >
            <span>←</span>
            <span>{{ t('quiz.back') }}</span>
          </button>
        </div>
      </header>
    </div>

    <!-- ========================================================= -->
    <!-- TRANSITION SPATIALE ENTRE LE SHOWCASE 3D ET LES JEUX      -->
    <!-- ========================================================= -->
    <transition name="stage-morph" mode="out-in">

      <!-- ======================================================= -->
      <!-- MENU PRINCIPAL : SHOWCASE WEBGL 3D + ROUE ORBITALE 3D   -->
      <!-- ======================================================= -->
      <div v-if="currentMode === 'menu'" key="quiz-menu" class="w-full">

        <!-- 1. SCÈNE IMMERSIVE PLEIN ÉCRAN (WEBGL THREE.JS + CARROUSEL EN ARC) -->
        <section
          class="webgl-showcase-stage relative w-full min-h-[calc(100vh-58px)] flex flex-col justify-between overflow-hidden select-none"
          @pointermove="onStagePointerMove"
        >
          <!-- Halos atmosphériques réactifs au mode sélectionné -->
          <div class="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              class="ambient-halo ambient-halo-center"
              :style="{
                background: `radial-gradient(circle, ${activeShowcaseCard.glowColor}42 0%, rgba(14,165,233,0.08) 45%, transparent 72%)`,
                transform: `translate3d(calc(-50% + ${stageParallaxX * -24}px), calc(-50% + ${stageParallaxY * -24}px), 0)`
              }"
            ></div>
            <div
              class="giant-kinetic-bg"
              :style="{ transform: `translate3d(calc(-50% + ${stageParallaxX * -22}px), calc(-50% + ${stageParallaxY * -12}px), 0)` }"
            >
              <span>{{ activeShowcaseCard.shortTitle.toUpperCase() }}</span>
            </div>
          </div>

          <!-- BARRE SUPÉRIEURE FLOTTANTE : FILTRES CATÉGORIES, RECHERCHE & VUE (ZÉRO EMOJI + LOUPE Z-10) -->
          <div class="relative z-30 w-full max-w-[1680px] mx-auto px-4 sm:px-8 pt-3.5 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
            <!-- Pilules de catégories avec codes vectoriels -->
            <div class="flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-white/85 dark:bg-[#0B1023]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 shadow-2xl self-start">
              <button
                v-for="cat in menuCategories"
                :key="cat.id"
                type="button"
                @click="selectCategoryFilter(cat.id)"
                class="px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                :class="selectedMenuCat === cat.id
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
              >
                <span class="font-mono text-[10px] opacity-75">{{ cat.code }}</span>
                <span>{{ cat.label }}</span>
              </button>
            </div>

            <!-- Recherche (avec Loupe z-10 visible) + Aléatoire + Audio + Grille -->
            <div class="flex flex-wrap items-center gap-2 self-start xl:self-auto">
              <div class="relative">
                <svg
                  class="w-4 h-4 text-slate-400 dark:text-slate-300 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  v-model="menuSearchQuery"
                  type="text"
                  :placeholder="locale === 'fr' ? 'Rechercher un jeu...' : 'Search for a game...'"
                  class="relative z-0 w-48 sm:w-56 pl-10 pr-7 py-2 rounded-full bg-white/85 dark:bg-[#0B1023]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-400 shadow-lg"
                />
                <button
                  v-if="menuSearchQuery"
                  type="button"
                  @click="menuSearchQuery = ''"
                  class="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ×
                </button>
              </div>

              <button
                type="button"
                @click="launchRandomGame"
                class="px-4 py-2 rounded-full bg-indigo-500/15 hover:bg-indigo-500 text-indigo-600 dark:text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold transition cursor-pointer shadow-lg backdrop-blur-xl flex items-center gap-1.5"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" />
                  <polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" />
                  <line x1="4" y1="4" x2="9" y2="9" />
                </svg>
                <span>{{ locale === 'fr' ? 'Aléatoire' : 'Random' }}</span>
              </button>

              <button
                type="button"
                @click="toggleSound"
                class="px-3.5 py-2 rounded-full bg-white/85 dark:bg-[#0B1023]/80 border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer shadow-lg backdrop-blur-xl flex items-center gap-1.5"
              >
                <svg v-if="soundEnabled" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
                <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                </svg>
                <span>{{ soundEnabled ? 'ON' : 'OFF' }}</span>
              </button>

              <button
                type="button"
                @click="scrollToGamesGrid"
                class="px-4 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-black cursor-pointer shadow-lg hover:scale-105 transition"
              >
                {{ locale === 'fr' ? 'Catalogue (11) ↓' : 'All Games (11) ↓' }}
              </button>
            </div>
          </div>

          <!-- ZONE CENTRALE : FOCUS ÉDITORIAL (GAUCHE) + MANETTE 3D WEBGL GÉANTE (CENTRE) + TÉLÉMÉTRIE DU MODE (DROITE) -->
          <div class="relative z-20 w-full max-w-[1680px] mx-auto px-4 sm:px-8 my-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-4">

            <!-- Gauche (4 cols) : Présentation dynamique du mode pointé dans le carrousel -->
            <div class="lg:col-span-4 space-y-4 text-left order-2 lg:order-1 z-20">
              <transition name="slide-up-fade" mode="out-in">
                <div :key="activeShowcaseCard.id" class="space-y-4">
                  <div class="flex items-center gap-2.5">
                    <span
                      class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold border shadow-sm"
                      :class="activeShowcaseCard.badgeClass"
                    >
                      <span>{{ activeShowcaseCard.badgeIcon }}</span>
                      <span>{{ activeShowcaseCard.tag }}</span>
                    </span>
                    <span class="font-mono text-xs font-bold text-slate-400">
                      #{{ String(activeCarouselIndex + 1).padStart(2, '0') }} / {{ String(filteredMenuCards.length).padStart(2, '0') }}
                    </span>
                  </div>

                  <h1 class="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">
                    {{ activeShowcaseCard.title }}
                  </h1>

                  <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300/90 leading-relaxed max-w-md">
                    {{ activeShowcaseCard.desc }}
                  </p>

                  <div class="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      @click="activeShowcaseCard.action()"
                      class="px-7 py-3.5 rounded-full text-white font-black text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2.5"
                      :style="{
                        background: `linear-gradient(135deg, ${activeShowcaseCard.glowColor}, #0ea5e9)`,
                        boxShadow: `0 16px 36px -8px ${activeShowcaseCard.glowColor}75`
                      }"
                    >
                      <span>▶</span>
                      <span>{{ activeShowcaseCard.cta }}</span>
                    </button>

                    <div class="px-4 py-3 rounded-full bg-white/80 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 font-mono text-xs font-bold text-slate-700 dark:text-slate-200 backdrop-blur-xl">
                      🕒︎ {{ activeShowcaseCard.duration }} • {{ activeShowcaseCard.metric }}
                    </div>
                  </div>
                </div>
              </transition>
            </div>

            <!-- Centre (5 cols) : SCÈNE WEBGL THREE.JS DE LA MANETTE 3D NEXT-GEN -->
            <div class="lg:col-span-5 flex flex-col items-center justify-center relative order-1 lg:order-2">
              <div
                ref="webglContainerRef"
                class="webgl-controller-mount relative flex items-center justify-center cursor-grab active:cursor-grabbing"
                @pointerdown="onWebglPointerDown"
                @pointermove="onWebglPointerMove"
                @pointerup="onWebglPointerUp"
                @pointerleave="onWebglPointerUp"
                @click="triggerWebglPulse"
              ></div>

              <div class="pointer-events-none -mt-3 px-3.5 py-1 rounded-full bg-slate-900/75 dark:bg-white/[0.05] border border-white/10 font-mono text-[10px] text-indigo-300 backdrop-blur-md">
                {{ locale === 'fr' ? '↻ GLISSER EN 3D (WEBGL) • CLIQUER POUR IMPULSION' : '↻ DRAG IN 3D (WEBGL) • CLICK FOR PULSE' }}
              </div>
            </div>

            <!-- Droite (3 cols) : Fiche Télémétrique & Navigation Rapide -->
            <div class="lg:col-span-3 flex flex-col items-stretch lg:items-end justify-center order-3 z-20">
              <div class="w-full max-w-xs rounded-3xl bg-white/85 dark:bg-[#0B1023]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/12 p-5 shadow-2xl space-y-4">
                <div class="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-3">
                  <span class="font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                    {{ locale === 'fr' ? 'PARAMÈTRES DU MODE' : 'MODE TELEMETRY' }}
                  </span>
                  <span class="w-2.5 h-2.5 rounded-full animate-pulse" :style="{ backgroundColor: activeShowcaseCard.glowColor }"></span>
                </div>

                <div class="grid grid-cols-2 gap-2.5 text-xs">
                  <div class="p-3 rounded-2xl bg-slate-100/80 dark:bg-white/[0.04]">
                    <span class="text-[10px] text-slate-400 block">{{ locale === 'fr' ? 'Format' : 'Format' }}</span>
                    <strong class="font-mono text-slate-900 dark:text-white mt-0.5 block">{{ activeShowcaseCard.metric }}</strong>
                  </div>
                  <div class="p-3 rounded-2xl bg-slate-100/80 dark:bg-white/[0.04]">
                    <span class="text-[10px] text-slate-400 block">{{ locale === 'fr' ? 'Durée moy.' : 'Avg. Time' }}</span>
                    <strong class="font-mono text-sky-500 mt-0.5 block">{{ activeShowcaseCard.duration }}</strong>
                  </div>
                  <div class="p-3 rounded-2xl bg-slate-100/80 dark:bg-white/[0.04]">
                    <span class="text-[10px] text-slate-400 block">{{ locale === 'fr' ? 'Barème Stats' : 'Score Scale' }}</span>
                    <strong class="font-mono text-emerald-500 mt-0.5 block">/ 15 PTS</strong>
                  </div>
                  <div class="p-3 rounded-2xl bg-slate-100/80 dark:bg-white/[0.04]">
                    <span class="text-[10px] text-slate-400 block">{{ locale === 'fr' ? 'Couverture' : 'Dataset' }}</span>
                    <strong class="font-mono text-purple-400 mt-0.5 block">{{ locale === 'fr' ? '196 ÉTATS' : '196 STATES' }}</strong>
                  </div>
                </div>

                <!-- Contrôles du Carrousel Orbital -->
                <div class="pt-1 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    @click="stepCarousel(-1)"
                    class="flex-1 py-2.5 rounded-2xl bg-slate-100 dark:bg-white/[0.06] hover:bg-indigo-500 hover:text-white text-slate-800 dark:text-white font-black text-xs transition cursor-pointer"
                  >
                    ← {{ locale === 'fr' ? 'Précédent' : 'Prev' }}
                  </button>
                  <button
                    type="button"
                    @click="stepCarousel(1)"
                    class="flex-1 py-2.5 rounded-2xl bg-slate-100 dark:bg-white/[0.06] hover:bg-indigo-500 hover:text-white text-slate-800 dark:text-white font-black text-xs transition cursor-pointer"
                  >
                    {{ locale === 'fr' ? 'Suivant' : 'Next' }} →
                  </button>
                </div>
              </div>
            </div>

          </div>

          <!-- BAS DE SCÈNE : CARROUSEL PLANÉTAIRE EN ARC 3D AVEC ILLUSTRATIONS COLORÉES -->
          <div
            class="relative z-30 w-full max-w-[1680px] mx-auto px-4 pb-6 pt-2"
            @wheel.prevent="onCarouselWheel"
            @pointerdown="onArcDragStart"
            @pointermove="onArcDragMove"
            @pointerup="onArcDragEnd"
            @pointerleave="onArcDragEnd"
          >
            <div class="arc-wheel-viewport relative w-full flex items-center justify-center">
              <article
                v-for="(card, idx) in filteredMenuCards"
                :key="'arc-card-' + card.id"
                @click="handleArcCardClick(idx, card)"
                class="arc-wheel-card group absolute w-[285px] sm:w-[325px] h-[195px] rounded-3xl border p-4.5 flex flex-col justify-between cursor-pointer select-none overflow-hidden"
                :class="idx === activeCarouselIndex
                  ? 'bg-white/95 dark:bg-[#0D142B]/95 border-indigo-400/80 shadow-[0_24px_60px_-12px_rgba(99,102,241,0.55)]'
                  : 'bg-white/75 dark:bg-[#080D1D]/80 border-slate-200/70 dark:border-white/10 backdrop-blur-xl hover:border-indigo-400/50'"
                :style="getArcWheelCardStyle(idx)"
              >
                <!-- Halo lumineux interne -->
                <div
                  class="pointer-events-none absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-2xl opacity-40 group-hover:opacity-75 transition-opacity"
                  :style="{ background: card.glowColor }"
                ></div>

                <div class="relative z-10 flex items-start justify-between gap-2">
                  <span
                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border"
                    :class="card.badgeClass"
                  >
                    <span>{{ card.badgeIcon }}</span>
                    <span>{{ card.tag }}</span>
                  </span>
                  <span class="font-mono text-[10px] font-bold text-slate-400">
                    {{ card.duration }}
                  </span>
                </div>

                <div class="relative z-10 flex items-center justify-between gap-3 my-auto">
                  <div class="min-w-0 flex-1">
                    <h3 class="text-base font-black text-slate-900 dark:text-white truncate group-hover:text-sky-400 transition-colors">
                      {{ card.title }}
                    </h3>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                      {{ card.desc }}
                    </p>
                  </div>

                  <!-- Illustration 3D colorée identique aux cartes détaillées du bas -->
                  <div class="w-16 h-16 shrink-0 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                    <svg v-if="card.art === 'worldle'" viewBox="0 0 120 120" class="w-16 h-16 drop-shadow-[0_8px_14px_rgba(56,189,248,0.4)]">
                      <circle cx="58" cy="58" r="36" fill="#1d4ed8" stroke="#7dd3fc" stroke-width="2" />
                      <path d="M36 45 Q48 34 62 42 T82 55 Q72 72 52 68 Z" fill="#34d399" />
                      <ellipse cx="58" cy="58" rx="46" ry="15" fill="none" stroke="#c084fc" stroke-width="2.5" stroke-dasharray="5 3" transform="rotate(-22 58 58)" />
                      <path d="M76 16 C68 16 62 22 62 30 C62 40 76 52 76 52 C76 52 90 40 90 30 C90 22 84 16 76 16 Z" fill="#f43f5e" stroke="#ffffff" stroke-width="1.5" />
                      <circle cx="76" cy="29" r="4.5" fill="#ffffff" />
                    </svg>

                    <svg v-else-if="card.art === 'chrono'" viewBox="0 0 120 120" class="w-16 h-16 drop-shadow-[0_8px_14px_rgba(16,185,129,0.4)]">
                      <circle cx="60" cy="54" r="34" fill="#0284c7" stroke="#6ee7b7" stroke-width="2" />
                      <path d="M42 38 Q58 32 72 44 T74 68 Q54 74 42 58 Z" fill="#fde047" />
                      <path d="M84 24 A44 44 0 0 1 60 98" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" />
                      <rect x="44" y="94" width="32" height="8" rx="4" fill="#38bdf8" />
                    </svg>

                    <svg v-else-if="card.art === 'sprint'" viewBox="0 0 120 120" class="w-16 h-16 drop-shadow-[0_8px_14px_rgba(245,158,11,0.4)]">
                      <line x1="26" y1="22" x2="38" y2="96" stroke="#cbd5e1" stroke-width="3.5" stroke-linecap="round" />
                      <path d="M27 24 Q46 18 64 28 L60 52 Q42 42 31 48 Z" fill="#f8fafc" />
                      <rect x="68" y="26" width="12" height="6" rx="2" fill="#fbbf24" />
                      <circle cx="74" cy="64" r="28" fill="#0f172a" stroke="#fbbf24" stroke-width="4.5" />
                      <line x1="74" y1="64" x2="74" y2="47" stroke="#fbbf24" stroke-width="3.5" stroke-linecap="round" />
                      <line x1="74" y1="64" x2="88" y2="64" stroke="#f43f5e" stroke-width="3" stroke-linecap="round" />
                    </svg>

                    <svg v-else-if="card.art === 'detective'" viewBox="0 0 120 120" class="w-16 h-16 drop-shadow-[0_8px_14px_rgba(168,85,247,0.4)]">
                      <rect x="44" y="26" width="44" height="58" rx="8" transform="rotate(8 66 57)" fill="#1e1b4b" stroke="#a855f7" stroke-width="2.5" />
                      <circle cx="48" cy="58" r="22" fill="rgba(56,189,248,0.22)" stroke="#38bdf8" stroke-width="4.5" />
                      <line x1="33" y1="74" x2="18" y2="90" stroke="#c084fc" stroke-width="6.5" stroke-linecap="round" />
                    </svg>

                    <svg v-else-if="card.art === 'capitals'" viewBox="0 0 120 120" class="w-16 h-16 drop-shadow-[0_8px_14px_rgba(56,189,248,0.4)]">
                      <polygon points="60,20 20,44 100,44" fill="#60a5fa" stroke="#bae6fd" stroke-width="2" />
                      <rect x="26" y="44" width="68" height="6" rx="2" fill="#3b82f6" />
                      <rect x="32" y="50" width="8" height="36" rx="2" fill="#e2e8f0" />
                      <rect x="56" y="50" width="8" height="36" rx="2" fill="#cbd5e1" />
                      <rect x="80" y="50" width="8" height="36" rx="2" fill="#94a3b8" />
                      <rect x="20" y="86" width="80" height="10" rx="3" fill="#38bdf8" />
                    </svg>

                    <svg v-else-if="card.art === 'flags'" viewBox="0 0 120 120" class="w-16 h-16 drop-shadow-[0_8px_14px_rgba(99,102,241,0.4)]">
                      <line x1="32" y1="18" x2="32" y2="98" stroke="#e2e8f0" stroke-width="4.5" stroke-linecap="round" />
                      <circle cx="32" cy="16" r="5" fill="#fbbf24" />
                      <path d="M34 24 Q58 16 78 26 T98 24 L98 66 Q78 74 58 64 T34 68 Z" fill="#3b82f6" stroke="#93c5fd" stroke-width="2" />
                      <path d="M34 38 Q58 30 78 40 T98 38 L98 52 Q78 60 58 50 T34 54 Z" fill="#f8fafc" />
                    </svg>

                    <svg v-else viewBox="0 0 120 120" class="w-16 h-16 drop-shadow-[0_8px_14px_rgba(236,72,153,0.4)]">
                      <circle cx="60" cy="58" r="34" fill="#1e1b4b" stroke="#f472b6" stroke-width="3" />
                      <circle cx="60" cy="58" r="21" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="5 4" />
                      <circle cx="60" cy="58" r="9" fill="#10b981" />
                    </svg>
                  </div>
                </div>

                <div class="relative z-10 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/[0.06] text-[11px] font-extrabold">
                  <span
                    class="flex items-center gap-1"
                    :class="idx === activeCarouselIndex ? 'text-indigo-500 dark:text-sky-400' : 'text-slate-400'"
                  >
                    <span>▶</span>
                    <span>{{ idx === activeCarouselIndex ? (locale === 'fr' ? 'Cliquer pour lancer' : 'Click to launch') : card.shortTitle }}</span>
                  </span>
                  <span class="font-mono text-[10px] text-slate-400">{{ card.metric }}</span>
                </div>
              </article>
            </div>
          </div>

        </section>

        <!-- ===================================================== -->
        <!-- 2. CATALOGUE BENTO 3D COMPLET (CARTES ILLUSTRÉES)     -->
        <!-- ===================================================== -->
        <section ref="gamesGridRef" class="max-w-[1440px] mx-auto px-4 sm:px-8 pt-14 pb-24 space-y-8">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-5">
            <div>
              <span class="text-xs font-extrabold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 block mb-1">
                {{ locale === 'fr' ? 'BIBLIOTHÈQUE COMPLÈTE // 11 EXPÉRIENCES' : 'COMPLETE LIBRARY // 11 EXPERIENCES' }}
              </span>
              <h2 class="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {{ locale === 'fr' ? 'Tous les modes en vue détaillée' : 'All Modes in Detailed View' }}
              </h2>
            </div>

            <div class="flex items-center gap-3">
              <select
                v-model="menuSortBy"
                class="px-4 py-2.5 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0B1022] text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="popular">{{ locale === 'fr' ? 'Trier : Popularité' : 'Sort by: Popularity' }}</option>
                <option value="fast">{{ locale === 'fr' ? 'Trier : Plus rapide' : 'Sort by: Shortest' }}</option>
                <option value="name">{{ locale === 'fr' ? 'Trier : Nom (A-Z)' : 'Sort by: Name (A-Z)' }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <article
              v-for="card in filteredMenuCards"
              :key="'bento-' + card.id"
              @click="card.action()"
              @pointermove="onMatrixCardMove($event, card.id)"
              @pointerleave="onMatrixCardLeave(card.id)"
              class="matrix-tilt-card group relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/[0.09] bg-white dark:bg-[#0B1022] p-6 flex items-stretch justify-between gap-4 cursor-pointer"
              :style="getMatrixCardStyle(card.id)"
            >
              <div
                class="pointer-events-none absolute -right-10 -bottom-10 w-44 h-44 rounded-full blur-3xl opacity-30 group-hover:opacity-65 transition-opacity"
                :style="{ background: card.glowColor }"
              ></div>

              <div class="relative z-10 flex flex-col justify-between flex-1 min-w-0">
                <div class="space-y-2.5">
                  <span
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold border"
                    :class="card.badgeClass"
                  >
                    <span>{{ card.badgeIcon }}</span>
                    <span>{{ card.tag }}</span>
                  </span>

                  <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors leading-snug">
                    {{ card.title }}
                  </h3>

                  <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {{ card.desc }}
                  </p>
                </div>

                <div class="pt-5 mt-3 flex items-center gap-3">
                  <span class="px-4 py-2 rounded-full bg-slate-900 dark:bg-white/[0.08] group-hover:bg-indigo-500 text-white text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap">
                    <span class="text-[10px]">▶</span>
                    <span>{{ card.cta }}</span>
                  </span>
                  <span class="font-mono text-[11px] text-slate-400 flex items-center gap-1 whitespace-nowrap">
                    <span>🕒︎</span>
                    <span>{{ card.duration }}</span>
                  </span>
                </div>
              </div>

              <!-- Emblème Visuel 3D à droite -->
              <div class="relative z-10 w-24 sm:w-28 shrink-0 flex items-center justify-center">
                <svg v-if="card.art === 'worldle'" viewBox="0 0 120 120" class="w-24 h-24 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_12px_20px_rgba(56,189,248,0.35)]">
                  <ellipse cx="60" cy="104" rx="38" ry="8" fill="rgba(56,189,248,0.22)" />
                  <circle cx="58" cy="58" r="38" fill="#1d4ed8" stroke="#7dd3fc" stroke-width="1.5" />
                  <path d="M36 45 Q48 34 62 42 T82 55 Q72 72 52 68 Z" fill="#34d399" opacity="0.85" />
                  <ellipse cx="58" cy="58" rx="48" ry="16" fill="none" stroke="#a855f7" stroke-width="2" stroke-dasharray="5 3" transform="rotate(-22 58 58)" />
                  <path d="M76 18 C68 18 62 24 62 32 C62 42 76 54 76 54 C76 54 90 42 90 32 C90 24 84 18 76 18 Z" fill="#f43f5e" stroke="#ffffff" stroke-width="1.5" />
                  <circle cx="76" cy="31" r="4.5" fill="#ffffff" />
                </svg>

                <svg v-else-if="card.art === 'chrono'" viewBox="0 0 120 120" class="w-24 h-24 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_12px_20px_rgba(16,185,129,0.35)]">
                  <ellipse cx="60" cy="105" rx="34" ry="7" fill="rgba(16,185,129,0.25)" />
                  <circle cx="60" cy="54" r="35" fill="#0284c7" stroke="#6ee7b7" stroke-width="1.5" />
                  <path d="M42 38 Q58 32 72 44 T74 68 Q54 74 42 58 Z" fill="#fde047" opacity="0.8" />
                  <path d="M84 24 A44 44 0 0 1 60 98" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" />
                  <rect x="46" y="96" width="28" height="7" rx="3.5" fill="#38bdf8" />
                </svg>

                <svg v-else-if="card.art === 'sprint'" viewBox="0 0 120 120" class="w-24 h-24 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_12px_20px_rgba(245,158,11,0.35)]">
                  <ellipse cx="62" cy="104" rx="36" ry="7" fill="rgba(245,158,11,0.25)" />
                  <line x1="26" y1="22" x2="38" y2="96" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round" />
                  <path d="M27 24 Q46 18 64 28 L60 52 Q42 42 31 48 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" />
                  <rect x="68" y="26" width="12" height="6" rx="2" fill="#fbbf24" />
                  <circle cx="74" cy="64" r="30" fill="#0f172a" stroke="#fbbf24" stroke-width="4" />
                  <line x1="74" y1="64" x2="74" y2="47" stroke="#fbbf24" stroke-width="3" stroke-linecap="round" />
                  <line x1="74" y1="64" x2="88" y2="64" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round" />
                </svg>

                <svg v-else-if="card.art === 'detective'" viewBox="0 0 120 120" class="w-24 h-24 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_12px_20px_rgba(168,85,247,0.38)]">
                  <ellipse cx="60" cy="104" rx="36" ry="7" fill="rgba(168,85,247,0.25)" />
                  <rect x="44" y="28" width="44" height="58" rx="8" transform="rotate(8 66 57)" fill="#1e1b4b" stroke="#a855f7" stroke-width="2" />
                  <circle cx="48" cy="58" r="22" fill="rgba(56,189,248,0.18)" stroke="#38bdf8" stroke-width="4" />
                  <line x1="33" y1="74" x2="18" y2="90" stroke="#c084fc" stroke-width="6" stroke-linecap="round" />
                </svg>

                <svg v-else-if="card.art === 'capitals'" viewBox="0 0 120 120" class="w-24 h-24 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_12px_20px_rgba(56,189,248,0.32)]">
                  <ellipse cx="60" cy="104" rx="38" ry="7" fill="rgba(56,189,248,0.22)" />
                  <polygon points="60,22 22,44 98,44" fill="#60a5fa" stroke="#bae6fd" stroke-width="1.5" />
                  <rect x="26" y="44" width="68" height="6" rx="2" fill="#3b82f6" />
                  <rect x="32" y="50" width="8" height="36" rx="2" fill="#e2e8f0" />
                  <rect x="48" y="50" width="8" height="36" rx="2" fill="#cbd5e1" />
                  <rect x="64" y="50" width="8" height="36" rx="2" fill="#cbd5e1" />
                  <rect x="80" y="50" width="8" height="36" rx="2" fill="#94a3b8" />
                  <rect x="20" y="86" width="80" height="10" rx="3" fill="#38bdf8" />
                </svg>

                <svg v-else-if="card.art === 'flags'" viewBox="0 0 120 120" class="w-24 h-24 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_12px_20px_rgba(99,102,241,0.38)]">
                  <ellipse cx="56" cy="104" rx="34" ry="7" fill="rgba(99,102,241,0.28)" />
                  <line x1="34" y1="20" x2="34" y2="98" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round" />
                  <circle cx="34" cy="18" r="4.5" fill="#fbbf24" />
                  <path d="M36 24 Q58 16 78 26 T98 24 L98 66 Q78 74 58 64 T36 68 Z" fill="#3b82f6" stroke="#93c5fd" stroke-width="1.5" />
                  <path d="M36 38 Q58 30 78 40 T98 38 L98 52 Q78 60 58 50 T36 54 Z" fill="#f8fafc" />
                </svg>

                <svg v-else viewBox="0 0 120 120" class="w-24 h-24 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_12px_20px_rgba(236,72,153,0.32)]">
                  <ellipse cx="60" cy="104" rx="34" ry="7" fill="rgba(236,72,153,0.22)" />
                  <circle cx="60" cy="56" r="34" fill="#1e1b4b" stroke="#f472b6" stroke-width="2.5" />
                  <circle cx="60" cy="56" r="22" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="5 4" />
                  <circle cx="60" cy="56" r="9" fill="#10b981" />
                </svg>
              </div>
            </article>
          </div>
        </section>

      </div>

      <!-- ======================================================= -->
      <!-- MODE 1 : QCM CLASSIQUES (15 QUESTIONS + BILAN DÉTAILLÉ) -->
      <!-- ======================================================= -->
      <div v-else-if="currentMode === 'qcm'" key="quiz-qcm" class="max-w-3xl mx-auto px-3 sm:px-6 pb-20">
        <transition name="card-flip-fade" mode="out-in">
          <div
            v-if="!qcmFini && currentQcmQuestion"
            :key="'qcm-q-' + qcmIndex"
            class="rounded-3xl border border-slate-200/90 dark:border-white/12 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl space-y-7"
          >
            <div class="space-y-3">
              <div class="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <div class="flex items-center gap-2.5">
                  <span class="text-sky-600 dark:text-sky-400 font-bold">
                    QUESTION {{ qcmIndex + 1 }} / {{ totalQcmQuestions }}
                  </span>
                  <span
                    v-if="qcmStreak >= 2"
                    class="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-black"
                  >
                    {{ locale === 'fr' ? `SÉRIE : ${qcmStreak}` : `STREAK: ${qcmStreak}` }}
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <span class="hidden sm:inline text-[11px] text-slate-400">
                    [{{ locale === 'fr' ? 'Touches 1-4' : 'Keys 1-4' }}]
                  </span>
                  <span class="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 font-bold">
                    SCORE : {{ qcmScore }} / {{ totalQcmQuestions }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-15 gap-1 h-2">
                <div
                  v-for="step in totalQcmQuestions"
                  :key="'step-' + step"
                  class="rounded-full transition-all duration-300"
                  :class="getQcmStepBarClass(step - 1)"
                ></div>
              </div>
            </div>

            <div class="py-3 text-center space-y-4">
              <template v-if="qcmCurrentType === 'flag'">
                <div class="inline-block p-3 rounded-2xl bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 shadow-lg">
                  <img
                    :src="`https://flagcdn.com/w320/${currentQcmQuestion.iso}.png`"
                    :alt="locale === 'fr' ? 'Drapeau mystère' : 'Mystery flag'"
                    class="h-28 sm:h-36 w-auto rounded-xl mx-auto object-contain"
                  />
                </div>
                <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {{ locale === 'fr' ? 'À quel État appartient ce drapeau ?' : 'Which country does this flag belong to?' }}
                </h2>
              </template>

              <template v-else-if="qcmCurrentType === 'capital'">
                <img
                  :src="`https://flagcdn.com/w160/${currentQcmQuestion.iso}.png`"
                  class="h-16 w-auto rounded-xl mx-auto shadow-md border border-slate-200 dark:border-white/10"
                  alt=""
                />
                <div class="space-y-1">
                  <span class="font-mono text-xs uppercase tracking-wider text-sky-500 block">
                    {{ currentQcmQuestion.subregion }}
                  </span>
                  <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {{ locale === 'fr'
                      ? `Quelle est la capitale de : ${currentQcmQuestion.name} ?`
                      : `What is the capital of ${currentQcmQuestion.name}?` }}
                  </h2>
                </div>
              </template>

              <template v-else>
                <img
                  :src="`https://flagcdn.com/w160/${currentQcmQuestion.iso}.png`"
                  class="h-16 w-auto rounded-xl mx-auto shadow-md border border-slate-200 dark:border-white/10"
                  alt=""
                />
                <div class="space-y-1">
                  <span class="font-mono text-xs uppercase tracking-wider text-fuchsia-500 block">
                    {{ qcmCultureSubType === 'currency'
                      ? (locale === 'fr' ? 'DEVISE NATIONALE' : 'NATIONAL CURRENCY')
                      : qcmCultureSubType === 'lang'
                        ? (locale === 'fr' ? 'LANGUE OFFICIELLE' : 'OFFICIAL LANGUAGE')
                        : (locale === 'fr' ? 'COMPARAISON DÉMOGRAPHIQUE' : 'DEMOGRAPHIC COMPARISON') }}
                  </span>
                  <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {{ qcmCulturePrompt }}
                  </h2>
                </div>
              </template>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                v-for="(opt, idx) in qcmOptions"
                :key="'opt-' + opt.id + '-' + idx"
                type="button"
                :disabled="qcmIsAnswered"
                @click="verifierReponseQcm(opt.id)"
                class="p-4 rounded-2xl border-2 text-left font-bold text-sm sm:text-base transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer"
                :class="getQcmOptionClass(opt.id)"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <span class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/10 font-mono text-xs font-black flex items-center justify-center shrink-0">
                    {{ idx + 1 }}
                  </span>
                  <span class="truncate">{{ getQcmOptionLabel(opt) }}</span>
                </div>
                <span v-if="qcmIsAnswered && opt.id === qcmCorrectAnswer" class="text-emerald-400 font-black shrink-0">✓</span>
                <span v-else-if="qcmIsAnswered && opt.id === qcmSelected && opt.id !== qcmCorrectAnswer" class="text-rose-400 font-black shrink-0">✕</span>
              </button>
            </div>

            <transition name="fade-slide">
              <div
                v-if="qcmIsAnswered && currentQcmQuestion.fact"
                class="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/25 text-xs text-slate-700 dark:text-slate-200 flex items-center gap-3"
              >
                <span class="font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded bg-sky-500 text-slate-950 shrink-0">
                  INFO
                </span>
                <span class="truncate">{{ currentQcmQuestion.fact }}</span>
              </div>
            </transition>
          </div>

          <div
            v-else
            key="qcm-result"
            class="rounded-3xl border border-slate-200/90 dark:border-white/15 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl space-y-8"
          >
            <div class="text-center space-y-3">
              <div class="w-16 h-16 rounded-3xl bg-sky-500/15 border border-sky-500/30 text-sky-400 mx-auto flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
              </div>

              <span class="font-mono text-xs uppercase tracking-widest text-sky-500 font-bold block">
                {{ locale === 'fr' ? 'RAPPORT DE SESSION COMPLET' : 'COMPLETE SESSION REPORT' }}
              </span>
              <h3 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                {{ locale === 'fr' ? 'Quiz terminé !' : 'Quiz Completed!' }}
              </h3>
              <p class="text-lg font-bold text-slate-600 dark:text-slate-300">
                {{ locale === 'fr' ? 'Votre score :' : 'Your score:' }}
                <strong class="font-mono text-2xl text-emerald-500 ml-1">{{ qcmScore }} / {{ totalQcmQuestions }}</strong>
                <span class="font-mono text-sm text-slate-400 ml-2">({{ Math.round((qcmScore / totalQcmQuestions) * 100) }}%)</span>
              </p>

              <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  @click="copyQcmDuelLink"
                  class="w-full sm:w-auto px-6 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  {{ qcmChallengeCopied
                    ? (locale === 'fr' ? 'Lien de défi copié !' : 'Challenge link copied!')
                    : (locale === 'fr' ? `Défier un ami sur ces ${totalQcmQuestions} questions` : `Challenge a friend on these ${totalQcmQuestions} questions`) }}
                </button>

                <button
                  type="button"
                  @click="initQcm(qcmCurrentType)"
                  class="w-full sm:w-auto px-7 py-3.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs sm:text-sm transition cursor-pointer shadow-lg shadow-sky-500/20"
                >
                  ↻ {{ locale === 'fr' ? 'Rejouer une série' : 'Play New Series' }}
                </button>
              </div>
            </div>

            <div v-if="qcmHistoryLog.length > 0" class="space-y-3 pt-6 border-t border-slate-200 dark:border-white/10">
              <h4 class="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                {{ locale === 'fr' ? 'DÉTAIL DE VOS 15 RÉPONSES' : 'YOUR 15 ANSWERS BREAKDOWN' }}
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
                <div
                  v-for="(item, idx) in qcmHistoryLog"
                  :key="'log-' + idx"
                  class="p-3 rounded-2xl border flex items-center justify-between gap-2 text-xs"
                  :class="item.isCorrect
                    ? 'bg-emerald-500/[0.07] border-emerald-500/30 text-slate-900 dark:text-white'
                    : 'bg-rose-500/[0.07] border-rose-500/30 text-slate-900 dark:text-white'"
                >
                  <div class="flex items-center gap-2.5 min-w-0">
                    <span class="font-mono text-[10px] opacity-60">#{{ idx + 1 }}</span>
                    <img :src="`https://flagcdn.com/w40/${item.iso}.png`" class="h-4 w-auto rounded-2xs shrink-0" alt="" />
                    <div class="min-w-0">
                      <strong class="block truncate">{{ item.countryName }}</strong>
                      <span class="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                        {{ item.correctLabel }}
                      </span>
                    </div>
                  </div>
                  <span class="font-black shrink-0" :class="item.isCorrect ? 'text-emerald-400' : 'text-rose-400'">
                    {{ item.isCorrect ? '✓' : '✕' }}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </transition>
      </div>

      <!-- ======================================================= -->
      <!-- MODE 2 : SPRINT 60 SECONDES (JAUGE CIRCULAIRE & COMBO)  -->
      <!-- ======================================================= -->
      <div v-else-if="currentMode === 'flash60'" key="quiz-flash60" class="max-w-3xl mx-auto px-3 sm:px-6 pb-20">
        <div
          v-if="!flashFinished && currentFlashQuestion"
          class="rounded-3xl border border-amber-500/30 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl space-y-6"
        >
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
            <div class="flex items-center gap-3.5">
              <div class="relative w-14 h-14 flex items-center justify-center">
                <svg class="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="4" class="text-slate-200 dark:text-white/10" />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="4"
                    stroke-linecap="round"
                    :stroke-dasharray="125.6"
                    :stroke-dashoffset="125.6 - (Math.min(60, flashTimeLeft) / 60) * 125.6"
                    :class="flashTimeLeft <= 10 ? 'text-rose-500' : 'text-amber-400'"
                  />
                </svg>
                <span class="absolute font-mono text-sm font-black text-slate-900 dark:text-white">
                  {{ flashTimeLeft }}s
                </span>
              </div>

              <div>
                <span class="font-mono text-[10px] uppercase tracking-wider text-slate-400 block">
                  {{ locale === 'fr' ? 'CHRONOMÈTRE SPRINT' : 'SPRINT TIMER' }}
                </span>
                <span
                  v-if="flashBonusToast"
                  class="font-mono text-xs font-black text-emerald-400 animate-bounce block"
                >
                  +2 SECONDES BONUS !
                </span>
                <span v-else class="text-xs text-slate-500">
                  {{ locale === 'fr' ? '+2s toutes les 4 bonnes réponses' : '+2s every 4 streak hits' }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2.5 font-mono text-xs">
              <span class="px-3.5 py-2 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-500/35 text-fuchsia-400 font-black">
                COMBO x{{ flashMultiplier }} ({{ flashStreak }})
              </span>
              <span class="px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 font-black text-sm">
                {{ flashScore }} PTS
              </span>
            </div>
          </div>

          <div class="text-center py-3 space-y-3">
            <img
              :src="`https://flagcdn.com/w160/${currentFlashQuestion.iso}.png`"
              class="h-16 w-auto rounded-xl mx-auto shadow-md border border-slate-200 dark:border-white/10"
              alt=""
            />
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {{ flashAskFlag
                ? (locale === 'fr' ? 'Quel est ce pays ?' : 'Which country is this?')
                : (locale === 'fr' ? `Capitale de : ${currentFlashQuestion.name} ?` : `Capital of ${currentFlashQuestion.name}?`) }}
            </h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              v-for="(opt, idx) in flashOptions"
              :key="'fl-' + opt.id"
              type="button"
              @click="submitFlashAnswer(opt.id)"
              class="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] hover:border-amber-400 hover:bg-amber-500/10 text-slate-900 dark:text-white font-bold text-sm sm:text-base transition cursor-pointer flex items-center gap-3 text-left"
            >
              <span class="w-6 h-6 rounded-md bg-slate-200/70 dark:bg-white/10 font-mono text-xs font-black flex items-center justify-center shrink-0">
                {{ idx + 1 }}
              </span>
              <span class="truncate">{{ flashAskFlag ? opt.name : opt.capital }}</span>
            </button>
          </div>
        </div>

        <div
          v-else
          class="rounded-3xl border border-slate-200 dark:border-white/15 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-8 sm:p-12 text-center shadow-2xl space-y-6"
        >
          <span class="font-mono text-xs font-bold uppercase tracking-widest text-amber-400 block">
            SPRINT 60 SECONDES TERMINÉ
          </span>
          <h3 class="text-4xl font-black text-slate-900 dark:text-white">
            {{ flashScore }} {{ locale === 'fr' ? 'Points' : 'Points' }}
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            {{ locale === 'fr'
              ? `${flashCorrectCount} bonnes réponses • Meilleure série : ${flashBestStreak} • Note enregistrée : ${Math.min(15, Math.round((flashScore / 30) * 15))}/15`
              : `${flashCorrectCount} correct answers • Best streak: ${flashBestStreak} • Normalized score: ${Math.min(15, Math.round((flashScore / 30) * 15))}/15` }}
          </p>
          <button
            type="button"
            @click="startFlash60"
            class="px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition cursor-pointer"
          >
            ↻ {{ locale === 'fr' ? 'Relancer un Sprint 60s' : 'Play 60s Sprint Again' }}
          </button>
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- MODE 3 : LE PAYS MYSTÈRE (WORLDLE + GLOBE RADAR 3D)     -->
      <!-- ======================================================= -->
      <div v-else-if="currentMode === 'mystery'" key="quiz-mystery" class="max-w-5xl mx-auto px-3 sm:px-6 pb-20">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          <div class="lg:col-span-7 rounded-3xl border border-slate-200/90 dark:border-white/12 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-4 sm:p-7 shadow-2xl space-y-5 overflow-hidden">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-white/10">
              <div>
                <span class="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                  {{ mysteryIsDaily ? (locale === 'fr' ? 'Pays du Jour Officiel' : 'Official Daily Country') : (locale === 'fr' ? 'Entraînement Infini' : 'Infinite Practice Mode') }}
                </span>
                <h3 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2 leading-tight">
                  {{ locale === 'fr' ? 'Devinez le Pays Mystère en 6 essais' : 'Guess the Mystery Country in 6 tries' }}
                </h3>
              </div>

              <button
                type="button"
                @click="startInfiniteMystery"
                class="self-start sm:self-auto px-4 py-2 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-sky-500 hover:text-white text-slate-800 dark:text-white text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0"
              >
                ↻ {{ locale === 'fr' ? 'Nouveau pays aléatoire' : 'New Random Country' }}
              </button>
            </div>

            <div v-if="!mysteryFinished" class="space-y-3">
              <div class="flex flex-col sm:flex-row items-center sm:items-stretch gap-2.5 sm:gap-2">
                <input
                  v-model="mysteryQuery"
                  @keydown.enter.prevent="submitMysteryGuess()"
                  type="text"
                  :placeholder="locale === 'fr' ? `Essai ${mysteryGuesses.length + 1}/6 : Tapez le nom d'un pays...` : `Try ${mysteryGuesses.length + 1}/6: Type a country name...`"
                  class="w-full sm:flex-1 min-w-0 px-4 py-3 sm:py-3.5 rounded-xl border-2 border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm sm:text-base font-bold focus:outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  @click="submitMysteryGuess()"
                  class="w-2/3 sm:w-auto mx-auto sm:mx-0 px-6 py-3 sm:py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm transition cursor-pointer text-center shrink-0 shadow-md"
                >
                  {{ locale === 'fr' ? 'Valider' : 'Guess' }}
                </button>
              </div>

              <div v-if="mysterySuggestions.length > 0" class="flex flex-wrap gap-2 pt-1">
                <button
                  v-for="sug in mysterySuggestions"
                  :key="sug.id"
                  type="button"
                  @click="submitMysteryGuess(sug)"
                  class="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500 hover:text-white text-slate-800 dark:text-slate-200 border border-sky-500/25 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  <img :src="`https://flagcdn.com/w20/${sug.iso}.png`" class="h-3.5 w-auto rounded-2xs shrink-0" alt="" />
                  <span class="truncate max-w-[210px]">{{ sug.name }}</span>
                </button>
              </div>
            </div>

            <div class="space-y-2.5">
              <div
                v-for="slot in 6"
                :key="'mys-slot-' + slot"
                class="min-h-[3.5rem] rounded-2xl px-3.5 py-2.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-x-2 gap-y-1.5 border transition-all"
                :class="mysteryGuesses[slot - 1]
                  ? (mysteryGuesses[slot - 1].isCorrect
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-lg'
                      : 'bg-slate-50 dark:bg-slate-900/90 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white')
                  : 'bg-slate-50/40 dark:bg-white/[0.02] border-dashed border-slate-200 dark:border-white/10 text-slate-400'"
              >
                <template v-if="mysteryGuesses[slot - 1]">
                  <div class="flex items-center gap-2.5 min-w-[125px] flex-1">
                    <img
                      :src="`https://flagcdn.com/w40/${mysteryGuesses[slot - 1].iso}.png`"
                      class="h-4 sm:h-5 w-auto rounded-xs shadow-2xs shrink-0"
                      alt=""
                    />
                    <strong class="text-sm sm:text-base font-extrabold leading-tight break-words">
                      {{ mysteryGuesses[slot - 1].name }}
                    </strong>
                  </div>

                  <div class="flex items-center gap-1.5 sm:gap-2.5 shrink-0 font-mono text-xs sm:text-sm font-extrabold ml-auto">
                    <span class="whitespace-nowrap">{{ mysteryGuesses[slot - 1].distanceKm.toLocaleString() }} km</span>
                    <span class="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-black/10 dark:bg-white/10 whitespace-nowrap">
                      {{ mysteryGuesses[slot - 1].direction }}
                    </span>
                    <span
                      class="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg whitespace-nowrap"
                      :class="mysteryGuesses[slot - 1].isCorrect ? 'bg-white text-emerald-700' : 'bg-sky-500/15 text-sky-600 dark:text-sky-300'"
                    >
                      {{ mysteryGuesses[slot - 1].proximity }}%
                    </span>
                  </div>
                </template>

                <template v-else>
                  <span class="font-mono text-xs">{{ locale === 'fr' ? `Essai ${slot} / 6` : `Try ${slot} / 6` }}</span>
                </template>
              </div>
            </div>

            <div
              v-if="mysteryFinished && mysteryTarget"
              class="p-5 sm:p-6 rounded-2xl border text-center space-y-4"
              :class="mysteryWon
                ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-900 dark:text-white'
                : 'bg-amber-500/10 border-amber-500/40 text-slate-900 dark:text-white'"
            >
              <img :src="`https://flagcdn.com/w160/${mysteryTarget.iso}.png`" class="h-16 w-auto mx-auto rounded-lg shadow" alt="" />
              <div>
                <h4 class="text-xl sm:text-2xl font-black">
                  {{ mysteryWon
                    ? (locale === 'fr' ? `Bravo ! Trouvé en ${mysteryGuesses.length}/6 : ${mysteryTarget.name}` : `Well done! Found in ${mysteryGuesses.length}/6: ${mysteryTarget.name}`)
                    : (locale === 'fr' ? `Le pays mystère était : ${mysteryTarget.name}` : `The mystery country was: ${mysteryTarget.name}`) }}
                </h4>
                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {{ t('common.capital') }} : <strong>{{ mysteryTarget.capital }}</strong> • {{ mysteryTarget.subregion }} • {{ mysteryTarget.fact }}
                </p>
              </div>

              <div class="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  @click="copyMysteryShareGrid"
                  class="w-full sm:w-auto px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition cursor-pointer"
                >
                  {{ mysteryCopied ? (locale === 'fr' ? 'Grille copiée !' : 'Grid copied!') : (locale === 'fr' ? 'Partager mon résultat (🟩🟨⬛)' : 'Share Result (🟩🟨⬛)') }}
                </button>
                <button
                  type="button"
                  @click="startInfiniteMystery"
                  class="w-full sm:w-auto px-5 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs sm:text-sm transition cursor-pointer"
                >
                  ↻ {{ locale === 'fr' ? 'Rejouer avec un autre pays' : 'Play another country' }}
                </button>
              </div>
            </div>
          </div>

          <div class="lg:col-span-5 rounded-3xl border border-slate-200/90 dark:border-white/12 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-5 shadow-2xl flex flex-col items-center space-y-4">
            <div class="w-full flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-200 dark:border-white/10 pb-3">
              <span class="text-sky-400 font-bold">
                {{ locale === 'fr' ? 'RADAR DE TRIANGULATION 3D' : '3D TRIANGULATION RADAR' }}
              </span>
              <span>{{ mysteryGuesses.length }} / 6 POINTS</span>
            </div>

            <canvas
              ref="mysteryGlobeCanvasRef"
              class="w-[290px] h-[290px] sm:w-[330px] sm:h-[330px] cursor-grab active:cursor-grabbing select-none"
              @pointerdown="onQuizGlobePointerDown"
              @pointermove="onQuizGlobePointerMove"
              @pointerup="onQuizGlobePointerUp"
              @pointerleave="onQuizGlobePointerUp"
            ></canvas>

            <p class="text-[11px] text-center text-slate-500 dark:text-slate-400 leading-relaxed">
              {{ locale === 'fr'
                ? 'Vos essais s\'allument sur le globe 3D selon leur proximité thermique (bleu → ambre → émeraude). Faites tourner la sphère pour trianguler la cible.'
                : 'Your guesses light up on the 3D globe by thermal proximity (blue → amber → emerald). Rotate the sphere to triangulate the target.' }}
            </p>
          </div>

        </div>
      </div>

      <!-- ======================================================= -->
      <!-- MODE 4 : ENQUÊTE AUX 5 INDICES (CARTES 3D RECTO-VERSO)  -->
      <!-- ======================================================= -->
      <div v-else-if="currentMode === 'detective'" key="quiz-detective" class="max-w-4xl mx-auto px-3 sm:px-6 pb-20">
        <div
          v-if="!detectiveFinished && detectiveTarget"
          class="rounded-3xl border border-slate-200 dark:border-white/12 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl space-y-6"
        >
          <div class="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-white/10 font-mono text-xs">
            <span class="text-emerald-500 font-bold">
              {{ locale === 'fr' ? `DOSSIER D'ENQUÊTE ${detectiveRound + 1} / 5` : `CASE FILE ${detectiveRound + 1} / 5` }}
            </span>
            <span class="px-3.5 py-1 rounded-full bg-sky-500/15 text-sky-400 font-bold">
              SCORE : {{ detectiveScore }} / 25 PTS
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div
              v-for="(clue, idx) in currentDetectiveClues"
              :key="'clue-' + idx"
              class="clue-3d-scene"
              @click="idx === detectiveCluesRevealed && !detectiveRoundAnswered ? detectiveCluesRevealed++ : null"
            >
              <div class="clue-3d-inner" :class="{ 'is-flipped': idx < detectiveCluesRevealed }">
                <div class="clue-3d-face clue-3d-front rounded-2xl border border-dashed border-slate-300 dark:border-white/15 bg-slate-100/60 dark:bg-white/[0.03] p-4 flex flex-col items-center justify-between text-center">
                  <span class="font-mono text-[10px] font-bold uppercase text-slate-400">
                    {{ locale === 'fr' ? `INDICE #${idx + 1}` : `CLUE #${idx + 1}` }}
                  </span>
                  <div class="w-9 h-9 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-400 flex items-center justify-center font-mono text-xs font-black">
                    ?
                  </div>
                  <span class="text-[10px] font-bold text-sky-500">
                    {{ idx === detectiveCluesRevealed ? (locale === 'fr' ? 'Cliquer pour révéler' : 'Click to reveal') : `${6 - (idx + 1)} pts` }}
                  </span>
                </div>

                <div class="clue-3d-face clue-3d-back rounded-2xl border border-sky-500/40 bg-sky-500/[0.08] p-3.5 flex flex-col justify-between">
                  <span class="font-mono text-[10px] font-bold uppercase text-sky-400">
                    {{ locale === 'fr' ? `INDICE #${idx + 1}` : `CLUE #${idx + 1}` }}
                  </span>
                  <div class="my-auto py-1">
                    <template v-if="clue.type === 'flag'">
                      <img :src="`https://flagcdn.com/w80/${detectiveTarget.iso}.png`" class="h-10 w-auto rounded shadow mx-auto" alt="" />
                    </template>
                    <template v-else>
                      <span class="text-[10px] text-slate-400 block">{{ clue.label }}</span>
                      <strong class="text-xs font-extrabold text-slate-900 dark:text-white leading-snug block mt-0.5">
                        {{ clue.value }}
                      </strong>
                    </template>
                  </div>
                  <span class="font-mono text-[9px] text-emerald-400 font-bold">DÉVERROUILLÉ</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3">
            <button
              v-if="detectiveCluesRevealed < 5 && !detectiveRoundAnswered"
              type="button"
              @click="detectiveCluesRevealed++"
              class="px-4 py-2.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-500 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              ↻ {{ locale === 'fr' ? `Retourner l'indice #${detectiveCluesRevealed + 1} (${6 - (detectiveCluesRevealed + 1)} pts max)` : `Flip clue #${detectiveCluesRevealed + 1} (${6 - (detectiveCluesRevealed + 1)} pts max)` }}
            </button>
            <span class="font-mono text-xs text-slate-400 ml-auto">
              {{ locale === 'fr' ? `Gain potentiel : ${6 - detectiveCluesRevealed} pt(s)` : `Potential reward: ${6 - detectiveCluesRevealed} pt(s)` }}
            </span>
          </div>

          <div v-if="!detectiveRoundAnswered" class="space-y-2.5">
            <div class="flex flex-col sm:flex-row gap-2.5">
              <input
                v-model="detectiveQuery"
                @keydown.enter.prevent="submitDetectiveGuess()"
                type="text"
                :placeholder="locale === 'fr' ? 'Quel est cet État ?' : 'Which country is this?'"
                class="w-full sm:flex-1 min-w-0 px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:border-sky-500"
              />
              <button
                type="button"
                @click="submitDetectiveGuess()"
                class="w-2/3 sm:w-auto mx-auto sm:mx-0 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs sm:text-sm transition cursor-pointer shrink-0"
              >
                {{ locale === 'fr' ? 'Identifier' : 'Identify' }}
              </button>
            </div>

            <div v-if="detectiveSuggestions.length > 0" class="flex flex-wrap gap-1.5">
              <button
                v-for="sug in detectiveSuggestions"
                :key="'det-' + sug.id"
                type="button"
                @click="submitDetectiveGuess(sug)"
                class="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-sky-500 hover:text-white text-xs font-bold transition cursor-pointer"
              >
                {{ sug.name }}
              </button>
            </div>
          </div>

          <div
            v-else
            class="p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4"
            :class="detectiveRoundWon ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-rose-500/10 border-rose-500/40'"
          >
            <div class="flex items-center gap-3">
              <img :src="`https://flagcdn.com/w80/${detectiveTarget.iso}.png`" class="h-10 w-auto rounded shadow" alt="" />
              <div>
                <strong class="text-base font-black text-slate-900 dark:text-white block">
                  {{ detectiveTarget.name }} ({{ detectiveTarget.capital }})
                </strong>
                <span class="text-xs text-slate-500 dark:text-slate-300">
                  {{ detectiveRoundWon
                    ? (locale === 'fr' ? `Identifié avec ${detectiveCluesRevealed} indice(s) !` : `Identified with ${detectiveCluesRevealed} clue(s)!`)
                    : (locale === 'fr' ? 'Non trouvé sur ce dossier.' : 'Missed on this case.') }}
                </span>
              </div>
            </div>
            <button
              type="button"
              @click="nextDetectiveRound"
              class="px-5 py-2.5 rounded-full bg-sky-500 text-slate-950 font-black text-xs cursor-pointer shrink-0"
            >
              {{ detectiveRound < 4 ? (locale === 'fr' ? 'Dossier suivant →' : 'Next case →') : (locale === 'fr' ? 'Voir le bilan →' : 'Final report →') }}
            </button>
          </div>
        </div>

        <div
          v-else
          class="rounded-3xl border border-slate-200 dark:border-white/15 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-8 sm:p-12 text-center shadow-2xl space-y-5"
        >
          <h3 class="text-3xl font-black text-slate-900 dark:text-white">
            {{ locale === 'fr' ? 'Enquêtes terminées !' : 'Investigations Complete!' }}
          </h3>
          <p class="font-mono text-2xl font-black text-emerald-400">
            {{ detectiveScore }} / 25 PTS
          </p>
          <button
            type="button"
            @click="initDetective"
            class="px-7 py-3.5 rounded-full bg-sky-500 text-slate-950 font-black text-sm cursor-pointer"
          >
            ↻ {{ locale === 'fr' ? 'Nouvelle série d\'enquêtes' : 'New Investigation Series' }}
          </button>
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- MODE 5 : DÉFIS CHRONO (GLOBE 3D + CARTE 2D 100% MUETTE) -->
      <!-- ======================================================= -->
      <div v-else-if="currentMode === 'chrono'" key="quiz-chrono" class="max-w-[1400px] mx-auto px-3 sm:px-6 pb-20 space-y-6">
        <div class="rounded-3xl border border-slate-200 dark:border-white/12 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-5 sm:p-7 shadow-2xl space-y-5">

          <div class="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                @click="changerPorteeChrono('europe')"
                class="px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer"
                :class="chronoScope === 'europe' ? 'bg-sky-500 text-slate-950 font-black' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300'"
              >
                Europe (47)
              </button>
              <button
                type="button"
                @click="changerPorteeChrono('world')"
                class="px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer"
                :class="chronoScope === 'world' ? 'bg-sky-500 text-slate-950 font-black' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300'"
              >
                {{ locale === 'fr' ? 'Monde entier (196)' : 'Full World (196)' }}
              </button>

              <div class="h-5 w-px bg-slate-200 dark:bg-white/10 mx-1"></div>

              <div class="flex items-center p-1 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  @click="chronoViewMode = 'globe3d'"
                  class="px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer"
                  :class="chronoViewMode === 'globe3d' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-500 dark:text-slate-300'"
                >
                  {{ locale === 'fr' ? 'Globe 3D Interactif' : '3D Interactive Globe' }}
                </button>
                <button
                  type="button"
                  @click="chronoViewMode = 'map2d'"
                  class="px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer"
                  :class="chronoViewMode === 'map2d' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-500 dark:text-slate-300'"
                >
                  {{ locale === 'fr' ? 'Carte Muette 2D' : '2D Blank Map' }}
                </button>
              </div>

              <div class="h-5 w-px bg-slate-200 dark:bg-white/10 mx-1"></div>

              <button
                v-for="preset in chronoAvailablePresets"
                :key="preset.sec"
                type="button"
                @click="changerDureeChrono(preset.sec)"
                class="px-3 py-1.5 rounded-full font-mono text-xs font-bold transition cursor-pointer"
                :class="chronoDuration === preset.sec
                  ? 'bg-sky-500/20 border border-sky-500/40 text-sky-400'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-500'"
              >
                {{ preset.label }}
              </button>
            </div>

            <div class="flex items-center gap-2.5 font-mono">
              <span class="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-black">
                {{ chronoFoundIds.length }} / {{ chronoTargetCountries.length }} ({{ Math.round((chronoFoundIds.length / chronoTargetCountries.length) * 100) }}%)
              </span>
              <span class="px-4 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-sm font-black">
                {{ chronoDuration === 0 ? '∞' : formatTime(chronoTimeLeft) }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            <div class="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-stretch gap-2.5">
              <input
                v-model="chronoInput"
                @input="verifierSaisieChrono(false)"
                @keydown.enter.prevent="verifierSaisieChrono(true)"
                :disabled="chronoFini"
                type="text"
                :placeholder="locale === 'fr' ? 'Tapez un pays (ex: France, RDC, USA, Pays-Bas)...' : 'Type a country (e.g., France, USA, UK)...'"
                autocomplete="off"
                spellcheck="false"
                class="w-full sm:flex-1 min-w-0 px-4 py-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm sm:text-base font-bold transition-colors focus:outline-none"
                :class="chronoDuplicateMsg ? 'border-amber-500' : 'border-slate-200 dark:border-white/15 focus:border-sky-500'"
              />
              <button
                v-if="!chronoFini"
                type="button"
                @click="terminerChrono"
                class="w-2/3 sm:w-auto mx-auto sm:mx-0 px-5 py-3 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/30 text-xs font-bold transition cursor-pointer shrink-0 text-center"
              >
                {{ locale === 'fr' ? 'Révéler les manquants' : 'Give up & Reveal' }}
              </button>
              <button
                v-else
                type="button"
                @click="demarrerChrono"
                class="w-2/3 sm:w-auto mx-auto sm:mx-0 px-6 py-3 rounded-xl bg-sky-500 text-slate-950 text-xs font-black transition cursor-pointer shrink-0 text-center"
              >
                ↻ {{ locale === 'fr' ? 'Rejouer' : 'Play Again' }}
              </button>
            </div>

            <div class="lg:col-span-5 flex items-center justify-end">
              <div
                v-if="chronoDuplicateMsg"
                class="w-full px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-bold flex items-center gap-2"
              >
                <span>⚠️ {{ chronoDuplicateMsg }}</span>
              </div>
              <div
                v-else-if="chronoLastFoundCountry"
                class="w-full px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 text-xs font-bold flex items-center justify-between gap-2"
              >
                <div class="flex items-center gap-2.5 truncate">
                  <img :src="`https://flagcdn.com/w40/${chronoLastFoundCountry.iso}.png`" class="h-4 w-auto rounded-2xs shrink-0" alt="" />
                  <span class="truncate">{{ locale === 'fr' ? 'Validé :' : 'Found:' }} <strong>{{ chronoLastFoundCountry.name }}</strong> ({{ chronoLastFoundCountry.capital }})</span>
                </div>
                <span class="font-mono text-[10px] shrink-0">✓</span>
              </div>
            </div>
          </div>

          <div
            v-if="chronoViewMode === 'globe3d'"
            class="relative rounded-3xl border border-slate-200 dark:border-white/10 bg-[#050811] py-6 px-4 flex flex-col items-center justify-center overflow-hidden min-h-[430px]"
          >
            <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.12),transparent_70%)]"></div>

            <canvas
              ref="chronoGlobeCanvasRef"
              class="relative z-10 w-[330px] h-[330px] sm:w-[420px] sm:h-[420px] cursor-grab active:cursor-grabbing select-none"
              @pointerdown="onQuizGlobePointerDown"
              @pointermove="onQuizGlobePointerMove"
              @pointerup="onQuizGlobePointerUp"
              @pointerleave="onQuizGlobePointerUp"
            ></canvas>

            <div class="relative z-10 mt-3 flex flex-wrap items-center justify-center gap-4 font-mono text-[11px] text-slate-400">
              <span class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>{{ locale === 'fr' ? 'Pays trouvés' : 'Found countries' }} ({{ chronoFoundIds.length }})</span>
              </span>
              <span class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
                <span>{{ locale === 'fr' ? 'Restants à deviner' : 'Remaining' }} ({{ chronoTargetCountries.length - chronoFoundIds.length }})</span>
              </span>
            </div>
          </div>

          <div
            v-else
            class="quiz-mute-map h-[390px] sm:h-[450px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 relative z-0"
            :class="{ 'is-dark-mute': blankMapStyle === 'physical' }"
          >
            <div class="absolute top-3 right-3 z-[400] flex items-center gap-1 p-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white">
              <button
                type="button"
                @click="blankMapStyle = 'physical'"
                class="px-3 py-1 rounded-full transition cursor-pointer"
                :class="blankMapStyle === 'physical' ? 'bg-sky-500 text-slate-950 font-black' : 'text-slate-300'"
              >
                {{ locale === 'fr' ? 'Carte Muette' : 'Blank Map' }}
              </button>
              <button
                type="button"
                @click="blankMapStyle = 'satellite'"
                class="px-3 py-1 rounded-full transition cursor-pointer"
                :class="blankMapStyle === 'satellite' ? 'bg-sky-500 text-slate-950 font-black' : 'text-slate-300'"
              >
                Satellite
              </button>
            </div>

            <l-map
              v-model:zoom="chronoMapZoom"
              v-model:center="chronoMapCenter"
              :min-zoom="2"
              :max-zoom="6"
              :use-global-leaflet="false"
            >
              <l-tile-layer :key="blankMapStyle" :url="blankTileUrl" :no-wrap="false"></l-tile-layer>

              <l-polyline
                v-for="(ring, rIdx) in leafletWorldRings"
                :key="'chr-border-' + rIdx"
                :lat-lngs="ring"
                :color="'#38bdf8'"
                :weight="0.85"
                :options="{ opacity: 0.35, interactive: false }"
              ></l-polyline>

              <l-circle-marker
                v-for="country in chronoTargetCountries"
                :key="'chr-m-' + country.id"
                :lat-lng="[country.lat, country.lng]"
                :radius="chronoFoundSet.has(country.id) ? 7.5 : (chronoFini ? 6 : 4.5)"
                :color="chronoFoundSet.has(country.id) ? '#10b981' : (chronoFini ? '#f43f5e' : '#64748b')"
                :fill-color="chronoFoundSet.has(country.id) ? '#10b981' : (chronoFini ? '#f43f5e' : '#475569')"
                :fill-opacity="0.88"
              >
                <l-popup v-if="chronoFoundSet.has(country.id) || chronoFini">
                  <strong class="text-xs">{{ country.name }}</strong>
                </l-popup>
              </l-circle-marker>
            </l-map>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            <div
              v-for="group in chronoContinentGroups"
              :key="group.continent"
              class="p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]"
            >
              <div class="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-200 dark:border-white/10 text-xs font-black">
                <span class="text-sky-500">{{ group.label }}</span>
                <span class="font-mono">{{ group.foundCount }} / {{ group.countries.length }}</span>
              </div>
              <div class="grid grid-cols-2 gap-1.5 text-xs">
                <div
                  v-for="c in group.countries"
                  :key="'grid-c-' + c.id"
                  class="px-2 py-1 rounded truncate font-medium flex items-center gap-1.5"
                  :class="chronoFoundSet.has(c.id)
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-bold'
                    : chronoFini
                      ? 'bg-rose-500/15 text-rose-400 font-semibold'
                      : 'bg-slate-200/50 dark:bg-white/[0.03] text-transparent select-none'"
                >
                  <img
                    v-if="chronoFoundSet.has(c.id) || chronoFini"
                    :src="`https://flagcdn.com/w20/${c.iso}.png`"
                    class="h-3 w-auto rounded-2xs shrink-0"
                    alt=""
                  />
                  <span class="truncate">{{ chronoFoundSet.has(c.id) || chronoFini ? c.name : '••••••••' }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- ======================================================= -->
      <!-- MODE 6 : CLIQUEZ SUR LA CARTE MUETTE (STYLE SETERRA)    -->
      <!-- ======================================================= -->
      <div v-else-if="currentMode === 'map-click'" key="quiz-mapclick" class="max-w-[1400px] mx-auto px-3 sm:px-6 pb-20 space-y-5">
        <div class="rounded-3xl border border-slate-200 dark:border-white/12 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-5 sm:p-7 shadow-2xl space-y-5">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="initMapClick('europe')"
                class="px-4 py-2 rounded-full text-xs font-bold cursor-pointer transition"
                :class="mapClickScope === 'europe' ? 'bg-sky-500 text-slate-950 font-black' : 'bg-slate-100 dark:bg-white/5 text-slate-400'"
              >
                Europe (20)
              </button>
              <button
                type="button"
                @click="initMapClick('world')"
                class="px-4 py-2 rounded-full text-xs font-bold cursor-pointer transition"
                :class="mapClickScope === 'world' ? 'bg-sky-500 text-slate-950 font-black' : 'bg-slate-100 dark:bg-white/5 text-slate-400'"
              >
                {{ locale === 'fr' ? 'Sprint Monde (25)' : 'World Sprint (25)' }}
              </button>
            </div>

            <div v-if="!mapClickFinished && currentMapClickTarget" class="flex items-center gap-3">
              <img :src="`https://flagcdn.com/w80/${currentMapClickTarget.iso}.png`" class="h-7 w-auto rounded shadow" alt="" />
              <span class="text-base sm:text-xl font-black text-slate-900 dark:text-white">
                {{ locale === 'fr' ? `Localisez : ${currentMapClickTarget.name}` : `Locate: ${currentMapClickTarget.name}` }}
              </span>
              <button
                type="button"
                @click="skipMapClickTarget"
                class="px-3 py-1 rounded-full bg-slate-200 dark:bg-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                {{ locale === 'fr' ? 'Passer →' : 'Skip →' }}
              </button>
            </div>

            <span class="font-mono text-xs font-black px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400">
              SCORE : {{ mapClickScore }} / {{ mapClickTargets.length }}
            </span>
          </div>

          <div
            class="quiz-mute-map h-[440px] sm:h-[500px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 relative z-0"
            :class="{ 'is-dark-mute': blankMapStyle === 'physical' }"
          >
            <div class="absolute top-3 right-3 z-[400] flex items-center gap-1 p-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white">
              <button
                type="button"
                @click="blankMapStyle = 'physical'"
                class="px-3 py-1 rounded-full transition cursor-pointer"
                :class="blankMapStyle === 'physical' ? 'bg-sky-500 text-slate-950 font-black' : 'text-slate-300'"
              >
                {{ locale === 'fr' ? 'Carte Muette' : 'Blank Map' }}
              </button>
              <button
                type="button"
                @click="blankMapStyle = 'satellite'"
                class="px-3 py-1 rounded-full transition cursor-pointer"
                :class="blankMapStyle === 'satellite' ? 'bg-sky-500 text-slate-950 font-black' : 'text-slate-300'"
              >
                Satellite
              </button>
            </div>

            <l-map
              v-model:zoom="mapClickZoom"
              v-model:center="mapClickCenter"
              :min-zoom="2"
              :max-zoom="7"
              :use-global-leaflet="false"
            >
              <l-tile-layer :key="blankMapStyle" :url="blankTileUrl" :no-wrap="false"></l-tile-layer>

              <l-polyline
                v-for="(ring, rIdx) in leafletWorldRings"
                :key="'mc-border-' + rIdx"
                :lat-lngs="ring"
                :color="'#38bdf8'"
                :weight="0.85"
                :options="{ opacity: 0.35, interactive: false }"
              ></l-polyline>

              <l-circle-marker
                v-for="country in mapClickPool"
                :key="'mc-' + country.id"
                :lat-lng="[country.lat, country.lng]"
                :radius="mapClickDoneIds.has(country.id) ? 7.5 : 6.5"
                :color="mapClickDoneIds.has(country.id) ? '#10b981' : (mapClickLastWrongId === country.id ? '#f43f5e' : '#38bdf8')"
                :fill-color="mapClickDoneIds.has(country.id) ? '#10b981' : (mapClickLastWrongId === country.id ? '#f43f5e' : '#0ea5e9')"
                :fill-opacity="0.88"
                @click="handleMapClickCountry(country)"
              ></l-circle-marker>
            </l-map>
          </div>
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- MODE 7 : FLASHCARDS 3D INTERACTIVES (ACQUIS / À REVOIR) -->
      <!-- ======================================================= -->
      <div v-else-if="currentMode === 'flashcards'" key="quiz-flashcards" class="max-w-2xl mx-auto px-3 sm:px-6 pb-20 space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-2">
            <select
              v-model="selectedFlashContinent"
              @change="changerContinentFlash"
              class="px-4 py-2.5 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="all">{{ locale === 'fr' ? 'Tous les continents (196)' : 'All continents (196)' }}</option>
              <option value="Europe">Europe (47)</option>
              <option value="Asia">{{ locale === 'fr' ? 'Asie (46)' : 'Asia (46)' }}</option>
              <option value="Africa">{{ locale === 'fr' ? 'Afrique (54)' : 'Africa (54)' }}</option>
              <option value="North America">{{ locale === 'fr' ? 'Amérique du Nord (23)' : 'North America (23)' }}</option>
              <option value="South America">{{ locale === 'fr' ? 'Amérique du Sud (12)' : 'South America (12)' }}</option>
              <option value="Oceania">{{ locale === 'fr' ? 'Océanie (14)' : 'Oceania (14)' }}</option>
            </select>

            <button
              type="button"
              @click="melangerFlashcards"
              class="px-4 py-2.5 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 hover:border-sky-500 text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer"
            >
              {{ locale === 'fr' ? 'Mélanger le paquet' : 'Shuffle Deck' }}
            </button>
          </div>

          <div class="flex items-center gap-2 font-mono text-xs">
            <span class="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-bold">
              ✓ {{ flashKnownIds.size }}
            </span>
            <span class="text-slate-500 font-bold">
              {{ flashIndex + 1 }} / {{ filteredFlashcards.length }}
            </span>
          </div>
        </div>

        <div
          v-if="currentFlashcard"
          class="flash-3d-scene"
          @click="isFlipped = !isFlipped"
        >
          <div class="flash-3d-inner" :class="{ 'is-flipped': isFlipped }">
            <div class="flash-3d-face flash-3d-front rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#090E1A] p-8 flex flex-col items-center justify-between text-center shadow-2xl">
              <div class="w-full flex items-center justify-between text-xs font-bold text-slate-400">
                <span>{{ currentFlashcard.subregion }}</span>
                <span class="text-sky-500">↻ {{ locale === 'fr' ? 'Cliquer ou Espace pour retourner' : 'Click or Space to flip' }}</span>
              </div>

              <div class="my-6 space-y-4">
                <img
                  :src="`https://flagcdn.com/w320/${currentFlashcard.iso}.png`"
                  :alt="currentFlashcard.name"
                  class="h-28 sm:h-36 w-auto rounded-xl shadow-lg mx-auto border border-slate-200 dark:border-white/10"
                />
                <h3 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {{ currentFlashcard.name }}
                </h3>
              </div>

              <span class="font-mono text-xs text-sky-500 font-bold">
                {{ locale === 'fr' ? 'Quelle est sa capitale, sa langue et sa monnaie ?' : 'What is its capital, language, and currency?' }}
              </span>
            </div>

            <div class="flash-3d-face flash-3d-back rounded-3xl border border-sky-500/40 bg-slate-900 text-white p-8 flex flex-col justify-between shadow-2xl">
              <div class="flex items-center justify-between pb-4 border-b border-white/10">
                <div class="flex items-center gap-3">
                  <img :src="`https://flagcdn.com/w80/${currentFlashcard.iso}.png`" class="h-7 w-auto rounded" alt="" />
                  <h4 class="text-xl font-black">{{ currentFlashcard.name }}</h4>
                </div>
                <span class="text-xs text-sky-400 font-bold">↻ Recto</span>
              </div>

              <div class="grid grid-cols-2 gap-3 my-4 text-xs">
                <div class="p-3 rounded-2xl bg-white/[0.06]">
                  <span class="text-slate-400 block">{{ t('common.capital') }}</span>
                  <strong class="text-base text-white">{{ currentFlashcard.capital }}</strong>
                </div>
                <div class="p-3 rounded-2xl bg-white/[0.06]">
                  <span class="text-slate-400 block">{{ locale === 'fr' ? 'Population' : 'Population' }}</span>
                  <strong class="text-base text-sky-400">{{ currentFlashcard.population }}</strong>
                </div>
                <div class="p-3 rounded-2xl bg-white/[0.06]">
                  <span class="text-slate-400 block">{{ locale === 'fr' ? 'Langue' : 'Language' }}</span>
                  <strong class="text-sm text-white">{{ currentFlashcard.lang }}</strong>
                </div>
                <div class="p-3 rounded-2xl bg-white/[0.06]">
                  <span class="text-slate-400 block">{{ locale === 'fr' ? 'Monnaie' : 'Currency' }}</span>
                  <strong class="text-sm text-emerald-400">{{ currentFlashcard.currency }}</strong>
                </div>
              </div>

              <p class="p-3.5 rounded-2xl bg-sky-500/15 border border-sky-400/25 text-xs text-slate-200 leading-relaxed">
                {{ currentFlashcard.fact }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            @click="cartePrecedente"
            class="px-5 py-2.5 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 text-xs font-bold cursor-pointer hover:border-sky-500 transition"
          >
            ← {{ locale === 'fr' ? 'Précédent' : 'Previous' }}
          </button>
          <button
            type="button"
            @click="isFlipped = !isFlipped"
            class="px-6 py-2.5 rounded-full bg-sky-500 text-slate-950 text-xs font-black cursor-pointer"
          >
            ↻ {{ locale === 'fr' ? 'Retourner' : 'Flip Card' }}
          </button>
          <button
            type="button"
            @click="marquerFlashAcquise"
            class="px-5 py-2.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold cursor-pointer transition"
          >
            ✓ {{ locale === 'fr' ? 'Acquise' : 'Mastered' }}
          </button>
          <button
            type="button"
            @click="carteSuivante"
            class="px-5 py-2.5 rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900 text-xs font-bold cursor-pointer hover:border-sky-500 transition"
          >
            {{ locale === 'fr' ? 'Suivant' : 'Next' }} →
          </button>
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- MODE 8 : GRILLE MONDIALE DES 196 DRAPEAUX (AUTO-FOCUS)  -->
      <!-- ======================================================= -->
      <div v-else-if="currentMode === 'flag-grid'" key="quiz-flaggrid" class="max-w-[1400px] mx-auto px-3 sm:px-6 pb-20 space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#090E1A]/90 p-5">
          <div class="flex flex-wrap items-center gap-2">
            <button
              v-for="cont in ['all', 'Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania']"
              :key="'fg-' + cont"
              type="button"
              @click="flagGridContinent = cont"
              class="px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer"
              :class="flagGridContinent === cont ? 'bg-sky-500 text-slate-950 font-black' : 'bg-slate-100 dark:bg-white/5 text-slate-500'"
            >
              {{ cont === 'all' ? (locale === 'fr' ? 'Monde (196)' : 'World (196)') : cont }}
            </button>
          </div>
          <span class="font-mono text-xs font-black text-emerald-500">
            {{ flagGridFoundCount }} / {{ filteredFlagGridCountries.length }} {{ locale === 'fr' ? 'TROUVÉS' : 'FOUND' }}
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div
            v-for="(c, idx) in filteredFlagGridCountries"
            :key="'fg-card-' + c.id"
            class="p-3.5 rounded-2xl border transition-all flex flex-col items-center gap-2.5"
            :class="flagGridSolvedSet.has(c.id)
              ? 'border-emerald-500 bg-emerald-500/10 scale-[1.02]'
              : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#090E1A]'"
          >
            <img :src="`https://flagcdn.com/w160/${c.iso}.png`" class="h-12 w-auto rounded shadow-xs object-contain" loading="lazy" alt="" />
            <input
              v-if="!flagGridSolvedSet.has(c.id)"
              :id="'flag-input-' + idx"
              v-model="flagGridInputs[c.id]"
              @input="checkFlagGridItem(c, idx)"
              type="text"
              :placeholder="locale === 'fr' ? 'Pays...' : 'Country...'"
              class="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-900 text-center text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
            />
            <strong v-else class="text-xs font-black text-emerald-500 text-center truncate w-full">
              ✓ {{ c.name }}
            </strong>
          </div>
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- MODE 9 : CRÉATEUR DE DÉFIS SUR-MESURE (5 À 15 PAYS)     -->
      <!-- ======================================================= -->
      <div v-else-if="currentMode === 'custom-builder'" key="quiz-builder" class="max-w-4xl mx-auto px-3 sm:px-6 pb-20">
        <div class="rounded-3xl border border-slate-200 dark:border-white/12 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
            <div>
              <h3 class="text-xl font-black text-slate-900 dark:text-white">
                {{ locale === 'fr' ? 'Sélectionnez de 5 à 15 pays pour votre défi' : 'Select 5 to 15 countries for your custom challenge' }}
              </h3>
              <p class="text-xs text-slate-500 mt-0.5">
                {{ locale === 'fr' ? `${customSelectedIds.length} / 15 pays sélectionnés` : `${customSelectedIds.length} / 15 countries selected` }}
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                @click="pickRandomCustomSet(10)"
                class="px-3.5 py-2 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                {{ locale === 'fr' ? '10 Aléatoires' : 'Random 10' }}
              </button>
              <button
                v-if="customSelectedIds.length > 0"
                type="button"
                @click="customSelectedIds = []"
                class="px-3.5 py-2 rounded-full bg-rose-500/15 text-xs font-bold text-rose-400 cursor-pointer"
              >
                {{ locale === 'fr' ? 'Vider' : 'Clear' }}
              </button>

              <select
                v-model="customBuilderType"
                class="px-3.5 py-2 rounded-full border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="capital">{{ locale === 'fr' ? 'Quiz Capitales' : 'Capitals Quiz' }}</option>
                <option value="flag">{{ locale === 'fr' ? 'Quiz Drapeaux' : 'Flags Quiz' }}</option>
              </select>

              <button
                type="button"
                :disabled="customSelectedIds.length < 5"
                @click="copyCustomBuilderLink"
                class="px-5 py-2 rounded-full bg-sky-500 disabled:opacity-40 text-slate-950 font-black text-xs transition cursor-pointer"
              >
                {{ customLinkCopied ? (locale === 'fr' ? 'Lien copié !' : 'Link copied!') : (locale === 'fr' ? 'Copier le lien Duel' : 'Copy Duel Link') }}
              </button>

              <button
                type="button"
                :disabled="customSelectedIds.length < 5"
                @click="launchCustomBuiltQuiz"
                class="px-5 py-2 rounded-full bg-emerald-500 disabled:opacity-40 text-slate-950 font-black text-xs transition cursor-pointer"
              >
                {{ locale === 'fr' ? 'Jouer →' : 'Play Now →' }}
              </button>
            </div>
          </div>

          <input
            v-model="customSearch"
            type="text"
            :placeholder="locale === 'fr' ? 'Filtrer les 196 pays...' : 'Filter 196 countries...'"
            class="w-full px-4 py-2.5 rounded-full border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white"
          />

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[380px] overflow-y-auto pr-1">
            <button
              v-for="c in filteredCustomCountries"
              :key="'cb-' + c.id"
              type="button"
              @click="toggleCustomCountry(c.id)"
              class="p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2 transition cursor-pointer"
              :class="customSelectedIds.includes(c.id)
                ? 'border-sky-500 bg-sky-500/15 text-sky-400'
                : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] text-slate-700 dark:text-slate-300'"
            >
              <img :src="`https://flagcdn.com/w40/${c.iso}.png`" class="h-3.5 w-auto rounded-2xs shrink-0" alt="" />
              <span class="truncate">{{ c.name }}</span>
            </button>
          </div>
        </div>
      </div>

    </transition>

  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ALL_COUNTRIES from '../data/countries.js';

import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LPopup, LCircleMarker, LPolyline } from "@vue-leaflet/vue-leaflet";

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const API_URL = 'https://geolearn-backend-bj65.onrender.com';

// =========================================================
// PARALLAXE DE LA SCÈNE PLEIN ÉCRAN & TILT 3D DES CARTES
// =========================================================
const stageParallaxX = ref(0);
const stageParallaxY = ref(0);
const matrixTilts = ref({});

const onStagePointerMove = (e) => {
  if (typeof window === 'undefined') return;
  stageParallaxX.value = Number(((e.clientX / window.innerWidth - 0.5) * 2).toFixed(3));
  stageParallaxY.value = Number(((e.clientY / window.innerHeight - 0.5) * 2).toFixed(3));
};

const onMatrixCardMove = (e, id) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const nx = (e.clientX - rect.left) / rect.width - 0.5;
  const ny = (e.clientY - rect.top) / rect.height - 0.5;
  matrixTilts.value[id] = {
    rx: Number((-ny * 10).toFixed(2)),
    ry: Number((nx * 12).toFixed(2))
  };
};

const onMatrixCardLeave = (id) => {
  matrixTilts.value[id] = { rx: 0, ry: 0 };
};

const getMatrixCardStyle = (id) => {
  const tObj = matrixTilts.value[id];
  if (!tObj || (tObj.rx === 0 && tObj.ry === 0)) {
    return { transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' };
  }
  return {
    transform: `perspective(1000px) rotateX(${tObj.rx}deg) rotateY(${tObj.ry}deg) translateY(-4px)`
  };
};

// =========================================================
// DICTIONNAIRE D'ALIAS POUR SAISIE NATURELLE
// =========================================================
const COUNTRY_ALIASES = {
  usa: 'us', 'etats unis': 'us', 'united states': 'us', 'united states of america': 'us',
  uk: 'gb', 'royaume uni': 'gb', angleterre: 'gb', 'great britain': 'gb',
  rdc: 'cd', 'congo kinshasa': 'cd', 'dr congo': 'cd', 'republique democratique du congo': 'cd',
  'congo brazzaville': 'cg', 'republique du congo': 'cg',
  eau: 'ae', uae: 'ae', emirats: 'ae', 'emirats arabes unis': 'ae',
  'pays bas': 'nl', hollande: 'nl', netherlands: 'nl',
  russie: 'ru', russia: 'ru',
  vatican: 'va', 'saint siege': 'va',
  tchequie: 'cz', 'republique tcheque': 'cz', czechia: 'cz',
  birmanie: 'mm', myanmar: 'mm',
  eswatini: 'sz', swaziland: 'sz',
  'cap vert': 'cv', 'cabo verde': 'cv',
  'timor oriental': 'tl', 'east timor': 'tl', 'timor leste': 'tl',
  'cote divoire': 'ci', 'cote d ivoire': 'ci', 'ivory coast': 'ci',
  'coree du sud': 'kr', 'south korea': 'kr',
  'coree du nord': 'kp', 'north korea': 'kp',
  macedoine: 'mk', 'macedoine du nord': 'mk',
  bosnie: 'ba', 'bosnie herzegovine': 'ba',
  centrafrique: 'cf', 'republique centrafricaine': 'cf', 'central african republic': 'cf'
};

// =========================================================
// SYNTHÉTISEUR AUDIO WEB AUDIO API
// =========================================================
const soundEnabled = ref(localStorage.getItem('geolearn_sound') !== 'off');
let audioCtx = null;

const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value;
  localStorage.setItem('geolearn_sound', soundEnabled.value ? 'on' : 'off');
};

const playSound = (type) => {
  if (!soundEnabled.value || typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc.start(now);
      osc.stop(now + 0.24);
    } else if (type === 'wrong') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.22);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'victory') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  } catch (e) {}
};

// =========================================================
// BASE DES 196 PAYS AVEC IDENTIFIANT UNIQUE GARANTI
// =========================================================
const countriesData = ref(ALL_COUNTRIES);

const parseNumericPopulation = (popStr = '') => {
  if (!popStr) return 0;
  const s = popStr.toString().replace(',', '.').trim();
  const num = parseFloat(s.replace(/[^\d.]/g, '')) || 0;
  if (/Md|B/i.test(s)) return num * 1_000_000_000;
  if (/M/i.test(s)) return num * 1_000_000;
  if (/K/i.test(s)) return num * 1_000;
  return num;
};

const localizedCountries = computed(() => {
  const isEn = locale.value === 'en';
  return countriesData.value.map((c, idx) => ({
    ...c,
    id: c.id || c.iso || idx + 1,
    name: isEn ? c.name_en : c.name_fr,
    capital: isEn ? c.capital_en : c.capital_fr,
    continent: c.continent_en,
    subregion: isEn ? c.subregion_en : c.subregion_fr,
    population: isEn ? c.population_en : c.population_fr,
    populationNumeric: parseNumericPopulation(c.population_fr),
    lang: isEn ? c.lang_en : c.lang_fr,
    fact: isEn ? c.fact_en : c.fact_fr
  }));
});

const normalizeString = (str = '') =>
  str
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const blankMapStyle = ref('physical');
const leafletWorldRings = ref([]);

const blankTileUrl = computed(() => {
  if (blankMapStyle.value === 'satellite') {
    return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  }
  return 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}';
});

// =========================================================
// VRAI MOTEUR 3D WEBGL THREE.JS (MANETTE SCULPTÉE PBR)
// =========================================================
const webglContainerRef = ref(null);
let threeRenderer = null;
let threeScene = null;
let threeCamera = null;
let controllerGroup = null;
let leftStickPivot = null;
let rightStickPivot = null;
let ledMaterial = null;
let accentPointLight = null;
let pedestalRing1 = null;
let pedestalRing2 = null;
let orbitSatellites = [];

let wglDragging = false;
let wglLastX = 0;
let wglLastY = 0;
let wglRotY = -0.32;
let wglRotX = 0.36;
let wglVelY = 0;
let wglVelX = 0;
let wglPulseKick = 0;

const onWebglPointerDown = (e) => {
  wglDragging = true;
  wglVelY = 0;
  wglVelX = 0;
  wglLastX = e.clientX;
  wglLastY = e.clientY;
};

const onWebglPointerMove = (e) => {
  if (!wglDragging) return;
  const dx = e.clientX - wglLastX;
  const dy = e.clientY - wglLastY;
  const dY = dx * 0.011;
  const dX = dy * 0.01;
  wglRotY += dY;
  wglRotX = Math.max(-0.85, Math.min(0.85, wglRotX + dX));
  wglVelY = dY * 0.88;
  wglVelX = dX * 0.88;
  wglLastX = e.clientX;
  wglLastY = e.clientY;
};

const onWebglPointerUp = () => {
  wglDragging = false;
};

const triggerWebglPulse = () => {
  wglPulseKick = 0.24;
  wglVelY += 0.045;
};

const initThreeWebglController = async () => {
  if (typeof window === 'undefined' || !webglContainerRef.value) return;
  try {
    const THREE = await import('https://esm.sh/three@0.160.0');
    const mount = webglContainerRef.value;
    if (!mount) return;

    const W = mount.clientWidth || 640;
    const H = mount.clientHeight || 450;

    threeScene = new THREE.Scene();
    threeCamera = new THREE.PerspectiveCamera(36, W / H, 0.1, 100);
    threeCamera.position.set(0, 0.22, 6.1);
    threeCamera.lookAt(0, -0.12, 0);

    threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    threeRenderer.setSize(W, H);
    threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    threeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    threeRenderer.toneMappingExposure = 1.45;

    mount.innerHTML = '';
    mount.appendChild(threeRenderer.domElement);

    // Éclairage Studio renforcé pour faire ressortir les volumes de la manette sur fond sombre
    const ambient = new THREE.AmbientLight(0xffffff, 1.15);
    threeScene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(4, 7, 6);
    threeScene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.8);
    rimLight.position.set(-6, 4, -3);
    threeScene.add(rimLight);

    accentPointLight = new THREE.PointLight(0xa855f7, 4.5, 14);
    accentPointLight.position.set(0, -0.8, 2.8);
    threeScene.add(accentPointLight);

    // Matériau PBR métallisé indigo clair pour un contraste net sur le fond carbone
    const shellMat = new THREE.MeshPhysicalMaterial({
      color: 0x3b4284,
      metalness: 0.42,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });

    const gripDarkMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.6,
      roughness: 0.42
    });

    const chromeMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.12,
      clearcoat: 1.0
    });

    ledMaterial = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0xa855f7,
      emissiveIntensity: 2.5,
      roughness: 0.2
    });

    controllerGroup = new THREE.Group();
    controllerGroup.position.y = 0.18;
    threeScene.add(controllerGroup);

    // 1. Châssis central sculpté avec biseaux 3D arrondis
    const bodyShape = new THREE.Shape();
    bodyShape.moveTo(-1.15, 0.68);
    bodyShape.quadraticCurveTo(0, 0.82, 1.15, 0.68);
    bodyShape.lineTo(1.45, -0.18);
    bodyShape.quadraticCurveTo(0.85, -0.68, 0.52, -0.46);
    bodyShape.quadraticCurveTo(0, -0.38, -0.52, -0.46);
    bodyShape.quadraticCurveTo(-0.85, -0.68, -1.45, -0.18);
    bodyShape.closePath();

    const coreGeo = new THREE.ExtrudeGeometry(bodyShape, {
      depth: 0.42,
      bevelEnabled: true,
      bevelSegments: 16,
      steps: 2,
      bevelSize: 0.26,
      bevelThickness: 0.28
    });
    coreGeo.center();
    controllerGroup.add(new THREE.Mesh(coreGeo, shellMat));

    // 2. Poignées ergonomiques 3D Gauche & Droite
    for (const side of [-1, 1]) {
      const handleGroup = new THREE.Group();
      handleGroup.position.set(side * 1.28, -0.52, -0.08);
      handleGroup.rotation.z = side * 0.34;
      handleGroup.rotation.x = 0.22;

      handleGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.32, 1.72, 32), shellMat));

      const lowerGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.33, 1.32, 32), gripDarkMat);
      lowerGrip.position.set(side * 0.03, -0.2, -0.03);
      handleGroup.add(lowerGrip);

      const bottomCap = new THREE.Mesh(new THREE.SphereGeometry(0.325, 32, 24), gripDarkMat);
      bottomCap.position.y = -0.86;
      handleGroup.add(bottomCap);

      const topShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 24), shellMat);
      topShoulder.position.y = 0.86;
      handleGroup.add(topShoulder);

      const gripLed = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.022, 16, 48), ledMaterial);
      gripLed.rotation.x = Math.PI / 2;
      gripLed.position.y = 0.14;
      handleGroup.add(gripLed);

      controllerGroup.add(handleGroup);
    }

    // 3. Pavé Tactile Central + Liseré LED Néon
    const padShape = new THREE.Shape();
    padShape.moveTo(-0.62, 0.36);
    padShape.lineTo(0.62, 0.36);
    padShape.lineTo(0.52, -0.18);
    padShape.lineTo(-0.52, -0.18);
    padShape.closePath();

    const padGeo = new THREE.ExtrudeGeometry(padShape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 8,
      bevelSize: 0.04,
      bevelThickness: 0.04
    });
    padGeo.center();
    const padMesh = new THREE.Mesh(padGeo, gripDarkMat);
    padMesh.position.set(0, 0.34, 0.44);
    padMesh.rotation.x = -0.12;
    controllerGroup.add(padMesh);

    const ledStripGeo = new THREE.ExtrudeGeometry(padShape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.07,
      bevelThickness: 0.02
    });
    ledStripGeo.center();
    const ledStripMesh = new THREE.Mesh(ledStripGeo, ledMaterial);
    ledStripMesh.position.set(0, 0.34, 0.4);
    ledStripMesh.rotation.x = -0.12;
    controllerGroup.add(ledStripMesh);

    // 4. Joysticks Analogiques 3D
    const createStickAssembly = (posX) => {
      const baseGroup = new THREE.Group();
      baseGroup.position.set(posX, -0.22, 0.42);
      baseGroup.add(new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.045, 16, 36), chromeMat));

      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 16), gripDarkMat);
      dome.position.z = -0.04;
      baseGroup.add(dome);

      const pivot = new THREE.Group();
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.32, 20), chromeMat);
      stem.rotation.x = Math.PI / 2;
      stem.position.z = 0.14;
      pivot.add(stem);

      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.19, 0.09, 32), gripDarkMat);
      cap.rotation.x = Math.PI / 2;
      cap.position.z = 0.3;
      pivot.add(cap);

      const capLed = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.02, 16, 36), ledMaterial);
      capLed.position.z = 0.34;
      pivot.add(capLed);

      baseGroup.add(pivot);
      controllerGroup.add(baseGroup);
      return pivot;
    };

    leftStickPivot = createStickAssembly(-0.62);
    rightStickPivot = createStickAssembly(0.62);

    // 5. Croix Directionnelle (D-Pad 3D)
    const dpadGroup = new THREE.Group();
    dpadGroup.position.set(-1.18, 0.18, 0.44);
    dpadGroup.add(
      new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.15, 0.1), chromeMat),
      new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.46, 0.1), chromeMat)
    );
    controllerGroup.add(dpadGroup);

    // 6. 4 Boutons Cristal Lumineux à droite
    const btnColors = [
      { dx: 0, dy: 0.21, col: 0xfbbf24 },
      { dx: 0.21, dy: 0, col: 0xf43f5e },
      { dx: 0, dy: -0.21, col: 0x10b981 },
      { dx: -0.21, dy: 0, col: 0x38bdf8 }
    ];
    for (const b of btnColors) {
      const bMat = new THREE.MeshPhysicalMaterial({
        color: b.col,
        emissive: b.col,
        emissiveIntensity: 0.75,
        clearcoat: 1.0,
        roughness: 0.1
      });
      const bMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.1, 24), bMat);
      bMesh.rotation.x = Math.PI / 2;
      bMesh.position.set(1.18 + b.dx, 0.18 + b.dy, 0.45);
      controllerGroup.add(bMesh);
    }

    // 7. Gâchettes L1 / R1 / L2 / R2
    for (const side of [-1, 1]) {
      const l1 = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.14, 0.22), chromeMat);
      l1.position.set(side * 1.12, 0.82, 0.08);
      l1.rotation.z = side * -0.18;
      controllerGroup.add(l1);

      const l2 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.22, 0.28), gripDarkMat);
      l2.position.set(side * 1.12, 0.76, -0.24);
      l2.rotation.x = -0.35;
      controllerGroup.add(l2);
    }

    // 8. Socle Holographique 3D calibré (y = -1.22, jamais coupé en bas)
    pedestalRing1 = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.024, 16, 96), ledMaterial);
    pedestalRing1.rotation.x = Math.PI / 2.25;
    pedestalRing1.position.set(0, -1.22, 0);
    threeScene.add(pedestalRing1);

    const ringCyanMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 1.9
    });
    pedestalRing2 = new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.018, 16, 80), ringCyanMat);
    pedestalRing2.rotation.x = Math.PI / 2.25;
    pedestalRing2.position.set(0, -1.22, 0);
    threeScene.add(pedestalRing2);

    // 9. 4 Satellites 3D Géométriques en Orbite
    orbitSatellites = [];
    const satGeos = [
      new THREE.OctahedronGeometry(0.24, 0),
      new THREE.IcosahedronGeometry(0.23, 0),
      new THREE.BoxGeometry(0.32, 0.32, 0.32),
      new THREE.TorusGeometry(0.18, 0.055, 16, 32)
    ];
    for (let i = 0; i < satGeos.length; i++) {
      const satGroup = new THREE.Group();
      const solidMesh = new THREE.Mesh(satGeos[i], shellMat);
      const wireMesh = new THREE.Mesh(
        satGeos[i],
        new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x38bdf8 : 0xc084fc, wireframe: true })
      );
      wireMesh.scale.setScalar(1.06);
      satGroup.add(solidMesh, wireMesh);
      threeScene.add(satGroup);
      orbitSatellites.push({ mesh: satGroup, phase: (i * Math.PI) / 2 });
    }
  } catch (e) {}
};

const updateThreeWebglFrame = (timeMs) => {
  if (!threeRenderer || !threeScene || !threeCamera || currentMode.value !== 'menu') return;
  const tSec = timeMs * 0.001;

  if (!wglDragging) {
    if (Math.abs(wglVelY) > 0.0003 || Math.abs(wglVelX) > 0.0003) {
      wglRotY += wglVelY;
      wglRotX = Math.max(-0.85, Math.min(0.85, wglRotX + wglVelX));
      wglVelY *= 0.94;
      wglVelX *= 0.94;
    } else {
      wglRotY += 0.0055;
    }
  }

  if (wglPulseKick > 0.005) wglPulseKick *= 0.86;
  else wglPulseKick = 0;

if (controllerGroup) {
    controllerGroup.rotation.y = wglRotY + stageParallaxX.value * 0.25;
    controllerGroup.rotation.x = wglRotX + stageParallaxY.value * 0.18;
    controllerGroup.rotation.z = -0.14 + Math.sin(tSec * 1.4) * 0.04;
    controllerGroup.position.y = 0.12 + Math.sin(tSec * 2.1) * 0.1 + wglPulseKick;
    const sc = 1.24 + wglPulseKick * 0.35;
    controllerGroup.scale.set(sc, sc, sc);
  }

  // Inclinaison réactive des deux joysticks 3D vers le curseur
  if (leftStickPivot && rightStickPivot) {
    leftStickPivot.rotation.y = stageParallaxX.value * 0.45;
    leftStickPivot.rotation.x = stageParallaxY.value * 0.45;
    rightStickPivot.rotation.y = -stageParallaxX.value * 0.45;
    rightStickPivot.rotation.x = stageParallaxY.value * 0.45;
  }

  // Synchronisation de la couleur LED 3D avec le mode actif du carrousel
  if (ledMaterial && accentPointLight && activeShowcaseCard.value?.glowColor) {
    ledMaterial.color.set(activeShowcaseCard.value.glowColor);
    ledMaterial.emissive.set(activeShowcaseCard.value.glowColor);
    accentPointLight.color.set(activeShowcaseCard.value.glowColor);
  }

  if (pedestalRing1 && pedestalRing2) {
    const pScale = 1 + Math.sin(tSec * 2.5) * 0.04 + wglPulseKick * 0.6;
    pedestalRing1.scale.set(pScale, pScale, 1);
    pedestalRing2.scale.set(2 - pScale, 2 - pScale, 1);
  }

  // Orbite 3D des satellites autour de la manette
  for (let i = 0; i < orbitSatellites.length; i++) {
    const sat = orbitSatellites[i];
    const ang = tSec * 0.65 + sat.phase;
    sat.mesh.position.set(
      Math.cos(ang) * 2.75,
      Math.sin(tSec * 1.8 + i) * 0.55 + (i % 2 === 0 ? 0.45 : -0.35),
      Math.sin(ang) * 1.35
    );
    sat.mesh.rotation.x += 0.015;
    sat.mesh.rotation.y += 0.02;
  }

  threeRenderer.render(threeScene, threeCamera);
};

const handleWindowResize = () => {
  if (!threeRenderer || !threeCamera || !webglContainerRef.value) return;
  const W = webglContainerRef.value.clientWidth || 540;
  const H = webglContainerRef.value.clientHeight || 400;
  threeCamera.aspect = W / H;
  threeCamera.updateProjectionMatrix();
  threeRenderer.setSize(W, H);
};

// =========================================================
// MOTEUR GLOBE 3D VECTORIEL PARTAGÉ (POUR CHRONO & WORLDLE)
// =========================================================
const chronoGlobeCanvasRef = ref(null);
const mysteryGlobeCanvasRef = ref(null);
let worldRings = [];
let globeAnimId = null;

let qRotLon = -12;
let qRotLat = -38;
let qTargetLon = -12;
let qTargetLat = -38;
let qVelLon = 0;
let qVelLat = 0;
let qIsLocked = false;
let qIsDragging = false;
let qLastX = 0;
let qLastY = 0;
let qPulse = 0;

const extractRingsFromTopoJSON = (topology) => {
  const rings = [];
  if (!topology || !topology.objects || !topology.arcs) return rings;
  const { scale, translate } = topology.transform || { scale: [1, 1], translate: [0, 0] };
  const decodedArcs = topology.arcs.map((arc) => {
    let x = 0, y = 0;
    return arc.map(([dx, dy]) => {
      x += dx; y += dy;
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
      for (const r of geom.arcs) rings.push(stitchArcs(r));
    } else if (geom.type === 'MultiPolygon') {
      for (const poly of geom.arcs) {
        for (const r of poly) rings.push(stitchArcs(r));
      }
    }
  }
  return rings;
};

const loadQuizVectorBorders = async () => {
  try {
    const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
    if (res.ok) {
      const topo = await res.json();
      worldRings = extractRingsFromTopoJSON(topo);
      leafletWorldRings.value = worldRings.map((ring) => ring.map(([lon, lat]) => [lat, lon]));
    }
  } catch (e) {}
};

const focusQuizGlobeOn = (lat, lng) => {
  qVelLon = 0;
  qVelLat = 0;
  qTargetLon = -Number(lng || 0);
  qTargetLat = -Math.max(-65, Math.min(65, Number(lat || 0)));
  qIsLocked = true;
};

const onQuizGlobePointerDown = (e) => {
  qIsDragging = true;
  qIsLocked = false;
  qVelLon = 0;
  qVelLat = 0;
  qLastX = e.clientX;
  qLastY = e.clientY;
};

const onQuizGlobePointerMove = (e) => {
  if (!qIsDragging) return;
  const dx = e.clientX - qLastX;
  const dy = e.clientY - qLastY;
  const dLon = dx * 0.4;
  const dLat = -dy * 0.36;
  qRotLon += dLon;
  qRotLat = Math.max(-68, Math.min(68, qRotLat + dLat));
  qVelLon = dLon * 0.85;
  qVelLat = dLat * 0.85;
  qTargetLon = qRotLon;
  qTargetLat = qRotLat;
  qLastX = e.clientX;
  qLastY = e.clientY;
};

const onQuizGlobePointerUp = () => {
  qIsDragging = false;
};

const renderMainLoop = (timeMs = 0) => {
  if (currentMode.value === 'menu') {
    updateThreeWebglFrame(timeMs);
  }

  const canvas =
    currentMode.value === 'chrono' && chronoViewMode.value === 'globe3d'
      ? chronoGlobeCanvasRef.value
      : currentMode.value === 'mystery'
        ? mysteryGlobeCanvasRef.value
        : null;

  if (canvas) {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = rect.width || 340;
    const H = rect.height || 340;
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
    }

    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const R = Math.min(W, H) * 0.43;

    if (qIsLocked && !qIsDragging) {
      const dLon = ((qTargetLon - qRotLon + 540) % 360) - 180;
      const dLat = qTargetLat - qRotLat;
      qRotLon += dLon * 0.09;
      qRotLat += dLat * 0.09;
      if (Math.abs(dLon) < 0.15 && Math.abs(dLat) < 0.15) qIsLocked = false;
    } else if (!qIsDragging) {
      if (Math.abs(qVelLon) > 0.01 || Math.abs(qVelLat) > 0.01) {
        qRotLon += qVelLon;
        qRotLat = Math.max(-68, Math.min(68, qRotLat + qVelLat));
        qVelLon *= 0.92;
        qVelLat *= 0.92;
      } else {
        qRotLon -= 0.08;
      }
      qTargetLon = qRotLon;
      qTargetLat = qRotLat;
    }

    qPulse = (qPulse + 0.02) % 1;

    const oceanGrad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.08, cx, cy, R);
    oceanGrad.addColorStop(0, '#0f2342');
    oceanGrad.addColorStop(0.7, '#061022');
    oceanGrad.addColorStop(1, '#02060f');
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = oceanGrad;
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();

    const toRad = (d) => (d * Math.PI) / 180;
    const lam0 = toRad(-qRotLon);
    const phi0 = toRad(-qRotLat);
    const sinPhi0 = Math.sin(phi0);
    const cosPhi0 = Math.cos(phi0);

    const projectPt = (latDeg, lonDeg) => {
      const phi = toRad(latDeg);
      const lam = toRad(lonDeg);
      const dLam = lam - lam0;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      const cosC = sinPhi0 * sinPhi + cosPhi0 * cosPhi * Math.cos(dLam);
      if (cosC < 0) return null;
      return {
        x: cx + R * (cosPhi * Math.sin(dLam)),
        y: cy - R * (cosPhi0 * sinPhi - sinPhi0 * cosPhi * Math.cos(dLam)),
        z: cosC
      };
    };

    if (worldRings.length > 0) {
      ctx.fillStyle = 'rgba(20, 48, 86, 0.78)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.42)';
      ctx.lineWidth = 0.8;
      for (const ring of worldRings) {
        ctx.beginPath();
        let vis = 0;
        let prev = null;
        for (let i = 0; i < ring.length; i++) {
          const [lon, lat] = ring[i];
          const p = projectPt(lat, lon);
          if (p) {
            if (!prev || Math.hypot(p.x - prev.x, p.y - prev.y) > R * 0.35) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
            prev = p;
            vis++;
          } else prev = null;
        }
        if (vis > 2) {
          ctx.fill();
          ctx.stroke();
        }
      }
    }

    if (currentMode.value === 'chrono') {
      for (const c of chronoTargetCountries.value) {
        const p = projectPt(c.lat, c.lng);
        if (!p) continue;
        const isFound = chronoFoundSet.value.has(c.id);
        const isLast = chronoLastFoundCountry.value?.id === c.id;

        if (isLast) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 6 + qPulse * 12, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(52, 211, 153, ${1 - qPulse})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, isFound ? 4.2 : 2.2, 0, Math.PI * 2);
        ctx.fillStyle = isFound
          ? '#10b981'
          : chronoFini.value
            ? '#f43f5e'
            : 'rgba(148, 163, 184, 0.38)';
        ctx.fill();
      }
    }

    if (currentMode.value === 'mystery') {
      for (const g of mysteryGuesses.value) {
        const cObj = localizedCountries.value.find((c) => c.id === g.id);
        if (!cObj) continue;
        const p = projectPt(cObj.lat, cObj.lng);
        if (!p) continue;

        const color = g.isCorrect
          ? '#10b981'
          : g.proximity >= 75
            ? '#f59e0b'
            : '#38bdf8';

        ctx.beginPath();
        ctx.arc(p.x, p.y, 6 + qPulse * 9, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }

    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.stroke();
    ctx.restore();
  }

  globeAnimId = requestAnimationFrame(renderMainLoop);
};

// =========================================================
// CARROUSEL PLANÉTAIRE EN ARC 3D (ROUE COURBÉE INTERACTIVE)
// =========================================================
const currentMode = ref('menu');
const selectedMenuCat = ref('all');
const menuSearchQuery = ref('');
const menuSortBy = ref('popular');
const activeCarouselIndex = ref(0);
const gamesGridRef = ref(null);

const selectCategoryFilter = (catId) => {
  selectedMenuCat.value = catId;
  activeCarouselIndex.value = 0;
  triggerWebglPulse();
};

const stepCarousel = (delta) => {
  const len = filteredMenuCards.value.length;
  if (!len) return;
  activeCarouselIndex.value = (activeCarouselIndex.value + delta + len) % len;
  triggerWebglPulse();
};

let lastWheelTime = 0;
const onCarouselWheel = (e) => {
  const now = Date.now();
  if (now - lastWheelTime < 180) return;
  lastWheelTime = now;
  const delta = e.deltaY > 0 || e.deltaX > 0 ? 1 : -1;
  stepCarousel(delta);
};

// Glissement horizontal de la roue en arc 3D
let arcDragStartX = 0;
let arcDragging = false;
const onArcDragStart = (e) => {
  arcDragging = true;
  arcDragStartX = e.clientX;
};
const onArcDragMove = (e) => {
  if (!arcDragging) return;
  const dx = e.clientX - arcDragStartX;
  if (Math.abs(dx) > 55) {
    stepCarousel(dx < 0 ? 1 : -1);
    arcDragStartX = e.clientX;
  }
};
const onArcDragEnd = () => {
  arcDragging = false;
};

const handleArcCardClick = (idx, card) => {
  if (idx === activeCarouselIndex.value) {
    card.action();
  } else {
    activeCarouselIndex.value = idx;
    triggerWebglPulse();
  }
};

// Calcule la position sur un arc de cercle 3D (style vitrine incurvée)
const getArcWheelCardStyle = (idx) => {
  const total = filteredMenuCards.value.length;
  if (!total) return {};
  let diff = idx - activeCarouselIndex.value;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;

  const absDiff = Math.abs(diff);
  if (absDiff > 2) {
    return {
      transform: `perspective(1400px) translate3d(${diff * 260}px, 90px, -320px) rotateZ(${diff * 10}deg) scale(0.65)`,
      opacity: '0',
      pointerEvents: 'none',
      zIndex: 1
    };
  }

  const xOffset = diff * 285;
  const yArcDrop = absDiff * absDiff * 18 - (diff === 0 ? 10 : 0);
  const zDepth = -absDiff * 95;
  const rotZ = diff * 5.5;
  const rotY = diff * -14;
  const scale = diff === 0 ? 1.06 : absDiff === 1 ? 0.91 : 0.78;
  const opacity = diff === 0 ? 1 : absDiff === 1 ? 0.78 : 0.42;

  return {
    transform: `perspective(1400px) translate3d(${xOffset}px, ${yArcDrop}px, ${zDepth}px) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`,
    opacity: String(opacity),
    zIndex: 30 - absDiff * 5,
    pointerEvents: 'auto'
  };
};

const scrollToGamesGrid = () => {
  if (gamesGridRef.value) {
    gamesGridRef.value.scrollIntoView({ behavior: 'smooth' });
  }
};

const launchRandomGame = () => {
  const actions = [
    () => initDailyMystery(),
    () => demarrerChrono(),
    () => startFlash60(),
    () => initDetective(),
    () => initQcm('capital'),
    () => initQcm('flag')
  ];
  const pick = actions[Math.floor(Math.random() * actions.length)];
  pick();
};

const activeModeBadge = computed(() => {
  const isFr = locale.value === 'fr';
  const map = {
    menu: isFr ? 'CENTRE D\'ÉVALUATION // 11 MODES' : 'EVALUATION CENTER // 11 MODES',
    qcm: 'SESSION QCM // 15 QUESTIONS',
    flash60: 'SPRINT 60 SECONDES // COMBO X4',
    mystery: 'WORLDLE // TRIANGULATION 3D',
    detective: 'ENQUÊTE // 5 CARTES D\'INDICES 3D',
    chrono: 'JETPUNK // GLOBE 3D & CARTE MUETTE',
    'map-click': 'SETERRA // PRÉCISION CARTOGRAPHIQUE',
    flashcards: 'ÉTUDE ACTIVE // FLASHCARDS 3D',
    'flag-grid': 'MATRICE VISUELLE // 196 DRAPEAUX',
    'custom-builder': 'CRÉATEUR DE DÉFIS SUR-MESURE'
  };
  return map[currentMode.value] || map.menu;
});

const activeModeTitle = computed(() => {
  const isFr = locale.value === 'fr';
  if (currentMode.value === 'qcm') {
    if (qcmCurrentType.value === 'flag') return t('home.mode_flags_title');
    if (qcmCurrentType.value === 'culture') return isFr ? 'Quiz Population, Langues & Devises' : 'Population, Languages & Currencies Quiz';
    return t('home.mode_caps_title');
  }
  return t('quiz.title');
});

const sauvegarderScore = async (modeName, scoreVal, maxScoreVal) => {
  const savedUser = localStorage.getItem('geolearn_user');
  if (!savedUser) return;
  try {
    const parsed = JSON.parse(savedUser);
    const uid = parsed.id || (parsed.user && parsed.user.id);
    if (!uid) return;
    await fetch(`${API_URL}/api/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: uid,
        mode: modeName,
        score: scoreVal,
        max_score: maxScoreVal
      })
    });
  } catch (e) {}
};

// =========================================================
// MODE 1 : QCM (15 QUESTIONS GARANTIES + BILAN DES ERREURS)
// =========================================================
const qcmMaxQuestions = 15;
const qcmCurrentType = ref('capital');
const qcmQuestionsList = ref([]);
const qcmIndex = ref(0);
const qcmScore = ref(0);
const qcmStreak = ref(0);
const qcmFini = ref(false);
const qcmOptions = ref([]);
const qcmCorrectAnswer = ref(null);
const qcmSelected = ref(null);
const qcmIsAnswered = ref(false);
const qcmCultureSubType = ref('currency');
const qcmChallengeCopied = ref(false);
const qcmHistoryLog = ref([]);

const totalQcmQuestions = computed(() =>
  Math.min(qcmMaxQuestions, qcmQuestionsList.value.length || qcmMaxQuestions)
);

const currentQcmQuestion = computed(() =>
  localizedCountries.value.find((c) => c.id === qcmQuestionsList.value[qcmIndex.value]) ||
  localizedCountries.value[0]
);

const qcmCulturePrompt = computed(() => {
  const c = currentQcmQuestion.value;
  const isFr = locale.value === 'fr';
  if (!c) return '';
  if (qcmCultureSubType.value === 'currency') {
    return isFr ? `Quelle est la monnaie officielle de : ${c.name} ?` : `What is the official currency of ${c.name}?`;
  }
  if (qcmCultureSubType.value === 'lang') {
    return isFr ? `Quelle est la langue officielle principale de : ${c.name} ?` : `What is the official language of ${c.name}?`;
  }
  return isFr ? 'Lequel de ces 4 États est le plus peuplé ?' : 'Which of these 4 countries has the largest population?';
});

const getQcmStepBarClass = (stepIdx) => {
  if (stepIdx < qcmHistoryLog.value.length) {
    return qcmHistoryLog.value[stepIdx].isCorrect ? 'bg-emerald-500' : 'bg-rose-500';
  }
  if (stepIdx === qcmIndex.value) return 'bg-sky-400 animate-pulse';
  return 'bg-slate-200 dark:bg-white/10';
};

const genererOptionsQcm = () => {
  qcmIsAnswered.value = false;
  qcmSelected.value = null;
  const target = currentQcmQuestion.value;
  if (!target) return;

  if (qcmCurrentType.value === 'culture') {
    const types = ['currency', 'lang', 'pop'];
    qcmCultureSubType.value = types[qcmIndex.value % types.length];
  }

  const distractors = localizedCountries.value
    .filter((c) => c.id !== target.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const choices = [target, ...distractors].sort(() => 0.5 - Math.random());
  qcmOptions.value = choices;

  if (qcmCurrentType.value === 'culture' && qcmCultureSubType.value === 'pop') {
    const mostPopulous = [...choices].sort((a, b) => b.populationNumeric - a.populationNumeric)[0];
    qcmCorrectAnswer.value = mostPopulous.id;
  } else {
    qcmCorrectAnswer.value = target.id;
  }
};

const initQcm = (type = 'capital', customQuestionIds = null) => {
  currentMode.value = 'qcm';
  qcmCurrentType.value = type || 'capital';
  qcmChallengeCopied.value = false;
  qcmHistoryLog.value = [];
  qcmStreak.value = 0;

  if (Array.isArray(customQuestionIds) && customQuestionIds.length > 0) {
    qcmQuestionsList.value = [...customQuestionIds];
  } else {
    const shuffled = [...localizedCountries.value].sort(() => 0.5 - Math.random());
    qcmQuestionsList.value = shuffled.slice(0, qcmMaxQuestions).map((c) => c.id);
  }

  qcmIndex.value = 0;
  qcmScore.value = 0;
  qcmFini.value = false;
  genererOptionsQcm();
};

const getQcmOptionLabel = (opt) => {
  if (qcmCurrentType.value === 'capital') return opt.capital;
  if (qcmCurrentType.value === 'flag') return opt.name;
  if (qcmCultureSubType.value === 'currency') return opt.currency;
  if (qcmCultureSubType.value === 'lang') return opt.lang;
  return `${opt.name}`;
};

const getQcmOptionClass = (id) => {
  if (!qcmIsAnswered.value) {
    return 'border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] hover:border-sky-500 text-slate-900 dark:text-white';
  }
  if (id === qcmCorrectAnswer.value) {
    return 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300';
  }
  if (id === qcmSelected.value) {
    return 'border-rose-500 bg-rose-500/15 text-rose-500';
  }
  return 'border-slate-200/50 dark:border-white/5 opacity-45 text-slate-400';
};

const verifierReponseQcm = (choixId) => {
  if (qcmIsAnswered.value) return;
  qcmSelected.value = choixId;
  qcmIsAnswered.value = true;

  const isCorrect = choixId === qcmCorrectAnswer.value;
  if (isCorrect) {
    qcmScore.value++;
    qcmStreak.value++;
    playSound('correct');
  } else {
    qcmStreak.value = 0;
    playSound('wrong');
  }

  const rightObj = qcmOptions.value.find((o) => o.id === qcmCorrectAnswer.value) || currentQcmQuestion.value;
  qcmHistoryLog.value.push({
    iso: rightObj.iso,
    countryName: rightObj.name,
    correctLabel: getQcmOptionLabel(rightObj),
    isCorrect
  });

  const total = totalQcmQuestions.value;
  setTimeout(() => {
    if (qcmIndex.value < total - 1) {
      qcmIndex.value++;
      genererOptionsQcm();
    } else {
      qcmFini.value = true;
      playSound('victory');
      const modeName =
        qcmCurrentType.value === 'capital'
          ? 'QCM Capitales'
          : qcmCurrentType.value === 'flag'
            ? 'QCM Drapeaux'
            : 'QCM Culture';
      sauvegarderScore(modeName, qcmScore.value, total);
    }
  }, 1050);
};

const copyQcmDuelLink = async () => {
  const url = `${window.location.origin}/quiz?mode=qcm&type=${qcmCurrentType.value}&custom=${qcmQuestionsList.value.join(',')}`;
  try {
    await navigator.clipboard.writeText(url);
    qcmChallengeCopied.value = true;
  } catch (e) {}
};

// =========================================================
// MODE 2 : SPRINT 60 SECONDES (SAUVEGARDÉ SUR /15)
// =========================================================
const flashTimeLeft = ref(60);
const flashScore = ref(0);
const flashStreak = ref(0);
const flashBestStreak = ref(0);
const flashCorrectCount = ref(0);
const flashFinished = ref(false);
const flashBonusToast = ref(false);
const currentFlashQuestion = ref(null);
const flashOptions = ref([]);
const flashAskFlag = ref(false);
let flashTimer = null;

const flashMultiplier = computed(() => Math.min(4, 1 + Math.floor(flashStreak.value / 3)));

const nextFlashQuestion = () => {
  const pool = localizedCountries.value;
  const target = pool[Math.floor(Math.random() * pool.length)];
  currentFlashQuestion.value = target;
  flashAskFlag.value = Math.random() > 0.5;
  const distractors = pool
    .filter((c) => c.id !== target.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  flashOptions.value = [target, ...distractors].sort(() => 0.5 - Math.random());
};

const startFlash60 = () => {
  currentMode.value = 'flash60';
  if (flashTimer) clearInterval(flashTimer);
  flashTimeLeft.value = 60;
  flashScore.value = 0;
  flashStreak.value = 0;
  flashBestStreak.value = 0;
  flashCorrectCount.value = 0;
  flashFinished.value = false;
  nextFlashQuestion();

  flashTimer = setInterval(() => {
    if (flashTimeLeft.value > 1) {
      flashTimeLeft.value--;
    } else {
      flashTimeLeft.value = 0;
      flashFinished.value = true;
      clearInterval(flashTimer);
      playSound('victory');
      sauvegarderScore('Sprint 60s', Math.min(15, Math.round((flashScore.value / 30) * 15)), 15);
    }
  }, 1000);
};

const submitFlashAnswer = (id) => {
  if (flashFinished.value || !currentFlashQuestion.value) return;
  if (id === currentFlashQuestion.value.id) {
    playSound('correct');
    flashStreak.value++;
    if (flashStreak.value > flashBestStreak.value) flashBestStreak.value = flashStreak.value;
    flashCorrectCount.value++;
    flashScore.value += flashMultiplier.value;

    if (flashStreak.value % 4 === 0) {
      flashTimeLeft.value += 2;
      flashBonusToast.value = true;
      setTimeout(() => { flashBonusToast.value = false; }, 900);
    }
  } else {
    playSound('wrong');
    flashStreak.value = 0;
  }
  nextFlashQuestion();
};

// =========================================================
// MODE 3 : LE PAYS MYSTÈRE (WORLDLE + GLOBE RADAR 3D)
// =========================================================
const mysteryIsDaily = ref(true);
const mysteryTarget = ref(null);
const mysteryQuery = ref('');
const mysteryGuesses = ref([]);
const mysteryFinished = ref(false);
const mysteryWon = ref(false);
const mysteryCopied = ref(false);

const computeHaversineKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.min(1, Math.sqrt(a))));
};

const computeCompassBearing = (lat1, lon1, lat2, lon2) => {
  const toRad = (d) => (d * Math.PI) / 180;
  const toDeg = (r) => (r * 180) / Math.PI;
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  const brng = (toDeg(Math.atan2(y, x)) + 360) % 360;
  const dirsFr = ['⬆️ N', '↗️ NE', '➡️ E', '↘️ SE', '⬇️ S', '↙️ SO', '⬅️ O', '↖️ NO'];
  const dirsEn = ['⬆️ N', '↗️ NE', '➡️ E', '↘️ SE', '⬇️ S', '↙️ SW', '⬅️ W', '↖️ NW'];
  const idx = Math.round(brng / 45) % 8;
  return (locale.value === 'fr' ? dirsFr : dirsEn)[idx];
};

const mysterySuggestions = computed(() => {
  const q = normalizeString(mysteryQuery.value);
  if (!q) return [];
  const guessedIds = new Set(mysteryGuesses.value.map((g) => g.id));
  return localizedCountries.value
    .filter((c) => !guessedIds.has(c.id) && normalizeString(c.name).includes(q))
    .slice(0, 5);
});

const initDailyMystery = () => {
  currentMode.value = 'mystery';
  mysteryIsDaily.value = true;
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const idx = (seed * 31) % localizedCountries.value.length;
  mysteryTarget.value = localizedCountries.value[idx];
  mysteryGuesses.value = [];
  mysteryQuery.value = '';
  mysteryFinished.value = false;
  mysteryWon.value = false;
  mysteryCopied.value = false;
};

const startInfiniteMystery = () => {
  currentMode.value = 'mystery';
  mysteryIsDaily.value = false;
  const idx = Math.floor(Math.random() * localizedCountries.value.length);
  mysteryTarget.value = localizedCountries.value[idx];
  mysteryGuesses.value = [];
  mysteryQuery.value = '';
  mysteryFinished.value = false;
  mysteryWon.value = false;
  mysteryCopied.value = false;
};

const submitMysteryGuess = (countryObj = null) => {
  if (mysteryFinished.value || !mysteryTarget.value) return;
  let chosen = countryObj;
  if (!chosen) {
    const q = normalizeString(mysteryQuery.value);
    const aliasIso = COUNTRY_ALIASES[q];
    chosen =
      (aliasIso && localizedCountries.value.find((c) => c.iso === aliasIso)) ||
      localizedCountries.value.find((c) => normalizeString(c.name) === q) ||
      mysterySuggestions.value[0];
  }
  if (!chosen) return;
  if (mysteryGuesses.value.some((g) => g.id === chosen.id)) return;

  focusQuizGlobeOn(chosen.lat, chosen.lng);

  const isCorrect = chosen.id === mysteryTarget.value.id;
  const distKm = isCorrect
    ? 0
    : computeHaversineKm(chosen.lat, chosen.lng, mysteryTarget.value.lat, mysteryTarget.value.lng);
  const proximity = isCorrect ? 100 : Math.max(0, Math.round((1 - distKm / 20000) * 100));
  const direction = isCorrect
    ? '🎯'
    : computeCompassBearing(chosen.lat, chosen.lng, mysteryTarget.value.lat, mysteryTarget.value.lng);

  mysteryGuesses.value.push({
    id: chosen.id,
    iso: chosen.iso,
    name: chosen.name,
    distanceKm: distKm,
    proximity,
    direction,
    isCorrect
  });
  mysteryQuery.value = '';

  if (isCorrect) {
    mysteryWon.value = true;
    mysteryFinished.value = true;
    playSound('victory');
    sauvegarderScore('Pays Mystère (Worldle)', 7 - mysteryGuesses.value.length, 6);
  } else if (mysteryGuesses.value.length >= 6) {
    mysteryWon.value = false;
    mysteryFinished.value = true;
    focusQuizGlobeOn(mysteryTarget.value.lat, mysteryTarget.value.lng);
    playSound('wrong');
  } else {
    playSound('correct');
  }
};

const copyMysteryShareGrid = async () => {
  const rows = mysteryGuesses.value.map((g) => {
    const blocks = Math.round(g.proximity / 20);
    const bar = '🟩'.repeat(blocks) + '⬛'.repeat(5 - blocks);
    return `${bar} ${g.direction} (${g.proximity}%)`;
  });
  const text = `GeoLearn Worldle (${mysteryGuesses.value.length}/6)\n${rows.join('\n')}\nhttps://geolearn.fun`;
  try {
    await navigator.clipboard.writeText(text);
    mysteryCopied.value = true;
  } catch (e) {}
};

// =========================================================
// MODE 4 : ENQUÊTE AUX 5 INDICES (CARTES 3D RECTO-VERSO)
// =========================================================
const detectiveRound = ref(0);
const detectiveScore = ref(0);
const detectiveCluesRevealed = ref(1);
const detectiveTarget = ref(null);
const detectiveQuery = ref('');
const detectiveRoundAnswered = ref(false);
const detectiveRoundWon = ref(false);
const detectiveFinished = ref(false);

const currentDetectiveClues = computed(() => {
  const c = detectiveTarget.value;
  const isFr = locale.value === 'fr';
  if (!c) return [];
  const maskedFact = (c.fact || '').replace(new RegExp(c.name, 'gi'), '███');
  return [
    { type: 'text', label: isFr ? 'Continent & Superficie' : 'Continent & Area', value: `${c.subregion} • ${c.area}` },
    { type: 'text', label: isFr ? 'Population & Monnaie' : 'Population & Currency', value: `${c.population} • ${c.currency}` },
    { type: 'text', label: isFr ? 'Indice Culturel' : 'Cultural Clue', value: maskedFact },
    { type: 'text', label: isFr ? 'Langue & Capitale' : 'Language & Capital', value: `${c.lang} • ${c.capital}` },
    { type: 'flag', label: isFr ? 'Drapeau Officiel' : 'Official Flag', value: c.iso }
  ];
});

const detectiveSuggestions = computed(() => {
  const q = normalizeString(detectiveQuery.value);
  if (!q) return [];
  return localizedCountries.value.filter((c) => normalizeString(c.name).includes(q)).slice(0, 5);
});

const setupDetectiveCase = () => {
  const pool = localizedCountries.value;
  detectiveTarget.value = pool[Math.floor(Math.random() * pool.length)];
  detectiveCluesRevealed.value = 1;
  detectiveQuery.value = '';
  detectiveRoundAnswered.value = false;
  detectiveRoundWon.value = false;
};

const initDetective = () => {
  currentMode.value = 'detective';
  detectiveRound.value = 0;
  detectiveScore.value = 0;
  detectiveFinished.value = false;
  setupDetectiveCase();
};

const submitDetectiveGuess = (countryObj = null) => {
  if (detectiveRoundAnswered.value || !detectiveTarget.value) return;
  let chosen = countryObj;
  if (!chosen) {
    const q = normalizeString(detectiveQuery.value);
    const aliasIso = COUNTRY_ALIASES[q];
    chosen =
      (aliasIso && localizedCountries.value.find((c) => c.iso === aliasIso)) ||
      localizedCountries.value.find((c) => normalizeString(c.name) === q) ||
      detectiveSuggestions.value[0];
  }
  if (!chosen) return;

  detectiveRoundAnswered.value = true;
  if (chosen.id === detectiveTarget.value.id) {
    detectiveRoundWon.value = true;
    detectiveScore.value += 6 - detectiveCluesRevealed.value;
    playSound('correct');
  } else {
    detectiveRoundWon.value = false;
    detectiveCluesRevealed.value = 5;
    playSound('wrong');
  }
};

const nextDetectiveRound = () => {
  if (detectiveRound.value < 4) {
    detectiveRound.value++;
    setupDetectiveCase();
  } else {
    detectiveFinished.value = true;
    playSound('victory');
    sauvegarderScore('Enquête 5 Indices', detectiveScore.value, 25);
  }
};

// =========================================================
// MODE 5 : DÉFIS CHRONO (AVEC GLOBE 3D & CARTE 2D MUETTE)
// =========================================================
const chronoScope = ref('europe');
const chronoViewMode = ref('globe3d');
const chronoDuration = ref(300);
const chronoTimeLeft = ref(300);
const chronoInput = ref('');
const chronoFoundIds = ref([]);
const chronoLastFoundCountry = ref(null);
const chronoDuplicateMsg = ref('');
const chronoFini = ref(false);
const chronoMapZoom = ref(3.5);
const chronoMapCenter = ref([52, 15]);
let chronoTimer = null;

const chronoFoundSet = computed(() => new Set(chronoFoundIds.value));

const chronoTargetCountries = computed(() => {
  if (chronoScope.value === 'europe') {
    return localizedCountries.value.filter((c) => c.continent === 'Europe');
  }
  return localizedCountries.value;
});

const chronoAvailablePresets = computed(() => {
  if (chronoScope.value === 'europe') {
    return [
      { sec: 180, label: '3 min' },
      { sec: 300, label: '5 min' },
      { sec: 0, label: '∞ Sans limite' }
    ];
  }
  return [
    { sec: 900, label: '15 min' },
    { sec: 0, label: '∞ Sans limite' }
  ];
});

const chronoContinentGroups = computed(() => {
  const isFr = locale.value === 'fr';
  const labels = {
    Europe: 'Europe',
    Asia: isFr ? 'Asie' : 'Asia',
    Africa: isFr ? 'Afrique' : 'Africa',
    'North America': isFr ? 'Amérique du Nord' : 'North America',
    'South America': isFr ? 'Amérique du Sud' : 'South America',
    Oceania: isFr ? 'Océanie' : 'Oceania'
  };
  const order = chronoScope.value === 'europe'
    ? ['Europe']
    : ['Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania'];

  return order.map((cont) => {
    const list = chronoTargetCountries.value
      .filter((c) => c.continent === cont)
      .sort((a, b) => a.name.localeCompare(b.name));
    return {
      continent: cont,
      label: labels[cont] || cont,
      countries: list,
      foundCount: list.filter((c) => chronoFoundSet.value.has(c.id)).length
    };
  });
});

const formatTime = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const demarrerChrono = () => {
  currentMode.value = 'chrono';
  if (chronoTimer) clearInterval(chronoTimer);
  chronoFoundIds.value = [];
  chronoLastFoundCountry.value = null;
  chronoDuplicateMsg.value = '';
  chronoInput.value = '';
  chronoFini.value = false;
  chronoTimeLeft.value = chronoDuration.value;

  if (chronoScope.value === 'europe') {
    chronoMapCenter.value = [52, 15];
    chronoMapZoom.value = 3.5;
    focusQuizGlobeOn(50, 14);
  } else {
    chronoMapCenter.value = [25, 12];
    chronoMapZoom.value = 2;
    focusQuizGlobeOn(25, 12);
  }

  if (chronoDuration.value > 0) {
    chronoTimer = setInterval(() => {
      if (chronoTimeLeft.value > 1) {
        chronoTimeLeft.value--;
      } else {
        chronoTimeLeft.value = 0;
        terminerChrono();
      }
    }, 1000);
  }
};

const changerPorteeChrono = (scope) => {
  chronoScope.value = scope;
  chronoDuration.value = scope === 'europe' ? 300 : 900;
  demarrerChrono();
};

const changerDureeChrono = (sec) => {
  chronoDuration.value = sec;
  demarrerChrono();
};

const verifierSaisieChrono = (forceEnter = false) => {
  if (chronoFini.value) return;
  const typed = normalizeString(chronoInput.value);
  if (!typed) {
    chronoDuplicateMsg.value = '';
    return;
  }

  const aliasIso = COUNTRY_ALIASES[typed];

  const alreadyFound = chronoTargetCountries.value.find(
    (c) =>
      chronoFoundSet.value.has(c.id) &&
      (normalizeString(c.name_fr) === typed ||
        normalizeString(c.name_en) === typed ||
        (aliasIso && c.iso === aliasIso))
  );

  if (alreadyFound) {
    chronoDuplicateMsg.value =
      locale.value === 'fr'
        ? `${alreadyFound.name} a déjà été validé !`
        : `${alreadyFound.name} is already found!`;
    return;
  }

  chronoDuplicateMsg.value = '';

  const match = chronoTargetCountries.value.find(
    (c) =>
      !chronoFoundSet.value.has(c.id) &&
      (normalizeString(c.name_fr) === typed ||
        normalizeString(c.name_en) === typed ||
        (aliasIso && c.iso === aliasIso))
  );

  if (match) {
    chronoFoundIds.value.push(match.id);
    chronoLastFoundCountry.value = match;
    chronoInput.value = '';
    focusQuizGlobeOn(match.lat, match.lng);
    playSound('correct');
    if (chronoFoundIds.value.length === chronoTargetCountries.value.length) {
      terminerChrono();
    }
  } else if (forceEnter) {
    playSound('wrong');
  }
};

const terminerChrono = () => {
  if (chronoTimer) clearInterval(chronoTimer);
  chronoFini.value = true;
  playSound('victory');
  const modeLabel = chronoScope.value === 'europe' ? 'Défi Europe (Carte)' : 'Défi Monde (196 pays)';
  sauvegarderScore(modeLabel, chronoFoundIds.value.length, chronoTargetCountries.value.length);
};

// =========================================================
// MODE 6 : CLIQUEZ SUR LA CARTE MUETTE (SETERRA)
// =========================================================
const mapClickScope = ref('europe');
const mapClickPool = ref([]);
const mapClickTargets = ref([]);
const mapClickIndex = ref(0);
const mapClickScore = ref(0);
const mapClickDoneIds = ref(new Set());
const mapClickLastWrongId = ref(null);
const mapClickFinished = ref(false);
const mapClickZoom = ref(3.5);
const mapClickCenter = ref([52, 15]);

const currentMapClickTarget = computed(() => mapClickTargets.value[mapClickIndex.value] || null);

const initMapClick = (scope = 'europe') => {
  currentMode.value = 'map-click';
  mapClickScope.value = scope;
  const pool =
    scope === 'europe'
      ? localizedCountries.value.filter((c) => c.continent === 'Europe')
      : localizedCountries.value;
  mapClickPool.value = pool;
  mapClickTargets.value = [...pool].sort(() => 0.5 - Math.random()).slice(0, scope === 'europe' ? 20 : 25);
  mapClickIndex.value = 0;
  mapClickScore.value = 0;
  mapClickDoneIds.value = new Set();
  mapClickFinished.value = false;
  mapClickCenter.value = scope === 'europe' ? [52, 15] : [25, 12];
  mapClickZoom.value = scope === 'europe' ? 3.5 : 2;
};

const skipMapClickTarget = () => {
  if (mapClickFinished.value) return;
  if (mapClickIndex.value < mapClickTargets.value.length - 1) {
    mapClickIndex.value++;
  } else {
    mapClickFinished.value = true;
  }
};

const handleMapClickCountry = (country) => {
  if (mapClickFinished.value || !currentMapClickTarget.value) return;
  if (country.id === currentMapClickTarget.value.id) {
    playSound('correct');
    mapClickScore.value++;
    const nextSet = new Set(mapClickDoneIds.value);
    nextSet.add(country.id);
    mapClickDoneIds.value = nextSet;
    mapClickLastWrongId.value = null;

    if (mapClickIndex.value < mapClickTargets.value.length - 1) {
      mapClickIndex.value++;
    } else {
      mapClickFinished.value = true;
      playSound('victory');
      sauvegarderScore('Cliquez sur la Carte', mapClickScore.value, mapClickTargets.value.length);
    }
  } else {
    playSound('wrong');
    mapClickLastWrongId.value = country.id;
    if (mapClickIndex.value < mapClickTargets.value.length - 1) {
      mapClickIndex.value++;
    } else {
      mapClickFinished.value = true;
    }
  }
};

// =========================================================
// MODE 7 : FLASHCARDS 3D INTERACTIVES
// =========================================================
const selectedFlashContinent = ref('all');
const flashIndex = ref(0);
const isFlipped = ref(false);
const flashKnownIds = ref(new Set());
const flashShuffleSeed = ref(0);

const filteredFlashcards = computed(() => {
  void flashShuffleSeed.value;
  return selectedFlashContinent.value === 'all'
    ? [...localizedCountries.value]
    : localizedCountries.value.filter((c) => c.continent === selectedFlashContinent.value);
});

const currentFlashcard = computed(() => filteredFlashcards.value[flashIndex.value] || null);

const changerContinentFlash = () => {
  flashIndex.value = 0;
  isFlipped.value = false;
};

const melangerFlashcards = () => {
  countriesData.value = [...countriesData.value].sort(() => 0.5 - Math.random());
  flashIndex.value = 0;
  isFlipped.value = false;
};

const marquerFlashAcquise = () => {
  if (!currentFlashcard.value) return;
  const next = new Set(flashKnownIds.value);
  next.add(currentFlashcard.value.id);
  flashKnownIds.value = next;
  playSound('correct');
  carteSuivante();
};

const carteSuivante = () => {
  if (!filteredFlashcards.value.length) return;
  isFlipped.value = false;
  flashIndex.value = (flashIndex.value + 1) % filteredFlashcards.value.length;
};

const cartePrecedente = () => {
  if (!filteredFlashcards.value.length) return;
  isFlipped.value = false;
  flashIndex.value =
    (flashIndex.value - 1 + filteredFlashcards.value.length) % filteredFlashcards.value.length;
};

// =========================================================
// MODE 8 : GRILLE MONDIALE DES 196 DRAPEAUX (AUTO-FOCUS)
// =========================================================
const flagGridContinent = ref('all');
const flagGridInputs = ref({});
const flagGridSolvedSet = ref(new Set());

const filteredFlagGridCountries = computed(() => {
  if (flagGridContinent.value === 'all') return localizedCountries.value;
  return localizedCountries.value.filter((c) => c.continent === flagGridContinent.value);
});

const flagGridFoundCount = computed(
  () => filteredFlagGridCountries.value.filter((c) => flagGridSolvedSet.value.has(c.id)).length
);

const checkFlagGridItem = (country, idx) => {
  const val = normalizeString(flagGridInputs.value[country.id] || '');
  const aliasIso = COUNTRY_ALIASES[val];
  if (
    val === normalizeString(country.name_fr) ||
    val === normalizeString(country.name_en) ||
    (aliasIso && country.iso === aliasIso)
  ) {
    const next = new Set(flagGridSolvedSet.value);
    next.add(country.id);
    flagGridSolvedSet.value = next;
    playSound('correct');

    nextTick(() => {
      for (let nextIdx = idx + 1; nextIdx < filteredFlagGridCountries.value.length; nextIdx++) {
        const nextCountry = filteredFlagGridCountries.value[nextIdx];
        if (!flagGridSolvedSet.value.has(nextCountry.id)) {
          const el = document.getElementById(`flag-input-${nextIdx}`);
          if (el) {
            el.focus();
            break;
          }
        }
      }
    });
  }
};

// =========================================================
// MODE 9 : CRÉATEUR DE DÉFIS SUR-MESURE
// =========================================================
const customSearch = ref('');
const customSelectedIds = ref([]);
const customBuilderType = ref('capital');
const customLinkCopied = ref(false);

const filteredCustomCountries = computed(() => {
  const q = normalizeString(customSearch.value);
  if (!q) return localizedCountries.value;
  return localizedCountries.value.filter((c) => normalizeString(c.name).includes(q));
});

const toggleCustomCountry = (id) => {
  const idx = customSelectedIds.value.indexOf(id);
  if (idx !== -1) {
    customSelectedIds.value.splice(idx, 1);
  } else if (customSelectedIds.value.length < 15) {
    customSelectedIds.value.push(id);
  }
};

const pickRandomCustomSet = (count = 10) => {
  const shuffled = [...localizedCountries.value].sort(() => 0.5 - Math.random());
  customSelectedIds.value = shuffled.slice(0, count).map((c) => c.id);
};

const copyCustomBuilderLink = async () => {
  const url = `${window.location.origin}/quiz?mode=qcm&type=${customBuilderType.value}&custom=${customSelectedIds.value.join(',')}`;
  try {
    await navigator.clipboard.writeText(url);
    customLinkCopied.value = true;
  } catch (e) {}
};

const launchCustomBuiltQuiz = () => {
  if (customSelectedIds.value.length < 5) return;
  initQcm(customBuilderType.value, customSelectedIds.value);
};

// =========================================================
// CATALOGUE DES 11 MODES
// =========================================================
const menuCategories = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'all', icon: '⊞', label: isFr ? 'Tous les modes (11)' : 'All Modes (11)' },
    { id: 'featured', icon: '★', label: isFr ? 'Défis 3D Phares' : '3D Featured' },
    { id: 'classics', icon: '🏛️', label: isFr ? 'QCM & Connaissances' : 'Quiz & Knowledge' },
    { id: 'study', icon: '🎓', label: isFr ? 'Étude & Sur-mesure' : 'Study & Learn' }
  ];
});

const allMenuCards = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    {
      id: 'mystery',
      cat: 'featured',
      art: 'worldle',
      badgeIcon: '★',
      tag: isFr ? 'Mystère 3D' : '3D Mystery',
      metric: isFr ? '6 ESSAIS' : '6 TRIES',
      shortTitle: 'Worldle 3D',
      duration: '~2 min',
      durationMin: 2,
      popularity: 1,
      title: isFr ? 'Le Pays Mystère (Worldle)' : 'Mystery Country (Worldle)',
      desc: isFr
        ? 'Devinez le pays secret en 6 essais grâce à la distance en kilomètres et au radar Globe 3D de triangulation.'
        : 'Guess the secret country in 6 tries using distance in km and the 3D Globe triangulation radar.',
      cta: isFr ? 'Lancer Worldle 3D' : 'Play Worldle 3D',
      badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/35',
      glowColor: '#a855f7',
      action: () => initDailyMystery()
    },
    {
      id: 'chrono',
      cat: 'featured',
      art: 'chrono',
      badgeIcon: '⚡',
      tag: isFr ? 'Globe 3D' : '3D Globe',
      metric: isFr ? '47 / 196 PAYS' : '47 / 196 STATES',
      shortTitle: isFr ? 'Chrono 3D' : '3D Timed',
      duration: '~3 min',
      durationMin: 3,
      popularity: 2,
      title: isFr ? 'Défi Chrono (Globe 3D & Carte)' : 'Timed Challenge (3D Globe & Map)',
      desc: isFr
        ? 'Saisissez les 47 pays d\'Europe ou les 196 pays du Monde et voyez le Globe 3D tourner et s\'illuminer en direct.'
        : 'Type all 47 European countries or all 196 World countries as the 3D Globe spins and lights up live.',
      cta: isFr ? 'Démarrer le Chrono' : 'Start Timed Challenge',
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35',
      glowColor: '#10b981',
      action: () => demarrerChrono()
    },
    {
      id: 'flash60',
      cat: 'featured',
      art: 'sprint',
      badgeIcon: '🏆',
      tag: 'Arcade',
      metric: 'COMBO X4',
      shortTitle: 'Sprint 60s',
      duration: '~1 min',
      durationMin: 1,
      popularity: 3,
      title: isFr ? 'Sprint Flash 60 Secondes' : '60-Second Flash Sprint',
      desc: isFr
        ? 'Enchaînez un maximum de capitales et de drapeaux en 60 secondes avec multiplicateur x4 et bonus +2s.'
        : 'Chain as many capitals and flags as possible in 60 seconds with x4 multiplier and +2s bonuses.',
      cta: isFr ? 'Lancer le Sprint' : 'Start Sprint',
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/35',
      glowColor: '#f59e0b',
      action: () => startFlash60()
    },
    {
      id: 'detective',
      cat: 'featured',
      art: 'detective',
      badgeIcon: '🧩',
      tag: isFr ? 'Logique 3D' : '3D Logic',
      metric: '25 PTS MAX',
      shortTitle: isFr ? '5 Indices 3D' : '5 Clues 3D',
      duration: '~3 min',
      durationMin: 3,
      popularity: 4,
      title: isFr ? 'Enquête aux 5 Indices 3D' : '5-Clue 3D Detective',
      desc: isFr
        ? 'Retournez les cartes d\'indices en 3D une par une pour démasquer le pays cible avec un maximum de points.'
        : 'Flip 3D clue cards one by one to unmask the target sovereign state with maximum points.',
      cta: isFr ? 'Ouvrir l\'Enquête' : 'Start Investigation',
      badgeClass: 'bg-teal-500/15 text-teal-300 border-teal-500/35',
      glowColor: '#14b8a6',
      action: () => initDetective()
    },
    {
      id: 'qcm-cap',
      cat: 'classics',
      art: 'capitals',
      badgeIcon: '🏛️',
      tag: isFr ? 'Capitales' : 'Capitals',
      metric: '15 QUESTIONS',
      shortTitle: isFr ? 'Capitales' : 'Capitals',
      duration: '~4 min',
      durationMin: 4,
      popularity: 5,
      title: t('home.mode_caps_title'),
      desc: t('home.mode_caps_desc'),
      cta: isFr ? 'Lancer 15 Questions' : 'Start 15 Questions',
      badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/35',
      glowColor: '#38bdf8',
      action: () => initQcm('capital')
    },
    {
      id: 'qcm-flag',
      cat: 'classics',
      art: 'flags',
      badgeIcon: '🚩',
      tag: isFr ? 'Drapeaux' : 'Flags',
      metric: '15 QUESTIONS',
      shortTitle: isFr ? 'Drapeaux' : 'Flags',
      duration: '~4 min',
      durationMin: 4,
      popularity: 6,
      title: t('home.mode_flags_title'),
      desc: t('home.mode_flags_desc'),
      cta: isFr ? 'Lancer 15 Questions' : 'Start 15 Questions',
      badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/35',
      glowColor: '#6366f1',
      action: () => initQcm('flag')
    },
    {
      id: 'qcm-culture',
      cat: 'classics',
      art: 'radar',
      badgeIcon: '🌐',
      tag: 'Culture',
      metric: '15 QUESTIONS',
      shortTitle: 'Culture & Pop',
      duration: '~4 min',
      durationMin: 4,
      popularity: 7,
      title: isFr ? 'Population, Langues & Devises' : 'Population, Languages & Currencies',
      desc: isFr
        ? 'Comparez les populations et identifiez les langues officielles et les monnaies nationales.'
        : 'Compare populations and identify official languages and national currencies.',
      cta: isFr ? 'Lancer 15 Questions' : 'Start 15 Questions',
      badgeClass: 'bg-pink-500/15 text-pink-300 border-pink-500/35',
      glowColor: '#ec4899',
      action: () => initQcm('culture')
    },
    {
      id: 'map-click',
      cat: 'classics',
      art: 'radar',
      badgeIcon: '🎯',
      tag: 'Seterra',
      metric: isFr ? 'SANS CLAVIER' : 'NO TYPING',
      shortTitle: isFr ? 'Clic Carte' : 'Map Click',
      duration: '~3 min',
      durationMin: 3,
      popularity: 8,
      title: isFr ? 'Cliquez sur la Carte Muette' : 'Click on the Blank Map',
      desc: isFr
        ? 'Pointez directement chaque État demandé sur la carte muette sans aucune saisie clavier.'
        : 'Click directly on each requested country on the blank map with zero typing.',
      cta: isFr ? 'Tester ma précision' : 'Play Map Click',
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35',
      glowColor: '#10b981',
      action: () => initMapClick('europe')
    },
    {
      id: 'flashcards',
      cat: 'study',
      art: 'detective',
      badgeIcon: '🎓',
      tag: isFr ? 'Étude 3D' : '3D Study',
      metric: isFr ? '196 FICHES' : '196 CARDS',
      shortTitle: 'Flashcards 3D',
      duration: isFr ? '∞ Libre' : '∞ Untimed',
      durationMin: 10,
      popularity: 9,
      title: t('home.mode_flash_title'),
      desc: isFr
        ? 'Révisez à votre rythme avec les 196 cartes mémoire 3D recto-verso filtrables par continent.'
        : 'Study at your own pace with all 196 double-sided 3D memory cards.',
      cta: isFr ? 'Ouvrir les Flashcards' : 'Open Flashcards',
      badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/35',
      glowColor: '#38bdf8',
      action: () => { currentMode.value = 'flashcards'; }
    },
    {
      id: 'flag-grid',
      cat: 'study',
      art: 'flags',
      badgeIcon: '🏳️',
      tag: isFr ? '196 Drapeaux' : '196 Flags',
      metric: 'AUTO-FOCUS',
      shortTitle: isFr ? 'Grille 196' : 'Flag Grid',
      duration: '~8 min',
      durationMin: 8,
      popularity: 10,
      title: isFr ? 'Grille Mondiale des Drapeaux' : 'World Flag Matrix',
      desc: isFr
        ? 'Identifiez simultanément tous les drapeaux d\'un continent avec passage automatique au suivant.'
        : 'Identify all flags from a continent simultaneously with auto-focus.',
      cta: isFr ? 'Ouvrir la Grille' : 'Open Matrix',
      badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/35',
      glowColor: '#6366f1',
      action: () => { currentMode.value = 'flag-grid'; }
    },
    {
      id: 'custom-builder',
      cat: 'study',
      art: 'worldle',
      badgeIcon: '🔗',
      tag: 'Custom',
      metric: isFr ? '5 À 15 PAYS' : '5 TO 15 STATES',
      shortTitle: isFr ? 'Sur-mesure' : 'Builder',
      duration: '~2 min',
      durationMin: 2,
      popularity: 11,
      title: isFr ? 'Créateur de Défis sur-mesure' : 'Custom Challenge Builder',
      desc: isFr
        ? 'Sélectionnez de 5 à 15 pays précis pour générer un lien de défi partageable avec vos amis.'
        : 'Select 5 to 15 specific countries to generate a shareable challenge link.',
      cta: isFr ? 'Créer un Défi' : 'Build Challenge',
      badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/35',
      glowColor: '#a855f7',
      action: () => { currentMode.value = 'custom-builder'; }
    }
  ];
});

const filteredMenuCards = computed(() => {
  const q = normalizeString(menuSearchQuery.value);
  let list = allMenuCards.value.filter((c) => {
    if (selectedMenuCat.value !== 'all' && c.cat !== selectedMenuCat.value) return false;
    if (q) {
      return (
        normalizeString(c.title).includes(q) ||
        normalizeString(c.desc).includes(q) ||
        normalizeString(c.tag).includes(q)
      );
    }
    return true;
  });

  if (menuSortBy.value === 'fast') {
    list = [...list].sort((a, b) => a.durationMin - b.durationMin);
  } else if (menuSortBy.value === 'name') {
    list = [...list].sort((a, b) => a.title.localeCompare(b.title));
  } else {
    list = [...list].sort((a, b) => a.popularity - b.popularity);
  }
  return list;
});

const activeShowcaseCard = computed(() => {
  const list = filteredMenuCards.value;
  if (!list.length) return allMenuCards.value[0];
  const safeIdx = Math.min(activeCarouselIndex.value, list.length - 1);
  return list[safeIdx] || allMenuCards.value[0];
});

const retourMenu = () => {
  if (flashTimer) clearInterval(flashTimer);
  if (chronoTimer) clearInterval(chronoTimer);
  currentMode.value = 'menu';
  router.replace({ path: '/quiz', query: {} });
  nextTick(() => {
    initThreeWebglController();
  });
};

const applyRouteQuery = (q) => {
  const m = q?.mode;
  if (!m) {
    currentMode.value = 'menu';
    nextTick(() => {
      initThreeWebglController();
    });
    return;
  }
  if (m === 'qcm') {
    const customList = q.custom ? q.custom.split(',').filter(Boolean) : null;
    initQcm(q.type || 'capital', customList);
  } else if (m === 'flash60') {
    startFlash60();
  } else if (m === 'mystery') {
    initDailyMystery();
  } else if (m === 'detective') {
    initDetective();
  } else if (m === 'chrono') {
    demarrerChrono();
  } else if (m === 'map-click') {
    initMapClick('europe');
  } else if (m === 'flashcards') {
    currentMode.value = 'flashcards';
  } else if (m === 'flag-grid') {
    currentMode.value = 'flag-grid';
  } else if (m === 'custom-builder') {
    currentMode.value = 'custom-builder';
  }
};

const handleKeydown = (e) => {
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

  if (currentMode.value === 'menu') {
    if (e.key === 'ArrowRight') stepCarousel(1);
    else if (e.key === 'ArrowLeft') stepCarousel(-1);
    else if (e.key === 'Enter' && activeShowcaseCard.value) {
      activeShowcaseCard.value.action();
    }
  } else if (currentMode.value === 'flashcards') {
    if (e.key === 'ArrowRight') carteSuivante();
    else if (e.key === 'ArrowLeft') cartePrecedente();
    else if (e.key === ' ') {
      e.preventDefault();
      isFlipped.value = !isFlipped.value;
    }
  } else if (currentMode.value === 'qcm' && !qcmFini.value && !qcmIsAnswered.value) {
    const idx = ['1', '2', '3', '4'].indexOf(e.key);
    if (idx !== -1 && qcmOptions.value[idx]) {
      verifierReponseQcm(qcmOptions.value[idx].id);
    }
  } else if (currentMode.value === 'flash60' && !flashFinished.value) {
    const idx = ['1', '2', '3', '4'].indexOf(e.key);
    if (idx !== -1 && flashOptions.value[idx]) {
      submitFlashAnswer(flashOptions.value[idx].id);
    }
  }
};

watch(
  () => route.query,
  (newQuery) => {
    applyRouteQuery(newQuery);
  }
);

onMounted(() => {
  loadQuizVectorBorders();
  initThreeWebglController();
  renderMainLoop();
  applyRouteQuery(route.query);
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('resize', handleWindowResize);
});

onUnmounted(() => {
  if (globeAnimId) cancelAnimationFrame(globeAnimId);
  if (threeRenderer) threeRenderer.dispose();
  if (flashTimer) clearInterval(flashTimer);
  if (chronoTimer) clearInterval(chronoTimer);
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('resize', handleWindowResize);
});
</script>

<style scoped>
/* ========================================================= */
/* SCÈNE WEBGL 3D PLEIN ÉCRAN & ROUE ORBITALE EN ARC         */
/* ========================================================= */
.webgl-showcase-stage {
  min-height: 108vh;
  padding-bottom: 2.5rem;
  background: radial-gradient(circle at 50% 42%, rgba(79, 70, 229, 0.16) 0%, rgba(14, 165, 233, 0.06) 45%, transparent 75%);
  border-bottom: 1px solid var(--border-color);
}

.webgl-controller-mount {
  width: min(94vw, 680px);
  height: 450px;
  min-height: 410px;
}

.ambient-halo {
  position: absolute;
  border-radius: 9999px;
  filter: blur(110px);
  transition: transform 0.25s ease-out, background 0.5s ease;
}

.ambient-halo-center {
  width: 52vw;
  height: 52vw;
  top: 44%;
  left: 50%;
}

.giant-kinetic-bg {
  position: absolute;
  top: 42%;
  left: 50%;
  white-space: nowrap;
  font-weight: 900;
  font-size: clamp(4.5rem, 15vw, 14.5rem);
  letter-spacing: -0.05em;
  line-height: 0.85;
  color: rgba(148, 163, 184, 0.04);
  pointer-events: none;
  user-select: none;
  transition: transform 0.22s ease-out;
}

.arc-wheel-viewport {
  height: 230px;
  margin-top: 0.75rem;
  perspective: 1600px;
  transform-style: preserve-3d;
}

.arc-wheel-card {
  transition:
    transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.45s ease,
    border-color 0.25s ease,
    box-shadow 0.35s ease;
  will-change: transform, opacity;
}

.matrix-tilt-card {
  transition: transform 0.18s ease-out, border-color 0.25s ease, box-shadow 0.25s ease;
  will-change: transform;
}

.slide-up-fade-enter-active,
.slide-up-fade-leave-active {
  transition: opacity 0.24s ease, transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
}
.slide-up-fade-enter-from {
  opacity: 0;
  transform: translateY(14px);
}
.slide-up-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.grid-cols-15 {
  grid-template-columns: repeat(15, minmax(0, 1fr));
}

/* Transforme le fond physique muet en carte tactique sombre sans aucun texte */
.quiz-mute-map.is-dark-mute :deep(.leaflet-tile-pane) {
  filter: invert(100%) hue-rotate(190deg) brightness(78%) contrast(125%) saturate(60%);
}

/* Transitions spatiales entre les modes et questions */
.stage-morph-enter-active,
.stage-morph-leave-active,
.card-flip-fade-enter-active,
.card-flip-fade-leave-active {
  transition:
    opacity 0.26s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.stage-morph-enter-from,
.card-flip-fade-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.985);
}

.stage-morph-leave-to,
.card-flip-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.985);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* Flashcards 3D & Cartes d'Indices 3D Recto-Verso */
.flash-3d-scene,
.clue-3d-scene {
  perspective: 1400px;
  cursor: pointer;
}

.flash-3d-inner {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  min-height: 360px;
  transform-style: preserve-3d;
  transition: transform 0.72s cubic-bezier(0.22, 1, 0.36, 1);
}

.clue-3d-inner {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  min-height: 122px;
  transform-style: preserve-3d;
  transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}

.flash-3d-inner.is-flipped,
.clue-3d-inner.is-flipped {
  transform: rotateY(180deg);
}

.flash-3d-face,
.clue-3d-face {
  grid-area: 1 / 1;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.flash-3d-front,
.clue-3d-front {
  transform: rotateY(0deg);
}

.flash-3d-back,
.clue-3d-back {
  transform: rotateY(180deg);
}

@media (max-width: 1023px) {
  .webgl-controller-mount {
    width: min(92vw, 420px);
    height: 290px;
    min-height: 260px;
  }
}
</style>