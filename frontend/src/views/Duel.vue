<template>
  <div class="max-w-6xl mx-auto space-y-8 pb-12">

    <!-- ========================================================= -->
    <!-- EN-TÊTE DE L'ARÈNE FACE-À-FACE + SON + RETOUR             -->
    <!-- ========================================================= -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <span class="text-xs font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-1">
          ⚔️ {{ locale === 'fr' ? 'Arène Multijoueur & Temps Réel' : 'Multiplayer & Real-Time Arena' }}
        </span>
        <h2 class="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          {{ locale === 'fr' ? 'Mode Duel & Face-à-Face' : 'Head-to-Head Duel Mode' }}
        </h2>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
          {{ locale === 'fr'
            ? 'Affrontez un ami à distance, jouez à 2 sur le même écran ou défiez un rival en direct sur la carte muette et les quiz de vitesse.'
            : 'Challenge a friend remotely, play 2-player split-screen, or battle a live rival on the blank map and speed quizzes.' }}
        </p>
      </div>

      <div class="flex items-center gap-3 self-start sm:self-auto">
        <button
          type="button"
          @click="toggleSound"
          class="px-4 py-2 rounded-full text-xs sm:text-sm font-bold border transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          :class="soundEnabled
            ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700'"
        >
          <span>{{ soundEnabled ? '🔊' : '🔇' }}</span>
          <span>{{ soundEnabled ? (locale === 'fr' ? 'Sons activés' : 'Sound ON') : (locale === 'fr' ? 'Muet' : 'Muted') }}</span>
        </button>

        <button
          v-if="duelState !== 'lobby'"
          type="button"
          @click="quitDuel"
          class="px-5 py-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-2"
        >
          <span>←</span>
          <span>{{ locale === 'fr' ? 'Quitter l\'arène' : 'Leave Arena' }}</span>
        </button>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- BANNIÈRE SI UN AMI NOUS A ENVOYÉ UN CODE DE SALON DUEL    -->
    <!-- ========================================================= -->
    <div
      v-if="incomingRoom && duelState === 'lobby'"
      class="bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 text-white rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5"
    >
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-2xl bg-black/20 border border-white/25 flex items-center justify-center text-4xl shrink-0">
          ⚔️
        </div>
        <div>
          <span class="px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-black/25 text-amber-200">
            {{ locale === 'fr' ? 'Invitation Salon de Duel détectée !' : 'Duel Room Invitation Detected!' }}
          </span>
          <h3 class="text-xl sm:text-2xl font-black mt-1">
            {{ locale === 'fr'
              ? `${incomingRoom.hostName} vous attend dans l'arène (${incomingRoom.hostScore} pts en ${incomingRoom.rounds.length} manches) !`
              : `${incomingRoom.hostName} is waiting in the arena (${incomingRoom.hostScore} pts in ${incomingRoom.rounds.length} rounds)!` }}
          </h3>
          <p class="text-xs sm:text-sm text-white/90 mt-0.5">
            {{ locale === 'fr'
              ? 'Affrontez son fantôme en temps réel manche par manche sur les mêmes questions !'
              : 'Battle their live ghost round-by-round on the exact same questions!' }}
          </p>
        </div>
      </div>

      <button
        type="button"
        @click="acceptIncomingRoom"
        class="px-7 py-3.5 rounded-2xl bg-white text-rose-600 hover:bg-rose-50 font-black text-sm shadow-lg cursor-pointer transition shrink-0"
      >
        🚀 {{ locale === 'fr' ? 'Lancer le Face-à-Face' : 'Start Head-to-Head' }}
      </button>
    </div>

    <!-- ========================================================= -->
    <!-- ÉCRAN 1 : LOBBY DE CONFIGURATION DU DUEL                  -->
    <!-- ========================================================= -->
    <div v-if="duelState === 'lobby'" class="space-y-8">

      <!-- 1. Choix du Type d'Adversaire -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        <div>
          <span class="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
            {{ locale === 'fr' ? 'Étape 1 • Choisissez votre Adversaire' : 'Step 1 • Choose Your Opponent' }}
          </span>
          <h3 class="text-2xl font-black text-gray-900 dark:text-white">
            {{ locale === 'fr' ? 'Contre qui souhaitez-vous vous battre ?' : 'Who do you want to battle against?' }}
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <!-- Option A : Duel Ami à distance (Lien Synchrone / Fantôme Live) -->
          <div
            @click="opponentType = 'online-friend'"
            class="p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between"
            :class="opponentType === 'online-friend'
              ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/25 shadow-md'
              : 'border-gray-200 dark:border-gray-700 hover:border-rose-400'"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-3xl">🔗</span>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">
                  {{ locale === 'fr' ? 'À distance' : 'Remote Link' }}
                </span>
              </div>
              <h4 class="text-lg font-black text-gray-900 dark:text-white mb-1">
                {{ locale === 'fr' ? 'Défier un Ami (Salon Lien)' : 'Challenge a Friend (Room Link)' }}
              </h4>
              <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Jouez vos manches chronométrées puis envoyez le lien du salon à votre ami : il affrontera votre fantôme en direct manche par manche !'
                  : 'Play your timed rounds then send the room link to your friend: they will battle your live ghost round by round!' }}
              </p>
            </div>
          </div>

          <!-- Option B : 2 Joueurs sur le même écran (Écran Scindé / Clavier) -->
          <div
            @click="opponentType = 'local-2p'"
            class="p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between"
            :class="opponentType === 'local-2p'
              ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/25 shadow-md'
              : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-3xl">👥</span>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                  {{ locale === 'fr' ? 'Même Écran' : 'Same Screen' }}
                </span>
              </div>
              <h4 class="text-lg font-black text-gray-900 dark:text-white mb-1">
                {{ locale === 'fr' ? '2 Joueurs en Local (1v1)' : '2 Players Local (Split 1v1)' }}
              </h4>
              <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Affrontez un ami côte à côte ! Joueur 1 (touches A-Z-E-R) contre Joueur 2 (touches 1-2-3-4) ou au clic chacun son tour.'
                  : 'Battle a friend side-by-side! Player 1 (keys A-Z-E-R) vs Player 2 (keys 1-2-3-4) or alternating clicks.' }}
              </p>
            </div>
          </div>

          <!-- Option C : Rival IA en direct (4 niveaux de Ligue) -->
          <div
            @click="opponentType = 'bot'"
            class="p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between"
            :class="opponentType === 'bot'
              ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/25 shadow-md'
              : 'border-gray-200 dark:border-gray-700 hover:border-amber-400'"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <span class="text-3xl">🤖</span>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                  {{ locale === 'fr' ? 'Temps Réel' : 'Real-Time' }}
                </span>
              </div>
              <h4 class="text-lg font-black text-gray-900 dark:text-white mb-1">
                {{ locale === 'fr' ? 'Rival Automatique (Ligues)' : 'Live Rival Bot (Leagues)' }}
              </h4>
              <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Affrontez un adversaire simulé en direct (Bronze, Or, Diamant ou Légende) qui répond et place ses épingles contre vous.'
                  : 'Battle a simulated live opponent (Bronze, Gold, Diamond, or Legend) who answers and drops pins against you.' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Paramètres supplémentaires selon l'adversaire choisi -->
        <div v-if="opponentType === 'local-2p'" class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label class="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">
              🟦 {{ locale === 'fr' ? 'Pseudo du Joueur 1 (Gauche / A-Z-E-R)' : 'Player 1 Name (Left / A-Z-E-R)' }}
            </label>
            <input
              v-model="player1Name"
              type="text"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-bold text-sm"
            />
          </div>
          <div>
            <label class="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">
              🟥 {{ locale === 'fr' ? 'Pseudo du Joueur 2 (Droite / 1-2-3-4)' : 'Player 2 Name (Right / 1-2-3-4)' }}
            </label>
            <input
              v-model="player2Name"
              type="text"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-bold text-sm"
            />
          </div>
        </div>

        <div v-else-if="opponentType === 'bot'" class="flex flex-wrap items-center gap-3 pt-2">
          <span class="text-xs font-extrabold uppercase text-gray-400">
            {{ locale === 'fr' ? 'Niveau du Rival :' : 'Rival Difficulty:' }}
          </span>
          <button
            v-for="lvl in botLevels"
            :key="lvl.id"
            type="button"
            @click="selectedBotLevel = lvl.id"
            class="px-4 py-2 rounded-xl text-xs font-extrabold border transition cursor-pointer"
            :class="selectedBotLevel === lvl.id
              ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
              : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'"
          >
            {{ lvl.icon }} {{ lvl.name }}
          </button>
        </div>
      </div>

      <!-- 2. Choix de l'Épreuve du Duel -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span class="text-xs font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-1">
              {{ locale === 'fr' ? 'Étape 2 • Choisissez l\'Épreuve' : 'Step 2 • Choose the Game Mode' }}
            </span>
            <h3 class="text-2xl font-black text-gray-900 dark:text-white">
              {{ locale === 'fr' ? 'Sur quel terrain voulez-vous régler ce duel ?' : 'On which terrain do you want to settle this duel?' }}
            </h3>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-gray-400">{{ locale === 'fr' ? 'Manches :' : 'Rounds:' }}</span>
            <button
              v-for="rCount in [5, 10]"
              :key="rCount"
              type="button"
              @click="totalRounds = rCount"
              class="px-3.5 py-1.5 rounded-xl text-xs font-extrabold border cursor-pointer transition"
              :class="totalRounds === rCount
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'"
            >
              {{ rCount }} {{ locale === 'fr' ? 'manches' : 'rounds' }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <!-- Épreuve 1 : Blitz QCM Vitesse -->
          <div
            @click="duelGameType = 'blitz-qcm'"
            class="p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between"
            :class="duelGameType === 'blitz-qcm'
              ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/25 shadow-md'
              : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'"
          >
            <div>
              <div class="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl mb-4">
                ⚡
              </div>
              <h4 class="text-lg font-black text-gray-900 dark:text-white mb-1">
                {{ locale === 'fr' ? 'Blitz QCM (Vitesse Pure)' : 'Blitz QCM (Pure Speed)' }}
              </h4>
              <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Capitales, drapeaux et langues : chaque dixième de seconde compte ! Plus vous répondez vite, plus vous marquez de points (jusqu\'à 1 000 pts/manche).'
                  : 'Capitals, flags, and languages: every tenth of a second counts! Answer faster to score up to 1,000 pts per round.' }}
              </p>
            </div>
          </div>

          <!-- Épreuve 2 : Sniper Carte Muette (PinDrop Rapide) -->
          <div
            @click="duelGameType = 'map-sniper'"
            class="p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between"
            :class="duelGameType === 'map-sniper'
              ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/25 shadow-md'
              : 'border-gray-200 dark:border-gray-700 hover:border-emerald-400'"
          >
            <div>
              <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-4">
                🎯
              </div>
              <h4 class="text-lg font-black text-gray-900 dark:text-white mb-1">
                {{ locale === 'fr' ? 'Sniper Carte Muette' : 'Blank Map Sniper' }}
              </h4>
              <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Un pays et sa capitale s\'affichent : placez votre épingle le plus près possible sur la carte muette sans texte avant la fin du compte à rebours !'
                  : 'A country and its capital appear: drop your pin as close as possible on the blank map before the countdown ends!' }}
              </p>
            </div>
          </div>

          <!-- Épreuve 3 : Course au Clavier (Qui tape le pays le plus vite) -->
          <div
            @click="duelGameType = 'type-race'"
            class="p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between"
            :class="duelGameType === 'type-race'
              ? 'border-purple-500 bg-purple-50/40 dark:bg-purple-950/25 shadow-md'
              : 'border-gray-200 dark:border-gray-700 hover:border-purple-400'"
          >
            <div>
              <div class="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl mb-4">
                ⌨️
              </div>
              <h4 class="text-lg font-black text-gray-900 dark:text-white mb-1">
                {{ locale === 'fr' ? 'Sprint Clavier (Rapidité)' : 'Keyboard Type Race' }}
              </h4>
              <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Le drapeau, la capitale et la sous-région apparaissent : soyez le plus rapide à saisir le nom exact du pays au clavier !'
                  : 'The flag, capital, and subregion appear: be the fastest to type the exact country name on your keyboard!' }}
              </p>
            </div>
          </div>
        </div>

        <div class="pt-4 flex justify-center">
          <button
            type="button"
            @click="startNewDuel()"
            class="px-10 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-base shadow-xl shadow-rose-600/25 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            ⚔️ {{ locale === 'fr' ? 'Entrer dans l\'Arène et Lancer le Duel' : 'Enter Arena & Start Duel' }}
          </button>
        </div>
      </div>

    </div>

    <!-- ========================================================= -->
    <!-- ÉCRAN 2 : COMBAT EN DIRECT (TABLEAU D'AFFICHAGE + ARÈNE)  -->
    <!-- ========================================================= -->
    <div v-else-if="duelState === 'playing'" class="space-y-6">

      <!-- TABLEAU D'AFFICHAGE SCORE JOUEUR 1 VS JOUEUR 2 -->
      <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-white/10">
        <div class="grid grid-cols-3 items-center gap-4">
          <!-- Joueur 1 -->
          <div class="flex items-center gap-3 sm:gap-4">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-lg sm:text-xl shadow-md shrink-0">
              {{ player1Name.slice(0, 2).toUpperCase() }}
            </div>
            <div class="min-w-0">
              <span class="text-[10px] font-extrabold uppercase tracking-wider text-blue-300 block">
                {{ locale === 'fr' ? 'Joueur 1' : 'Player 1' }}
              </span>
              <h3 class="text-sm sm:text-lg font-black truncate">{{ player1Name }}</h3>
              <strong class="text-xl sm:text-2xl font-black text-cyan-300">{{ p1Score.toLocaleString() }} pts</strong>
            </div>
          </div>

          <!-- Centre : Manche & Chronomètre au dixième de seconde -->
          <div class="text-center space-y-1">
            <span class="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/10 text-amber-300">
              {{ locale === 'fr' ? `Manche ${currentRoundIdx + 1} / ${duelRounds.length}` : `Round ${currentRoundIdx + 1} / ${duelRounds.length}` }}
            </span>
            <div
              class="text-2xl sm:text-3xl font-black font-mono"
              :class="roundTimeRemaining <= 3 ? 'text-rose-400 animate-pulse' : 'text-white'"
            >
              ⏱️ {{ roundTimeRemaining.toFixed(1) }}s
            </div>
          </div>

          <!-- Joueur 2 (Rival / Ami / J2) -->
          <div class="flex items-center justify-end gap-3 sm:gap-4 text-right">
            <div class="min-w-0">
              <span class="text-[10px] font-extrabold uppercase tracking-wider text-rose-300 block">
                {{ opponentBadgeLabel }}
              </span>
              <h3 class="text-sm sm:text-lg font-black truncate">{{ activeOpponentName }}</h3>
              <strong class="text-xl sm:text-2xl font-black text-rose-400">{{ p2Score.toLocaleString() }} pts</strong>
            </div>
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-600 flex items-center justify-center font-black text-lg sm:text-xl shadow-md shrink-0">
              {{ activeOpponentName.slice(0, 2).toUpperCase() }}
            </div>
          </div>
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- ARÈNE A : BLITZ QCM (SIMPLE OU ÉCRAN SCINDÉ 2 JOUEURS)  -->
      <!-- ======================================================= -->
      <div v-if="duelGameType === 'blitz-qcm' && activeRoundData" class="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        
        <!-- Question centrale -->
        <div class="text-center space-y-4">
          <span class="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300">
            {{ activeRoundData.qType === 'capital'
              ? (locale === 'fr' ? '🏛️ Capitale Officielle' : '🏛️ Official Capital')
              : (locale === 'fr' ? '🚩 Reconnaissance de Drapeau' : '🚩 Flag Recognition') }}
          </span>

          <img
            :src="`https://flagcdn.com/w160/${activeRoundData.target.iso}.png`"
            class="h-20 sm:h-24 w-auto mx-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
            alt=""
          />

          <h3 class="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            <template v-if="activeRoundData.qType === 'capital'">
              {{ t('quiz.ask_capital', { country: activeRoundData.target.name }) }}
            </template>
            <template v-else>
              {{ t('quiz.ask_flag') }}
            </template>
          </h3>
        </div>

        <!-- Mode 2 Joueurs sur le même écran : 2 colonnes côte à côte -->
        <div v-if="opponentType === 'local-2p'" class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <!-- Colonne Joueur 1 (Touches A, Z, E, R) -->
          <div class="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border-2 border-blue-500/30 space-y-3">
            <div class="flex items-center justify-between text-xs font-black text-blue-700 dark:text-blue-300">
              <span>🟦 {{ player1Name }}</span>
              <span>{{ p1Answered ? (locale === 'fr' ? '✓ Répondu !' : '✓ Answered!') : (locale === 'fr' ? 'Touches : A, Z, E, R' : 'Keys: A, Z, E, R') }}</span>
            </div>
            <div class="grid grid-cols-1 gap-2.5">
              <button
                v-for="(opt, idx) in activeRoundData.options"
                :key="'p1-opt-' + opt.iso"
                type="button"
                :disabled="p1Answered || roundFinished"
                @click="submitQcmAnswer(1, opt)"
                class="p-3.5 rounded-xl border-2 font-bold text-sm flex items-center justify-between transition cursor-pointer"
                :class="getSplitButtonClass(1, opt)"
              >
                <span class="px-2 py-0.5 rounded bg-blue-600 text-white text-xs font-black">{{ ['A', 'Z', 'E', 'R'][idx] }}</span>
                <span class="truncate px-2">{{ activeRoundData.qType === 'capital' ? opt.capital : opt.name }}</span>
                <span></span>
              </button>
            </div>
          </div>

          <!-- Colonne Joueur 2 (Touches 1, 2, 3, 4) -->
          <div class="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border-2 border-rose-500/30 space-y-3">
            <div class="flex items-center justify-between text-xs font-black text-rose-700 dark:text-rose-300">
              <span>🟥 {{ player2Name }}</span>
              <span>{{ p2Answered ? (locale === 'fr' ? '✓ Répondu !' : '✓ Answered!') : (locale === 'fr' ? 'Touches : 1, 2, 3, 4' : 'Keys: 1, 2, 3, 4') }}</span>
            </div>
            <div class="grid grid-cols-1 gap-2.5">
              <button
                v-for="(opt, idx) in activeRoundData.options"
                :key="'p2-opt-' + opt.iso"
                type="button"
                :disabled="p2Answered || roundFinished"
                @click="submitQcmAnswer(2, opt)"
                class="p-3.5 rounded-xl border-2 font-bold text-sm flex items-center justify-between transition cursor-pointer"
                :class="getSplitButtonClass(2, opt)"
              >
                <span class="px-2 py-0.5 rounded bg-rose-600 text-white text-xs font-black">{{ ['1', '2', '3', '4'][idx] }}</span>
                <span class="truncate px-2">{{ activeRoundData.qType === 'capital' ? opt.capital : opt.name }}</span>
                <span></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Mode Solo contre Ami à distance ou Rival Bot -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            v-for="opt in activeRoundData.options"
            :key="'solo-opt-' + opt.iso"
            type="button"
            :disabled="p1Answered || roundFinished"
            @click="submitQcmAnswer(1, opt)"
            class="p-4 rounded-2xl border-2 font-bold text-base transition cursor-pointer"
            :class="getSplitButtonClass(1, opt)"
          >
            {{ activeRoundData.qType === 'capital' ? opt.capital : opt.name }}
          </button>
        </div>

      </div>

      <!-- ======================================================= -->
      <!-- ARÈNE B : SNIPER CARTE MUETTE (PINDROP DUEL)            -->
      <!-- ======================================================= -->
      <div v-else-if="duelGameType === 'map-sniper' && activeRoundData" class="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-7 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-50/70 dark:bg-gray-900 p-4 rounded-2xl border border-emerald-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <img :src="`https://flagcdn.com/w80/${activeRoundData.target.iso}.png`" class="h-8 w-auto rounded shadow-xs" alt="" />
            <div>
              <span class="text-xs font-bold text-gray-500 dark:text-gray-400 block">
                {{ locale === 'fr' ? 'Placez votre épingle au plus près de :' : 'Drop your pin as close as possible to:' }}
              </span>
              <strong class="text-xl font-black text-gray-900 dark:text-white">
                {{ activeRoundData.target.capital }} ({{ activeRoundData.target.name }})
              </strong>
            </div>
          </div>

          <div v-if="opponentType === 'local-2p' && !roundFinished" class="px-4 py-2 rounded-xl font-black text-xs sm:text-sm" :class="!p1Pin ? 'bg-blue-600 text-white' : 'bg-rose-600 text-white'">
            {{ !p1Pin
              ? (locale === 'fr' ? `Tour de ${player1Name} : Cliquez sur la carte` : `${player1Name}'s turn: Click on map`)
              : (locale === 'fr' ? `Tour de ${player2Name} : Cliquez sur la carte` : `${player2Name}'s turn: Click on map`) }}
          </div>
        </div>

        <div class="h-[460px] w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 relative z-0 bg-[#aad3df] dark:bg-[#1e293b]">
          <l-map
            v-model:zoom="sniperZoom"
            v-model:center="sniperCenter"
            :min-zoom="2"
            :max-zoom="7"
            :use-global-leaflet="false"
            @click="onSniperMapClick"
          >
            <l-tile-layer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}"
              :no-wrap="true"
            ></l-tile-layer>

            <!-- Épingle Joueur 1 (masquée en 2J local tant que J2 n'a pas cliqué) -->
            <l-circle-marker
              v-if="p1Pin && (opponentType !== 'local-2p' || roundFinished)"
              :lat-lng="p1Pin"
              :radius="9"
              :color="'#ffffff'"
              :weight="2.5"
              :fill-color="'#2563eb'"
              :fill-opacity="1"
            >
              <l-popup><strong>🟦 {{ player1Name }}</strong></l-popup>
            </l-circle-marker>

            <!-- Épingle Joueur 2 (affichée à la fin de la manche) -->
            <l-circle-marker
              v-if="p2Pin && roundFinished"
              :lat-lng="p2Pin"
              :radius="9"
              :color="'#ffffff'"
              :weight="2.5"
              :fill-color="'#e11d48'"
              :fill-opacity="1"
            >
              <l-popup><strong>🟥 {{ activeOpponentName }}</strong></l-popup>
            </l-circle-marker>

            <!-- Cible réelle (affichée à la fin de la manche) -->
            <l-circle-marker
              v-if="roundFinished"
              :lat-lng="[activeRoundData.target.lat, activeRoundData.target.lng]"
              :radius="11"
              :color="'#ffffff'"
              :weight="3"
              :fill-color="'#10b981'"
              :fill-opacity="1"
            >
              <l-popup><strong>🎯 {{ activeRoundData.target.name }}</strong></l-popup>
            </l-circle-marker>

            <l-polyline
              v-if="roundFinished && p1Pin"
              :lat-lngs="[p1Pin, [activeRoundData.target.lat, activeRoundData.target.lng]]"
              :color="'#2563eb'"
              :weight="2.5"
              :options="{ dashArray: '6, 6' }"
            ></l-polyline>

            <l-polyline
              v-if="roundFinished && p2Pin"
              :lat-lngs="[p2Pin, [activeRoundData.target.lat, activeRoundData.target.lng]]"
              :color="'#e11d48'"
              :weight="2.5"
              :options="{ dashArray: '6, 6' }"
            ></l-polyline>
          </l-map>
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- ARÈNE C : SPRINT CLAVIER (QUI TAPE LE PAYS EN PREMIER)  -->
      <!-- ======================================================= -->
      <div v-else-if="duelGameType === 'type-race' && activeRoundData" class="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6 text-center">
        <span class="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
          ⌨️ {{ locale === 'fr' ? 'Sprint Clavier • Tapez le nom du pays !' : 'Type Race • Type the country name!' }}
        </span>

        <img
          :src="`https://flagcdn.com/w160/${activeRoundData.target.iso}.png`"
          class="h-24 w-auto mx-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700"
          alt=""
        />

        <div class="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-300">
          <span class="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-700">🏛️ {{ t('common.capital') }} : {{ activeRoundData.target.capital }}</span>
          <span class="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-700">🌍 {{ activeRoundData.target.subregion }}</span>
          <span class="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-700">👥 {{ activeRoundData.target.population }}</span>
        </div>

        <div class="max-w-lg mx-auto">
          <input
            ref="typeRaceInputRef"
            v-model="typeRaceInput"
            @input="checkTypeRaceInput"
            :disabled="roundFinished"
            type="text"
            :placeholder="locale === 'fr' ? 'Tapez le pays le plus vite possible...' : 'Type the country as fast as possible...'"
            autocomplete="off"
            spellcheck="false"
            class="w-full px-5 py-4 rounded-2xl border-2 border-purple-400 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-lg font-black text-center focus:outline-none focus:border-purple-600"
          />
        </div>
      </div>

      <!-- BANDEAU DE RÉSULTAT DE LA MANCHE + BOUTON MANCHE SUIVANTE -->
      <div
        v-if="roundFinished"
        class="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-md border-2 border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div class="space-y-1 text-center sm:text-left">
          <span class="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
            {{ roundSummaryTitle }}
          </span>
          <p class="text-sm font-bold text-gray-700 dark:text-gray-200">
            {{ roundSummaryDetail }}
          </p>
        </div>

        <button
          type="button"
          @click="advanceToNextRound"
          class="px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md cursor-pointer transition shrink-0"
        >
          {{ currentRoundIdx < duelRounds.length - 1
            ? (locale === 'fr' ? `Manche suivante (${currentRoundIdx + 2}/${duelRounds.length}) →` : `Next Round (${currentRoundIdx + 2}/${duelRounds.length}) →`)
            : (locale === 'fr' ? 'Voir le Podium du Duel 🏆' : 'See Duel Podium 🏆') }}
        </button>
      </div>

    </div>

    <!-- ========================================================= -->
    <!-- ÉCRAN 3 : BILAN FINAL DU DUEL & PARTAGE DU LIEN SALON     -->
    <!-- ========================================================= -->
    <div v-else-if="duelState === 'finished'" class="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-10 shadow-md border border-gray-100 dark:border-gray-700 text-center space-y-8">
      <div class="space-y-2">
        <div class="text-6xl mb-2">{{ finalWinnerBanner.icon }}</div>
        <span class="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
          {{ locale === 'fr' ? 'Duel Terminé' : 'Duel Complete' }}
        </span>
        <h3 class="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
          {{ finalWinnerBanner.title }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ finalWinnerBanner.subtitle }}
        </p>
      </div>

      <!-- Cartes comparatives des 2 joueurs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <div class="p-6 rounded-3xl border-2" :class="p1Score >= p2Score ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/30' : 'border-gray-200 dark:border-gray-700'">
          <span class="text-xs font-extrabold uppercase text-blue-600 dark:text-blue-400 block mb-1">🟦 {{ player1Name }}</span>
          <strong class="text-3xl font-black text-gray-900 dark:text-white block">{{ p1Score.toLocaleString() }} pts</strong>
        </div>

        <div class="p-6 rounded-3xl border-2" :class="p2Score > p1Score ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/30' : 'border-gray-200 dark:border-gray-700'">
          <span class="text-xs font-extrabold uppercase text-rose-600 dark:text-rose-400 block mb-1">🟥 {{ activeOpponentName }}</span>
          <strong class="text-3xl font-black text-gray-900 dark:text-white block">{{ p2Score.toLocaleString() }} pts</strong>
        </div>
      </div>

      <!-- Bouton principal pour copier le lien du Salon et défier un ami sur ses temps exacts -->
      <div class="max-w-xl mx-auto p-6 rounded-3xl bg-gradient-to-r from-rose-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-900 border border-rose-200 dark:border-gray-700 space-y-4">
        <h4 class="text-lg font-black text-gray-900 dark:text-white">
          🔗 {{ locale === 'fr' ? 'Envoyez ce Salon à un ami !' : 'Send this Duel Room to a friend!' }}
        </h4>
        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
          {{ locale === 'fr'
            ? 'Votre ami jouera exactement les mêmes manches et verra vos temps de réponse en direct manche par manche !'
            : 'Your friend will play the exact same rounds and battle your live response times round by round!' }}
        </p>
        <button
          type="button"
          @click="copyDuelRoomLink"
          class="px-7 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-md cursor-pointer transition"
        >
          {{ roomLinkCopied
            ? (locale === 'fr' ? '✓ Lien du Salon copié dans le presse-papiers !' : '✓ Room Link copied to clipboard!')
            : (locale === 'fr' ? '📋 Copier le lien du Salon de Duel' : '📋 Copy Duel Room Link') }}
        </button>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          @click="startNewDuel()"
          class="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-md cursor-pointer transition"
        >
          ↻ {{ locale === 'fr' ? 'Revanche immédiate' : 'Immediate Rematch' }}
        </button>
        <button
          type="button"
          @click="quitDuel"
          class="px-6 py-3.5 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold text-sm cursor-pointer transition"
        >
          {{ locale === 'fr' ? 'Retour au Lobby' : 'Back to Lobby' }}
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ALL_COUNTRIES from '../data/countries.js';

import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LPopup, LCircleMarker, LPolyline } from "@vue-leaflet/vue-leaflet";
import L from 'leaflet';

const { t, locale } = useI18n();
const route = useRoute();
const API_URL = 'https://geolearn-backend-bj65.onrender.com';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// =========================================================
// SYNTHÉTISEUR AUDIO
// =========================================================
const soundEnabled = ref(localStorage.getItem('geolearn_sound') !== 'false');
let audioCtx = null;

const getAudioContext = () => {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
};

const playSound = (type) => {
  if (!soundEnabled.value) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    if (type === 'correct') {
      [523.25, 659.25].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.12, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.22);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(now + idx * 0.08); osc.stop(now + idx * 0.08 + 0.23);
      });
    } else if (type === 'wrong') {
      [220, 185].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.12, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.25);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(now + idx * 0.1); osc.stop(now + idx * 0.1 + 0.26);
      });
    } else if (type === 'victory') {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.14, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.32);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(now + idx * 0.09); osc.stop(now + idx * 0.09 + 0.34);
      });
    }
  } catch (e) {}
};

const toggleSound = () => {
  soundEnabled.value = !soundEnabled.value;
  localStorage.setItem('geolearn_sound', soundEnabled.value ? 'true' : 'false');
  if (soundEnabled.value) playSound('correct');
};

// =========================================================
// PAYS LOCALISÉS & UTILITAIRES GÉOGRAPHIQUES
// =========================================================
const normalizeStr = (str = '') =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[-']/g, " ").toLowerCase().trim();

const localizedCountries = computed(() => {
  const isEn = locale.value === 'en';
  return ALL_COUNTRIES.map((c, idx) => ({
    ...c,
    id: c.id ?? idx + 1,
    name: isEn ? c.name_en : c.name_fr,
    capital: isEn ? c.capital_en : c.capital_fr,
    subregion: isEn ? c.subregion_en : c.subregion_fr,
    population: isEn ? c.population_en : c.population_fr
  }));
});

const getCountryByIso = (iso) => localizedCountries.value.find(c => c.iso === iso);

const computeDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = d => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.min(1, Math.sqrt(a))));
};

// =========================================================
// ÉTAT DU LOBBY ET DES JOUEURS
// =========================================================
const duelState = ref('lobby'); // 'lobby' | 'playing' | 'finished'
const opponentType = ref('bot'); // 'online-friend' | 'local-2p' | 'bot'
const duelGameType = ref('blitz-qcm'); // 'blitz-qcm' | 'map-sniper' | 'type-race'
const totalRounds = ref(5);

const player1Name = ref('Joueur 1');
const player2Name = ref('Joueur 2');
const selectedBotLevel = ref('gold');

const botLevels = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'bronze', icon: '🥉', name: 'Bot Bronze', accuracy: 0.6, avgTime: 6.5, kmSpread: 1800 },
    { id: 'gold', icon: '🥇', name: isFr ? 'Bot Or' : 'Gold Bot', accuracy: 0.8, avgTime: 4.2, kmSpread: 850 },
    { id: 'diamond', icon: '💎', name: isFr ? 'Bot Diamant' : 'Diamond Bot', accuracy: 0.92, avgTime: 2.6, kmSpread: 350 },
    { id: 'legend', icon: '👑', name: isFr ? 'Légende GeoLearn' : 'GeoLearn Legend', accuracy: 0.98, avgTime: 1.6, kmSpread: 120 }
  ];
});

const currentBotConfig = computed(() =>
  botLevels.value.find(b => b.id === selectedBotLevel.value) || botLevels.value[1]
);

const incomingRoom = ref(null);
const activeGhostRoom = ref(null);
const roomLinkCopied = ref(false);

const activeOpponentName = computed(() => {
  if (activeGhostRoom.value) return activeGhostRoom.value.hostName;
  if (opponentType.value === 'local-2p') return player2Name.value || 'Joueur 2';
  if (opponentType.value === 'online-friend') return locale.value === 'fr' ? 'Fantôme Ami (Enregistrement)' : 'Friend Ghost (Recording)';
  return currentBotConfig.value.name;
});

const opponentBadgeLabel = computed(() => {
  if (activeGhostRoom.value) return locale.value === 'fr' ? 'Fantôme Ami' : 'Friend Ghost';
  if (opponentType.value === 'local-2p') return locale.value === 'fr' ? 'Joueur 2' : 'Player 2';
  return 'Rival Live';
});

// =========================================================
// LOGIQUE DE PARTIE EN DIRECT (MANCHES, TIMERS & SCORES)
// =========================================================
const duelRounds = ref([]);
const currentRoundIdx = ref(0);
const p1Score = ref(0);
const p2Score = ref(0);
const p1RoundHistory = ref([]);

const roundMaxSeconds = ref(12);
const roundTimeRemaining = ref(12);
const roundFinished = ref(false);
const roundSummaryTitle = ref('');
const roundSummaryDetail = ref('');

const p1Answered = ref(false);
const p2Answered = ref(false);
const p1ChoiceIso = ref(null);
const p2ChoiceIso = ref(null);
const p1Pin = ref(null);
const p2Pin = ref(null);

const sniperZoom = ref(2);
const sniperCenter = ref([20, 10]);
const typeRaceInput = ref('');
const typeRaceInputRef = ref(null);

let roundInterval = null;
let botTimeout = null;

const activeRoundData = computed(() => duelRounds.value[currentRoundIdx.value] || null);

const clearTimers = () => {
  if (roundInterval) {
    clearInterval(roundInterval);
    roundInterval = null;
  }
  if (botTimeout) {
    clearTimeout(botTimeout);
    botTimeout = null;
  }
};

const buildDuelRounds = (count, customIsos = null) => {
  const pool = [...localizedCountries.value];
  const chosenTargets = [];

  if (customIsos && customIsos.length > 0) {
    for (const iso of customIsos) {
      const found = getCountryByIso(iso);
      if (found) chosenTargets.push(found);
    }
  } else {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    chosenTargets.push(...shuffled.slice(0, count));
  }

  return chosenTargets.map((target, idx) => {
    const distractors = pool
      .filter(c => c.iso !== target.iso)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const options = [target, ...distractors].sort(() => 0.5 - Math.random());
    return {
      target,
      options,
      qType: idx % 2 === 0 ? 'capital' : 'flag'
    };
  });
};

const startNewDuel = (customRoom = null) => {
  clearTimers();
  roomLinkCopied.value = false;

  if (customRoom) {
    activeGhostRoom.value = customRoom;
    duelGameType.value = customRoom.gameType;
    totalRounds.value = customRoom.rounds.length;
    duelRounds.value = buildDuelRounds(
      customRoom.rounds.length,
      customRoom.rounds.map(r => r.iso)
    );
  } else {
    activeGhostRoom.value = null;
    duelRounds.value = buildDuelRounds(totalRounds.value);
  }

  currentRoundIdx.value = 0;
  p1Score.value = 0;
  p2Score.value = 0;
  p1RoundHistory.value = [];
  duelState.value = 'playing';
  setupCurrentRound();
};

const acceptIncomingRoom = () => {
  if (!incomingRoom.value) return;
  startNewDuel(incomingRoom.value);
};

const setupCurrentRound = async () => {
  clearTimers();
  roundFinished.value = false;
  p1Answered.value = false;
  p2Answered.value = false;
  p1ChoiceIso.value = null;
  p2ChoiceIso.value = null;
  p1Pin.value = null;
  p2Pin.value = null;
  typeRaceInput.value = '';
  roundSummaryTitle.value = '';
  roundSummaryDetail.value = '';
  sniperZoom.value = 2;
  sniperCenter.value = [20, 10];

  roundMaxSeconds.value = duelGameType.value === 'map-sniper' ? 15 : 10;
  roundTimeRemaining.value = roundMaxSeconds.value;

  if (duelGameType.value === 'type-race') {
    await nextTick();
    if (typeRaceInputRef.value) typeRaceInputRef.value.focus();
  }

  // Programmation de la réponse du Fantôme Ami ou du Rival Bot
  if (opponentType.value !== 'local-2p') {
    scheduleOpponentAction();
  }

  roundInterval = setInterval(() => {
    if (roundTimeRemaining.value > 0.1) {
      roundTimeRemaining.value = Math.max(0, roundTimeRemaining.value - 0.1);
    } else {
      roundTimeRemaining.value = 0;
      finalizeRound();
    }
  }, 100);
};

const scheduleOpponentAction = () => {
  const rd = activeRoundData.value;
  if (!rd) return;

  // Si on affronte le Fantôme enregistré d'un ami
  if (activeGhostRoom.value && activeGhostRoom.value.rounds[currentRoundIdx.value]) {
    const ghostMove = activeGhostRoom.value.rounds[currentRoundIdx.value];
    const delayMs = Math.min((roundMaxSeconds.value - 0.3) * 1000, Math.max(600, (ghostMove.timeSpent || 3) * 1000));
    botTimeout = setTimeout(() => {
      if (roundFinished.value) return;
      p2Answered.value = true;
      p2Score.value += Number(ghostMove.pts || 0);
      if (duelGameType.value === 'map-sniper' && ghostMove.pin) {
        p2Pin.value = ghostMove.pin;
      } else {
        p2ChoiceIso.value = ghostMove.pts > 0 ? rd.target.iso : rd.options[0]?.iso;
      }
      if (p1Answered.value) finalizeRound();
    }, delayMs);
    return;
  }

  // Si on crée un salon pour un ami, pas de bot
  if (opponentType.value === 'online-friend') {
    p2Answered.value = true;
    return;
  }

  // Sinon, simulation en temps réel du Rival Bot
  const bot = currentBotConfig.value;
  const reactionSec = Math.max(1.1, bot.avgTime + (Math.random() * 2 - 1));
  botTimeout = setTimeout(() => {
    if (roundFinished.value) return;
    p2Answered.value = true;
    const isSuccess = Math.random() <= bot.accuracy;

    if (duelGameType.value === 'map-sniper') {
      const latOffset = ((Math.random() - 0.5) * bot.kmSpread) / 111;
      const lngOffset = ((Math.random() - 0.5) * bot.kmSpread) / 111;
      p2Pin.value = [rd.target.lat + latOffset, rd.target.lng + lngOffset];
      const dist = computeDistanceKm(p2Pin.value[0], p2Pin.value[1], rd.target.lat, rd.target.lng);
      const pts = Math.max(0, Math.round(1000 * Math.exp(-dist / 1800)));
      p2Score.value += pts;
    } else if (duelGameType.value === 'type-race') {
      if (isSuccess && !p1Answered.value) {
        const pts = Math.round(500 + (roundTimeRemaining.value / roundMaxSeconds.value) * 500);
        p2Score.value += pts;
        finalizeRound(2, pts);
        return;
      }
    } else {
      if (isSuccess) {
        p2ChoiceIso.value = rd.target.iso;
        const pts = Math.round(500 + (roundTimeRemaining.value / roundMaxSeconds.value) * 500);
        p2Score.value += pts;
      } else {
        const wrongOpt = rd.options.find(o => o.iso !== rd.target.iso) || rd.options[0];
        p2ChoiceIso.value = wrongOpt.iso;
      }
    }

    if (p1Answered.value) finalizeRound();
  }, reactionSec * 1000);
};

// Soumission d'une réponse en Blitz QCM
const submitQcmAnswer = (playerNum, chosenOption) => {
  if (roundFinished.value || !activeRoundData.value) return;
  const target = activeRoundData.value.target;
  const isCorrect = chosenOption.iso === target.iso;
  const timeSpent = Number((roundMaxSeconds.value - roundTimeRemaining.value).toFixed(1));
  const earnedPts = isCorrect
    ? Math.round(500 + (roundTimeRemaining.value / roundMaxSeconds.value) * 500)
    : 0;

  if (playerNum === 1 && !p1Answered.value) {
    p1Answered.value = true;
    p1ChoiceIso.value = chosenOption.iso;
    p1Score.value += earnedPts;
    p1RoundHistory.value[currentRoundIdx.value] = {
      iso: target.iso,
      pts: earnedPts,
      timeSpent
    };
    playSound(isCorrect ? 'correct' : 'wrong');
  } else if (playerNum === 2 && !p2Answered.value) {
    p2Answered.value = true;
    p2ChoiceIso.value = chosenOption.iso;
    p2Score.value += earnedPts;
    playSound(isCorrect ? 'correct' : 'wrong');
  }

  if (p1Answered.value && (p2Answered.value || opponentType.value === 'online-friend')) {
    finalizeRound();
  }
};

const getSplitButtonClass = (playerNum, opt) => {
  const rd = activeRoundData.value;
  if (!rd) return '';
  const answered = playerNum === 1 ? p1Answered.value : p2Answered.value;
  const choiceIso = playerNum === 1 ? p1ChoiceIso.value : p2ChoiceIso.value;

  if (!roundFinished.value) {
    if (!answered) {
      return 'border-gray-200 dark:border-gray-700 hover:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800';
    }
    if (choiceIso === opt.iso) {
      return 'border-blue-600 bg-blue-600 text-white';
    }
    return 'opacity-45 border-gray-200 dark:border-gray-700 text-gray-400';
  }

  if (opt.iso === rd.target.iso) {
    return 'bg-emerald-500 border-emerald-500 text-white shadow-sm';
  }
  if (choiceIso === opt.iso && opt.iso !== rd.target.iso) {
    return 'bg-rose-500 border-rose-500 text-white';
  }
  return 'opacity-40 border-gray-200 dark:border-gray-700 text-gray-400';
};

// Clic sur la carte en mode Sniper Carte Muette
const onSniperMapClick = (e) => {
  if (roundFinished.value || !e?.latlng || !activeRoundData.value) return;
  const clicked = [e.latlng.lat, e.latlng.lng];
  const target = activeRoundData.value.target;
  const distKm = computeDistanceKm(clicked[0], clicked[1], target.lat, target.lng);
  const pts = Math.max(0, Math.round(1000 * Math.exp(-distKm / 1800)));
  const timeSpent = Number((roundMaxSeconds.value - roundTimeRemaining.value).toFixed(1));

  if (!p1Pin.value) {
    p1Pin.value = clicked;
    p1Answered.value = true;
    p1Score.value += pts;
    p1RoundHistory.value[currentRoundIdx.value] = {
      iso: target.iso,
      pts,
      timeSpent,
      pin: clicked
    };
    playSound('correct');

    if (opponentType.value !== 'local-2p' && p2Answered.value) {
      finalizeRound();
    }
  } else if (opponentType.value === 'local-2p' && !p2Pin.value) {
    p2Pin.value = clicked;
    p2Answered.value = true;
    p2Score.value += pts;
    playSound('correct');
    finalizeRound();
  }
};

// Saisie clavier en mode Type Race
const checkTypeRaceInput = () => {
  if (roundFinished.value || !activeRoundData.value) return;
  const typed = normalizeStr(typeRaceInput.value);
  if (!typed) return;

  const target = activeRoundData.value.target;
  const validNames = [
    normalizeStr(target.name_fr),
    normalizeStr(target.name_en),
    ...(target.aliases || []).map(a => normalizeStr(a))
  ];

  if (validNames.includes(typed)) {
    p1Answered.value = true;
    const pts = Math.round(500 + (roundTimeRemaining.value / roundMaxSeconds.value) * 500);
    const timeSpent = Number((roundMaxSeconds.value - roundTimeRemaining.value).toFixed(1));
    p1Score.value += pts;
    p1RoundHistory.value[currentRoundIdx.value] = {
      iso: target.iso,
      pts,
      timeSpent
    };
    playSound('correct');
    finalizeRound(1, pts);
  }
};

const finalizeRound = (raceWinner = null, racePts = 0) => {
  if (roundFinished.value || !activeRoundData.value) return;
  clearTimers();
  roundFinished.value = true;

  const target = activeRoundData.value.target;
  if (!p1RoundHistory.value[currentRoundIdx.value]) {
    p1RoundHistory.value[currentRoundIdx.value] = {
      iso: target.iso,
      pts: 0,
      timeSpent: roundMaxSeconds.value
    };
  }

  const isFr = locale.value === 'fr';
  if (duelGameType.value === 'map-sniper') {
    const d1 = p1Pin.value ? computeDistanceKm(p1Pin.value[0], p1Pin.value[1], target.lat, target.lng) : null;
    const d2 = p2Pin.value ? computeDistanceKm(p2Pin.value[0], p2Pin.value[1], target.lat, target.lng) : null;
    roundSummaryTitle.value = `${target.capital} (${target.name})`;
    roundSummaryDetail.value = isFr
      ? `${player1Name} : ${d1 !== null ? d1 + ' km' : 'Non placé'} • ${activeOpponentName.value} : ${d2 !== null ? d2 + ' km' : '—'}`
      : `${player1Name}: ${d1 !== null ? d1 + ' km' : 'No pin'} • ${activeOpponentName.value}: ${d2 !== null ? d2 + ' km' : '—'}`;
  } else if (duelGameType.value === 'type-race') {
    roundSummaryTitle.value = isFr ? `Réponse : ${target.name}` : `Answer: ${target.name}`;
    roundSummaryDetail.value =
      raceWinner === 1
        ? (isFr ? `⚡ ${player1Name} a tapé le pays en premier (+${racePts} pts) !` : `⚡ ${player1Name} typed it first (+${racePts} pts)!`)
        : raceWinner === 2
          ? (isFr ? `⚡ ${activeOpponentName.value} a été plus rapide (+${racePts} pts) !` : `⚡ ${activeOpponentName.value} was faster (+${racePts} pts)!`)
          : (isFr ? 'Temps écoulé !' : 'Time is up!');
  } else {
    const correctLabel = activeRoundData.value.qType === 'capital' ? target.capital : target.name;
    roundSummaryTitle.value = isFr ? `Bonne réponse : ${correctLabel}` : `Correct answer: ${correctLabel}`;
    roundSummaryDetail.value = isFr
      ? `Score cumulé : ${player1Name} (${p1Score.value} pts) vs ${activeOpponentName.value} (${p2Score.value} pts)`
      : `Total score: ${player1Name} (${p1Score.value} pts) vs ${activeOpponentName.value} (${p2Score.value} pts)`;
  }
};

const saveDuelScore = async () => {
  const savedUser = localStorage.getItem('geolearn_user');
  if (!savedUser) return;
  try {
    const parsed = JSON.parse(savedUser);
    const userId = parsed.id || (parsed.user && parsed.user.id);
    if (!userId) return;
    const normalizedScore = Math.round(p1Score.value / 250);
    await fetch(`${API_URL}/api/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        mode: 'Duel Face-à-Face',
        score: normalizedScore,
        max_score: duelRounds.value.length * 4
      })
    });
  } catch (e) {}
};

const advanceToNextRound = () => {
  if (currentRoundIdx.value < duelRounds.value.length - 1) {
    currentRoundIdx.value++;
    setupCurrentRound();
  } else {
    duelState.value = 'finished';
    playSound('victory');
    saveDuelScore();
  }
};

const quitDuel = () => {
  clearTimers();
  duelState.value = 'lobby';
};

const finalWinnerBanner = computed(() => {
  const isFr = locale.value === 'fr';
  if (p1Score.value > p2Score.value) {
    return {
      icon: '🏆',
      title: isFr ? `Victoire de ${player1Name.value} !` : `${player1Name.value} Wins!`,
      subtitle: isFr
        ? `Domination de l'arène avec ${p1Score.value.toLocaleString()} pts contre ${p2Score.value.toLocaleString()} pts !`
        : `Arena victory with ${p1Score.value.toLocaleString()} pts vs ${p2Score.value.toLocaleString()} pts!`
    };
  }
  if (p2Score.value > p1Score.value) {
    return {
      icon: '⚔️',
      title: isFr ? `Victoire de ${activeOpponentName.value} !` : `${activeOpponentName.value} Wins!`,
      subtitle: isFr
        ? `${activeOpponentName.value} l'emporte ${p2Score.value.toLocaleString()} pts à ${p1Score.value.toLocaleString()} pts. Prenez votre revanche !`
        : `${activeOpponentName.value} wins ${p2Score.value.toLocaleString()} pts to ${p1Score.value.toLocaleString()} pts. Take your revenge!`
    };
  }
  return {
    icon: '🤝',
    title: isFr ? 'Égalité parfaite !' : 'Perfect Tie!',
    subtitle: isFr ? 'Aucun joueur n\'a cédé un seul point d\'écart.' : 'Neither player gave up an inch.'
  };
});

// Copie du lien de Salon de Duel avec les temps et scores manche par manche
const copyDuelRoomLink = async () => {
  try {
    const payload = {
      hostName: player1Name.value,
      hostScore: p1Score.value,
      gameType: duelGameType.value,
      rounds: p1RoundHistory.value
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(payload)));
    const link = `${window.location.origin}/duel?room=${encoded}`;
    await navigator.clipboard.writeText(link);
    roomLinkCopied.value = true;
    setTimeout(() => { roomLinkCopied.value = false; }, 4000);
  } catch (e) {}
};

// Raccourcis clavier A-Z-E-R (Joueur 1) et 1-2-3-4 (Joueur 2) pour le mode Blitz QCM
const handleDuelKeydown = (e) => {
  if (duelState.value !== 'playing' || duelGameType.value !== 'blitz-qcm' || roundFinished.value) return;
  const rd = activeRoundData.value;
  if (!rd) return;

  const key = e.key.toUpperCase();
  const p1Keys = ['A', 'Z', 'E', 'R'];
  const p2Keys = ['1', '2', '3', '4'];

  const idx1 = p1Keys.indexOf(key);
  if (idx1 !== -1 && rd.options[idx1] && !p1Answered.value) {
    e.preventDefault();
    submitQcmAnswer(1, rd.options[idx1]);
  }

  if (opponentType.value === 'local-2p') {
    const idx2 = p2Keys.indexOf(key);
    if (idx2 !== -1 && rd.options[idx2] && !p2Answered.value) {
      e.preventDefault();
      submitQcmAnswer(2, rd.options[idx2]);
    }
  }
};

onMounted(() => {
  const savedUser = localStorage.getItem('geolearn_user');
  if (savedUser) {
    try {
      const p = JSON.parse(savedUser);
      player1Name.value = p.username || p.name || p.pseudo || 'Joueur 1';
    } catch (e) {}
  }

  if (route.query.room) {
    try {
      const decoded = JSON.parse(decodeURIComponent(atob(String(route.query.room))));
      if (decoded && Array.isArray(decoded.rounds) && decoded.rounds.length > 0) {
        incomingRoom.value = decoded;
      }
    } catch (e) {}
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleDuelKeydown);
  }
});

onUnmounted(() => {
  clearTimers();
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleDuelKeydown);
  }
});
</script>

<style scoped>
.leaflet-container {
  z-index: 10;
  background-color: #aad3df !important;
  cursor: crosshair !important;
}
:global(.dark) .leaflet-container,
:global(body.dark-mode) .leaflet-container {
  background-color: #1e293b !important;
}
</style>