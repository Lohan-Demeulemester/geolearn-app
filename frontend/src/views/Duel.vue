<template>
  <div class="duel-arena-experience relative w-full min-h-[calc(100vh-58px)] flex flex-col justify-between bg-[#04070F] text-slate-100 overflow-x-hidden select-none">

    <!-- ========================================================= -->
    <!-- 1. LOBBY DE BRIEFING PRÉ-MATCH (PARAMÈTRES VERROUILLABLES)-->
    <!-- ========================================================= -->
    <transition name="fade-up" mode="out-in">
      <section
        v-if="arenaState === 'lobby'"
        key="duel-lobby"
        class="relative flex-1 w-full max-w-[1640px] mx-auto px-4 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
      >
        <!-- Halos atmosphériques Bleu Ciel (J1) vs Rose Tactique (J2) -->
        <div class="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-sky-500/15 blur-[120px]"></div>
        <div class="pointer-events-none absolute -bottom-24 right-1/4 w-96 h-96 rounded-full bg-rose-500/15 blur-[120px]"></div>

        <!-- Colonne Gauche (7 cols) : Configuration complète avant verrouillage -->
        <div class="lg:col-span-7 space-y-6 relative z-10 rounded-[2rem] border border-white/12 bg-[#080D1A]/90 backdrop-blur-2xl p-6 sm:p-9 shadow-[0_30px_90px_rgba(0,0,0,0.85)]">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-[11px] font-bold uppercase tracking-wider">
              <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>COMPETITIVE ARENA // 1V1 TELEMETRY BRIEFING</span>
            </div>

            <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.08]">
              {{ locale === 'fr' ? 'Arène Duel' : '1v1 Live' }}
              <span class="bg-gradient-to-r from-sky-400 via-emerald-300 to-rose-400 bg-clip-text text-transparent">
                {{ locale === 'fr' ? 'Face-à-Face.' : 'Duel Arena.' }}
              </span>
            </h1>

            <p class="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
              {{ locale === 'fr'
                ? 'Sélectionnez votre moteur de combat, votre adversaire et la cadence du chronomètre avant le lancement. Une fois l\'arène engagée, les règles sont verrouillées pour les 10 manches.'
                : 'Select your combat engine, opponent protocol, and round timer before launch. Once engaged, rules are locked for all 10 rounds.' }}
            </p>
          </div>

          <!-- Alerte si un salon Fantôme partagé par un ami est actif -->
          <div
            v-if="incomingGhostData"
            class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-between gap-4"
          >
            <div class="space-y-0.5">
              <span class="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                {{ locale === 'fr' ? 'SALON FANTÔME DÉTECTÉ' : 'GHOST CHALLENGE ROOM DETECTED' }}
              </span>
              <p class="text-xs text-slate-200">
                {{ locale === 'fr'
                  ? `Défi enregistré par ${incomingGhostData.challengerName} (${incomingGhostData.engine.toUpperCase()}). Les 10 cibles sont verrouillées.`
                  : `Recorded challenge by ${incomingGhostData.challengerName} (${incomingGhostData.engine.toUpperCase()}). All 10 targets are locked.` }}
              </p>
            </div>
            <button
              type="button"
              @click="clearIncomingGhost"
              class="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 font-mono text-[10px] font-bold text-white cursor-pointer shrink-0"
            >
              {{ locale === 'fr' ? 'Quitter Salon' : 'Leave Room' }}
            </button>
          </div>

          <!-- ÉTAPE 01 : MOTEUR D'AFFRONTEMENT (BLITZ QCM / SNIPER CARTE MUETTE / TYPE-RACE) -->
          <div class="space-y-2.5">
            <span class="font-mono text-[11px] font-bold uppercase tracking-wider text-sky-400 block">
              01 // {{ locale === 'fr' ? 'MOTEUR D\'AFFRONTEMENT' : 'COMBAT ENGINE' }}
            </span>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                v-for="eng in engineOptions"
                :key="eng.id"
                type="button"
                :disabled="Boolean(incomingGhostData)"
                @click="combatEngine = eng.id"
                class="p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 disabled:opacity-50"
                :class="combatEngine === eng.id
                  ? 'bg-sky-500/15 border-sky-400 text-white shadow-lg shadow-sky-500/10'
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200'"
              >
                <div class="flex items-center justify-between">
                  <span class="font-mono text-[10px] font-bold uppercase text-sky-400">{{ eng.code }}</span>
                  <span
                    class="w-2.5 h-2.5 rounded-full"
                    :class="combatEngine === eng.id ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-white/15'"
                  ></span>
                </div>
                <div>
                  <strong class="text-sm font-black text-white block">{{ eng.title }}</strong>
                  <span class="text-[11px] text-slate-400 leading-snug block mt-1">{{ eng.desc }}</span>
                </div>
              </button>
            </div>
          </div>

          <!-- ÉTAPE 02 : PROTOCOLE D'ADVERSAIRE (RIVAL LIGUE / 2 JOUEURS SUR 1 ÉCRAN / FANTÔME AMI) -->
          <div class="space-y-2.5">
            <span class="font-mono text-[11px] font-bold uppercase tracking-wider text-sky-400 block">
              02 // {{ locale === 'fr' ? 'PROTOCOLE D\'ADVERSAIRE' : 'OPPONENT PROTOCOL' }}
            </span>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                v-for="opp in opponentModes"
                :key="opp.id"
                type="button"
                :disabled="Boolean(incomingGhostData) && opp.id !== 'ghost'"
                @click="selectedOpponentMode = opp.id"
                class="p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 disabled:opacity-45"
                :class="selectedOpponentMode === opp.id
                  ? 'bg-rose-500/15 border-rose-400 text-white shadow-lg shadow-rose-500/10'
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/25'"
              >
                <span class="font-mono text-[10px] font-bold text-rose-400">{{ opp.code }}</span>
                <strong class="text-xs font-black text-white block">{{ opp.title }}</strong>
                <span class="text-[11px] text-slate-400 leading-tight block">{{ opp.desc }}</span>
              </button>
            </div>
          </div>

          <!-- ÉTAPE 03 : PARAMÈTRES TACTIQUES (CALIBRAGE RIVAL, SECTEUR & CHRONO PAR MANCHE) -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <!-- Calibrage du Rival ou Noms 2 Joueurs -->
            <div v-if="selectedOpponentMode !== 'local2p'" class="space-y-1.5">
              <span class="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                03 // {{ locale === 'fr' ? 'CALIBRAGE RIVAL' : 'RIVAL TIER' }}
              </span>
              <select
                v-model="selectedRivalTier"
                :disabled="Boolean(incomingGhostData)"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 font-mono text-xs font-bold text-white focus:outline-none focus:border-rose-400"
              >
                <option value="silver">{{ locale === 'fr' ? 'Ligue Argent (~4.2s)' : 'Silver League (~4.2s)' }}</option>
                <option value="gold">{{ locale === 'fr' ? 'Ligue Or (~3.0s)' : 'Gold League (~3.0s)' }}</option>
                <option value="diamond">{{ locale === 'fr' ? 'Ligue Diamant (~2.1s)' : 'Diamond League (~2.1s)' }}</option>
                <option value="master">{{ locale === 'fr' ? 'Maître Orbital (~1.4s)' : 'Orbital Master (~1.4s)' }}</option>
              </select>
            </div>

            <div v-else class="space-y-1.5">
              <span class="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                03 // {{ locale === 'fr' ? 'PSEUDO JOUEUR 2' : 'PLAYER 2 NAME' }}
              </span>
              <input
                v-model="customP2Name"
                type="text"
                maxlength="16"
                :placeholder="locale === 'fr' ? 'Joueur 2' : 'Player 2'"
                class="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/15 font-mono text-xs font-bold text-white focus:outline-none focus:border-rose-400"
              />
            </div>

            <!-- Secteur Continental -->
            <div class="space-y-1.5">
              <span class="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                04 // {{ locale === 'fr' ? 'SECTEUR GÉOGRAPHIQUE' : 'SECTOR' }}
              </span>
              <select
                v-model="duelSector"
                :disabled="Boolean(incomingGhostData)"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 font-mono text-xs font-bold text-white focus:outline-none focus:border-sky-400"
              >
                <option value="world">{{ locale === 'fr' ? 'Monde entier (196)' : 'Full World (196)' }}</option>
                <option value="Europe">Europe (47)</option>
                <option value="Asia">{{ locale === 'fr' ? 'Asie (46)' : 'Asia (46)' }}</option>
                <option value="Africa">{{ locale === 'fr' ? 'Afrique (54)' : 'Africa (54)' }}</option>
                <option value="Americas">{{ locale === 'fr' ? 'Amériques (35)' : 'Americas (35)' }}</option>
              </select>
            </div>

            <!-- Temps limite par manche -->
            <div class="space-y-1.5">
              <span class="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                05 // {{ locale === 'fr' ? 'TEMPS PAR MANCHE' : 'ROUND TIMER' }}
              </span>
              <select
                v-model.number="roundTimeLimitSec"
                :disabled="Boolean(incomingGhostData)"
                class="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 font-mono text-xs font-bold text-sky-300 focus:outline-none focus:border-sky-400"
              >
                <option :value="15">15s Standard</option>
                <option :value="10">10s Rapide</option>
                <option :value="7">7s Hyper-Blitz</option>
                <option :value="25">25s Tactique</option>
              </select>
            </div>
          </div>

          <!-- Bouton d'engagement du Duel -->
          <div class="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="font-mono text-[11px] text-slate-400">
              {{ locale === 'fr'
                ? '10 manches verrouillées • Barème converti sur /15 dans vos statistiques'
                : '10 locked rounds • Score normalized to /15 in your telemetry stats' }}
            </div>

            <button
              type="button"
              @click="initiateDuelSequence"
              class="px-8 py-4 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-2xl shadow-sky-500/25 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-3 shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
                <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
                <line x1="13" y1="19" x2="19" y2="13" />
                <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
              </svg>
              <span>{{ locale === 'fr' ? 'Engager le Duel (10 Manches)' : 'Engage 10-Round Duel' }}</span>
            </button>
          </div>
        </div>

        <!-- Colonne Droite (5 cols) : Sphère de Collision 3D Interactive avec Frontières -->
        <div class="lg:col-span-5 flex flex-col items-center justify-center relative z-10 p-6 rounded-[2rem] border border-white/10 bg-[#080D1A]/75 backdrop-blur-xl">
          <div class="w-full flex items-center justify-between font-mono text-[10px] text-slate-400 pb-3 mb-2 border-b border-white/10">
            <span class="text-sky-400 font-bold">{{ player1Name.toUpperCase() }}</span>
            <span class="text-white/40">VS</span>
            <span class="text-rose-400 font-bold">{{ player2Name.toUpperCase() }}</span>
          </div>

          <canvas
            ref="arenaOrbCanvasRef"
            width="360"
            height="360"
            class="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] cursor-grab active:cursor-grabbing"
            @pointerdown="onOrbPointerDown"
            @pointermove="onOrbPointerMove"
            @pointerup="onOrbPointerUp"
            @pointerleave="onOrbPointerUp"
          ></canvas>

          <div class="w-full grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 font-mono text-[11px] text-center">
            <div>
              <span class="text-slate-500 block text-[9px]">ENGINE</span>
              <strong class="text-sky-400 uppercase">{{ combatEngine }}</strong>
            </div>
            <div>
              <span class="text-slate-500 block text-[9px]">SECTOR</span>
              <strong class="text-white uppercase">{{ duelSector }}</strong>
            </div>
            <div>
              <span class="text-slate-500 block text-[9px]">CADENCE</span>
              <strong class="text-emerald-400">{{ roundTimeLimitSec }}S / RND</strong>
            </div>
          </div>
        </div>
      </section>

      <!-- ======================================================= -->
      <!-- 2. SÉQUENCE CINÉMATIQUE DE COMPTE À REBOURS (3 - 2 - 1) -->
      <!-- ======================================================= -->
      <section
        v-else-if="arenaState === 'countdown'"
        key="duel-countdown"
        class="flex-1 w-full flex flex-col items-center justify-center px-4 py-12 text-center relative overflow-hidden"
      >
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.16),transparent_70%)]"></div>

        <div class="relative z-10 max-w-2xl w-full rounded-[2rem] border border-white/15 bg-[#080D1A]/90 backdrop-blur-2xl p-8 sm:p-12 shadow-2xl space-y-6">
          <span class="font-mono text-xs font-bold uppercase tracking-widest text-sky-400 block">
            TELEMETRY LOCK-IN // {{ activeEngineLabel }}
          </span>

          <div class="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 py-4">
            <div class="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30">
              <span class="font-mono text-[10px] text-sky-400 block">OPERATOR 01</span>
              <strong class="text-lg font-black text-white truncate block mt-0.5">{{ player1Name }}</strong>
            </div>

            <div class="font-mono text-5xl sm:text-6xl font-black text-emerald-400 animate-pulse">
              {{ countdownValue }}
            </div>

            <div class="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30">
              <span class="font-mono text-[10px] text-rose-400 block">OPERATOR 02</span>
              <strong class="text-lg font-black text-white truncate block mt-0.5">{{ player2Name }}</strong>
            </div>
          </div>

          <p class="font-mono text-xs text-slate-400">
            {{ locale === 'fr'
              ? 'Paramètres verrouillés • Préparez-vous à l\'ouverture de la manche 01'
              : 'Parameters locked • Prepare for Round 01 engagement' }}
          </p>
        </div>
      </section>

      <!-- ======================================================= -->
      <!-- 3. ARÈNE ACTIVE (BARRE TUG-OF-WAR + 3 MOTEURS DE JEU)   -->
      <!-- ======================================================= -->
      <section
        v-else-if="arenaState === 'playing' && currentDuelQuestion"
        key="duel-playing"
        class="flex-1 w-full max-w-[1440px] mx-auto px-3 sm:px-8 py-5 flex flex-col justify-between gap-5"
      >
        <!-- BARRE SUPÉRIEURE VERROUILLÉE & JAUGE TUG-OF-WAR -->
        <header class="rounded-3xl bg-[#080D1A]/90 border border-white/12 p-4 sm:p-5 shadow-2xl space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <!-- Joueur 1 (Bleu Ciel) -->
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/45 font-mono text-xs font-black text-sky-300 flex items-center justify-center">
                P1
              </div>
              <div>
                <strong class="text-sm sm:text-base font-black text-white block leading-tight">{{ player1Name }}</strong>
                <span class="font-mono text-xs text-sky-400 font-bold">
                  {{ p1Points.toLocaleString() }} PTS • {{ p1RoundsWon }}W
                </span>
              </div>
            </div>

            <!-- Centre : Manche, Moteur verrouillé, Chronomètre & Bouton Abandon -->
            <div class="flex items-center gap-3">
              <div class="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 font-mono text-xs text-center">
                <span class="text-slate-400 mr-2">{{ activeEngineLabel }}</span>
                <strong class="text-white">{{ locale === 'fr' ? `MANCHE ${duelRound + 1}/10` : `ROUND ${duelRound + 1}/10` }}</strong>
              </div>

              <div
                class="px-4 py-1.5 rounded-full font-mono text-sm font-black border"
                :class="remainingRoundSec <= 3
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                  : 'bg-emerald-500/15 border-emerald-500/35 text-emerald-400'"
              >
                {{ remainingRoundSec.toFixed(1) }}s
              </div>

              <button
                type="button"
                @click="abortDuelToLobby"
                class="px-3 py-1.5 rounded-full bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 font-mono text-[11px] font-bold transition cursor-pointer"
              >
                {{ locale === 'fr' ? 'Quitter' : 'Abort' }}
              </button>
            </div>

            <!-- Joueur 2 (Rose Tactique) -->
            <div class="flex items-center gap-3 text-right ml-auto sm:ml-0">
              <div>
                <strong class="text-sm sm:text-base font-black text-white block leading-tight">{{ player2Name }}</strong>
                <span class="font-mono text-xs text-rose-400 font-bold">
                  {{ p2Points.toLocaleString() }} PTS • {{ p2RoundsWon }}W
                </span>
              </div>
              <div class="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/45 font-mono text-xs font-black text-rose-300 flex items-center justify-center">
                P2
              </div>
            </div>
          </div>

          <!-- Jauge d'équilibre des forces (Tug-of-War) -->
          <div class="h-2 w-full rounded-full bg-rose-500/45 overflow-hidden flex">
            <div
              class="h-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-500"
              :style="{ width: `${tugOfWarRatio}%` }"
            ></div>
          </div>
        </header>

        <!-- ===================================================== -->
        <!-- MOTEUR A : BLITZ QCM (CLAVIER SCINDÉ OU SOLO RAPIDE)  -->
        <!-- ===================================================== -->
        <div
          v-if="combatEngine === 'blitz'"
          class="flex-1 rounded-3xl bg-[#080D1A]/90 border border-white/12 p-6 sm:p-8 text-center flex flex-col justify-between gap-6 shadow-2xl"
        >
          <div class="space-y-4 my-auto">
            <img
              :src="`https://flagcdn.com/w320/${currentDuelQuestion.target.iso}.png`"
              class="h-24 sm:h-32 w-auto rounded-xl mx-auto shadow-lg border border-white/10 object-contain"
              alt=""
            />
            <div class="space-y-1">
              <span class="font-mono text-xs uppercase tracking-wider text-sky-400 block">
                {{ currentDuelQuestion.askFlag
                  ? (locale === 'fr' ? 'IDENTIFICATION VEXILLOLOGIQUE' : 'FLAG IDENTIFICATION')
                  : (locale === 'fr' ? 'CAPITALE OFFICIELLE' : 'OFFICIAL CAPITAL') }}
              </span>
              <h2 class="text-xl sm:text-3xl font-black text-white">
                {{ currentDuelQuestion.askFlag
                  ? (locale === 'fr' ? 'À quel État appartient ce drapeau ?' : 'Which country does this flag belong to?')
                  : (locale === 'fr' ? `Quelle est la capitale de : ${currentDuelQuestion.target.name} ?` : `What is the capital of ${currentDuelQuestion.target.name}?`) }}
              </h2>
            </div>

            <!-- Mode Local 2 Joueurs : Clavier scindé A-Z-E-R vs 1-2-3-4 -->
            <div v-if="selectedOpponentMode === 'local2p'" class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 max-w-4xl mx-auto w-full">
              <div class="space-y-2.5 p-4 rounded-2xl bg-sky-500/[0.06] border border-sky-500/25">
                <span class="font-mono text-xs font-bold text-sky-400 block">
                  {{ player1Name }} [A / Z / E / R]
                </span>
                <div class="grid grid-cols-1 gap-2">
                  <button
                    v-for="(opt, idx) in currentDuelQuestion.options"
                    :key="'p1-' + opt.id"
                    type="button"
                    :disabled="roundResolved"
                    @click="handleBlitzAnswer(1, opt.id)"
                    class="p-3 rounded-xl border border-white/10 bg-slate-900/90 hover:border-sky-400 text-left text-xs sm:text-sm font-bold flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span class="px-2 py-0.5 rounded bg-sky-500/20 font-mono text-sky-300 text-xs">{{ ['A', 'Z', 'E', 'R'][idx] }}</span>
                    <span class="truncate flex-1 ml-2">{{ currentDuelQuestion.askFlag ? opt.name : opt.capital }}</span>
                  </button>
                </div>
              </div>

              <div class="space-y-2.5 p-4 rounded-2xl bg-rose-500/[0.06] border border-rose-500/25">
                <span class="font-mono text-xs font-bold text-rose-400 block">
                  {{ player2Name }} [1 / 2 / 3 / 4]
                </span>
                <div class="grid grid-cols-1 gap-2">
                  <button
                    v-for="(opt, idx) in currentDuelQuestion.options"
                    :key="'p2-' + opt.id"
                    type="button"
                    :disabled="roundResolved"
                    @click="handleBlitzAnswer(2, opt.id)"
                    class="p-3 rounded-xl border border-white/10 bg-slate-900/90 hover:border-rose-400 text-left text-xs sm:text-sm font-bold flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span class="px-2 py-0.5 rounded bg-rose-500/20 font-mono text-rose-300 text-xs">{{ ['1', '2', '3', '4'][idx] }}</span>
                    <span class="truncate flex-1 ml-2">{{ currentDuelQuestion.askFlag ? opt.name : opt.capital }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Mode Rival ou Fantôme -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3 max-w-3xl mx-auto w-full">
              <button
                v-for="(opt, idx) in currentDuelQuestion.options"
                :key="'solo-' + opt.id"
                type="button"
                :disabled="roundResolved"
                @click="handleBlitzAnswer(1, opt.id)"
                class="p-4 rounded-2xl border-2 text-left font-bold text-sm sm:text-base transition-all flex items-center justify-between gap-3 cursor-pointer"
                :class="getDuelOptionClass(opt.id)"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <span class="w-7 h-7 rounded-lg bg-white/10 font-mono text-xs font-black flex items-center justify-center shrink-0">
                    {{ idx + 1 }}
                  </span>
                  <span class="truncate">{{ currentDuelQuestion.askFlag ? opt.name : opt.capital }}</span>
                </div>
              </button>
            </div>
          </div>

          <p v-if="roundStatusBanner" class="font-mono text-xs font-bold text-amber-300">
            {{ roundStatusBanner }}
          </p>
        </div>

        <!-- ===================================================== -->
        <!-- MOTEUR B : SNIPER CARTE MUETTE (DUEL DE PRÉCISION KM) -->
        <!-- ===================================================== -->
        <div
          v-else-if="combatEngine === 'sniper'"
          class="flex-1 rounded-3xl bg-[#080D1A]/90 border border-white/12 p-4 sm:p-6 flex flex-col justify-between gap-4 shadow-2xl"
        >
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <img :src="`https://flagcdn.com/w80/${currentDuelQuestion.target.iso}.png`" class="h-8 w-auto rounded border border-white/15 shadow" alt="" />
              <div>
                <span class="font-mono text-[10px] text-sky-400 uppercase block">
                  {{ locale === 'fr' ? 'CIBLE GÉODÉSIQUE À LOCALISER SUR LA CARTE MUETTE' : 'GEODESIC TARGET TO LOCATE ON BLANK MAP' }}
                </span>
                <h2 class="text-lg sm:text-2xl font-black text-white">
                  {{ currentDuelQuestion.target.name }} ({{ currentDuelQuestion.target.capital }})
                </h2>
              </div>
            </div>

            <!-- Indicateur de tour si mode 2 Joueurs sur 1 écran -->
            <div v-if="selectedOpponentMode === 'local2p' && !roundResolved" class="px-4 py-2 rounded-full bg-white/10 font-mono text-xs font-black">
              <span v-if="sniperTurn === 1" class="text-sky-400">
                {{ locale === 'fr' ? `TOUR DE ${player1Name.toUpperCase()} : CLIQUEZ SUR LA CARTE` : `${player1Name.toUpperCase()}'S TURN: CLICK MAP` }}
              </span>
              <span v-else class="text-rose-400">
                {{ locale === 'fr' ? `TOUR DE ${player2Name.toUpperCase()} : CLIQUEZ SUR LA CARTE` : `${player2Name.toUpperCase()}'S TURN: CLICK MAP` }}
              </span>
            </div>

            <div v-else-if="roundResolved" class="flex items-center gap-3 font-mono text-xs">
              <span class="px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/35 text-sky-300 font-bold">
                P1 : {{ sniperP1DistKm.toLocaleString() }} km
              </span>
              <span class="px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/35 text-rose-300 font-bold">
                P2 : {{ sniperP2DistKm.toLocaleString() }} km
              </span>
            </div>
          </div>

          <!-- Carte 2D 100 % Muette (Zéro nom de pays + Frontières vectorielles) -->
          <div class="sniper-mute-map relative flex-1 min-h-[380px] sm:min-h-[430px] w-full rounded-2xl overflow-hidden border border-white/15 z-0">
            <l-map
              v-model:zoom="sniperMapZoom"
              v-model:center="sniperMapCenter"
              :min-zoom="2"
              :max-zoom="6"
              :options="{ zoomControl: false, attributionControl: false, worldCopyJump: true }"
              :use-global-leaflet="false"
              @click="onSniperMapClick"
            >
              <l-tile-layer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
                :no-wrap="false"
              ></l-tile-layer>

              <l-polyline
                v-for="(ring, rIdx) in leafletWorldRings"
                :key="'snp-b-' + rIdx"
                :lat-lngs="ring"
                :color="'#38bdf8'"
                :weight="0.8"
                :options="{ opacity: 0.35, interactive: false }"
              ></l-polyline>

              <!-- Lignes et marqueurs révélés en fin de manche -->
              <template v-if="roundResolved">
                <l-polyline
                  v-if="sniperP1LatLng"
                  :lat-lngs="[[sniperP1LatLng.lat, sniperP1LatLng.lng], [currentDuelQuestion.target.lat, currentDuelQuestion.target.lng]]"
                  :color="'#38bdf8'"
                  :weight="2.5"
                  :options="{ dashArray: '5, 5' }"
                ></l-polyline>
                <l-polyline
                  v-if="sniperP2LatLng"
                  :lat-lngs="[[sniperP2LatLng.lat, sniperP2LatLng.lng], [currentDuelQuestion.target.lat, currentDuelQuestion.target.lng]]"
                  :color="'#f43f5e'"
                  :weight="2.5"
                  :options="{ dashArray: '5, 5' }"
                ></l-polyline>

                <l-circle-marker
                  v-if="sniperP1LatLng"
                  :lat-lng="[sniperP1LatLng.lat, sniperP1LatLng.lng]"
                  :radius="7"
                  :color="'#ffffff'"
                  :weight="2"
                  :fill-color="'#0ea5e9'"
                  :fill-opacity="1"
                ></l-circle-marker>

                <l-circle-marker
                  v-if="sniperP2LatLng"
                  :lat-lng="[sniperP2LatLng.lat, sniperP2LatLng.lng]"
                  :radius="7"
                  :color="'#ffffff'"
                  :weight="2"
                  :fill-color="'#f43f5e'"
                  :fill-opacity="1"
                ></l-circle-marker>

                <l-circle-marker
                  :lat-lng="[currentDuelQuestion.target.lat, currentDuelQuestion.target.lng]"
                  :radius="8"
                  :color="'#ffffff'"
                  :weight="2.5"
                  :fill-color="'#10b981'"
                  :fill-opacity="1"
                ></l-circle-marker>
              </template>
            </l-map>
          </div>

          <p v-if="roundStatusBanner" class="font-mono text-xs font-bold text-center text-amber-300">
            {{ roundStatusBanner }}
          </p>
        </div>

        <!-- ===================================================== -->
        <!-- MOTEUR C : TYPE-RACE CLAVIER (VITESSE DE FRAPPE)      -->
        <!-- ===================================================== -->
        <div
          v-else-if="combatEngine === 'typerace'"
          class="flex-1 rounded-3xl bg-[#080D1A]/90 border border-white/12 p-6 sm:p-10 flex flex-col justify-between gap-6 shadow-2xl max-w-3xl mx-auto w-full"
        >
          <div class="space-y-5 my-auto text-center">
            <img
              :src="`https://flagcdn.com/w320/${currentDuelQuestion.target.iso}.png`"
              class="h-24 sm:h-32 w-auto rounded-xl mx-auto shadow-lg border border-white/10 object-contain"
              alt=""
            />

            <div class="space-y-1">
              <span class="font-mono text-xs text-sky-400 uppercase block">
                {{ currentDuelQuestion.target.subregion }} • {{ locale === 'fr' ? 'CAPITALE :' : 'CAPITAL:' }} {{ currentDuelQuestion.target.capital }}
              </span>
              <h2 class="text-xl sm:text-2xl font-black text-white">
                {{ locale === 'fr' ? 'Saisissez le nom de cet État avant votre adversaire' : 'Type this Sovereign State\'s name before your opponent' }}
              </h2>
            </div>

            <!-- Jauge de frappe adverse en temps réel -->
            <div class="max-w-md mx-auto space-y-1 text-left">
              <div class="flex justify-between font-mono text-[10px] text-rose-400">
                <span>{{ player2Name.toUpperCase() }} // PROGRESSION DE SAISIE</span>
                <span>{{ rivalTypingProgressPct }}%</span>
              </div>
              <div class="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  class="h-full bg-rose-500 transition-all duration-150"
                  :style="{ width: `${rivalTypingProgressPct}%` }"
                ></div>
              </div>
            </div>

            <!-- Champ de saisie ultra-rapide avec validation automatique -->
            <div class="max-w-md mx-auto pt-2">
              <input
                ref="typeRaceInputRef"
                v-model="typeRaceInput"
                :disabled="roundResolved"
                @input="checkTypeRaceInput(false)"
                @keydown.enter.prevent="checkTypeRaceInput(true)"
                type="text"
                :placeholder="locale === 'fr' ? 'Tapez le nom du pays...' : 'Type country name...'"
                autocomplete="off"
                spellcheck="false"
                class="w-full px-5 py-4 rounded-2xl border-2 border-sky-500/40 bg-slate-950 text-center text-base sm:text-lg font-black text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <p v-if="roundStatusBanner" class="font-mono text-xs font-bold text-center text-amber-300">
            {{ roundStatusBanner }}
          </p>
        </div>

      </section>

      <!-- ======================================================= -->
      <!-- 4. BILAN FINAL D'ARÈNE + GLOBE 3D & LIEN FANTÔME        -->
      <!-- ======================================================= -->
      <section
        v-else-if="arenaState === 'finished'"
        key="duel-finished"
        class="flex-1 w-full max-w-4xl mx-auto px-4 py-10 flex items-center justify-center"
      >
        <div class="w-full rounded-[2rem] bg-[#080D1A]/95 border border-white/15 p-6 sm:p-10 shadow-2xl space-y-6">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <span class="font-mono text-xs font-bold uppercase tracking-widest text-sky-400 block">
                ARENA DEBRIEF // {{ activeEngineLabel }}
              </span>
              <h2 class="text-3xl sm:text-4xl font-black mt-1">
                {{ p1Points >= p2Points
                  ? (locale === 'fr' ? `Victoire de ${player1Name}` : `${player1Name} Wins`)
                  : (locale === 'fr' ? `Victoire de ${player2Name}` : `${player2Name} Wins`) }}
              </h2>
              <p class="font-mono text-xs text-emerald-400 mt-1">
                {{ locale === 'fr'
                  ? `Score unifié enregistré : ${Math.min(15, Math.round((p1RoundsWon / 10) * 15))} / 15`
                  : `Normalized score saved: ${Math.min(15, Math.round((p1RoundsWon / 10) * 15))} / 15` }}
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                @click="copyGhostRoomLink"
                class="px-4 py-2.5 rounded-full bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/35 text-xs font-black transition cursor-pointer"
              >
                {{ roomLinkCopied
                  ? (locale === 'fr' ? 'Lien Fantôme copié' : 'Ghost Link Copied')
                  : (locale === 'fr' ? 'Défier un ami (Lien Fantôme)' : 'Challenge Friend (Ghost Link)') }}
              </button>

              <button
                type="button"
                @click="arenaState = 'lobby'"
                class="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
              >
                {{ locale === 'fr' ? 'Changer de mode' : 'Change Rules' }}
              </button>

              <button
                type="button"
                @click="initiateDuelSequence"
                class="px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-950 text-xs font-black transition cursor-pointer shadow-lg shadow-sky-500/20"
              >
                {{ locale === 'fr' ? 'Revanche immédiate' : 'Instant Rematch' }}
              </button>
            </div>
          </div>

          <!-- Cartes de score P1 vs P2 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/35 flex items-center justify-between">
              <div>
                <span class="font-mono text-xs font-bold text-sky-400 block">{{ player1Name }}</span>
                <strong class="font-mono text-2xl sm:text-3xl font-black text-white">{{ p1Points.toLocaleString() }} PTS</strong>
              </div>
              <span class="px-3 py-1 rounded-full bg-sky-500/20 font-mono text-xs font-black text-sky-300">
                {{ p1RoundsWon }} / 10 MANCHES
              </span>
            </div>

            <div class="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/35 flex items-center justify-between">
              <div>
                <span class="font-mono text-xs font-bold text-rose-400 block">{{ player2Name }}</span>
                <strong class="font-mono text-2xl sm:text-3xl font-black text-white">{{ p2Points.toLocaleString() }} PTS</strong>
              </div>
              <span class="px-3 py-1 rounded-full bg-rose-500/20 font-mono text-xs font-black text-rose-300">
                {{ p2RoundsWon }} / 10 MANCHES
              </span>
            </div>
          </div>

          <!-- Historique détaillé des 10 manches -->
          <div class="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            <div
              v-for="(rLog, idx) in matchRoundsSummary"
              :key="'m-log-' + idx"
              class="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3 text-xs"
            >
              <div class="flex items-center gap-3 min-w-0">
                <span class="font-mono text-slate-400 font-bold">#0{{ idx + 1 }}</span>
                <img :src="`https://flagcdn.com/w40/${rLog.iso}.png`" class="h-4 w-auto rounded-2xs shrink-0" alt="" />
                <strong class="text-white truncate">{{ rLog.countryName }} ({{ rLog.capital }})</strong>
              </div>

              <div class="flex items-center gap-3 font-mono shrink-0">
                <span class="text-slate-400 text-[11px]">{{ rLog.detail }}</span>
                <span
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-black"
                  :class="rLog.winner === 1 ? 'bg-sky-500/20 text-sky-300' : 'bg-rose-500/20 text-rose-300'"
                >
                  {{ rLog.winner === 1 ? player1Name : player2Name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </transition>

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

const COUNTRY_ALIASES = {
  usa: 'us', 'etats unis': 'us', 'united states': 'us',
  uk: 'gb', 'royaume uni': 'gb', angleterre: 'gb',
  rdc: 'cd', 'congo kinshasa': 'cd', 'dr congo': 'cd',
  eau: 'ae', uae: 'ae', emirats: 'ae',
  'pays bas': 'nl', hollande: 'nl',
  tchequie: 'cz', birmanie: 'mm', eswatini: 'sz',
  'cap vert': 'cv', 'cote divoire': 'ci', 'coree du sud': 'kr',
  'coree du nord': 'kp', macedoine: 'mk', bosnie: 'ba', centrafrique: 'cf'
};

const normalizeString = (str = '') =>
  str
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const localizedCountries = computed(() => {
  const isEn = locale.value === 'en';
  return ALL_COUNTRIES.map((c, idx) => ({
    ...c,
    id: c.id || c.iso || idx + 1,
    name: isEn ? c.name_en : c.name_fr,
    capital: isEn ? c.capital_en : c.capital_fr,
    continent: c.continent_en,
    subregion: isEn ? c.subregion_en : c.subregion_fr
  }));
});

const leafletWorldRings = ref([]);
let rawWorldRings = [];

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
      rawWorldRings = extractRingsFromTopoJSON(topo);
      leafletWorldRings.value = rawWorldRings.map((r) => r.map(([lon, lat]) => [lat, lon]));
    }
  } catch (e) {}
};

// =========================================================
// SPHÈRE DE COLLISION 3D INTERACTIVE DANS LE LOBBY
// =========================================================
const arenaOrbCanvasRef = ref(null);
let orbAnimId = null;
let orbYaw = -0.3;
let orbPitch = 0.25;
let orbDragging = false;
let orbLastX = 0;
let orbLastY = 0;

const onOrbPointerDown = (e) => {
  orbDragging = true;
  orbLastX = e.clientX;
  orbLastY = e.clientY;
};
const onOrbPointerMove = (e) => {
  if (!orbDragging) return;
  orbYaw += (e.clientX - orbLastX) * 0.01;
  orbPitch = Math.max(-0.8, Math.min(0.8, orbPitch + (e.clientY - orbLastY) * 0.01));
  orbLastX = e.clientX;
  orbLastY = e.clientY;
};
const onOrbPointerUp = () => {
  orbDragging = false;
};

const renderArenaOrb3D = () => {
  const canvas = arenaOrbCanvasRef.value;
  if (canvas && arenaState.value === 'lobby') {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const R = W * 0.39;
    ctx.clearRect(0, 0, W, H);

    if (!orbDragging) orbYaw += 0.009;

    const toRad = (d) => (d * Math.PI) / 180;
    const cosPhi0 = Math.cos(orbPitch);
    const sinPhi0 = Math.sin(orbPitch);

    const projectLatLon = (latDeg, lonDeg) => {
      const phi = toRad(latDeg);
      const lam = toRad(lonDeg) - orbYaw;
      const cosC = sinPhi0 * Math.sin(phi) + cosPhi0 * Math.cos(phi) * Math.cos(lam);
      if (cosC < 0) return null;
      return {
        x: cx + R * Math.cos(phi) * Math.sin(lam),
        y: cy - R * (cosPhi0 * Math.sin(phi) - sinPhi0 * Math.cos(phi) * Math.cos(lam))
      };
    };

    const grad = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.25, R * 0.1, cx, cy, R);
    grad.addColorStop(0, '#102648');
    grad.addColorStop(1, '#040812');
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Frontières vectorielles sur la sphère de duel
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
    ctx.fillStyle = 'rgba(20, 48, 86, 0.65)';
    ctx.lineWidth = 0.65;
    for (const ring of rawWorldRings) {
      ctx.beginPath();
      let vis = 0;
      let prev = null;
      for (const [lon, lat] of ring) {
        const p = projectLatLon(lat, lon);
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

    // Deux noyaux orbitaux antagonistes (Sky Blue P1 vs Rose P2)
    const p1X = cx + Math.cos(orbYaw * 2.2) * (R * 1.12);
    const p1Y = cy + Math.sin(orbYaw * 2.2) * (R * 0.36);
    const p2X = cx - Math.cos(orbYaw * 2.2) * (R * 1.12);
    const p2Y = cy - Math.sin(orbYaw * 2.2) * (R * 0.36);

    ctx.beginPath();
    ctx.ellipse(cx, cy, R * 1.12, R * 0.36, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    for (const [px, py, col] of [[p1X, p1Y, '#38bdf8'], [p2X, p2Y, '#f43f5e']]) {
      const g = ctx.createRadialGradient(px, py, 1, px, py, 18);
      g.addColorStop(0, col);
      g.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(px, py, 18, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
  }
  orbAnimId = requestAnimationFrame(renderArenaOrb3D);
};

// =========================================================
// CONFIGURATION & MOTEURS D'AFFRONTEMENT (BLITZ, SNIPER, TYPERACE)
// =========================================================
const arenaState = ref('lobby'); // 'lobby' | 'countdown' | 'playing' | 'finished'
const combatEngine = ref('blitz'); // 'blitz' | 'sniper' | 'typerace'
const selectedOpponentMode = ref('rival'); // 'rival' | 'local2p' | 'ghost'
const selectedRivalTier = ref('gold');
const duelSector = ref('world');
const roundTimeLimitSec = ref(15);
const customP2Name = ref('');
const countdownValue = ref(3);

const engineOptions = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    {
      id: 'blitz',
      code: 'ENG-01 // SPEED QCM',
      title: isFr ? 'Blitz QCM (Capitales & Drapeaux)' : 'Blitz QCM (Capitals & Flags)',
      desc: isFr
        ? 'Le premier opérateur à verrouiller la bonne réponse remporte la manche avec bonus de vitesse.'
        : 'First operator to lock the right answer takes the round with speed bonus.'
    },
    {
      id: 'sniper',
      code: 'ENG-02 // BLANK MAP PIN',
      title: isFr ? 'Sniper Carte Muette (Distance)' : 'Blank Map Sniper (Distance)',
      desc: isFr
        ? 'Pointez l\'État cible sur la carte muette. L\'épingle la plus proche en kilomètres gagne.'
        : 'Pin the target state on the blank map. Closest pin in kilometers wins.'
    },
    {
      id: 'typerace',
      code: 'ENG-03 // KEYBOARD SPRINT',
      title: isFr ? 'Type-Race Clavier (Frappe)' : 'Keyboard Type-Race',
      desc: isFr
        ? 'Saisissez le nom de l\'État au clavier avant que la barre de frappe adverse n\'atteigne 100 %.'
        : 'Type the sovereign state name before the rival typing bar reaches 100%.'
    }
  ];
});

const opponentModes = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    {
      id: 'rival',
      code: 'OPP-01 // LEAGUE RIVAL',
      title: isFr ? 'Rival de Ligue Calibré' : 'Calibrated League Rival',
      desc: isFr ? 'Temps de réaction et précision calibrés.' : 'Calibrated reaction speed and accuracy.'
    },
    {
      id: 'local2p',
      code: 'OPP-02 // 2P SAME SCREEN',
      title: isFr ? '2 Joueurs sur 1 Écran' : '2 Players on 1 Screen',
      desc: isFr ? 'Clavier scindé (A-Z-E-R vs 1-2-3-4) ou tour par tour.' : 'Split keyboard or alternating pin drop.'
    },
    {
      id: 'ghost',
      code: 'OPP-03 // GHOST LINK',
      title: isFr ? 'Défi Fantôme par Lien' : 'Friend Ghost Link',
      desc: isFr ? 'Enregistrez vos temps et défiez un ami par lien.' : 'Record your times and challenge a friend.'
    }
  ];
});

const activeEngineLabel = computed(() => {
  const found = engineOptions.value.find((e) => e.id === combatEngine.value);
  return found ? found.code : 'ARENA';
});

const incomingGhostData = ref(null);
const duelQuestions = ref([]);
const duelRound = ref(0);
const p1Points = ref(0);
const p2Points = ref(0);
const p1RoundsWon = ref(0);
const p2RoundsWon = ref(0);
const recordedP1Log = ref([]);
const matchRoundsSummary = ref([]);

const roundElapsedMs = ref(0);
const roundResolved = ref(false);
const selectedAnswerId = ref(null);
const roundStatusBanner = ref('');
const roomLinkCopied = ref(false);

// Variables spécifiques Sniper Carte Muette
const sniperMapZoom = ref(2);
const sniperMapCenter = ref([24, 12]);
const sniperTurn = ref(1);
const sniperP1LatLng = ref(null);
const sniperP2LatLng = ref(null);
const sniperP1DistKm = ref(0);
const sniperP2DistKm = ref(0);

// Variables spécifiques Type-Race
const typeRaceInput = ref('');
const typeRaceInputRef = ref(null);
const rivalTargetTimeMs = ref(3500);

let clockInterval = null;
let opponentTimeout = null;
let countdownTimer = null;

const player1Name = computed(() => {
  const saved = localStorage.getItem('geolearn_user');
  if (saved) {
    try {
      const u = JSON.parse(saved);
      return u.name || u.username || u.pseudo || 'Operator 1';
    } catch (e) {}
  }
  return locale.value === 'fr' ? 'Joueur 1' : 'Player 1';
});

const player2Name = computed(() => {
  if (incomingGhostData.value) return incomingGhostData.value.challengerName;
  if (selectedOpponentMode.value === 'local2p') {
    return customP2Name.value.trim() || (locale.value === 'fr' ? 'Joueur 2' : 'Player 2');
  }
  const tierNames = {
    silver: 'Rival Silver',
    gold: 'Rival Gold',
    diamond: 'Rival Diamond',
    master: 'Orbital Master'
  };
  return tierNames[selectedRivalTier.value] || 'Rival Gold';
});

const currentDuelQuestion = computed(() => duelQuestions.value[duelRound.value] || null);

const remainingRoundSec = computed(() =>
  Math.max(0, roundTimeLimitSec.value - roundElapsedMs.value / 1000)
);

const rivalTypingProgressPct = computed(() =>
  Math.min(100, Math.round((roundElapsedMs.value / Math.max(800, rivalTargetTimeMs.value)) * 100))
);

const tugOfWarRatio = computed(() => {
  const total = p1Points.value + p2Points.value;
  if (total === 0) return 50;
  return Math.max(12, Math.min(88, Math.round((p1Points.value / total) * 100)));
});

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

const clearIncomingGhost = () => {
  incomingGhostData.value = null;
};

const buildDuelQuestions = (seedIsos = null) => {
  let pool = localizedCountries.value;
  if (duelSector.value === 'Europe') pool = pool.filter((c) => c.continent === 'Europe');
  else if (duelSector.value === 'Asia') pool = pool.filter((c) => c.continent === 'Asia');
  else if (duelSector.value === 'Africa') pool = pool.filter((c) => c.continent === 'Africa');
  else if (duelSector.value === 'Americas') {
    pool = pool.filter((c) => c.continent === 'North America' || c.continent === 'South America');
  }

  let targets = [];
  if (Array.isArray(seedIsos) && seedIsos.length >= 10) {
    targets = seedIsos
      .map((iso) => localizedCountries.value.find((c) => c.iso === iso.toLowerCase()))
      .filter(Boolean)
      .slice(0, 10);
  }
  if (targets.length < 10) {
    targets = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
  }

  duelQuestions.value = targets.map((target, idx) => {
    const distractors = localizedCountries.value
      .filter((c) => c.id !== target.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const options = [target, ...distractors].sort(() => 0.5 - Math.random());
    return { target, options, askFlag: idx % 2 === 0 };
  });
};

const initiateDuelSequence = () => {
  const seedIsos = incomingGhostData.value?.isos || null;
  buildDuelQuestions(seedIsos);
  duelRound.value = 0;
  p1Points.value = 0;
  p2Points.value = 0;
  p1RoundsWon.value = 0;
  p2RoundsWon.value = 0;
  recordedP1Log.value = [];
  matchRoundsSummary.value = [];
  roomLinkCopied.value = false;

  countdownValue.value = 3;
  arenaState.value = 'countdown';
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    if (countdownValue.value > 1) {
      countdownValue.value--;
    } else {
      clearInterval(countdownTimer);
      arenaState.value = 'playing';
      setupDuelRound();
    }
  }, 750);
};

const abortDuelToLobby = () => {
  if (clockInterval) clearInterval(clockInterval);
  if (opponentTimeout) clearTimeout(opponentTimeout);
  if (countdownTimer) clearInterval(countdownTimer);
  arenaState.value = 'lobby';
};

const setupDuelRound = () => {
  if (clockInterval) clearInterval(clockInterval);
  if (opponentTimeout) clearTimeout(opponentTimeout);

  roundElapsedMs.value = 0;
  roundResolved.value = false;
  selectedAnswerId.value = null;
  roundStatusBanner.value = '';
  typeRaceInput.value = '';

  sniperTurn.value = 1;
  sniperP1LatLng.value = null;
  sniperP2LatLng.value = null;
  sniperMapCenter.value = [24, 12];
  sniperMapZoom.value = 2;

  const baseByTier = { silver: 4400, gold: 3100, diamond: 2200, master: 1450 };
  const baseMs = baseByTier[selectedRivalTier.value] || 3100;
  rivalTargetTimeMs.value = incomingGhostData.value?.rounds?.[duelRound.value]?.val || Math.round(baseMs + (Math.random() * 800 - 400));

  clockInterval = setInterval(() => {
    roundElapsedMs.value += 100;
    if (roundElapsedMs.value >= roundTimeLimitSec.value * 1000 && !roundResolved.value) {
      handleRoundTimeout();
    }
  }, 100);

  if (combatEngine.value === 'typerace') {
    nextTick(() => {
      typeRaceInputRef.value?.focus();
    });
  }

  // Programmation de l'adversaire en Blitz ou Type-Race (hors Local 2P)
  if (selectedOpponentMode.value !== 'local2p' && combatEngine.value !== 'sniper') {
    opponentTimeout = setTimeout(() => {
      if (!roundResolved.value) {
        if (combatEngine.value === 'blitz') {
          const oppCorrect = incomingGhostData.value
            ? incomingGhostData.value.rounds[duelRound.value]?.ok
            : Math.random() < 0.85;
          if (oppCorrect) handleBlitzAnswer(2, currentDuelQuestion.value.target.id);
        } else if (combatEngine.value === 'typerace') {
          resolveTypeRaceRound(2);
        }
      }
    }, rivalTargetTimeMs.value);
  }
};

const advanceAfterDelay = () => {
  if (clockInterval) clearInterval(clockInterval);
  if (opponentTimeout) clearTimeout(opponentTimeout);
  setTimeout(() => {
    if (duelRound.value < 9) {
      duelRound.value++;
      setupDuelRound();
    } else {
      finishDuelMatch();
    }
  }, 1350);
};

const handleRoundTimeout = () => {
  roundResolved.value = true;
  p2Points.value += 100;
  p2RoundsWon.value++;
  recordedP1Log.value.push({ ok: false, val: roundTimeLimitSec.value * 1000 });
  matchRoundsSummary.value.push({
    iso: currentDuelQuestion.value.target.iso,
    countryName: currentDuelQuestion.value.target.name,
    capital: currentDuelQuestion.value.target.capital,
    winner: 2,
    detail: 'TIMEOUT'
  });
  roundStatusBanner.value = locale.value === 'fr' ? 'Temps écoulé : manche attribuée à P2' : 'Time expired: round awarded to P2';
  advanceAfterDelay();
};

// 1. Logique Blitz QCM
const handleBlitzAnswer = (playerNum, chosenId) => {
  if (roundResolved.value || !currentDuelQuestion.value) return;
  const target = currentDuelQuestion.value.target;
  const isCorrect = chosenId === target.id;
  const speedBonus = Math.max(20, 100 - Math.floor(roundElapsedMs.value / 100));
  roundResolved.value = true;

  let winner = 1;
  if (playerNum === 1) {
    selectedAnswerId.value = chosenId;
    recordedP1Log.value.push({ ok: isCorrect, val: Math.max(400, roundElapsedMs.value) });
    if (isCorrect) {
      winner = 1;
      p1Points.value += 100 + speedBonus;
      p1RoundsWon.value++;
      roundStatusBanner.value = `${player1Name.value} +${100 + speedBonus} PTS (${(roundElapsedMs.value / 1000).toFixed(1)}s)`;
    } else {
      winner = 2;
      p2Points.value += 100;
      p2RoundsWon.value++;
      roundStatusBanner.value = `${player2Name.value} +100 PTS`;
    }
  } else {
    recordedP1Log.value.push({ ok: false, val: roundElapsedMs.value });
    winner = isCorrect ? 2 : 1;
    if (winner === 2) {
      p2Points.value += 100 + speedBonus;
      p2RoundsWon.value++;
      roundStatusBanner.value = `${player2Name.value} +${100 + speedBonus} PTS (${(roundElapsedMs.value / 1000).toFixed(1)}s)`;
    } else {
      p1Points.value += 100;
      p1RoundsWon.value++;
      roundStatusBanner.value = `${player1Name.value} +100 PTS`;
    }
  }

  matchRoundsSummary.value.push({
    iso: target.iso,
    countryName: target.name,
    capital: target.capital,
    winner,
    detail: `${(roundElapsedMs.value / 1000).toFixed(1)}s`
  });

  advanceAfterDelay();
};

// 2. Logique Sniper Carte Muette
const onSniperMapClick = (e) => {
  if (roundResolved.value || !e?.latlng || !currentDuelQuestion.value) return;
  const target = currentDuelQuestion.value.target;

  if (selectedOpponentMode.value === 'local2p') {
    if (sniperTurn.value === 1) {
      sniperP1LatLng.value = { lat: e.latlng.lat, lng: e.latlng.lng };
      sniperTurn.value = 2;
      return;
    }
    sniperP2LatLng.value = { lat: e.latlng.lat, lng: e.latlng.lng };
  } else {
    sniperP1LatLng.value = { lat: e.latlng.lat, lng: e.latlng.lng };
    // Génère le point du Rival ou charge l'écart du Fantôme
    const scatterDeg = { silver: 14, gold: 8, diamond: 4.5, master: 2 }[selectedRivalTier.value] || 8;
    sniperP2LatLng.value = {
      lat: target.lat + (Math.random() * scatterDeg * 2 - scatterDeg),
      lng: target.lng + (Math.random() * scatterDeg * 2 - scatterDeg)
    };
  }

  roundResolved.value = true;
  sniperP1DistKm.value = computeHaversineKm(sniperP1LatLng.value.lat, sniperP1LatLng.value.lng, target.lat, target.lng);
  sniperP2DistKm.value = incomingGhostData.value?.rounds?.[duelRound.value]?.val
    ? incomingGhostData.value.rounds[duelRound.value].val
    : computeHaversineKm(sniperP2LatLng.value.lat, sniperP2LatLng.value.lng, target.lat, target.lng);

  recordedP1Log.value.push({ ok: true, val: sniperP1DistKm.value });

  const winner = sniperP1DistKm.value <= sniperP2DistKm.value ? 1 : 2;
  if (winner === 1) {
    p1Points.value += 200;
    p1RoundsWon.value++;
    roundStatusBanner.value = `${player1Name.value} (${sniperP1DistKm.value} km vs ${sniperP2DistKm.value} km)`;
  } else {
    p2Points.value += 200;
    p2RoundsWon.value++;
    roundStatusBanner.value = `${player2Name.value} (${sniperP2DistKm.value} km vs ${sniperP1DistKm.value} km)`;
  }

  matchRoundsSummary.value.push({
    iso: target.iso,
    countryName: target.name,
    capital: target.capital,
    winner,
    detail: `${sniperP1DistKm.value}km vs ${sniperP2DistKm.value}km`
  });

  advanceAfterDelay();
};

// 3. Logique Type-Race Clavier
const checkTypeRaceInput = (forceEnter = false) => {
  if (roundResolved.value || !currentDuelQuestion.value) return;
  const typed = normalizeString(typeRaceInput.value);
  const target = currentDuelQuestion.value.target;
  const aliasIso = COUNTRY_ALIASES[typed];

  if (
    typed === normalizeString(target.name_fr) ||
    typed === normalizeString(target.name_en) ||
    (aliasIso && aliasIso === target.iso)
  ) {
    resolveTypeRaceRound(1);
  } else if (forceEnter) {
    typeRaceInput.value = '';
  }
};

const resolveTypeRaceRound = (winnerNum) => {
  if (roundResolved.value || !currentDuelQuestion.value) return;
  roundResolved.value = true;
  const target = currentDuelQuestion.value.target;
  const speedBonus = Math.max(20, 100 - Math.floor(roundElapsedMs.value / 100));

  recordedP1Log.value.push({
    ok: winnerNum === 1,
    val: Math.max(500, roundElapsedMs.value)
  });

  if (winnerNum === 1) {
    p1Points.value += 120 + speedBonus;
    p1RoundsWon.value++;
    roundStatusBanner.value = `${player1Name.value} (${(roundElapsedMs.value / 1000).toFixed(1)}s)`;
  } else {
    p2Points.value += 120 + speedBonus;
    p2RoundsWon.value++;
    roundStatusBanner.value = `${player2Name.value} (${(roundElapsedMs.value / 1000).toFixed(1)}s)`;
  }

  matchRoundsSummary.value.push({
    iso: target.iso,
    countryName: target.name,
    capital: target.capital,
    winner: winnerNum,
    detail: `${(roundElapsedMs.value / 1000).toFixed(1)}s`
  });

  advanceAfterDelay();
};

const getDuelOptionClass = (id) => {
  if (!roundResolved.value) {
    return 'border-white/10 bg-white/[0.04] hover:border-sky-400 text-white';
  }
  if (id === currentDuelQuestion.value.target.id) {
    return 'border-emerald-500 bg-emerald-500/20 text-emerald-300';
  }
  if (id === selectedAnswerId.value) {
    return 'border-rose-500 bg-rose-500/20 text-rose-400';
  }
  return 'border-white/5 opacity-40 text-slate-500';
};

const finishDuelMatch = async () => {
  arenaState.value = 'finished';
  const savedUser = localStorage.getItem('geolearn_user');
  if (!savedUser) return;
  try {
    const parsed = JSON.parse(savedUser);
    const uid = parsed.id || (parsed.user && parsed.user.id);
    if (!uid) return;
    const scoreOn15 = Math.min(15, Math.round((p1RoundsWon.value / 10) * 15));
    await fetch(`${API_URL}/api/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: uid,
        mode: 'Duel 1v1',
        score: scoreOn15,
        max_score: 15
      })
    });
  } catch (e) {}
};

const copyGhostRoomLink = async () => {
  const isos = duelQuestions.value.map((q) => q.target.iso).join(',');
  const ghostPayload = recordedP1Log.value.map((r) => `${r.ok ? 1 : 0}:${r.val}`).join('|');
  const url = `${window.location.origin}/duel?seed=${isos}&engine=${combatEngine.value}&timer=${roundTimeLimitSec.value}&challenger=${encodeURIComponent(player1Name.value)}&ghost=${encodeURIComponent(ghostPayload)}`;
  try {
    await navigator.clipboard.writeText(url);
    roomLinkCopied.value = true;
  } catch (e) {}
};

// Raccourcis clavier Blitz QCM (A-Z-E-R vs 1-2-3-4 en 2P, ou 1-2-3-4 en Solo)
const onDuelKeydown = (e) => {
  if (arenaState.value !== 'playing' || roundResolved.value || combatEngine.value !== 'blitz' || !currentDuelQuestion.value) return;
  const key = e.key.toLowerCase();
  const opts = currentDuelQuestion.value.options;

  if (selectedOpponentMode.value === 'local2p') {
    const p1Idx = ['a', 'z', 'e', 'r'].indexOf(key);
    if (p1Idx !== -1 && opts[p1Idx]) {
      handleBlitzAnswer(1, opts[p1Idx].id);
      return;
    }
    const p2Idx = ['1', '2', '3', '4'].indexOf(key);
    if (p2Idx !== -1 && opts[p2Idx]) {
      handleBlitzAnswer(2, opts[p2Idx].id);
    }
  } else {
    const idx = ['1', '2', '3', '4'].indexOf(key);
    if (idx !== -1 && opts[idx]) {
      handleBlitzAnswer(1, opts[idx].id);
    }
  }
};

onMounted(() => {
  loadVectorBorders();
  renderArenaOrb3D();
  window.addEventListener('keydown', onDuelKeydown);

  const seedParam = route.query?.seed;
  const ghostParam = route.query?.ghost;
  if (typeof seedParam === 'string' && typeof ghostParam === 'string') {
    const engineParam = String(route.query?.engine || 'blitz');
    if (['blitz', 'sniper', 'typerace'].includes(engineParam)) {
      combatEngine.value = engineParam;
    }
    if (route.query?.timer) {
      roundTimeLimitSec.value = Number(route.query.timer) || 15;
    }
    const rounds = ghostParam.split('|').map((chunk) => {
      const [okStr, valStr] = chunk.split(':');
      return { ok: okStr === '1', val: Number(valStr) || 3000 };
    });
    incomingGhostData.value = {
      isos: seedParam.split(','),
      engine: combatEngine.value,
      challengerName: String(route.query?.challenger || 'Challenger'),
      rounds
    };
    selectedOpponentMode.value = 'ghost';
  }
});

onUnmounted(() => {
  if (orbAnimId) cancelAnimationFrame(orbAnimId);
  if (clockInterval) clearInterval(clockInterval);
  if (opponentTimeout) clearTimeout(opponentTimeout);
  if (countdownTimer) clearInterval(countdownTimer);
  window.removeEventListener('keydown', onDuelKeydown);
});
</script>

<style scoped>
/* Transforme le fond océanique muet en radar tactique sombre sans aucun nom de pays */
.sniper-mute-map :deep(.leaflet-tile-pane) {
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