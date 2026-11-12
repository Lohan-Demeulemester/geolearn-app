<template>
  <div class="collection-experience max-w-[1400px] mx-auto px-2 sm:px-6 pb-24 space-y-8 select-none">

    <!-- ========================================================= -->
    <!-- 1. EN-TÊTE & SÉLECTEUR DE VUE (TROPHÉES I->V / PASSEPORT) -->
    <!-- ========================================================= -->
    <header class="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-5 sm:p-7 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="space-y-1">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-600 dark:text-sky-400 font-mono text-[11px] font-bold uppercase tracking-wider">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{{ locale === 'fr' ? 'ARCHIVES D\'ACCRÉDITATION // PALIER I À V' : 'ACCREDITATION ARCHIVES // TIER I TO V' }}</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {{ locale === 'fr' ? 'Ma Collection & Trophées 3D' : 'My Collection & 3D Trophies' }}
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {{ locale === 'fr'
            ? 'Inspectez vos insignes évolutifs en 3D et suivez la complétion de votre passeport géodésique sur 196 États.'
            : 'Inspect your evolving 3D insignias and track your geodesic passport completion across 196 states.' }}
        </p>
      </div>

      <!-- Bascule : Trophées Évolutifs (12 x 5 Paliers) vs Passeport 196 États -->
      <div class="flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-slate-200/70 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 self-start lg:self-auto">
        <button
          type="button"
          @click="activeSection = 'trophies'"
          class="px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
          :class="activeSection === 'trophies'
            ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-950 font-black shadow-md'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
          <span>{{ locale === 'fr' ? `Trophées Évolutifs (${unlockedBadgesCount}/12)` : `Evolving Trophies (${unlockedBadgesCount}/12)` }}</span>
        </button>

        <button
          type="button"
          @click="activeSection = 'passport'"
          class="px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
          :class="activeSection === 'passport'
            ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-950 font-black shadow-md'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
          <span>{{ locale === 'fr' ? `Passeport 196 États (${stampedCountriesCount}/196)` : `196-State Passport (${stampedCountriesCount}/196)` }}</span>
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
        {{ locale === 'fr' ? 'Authentification Requise' : 'Authentication Required' }}
      </h2>
      <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        {{ locale === 'fr'
          ? 'Connectez-vous à votre profil pour synchroniser vos trophées évolutifs et débloquer les 196 tampons de votre passeport.'
          : 'Sign in to your profile to synchronize your evolving trophies and unlock all 196 state stamps in your passport.' }}
      </p>
      <router-link
        to="/profil"
        class="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-950 font-black text-xs sm:text-sm transition shadow-lg shadow-sky-500/20"
      >
        <span>{{ locale === 'fr' ? 'Se connecter / Créer un compte' : 'Sign In / Create Account' }}</span>
        <span>→</span>
      </router-link>
    </div>

    <!-- ========================================================= -->
    <!-- 3. CONTENU PRINCIPAL CONNECTÉ                             -->
    <!-- ========================================================= -->
    <template v-else>

      <!-- A. BARRE DE SYNTHÈSE TÉLÉMÉTRIQUE (4 KPI) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-xl p-5 flex items-center gap-4 shadow-lg">
          <div class="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/25 text-sky-400 flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div class="min-w-0">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 block truncate">
              {{ locale === 'fr' ? 'Grade d\'Opérateur' : 'Operator Rank' }}
            </span>
            <strong class="font-mono text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate block mt-0.5">
              {{ operatorRankTitle }}
            </strong>
          </div>
        </div>

        <div class="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-xl p-5 flex items-center gap-4 shadow-lg">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          </div>
          <div class="min-w-0">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 block truncate">
              {{ locale === 'fr' ? 'Paliers Débloqués (I→V)' : 'Tiers Unlocked (I→V)' }}
            </span>
            <strong class="font-mono text-2xl font-black text-emerald-500 dark:text-emerald-400 block mt-0.5">
              {{ totalTiersEarned }} <span class="text-xs font-bold text-slate-400">/ 60</span>
            </strong>
          </div>
        </div>

        <div class="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-xl p-5 flex items-center gap-4 shadow-lg">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div class="min-w-0">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 block truncate">
              {{ locale === 'fr' ? 'Expérience Cumulée' : 'Total Telemetry XP' }}
            </span>
            <strong class="font-mono text-2xl font-black text-amber-500 dark:text-amber-400 block mt-0.5">
              {{ totalCollectionXp.toLocaleString() }} <span class="text-xs font-bold text-slate-400">XP</span>
            </strong>
          </div>
        </div>

        <div class="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-xl p-5 flex items-center gap-4 shadow-lg">
          <div class="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/25 text-sky-400 flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div class="min-w-0">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 block truncate">
              {{ locale === 'fr' ? 'Couverture Passeport' : 'Passport Coverage' }}
            </span>
            <strong class="font-mono text-2xl font-black text-sky-500 dark:text-sky-400 block mt-0.5">
              {{ Math.round((stampedCountriesCount / 196) * 100) }}% <span class="text-xs font-bold text-slate-400">({{ stampedCountriesCount }}/196)</span>
            </strong>
          </div>
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- B. SECTION 1 : MATRICE DES 12 TROPHÉES ÉVOLUTIFS & 3D   -->
      <!-- ======================================================= -->
      <transition name="stage-morph" mode="out-in">
        <div v-if="activeSection === 'trophies'" key="view-trophies" class="space-y-8">

          <!-- VITRINE D'INSPECTION 3D DU TROPHÉE SÉLECTIONNÉ -->
          <section class="relative overflow-hidden rounded-[2rem] border border-slate-200/80 dark:border-white/12 bg-white dark:bg-[#070B16] p-6 sm:p-8 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div
              class="pointer-events-none absolute -top-24 right-1/4 w-96 h-96 rounded-full blur-[110px] opacity-30 transition-all duration-500"
              :style="{ background: selectedBadge.accentHex }"
            ></div>

            <!-- Gauche (5 cols) : Scène 3D Interactive du Cristal / Trophée -->
            <div class="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div class="w-full flex items-center justify-between font-mono text-[10px] text-slate-400 pb-2 border-b border-slate-200 dark:border-white/10">
                <span class="text-sky-500 dark:text-sky-400 font-bold">{{ selectedBadge.code }} // 3D RELIC</span>
                <span>{{ selectedBadge.currentTier > 0 ? `TIER ${romanNumerals[selectedBadge.currentTier - 1]}` : 'LOCKED' }}</span>
              </div>

              <canvas
                ref="relicCanvasRef"
                width="320"
                height="300"
                class="w-[270px] h-[250px] sm:w-[310px] sm:h-[285px] cursor-grab active:cursor-grabbing my-1"
                style="touch-action: none;"
                @pointerdown="onRelicPointerDown"
                @pointermove="onRelicPointerMove"
                @pointerup="onRelicPointerUp"
                @pointerleave="onRelicPointerUp"
              ></canvas>

              <span class="px-3.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 font-mono text-[10px] text-slate-500 dark:text-sky-300">
                {{ locale === 'fr' ? 'GLISSER POUR TOURNER L\'INSIGNE 3D' : 'DRAG TO ROTATE 3D INSIGNIA' }}
              </span>
            </div>

            <!-- Droite (7 cols) : Détails du Trophée & Échelle des 5 Paliers (I -> V) -->
            <div class="lg:col-span-7 space-y-5">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span
                      class="px-3 py-1 rounded-full font-mono text-[10px] font-black uppercase border"
                      :class="getTierBadgeClass(selectedBadge.currentTier)"
                    >
                      {{ selectedBadge.currentTier > 0
                        ? (locale === 'fr' ? `PALIER ${romanNumerals[selectedBadge.currentTier - 1]} DÉBLOQUÉ` : `TIER ${romanNumerals[selectedBadge.currentTier - 1]} UNLOCKED`)
                        : (locale === 'fr' ? 'NON DÉBLOQUÉ' : 'LOCKED') }}
                    </span>
                    <span class="font-mono text-xs text-slate-400">
                      {{ selectedBadge.categoryLabel }}
                    </span>
                  </div>

                  <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {{ selectedBadge.title }}
                  </h2>
                  <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {{ selectedBadge.desc }}
                  </p>
                </div>

                <router-link
                  :to="selectedBadge.playRoute"
                  class="px-5 py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-950 font-black text-xs transition hover:scale-105 shadow-lg shadow-sky-500/20 shrink-0"
                >
                  {{ locale === 'fr' ? 'Progresser dans ce mode →' : 'Play this mode →' }}
                </router-link>
              </div>

              <!-- Barre de progression vers le prochain palier -->
              <div class="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/10">
                <div class="flex items-center justify-between font-mono text-xs">
                  <span class="text-slate-500 dark:text-slate-400 font-bold">
                    {{ locale === 'fr' ? 'PROGRESSION ACTUELLE :' : 'CURRENT METRIC:' }}
                    <strong class="text-slate-900 dark:text-white ml-1">{{ selectedBadge.currentValue }} {{ selectedBadge.unit }}</strong>
                  </span>
                  <span class="text-sky-500 dark:text-sky-400 font-black">
                    {{ selectedBadge.nextThreshold
                      ? (locale === 'fr' ? `PROCHAIN PALIER : ${selectedBadge.nextThreshold} ${selectedBadge.unit}` : `NEXT TIER: ${selectedBadge.nextThreshold} ${selectedBadge.unit}`)
                      : (locale === 'fr' ? 'MAÎTRISE MAXIMALE (PALIER V)' : 'MAX MASTERY (TIER V)') }}
                  </span>
                </div>

                <div class="h-2.5 w-full rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-500"
                    :style="{ width: `${selectedBadge.progressPct}%` }"
                  ></div>
                </div>
              </div>

              <!-- Grille des 5 Paliers (I, II, III, IV, V) -->
              <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <div
                  v-for="(tierObj, tIdx) in selectedBadge.tiers"
                  :key="'tier-step-' + tIdx"
                  class="p-3 rounded-2xl border text-center transition-all flex flex-col justify-between gap-1.5"
                  :class="selectedBadge.currentTier >= tIdx + 1
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-900 dark:text-white shadow-sm'
                    : 'bg-slate-50/50 dark:bg-white/[0.02] border-slate-200/60 dark:border-white/[0.06] text-slate-400 opacity-55'"
                >
                  <div class="flex items-center justify-between font-mono text-[10px] font-black">
                    <span :class="selectedBadge.currentTier >= tIdx + 1 ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400'">
                      TIER {{ romanNumerals[tIdx] }}
                    </span>
                    <span>{{ selectedBadge.currentTier >= tIdx + 1 ? '✓' : '•' }}</span>
                  </div>
                  <strong class="font-mono text-xs sm:text-sm font-black block">
                    {{ tierObj.target }} {{ selectedBadge.unit }}
                  </strong>
                  <span class="text-[10px] font-semibold truncate block opacity-80">
                    {{ tierObj.name }}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <!-- FILTRES DES TROPHÉES -->
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-slate-200/70 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10">
              <button
                v-for="f in badgeFilters"
                :key="f.id"
                type="button"
                @click="selectedFilter = f.id"
                class="px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer"
                :class="selectedFilter === f.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
              >
                {{ f.label }}
              </button>
            </div>

            <span class="font-mono text-xs text-slate-400">
              {{ locale === 'fr' ? 'Cliquez sur une carte pour l\'inspecter en 3D' : 'Click any card to inspect in 3D' }}
            </span>
          </div>

          <!-- GRILLE DES 12 CARTES DE TROPHÉES AVEC EFFET 3D TILT & REFLET HOLOGRAPHIQUE -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <article
              v-for="badge in filteredBadges"
              :key="badge.id"
              @click="selectBadgeFor3D(badge)"
              @pointermove="onCardPointerMove($event, badge.id)"
              @pointerleave="onCardPointerLeave(badge.id)"
              class="holo-tilt-card group relative overflow-hidden rounded-3xl border p-6 flex flex-col justify-between gap-4 cursor-pointer"
              :class="[
                selectedBadgeId === badge.id
                  ? 'border-sky-400 ring-2 ring-sky-400/25 bg-white dark:bg-[#0D1528]'
                  : badge.currentTier > 0
                    ? 'border-slate-200/90 dark:border-white/12 bg-white/95 dark:bg-[#090E1A]/95 hover:border-sky-500/50'
                    : 'border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-[#070B14]/70 opacity-75 hover:opacity-100'
              ]"
              :style="getCardTiltStyle(badge.id)"
            >
              <!-- Reflet spéculaire holographique suivant le curseur -->
              <div
                class="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                :style="getCardGlareStyle(badge.id, badge.accentHex)"
              ></div>

              <div class="relative z-10 space-y-4">
                <div class="flex items-center justify-between gap-2">
                  <span class="font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300">
                    {{ badge.code }}
                  </span>

                  <span
                    class="px-3 py-1 rounded-full font-mono text-[10px] font-black uppercase border"
                    :class="getTierBadgeClass(badge.currentTier)"
                  >
                    {{ badge.currentTier > 0 ? `PALIER ${romanNumerals[badge.currentTier - 1]}` : (locale === 'fr' ? 'VERROUILLÉ' : 'LOCKED') }}
                  </span>
                </div>

                <div class="flex items-start justify-between gap-4">
                  <div class="space-y-1 min-w-0">
                    <h3 class="text-lg font-black text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors truncate">
                      {{ badge.title }}
                    </h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {{ badge.desc }}
                    </p>
                  </div>

                  <!-- Emblème vectoriel géométrique -->
                  <div
                    class="w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center border transition-transform group-hover:scale-110"
                    :style="{
                      backgroundColor: `${badge.accentHex}18`,
                      borderColor: `${badge.accentHex}45`,
                      color: badge.accentHex
                    }"
                  >
                    <svg v-if="badge.shape === 'octa'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="12 2 22 12 12 22 2 12 12 2" />
                      <line x1="12" y1="2" x2="12" y2="22" /><line x1="2" y1="12" x2="22" y2="12" />
                    </svg>
                    <svg v-else-if="badge.shape === 'globe'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10" /><path d="M2 12h20" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    <svg v-else-if="badge.shape === 'shield'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Barre des 5 segments de palier (I -> V) -->
              <div class="relative z-10 space-y-2 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
                <div class="flex items-center justify-between font-mono text-[11px]">
                  <span class="text-slate-500 dark:text-slate-400">
                    {{ badge.currentValue }} {{ badge.unit }}
                  </span>
                  <span class="font-bold text-sky-500 dark:text-sky-400">
                    {{ badge.nextThreshold ? `/ ${badge.nextThreshold} ${badge.unit}` : 'MAX' }}
                  </span>
                </div>

                <div class="grid grid-cols-5 gap-1.5 h-2">
                  <div
                    v-for="step in 5"
                    :key="badge.id + '-s-' + step"
                    class="rounded-full transition-all duration-300"
                    :class="step <= badge.currentTier
                      ? 'bg-gradient-to-r from-sky-400 to-emerald-400'
                      : 'bg-slate-200 dark:bg-white/10'"
                  ></div>
                </div>
              </div>
            </article>
          </div>

        </div>

        <!-- ======================================================= -->
        <!-- C. SECTION 2 : PASSEPORT GÉODÉSIQUE DES 196 ÉTATS       -->
        <!-- ======================================================= -->
        <div v-else key="view-passport" class="space-y-6">

          <!-- Barre de contrôle du Passeport : Continents + Recherche -->
          <div class="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090E1A]/90 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl">
            <div class="flex flex-wrap items-center gap-1.5">
              <button
                v-for="cont in passportContinents"
                :key="cont.id"
                type="button"
                @click="passportContinent = cont.id"
                class="px-3.5 py-2 rounded-full text-xs font-bold transition cursor-pointer"
                :class="passportContinent === cont.id
                  ? 'bg-sky-500 text-slate-950 font-black'
                  : 'bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 hover:text-white'"
              >
                {{ cont.label }} ({{ cont.stamped }}/{{ cont.total }})
              </button>
            </div>

            <div class="relative w-full lg:w-64">
              <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input
                v-model="passportQuery"
                type="text"
                :placeholder="locale === 'fr' ? 'Chercher un État...' : 'Search a state...'"
                class="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <!-- Grille des 196 Tampons Nationaux -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            <div
              v-for="c in filteredPassportCountries"
              :key="'pass-' + c.iso"
              class="p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2.5"
              :class="c.isStamped
                ? 'bg-white dark:bg-[#090E1A] border-emerald-500/40 shadow-md'
                : 'bg-slate-100/50 dark:bg-white/[0.02] border-dashed border-slate-300 dark:border-white/10 opacity-45'"
            >
              <div class="flex items-center justify-between gap-2">
                <img
                  :src="`https://flagcdn.com/w80/${c.iso}.png`"
                  :alt="c.name"
                  class="h-7 w-auto rounded shadow-2xs object-contain"
                  loading="lazy"
                />
                <span
                  class="font-mono text-[9px] font-black px-2 py-0.5 rounded-full border uppercase"
                  :class="c.isStamped
                    ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-500 dark:text-emerald-400'
                    : 'border-slate-300 dark:border-white/10 text-slate-400'"
                >
                  {{ c.isStamped ? 'STAMPED' : c.iso }}
                </span>
              </div>

              <div>
                <strong class="text-xs font-black text-slate-900 dark:text-white truncate block">
                  {{ c.name }}
                </strong>
                <span class="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
                  {{ c.capital }}
                </span>
              </div>
            </div>
          </div>

        </div>
      </transition>

    </template>

  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ALL_COUNTRIES from '../data/countries.js';

const { locale } = useI18n();
const API_URL = 'https://geolearn-backend-bj65.onrender.com';

const isLoggedIn = ref(false);
const userScores = ref([]);
const activeSection = ref('trophies'); // 'trophies' | 'passport'
const selectedFilter = ref('all');
const selectedBadgeId = ref('veteran');
const romanNumerals = ['I', 'II', 'III', 'IV', 'V'];

// =========================================================
// CALCUL DES MÉTRIQUES DU JOUEUR DEPUIS SON HISTORIQUE
// =========================================================
const metrics = computed(() => {
  const scores = userScores.value;
  const totalGames = scores.length;

  let perfectQcms = 0;
  let capitalsBest = 0;
  let flagsBest = 0;
  let cultureBest = 0;
  let sprintBest = 0;
  let worldleWins = 0;
  let detectiveBest = 0;
  let europeBest = 0;
  let worldBest = 0;
  let pinDropBest = 0;
  let duelWins = 0;

  for (const s of scores) {
    const m = (s.mode || '').toLowerCase();
    const val = Number(s.score) || 0;
    const max = Number(s.max_score) || 15;

    if (max === 15 && !m.includes('flash') && !m.includes('sprint') && val >= 14) {
      perfectQcms++;
    }
    if (m.includes('capitale') || m.includes('capital')) {
      if (val > capitalsBest) capitalsBest = val;
    }
    if (m.includes('drapeau') || m.includes('flag')) {
      if (val > flagsBest) flagsBest = val;
    }
    if (m.includes('culture')) {
      if (val > cultureBest) cultureBest = val;
    }
    if (m.includes('flash') || m.includes('sprint')) {
      const norm = max === 15 ? val : Math.min(15, Math.round((val / 30) * 15));
      if (norm > sprintBest) sprintBest = norm;
    }
    if (m.includes('myst') || m.includes('worldle')) {
      if (val >= 1) worldleWins++;
    }
    if (m.includes('enqu') || m.includes('indice') || m.includes('detective')) {
      if (val > detectiveBest) detectiveBest = val;
    }
    if (m.includes('europe')) {
      if (val > europeBest) europeBest = val;
    }
    if (m.includes('monde') || m.includes('196')) {
      if (val > worldBest) worldBest = val;
    }
    if (m.includes('geoguessr') || m.includes('pindrop')) {
      if (val > pinDropBest) pinDropBest = val;
    }
    if (m.includes('duel')) {
      if (val >= 8) duelWins++;
    }
  }

  return {
    totalGames,
    perfectQcms,
    capitalsBest,
    flagsBest,
    cultureBest,
    sprintBest,
    worldleWins,
    detectiveBest,
    europeBest,
    worldBest,
    pinDropBest,
    duelWins
  };
});

// =========================================================
// DÉFINITION DES 12 FAMILLES DE TROPHÉES ÉVOLUTIFS (I -> V)
// =========================================================
const buildBadgeObject = (cfg) => {
  let currentTier = 0;
  let nextThreshold = cfg.tiers[0].target;

  for (let i = 0; i < cfg.tiers.length; i++) {
    if (cfg.currentValue >= cfg.tiers[i].target) {
      currentTier = i + 1;
      nextThreshold = cfg.tiers[i + 1] ? cfg.tiers[i + 1].target : null;
    }
  }

  const maxTarget = nextThreshold || cfg.tiers[cfg.tiers.length - 1].target;
  const progressPct = Math.min(100, Math.round((cfg.currentValue / Math.max(1, maxTarget)) * 100));

  return {
    ...cfg,
    currentTier,
    accentHex: getTierHex(currentTier),
    nextThreshold,
    progressPct,
    unlocked: currentTier > 0
  };
};

const allBadges = computed(() => {
  const isFr = locale.value === 'fr';
  const m = metrics.value;

  const definitions = [
    {
      id: 'veteran',
      code: 'OPS-01 // VETERAN',
      cat: 'general',
      categoryLabel: isFr ? 'Carrière Globale' : 'Global Career',
      shape: 'octa',
      accentHex: '#38bdf8',
      title: isFr ? 'Opérateur Orbital' : 'Orbital Operator',
      desc: isFr
        ? 'Complétez des sessions d\'évaluation tous modes confondus pour élever votre grade.'
        : 'Complete evaluation sessions across all game modes to elevate your rank.',
      currentValue: m.totalGames,
      unit: isFr ? 'parties' : 'games',
      playRoute: '/quiz',
      tiers: [
        { target: 1, name: isFr ? 'Initié' : 'Initiate' },
        { target: 5, name: isFr ? 'Éclaireur' : 'Scout' },
        { target: 15, name: isFr ? 'Analyste' : 'Analyst' },
        { target: 30, name: isFr ? 'Commandant' : 'Commander' },
        { target: 50, name: isFr ? 'Légende' : 'Legend' }
      ]
    },
    {
      id: 'precision',
      code: 'QCM-02 // PRECISION',
      cat: 'qcm',
      categoryLabel: 'QCM /15',
      shape: 'star',
      accentHex: '#10b981',
      title: isFr ? 'Chirurgien du QCM' : 'QCM Precision Ace',
      desc: isFr
        ? 'Obtenez un score d\'excellence (14/15 ou 15/15) dans les QCM classiques.'
        : 'Achieve excellence scores (14/15 or 15/15) in classic 15-question QCMs.',
      currentValue: m.perfectQcms,
      unit: isFr ? 'sans-faute' : 'masteries',
      playRoute: { path: '/quiz', query: { mode: 'qcm', type: 'capital' } },
      tiers: [
        { target: 1, name: 'Bronze' },
        { target: 3, name: isFr ? 'Argent' : 'Silver' },
        { target: 7, name: isFr ? 'Or' : 'Gold' },
        { target: 15, name: isFr ? 'Émeraude' : 'Emerald' },
        { target: 25, name: isFr ? 'Diamant' : 'Diamond' }
      ]
    },
    {
      id: 'capitals',
      code: 'CAP-03 // METROPOLIS',
      cat: 'qcm',
      categoryLabel: isFr ? 'Capitales' : 'Capitals',
      shape: 'shield',
      accentHex: '#0ea5e9',
      title: isFr ? 'Maître des Capitales' : 'Capitals Sovereign',
      desc: isFr
        ? 'Atteignez le score maximal sur une série de 15 questions de Capitales.'
        : 'Reach the highest score on a 15-question Capitals series.',
      currentValue: m.capitalsBest,
      unit: '/ 15',
      playRoute: { path: '/quiz', query: { mode: 'qcm', type: 'capital' } },
      tiers: [
        { target: 6, name: isFr ? 'Novice' : 'Novice' },
        { target: 9, name: isFr ? 'Régulier' : 'Regular' },
        { target: 12, name: isFr ? 'Expert' : 'Expert' },
        { target: 14, name: isFr ? 'Maître' : 'Master' },
        { target: 15, name: isFr ? 'Parfait' : 'Perfect' }
      ]
    },
    {
      id: 'flags',
      code: 'FLG-04 // VEXILLOLOGY',
      cat: 'qcm',
      categoryLabel: isFr ? 'Drapeaux' : 'Flags',
      shape: 'octa',
      accentHex: '#38bdf8',
      title: isFr ? 'Expert Vexillologue' : 'Vexillology Specialist',
      desc: isFr
        ? 'Identifiez les drapeaux nationaux sans erreur sur une série de 15 questions.'
        : 'Identify national flags without error across a 15-question series.',
      currentValue: m.flagsBest,
      unit: '/ 15',
      playRoute: { path: '/quiz', query: { mode: 'qcm', type: 'flag' } },
      tiers: [
        { target: 6, name: isFr ? 'Novice' : 'Novice' },
        { target: 9, name: isFr ? 'Régulier' : 'Regular' },
        { target: 12, name: isFr ? 'Expert' : 'Expert' },
        { target: 14, name: isFr ? 'Maître' : 'Master' },
        { target: 15, name: isFr ? 'Parfait' : 'Perfect' }
      ]
    },
    {
      id: 'culture',
      code: 'CUL-05 // DEMOGRAPHY',
      cat: 'qcm',
      categoryLabel: 'Culture & Pop',
      shape: 'globe',
      accentHex: '#10b981',
      title: isFr ? 'Analyste Géopolitique' : 'Geopolitical Analyst',
      desc: isFr
        ? 'Maîtrisez les monnaies, les langues officielles et les ordres de grandeur démographiques.'
        : 'Master currencies, official languages, and demographic magnitudes.',
      currentValue: m.cultureBest,
      unit: '/ 15',
      playRoute: { path: '/quiz', query: { mode: 'qcm', type: 'culture' } },
      tiers: [
        { target: 5, name: isFr ? 'Curieux' : 'Curious' },
        { target: 8, name: isFr ? 'Averti' : 'Informed' },
        { target: 11, name: isFr ? 'Érudit' : 'Scholar' },
        { target: 13, name: isFr ? 'Stratège' : 'Strategist' },
        { target: 15, name: isFr ? 'Omniscient' : 'Omniscient' }
      ]
    },
    {
      id: 'sprint60',
      code: 'SPD-06 // SPRINT 60S',
      cat: '3d',
      categoryLabel: 'Arcade 60s',
      shape: 'star',
      accentHex: '#f59e0b',
      title: isFr ? 'Vélocité Supersonique' : 'Supersonic Velocity',
      desc: isFr
        ? 'Enchaînez les combos x4 dans le Sprint 60 secondes (note ramenée sur 15).'
        : 'Chain x4 combos in the 60-second Flash Sprint (normalized on 15).',
      currentValue: m.sprintBest,
      unit: '/ 15',
      playRoute: { path: '/quiz', query: { mode: 'flash60' } },
      tiers: [
        { target: 5, name: 'Mach 1' },
        { target: 8, name: 'Mach 2' },
        { target: 11, name: 'Mach 3' },
        { target: 13, name: 'Mach 4' },
        { target: 15, name: 'Hypersonic' }
      ]
    },
    {
      id: 'worldle',
      code: 'WLD-07 // TRIANGULATION',
      cat: '3d',
      categoryLabel: 'Worldle 3D',
      shape: 'globe',
      accentHex: '#0ea5e9',
      title: isFr ? 'Triangulateur Haversine' : 'Haversine Triangulator',
      desc: isFr
        ? 'Démasquez le Pays Mystère en moins de 6 essais grâce au radar 3D.'
        : 'Unmask the Mystery Country in under 6 tries using the 3D radar.',
      currentValue: m.worldleWins,
      unit: isFr ? 'victoires' : 'wins',
      playRoute: { path: '/quiz', query: { mode: 'mystery' } },
      tiers: [
        { target: 1, name: isFr ? 'Détecteur' : 'Finder' },
        { target: 3, name: isFr ? 'Pisteur' : 'Tracker' },
        { target: 7, name: isFr ? 'Navigateur' : 'Navigator' },
        { target: 15, name: isFr ? 'Cartographe' : 'Cartographer' },
        { target: 30, name: isFr ? 'Oracle 3D' : '3D Oracle' }
      ]
    },
    {
      id: 'detective',
      code: 'INT-08 // 5 CLUES',
      cat: '3d',
      categoryLabel: isFr ? 'Enquête 3D' : '3D Detective',
      shape: 'shield',
      accentHex: '#10b981',
      title: isFr ? 'Agent de Renseignement' : 'Intelligence Operative',
      desc: isFr
        ? 'Identifiez les 5 dossiers d\'enquête en retournant un minimum de cartes 3D.'
        : 'Solve all 5 investigation files while flipping as few 3D clue cards as possible.',
      currentValue: m.detectiveBest,
      unit: '/ 25 pts',
      playRoute: { path: '/quiz', query: { mode: 'detective' } },
      tiers: [
        { target: 10, name: isFr ? 'Enquêteur' : 'Investigator' },
        { target: 15, name: isFr ? 'Inspecteur' : 'Inspector' },
        { target: 19, name: isFr ? 'Détective' : 'Detective' },
        { target: 22, name: isFr ? 'Agent Spécial' : 'Special Agent' },
        { target: 25, name: isFr ? 'Directeur' : 'Director' }
      ]
    },
    {
      id: 'europe',
      code: 'EUR-09 // 47 STATES',
      cat: 'map',
      categoryLabel: 'Atlas Europe',
      shape: 'globe',
      accentHex: '#38bdf8',
      title: isFr ? 'Souverain d\'Europe' : 'Europe Sovereign',
      desc: isFr
        ? 'Nommez au clavier les 47 États d\'Europe sur le Globe 3D et la carte muette.'
        : 'Type all 47 European states on the 3D Globe and blank map.',
      currentValue: m.europeBest,
      unit: '/ 47',
      playRoute: { path: '/quiz', query: { mode: 'chrono' } },
      tiers: [
        { target: 15, name: '15 / 47' },
        { target: 25, name: '25 / 47' },
        { target: 35, name: '35 / 47' },
        { target: 42, name: '42 / 47' },
        { target: 47, name: '47 / 47' }
      ]
    },
    {
      id: 'world196',
      code: 'GLB-10 // 196 STATES',
      cat: 'map',
      categoryLabel: 'Atlas 196',
      shape: 'globe',
      accentHex: '#10b981',
      title: isFr ? 'Atlas Vivant (196 États)' : 'Living World Atlas (196)',
      desc: isFr
        ? 'Saisissez les 196 États souverains du monde lors du grand Défi Chrono.'
        : 'Type all 196 sovereign states of the world during the Full World Challenge.',
      currentValue: m.worldBest,
      unit: '/ 196',
      playRoute: { path: '/quiz', query: { mode: 'chrono' } },
      tiers: [
        { target: 30, name: '30 / 196' },
        { target: 65, name: '65 / 196' },
        { target: 110, name: '110 / 196' },
        { target: 155, name: '155 / 196' },
        { target: 196, name: '196 / 196' }
      ]
    },
    {
      id: 'pindrop',
      code: 'SAT-11 // PINDROP 25K',
      cat: 'map',
      categoryLabel: 'PinDrop 25K',
      shape: 'octa',
      accentHex: '#0ea5e9',
      title: isFr ? 'Œil Orbital Géodésique' : 'Orbital Geodesic Eye',
      desc: isFr
        ? 'Cumulez un score de haute précision sur 5 manches dans GeoLearn PinDrop.'
        : 'Accumulate a high-precision score across 5 rounds in GeoLearn PinDrop.',
      currentValue: m.pinDropBest,
      unit: 'pts',
      playRoute: '/geoguessr',
      tiers: [
        { target: 8000, name: '8 000 pts' },
        { target: 13000, name: '13 000 pts' },
        { target: 18000, name: '18 000 pts' },
        { target: 21500, name: '21 500 pts' },
        { target: 24000, name: '24 000 pts' }
      ]
    },
    {
      id: 'duel',
      code: ' PVP-12 // 1V1 ARENA',
      cat: '3d',
      categoryLabel: 'Duel 1v1',
      shape: 'shield',
      accentHex: '#f43f5e',
      title: isFr ? 'Gladiateur Télémétrique' : 'Telemetry Gladiator',
      desc: isFr
        ? 'Remportez des victoires décisives dans l\'Arène Duel 1v1.'
        : 'Claim decisive victories inside the 1v1 Live Duel Arena.',
      currentValue: m.duelWins,
      unit: isFr ? 'victoires' : 'wins',
      playRoute: '/duel',
      tiers: [
        { target: 1, name: isFr ? 'Duelliste' : 'Duelist' },
        { target: 3, name: isFr ? 'Vainqueur' : 'Challenger' },
        { target: 7, name: isFr ? 'Champion' : 'Champion' },
        { target: 15, name: isFr ? 'Maître 1v1' : '1v1 Master' },
        { target: 25, name: isFr ? 'Invaincu' : 'Undefeated' }
      ]
    }
  ];

  return definitions.map(buildBadgeObject);
});

const badgeFilters = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'all', label: isFr ? 'Tous les Trophées (12)' : 'All Trophies (12)' },
    { id: 'unlocked', label: isFr ? 'Débloqués' : 'Unlocked' },
    { id: 'qcm', label: 'QCM (/15)' },
    { id: '3d', label: isFr ? 'Modes 3D & Duel' : '3D Modes & Duel' },
    { id: 'map', label: isFr ? 'Cartographie & PinDrop' : 'Cartography & PinDrop' }
  ];
});

const filteredBadges = computed(() => {
  if (selectedFilter.value === 'all') return allBadges.value;
  if (selectedFilter.value === 'unlocked') return allBadges.value.filter((b) => b.currentTier > 0);
  return allBadges.value.filter((b) => b.cat === selectedFilter.value);
});

const selectedBadge = computed(
  () => allBadges.value.find((b) => b.id === selectedBadgeId.value) || allBadges.value[0]
);

const unlockedBadgesCount = computed(() => allBadges.value.filter((b) => b.currentTier > 0).length);

const totalTiersEarned = computed(() =>
  allBadges.value.reduce((acc, b) => acc + b.currentTier, 0)
);

const totalCollectionXp = computed(() =>
  totalTiersEarned.value * 250 + metrics.value.totalGames * 45
);

const operatorRankTitle = computed(() => {
  const t = totalTiersEarned.value;
  const isFr = locale.value === 'fr';
  if (t >= 45) return isFr ? 'Commandant Orbital V' : 'Orbital Commander V';
  if (t >= 30) return isFr ? 'Stratège Géodésique IV' : 'Geodesic Strategist IV';
  if (t >= 18) return isFr ? 'Cartographe Principal III' : 'Lead Cartographer III';
  if (t >= 8) return isFr ? 'Analyste de Terrain II' : 'Field Analyst II';
  return isFr ? 'Opérateur de Reconnaissance I' : 'Recon Operator I';
});

const getTierBadgeClass = (tier) => {
  if (tier >= 5) return 'bg-sky-500/20 text-sky-300 border-sky-400/50';
  if (tier === 4) return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50';
  if (tier === 3) return 'bg-amber-500/20 text-amber-300 border-amber-400/50';
  if (tier >= 1) return 'bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-white/20';
  return 'bg-slate-100 dark:bg-white/[0.03] text-slate-400 border-slate-200 dark:border-white/10';
};

// =========================================================
// PASSEPORT GÉODÉSIQUE DES 196 ÉTATS
// =========================================================
const passportContinent = ref('all');
const passportQuery = ref('');

// Détermine de manière déterministe combien d'États sont tamponnés selon l'activité réelle du joueur
const stampedCountriesCount = computed(() => {
  const m = metrics.value;
  const raw = Math.max(
    m.worldBest,
    m.europeBest + m.totalGames * 4 + totalTiersEarned.value * 3
  );
  return Math.min(196, raw);
});

const localizedPassportCountries = computed(() => {
  const isEn = locale.value === 'en';
  const limit = stampedCountriesCount.value;
  return ALL_COUNTRIES.map((c, idx) => ({
    ...c,
    name: isEn ? c.name_en : c.name_fr,
    capital: isEn ? c.capital_en : c.capital_fr,
    continent: c.continent_en,
    isStamped: idx < limit
  }));
});

const passportContinents = computed(() => {
  const isFr = locale.value === 'fr';
  const list = localizedPassportCountries.value;
  const groups = [
    { id: 'all', label: isFr ? 'Monde' : 'World' },
    { id: 'Europe', label: 'Europe' },
    { id: 'Asia', label: isFr ? 'Asie' : 'Asia' },
    { id: 'Africa', label: isFr ? 'Afrique' : 'Africa' },
    { id: 'North America', label: isFr ? 'Am. Nord' : 'N. America' },
    { id: 'South America', label: isFr ? 'Am. Sud' : 'S. America' },
    { id: 'Oceania', label: isFr ? 'Océanie' : 'Oceania' }
  ];

  return groups.map((g) => {
    const sub = g.id === 'all' ? list : list.filter((c) => c.continent === g.id);
    return {
      ...g,
      total: sub.length,
      stamped: sub.filter((c) => c.isStamped).length
    };
  });
});

const filteredPassportCountries = computed(() => {
  const q = passportQuery.value.trim().toLowerCase();
  return localizedPassportCountries.value.filter((c) => {
    if (passportContinent.value !== 'all' && c.continent !== passportContinent.value) return false;
    if (q) {
      return c.name.toLowerCase().includes(q) || c.capital.toLowerCase().includes(q) || c.iso.toLowerCase() === q;
    }
    return true;
  });
});

// =========================================================
// CARTES HOLOGRAPHIQUES 3D TILT & REFLET SPÉCULAIRE
// =========================================================
const cardTilts = ref({});

const onCardPointerMove = (e, id) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width;
  const py = (e.clientY - rect.top) / rect.height;
  cardTilts.value[id] = {
    rx: Number(((0.5 - py) * 11).toFixed(2)),
    ry: Number(((px - 0.5) * 13).toFixed(2)),
    gx: Math.round(px * 100),
    gy: Math.round(py * 100)
  };
};

const onCardPointerLeave = (id) => {
  cardTilts.value[id] = { rx: 0, ry: 0, gx: 50, gy: 50 };
};

const getCardTiltStyle = (id) => {
  const t = cardTilts.value[id];
  if (!t || (t.rx === 0 && t.ry === 0)) {
    return { transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' };
  }
  return {
    transform: `perspective(1000px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) translateY(-4px)`
  };
};

const getCardGlareStyle = (id, hex) => {
  const t = cardTilts.value[id] || { gx: 50, gy: 50 };
  return {
    background: `radial-gradient(circle at ${t.gx}% ${t.gy}%, ${hex}26 0%, transparent 65%)`
  };
};

// =========================================================
// MOTEUR 3D PROCÉDURAL DE L'INSIGNE ORBITAL (RELIC CANVAS)
// =========================================================
const relicCanvasRef = ref(null);
let relicAnimId = null;
let relicYaw = 0.4;
let relicPitch = 0.25;
let relicVelYaw = 0;
let relicVelPitch = 0;
let relicDragging = false;
let relicLastX = 0;
let relicLastY = 0;

const selectBadgeFor3D = (badge) => {
  selectedBadgeId.value = badge.id;
  relicVelYaw = 0.08;
};

const onRelicPointerDown = (e) => {
  relicDragging = true;
  relicVelYaw = 0;
  relicVelPitch = 0;
  relicLastX = e.clientX;
  relicLastY = e.clientY;
};

const onRelicPointerMove = (e) => {
  if (!relicDragging) return;
  const dx = e.clientX - relicLastX;
  const dy = e.clientY - relicLastY;
  relicYaw += dx * 0.012;
  relicPitch = Math.max(-0.9, Math.min(0.9, relicPitch + dy * 0.012));
  relicVelYaw = dx * 0.009;
  relicVelPitch = dy * 0.009;
  relicLastX = e.clientX;
  relicLastY = e.clientY;
};

const onRelicPointerUp = () => {
  relicDragging = false;
};

// =========================================================
// PALETTE OFFICIELLE PAR PALIER (INDÉPENDANTE DU MODE)
// =========================================================
const TIER_PALETTE = {
  0: { name: 'LOCKED', primary: '#475569', secondary: '#1e293b', specular: '#94a3b8', glow: 'rgba(71, 85, 105, 0.22)' },
  1: { name: 'BRONZE I', primary: '#d97706', secondary: '#78350f', specular: '#fcd34d', glow: 'rgba(217, 119, 6, 0.35)' },
  2: { name: 'SILVER II', primary: '#cbd5e1', secondary: '#475569', specular: '#ffffff', glow: 'rgba(203, 213, 225, 0.38)' },
  3: { name: 'GOLD III', primary: '#f59e0b', secondary: '#92400e', specular: '#fef08a', glow: 'rgba(245, 158, 11, 0.45)' },
  4: { name: 'EMERALD IV', primary: '#10b981', secondary: '#065f46', specular: '#6ee7b7', glow: 'rgba(16, 185, 129, 0.45)' },
  5: { name: 'DIAMOND V', primary: '#38bdf8', secondary: '#0369a1', specular: '#e0f2fe', glow: 'rgba(56, 189, 248, 0.52)' }
};

const getTierHex = (tier = 0) => (TIER_PALETTE[tier] || TIER_PALETTE[0]).primary;

const renderRelic3DLoop = () => {
  const canvas = relicCanvasRef.value;
  if (canvas && activeSection.value === 'trophies') {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2 + 10;
    ctx.clearRect(0, 0, W, H);

    if (!relicDragging) {
      if (Math.abs(relicVelYaw) > 0.0005 || Math.abs(relicVelPitch) > 0.0005) {
        relicYaw += relicVelYaw;
        relicPitch = Math.max(-0.65, Math.min(0.65, relicPitch + relicVelPitch));
        relicVelYaw *= 0.94;
        relicVelPitch *= 0.94;
      } else {
        relicYaw += 0.014;
      }
    }

    const badge = selectedBadge.value;
    const tier = badge?.currentTier || 0;
    const pal = TIER_PALETTE[tier] || TIER_PALETTE[0];

    // 1. Halo lumineux d'arrière-plan indexé sur le Palier (I -> V)
    const bgGlow = ctx.createRadialGradient(cx, cy - 10, 6, cx, cy - 10, 125);
    bgGlow.addColorStop(0, pal.glow);
    bgGlow.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy - 10, 125, 0, Math.PI * 2);
    ctx.fillStyle = bgGlow;
    ctx.fill();

    const cosY = Math.cos(relicYaw), sinY = Math.sin(relicYaw);
    const cosP = Math.cos(relicPitch), sinP = Math.sin(relicPitch);

    const project3D = (x, y, z) => {
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      const y2 = y * cosP - z1 * sinP;
      const z2 = y * sinP + z1 * cosP;
      const fov = 380;
      const s = fov / (fov + z2 + 60);
      return { x: cx + x1 * s, y: cy + y2 * s, z: z2, s };
    };

    // 2. Profil de révolution 3D de la Coupe de Trophée (du socle en bas jusqu'au calice en haut)
    // Coordonnées Y : positif vers le bas, négatif vers le haut
    const profileRings = [
      { y: 78, r: 44, isBase: true },   // Base du socle
      { y: 64, r: 42, isBase: true },   // Haut du socle noir
      { y: 62, r: 34, isBase: false },  // Bague métallique inférieure
      { y: 54, r: 28, isBase: false },  // Pied du trophée
      { y: 30, r: 11, isBase: false },  // Tige fine
      { y: 16, r: 17, isBase: false },  // Nœud annulaire central
      { y: 4,  r: 12, isBase: false },  // Col sous la coupe
      { y: -14, r: 34, isBase: false }, // Bas du calice évasé
      { y: -42, r: 50, isBase: false }, // Milieu du calice
      { y: -68, r: 56, isBase: false }, // Lèvre supérieure de la coupe
      { y: -68, r: 49, isBase: true }   // Paroi interne de la coupe
    ];

    const segs = 20;
    const ringVertices = profileRings.map((ring) => {
      const pts = [];
      for (let i = 0; i < segs; i++) {
        const a = (i / segs) * Math.PI * 2;
        const px = ring.r * Math.cos(a);
        const pz = ring.r * Math.sin(a);
        pts.push({
          ...project3D(px, ring.y, pz),
          nx: Math.cos(a) * cosY + Math.sin(a) * sinY,
          nz: -Math.cos(a) * sinY + Math.sin(a) * cosY,
          isBase: ring.isBase
        });
      }
      return pts;
    });

    const quads = [];
    for (let r = 0; r < ringVertices.length - 1; r++) {
      const rowA = ringVertices[r];
      const rowB = ringVertices[r + 1];
      const isBaseSection = profileRings[r].isBase && profileRings[r + 1].isBase;
      for (let i = 0; i < segs; i++) {
        const next = (i + 1) % segs;
        const p0 = rowA[i];
        const p1 = rowA[next];
        const p2 = rowB[next];
        const p3 = rowB[i];
        const avgZ = (p0.z + p1.z + p2.z + p3.z) * 0.25;
        const lightDot = Math.max(0, (p0.nx * 0.55 - p0.nz * 0.75));
        quads.push({ p0, p1, p2, p3, avgZ, lightDot, isBaseSection });
      }
    }

    // 3. Deux Anses 3D incurvées à gauche (-X) et à droite (+X) de la coupe
    const handleCurve = [
      { x: 32, y: -12 },
      { x: 64, y: -18 },
      { x: 76, y: -38 },
      { x: 72, y: -58 },
      { x: 53, y: -62 }
    ];
    const handleSegments = [];
    for (const side of [-1, 1]) {
      for (let i = 0; i < handleCurve.length - 1; i++) {
        const a = project3D(side * handleCurve[i].x, handleCurve[i].y, 0);
        const b = project3D(side * handleCurve[i + 1].x, handleCurve[i + 1].y, 0);
        handleSegments.push({ a, b, avgZ: (a.z + b.z) * 0.5 });
      }
    }

    // Tri Z-Buffer (du plus éloigné au plus proche de la caméra)
    quads.sort((a, b) => b.avgZ - a.avgZ);

    // Dessin des anses situées à l'arrière-plan
    for (const h of handleSegments.filter((s) => s.avgZ > 0)) {
      ctx.beginPath();
      ctx.moveTo(h.a.x, h.a.y);
      ctx.lineTo(h.b.x, h.b.y);
      ctx.strokeStyle = pal.secondary;
      ctx.lineWidth = 7 * h.a.s;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(h.a.x, h.a.y);
      ctx.lineTo(h.b.x, h.b.y);
      ctx.strokeStyle = pal.primary;
      ctx.lineWidth = 3.5 * h.a.s;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // Dessin des facettes 3D du Trophée avec éclairage spéculaire
    for (const q of quads) {
      ctx.beginPath();
      ctx.moveTo(q.p0.x, q.p0.y);
      ctx.lineTo(q.p1.x, q.p1.y);
      ctx.lineTo(q.p2.x, q.p2.y);
      ctx.lineTo(q.p3.x, q.p3.y);
      ctx.closePath();

      if (q.isBaseSection) {
        ctx.fillStyle = '#0b1120';
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
      } else if (q.lightDot > 0.62) {
        ctx.fillStyle = pal.specular;
        ctx.strokeStyle = pal.primary;
      } else if (q.lightDot > 0.25) {
        ctx.fillStyle = pal.primary;
        ctx.strokeStyle = pal.secondary;
      } else {
        ctx.fillStyle = pal.secondary;
        ctx.strokeStyle = '#090e1a';
      }
      ctx.lineWidth = 0.75;
      ctx.fill();
      ctx.stroke();
    }

    // Dessin des anses situées au premier plan
    for (const h of handleSegments.filter((s) => s.avgZ <= 0)) {
      ctx.beginPath();
      ctx.moveTo(h.a.x, h.a.y);
      ctx.lineTo(h.b.x, h.b.y);
      ctx.strokeStyle = pal.secondary;
      ctx.lineWidth = 7 * h.a.s;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(h.a.x, h.a.y);
      ctx.lineTo(h.b.x, h.b.y);
      ctx.strokeStyle = pal.specular;
      ctx.lineWidth = 3.2 * h.a.s;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // 4. Anneau Orbital & Étoile de Grade en lévitation au-dessus de la coupe
    if (tier > 0) {
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += 0.12) {
        const rx = 68 * Math.cos(a);
        const ry = -68 + 14 * Math.sin(a);
        const rz = 68 * Math.sin(a);
        const p = project3D(rx, ry, rz);
        if (a === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = pal.primary;
      ctx.lineWidth = 1.6;
      ctx.stroke();

      const crownCenter = project3D(0, -88, 0);
      ctx.beginPath();
      ctx.arc(crownCenter.x, crownCenter.y, 7 * crownCenter.s, 0, Math.PI * 2);
      ctx.fillStyle = pal.specular;
      ctx.fill();
      ctx.strokeStyle = pal.primary;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  relicAnimId = requestAnimationFrame(renderRelic3DLoop);
};

watch(activeSection, (newVal) => {
  if (newVal === 'trophies') {
    nextTick(() => renderRelic3DLoop());
  }
});

onMounted(async () => {
  renderRelic3DLoop();

  const savedUser = localStorage.getItem('geolearn_user');
  if (!savedUser) return;
  try {
    const parsed = JSON.parse(savedUser);
    const uid = parsed.id || (parsed.user && parsed.user.id);
    if (!uid) return;
    isLoggedIn.value = true;
    const res = await fetch(`${API_URL}/api/scores/${uid}`);
    if (res.ok) {
      const data = await res.json();
      userScores.value = Array.isArray(data) ? data : [];
    }
  } catch (e) {}
});

onUnmounted(() => {
  if (relicAnimId) cancelAnimationFrame(relicAnimId);
});
</script>

<style scoped>
.holo-tilt-card {
  transition: transform 0.18s ease-out, border-color 0.25s ease, box-shadow 0.25s ease;
  will-change: transform;
}

.stage-morph-enter-active,
.stage-morph-leave-active {
  transition: opacity 0.24s ease, transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
}
.stage-morph-enter-from,
.stage-morph-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>