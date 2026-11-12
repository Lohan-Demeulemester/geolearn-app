<template>
  <div class="pindrop-experience relative w-full h-[calc(100vh-58px)] overflow-hidden bg-[#04070F] text-slate-100 select-none">

    <!-- ========================================================= -->
    <!-- 1. ÉCRAN DE BRIEFING PRÉ-MISSION (CHOIX DU MODE & TEMPS)  -->
    <!-- ========================================================= -->
    <transition name="fade-up" mode="out-in">
      <section
        v-if="missionState === 'briefing'"
        key="mission-briefing"
        class="relative z-30 w-full h-full overflow-y-auto flex items-center justify-center p-4 sm:p-8"
      >
        <!-- Halos atmosphériques Bleu Ciel & Émeraude -->
        <div class="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-sky-500/15 blur-[120px]"></div>
        <div class="pointer-events-none absolute -bottom-24 right-1/4 w-96 h-96 rounded-full bg-emerald-500/12 blur-[120px]"></div>

        <div class="relative z-10 w-full max-w-[1380px] rounded-[2rem] border border-white/12 bg-[#080D1A]/90 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.85)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">

          <!-- Colonne Gauche (7 cols) : Configuration complète avant lancement -->
          <div class="lg:col-span-7 space-y-6">
            <div class="space-y-2">
              <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-[11px] font-bold uppercase tracking-wider">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>ORBITAL RECONNAISSANCE // PRE-MISSION BRIEFING</span>
              </div>

              <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.08]">
                GeoLearn
                <span class="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  PinDrop.
                </span>
              </h1>

              <p class="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
                {{ locale === 'fr'
                  ? 'Configurez votre protocole de reconnaissance avant le largage. Une fois la mission lancée, les paramètres sont verrouillés jusqu\'au débriefing final.'
                  : 'Configure your reconnaissance protocol before deployment. Once the mission is launched, settings are locked until the final debriefing.' }}
              </p>
            </div>

            <!-- Alerte si un lien de défi Seed a été détecté dans l'URL -->
            <div
              v-if="pendingSeedIsos.length >= 5"
              class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/35 flex items-center justify-between gap-4"
            >
              <div class="space-y-0.5">
                <span class="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                  {{ locale === 'fr' ? 'DÉFI PARTAGÉ DÉTECTÉ (5 CIBLES PRÉ-VERROUILLÉES)' : 'SHARED SEED CHALLENGE DETECTED (5 TARGETS LOCKED)' }}
                </span>
                <p class="text-xs text-slate-300">
                  {{ locale === 'fr'
                    ? 'Les 5 localisations de votre ami sont chargées. Lancez la mission pour comparer votre score.'
                    : 'Your friend\'s 5 locations are loaded. Launch the mission to compare your score.' }}
                </p>
              </div>
              <button
                type="button"
                @click="clearPendingSeed"
                class="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 font-mono text-[10px] font-bold text-slate-200 cursor-pointer shrink-0"
              >
                {{ locale === 'fr' ? 'Annuler Seed' : 'Clear Seed' }}
              </button>
            </div>

            <!-- ÉTAPE 01 : CHOIX DU MODE DE RECONNAISSANCE -->
            <div class="space-y-2.5">
              <span class="font-mono text-[11px] font-bold uppercase tracking-wider text-sky-400 block">
                01 // {{ locale === 'fr' ? 'MODE DE RECONNAISSANCE' : 'RECONNAISSANCE PROTOCOL' }}
              </span>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  v-for="m in gameModes"
                  :key="m.id"
                  type="button"
                  @click="playMode = m.id"
                  class="p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5"
                  :class="playMode === m.id
                    ? 'bg-sky-500/15 border-sky-400 text-white shadow-lg shadow-sky-500/10'
                    : 'bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200'"
                >
                  <div class="flex items-center justify-between">
                    <span class="font-mono text-[10px] font-bold uppercase text-sky-400">{{ m.code }}</span>
                    <span
                      class="w-2.5 h-2.5 rounded-full"
                      :class="playMode === m.id ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-white/15'"
                    ></span>
                  </div>
                  <div>
                    <strong class="text-sm font-black text-white block">{{ m.label }}</strong>
                    <span class="text-[11px] text-slate-400 leading-snug block mt-1">{{ m.desc }}</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- ÉTAPE 02 : SECTEUR GÉOGRAPHIQUE & CHRONOMÈTRE PAR QUESTION -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Secteur Continental -->
              <div class="space-y-2">
                <span class="font-mono text-[11px] font-bold uppercase tracking-wider text-sky-400 block">
                  02 // {{ locale === 'fr' ? 'SECTEUR D\'OPÉRATION' : 'OPERATIONAL SECTOR' }}
                </span>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="sc in scopeOptions"
                    :key="sc.id"
                    type="button"
                    :disabled="pendingSeedIsos.length >= 5"
                    @click="selectBriefingSector(sc)"
                    class="px-3 py-2.5 rounded-xl border text-left font-mono text-xs font-bold transition cursor-pointer flex items-center justify-between disabled:opacity-40"
                    :class="selectedScope === sc.id
                      ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300'
                      : 'bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/25'"
                  >
                    <span class="truncate">{{ sc.shortLabel }}</span>
                    <span class="text-[10px] opacity-70">{{ sc.count }}</span>
                  </button>
                </div>
              </div>

              <!-- Temps par question & Règle de caméra -->
              <div class="space-y-4">
                <div class="space-y-2">
                  <span class="font-mono text-[11px] font-bold uppercase tracking-wider text-sky-400 block">
                    03 // {{ locale === 'fr' ? 'TEMPS PAR MANCHE' : 'TIME PER ROUND' }}
                  </span>
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      v-for="tm in timerPresets"
                      :key="tm.sec"
                      type="button"
                      @click="selectedTimerSec = tm.sec"
                      class="px-3 py-2.5 rounded-xl border font-mono text-xs font-bold transition cursor-pointer text-center"
                      :class="selectedTimerSec === tm.sec
                        ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                        : 'bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/25'"
                    >
                      {{ tm.label }}
                    </button>
                  </div>
                </div>

                <!-- Règle de déplacement Caméra -->
                <div class="space-y-2">
                  <span class="font-mono text-[11px] font-bold uppercase tracking-wider text-sky-400 block">
                    04 // {{ locale === 'fr' ? 'RESTRICTIONS OPTIQUES' : 'OPTICAL CONSTRAINTS' }}
                  </span>
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      @click="noMoveLock = false"
                      class="px-3 py-2.5 rounded-xl border font-mono text-xs font-bold transition cursor-pointer text-center"
                      :class="!noMoveLock
                        ? 'bg-emerald-500/15 border-emerald-400 text-emerald-300'
                        : 'bg-white/[0.03] border-white/10 text-slate-400'"
                    >
                      {{ locale === 'fr' ? 'Zone Locale (15 km)' : 'Local Zone (15 km)' }}
                    </button>
                    <button
                      type="button"
                      @click="noMoveLock = true"
                      class="px-3 py-2.5 rounded-xl border font-mono text-xs font-bold transition cursor-pointer text-center"
                      :class="noMoveLock
                        ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                        : 'bg-white/[0.03] border-white/10 text-slate-400'"
                    >
                      {{ locale === 'fr' ? 'Fixe (No-Move)' : 'Strict No-Move' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Barème des indices & Bouton de lancement -->
            <div class="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="font-mono text-[11px] text-slate-400 space-y-0.5">
                <div class="text-slate-300 font-bold">
                  {{ locale === 'fr' ? 'BARÈME DES INDICES EN MISSION :' : 'IN-MISSION INTEL PENALTIES:' }}
                </div>
                <div>
                  {{ locale === 'fr'
                    ? 'Indice 1 : -500 pts • Indice 2 : -750 pts • Indice 3 : -1 000 pts'
                    : 'Clue 1: -500 pts • Clue 2: -750 pts • Clue 3: -1,000 pts' }}
                </div>
              </div>

              <button
                type="button"
                @click="launchConfiguredMission"
                class="px-8 py-4 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-2xl shadow-sky-500/25 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-3 shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>{{ locale === 'fr' ? 'Lancer la Mission' : 'Launch Mission' }}</span>
              </button>
            </div>
          </div>

          <!-- Colonne Droite (5 cols) : Globe 3D Orbital Interactif de Briefing -->
          <div class="lg:col-span-5 flex flex-col items-center justify-center p-5 rounded-3xl bg-white/[0.02] border border-white/10 relative">
            <div class="w-full flex items-center justify-between font-mono text-[10px] text-slate-400 pb-3 mb-2 border-b border-white/10">
              <span class="text-sky-400 font-bold">ORBITAL TARGETING GLOBE</span>
              <span>ZOOM MIN : LVL 11 (LOCKED)</span>
            </div>

            <canvas
              ref="briefingGlobeCanvasRef"
              width="320"
              height="320"
              class="w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] cursor-grab active:cursor-grabbing"
              @pointerdown="onBriefingGlobeDown"
              @pointermove="onBriefingGlobeMove"
              @pointerup="onBriefingGlobeUp"
              @pointerleave="onBriefingGlobeUp"
            ></canvas>

            <div class="w-full grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 font-mono text-[11px] text-center">
              <div>
                <span class="text-slate-500 block text-[9px]">MODE</span>
                <strong class="text-white uppercase">{{ playMode }}</strong>
              </div>
              <div>
                <span class="text-slate-500 block text-[9px]">TIMER</span>
                <strong class="text-sky-400">{{ selectedTimerSec === 0 ? 'UNTIMED' : `${selectedTimerSec}S` }}</strong>
              </div>
              <div>
                <span class="text-slate-500 block text-[9px]">MAX SCORE</span>
                <strong class="text-emerald-400">{{ playMode === 'streak' ? 'STREAK' : '25,000' }}</strong>
              </div>
            </div>
          </div>

        </div>
      </section>
    </transition>

    <!-- ========================================================= -->
    <!-- 2. VIEWPORT DE JEU ACTIF (SATELLITE BORNÉ OU PHOTO SOL)   -->
    <!-- ========================================================= -->
    <template v-if="missionState !== 'briefing'">

      <div class="absolute inset-0 z-0 w-full h-full">

        <!-- A. FLUX SATELLITE ORBITAL BORNÉ (DÉZOOM BLOQUÉ À MIN-ZOOM 11 + PÉRIMÈTRE 15 KM) -->
        <div
          v-show="playMode !== 'visual' || visualFallbackActive"
          class="w-full h-full relative"
        >
          <l-map
            ref="satMapRef"
            v-model:zoom="satZoom"
            v-model:center="satCenter"
            :min-zoom="noMoveLock ? satLockedZoom : 11"
            :max-zoom="noMoveLock ? satLockedZoom : 16"
            :max-bounds="satRestrictedBounds"
            :options="{
              zoomControl: false,
              attributionControl: false,
              maxBoundsViscosity: 1.0,
              dragging: !noMoveLock,
              scrollWheelZoom: !noMoveLock,
              doubleClickZoom: !noMoveLock,
              touchZoom: !noMoveLock
            }"
            :use-global-leaflet="false"
            @move="onSatMapMove"
          >
            <l-tile-layer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              :no-wrap="false"
            ></l-tile-layer>
          </l-map>
        </div>

        <!-- B. INSPECTEUR PHOTOGRAPHIQUE AU SOL (MODE VISUAL RECON) -->
        <div
          v-if="playMode === 'visual' && !visualFallbackActive"
          class="w-full h-full relative bg-[#03060C] flex items-center justify-center overflow-hidden"
          @pointerdown="onPhotoPanStart"
          @pointermove="onPhotoPanMove"
          @pointerup="onPhotoPanEnd"
          @pointerleave="onPhotoPanEnd"
          @wheel.prevent="onPhotoWheel"
        >
          <img
            v-if="visualImageUrl"
            :src="visualImageUrl"
            alt=""
            class="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-25 blur-3xl scale-110"
          />

          <div
            v-if="visualImageUrl && !visualLoading"
            class="relative z-10 transition-transform duration-75 ease-out cursor-grab active:cursor-grabbing"
            :style="{
              transform: `translate3d(${photoPanX}px, ${photoPanY}px, 0) scale(${photoZoom})`
            }"
          >
            <img
              :src="visualImageUrl"
              alt="Reconnaissance optique"
              class="max-w-[92vw] max-h-[82vh] rounded-2xl border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.85)] object-contain select-none"
              draggable="false"
            />
          </div>

          <div
            v-if="visualLoading"
            class="relative z-10 px-6 py-4 rounded-2xl bg-slate-950/90 border border-sky-500/30 font-mono text-xs text-sky-400 flex items-center gap-3"
          >
            <span class="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping"></span>
            <span>{{ locale === 'fr' ? 'SYNCHRONISATION DU CAPTEUR OPTIQUE...' : 'SYNCING OPTICAL SENSOR FEED...' }}</span>
          </div>

          <!-- Contrôles optiques en bas à gauche -->
          <div class="absolute bottom-5 left-4 sm:left-6 z-20 flex items-center gap-2">
            <div class="flex items-center gap-1 p-1 rounded-full bg-slate-950/88 backdrop-blur-2xl border border-white/12 text-xs font-mono">
              <button
                type="button"
                @click="adjustPhotoZoom(0.25)"
                class="w-8 h-8 rounded-full hover:bg-white/10 text-white font-bold cursor-pointer flex items-center justify-center"
              >
                +
              </button>
              <span class="px-2 text-[11px] text-sky-400 font-bold">{{ photoZoom.toFixed(2) }}x</span>
              <button
                type="button"
                @click="adjustPhotoZoom(-0.25)"
                class="w-8 h-8 rounded-full hover:bg-white/10 text-white font-bold cursor-pointer flex items-center justify-center"
              >
                -
              </button>
              <button
                type="button"
                @click="resetPhotoOptics"
                class="px-3 h-8 rounded-full hover:bg-white/10 text-slate-300 text-[11px] font-bold cursor-pointer"
              >
                Reset
              </button>
            </div>

            <button
              type="button"
              @click="visualFallbackActive = !visualFallbackActive"
              class="px-4 py-2 rounded-full bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/35 font-mono text-xs font-bold text-sky-300 backdrop-blur-2xl cursor-pointer transition"
            >
              {{ locale === 'fr' ? 'Vue Satellite Locale' : 'Local Satellite Feed' }}
            </button>
          </div>
        </div>

        <!-- Réticule télémétrique central SVG -->
        <div class="pointer-events-none absolute inset-0 sat-vignette"></div>
        <div class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
          <svg width="150" height="150" viewBox="0 0 160 160" fill="none">
            <circle cx="80" cy="80" r="34" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4 4" />
            <circle cx="80" cy="80" r="3" fill="#38bdf8" />
            <path d="M80 28V40M80 120V132M28 80H40M120 80H132" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round" />
            <path d="M40 50V40H50M110 40H120V50M120 110V120H110M50 120H40V110" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </div>

        <!-- Contrôles de Zoom Satellite borné (11 à 16) en bas à gauche -->
        <div
          v-if="playMode !== 'visual' || visualFallbackActive"
          class="absolute bottom-5 left-4 sm:left-6 z-20 flex flex-wrap items-center gap-2"
        >
          <div
            v-if="!noMoveLock"
            class="flex items-center gap-1 p-1 rounded-full bg-slate-950/88 backdrop-blur-2xl border border-white/12 font-mono text-xs shadow-xl"
          >
            <button
              type="button"
              @click="stepSatZoom(1)"
              class="w-8 h-8 rounded-full hover:bg-white/10 text-white font-bold cursor-pointer flex items-center justify-center"
              title="Zoom +"
            >
              +
            </button>
            <span class="px-2 text-[11px] text-sky-400 font-bold">LVL {{ satZoom }} / 16</span>
            <button
              type="button"
              @click="stepSatZoom(-1)"
              class="w-8 h-8 rounded-full hover:bg-white/10 text-white font-bold cursor-pointer flex items-center justify-center"
              title="Zoom - (Min 11)"
            >
              -
            </button>
          </div>

          <div class="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-950/82 backdrop-blur-xl border border-white/10 font-mono text-[11px] text-slate-300">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>ALT : <strong class="text-sky-400">{{ orbitalAltitudeKm }} KM</strong></span>
            <span class="text-white/20">|</span>
            <span>PERIMETER : <strong class="text-white">{{ noMoveLock ? 'FIXED FRAME' : '15 KM MAX' }}</strong></span>
          </div>
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- 3. BARRE SUPÉRIEURE VERROUILLÉE EN COURS DE PARTIE      -->
      <!-- ======================================================= -->
      <header class="relative z-20 w-full max-w-[1760px] mx-auto px-3 sm:px-6 pt-3.5 flex flex-col gap-2.5 pointer-events-none">

        <div class="flex flex-wrap items-center justify-between gap-2.5">

          <!-- Gauche : Paramètres verrouillés (Mode, Secteur, Manche, Score & Plafond actuel) -->
          <div class="flex flex-wrap items-center gap-2 pointer-events-auto">
            <!-- Badge du mode verrouillé -->
            <div class="px-3.5 py-2 rounded-full bg-slate-950/90 backdrop-blur-2xl border border-sky-500/35 flex items-center gap-2 shadow-xl">
              <span class="w-2 h-2 rounded-full bg-sky-400"></span>
              <span class="font-mono text-xs font-black text-sky-300 uppercase">
                {{ activeModeLabel }} // {{ activeSectorLabel }}
              </span>
            </div>

            <!-- Progression des 5 manches ou Série -->
            <div class="px-4 py-2 rounded-full bg-slate-950/90 backdrop-blur-2xl border border-white/12 flex items-center gap-3 shadow-xl">
              <template v-if="playMode !== 'streak'">
                <span class="font-mono text-xs font-black text-white">
                  {{ locale === 'fr' ? `MANCHE ${roundIndex + 1} / 5` : `ROUND ${roundIndex + 1} / 5` }}
                </span>
                <div class="hidden sm:flex items-center gap-1.5">
                  <span
                    v-for="r in 5"
                    :key="'step-dot-' + r"
                    class="h-2 rounded-full transition-all duration-300"
                    :class="r - 1 < roundHistory.length
                      ? 'w-5 bg-emerald-400'
                      : r - 1 === roundIndex
                        ? 'w-7 bg-sky-400 animate-pulse'
                        : 'w-2 bg-white/20'"
                  ></span>
                </div>
              </template>
              <template v-else>
                <span class="font-mono text-xs font-black text-emerald-400">
                  {{ locale === 'fr' ? `SÉRIE : ${currentStreak}` : `STREAK: ${currentStreak}` }}
                </span>
                <span class="text-white/20">|</span>
                <span class="font-mono text-xs text-sky-400 font-bold">
                  RECORD : {{ bestStreak }}
                </span>
              </template>
            </div>

            <!-- Score total + Plafond de la manche en cours (impacté en direct par les indices) -->
            <div class="px-4 py-2 rounded-full bg-slate-950/90 backdrop-blur-2xl border border-emerald-500/35 font-mono text-xs flex items-center gap-2.5 shadow-xl">
              <strong class="font-black text-emerald-400">
                {{ totalScore.toLocaleString() }} <span class="text-slate-400 font-normal">/ 25 000 PTS</span>
              </strong>
              <span class="text-white/20">|</span>
              <span
                class="text-[11px] font-bold"
                :class="currentRoundPenalty > 0 ? 'text-amber-400' : 'text-sky-300'"
              >
                {{ locale === 'fr' ? `MAX MANCHE : ${currentRoundMaxPotential.toLocaleString()} PTS` : `ROUND MAX: ${currentRoundMaxPotential.toLocaleString()} PTS` }}
                <template v-if="currentRoundPenalty > 0">
                  (-{{ currentRoundPenalty }})
                </template>
              </span>
            </div>
          </div>

          <!-- Droite : Chronomètre actif, Recentrer, Indices (-pts), Audio & Quitter -->
          <div class="flex flex-wrap items-center gap-2 pointer-events-auto">

            <!-- Chronomètre actif -->
            <div
              v-if="selectedTimerSec > 0 && !roundSubmitted && missionState === 'playing'"
              class="px-3.5 py-1.5 rounded-full bg-slate-950/92 backdrop-blur-2xl border flex items-center gap-2 shadow-xl"
              :class="roundTimeLeft <= 5 ? 'border-rose-500 text-rose-400 animate-pulse' : 'border-sky-500/40 text-sky-300'"
            >
              <svg class="w-5 h-5 -rotate-90" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="2.5" />
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  :stroke-dasharray="56.5"
                  :stroke-dashoffset="56.5 - (roundTimeLeft / selectedTimerSec) * 56.5"
                />
              </svg>
              <span class="font-mono text-xs font-black">{{ roundTimeLeft }}s</span>
            </div>

            <!-- Recentrer sur le point de largage -->
            <button
              type="button"
              @click="recenterSatellite"
              class="px-3.5 py-2 rounded-full bg-slate-950/88 hover:bg-slate-900 text-slate-200 border border-white/12 font-mono text-xs font-bold backdrop-blur-2xl transition cursor-pointer flex items-center gap-1.5 shadow-xl"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
              </svg>
              <span class="hidden md:inline">{{ locale === 'fr' ? 'Recentrer' : 'Recenter' }}</span>
            </button>

            <!-- Tiroir d'Indices Télémétriques avec coût affiché -->
            <button
              v-if="!roundSubmitted && missionState === 'playing'"
              type="button"
              @click="clueDrawerOpen = !clueDrawerOpen"
              class="px-3.5 py-2 rounded-full border font-mono text-xs font-bold backdrop-blur-2xl transition cursor-pointer flex items-center gap-1.5 shadow-xl"
              :class="cluesUnlockedCount > 0 || clueDrawerOpen
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                : 'bg-slate-950/88 border-white/12 text-slate-200 hover:border-amber-400/40'"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>
                {{ locale === 'fr' ? `Indices (${cluesUnlockedCount}/3)` : `Intel (${cluesUnlockedCount}/3)` }}
                <template v-if="currentRoundPenalty > 0">[-{{ currentRoundPenalty }} pts]</template>
              </span>
            </button>

            <!-- Audio -->
            <button
              type="button"
              @click="toggleSound"
              class="w-9 h-9 rounded-full bg-slate-950/88 border border-white/12 text-slate-200 flex items-center justify-center cursor-pointer shadow-xl"
              :aria-label="soundEnabled ? 'Mute' : 'Unmute'"
            >
              <svg v-if="soundEnabled" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            </button>

            <!-- Bouton Abandonner / Retour au Briefing -->
            <button
              type="button"
              @click="abortMissionToBriefing"
              class="px-3.5 py-2 rounded-full bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/35 font-mono text-xs font-bold transition cursor-pointer shadow-xl"
            >
              {{ locale === 'fr' ? 'Briefing' : 'Abort' }}
            </button>
          </div>

        </div>

        <!-- Console déroulante des 3 Indices (Pénalités progressives : -500, -750, -1000 pts) -->
        <transition name="fade-up">
          <div
            v-if="clueDrawerOpen && !roundSubmitted && missionState === 'playing'"
            class="pointer-events-auto self-end w-full max-w-2xl rounded-3xl bg-slate-950/94 backdrop-blur-2xl border border-amber-500/40 p-4 shadow-2xl space-y-3"
          >
            <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                <span class="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  {{ locale === 'fr'
                    ? `CONSOLE D'INDICES SATELLITAIRES // PÉNALITÉ ACTIVE : -${currentRoundPenalty} PTS`
                    : `SATELLITE INTEL CONSOLE // ACTIVE PENALTY: -${currentRoundPenalty} PTS` }}
                </span>
              </div>
              <button
                type="button"
                @click="clueDrawerOpen = false"
                class="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white cursor-pointer"
              >
                ×
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                v-for="(clue, cIdx) in availableRoundClues"
                :key="clue.id"
                type="button"
                @click="unlockClue(cIdx)"
                class="p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between min-h-[88px]"
                :class="unlockedClues[cIdx]
                  ? 'bg-sky-500/15 border-sky-400/50 text-white'
                  : 'bg-white/[0.03] border-white/10 hover:border-amber-400/50 text-slate-400'"
              >
                <div class="flex items-center justify-between font-mono text-[10px] font-bold uppercase">
                  <span class="text-sky-400">0{{ cIdx + 1 }} // {{ clue.title }}</span>
                  <span class="text-amber-400">-{{ clue.cost }} PTS</span>
                </div>

                <strong v-if="unlockedClues[cIdx]" class="text-xs font-black text-white mt-2 block leading-snug">
                  {{ clue.value }}
                </strong>
                <span v-else class="font-mono text-[11px] text-amber-300 font-bold mt-2 block">
                  [{{ locale === 'fr' ? `Débloquer (-${clue.cost} pts)` : `Unlock (-${clue.cost} pts)` }}]
                </span>
              </button>
            </div>
          </div>
        </transition>

      </header>

      <!-- ======================================================= -->
      <!-- 4. MODALE DE DÉBRIEFING DE MANCHE (BRUT - INDICES = NET)-->
      <!-- ======================================================= -->
      <transition name="fade-up">
        <aside
          v-if="roundSubmitted && missionState === 'playing'"
          class="absolute top-20 left-4 sm:left-6 z-20 w-[calc(100vw-2rem)] max-w-md rounded-3xl bg-slate-950/94 backdrop-blur-2xl border border-white/15 p-5 text-white shadow-[0_28px_80px_rgba(0,0,0,0.88)] space-y-4"
        >
          <div class="flex items-start justify-between gap-3 border-b border-white/10 pb-3.5">
            <div class="flex items-center gap-3 min-w-0">
              <img
                :src="`https://flagcdn.com/w160/${currentTarget.iso}.png`"
                class="h-9 w-auto rounded border border-white/15 shadow shrink-0"
                alt=""
              />
              <div class="min-w-0">
                <span class="font-mono text-[10px] font-bold uppercase text-sky-400 block truncate">
                  {{ currentTarget.subregion }} // ISO {{ currentTarget.iso.toUpperCase() }}
                </span>
                <h3 class="text-lg font-black truncate leading-tight">
                  {{ currentTarget.name }} ({{ currentTarget.capital }})
                </h3>
              </div>
            </div>

            <span
              class="px-3 py-1 rounded-full font-mono text-xs font-black border shrink-0"
              :class="lastRoundPoints >= 3500
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : lastRoundPoints >= 1500
                  ? 'bg-sky-500/15 border-sky-500/40 text-sky-400'
                  : 'bg-amber-500/15 border-amber-500/40 text-amber-400'"
            >
              +{{ lastRoundPoints.toLocaleString() }} PTS
            </span>
          </div>

          <!-- Détail transparent du calcul des points (Distance Brute vs Pénalité d'Indices) -->
          <div class="grid grid-cols-3 gap-2 font-mono text-[11px] text-center">
            <div class="p-2 rounded-xl bg-white/[0.04] border border-white/[0.07]">
              <span class="text-slate-400 block text-[9px] uppercase">{{ locale === 'fr' ? 'SCORE DISTANCE' : 'DISTANCE PTS' }}</span>
              <strong class="text-sky-300">+{{ lastRoundRawPoints.toLocaleString() }}</strong>
            </div>
            <div class="p-2 rounded-xl bg-white/[0.04] border border-white/[0.07]">
              <span class="text-slate-400 block text-[9px] uppercase">{{ locale === 'fr' ? 'MALUS INDICES' : 'INTEL PENALTY' }}</span>
              <strong :class="lastRoundPenalty > 0 ? 'text-rose-400' : 'text-slate-500'">
                -{{ lastRoundPenalty.toLocaleString() }}
              </strong>
            </div>
            <div class="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <span class="text-emerald-300 block text-[9px] uppercase">{{ locale === 'fr' ? 'TOTAL NET' : 'NET POINTS' }}</span>
              <strong class="text-emerald-400">+{{ lastRoundPoints.toLocaleString() }}</strong>
            </div>
          </div>

          <!-- Globe 3D Orthographique Interactif -->
          <div class="flex items-center gap-4">
            <div class="relative shrink-0">
              <canvas
                ref="debriefGlobeCanvasRef"
                width="148"
                height="148"
                class="w-[128px] h-[128px] rounded-full border border-sky-500/35 bg-[#050914] cursor-grab active:cursor-grabbing"
                @pointerdown="onDebriefGlobeDown"
                @pointermove="onDebriefGlobeMove"
                @pointerup="onDebriefGlobeUp"
                @pointerleave="onDebriefGlobeUp"
              ></canvas>
              <span class="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-950/85 font-mono text-[9px] text-sky-400 whitespace-nowrap">
                3D ARC
              </span>
            </div>

            <div class="space-y-2 text-xs flex-1 min-w-0">
              <div class="flex items-center justify-between font-mono text-xs">
                <span class="text-slate-400">{{ locale === 'fr' ? 'Écart :' : 'Offset:' }}</span>
                <strong class="text-sky-400">{{ lastRoundDistanceKm.toLocaleString() }} km ({{ lastRoundAccuracyPct }}%)</strong>
              </div>

              <div class="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-500"
                  :style="{ width: `${lastRoundAccuracyPct}%` }"
                ></div>
              </div>

              <p class="text-[11px] text-slate-300 leading-relaxed line-clamp-3">
                {{ currentTarget.fact }}
              </p>
            </div>
          </div>
        </aside>
      </transition>

      <!-- ======================================================= -->
      <!-- 5. DOCK RADAR DE POINTAGE 100 % MUET (EN BAS À DROITE)  -->
      <!-- ======================================================= -->
      <div
        v-if="missionState === 'playing'"
        class="absolute bottom-5 right-4 sm:right-6 z-20 flex flex-col items-end pointer-events-none max-w-[calc(100vw-2rem)]"
      >
        <transition name="fade-up" mode="out-in">
          <button
            v-if="radarMinimized"
            key="radar-pill"
            type="button"
            @click="radarMinimized = false"
            class="pointer-events-auto px-4 py-2.5 rounded-full bg-slate-950/92 backdrop-blur-2xl border border-sky-500/45 shadow-2xl flex items-center gap-3 hover:scale-105 transition cursor-pointer"
          >
            <span class="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
            <span class="font-mono text-xs font-bold text-white">
              {{ locale === 'fr' ? 'Ouvrir le Radar de Pointage' : 'Open PinDrop Radar' }}
            </span>
            <span class="w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center font-mono text-xs font-black">
              +
            </span>
          </button>

          <div
            v-else
            key="radar-window"
            class="radar-dock pointer-events-auto rounded-3xl bg-slate-950/92 backdrop-blur-2xl border border-white/15 shadow-[0_25px_75px_rgba(0,0,0,0.88)] overflow-hidden transition-all duration-300 flex flex-col"
            :class="radarExpanded
              ? 'w-[92vw] sm:w-[560px] h-[400px] sm:h-[440px]'
              : 'w-[320px] sm:w-[375px] h-[265px] sm:h-[285px]'"
          >
            <div class="px-4 py-2.5 border-b border-white/10 flex items-center justify-between gap-2 bg-slate-900/85">
              <div class="flex items-center gap-2 min-w-0">
                <span class="w-2 h-2 rounded-full shrink-0" :class="guessLatLng ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'"></span>
                <span class="font-mono text-[11px] font-bold text-slate-200 truncate">
                  <template v-if="guessLatLng">
                    {{ formatCoord(guessLatLng.lat, 'N', 'S') }}, {{ formatCoord(guessLatLng.lng, 'E', 'W') }}
                    <span v-if="nearestGuessedCountry" class="text-sky-400 ml-1">[{{ nearestGuessedCountry.name }}]</span>
                  </template>
                  <template v-else>
                    {{ locale === 'fr' ? 'CLIQUEZ SUR LE RADAR MUET' : 'CLICK BLANK RADAR TO PIN' }}
                  </template>
                </span>
              </div>

              <div class="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  @click="radarExpanded = !radarExpanded"
                  class="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 font-mono text-[10px] font-bold text-sky-300 transition cursor-pointer"
                >
                  {{ radarExpanded ? 'Compact' : (locale === 'fr' ? 'Agrandir' : 'Expand') }}
                </button>
                <button
                  type="button"
                  @click="radarMinimized = true"
                  class="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 font-mono text-xs font-black flex items-center justify-center transition cursor-pointer"
                >
                  -
                </button>
              </div>
            </div>

            <!-- Carte 2D 100 % Muette -->
            <div class="flex-1 w-full relative z-0 radar-mute-map">
              <l-map
                ref="guessMapRef"
                v-model:zoom="guessZoom"
                v-model:center="guessCenter"
                :min-zoom="1.5"
                :max-zoom="7"
                :options="{ zoomControl: false, attributionControl: false, worldCopyJump: true }"
                :use-global-leaflet="false"
                @click="onGuessMapClick"
              >
                <l-tile-layer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
                  :no-wrap="false"
                ></l-tile-layer>

                <l-polyline
                  v-for="(ring, rIdx) in leafletWorldRings"
                  :key="'pin-border-' + rIdx"
                  :lat-lngs="ring"
                  :color="'#38bdf8'"
                  :weight="0.8"
                  :options="{ opacity: 0.36, interactive: false }"
                ></l-polyline>

                <l-polyline
                  v-if="roundSubmitted && guessLatLng"
                  :lat-lngs="[[guessLatLng.lat, guessLatLng.lng], [currentTarget.lat, currentTarget.lng]]"
                  :color="'#f43f5e'"
                  :weight="2.5"
                  :options="{ dashArray: '6, 6' }"
                ></l-polyline>

                <l-circle-marker
                  v-if="guessLatLng"
                  :lat-lng="[guessLatLng.lat, guessLatLng.lng]"
                  :radius="7"
                  :color="'#ffffff'"
                  :weight="2.5"
                  :fill-color="'#0ea5e9'"
                  :fill-opacity="1"
                ></l-circle-marker>

                <l-circle-marker
                  v-if="roundSubmitted"
                  :lat-lng="[currentTarget.lat, currentTarget.lng]"
                  :radius="8"
                  :color="'#ffffff'"
                  :weight="2.5"
                  :fill-color="'#10b981'"
                  :fill-opacity="1"
                ></l-circle-marker>
              </l-map>
            </div>

            <div class="p-3 bg-slate-900/95 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                v-if="!roundSubmitted"
                type="button"
                :disabled="!guessLatLng"
                @click="submitPinGuess(false)"
                class="w-full py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition cursor-pointer"
                :class="guessLatLng
                  ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-950 shadow-lg shadow-sky-500/25 hover:opacity-95'
                  : 'bg-white/10 text-slate-500 cursor-not-allowed'"
              >
                {{ guessLatLng
                  ? (playMode === 'streak' && nearestGuessedCountry
                      ? (locale === 'fr' ? `Valider : ${nearestGuessedCountry.name}` : `Confirm: ${nearestGuessedCountry.name}`)
                      : (locale === 'fr' ? `Valider (Max ${currentRoundMaxPotential} pts)` : `Confirm (Max ${currentRoundMaxPotential} pts)`))
                  : (locale === 'fr' ? 'Placez votre épingle sur le radar' : 'Drop a pin on the radar') }}
              </button>

              <button
                v-else
                type="button"
                @click="nextRound"
                class="w-full py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer"
              >
                <template v-if="playMode === 'streak'">
                  {{ lastStreakHit
                    ? (locale === 'fr' ? 'Pays suivant (Continuer la série)' : 'Next Country (Continue Streak)')
                    : (locale === 'fr' ? 'Voir le bilan de la série' : 'View Streak Summary') }}
                </template>
                <template v-else>
                  {{ roundIndex < 4
                    ? (locale === 'fr' ? 'Manche suivante' : 'Next Round')
                    : (locale === 'fr' ? 'Afficher le rapport final' : 'View Final Report') }}
                </template>
              </button>
            </div>
          </div>
        </transition>
      </div>

      <!-- ======================================================= -->
      <!-- 6. RAPPORT FINAL DE MISSION AVEC GLOBE 3D MULTI-ARCS    -->
      <!-- ======================================================= -->
      <transition name="fade-up">
        <div
          v-if="missionState === 'finished'"
          class="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
        >
          <div class="w-full max-w-4xl rounded-3xl bg-[#080D1A] border border-white/15 p-6 sm:p-9 text-white shadow-2xl space-y-6 my-auto">

            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <div class="flex items-center gap-2.5">
                  <span class="font-mono text-xs font-bold uppercase tracking-widest text-sky-400">
                    {{ playMode === 'streak' ? 'COUNTRY STREAK REPORT' : 'ORBITAL MISSION DEBRIEF // 5 ROUNDS' }}
                  </span>
                  <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 font-mono text-[11px] font-bold text-emerald-400">
                    {{ missionRankLabel }}
                  </span>
                </div>

                <h2 class="text-3xl sm:text-4xl font-black mt-1">
                  <template v-if="playMode === 'streak'">
                    {{ currentStreak }} {{ locale === 'fr' ? 'États identifiés d\'affilée' : 'Consecutive States Identified' }}
                  </template>
                  <template v-else>
                    {{ totalScore.toLocaleString() }} <span class="text-lg font-normal text-slate-400">/ 25 000 PTS</span>
                  </template>
                </h2>

                <p class="font-mono text-xs text-slate-400 mt-1">
                  {{ locale === 'fr'
                    ? `Note unifiée enregistrée : ${normalizedScoreOn15} / 15 • Écart moyen : ${averageOffsetKm.toLocaleString()} km`
                    : `Unified score saved: ${normalizedScoreOn15} / 15 • Avg offset: ${averageOffsetKm.toLocaleString()} km` }}
                </p>
              </div>

              <div class="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  @click="copyChallengeSeedLink"
                  class="px-4 py-2.5 rounded-full bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/35 text-xs font-black transition cursor-pointer"
                >
                  {{ seedCopied ? (locale === 'fr' ? 'Lien copié' : 'Seed Link Copied') : (locale === 'fr' ? 'Défier un ami (Même Seed)' : 'Challenge Friend (Same Seed)') }}
                </button>
                <button
                  type="button"
                  @click="abortMissionToBriefing"
                  class="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
                >
                  {{ locale === 'fr' ? 'Changer de mode / Briefing' : 'Change Mode / Briefing' }}
                </button>
                <button
                  type="button"
                  @click="launchConfiguredMission"
                  class="px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-950 text-xs font-black transition cursor-pointer shadow-lg shadow-sky-500/20"
                >
                  {{ locale === 'fr' ? 'Rejouer avec ces réglages' : 'Play Again (Same Rules)' }}
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div class="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-3xl bg-white/[0.02] border border-white/10">
                <canvas
                  ref="summaryGlobeCanvasRef"
                  width="250"
                  height="250"
                  class="w-[230px] h-[230px] cursor-grab active:cursor-grabbing"
                  @pointerdown="onDebriefGlobeDown"
                  @pointermove="onDebriefGlobeMove"
                  @pointerup="onDebriefGlobeUp"
                  @pointerleave="onDebriefGlobeUp"
                ></canvas>
                <span class="font-mono text-[10px] text-slate-400 uppercase mt-2">
                  {{ locale === 'fr' ? 'TRAJECTOIRES GÉODÉSIQUES DES MANCHES (GLISSER)' : 'MISSION GEODESIC ARCS (DRAG TO ROTATE)' }}
                </span>
              </div>

              <div class="lg:col-span-7 space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                <div
                  v-for="(item, idx) in roundHistory"
                  :key="'hist-' + idx"
                  class="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3 text-xs"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="font-mono text-slate-400 font-bold">#0{{ idx + 1 }}</span>
                    <img :src="`https://flagcdn.com/w40/${item.iso}.png`" class="h-4 w-auto rounded-2xs shrink-0" alt="" />
                    <div class="min-w-0">
                      <strong class="text-white block truncate">{{ item.name }} ({{ item.capital }})</strong>
                      <span class="font-mono text-[11px] text-slate-400">
                        {{ locale === 'fr' ? 'Écart :' : 'Offset:' }} {{ item.distanceKm.toLocaleString() }} km • {{ item.elapsedSec }}s
                        <template v-if="item.penalty > 0">
                          • <span class="text-rose-400">Indices : -{{ item.penalty }} pts</span>
                        </template>
                      </span>
                    </div>
                  </div>

                  <span class="font-mono text-sm font-black text-emerald-400 shrink-0">
                    +{{ item.points.toLocaleString() }} pts
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </transition>

    </template>

  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ALL_COUNTRIES from '../data/countries.js';

import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LCircleMarker, LPolyline } from "@vue-leaflet/vue-leaflet";

const { locale } = useI18n();
const route = useRoute();
const API_URL = 'https://geolearn-backend-bj65.onrender.com';

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
    if (type === 'hit') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.18);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      osc.start(now);
      osc.stop(now + 0.24);
    } else if (type === 'penalty') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(310, now);
      osc.frequency.exponentialRampToValueAtTime(210, now + 0.14);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'miss') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(145, now + 0.22);
      gain.gain.setValueAtTime(0.13, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {}
};

// =========================================================
// BASE DES 196 ÉTATS & FRONTIÈRES VECTORIELLES MUETTES
// =========================================================
const localizedCountries = computed(() => {
  const isEn = locale.value === 'en';
  return ALL_COUNTRIES.map((c, idx) => ({
    ...c,
    id: c.id || c.iso || idx + 1,
    name: isEn ? c.name_en : c.name_fr,
    capital: isEn ? c.capital_en : c.capital_fr,
    continent: c.continent_en,
    subregion: isEn ? c.subregion_en : c.subregion_fr,
    population: isEn ? c.population_en : c.population_fr,
    lang: isEn ? c.lang_en : c.lang_fr,
    fact: isEn ? c.fact_en : c.fact_fr
  }));
});

const leafletWorldRings = ref([]);

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

const loadVectorBorders = async () => {
  try {
    const res = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
    if (res.ok) {
      const topo = await res.json();
      const rings = extractRingsFromTopoJSON(topo);
      leafletWorldRings.value = rings.map((r) => r.map(([lon, lat]) => [lat, lon]));
    }
  } catch (e) {}
};

// =========================================================
// ÉTAT DE MISSION ('briefing' -> 'playing' -> 'finished')
// =========================================================
const missionState = ref('briefing');
const playMode = ref('orbital'); // 'orbital' | 'visual' | 'streak'
const selectedScope = ref('world');
const selectedTimerSec = ref(0);
const roundTimeLeft = ref(0);
const noMoveLock = ref(false);
const satLockedZoom = ref(13);
const pendingSeedIsos = ref([]);

const gameModes = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    {
      id: 'orbital',
      code: 'MOD-01 // SATELLITE',
      label: isFr ? 'Satellite Orbital' : 'Orbital Satellite',
      desc: isFr
        ? 'Imagerie satellite haute résolution verrouillée à basse altitude (zoom 11 à 16).'
        : 'High-res satellite imagery locked at low altitude (zoom 11 to 16).'
    },
    {
      id: 'visual',
      code: 'MOD-02 // OPTICAL',
      label: isFr ? 'Photo Géolocalisée' : 'Visual Recon',
      desc: isFr
        ? 'Analysez un cliché réel du territoire cible avec zoom optique et bascule satellite.'
        : 'Inspect a real ground photograph of the target state with optical zoom.'
    },
    {
      id: 'streak',
      code: 'MOD-03 // SURVIVAL',
      label: isFr ? 'Série de Pays' : 'Country Streak',
      desc: isFr
        ? 'Enchaînez un maximum d\'identifications d\'États consécutives sans la moindre erreur.'
        : 'Chain as many consecutive state identifications as possible without a miss.'
    }
  ];
});

const scopeOptions = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'world', shortLabel: isFr ? 'Monde' : 'World', count: 196, lat: 20, lng: 10 },
    { id: 'Europe', shortLabel: 'Europe', count: 47, lat: 50, lng: 14 },
    { id: 'Asia', shortLabel: isFr ? 'Asie' : 'Asia', count: 46, lat: 30, lng: 95 },
    { id: 'Africa', shortLabel: isFr ? 'Afrique' : 'Africa', count: 54, lat: 4, lng: 20 },
    { id: 'Americas', shortLabel: isFr ? 'Amériques' : 'Americas', count: 35, lat: 12, lng: -75 },
    { id: 'Oceania', shortLabel: isFr ? 'Océanie' : 'Oceania', count: 14, lat: -22, lng: 145 }
  ];
});

const timerPresets = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { sec: 0, label: isFr ? 'Illimité' : 'Untimed' },
    { sec: 60, label: '60s Standard' },
    { sec: 30, label: '30s Rapide' },
    { sec: 15, label: '15s Blitz' }
  ];
});

const activeModeLabel = computed(() => {
  const m = gameModes.value.find((item) => item.id === playMode.value);
  return m ? m.label : 'Orbital';
});

const activeSectorLabel = computed(() => {
  const s = scopeOptions.value.find((item) => item.id === selectedScope.value);
  return s ? s.shortLabel : 'World';
});

// =========================================================
// GLOBE 3D ORBITAL DU LOBBY DE BRIEFING
// =========================================================
const briefingGlobeCanvasRef = ref(null);
let briefingAnimId = null;
let bRotLon = -12;
let bRotLat = -24;
let bDragging = false;
let bLastX = 0;
let bLastY = 0;

const selectBriefingSector = (sc) => {
  selectedScope.value = sc.id;
  bRotLon = -sc.lng;
  bRotLat = -sc.lat;
};

const onBriefingGlobeDown = (e) => {
  bDragging = true;
  bLastX = e.clientX;
  bLastY = e.clientY;
};

const onBriefingGlobeMove = (e) => {
  if (!bDragging) return;
  bRotLon += (e.clientX - bLastX) * 0.45;
  bRotLat = Math.max(-68, Math.min(68, bRotLat - (e.clientY - bLastY) * 0.4));
  bLastX = e.clientX;
  bLastY = e.clientY;
};

const onBriefingGlobeUp = () => {
  bDragging = false;
};

const renderBriefingGlobeLoop = () => {
  const canvas = briefingGlobeCanvasRef.value;
  if (canvas && missionState.value === 'briefing') {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const R = W * 0.42;
    ctx.clearRect(0, 0, W, H);

    if (!bDragging) bRotLon -= 0.16;

    const toRad = (d) => (d * Math.PI) / 180;
    const lam0 = toRad(-bRotLon);
    const phi0 = toRad(-bRotLat);
    const sinPhi0 = Math.sin(phi0);
    const cosPhi0 = Math.cos(phi0);

    const project = (lat, lon) => {
      const phi = toRad(lat);
      const lam = toRad(lon);
      const dLam = lam - lam0;
      const cosC = sinPhi0 * Math.sin(phi) + cosPhi0 * Math.cos(phi) * Math.cos(dLam);
      if (cosC < 0) return null;
      return {
        x: cx + R * Math.cos(phi) * Math.sin(dLam),
        y: cy - R * (cosPhi0 * Math.sin(phi) - sinPhi0 * Math.cos(phi) * Math.cos(dLam)),
        z: cosC
      };
    };

    const grad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
    grad.addColorStop(0, '#102648');
    grad.addColorStop(1, '#040812');
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.32)';
    ctx.fillStyle = 'rgba(20, 48, 86, 0.72)';
    ctx.lineWidth = 0.7;
    for (const ring of leafletWorldRings.value) {
      ctx.beginPath();
      let vis = 0;
      let prev = null;
      for (const [lat, lon] of ring) {
        const p = project(lat, lon);
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

    const pool = getFilteredPool();
    for (const c of pool) {
      const p = project(c.lat, c.lng);
      if (!p) continue;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(16, 185, 129, ${0.4 + p.z * 0.55})`;
      ctx.fill();
    }
  }
  briefingAnimId = requestAnimationFrame(renderBriefingGlobeLoop);
};

// =========================================================
// MOTEUR DE JEU, PÉNALITÉ D'INDICES & CAMÉRA BORNÉE
// =========================================================
const missionTargets = ref([]);
const roundIndex = ref(0);
const totalScore = ref(0);
const roundHistory = ref([]);
const guessLatLng = ref(null);
const roundSubmitted = ref(false);
const radarExpanded = ref(false);
const radarMinimized = ref(false);
const seedCopied = ref(false);

const currentStreak = ref(0);
const bestStreak = ref(Number(localStorage.getItem('geolearn_pindrop_streak') || 0));
const lastStreakHit = ref(true);

const visualImageUrl = ref('');
const visualLoading = ref(false);
const visualFallbackActive = ref(false);
const photoZoom = ref(1);
const photoPanX = ref(0);
const photoPanY = ref(0);
let photoDragging = false;
let photoLastX = 0;
let photoLastY = 0;

// Système d'indices avec coûts stricts (-500, -750, -1000 pts)
const clueDrawerOpen = ref(false);
const unlockedClues = ref([false, false, false]);
const CLUE_COSTS = [500, 750, 1000];

const lastRoundDistanceKm = ref(0);
const lastRoundRawPoints = ref(0);
const lastRoundPenalty = ref(0);
const lastRoundPoints = ref(0);
const lastRoundAccuracyPct = ref(0);

// Zoom satellite initialisé à 13 (échelle locale) et jamais inférieur à 11
const satZoom = ref(13);
const satCenter = ref([48.8566, 2.3522]);
const guessZoom = ref(2);
const guessCenter = ref([24, 12]);

let roundTimerInterval = null;
let roundStartTimestamp = Date.now();

const currentTarget = computed(
  () => missionTargets.value[roundIndex.value] || localizedCountries.value[0]
);

// Périmètre local strict (±0.14° soit ~15 km autour du point cible) empêchant de tricher en déplaçant la carte
const satRestrictedBounds = computed(() => {
  const t = currentTarget.value;
  if (!t) return [[-85, -180], [85, 180]];
  const delta = 0.14;
  return [
    [t.lat - delta, t.lng - delta],
    [t.lat + delta, t.lng + delta]
  ];
});

const orbitalAltitudeKm = computed(() => {
  const z = Number(satZoom.value || 13);
  return Math.max(1, Math.round(32000 / Math.pow(2, z - 3)));
});

const cluesUnlockedCount = computed(() => unlockedClues.value.filter(Boolean).length);

const currentRoundPenalty = computed(() =>
  unlockedClues.value.reduce((acc, isUnlocked, idx) => acc + (isUnlocked ? CLUE_COSTS[idx] : 0), 0)
);

const currentRoundMaxPotential = computed(() => Math.max(500, 5000 - currentRoundPenalty.value));

const availableRoundClues = computed(() => {
  const c = currentTarget.value;
  const isFr = locale.value === 'fr';
  if (!c) return [];
  const hemisphere = c.lat >= 0
    ? (isFr ? 'Hémisphère Nord' : 'Northern Hemisphere')
    : (isFr ? 'Hémisphère Sud' : 'Southern Hemisphere');
  const latBand = Math.abs(c.lat) < 23.5
    ? (isFr ? 'Zone Intertropicale' : 'Tropical Belt')
    : Math.abs(c.lat) < 55
      ? (isFr ? 'Zone Tempérée' : 'Temperate Zone')
      : (isFr ? 'Haute Latitude' : 'High Latitude');

  return [
    {
      id: 'hemisphere',
      cost: CLUE_COSTS[0],
      title: isFr ? 'Latitude & Climat' : 'Latitude & Climate',
      value: `${hemisphere} • ${latBand}`
    },
    {
      id: 'economy',
      cost: CLUE_COSTS[1],
      title: isFr ? 'Monnaie & Langue' : 'Currency & Language',
      value: `${c.currency} • ${c.lang}`
    },
    {
      id: 'subregion',
      cost: CLUE_COSTS[2],
      title: isFr ? 'Sous-région & Surface' : 'Subregion & Area',
      value: `${c.subregion} • ${c.area}`
    }
  ];
});

const unlockClue = (idx) => {
  if (unlockedClues.value[idx]) return;
  unlockedClues.value[idx] = true;
  playSound('penalty');
};

const stepSatZoom = (delta) => {
  if (noMoveLock.value) return;
  satZoom.value = Math.max(11, Math.min(16, satZoom.value + delta));
};

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

const nearestGuessedCountry = computed(() => {
  if (!guessLatLng.value) return null;
  let best = null;
  let minD = Infinity;
  for (const c of localizedCountries.value) {
    const d = computeHaversineKm(guessLatLng.value.lat, guessLatLng.value.lng, c.lat, c.lng);
    if (d < minD) {
      minD = d;
      best = c;
    }
  }
  return best;
});

const formatCoord = (val, posDir, negDir) => {
  const num = Number(val || 0);
  const dir = num >= 0 ? posDir : negDir;
  return `${Math.abs(num).toFixed(2)}° ${dir}`;
};

const fetchVisualReconImage = async (country) => {
  if (!country) return;
  visualLoading.value = true;
  visualFallbackActive.value = false;
  photoZoom.value = 1;
  photoPanX.value = 0;
  photoPanY.value = 0;

  const queries = [country.capital_en, country.name_en];
  for (const q of queries) {
    try {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const img = data?.originalimage?.source || data?.thumbnail?.source;
        if (img && !img.toLowerCase().includes('flag') && !img.toLowerCase().includes('coat_of_arms') && !img.toLowerCase().includes('map')) {
          visualImageUrl.value = img;
          visualLoading.value = false;
          return;
        }
      }
    } catch (e) {}
  }

  visualFallbackActive.value = true;
  visualLoading.value = false;
};

const adjustPhotoZoom = (delta) => {
  photoZoom.value = Math.max(1, Math.min(3.5, Number((photoZoom.value + delta).toFixed(2))));
};

const resetPhotoOptics = () => {
  photoZoom.value = 1;
  photoPanX.value = 0;
  photoPanY.value = 0;
};

const onPhotoPanStart = (e) => {
  photoDragging = true;
  photoLastX = e.clientX;
  photoLastY = e.clientY;
};

const onPhotoPanMove = (e) => {
  if (!photoDragging) return;
  photoPanX.value += e.clientX - photoLastX;
  photoPanY.value += e.clientY - photoLastY;
  photoLastX = e.clientX;
  photoLastY = e.clientY;
};

const onPhotoPanEnd = () => {
  photoDragging = false;
};

const onPhotoWheel = (e) => {
  adjustPhotoZoom(e.deltaY < 0 ? 0.15 : -0.15);
};

const startRoundTimer = () => {
  if (roundTimerInterval) clearInterval(roundTimerInterval);
  roundStartTimestamp = Date.now();
  if (selectedTimerSec.value <= 0) return;

  roundTimeLeft.value = selectedTimerSec.value;
  roundTimerInterval = setInterval(() => {
    if (roundTimeLeft.value > 1) {
      roundTimeLeft.value--;
    } else {
      roundTimeLeft.value = 0;
      clearInterval(roundTimerInterval);
      submitPinGuess(true);
    }
  }, 1000);
};

const setupRoundCamera = () => {
  const t = currentTarget.value;
  if (!t) return;
  satCenter.value = [t.lat, t.lng];
  satZoom.value = 13;
  satLockedZoom.value = 13;
  guessLatLng.value = null;
  roundSubmitted.value = false;
  clueDrawerOpen.value = false;
  unlockedClues.value = [false, false, false];
  guessCenter.value = [24, 12];
  guessZoom.value = 2;

  if (playMode.value === 'visual') {
    fetchVisualReconImage(t);
  }
  startRoundTimer();
};

const recenterSatellite = () => {
  const t = currentTarget.value;
  if (!t) return;
  satCenter.value = [t.lat, t.lng];
  satZoom.value = 13;
};

const onSatMapMove = () => {
  if (noMoveLock.value && currentTarget.value) {
    satCenter.value = [currentTarget.value.lat, currentTarget.value.lng];
  }
};

const getFilteredPool = () => {
  let pool = localizedCountries.value;
  if (selectedScope.value === 'Europe') pool = pool.filter((c) => c.continent === 'Europe');
  else if (selectedScope.value === 'Asia') pool = pool.filter((c) => c.continent === 'Asia');
  else if (selectedScope.value === 'Africa') pool = pool.filter((c) => c.continent === 'Africa');
  else if (selectedScope.value === 'Oceania') pool = pool.filter((c) => c.continent === 'Oceania');
  else if (selectedScope.value === 'Americas') {
    pool = pool.filter((c) => c.continent === 'North America' || c.continent === 'South America');
  }
  return pool;
};

const clearPendingSeed = () => {
  pendingSeedIsos.value = [];
};

const launchConfiguredMission = () => {
  const pool = getFilteredPool();
  const targetCount = playMode.value === 'streak' ? 50 : 5;

  if (pendingSeedIsos.value.length >= 5) {
    const picked = pendingSeedIsos.value
      .map((iso) => localizedCountries.value.find((c) => c.iso === iso.toLowerCase()))
      .filter(Boolean);
    if (picked.length >= 5) {
      missionTargets.value = picked.slice(0, 5);
    }
  } else {
    missionTargets.value = [...pool].sort(() => 0.5 - Math.random()).slice(0, targetCount);
  }

  roundIndex.value = 0;
  totalScore.value = 0;
  currentStreak.value = 0;
  roundHistory.value = [];
  seedCopied.value = false;
  missionState.value = 'playing';
  setupRoundCamera();
};

const abortMissionToBriefing = () => {
  if (roundTimerInterval) clearInterval(roundTimerInterval);
  missionState.value = 'briefing';
};

const onGuessMapClick = (e) => {
  if (roundSubmitted.value || !e?.latlng) return;
  guessLatLng.value = { lat: e.latlng.lat, lng: e.latlng.lng };
};

// =========================================================
// GLOBE 3D DE DÉBRIEFING (MANCHE & BILAN MULTI-ARCS)
// =========================================================
const debriefGlobeCanvasRef = ref(null);
const summaryGlobeCanvasRef = ref(null);
let debriefRotLon = 0;
let debriefRotLat = 20;
let debriefDragging = false;
let debriefLastX = 0;
let debriefLastY = 0;

const onDebriefGlobeDown = (e) => {
  debriefDragging = true;
  debriefLastX = e.clientX;
  debriefLastY = e.clientY;
};

const onDebriefGlobeMove = (e) => {
  if (!debriefDragging) return;
  debriefRotLon -= (e.clientX - debriefLastX) * 0.45;
  debriefRotLat = Math.max(-70, Math.min(70, debriefRotLat + (e.clientY - debriefLastY) * 0.4));
  debriefLastX = e.clientX;
  debriefLastY = e.clientY;
  if (missionState.value === 'finished') renderSummaryGlobe();
  else renderDebriefGlobe();
};

const onDebriefGlobeUp = () => {
  debriefDragging = false;
};

const drawGlobeWithArcs = (canvas, arcsList) => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2;
  const R = W * 0.44;
  ctx.clearRect(0, 0, W, H);

  const toRad = (d) => (d * Math.PI) / 180;
  const phi0 = toRad(debriefRotLat);
  const lam0 = toRad(debriefRotLon);
  const sinPhi0 = Math.sin(phi0);
  const cosPhi0 = Math.cos(phi0);

  const project = (lat, lon) => {
    const phi = toRad(lat);
    const lam = toRad(lon);
    const dLam = lam - lam0;
    const cosC = sinPhi0 * Math.sin(phi) + cosPhi0 * Math.cos(phi) * Math.cos(dLam);
    if (cosC < 0) return null;
    return {
      x: cx + R * Math.cos(phi) * Math.sin(dLam),
      y: cy - R * (cosPhi0 * Math.sin(phi) - sinPhi0 * Math.cos(phi) * Math.cos(dLam))
    };
  };

  const grad = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
  grad.addColorStop(0, '#0f2342');
  grad.addColorStop(1, '#040812');
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
  ctx.fillStyle = 'rgba(20, 48, 86, 0.65)';
  ctx.lineWidth = 0.65;
  for (const ring of leafletWorldRings.value) {
    ctx.beginPath();
    let vis = 0;
    let prev = null;
    for (const [lat, lon] of ring) {
      const p = project(lat, lon);
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

  for (const arc of arcsList) {
    if (!arc.guess || !arc.target) continue;
    const pG = project(arc.guess.lat, arc.guess.lng);
    const pT = project(arc.target.lat, arc.target.lng);
    if (pG && pT) {
      ctx.beginPath();
      ctx.moveTo(pG.x, pG.y);
      ctx.quadraticCurveTo(cx, cy - 12, pT.x, pT.y);
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(pG.x, pG.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(pT.x, pT.y, 4.2, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
    }
  }
};

const renderDebriefGlobe = () => {
  drawGlobeWithArcs(debriefGlobeCanvasRef.value, [
    { guess: guessLatLng.value, target: currentTarget.value }
  ]);
};

const renderSummaryGlobe = () => {
  const arcs = roundHistory.value.map((r) => ({
    guess: r.guessCoords,
    target: { lat: r.targetLat, lng: r.targetLng }
  }));
  drawGlobeWithArcs(summaryGlobeCanvasRef.value, arcs);
};

// =========================================================
// VALIDATION DU POINTAGE & CALCUL STRICT DES INDICES
// =========================================================
const submitPinGuess = (timedOut = false) => {
  if (roundSubmitted.value) return;
  if (roundTimerInterval) clearInterval(roundTimerInterval);

  if (!guessLatLng.value && !timedOut) return;
  roundSubmitted.value = true;
  radarMinimized.value = false;
  radarExpanded.value = true;
  clueDrawerOpen.value = false;

  const elapsedSec = Math.max(1, Math.round((Date.now() - roundStartTimestamp) / 1000));

  let distKm = 20000;
  if (guessLatLng.value) {
    distKm = computeHaversineKm(
      guessLatLng.value.lat,
      guessLatLng.value.lng,
      currentTarget.value.lat,
      currentTarget.value.lng
    );
  }
  lastRoundDistanceKm.value = distKm;
  lastRoundAccuracyPct.value = Math.max(0, Math.min(100, Math.round((1 - distKm / 12000) * 100)));

  // Calcul du score brut de distance puis soustraction directe de la pénalité d'indices
  let rawPts = guessLatLng.value ? Math.round(5000 * Math.exp(-distKm / 2000)) : 0;
  if (distKm <= 35 && guessLatLng.value) rawPts = 5000;

  const penalty = currentRoundPenalty.value;
  const netPts = Math.max(0, rawPts - penalty);

  lastRoundRawPoints.value = rawPts;
  lastRoundPenalty.value = penalty;
  lastRoundPoints.value = netPts;
  totalScore.value += netPts;

  if (playMode.value === 'streak') {
    const hitCountry =
      nearestGuessedCountry.value &&
      nearestGuessedCountry.value.iso === currentTarget.value.iso;
    lastStreakHit.value = Boolean(hitCountry);
    if (hitCountry) {
      currentStreak.value++;
      if (currentStreak.value > bestStreak.value) {
        bestStreak.value = currentStreak.value;
        localStorage.setItem('geolearn_pindrop_streak', String(bestStreak.value));
      }
      playSound('hit');
    } else {
      playSound('miss');
    }
  } else {
    playSound(netPts >= 2000 ? 'hit' : 'miss');
  }

  roundHistory.value.push({
    iso: currentTarget.value.iso,
    name: currentTarget.value.name,
    capital: currentTarget.value.capital,
    distanceKm: distKm,
    rawPoints: rawPts,
    penalty,
    points: netPts,
    elapsedSec,
    guessCoords: guessLatLng.value ? { ...guessLatLng.value } : null,
    targetLat: currentTarget.value.lat,
    targetLng: currentTarget.value.lng
  });

  if (guessLatLng.value) {
    debriefRotLat = (guessLatLng.value.lat + currentTarget.value.lat) / 2;
    debriefRotLon = (guessLatLng.value.lng + currentTarget.value.lng) / 2;
  } else {
    debriefRotLat = currentTarget.value.lat;
    debriefRotLon = currentTarget.value.lng;
  }

  nextTick(() => {
    renderDebriefGlobe();
  });
};

const normalizedScoreOn15 = computed(() => {
  if (playMode.value === 'streak') {
    return Math.min(15, Number(((currentStreak.value / 10) * 15).toFixed(1)));
  }
  return Math.min(15, Number(((totalScore.value / 25000) * 15).toFixed(1)));
});

const averageOffsetKm = computed(() => {
  if (!roundHistory.value.length) return 0;
  const sum = roundHistory.value.reduce((acc, r) => acc + r.distanceKm, 0);
  return Math.round(sum / roundHistory.value.length);
});

const missionRankLabel = computed(() => {
  if (totalScore.value >= 22000) return 'ORBITAL MASTER // S-RANK';
  if (totalScore.value >= 18000) return 'GEODESIC ACE // A-RANK';
  if (totalScore.value >= 12000) return 'FIELD NAVIGATOR // B-RANK';
  return 'RECON CADET // C-RANK';
});

const saveFinalPinDropScore = async () => {
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
        mode: 'GeoGuessr',
        score: totalScore.value,
        max_score: 25000
      })
    });
  } catch (e) {}
};

const nextRound = () => {
  if (playMode.value === 'streak') {
    if (!lastStreakHit.value || roundIndex.value >= missionTargets.value.length - 1) {
      missionState.value = 'finished';
      nextTick(() => renderSummaryGlobe());
      return;
    }
    roundIndex.value++;
    radarExpanded.value = false;
    setupRoundCamera();
    return;
  }

  if (roundIndex.value < 4) {
    roundIndex.value++;
    radarExpanded.value = false;
    setupRoundCamera();
  } else {
    missionState.value = 'finished';
    saveFinalPinDropScore();
    nextTick(() => renderSummaryGlobe());
  }
};

const copyChallengeSeedLink = async () => {
  const seedStr = missionTargets.value.slice(0, 5).map((t) => t.iso).join(',');
  const url = `${window.location.origin}/geoguessr?seed=${seedStr}&mode=${playMode.value}&timer=${selectedTimerSec.value}`;
  try {
    await navigator.clipboard.writeText(url);
    seedCopied.value = true;
  } catch (e) {}
};

onMounted(() => {
  loadVectorBorders();
  renderBriefingGlobeLoop();

  if (route.query?.mode && ['orbital', 'visual', 'streak'].includes(String(route.query.mode))) {
    playMode.value = String(route.query.mode);
  }
  if (route.query?.timer) {
    selectedTimerSec.value = Number(route.query.timer) || 0;
  }
  const seedParam = route.query?.seed;
  if (typeof seedParam === 'string' && seedParam.includes(',')) {
    pendingSeedIsos.value = seedParam.split(',').filter(Boolean);
  }
});

onUnmounted(() => {
  if (briefingAnimId) cancelAnimationFrame(briefingAnimId);
  if (roundTimerInterval) clearInterval(roundTimerInterval);
});
</script>

<style scoped>
.sat-vignette {
  background: radial-gradient(circle at 50% 50%, transparent 58%, rgba(4, 7, 15, 0.72) 100%);
}

/* Transforme le fond océanique muet en radar tactique sombre sans aucun nom de pays */
.radar-mute-map :deep(.leaflet-tile-pane) {
  filter: invert(100%) hue-rotate(190deg) brightness(78%) contrast(125%) saturate(60%);
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.24s ease, transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>