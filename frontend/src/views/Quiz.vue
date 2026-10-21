<template>
  <div class="max-w-6xl mx-auto space-y-8 pb-12">
    
    <!-- EN-TÊTE + BOUTON SON + BOUTON RETOUR -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-500 mb-2">
          {{ t('quiz.title') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400 transition-colors duration-500">
          {{ t('quiz.subtitle') }}
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
          v-if="currentMode !== 'menu'" 
          @click="retourMenu"
          class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-5 py-2 rounded-full font-medium transition-colors flex items-center gap-2 cursor-pointer"
        >
          <i class="fas fa-arrow-left"></i> {{ t('quiz.back') }}
        </button>
      </div>
    </div>

    <!-- BANNIÈRE SI UN AMI NOUS A ENVOYÉ UN LIEN DE DUEL QCM -->
    <div
      v-if="duelChallenge && currentMode === 'menu'"
      class="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-3xl p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <div class="flex items-center gap-4">
        <div class="text-4xl">⚔️</div>
        <div>
          <span class="text-xs font-extrabold uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full">
            {{ locale === 'fr' ? 'Duel QCM reçu !' : 'Quiz Duel Received!' }}
          </span>
          <h3 class="text-xl font-black mt-1">
            {{ locale === 'fr'
              ? `${duelChallenge.from} vous défie de battre son score de ${duelChallenge.score}/15 !`
              : `${duelChallenge.from} challenges you to beat their score of ${duelChallenge.score}/15!` }}
          </h3>
        </div>
      </div>
      <button
        type="button"
        @click="startDuelQcm"
        class="px-6 py-3 rounded-xl bg-white text-orange-600 font-black text-sm hover:bg-orange-50 transition shadow cursor-pointer shrink-0"
      >
        🚀 {{ locale === 'fr' ? 'Relever le Duel' : 'Accept Duel' }}
      </button>
    </div>

    <!-- ========================================================== -->
    <!-- MENU PRINCIPAL : LES 9 MODES DE JEU + PASSERELLE GEOGUESSR -->
    <!-- ========================================================== -->
    <div v-if="currentMode === 'menu'" class="space-y-8 mt-6">
      
      <!-- Bannière mise en avant : Pays Mystère du Jour + GeoGuessr PinDrop -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Pays Mystère du Jour (Style Worldle) -->
        <div
          @click="lancerMode('mystery')"
          class="group bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white p-6 sm:p-7 rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
        >
          <div class="flex items-center justify-between mb-4">
            <span class="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-black/20 text-white">
              🔥 {{ locale === 'fr' ? 'Défi Quotidien & Infini' : 'Daily & Infinite Challenge' }}
            </span>
            <span class="text-3xl group-hover:scale-110 transition-transform">🧭</span>
          </div>
          <div>
            <h3 class="text-2xl font-black mb-1.5">
              {{ locale === 'fr' ? 'Le Pays Mystère (Worldle)' : 'Mystery Country (Worldle)' }}
            </h3>
            <p class="text-xs sm:text-sm text-white/90 leading-relaxed">
              {{ locale === 'fr'
                ? '6 essais pour deviner le pays secret grâce à la distance en kilomètres, la flèche de boussole (🧭 ↗️) et le pourcentage de proximité !'
                : '6 tries to guess the secret country using distance in km, compass direction (🧭 ↗️), and proximity percentage!' }}
            </p>
          </div>
          <div class="mt-5 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-black">
            <span>{{ locale === 'fr' ? 'Partageable sur Discord / WhatsApp' : 'Shareable on Discord / WhatsApp' }}</span>
            <span>{{ locale === 'fr' ? 'Jouer maintenant →' : 'Play now →' }}</span>
          </div>
        </div>

        <!-- Passerelle directe vers GeoGuessr 360° & Photo -->
        <router-link
          to="/geoguessr"
          class="group bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-lg border border-cyan-400/30 hover:border-cyan-400 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between relative overflow-hidden"
        >
          <div class="flex items-center justify-between mb-4">
            <span class="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
              🌐 {{ locale === 'fr' ? 'Exploration 360° & Photo' : '360° & Photo Exploration' }}
            </span>
            <span class="text-3xl group-hover:scale-110 transition-transform">📍</span>
          </div>
          <div>
            <h3 class="text-2xl font-black mb-1.5">
              GeoLearn PinDrop (25 000 pts)
            </h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {{ locale === 'fr'
                ? 'Explorez un panorama 360° ou une photo géolocalisée tirée en direct dans le monde et placez votre épingle sur la carte !'
                : 'Explore a live 360° panorama or geotagged photo around the world and drop your pin on the map!' }}
            </p>
          </div>
          <div class="mt-5 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-black text-cyan-300">
            <span>5 {{ locale === 'fr' ? 'manches • Score sur 25 000' : 'rounds • Score out of 25,000' }}</span>
            <span>{{ locale === 'fr' ? 'Ouvrir GeoGuessr →' : 'Open GeoGuessr →' }}</span>
          </div>
        </router-link>
      </div>

      <!-- Grille des 8 autres modes de jeu -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- 1. QCM Capitales -->
        <div @click="lancerMode('qcm', 'capital')" class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center group">
          <div class="w-14 h-14 bg-blue-100 dark:bg-gray-700 text-brandBlue dark:text-blue-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform">🏛️</div>
          <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">{{ t('home.mode_caps_title') }}</h3>
          <p class="text-gray-500 dark:text-gray-400 text-xs">{{ t('home.mode_caps_desc') }}</p>
        </div>

        <!-- 2. QCM Drapeaux -->
        <div @click="lancerMode('qcm', 'flag')" class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center group">
          <div class="w-14 h-14 bg-orange-100 dark:bg-gray-700 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform">🚩</div>
          <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">{{ t('home.mode_flags_title') }}</h3>
          <p class="text-gray-500 dark:text-gray-400 text-xs">{{ t('home.mode_flags_desc') }}</p>
        </div>

        <!-- 3. QCM Population, Langues & Monnaies -->
        <div @click="lancerMode('qcm', 'culture')" class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center group">
          <div class="w-14 h-14 bg-purple-100 dark:bg-gray-700 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform">🗣️</div>
          <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">
            {{ locale === 'fr' ? 'Population & Langues' : 'Population & Languages' }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400 text-xs">
            {{ locale === 'fr' ? 'Quel pays est le plus peuplé ? Quelle est sa langue ou sa monnaie ?' : 'Which country is most populous? What is its language or currency?' }}
          </p>
        </div>

        <!-- 4. NOUVEAU : Enquête aux 5 Indices -->
        <div @click="lancerMode('detective')" class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border-2 border-indigo-500/30 hover:border-indigo-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center group relative">
          <span class="absolute top-3 right-3 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
            {{ locale === 'fr' ? 'Inédit' : 'Unique' }}
          </span>
          <div class="w-14 h-14 bg-indigo-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform">🕵️</div>
          <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">
            {{ locale === 'fr' ? 'Enquête aux 5 Indices' : '5-Clue Detective' }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400 text-xs">
            {{ locale === 'fr' ? 'Dévoilez jusqu\'à 5 indices progressifs (superficie, monnaie, fun fact, capitale, drapeau). Moins d\'indices = plus de points !' : 'Reveal up to 5 progressive clues. Fewer clues used = more points scored!' }}
          </p>
        </div>

        <!-- 5. NOUVEAU : Cliquez sur la Carte (Style Seterra) -->
        <div @click="lancerMode('map-click')" class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border-2 border-cyan-500/30 hover:border-cyan-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center group relative">
          <span class="absolute top-3 right-3 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300">
            Mobile & PC
          </span>
          <div class="w-14 h-14 bg-cyan-100 dark:bg-gray-700 text-cyan-600 dark:text-cyan-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform">🖱️</div>
          <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">
            {{ locale === 'fr' ? 'Cliquez sur la Carte' : 'Click on the Map' }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400 text-xs">
            {{ locale === 'fr' ? 'Style Seterra : cliquez directement sur le pays demandé sur la carte muette sans rien taper au clavier !' : 'Seterra style: click directly on the requested country on the blank map with zero typing!' }}
          </p>
        </div>

        <!-- 6. Grille des Drapeaux -->
        <div @click="lancerMode('flag-grid')" class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center group">
          <div class="w-14 h-14 bg-emerald-100 dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform">🏳️</div>
          <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">
            {{ locale === 'fr' ? 'Grille des Drapeaux' : 'World Flag Grid' }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400 text-xs">
            {{ locale === 'fr' ? 'Tous les drapeaux devant vous : saisissez le nom du pays sous chaque drapeau pour verdir la carte.' : 'All flags in front of you: type the country name under each flag to turn the card green.' }}
          </p>
        </div>

        <!-- 7. Flashcards 3D -->
        <div @click="lancerMode('flashcards')" class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center group">
          <div class="w-14 h-14 bg-green-100 dark:bg-gray-700 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform">🃏</div>
          <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">{{ t('home.mode_flash_title') }}</h3>
          <p class="text-gray-500 dark:text-gray-400 text-xs">{{ t('home.mode_flash_desc') }}</p>
        </div>

        <!-- 8. Défis Chronométrés Carte (Clavier) -->
        <div @click="lancerMode('chrono')" class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center group">
          <div class="w-14 h-14 bg-red-100 dark:bg-gray-700 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform">⏱️</div>
          <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">
            {{ locale === 'fr' ? 'Défis Chrono (Clavier)' : 'Timed Map Typing' }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400 text-xs">
            {{ locale === 'fr' ? 'Tapez un maximum de pays au clavier en temps limité (Europe 47 ou Monde 196).' : 'Type as many countries as possible against the clock (Europe 47 or World 196).' }}
          </p>
        </div>
      </div>
    </div>

    <!-- ========================================================== -->
    <!-- MODES QCM (CAPITALES, DRAPEAUX, CULTURE) + DUEL AMI        -->
    <!-- ========================================================== -->
    <div v-if="currentMode === 'qcm'" class="max-w-2xl mx-auto mt-8">
      <div v-if="!qcmFini" class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <!-- Bandeau si Duel actif -->
        <div v-if="activeDuelTarget !== null" class="mb-4 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold text-center">
          ⚔️ {{ locale === 'fr' ? `Duel contre ${activeDuelFrom} — Score à battre : ${activeDuelTarget} / 15` : `Duel vs ${activeDuelFrom} — Target score: ${activeDuelTarget} / 15` }}
        </div>

        <div class="flex justify-between items-center mb-6 text-sm font-medium text-gray-500 dark:text-gray-400">
          <span>{{ t('quiz.question_x_of_y', { current: qcmIndex + 1, total: qcmMaxQuestions }) }}</span>
          <span class="font-bold text-blue-600 dark:text-blue-400">{{ t('quiz.score', { score: qcmScore }) }}</span>
        </div>

        <div class="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-8">
          <div
            class="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300"
            :style="{ width: `${((qcmIndex + 1) / qcmMaxQuestions) * 100}%` }"
          ></div>
        </div>
        
        <h3 v-if="qcmCurrentType === 'capital'" class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8 flex flex-col items-center gap-4">
          {{ t('quiz.ask_capital', { country: getLocalizedName(qcmQuestionsList[qcmIndex]) }) }}
          <img :src="`https://flagcdn.com/w80/${getIso(qcmQuestionsList[qcmIndex])}.png`" class="h-12 w-auto shadow-sm rounded-md border border-gray-100 dark:border-gray-700" alt="drapeau">
        </h3>

        <div v-else-if="qcmCurrentType === 'flag'" class="text-center mb-8">
          <img :src="`https://flagcdn.com/w160/${getIso(qcmQuestionsList[qcmIndex])}.png`" class="h-24 w-auto mx-auto mb-6 shadow-md rounded-md border border-gray-100 dark:border-gray-700" alt="drapeau">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ t('quiz.ask_flag') }}
          </h3>
        </div>

        <div v-else class="text-center mb-8 space-y-4">
          <span class="inline-block px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
            <template v-if="cultureSubType === 'population'">👥 {{ locale === 'fr' ? 'Défi Population' : 'Population Challenge' }}</template>
            <template v-else-if="cultureSubType === 'lang'">🗣️ {{ locale === 'fr' ? 'Langue Officielle' : 'Official Language' }}</template>
            <template v-else>💶 {{ locale === 'fr' ? 'Monnaie Nationale' : 'National Currency' }}</template>
          </span>

          <img
            v-if="cultureSubType !== 'population'"
            :src="`https://flagcdn.com/w160/${getIso(qcmQuestionsList[qcmIndex])}.png`"
            class="h-16 w-auto mx-auto shadow-sm rounded-lg border border-gray-100 dark:border-gray-700"
            alt="drapeau"
          />

          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
            <template v-if="cultureSubType === 'population'">
              {{ locale === 'fr' ? 'Lequel de ces 4 pays compte le plus grand nombre d\'habitants ?' : 'Which of these 4 countries has the largest population?' }}
            </template>
            <template v-else-if="cultureSubType === 'lang'">
              {{ locale === 'fr'
                ? `Quelle est la langue officielle principale parlée en / au ${getLocalizedName(qcmQuestionsList[qcmIndex])} ?`
                : `What is the main official language spoken in ${getLocalizedName(qcmQuestionsList[qcmIndex])}?` }}
            </template>
            <template v-else>
              {{ locale === 'fr'
                ? `Quelle est la monnaie officielle utilisée en / au ${getLocalizedName(qcmQuestionsList[qcmIndex])} ?`
                : `What is the official currency used in ${getLocalizedName(qcmQuestionsList[qcmIndex])}?` }}
            </template>
          </h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            v-for="choixId in qcmOptions" :key="choixId"
            @click="verifierReponseQcm(choixId)"
            :disabled="qcmIsAnswered"
            class="p-4 rounded-xl border-2 font-medium transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-1"
            :class="[
              !qcmIsAnswered ? 'border-gray-200 hover:border-brandBlue hover:bg-blue-50 text-gray-800 dark:border-gray-600 dark:hover:border-brandBlue dark:hover:bg-gray-700 dark:text-white' : '',
              qcmIsAnswered && choixId === qcmCorrectAnswer ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/50 dark:border-green-500 dark:text-green-300 scale-[1.02] shadow-sm' : '',
              qcmIsAnswered && choixId === qcmSelected && choixId !== qcmCorrectAnswer ? 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/50 dark:border-red-500 dark:text-red-300 scale-95' : '',
              qcmIsAnswered && choixId !== qcmSelected && choixId !== qcmCorrectAnswer ? 'border-gray-100 text-gray-400 dark:border-gray-800 dark:text-gray-600 opacity-50 cursor-not-allowed' : ''
            ]"
          >
            <div class="flex items-center gap-2.5">
              <img
                v-if="qcmCurrentType === 'culture' && cultureSubType === 'population'"
                :src="`https://flagcdn.com/w40/${getIso(choixId)}.png`"
                class="h-5 w-auto rounded-xs shadow-2xs"
                alt=""
              />
              <span class="font-bold">{{ getOptionLabel(choixId) }}</span>
            </div>

            <span
              v-if="qcmIsAnswered && qcmCurrentType === 'culture' && cultureSubType === 'population'"
              class="text-xs font-extrabold opacity-85"
            >
              👥 {{ getCountry(choixId)?.population }}
            </span>
          </button>
        </div>
      </div>
      
      <!-- Fin du QCM + Bouton Défier un ami -->
      <div v-else class="text-center py-12 px-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
        <div class="text-6xl">🏆</div>
        <div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('quiz.finished') }}</h3>
          <p class="text-xl text-gray-600 dark:text-gray-300">
            {{ t('quiz.your_score', { score: qcmScore, total: qcmMaxQuestions }) }}
          </p>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            @click="copyDuelQcmLink"
            class="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition cursor-pointer shadow-sm"
          >
            ⚔️ {{ duelLinkCopied ? (locale === 'fr' ? 'Lien de duel copié !' : 'Duel link copied!') : (locale === 'fr' ? 'Défier un ami sur ces 15 questions' : 'Challenge a friend on these 15 questions') }}
          </button>

          <button
            type="button"
            @click="lancerMode('qcm', qcmCurrentType)"
            class="bg-brandBlue text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-blue-700 transition cursor-pointer"
          >
            ↻ {{ t('quiz.replay') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- NOUVEAU MODE : LE PAYS MYSTÈRE (STYLE WORLDLE QUOTIDIEN & INFINI)         -->
    <!-- ========================================================================= -->
    <div v-if="currentMode === 'mystery'" class="max-w-2xl mx-auto mt-6 space-y-6">
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        
        <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <span class="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
              {{ mysteryIsDaily ? (locale === 'fr' ? '🔥 Pays du Jour Officiel' : '🔥 Official Daily Country') : (locale === 'fr' ? '♾️ Mode Entraînement Infini' : '♾️ Infinite Practice Mode') }}
            </span>
            <h3 class="text-2xl font-black text-gray-900 dark:text-white mt-2">
              {{ locale === 'fr' ? 'Devinez le Pays Mystère en 6 essais' : 'Guess the Mystery Country in 6 tries' }}
            </h3>
          </div>

          <button
            type="button"
            @click="startInfiniteMystery"
            class="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-blue-600 hover:text-white text-gray-800 dark:text-white text-xs font-bold transition cursor-pointer"
          >
            🎲 {{ locale === 'fr' ? 'Nouveau pays aléatoire' : 'New Random Country' }}
          </button>
        </div>

        <!-- Champ de saisie avec autocomplétion des 196 pays -->
        <div v-if="!mysteryFinished" class="space-y-3">
          <div class="flex gap-2">
            <input
              v-model="mysteryQuery"
              @keydown.enter.prevent="submitMysteryGuess()"
              type="text"
              :placeholder="locale === 'fr' ? `Essai ${mysteryGuesses.length + 1}/6 : Tapez le nom d'un pays...` : `Try ${mysteryGuesses.length + 1}/6: Type a country name...`"
              class="flex-1 px-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-bold focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              @click="submitMysteryGuess()"
              class="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm transition cursor-pointer"
            >
              {{ locale === 'fr' ? 'Valider' : 'Guess' }}
            </button>
          </div>

          <!-- Suggestions cliquables pendant la frappe -->
          <div v-if="mysterySuggestions.length > 0" class="flex flex-wrap gap-2">
            <button
              v-for="sug in mysterySuggestions"
              :key="sug.id"
              type="button"
              @click="submitMysteryGuess(sug)"
              class="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-gray-700 hover:bg-blue-600 hover:text-white text-gray-800 dark:text-gray-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <img :src="`https://flagcdn.com/w20/${sug.iso}.png`" class="h-3.5 w-auto rounded-2xs" alt="" />
              <span>{{ sug.name }}</span>
            </button>
          </div>
        </div>

        <!-- Grille des 6 tentatives (Distance + Boussole + % Proximité) -->
        <div class="space-y-2.5">
          <div
            v-for="slot in 6"
            :key="'mys-slot-' + slot"
            class="h-14 rounded-2xl px-4 flex items-center justify-between border transition-all"
            :class="mysteryGuesses[slot - 1]
              ? (mysteryGuesses[slot - 1].isCorrect
                  ? 'bg-emerald-500 text-white border-emerald-500 font-black shadow-sm'
                  : 'bg-gray-50 dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white')
              : 'bg-gray-50/40 dark:bg-gray-900/30 border-dashed border-gray-200 dark:border-gray-700/60 text-gray-400'"
          >
            <template v-if="mysteryGuesses[slot - 1]">
              <div class="flex items-center gap-3 min-w-0">
                <img :src="`https://flagcdn.com/w40/${mysteryGuesses[slot - 1].iso}.png`" class="h-5 w-auto rounded-xs shadow-2xs shrink-0" alt="" />
                <strong class="text-sm sm:text-base truncate">{{ mysteryGuesses[slot - 1].name }}</strong>
              </div>

              <div class="flex items-center gap-3 sm:gap-5 shrink-0 text-xs sm:text-sm font-extrabold">
                <span>{{ mysteryGuesses[slot - 1].distanceKm.toLocaleString() }} km</span>
                <span class="px-2.5 py-1 rounded-lg bg-black/10 dark:bg-white/10">
                  {{ mysteryGuesses[slot - 1].direction }}
                </span>
                <span
                  class="px-2.5 py-1 rounded-lg"
                  :class="mysteryGuesses[slot - 1].isCorrect ? 'bg-white text-emerald-700' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'"
                >
                  {{ mysteryGuesses[slot - 1].proximity }}%
                </span>
              </div>
            </template>

            <template v-else>
              <span class="text-xs font-semibold">{{ locale === 'fr' ? `Essai ${slot} / 6` : `Try ${slot} / 6` }}</span>
            </template>
          </div>
        </div>

        <!-- Résultat final du Pays Mystère -->
        <div
          v-if="mysteryFinished && mysteryTarget"
          class="p-6 rounded-2xl border text-center space-y-4"
          :class="mysteryWon
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-900 dark:text-emerald-200'
            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200'"
        >
          <img :src="`https://flagcdn.com/w160/${mysteryTarget.iso}.png`" class="h-16 w-auto mx-auto rounded-lg shadow" alt="" />
          <div>
            <h4 class="text-2xl font-black">
              {{ mysteryWon
                ? (locale === 'fr' ? `Bravo ! Trouvé en ${mysteryGuesses.length}/6 : ${mysteryTarget.name}` : `Well done! Found in ${mysteryGuesses.length}/6: ${mysteryTarget.name}`)
                : (locale === 'fr' ? `Le pays mystère était : ${mysteryTarget.name}` : `The mystery country was: ${mysteryTarget.name}`) }}
            </h4>
            <p class="text-xs sm:text-sm opacity-90 mt-1">
              {{ t('common.capital') }} : <strong>{{ mysteryTarget.capital }}</strong> • {{ mysteryTarget.subregion }} • 💡 {{ mysteryTarget.fact }}
            </p>
          </div>

          <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              @click="copyMysteryShareGrid"
              class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              📋 {{ mysteryCopied ? (locale === 'fr' ? 'Grille copiée !' : 'Grid copied!') : (locale === 'fr' ? 'Partager mon résultat (🟩🟨⬛)' : 'Share Result (🟩🟨⬛)') }}
            </button>
            <button
              type="button"
              @click="startInfiniteMystery"
              class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition cursor-pointer"
            >
              🎲 {{ locale === 'fr' ? 'Rejouer avec un autre pays' : 'Play another country' }}
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- NOUVEAU MODE : ENQUÊTE GÉOGRAPHIQUE AUX 5 INDICES                         -->
    <!-- ========================================================================= -->
    <div v-if="currentMode === 'detective'" class="max-w-3xl mx-auto mt-6 space-y-6">
      <div v-if="!detectiveFinished && detectiveTarget" class="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
        
        <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <span class="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
              🕵️ {{ locale === 'fr' ? `Enquête ${detectiveRound} / 5` : `Case ${detectiveRound} / 5` }}
            </span>
            <h3 class="text-2xl font-black text-gray-900 dark:text-white">
              {{ locale === 'fr' ? 'Identifiez le pays avec le moins d\'indices possible' : 'Identify the country using as few clues as possible' }}
            </h3>
          </div>

          <div class="text-right">
            <span class="text-xs text-gray-400 block">{{ locale === 'fr' ? 'Score total' : 'Total Score' }}</span>
            <strong class="text-2xl font-black text-indigo-600 dark:text-indigo-400">{{ detectiveScore }} / 25 pts</strong>
          </div>
        </div>

        <!-- Les 5 cartes d'indices progressifs (de 5 pts à 1 pt) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <!-- Indice 1 (Toujours visible : 5 pts) -->
          <div class="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
            <span class="text-[11px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 block mb-1">
              {{ locale === 'fr' ? 'Indice #1 (Valeur : 5 pts)' : 'Clue #1 (Worth: 5 pts)' }}
            </span>
            <p class="text-sm font-bold text-gray-900 dark:text-white">
              🌍 {{ detectiveTarget.subregion }} • 📐 {{ detectiveTarget.area }}
            </p>
          </div>

          <!-- Indice 2 (4 pts) -->
          <div class="p-4 rounded-2xl border transition-all" :class="detectiveCluesRevealed >= 2 ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800' : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'">
            <span class="text-[11px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 block mb-1">
              {{ locale === 'fr' ? 'Indice #2 (Valeur : 4 pts)' : 'Clue #2 (Worth: 4 pts)' }}
            </span>
            <p v-if="detectiveCluesRevealed >= 2" class="text-sm font-bold text-gray-900 dark:text-white">
              👥 {{ detectiveTarget.population }} hab. • 💶 {{ detectiveTarget.currency }}
            </p>
            <button v-else type="button" @click="detectiveCluesRevealed = 2" class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
              🔓 {{ locale === 'fr' ? 'Dévoiler Habitants & Monnaie (-1 pt)' : 'Reveal Population & Currency (-1 pt)' }}
            </button>
          </div>

          <!-- Indice 3 : Fun Fact masqué (3 pts) -->
          <div class="sm:col-span-2 p-4 rounded-2xl border transition-all" :class="detectiveCluesRevealed >= 3 ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800' : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'">
            <span class="text-[11px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 block mb-1">
              {{ locale === 'fr' ? 'Indice #3 — Anecdote (Valeur : 3 pts)' : 'Clue #3 — Fun Fact (Worth: 3 pts)' }}
            </span>
            <p v-if="detectiveCluesRevealed >= 3" class="text-sm font-semibold text-gray-800 dark:text-gray-200">
              💡 « {{ maskedDetectiveFact }} »
            </p>
            <button v-else type="button" @click="detectiveCluesRevealed = 3" class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
              🔓 {{ locale === 'fr' ? 'Dévoiler le Fun Fact du pays (-1 pt)' : 'Reveal Country Fun Fact (-1 pt)' }}
            </button>
          </div>

          <!-- Indice 4 : Langue & Capitale (2 pts) -->
          <div class="p-4 rounded-2xl border transition-all" :class="detectiveCluesRevealed >= 4 ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800' : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'">
            <span class="text-[11px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 block mb-1">
              {{ locale === 'fr' ? 'Indice #4 (Valeur : 2 pts)' : 'Clue #4 (Worth: 2 pts)' }}
            </span>
            <p v-if="detectiveCluesRevealed >= 4" class="text-sm font-bold text-gray-900 dark:text-white">
              🗣️ {{ detectiveTarget.lang }} • 🏛️ {{ detectiveTarget.capital }}
            </p>
            <button v-else type="button" @click="detectiveCluesRevealed = 4" class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
              🔓 {{ locale === 'fr' ? 'Dévoiler Langue & Capitale (-1 pt)' : 'Reveal Language & Capital (-1 pt)' }}
            </button>
          </div>

          <!-- Indice 5 : Drapeau (1 pt) -->
          <div class="p-4 rounded-2xl border transition-all flex items-center justify-between" :class="detectiveCluesRevealed >= 5 ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800' : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'">
            <div>
              <span class="text-[11px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 block mb-1">
                {{ locale === 'fr' ? 'Indice #5 (Valeur : 1 pt)' : 'Clue #5 (Worth: 1 pt)' }}
              </span>
              <button v-if="detectiveCluesRevealed < 5" type="button" @click="detectiveCluesRevealed = 5" class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                🔓 {{ locale === 'fr' ? 'Dévoiler le Drapeau (-1 pt)' : 'Reveal Flag (-1 pt)' }}
              </button>
              <span v-else class="text-xs font-bold text-gray-600 dark:text-gray-300">{{ locale === 'fr' ? 'Drapeau officiel' : 'Official Flag' }}</span>
            </div>
            <img v-if="detectiveCluesRevealed >= 5" :src="`https://flagcdn.com/w80/${detectiveTarget.iso}.png`" class="h-10 w-auto rounded shadow-xs" alt="" />
          </div>
        </div>

        <!-- 4 Choix de réponse pour l'enquête -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          <button
            v-for="optId in detectiveOptions"
            :key="'det-opt-' + optId"
            type="button"
            :disabled="detectiveAnswered"
            @click="answerDetective(optId)"
            class="p-4 rounded-xl border-2 font-bold transition-all cursor-pointer"
            :class="[
              !detectiveAnswered ? 'border-gray-200 dark:border-gray-700 hover:border-indigo-500 text-gray-900 dark:text-white' : '',
              detectiveAnswered && optId === detectiveTarget.id ? 'bg-emerald-500 border-emerald-500 text-white' : '',
              detectiveAnswered && optId === detectiveSelected && optId !== detectiveTarget.id ? 'bg-red-500 border-red-500 text-white' : '',
              detectiveAnswered && optId !== detectiveSelected && optId !== detectiveTarget.id ? 'opacity-40 border-gray-200 dark:border-gray-800' : ''
            ]"
          >
            {{ getLocalizedName(optId) }}
          </button>
        </div>

      </div>

      <!-- Fin des 5 Enquêtes -->
      <div v-else class="text-center py-12 px-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-5">
        <div class="text-6xl">🕵️</div>
        <h3 class="text-2xl font-black text-gray-900 dark:text-white">
          {{ locale === 'fr' ? 'Enquête terminée !' : 'Investigation Complete!' }}
        </h3>
        <p class="text-xl text-gray-600 dark:text-gray-300 font-bold">
          Score : {{ detectiveScore }} / 25 pts
        </p>
        <button
          type="button"
          @click="lancerMode('detective')"
          class="px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition cursor-pointer"
        >
          ↻ {{ locale === 'fr' ? 'Nouvelle Enquête' : 'New Investigation' }}
        </button>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- NOUVEAU MODE : CLIQUEZ SUR LA CARTE (STYLE SETERRA SANS CLAVIER)          -->
    <!-- ========================================================================= -->
    <div v-if="currentMode === 'map-click'" class="max-w-5xl mx-auto mt-6 space-y-5">
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-7 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
        
        <!-- Barre de consigne : Pays sur lequel cliquer -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-cyan-50/80 dark:bg-gray-900 p-4 rounded-2xl border border-cyan-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <select
              v-model="mapClickScope"
              @change="initMapClickGame"
              class="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs sm:text-sm font-bold text-gray-800 dark:text-white"
            >
              <option value="europe">{{ locale === 'fr' ? 'Europe (47 pays)' : 'Europe (47 countries)' }}</option>
              <option value="world25">{{ locale === 'fr' ? 'Sprint Monde (25 pays)' : 'World Sprint (25 countries)' }}</option>
            </select>

            <span class="text-xs sm:text-sm font-extrabold text-gray-500 dark:text-gray-400">
              {{ mapClickIndex }} / {{ mapClickQueue.length }}
            </span>
          </div>

          <!-- Cible actuelle à cliquer -->
          <div v-if="!mapClickFinished && currentMapClickTarget" class="flex items-center gap-3">
            <span class="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400">
              {{ locale === 'fr' ? 'Cliquez sur :' : 'Click on:' }}
            </span>
            <img :src="`https://flagcdn.com/w40/${currentMapClickTarget.iso}.png`" class="h-6 w-auto rounded shadow-2xs" alt="" />
            <strong class="text-xl sm:text-2xl font-black text-blue-600 dark:text-cyan-400">
              {{ currentMapClickTarget.name }}
            </strong>
          </div>

          <div class="text-right">
            <span class="text-xs text-gray-400 block">Précision</span>
            <strong class="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {{ mapClickScore }} / {{ mapClickQueue.length }}
            </strong>
          </div>
        </div>

        <!-- Feedback du dernier clic erroné -->
        <div v-if="mapClickFeedback" class="text-center text-xs sm:text-sm font-bold text-red-500">
          {{ mapClickFeedback }}
        </div>

        <!-- Carte muette interactive Seterra -->
        <div class="h-[500px] w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 relative z-0 bg-[#aad3df] dark:bg-[#1e293b]">
          <l-map
            v-model:zoom="mapClickZoom"
            v-model:center="mapClickCenter"
            :min-zoom="2"
            :max-zoom="7"
            :use-global-leaflet="false"
          >
            <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              :no-wrap="true"
            ></l-tile-layer>

            <l-circle-marker
              v-for="country in mapClickCountriesPool"
              :key="'mc-' + country.id"
              :lat-lng="[country.lat, country.lng]"
              :radius="getMapClickRadius(country)"
              :color="getMapClickBorderColor(country)"
              :weight="2"
              :fill-color="getMapClickFillColor(country)"
              :fill-opacity="0.95"
              @click="onCountryMarkerClick(country)"
            >
              <l-popup v-if="mapClickStatus[country.iso]">
                <strong>{{ country.name }}</strong>
              </l-popup>
            </l-circle-marker>
          </l-map>
        </div>

        <div v-if="mapClickFinished" class="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-400 text-center space-y-3">
          <h4 class="text-2xl font-black text-emerald-800 dark:text-emerald-200">
            🎉 {{ locale === 'fr' ? `Terminé ! Score : ${mapClickScore} / ${mapClickQueue.length}` : `Finished! Score: ${mapClickScore} / ${mapClickQueue.length}` }}
          </h4>
          <button
            type="button"
            @click="initMapClickGame"
            class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition cursor-pointer"
          >
            ↻ {{ locale === 'fr' ? 'Rejouer' : 'Play Again' }}
          </button>
        </div>

      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODE GRILLE DES DRAPEAUX                                                  -->
    <!-- ========================================================================= -->
    <div v-if="currentMode === 'flag-grid'" class="space-y-6 mt-6">
      <div class="sticky top-20 z-30 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div 
            class="px-4 py-2.5 rounded-xl font-black text-xl tracking-wider text-white shadow-sm flex items-center gap-2"
            :class="flagGridTime <= 30 && !flagGridFinished ? 'bg-red-500 animate-pulse' : 'bg-blue-600'"
          >
            <span>⏱️</span>
            <span>{{ formatTime(flagGridTime) }}</span>
          </div>

          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              {{ locale === 'fr' ? 'Drapeaux trouvés' : 'Flags Found' }}
            </p>
            <div class="flex items-baseline gap-1.5">
              <strong class="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {{ flagGridFoundCount }}
              </strong>
              <span class="text-sm font-bold text-gray-500 dark:text-gray-400">
                / {{ flagGridCountries.length }}
              </span>
            </div>
          </div>
        </div>

        <div class="w-full md:flex-1 max-w-md">
          <div class="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300 rounded-full"
              :style="{ width: `${flagGridCountries.length ? (flagGridFoundCount / flagGridCountries.length) * 100 : 0}%` }"
            ></div>
          </div>
        </div>

        <div class="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
          <select
            v-model="flagGridContinent"
            @change="initFlagGrid"
            :disabled="flagGridFoundCount > 0 && !flagGridFinished"
            class="px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-semibold focus:outline-none disabled:opacity-50"
          >
            <option value="">{{ locale === 'fr' ? 'Monde entier (196)' : 'Whole World (196)' }}</option>
            <option value="Europe">{{ locale === 'fr' ? 'Europe (47)' : 'Europe (47)' }}</option>
            <option value="Asia">{{ locale === 'fr' ? 'Asie (46)' : 'Asia (46)' }}</option>
            <option value="Africa">{{ locale === 'fr' ? 'Afrique (54)' : 'Africa (54)' }}</option>
            <option value="North America">{{ locale === 'fr' ? 'Amérique du Nord (23)' : 'North America (23)' }}</option>
            <option value="South America">{{ locale === 'fr' ? 'Amérique du Sud (12)' : 'South America (12)' }}</option>
            <option value="Oceania">{{ locale === 'fr' ? 'Océanie (14)' : 'Oceania (14)' }}</option>
          </select>

          <button
            v-if="!flagGridFinished"
            type="button"
            @click="finishFlagGrid"
            class="px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition shadow-sm cursor-pointer"
          >
            {{ locale === 'fr' ? 'Abandonner / Terminer' : 'Give Up / Finish' }}
          </button>

          <button
            v-else
            type="button"
            @click="initFlagGrid"
            class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition shadow-sm cursor-pointer"
          >
            ↻ {{ locale === 'fr' ? 'Rejouer' : 'Play Again' }}
          </button>
        </div>
      </div>

      <div 
        v-if="flagGridFinished" 
        class="p-6 rounded-2xl text-center border"
        :class="flagGridFoundCount === flagGridCountries.length 
          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-800 dark:text-emerald-200' 
          : 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200'"
      >
        <h3 class="text-2xl font-black mb-1">
          {{ flagGridFoundCount === flagGridCountries.length
            ? (locale === 'fr' ? 'Sans-faute légendaire ! 🏆' : 'Legendary Perfect Score! 🏆')
            : (locale === 'fr' ? 'Partie terminée !' : 'Game Over!') }}
        </h3>
        <p class="text-sm opacity-90">
          {{ locale === 'fr'
            ? `Vous avez identifié ${flagGridFoundCount} drapeaux sur ${flagGridCountries.length}.`
            : `You identified ${flagGridFoundCount} out of ${flagGridCountries.length} flags.` }}
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div
          v-for="(country, index) in flagGridCountries"
          :key="country.id"
          class="rounded-2xl p-3.5 transition-all duration-300 flex flex-col justify-between border-2"
          :class="[
            flagGridFound[country.iso]
              ? 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-500 shadow-sm scale-[1.01]'
              : flagGridFinished
                ? 'bg-red-50/60 dark:bg-red-950/30 border-red-300 dark:border-red-800/70'
                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-blue-400/60 shadow-sm'
          ]"
        >
          <div class="h-24 w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900/60 rounded-xl p-2 mb-3 overflow-hidden border border-gray-100 dark:border-gray-700/60">
            <img
              :src="`https://flagcdn.com/w160/${country.iso}.png`"
              :alt="locale === 'fr' ? 'Drapeau à deviner' : 'Flag to guess'"
              class="max-h-full max-w-full object-contain rounded shadow-sm select-none pointer-events-none"
              loading="lazy"
            />
          </div>

          <div class="relative">
            <div
              v-if="flagGridFound[country.iso]"
              class="w-full px-3 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs sm:text-sm text-center flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>✓</span>
              <span class="truncate">{{ country.name }}</span>
            </div>

            <div
              v-else-if="flagGridFinished"
              class="w-full px-3 py-2 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700 font-bold text-xs sm:text-sm text-center truncate"
              :title="country.name"
            >
              {{ country.name }}
            </div>

            <input
              v-else
              :ref="el => setFlagInputRef(el, index)"
              v-model="flagGridInputs[country.iso]"
              @input="checkSingleFlagInput(country, index)"
              type="text"
              :placeholder="locale === 'fr' ? 'Nom du pays...' : 'Country name...'"
              autocomplete="off"
              spellcheck="false"
              class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-xs sm:text-sm font-semibold text-center focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODE FLASHCARDS 3D ENRICHIES                                              -->
    <!-- ========================================================================= -->
    <div v-if="currentMode === 'flashcards'" class="max-w-xl mx-auto mt-6 space-y-6">
      <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
        <select 
          v-model="flashcardContinent"
          @change="resetFlashcards"
          class="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-none"
        >
          <option value="">{{ locale === 'fr' ? 'Tous les continents (196)' : 'All Continents (196)' }}</option>
          <option value="Europe">Europe (47)</option>
          <option value="Asia">{{ locale === 'fr' ? 'Asie (46)' : 'Asia (46)' }}</option>
          <option value="Africa">{{ locale === 'fr' ? 'Afrique (54)' : 'Africa (54)' }}</option>
          <option value="North America">{{ locale === 'fr' ? 'Amérique du Nord (23)' : 'North America (23)' }}</option>
          <option value="South America">{{ locale === 'fr' ? 'Amérique du Sud (12)' : 'South America (12)' }}</option>
          <option value="Oceania">{{ locale === 'fr' ? 'Océanie (14)' : 'Oceania (14)' }}</option>
        </select>

        <select 
          v-model="flashcardFrontPrompt"
          @change="flashcardFlipped = false"
          class="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-none"
        >
          <option value="flag">{{ locale === 'fr' ? 'Recto : Drapeau' : 'Front: Flag' }}</option>
          <option value="country">{{ locale === 'fr' ? 'Recto : Nom du pays' : 'Front: Country Name' }}</option>
          <option value="capital">{{ locale === 'fr' ? 'Recto : Capitale' : 'Front: Capital' }}</option>
        </select>

        <button 
          type="button"
          @click="shuffleFlashcards"
          class="bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white hover:text-blue-600 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-2"
        >
          <i class="fas fa-random"></i> {{ locale === 'fr' ? 'Mélanger' : 'Shuffle' }}
        </button>
      </div>

      <div v-if="currentFlashcard" class="flip-scene w-full select-none">
        <div 
          class="flip-card-inner" 
          :class="{ 'is-flipped': flashcardFlipped }"
          @click="toggleFlashcardFlip"
        >
          <!-- FACE RECTO -->
          <div class="flip-card-face flip-card-front bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-between text-center">
            <div class="w-full flex items-center justify-between">
              <span class="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300">
                {{ currentFlashcard.subregion || currentFlashcard.continent }}
              </span>
              <span class="text-xs font-extrabold text-gray-400">
                {{ t('quiz.card_x_of_y', { current: flashcardIndex + 1, total: activeFlashcards.length }) }}
              </span>
            </div>

            <div class="my-auto flex flex-col items-center justify-center py-6">
              <template v-if="flashcardFrontPrompt === 'flag'">
                <img :src="`https://flagcdn.com/w320/${currentFlashcard.iso}.png`" :alt="currentFlashcard.name" class="h-36 w-auto rounded-xl shadow-md mb-6 border border-gray-200 dark:border-gray-700 object-contain">
                <p class="text-lg font-bold text-gray-700 dark:text-gray-200">{{ locale === 'fr' ? 'Quel est ce pays et sa capitale ?' : 'What is this country and its capital?' }}</p>
              </template>
              <template v-else-if="flashcardFrontPrompt === 'country'">
                <h3 class="text-4xl font-black text-gray-900 dark:text-white mb-3">{{ currentFlashcard.name }}</h3>
                <p class="text-base font-medium text-gray-500 dark:text-gray-400">{{ locale === 'fr' ? 'Devinez sa capitale et ses infos clés !' : 'Guess its capital and key facts!' }}</p>
              </template>
              <template v-else>
                <h3 class="text-4xl font-black text-gray-900 dark:text-white mb-3">{{ currentFlashcard.capital }}</h3>
                <p class="text-base font-medium text-gray-500 dark:text-gray-400">{{ locale === 'fr' ? 'De quel pays est-ce la capitale ?' : 'Which country is this the capital of?' }}</p>
              </template>
            </div>

            <div class="w-full pt-4 border-t border-gray-100 dark:border-gray-700/70 text-xs font-bold text-blue-600 dark:text-blue-400">
              {{ locale === 'fr' ? 'Cliquez pour retourner la fiche complète ↻' : 'Click to flip for full country card ↻' }}
            </div>
          </div>

          <!-- FACE VERSO -->
          <div class="flip-card-face flip-card-back bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col justify-between text-left">
            <div>
              <div class="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-gray-100 dark:border-gray-700">
                <div class="flex items-center gap-3.5">
                  <img :src="`https://flagcdn.com/w160/${currentFlashcard.iso}.png`" :alt="currentFlashcard.name" class="h-12 w-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 shrink-0">
                  <div>
                    <span class="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">{{ currentFlashcard.subregion }}</span>
                    <h3 class="text-2xl font-black text-gray-900 dark:text-white leading-tight">{{ currentFlashcard.name }}</h3>
                  </div>
                </div>
                <span class="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold">↻</span>
              </div>

              <div class="grid grid-cols-2 gap-3 mb-5">
                <div class="bg-gray-50 dark:bg-gray-900/70 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/70">
                  <span class="text-xs font-semibold text-gray-400 block mb-0.5">🏛️ {{ t('common.capital') }}</span>
                  <strong class="text-sm font-bold text-gray-900 dark:text-white">{{ currentFlashcard.capital }}</strong>
                </div>
                <div class="bg-gray-50 dark:bg-gray-900/70 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/70">
                  <span class="text-xs font-semibold text-gray-400 block mb-0.5">👥 {{ locale === 'fr' ? 'Habitants' : 'Population' }}</span>
                  <strong class="text-sm font-bold text-gray-900 dark:text-white">{{ currentFlashcard.population }}</strong>
                </div>
                <div class="bg-gray-50 dark:bg-gray-900/70 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/70">
                  <span class="text-xs font-semibold text-gray-400 block mb-0.5">🗣️ {{ locale === 'fr' ? 'Langue(s)' : 'Language(s)' }}</span>
                  <strong class="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">{{ currentFlashcard.lang }}</strong>
                </div>
                <div class="bg-gray-50 dark:bg-gray-900/70 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/70">
                  <span class="text-xs font-semibold text-gray-400 block mb-0.5">💶 {{ locale === 'fr' ? 'Monnaie' : 'Currency' }}</span>
                  <strong class="text-sm font-bold text-gray-900 dark:text-white">{{ currentFlashcard.currency }}</strong>
                </div>
              </div>

              <div class="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/60 rounded-2xl p-4">
                <span class="text-xs font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300 block mb-1">💡 Fun Fact</span>
                <p class="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">{{ currentFlashcard.fact }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentFlashcard" class="flex items-center justify-center gap-5 pt-2">
        <button @click="flashcardPrecedente" :disabled="flashcardIndex === 0" class="w-12 h-12 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full disabled:opacity-40 cursor-pointer flex items-center justify-center">
          <i class="fas fa-arrow-left"></i>
        </button>
        <button type="button" @click="toggleFlashcardFlip" class="px-6 py-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white font-bold text-sm cursor-pointer">
          ↻ {{ flashcardFlipped ? (locale === 'fr' ? 'Recto' : 'Front') : (locale === 'fr' ? 'Verso' : 'Back') }}
        </button>
        <button @click="flashcardSuivante" :disabled="flashcardIndex >= activeFlashcards.length - 1" class="w-12 h-12 bg-brandBlue text-white rounded-full disabled:opacity-40 cursor-pointer flex items-center justify-center">
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- MODE CHRONO CARTE (CLAVIER EUROPE & MONDE) -->
    <!-- ========================================== -->
    <div v-if="currentMode === 'chrono'" class="max-w-4xl mx-auto mt-8">
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <div v-if="!isChronoStarted && !chronoFini" class="text-center py-4 space-y-6">
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ locale === 'fr' ? 'Choisissez votre Défi Chrono' : 'Choose Your Timed Challenge' }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mt-6">
            <div @click="selectChronoMode('europe')" class="p-6 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col gap-3" :class="chronoRegion === 'europe' ? 'border-brandBlue bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'">
              <div class="text-3xl">🇪🇺</div>
              <h4 class="font-bold text-lg text-gray-900 dark:text-white">{{ t('home.mode_chrono_title') }}</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ locale === 'fr' ? 'Retrouvez les 47 pays d\'Europe en 3 minutes.' : 'Find all 47 European countries in 3 minutes.' }}</p>
            </div>
            <div @click="selectChronoMode('world')" class="p-6 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col gap-3" :class="chronoRegion === 'world' ? 'border-brandBlue bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'">
              <div class="text-3xl">🌍</div>
              <h4 class="font-bold text-lg text-gray-900 dark:text-white">{{ locale === 'fr' ? 'Défi Monde (196 pays)' : 'World Challenge (196 countries)' }}</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ locale === 'fr' ? 'Retrouvez le maximum de pays en 15 minutes !' : 'Find as many countries as possible in 15 minutes!' }}</p>
            </div>
          </div>
          <button @click="demarrerChrono" class="bg-brandBlue text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-md cursor-pointer mt-6">
            {{ t('quiz.start_timer') }}
          </button>
        </div>

        <div v-else>
          <div class="w-full h-[460px] bg-[#aad3df] dark:bg-[#1e293b] rounded-2xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700 relative z-0 mb-6">
            <l-map ref="map" v-model:zoom="mapZoom" v-model:center="mapCenter" :min-zoom="2" :max-zoom="7" :use-global-leaflet="false">
              <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" :no-wrap="true"></l-tile-layer>
              <l-circle-marker v-for="country in targetCountries" :key="'marker-' + country.id" :lat-lng="[country.lat, country.lng]" :radius="getMarkerRadius(country.iso)" :color="'#9ca3af'" :weight="1.5" :fill-color="paysTrouves.includes(country.iso) ? '#22c55e' : '#ffffff'" :fill-opacity="0.9"></l-circle-marker>
            </l-map>
          </div>

          <div class="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 bg-white dark:bg-gray-800 border-2 border-brandBlue/20 p-4 rounded-2xl shadow-sm">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white" :class="chronoTemps <= 20 && !chronoFini ? 'bg-red-500 animate-pulse' : 'bg-brandBlue'">
                {{ formatTime(chronoTemps) }}
              </div>
              <div>
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ t('quiz.progression') }}</p>
                <h3 class="font-bold text-gray-900 dark:text-white text-xl">{{ t('quiz.found', { current: paysTrouves.length, total: targetCountries.length }) }}</h3>
              </div>
            </div>
            <div class="w-full md:w-1/2">
              <input v-model="chronoInput" @input="verifierSaisieChrono" :disabled="chronoFini" type="text" :placeholder="locale === 'fr' ? 'Tapez le nom d\'un pays...' : 'Type a country name...'" class="w-full pl-6 pr-4 py-4 rounded-xl border-2 border-brandBlue/40 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-lg font-bold">
            </div>
          </div>
        </div>
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
import { LMap, LTileLayer, LPopup, LCircleMarker } from "@vue-leaflet/vue-leaflet";
import L from 'leaflet';

const { t, locale } = useI18n();
const route = useRoute();

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const API_URL = 'https://geolearn-backend-bj65.onrender.com';
const countriesData = ref(ALL_COUNTRIES);

// =========================================================
// SYNTHÉTISEUR D'EFFETS SONORES (WEB AUDIO API)
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
    } else if (type === 'flip') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.06);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.08);
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

const currentMode = ref('menu'); 
const retourMenu = () => {
  currentMode.value = 'menu';
  arreterChrono();
  stopFlagGridTimer();
};

const lancerMode = (mode, type = null) => {
  arreterChrono();
  stopFlagGridTimer();
  activeDuelTarget.value = null;
  currentMode.value = mode;
  if (mode === 'qcm') initQcm(type);
  if (mode === 'mystery') initDailyMystery();
  if (mode === 'detective') initDetectiveGame();
  if (mode === 'map-click') initMapClickGame();
  if (mode === 'flag-grid') initFlagGrid();
  if (mode === 'flashcards') initFlashcards();
  if (mode === 'chrono') { isChronoStarted.value = false; paysTrouves.value = []; chronoFini.value = false; }
};

const sauvegarderScore = async (mode, score, maxScore) => {
  const savedUser = localStorage.getItem('geolearn_user');
  if (!savedUser) return; 
  try {
    const parsed = JSON.parse(savedUser);
    const userId = parsed.id || (parsed.user && parsed.user.id);
    if (!userId) return;
    await fetch(`${API_URL}/api/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, mode: mode, score: score, max_score: maxScore })
    });
  } catch (error) {
    console.error("Erreur serveur scores:", error);
  }
};

const normalizeStr = (str = '') =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[-']/g, " ").toLowerCase().trim();

const parseNumericPopulation = (popStr = '') => {
  if (!popStr) return 0;
  const s = popStr.toString().replace(',', '.').trim();
  const num = parseFloat(s.replace(/[^\d.]/g, '')) || 0;
  if (/Md|B/i.test(s)) return num * 1_000_000_000;
  if (/M/i.test(s)) return num * 1_000_000;
  if (/K/i.test(s)) return num * 1_000;
  return parseFloat(s.replace(/\s+/g, '')) || 0;
};

const localizedCountries = computed(() => {
  const isEn = locale.value === 'en';
  return countriesData.value.map(c => ({
    ...c,
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

const getCountry = (id) => localizedCountries.value.find(c => c.id === id);
const getLocalizedName = (id) => getCountry(id)?.name || '';
const getLocalizedCapital = (id) => getCountry(id)?.capital || '';
const getIso = (id) => getCountry(id)?.iso || '';

// Formule de Haversine + Direction Boussole 🧭
const computeDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = d => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.min(1, Math.sqrt(a))));
};

const computeCompassDirection = (lat1, lon1, lat2, lon2) => {
  const toRad = d => (d * Math.PI) / 180;
  const toDeg = r => (r * 180) / Math.PI;
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) - Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  const brng = (toDeg(Math.atan2(y, x)) + 360) % 360;
  const dirsFr = ['⬆️ N', '↗️ NE', '➡️ E', '↘️ SE', '⬇️ S', '↙️ SO', '⬅️ O', '↖️ NO'];
  const dirsEn = ['⬆️ N', '↗️ NE', '➡️ E', '↘️ SE', '⬇️ S', '↙️ SW', '⬅️ W', '↖️ NW'];
  const idx = Math.round(brng / 45) % 8;
  return locale.value === 'fr' ? dirsFr[idx] : dirsEn[idx];
};

// =========================================================
// MODE : LE PAYS MYSTÈRE (WORLDLE DU JOUR & INFINI)
// =========================================================
const mysteryTargetId = ref(null);
const mysteryGuesses = ref([]);
const mysteryQuery = ref('');
const mysteryFinished = ref(false);
const mysteryWon = ref(false);
const mysteryIsDaily = ref(true);
const mysteryCopied = ref(false);

const mysteryTarget = computed(() => getCountry(mysteryTargetId.value));

const mysterySuggestions = computed(() => {
  const q = normalizeStr(mysteryQuery.value);
  if (!q || q.length < 2) return [];
  const guessedIds = new Set(mysteryGuesses.value.map(g => g.id));
  return localizedCountries.value
    .filter(c => !guessedIds.has(c.id) && normalizeStr(c.name).includes(q))
    .slice(0, 6);
});

const initDailyMystery = () => {
  mysteryIsDaily.value = true;
  const todayStr = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < todayStr.length; i++) {
    hash = (hash * 31 + todayStr.charCodeAt(i)) % 100000;
  }
  const idx = hash % countriesData.value.length;
  mysteryTargetId.value = countriesData.value[idx].id;
  mysteryGuesses.value = [];
  mysteryQuery.value = '';
  mysteryFinished.value = false;
  mysteryWon.value = false;
};

const startInfiniteMystery = () => {
  mysteryIsDaily.value = false;
  const randomCountry = countriesData.value[Math.floor(Math.random() * countriesData.value.length)];
  mysteryTargetId.value = randomCountry.id;
  mysteryGuesses.value = [];
  mysteryQuery.value = '';
  mysteryFinished.value = false;
  mysteryWon.value = false;
};

const submitMysteryGuess = (countryObj = null) => {
  if (mysteryFinished.value || !mysteryTarget.value) return;
  let guessed = countryObj;
  if (!guessed) {
    const q = normalizeStr(mysteryQuery.value);
    guessed = localizedCountries.value.find(c =>
      normalizeStr(c.name) === q || (c.aliases || []).some(a => normalizeStr(a) === q)
    ) || mysterySuggestions.value[0];
  }
  if (!guessed) return;
  if (mysteryGuesses.value.some(g => g.id === guessed.id)) return;

  const isCorrect = guessed.id === mysteryTarget.value.id;
  const distKm = isCorrect ? 0 : computeDistanceKm(guessed.lat, guessed.lng, mysteryTarget.value.lat, mysteryTarget.value.lng);
  const direction = isCorrect ? '🎯' : computeCompassDirection(guessed.lat, guessed.lng, mysteryTarget.value.lat, mysteryTarget.value.lng);
  const proximity = isCorrect ? 100 : Math.max(5, Math.min(99, Math.round((1 - distKm / 18000) * 100)));

  mysteryGuesses.value.push({
    id: guessed.id,
    name: guessed.name,
    iso: guessed.iso,
    distanceKm: distKm,
    direction,
    proximity,
    isCorrect
  });
  mysteryQuery.value = '';

  if (isCorrect) {
    mysteryWon.value = true;
    mysteryFinished.value = true;
    playSound('victory');
    const pts = Math.max(1, 7 - mysteryGuesses.value.length);
    sauvegarderScore('Pays Mystère', pts, 6);
  } else if (mysteryGuesses.value.length >= 6) {
    mysteryWon.value = false;
    mysteryFinished.value = true;
    playSound('wrong');
    sauvegarderScore('Pays Mystère', 0, 6);
  } else {
    playSound('flip');
  }
};

const copyMysteryShareGrid = async () => {
  const rows = mysteryGuesses.value.map(g => {
    if (g.isCorrect) return '🟩🟩🟩🟩🟩 🎯 100%';
    const blocks = Math.max(1, Math.round(g.proximity / 20));
    return '🟨'.repeat(blocks) + '⬛'.repeat(5 - blocks) + ` ${g.direction} (${g.proximity}%)`;
  });
  const text = `🌍 GeoLearn Pays Mystère (${mysteryWon.value ? mysteryGuesses.value.length : 'X'}/6)\n${rows.join('\n')}\nhttps://geolearn.fun`;
  try {
    await navigator.clipboard.writeText(text);
    mysteryCopied.value = true;
    setTimeout(() => { mysteryCopied.value = false; }, 3500);
  } catch (e) {}
};

// =========================================================
// MODE : ENQUÊTE GÉOGRAPHIQUE AUX 5 INDICES
// =========================================================
const detectiveRound = ref(1);
const detectiveScore = ref(0);
const detectiveTargetId = ref(null);
const detectiveOptions = ref([]);
const detectiveCluesRevealed = ref(1);
const detectiveAnswered = ref(false);
const detectiveSelected = ref(null);
const detectiveFinished = ref(false);

const detectiveTarget = computed(() => getCountry(detectiveTargetId.value));

const maskedDetectiveFact = computed(() => {
  if (!detectiveTarget.value) return '';
  const fact = detectiveTarget.value.fact || '';
  const regexFr = new RegExp(detectiveTarget.value.name_fr, 'gi');
  const regexEn = new RegExp(detectiveTarget.value.name_en, 'gi');
  return fact.replace(regexFr, '[███]').replace(regexEn, '[███]');
});

const initDetectiveGame = () => {
  detectiveRound.value = 1;
  detectiveScore.value = 0;
  detectiveFinished.value = false;
  setupDetectiveRound();
};

const setupDetectiveRound = () => {
  detectiveCluesRevealed.value = 1;
  detectiveAnswered.value = false;
  detectiveSelected.value = null;
  const shuffled = [...localizedCountries.value].sort(() => 0.5 - Math.random());
  const target = shuffled[0];
  detectiveTargetId.value = target.id;
  const distractors = shuffled.slice(1, 4).map(c => c.id);
  detectiveOptions.value = [target.id, ...distractors].sort(() => 0.5 - Math.random());
};

const answerDetective = (chosenId) => {
  if (detectiveAnswered.value) return;
  detectiveSelected.value = chosenId;
  detectiveAnswered.value = true;
  if (chosenId === detectiveTargetId.value) {
    const ptsEarned = Math.max(1, 6 - detectiveCluesRevealed.value);
    detectiveScore.value += ptsEarned;
    playSound('correct');
  } else {
    playSound('wrong');
  }
  setTimeout(() => {
    if (detectiveRound.value < 5) {
      detectiveRound.value++;
      setupDetectiveRound();
    } else {
      detectiveFinished.value = true;
      playSound('victory');
      sauvegarderScore('Enquête 5 Indices', detectiveScore.value, 25);
    }
  }, 1200);
};

// =========================================================
// MODE : CLIQUEZ SUR LA CARTE (STYLE SETERRA)
// =========================================================
const mapClickScope = ref('europe');
const mapClickCountriesPool = ref([]);
const mapClickQueue = ref([]);
const mapClickIndex = ref(0);
const mapClickStatus = ref({}); // { iso: 'first' | 'second' | 'late' }
const mapClickWrongTries = ref(0);
const mapClickScore = ref(0);
const mapClickFinished = ref(false);
const mapClickFeedback = ref('');
const mapClickZoom = ref(3.8);
const mapClickCenter = ref([54.0, 15.0]);

const currentMapClickTarget = computed(() => mapClickQueue.value[mapClickIndex.value] || null);

const initMapClickGame = () => {
  mapClickStatus.value = {};
  mapClickIndex.value = 0;
  mapClickWrongTries.value = 0;
  mapClickScore.value = 0;
  mapClickFinished.value = false;
  mapClickFeedback.value = '';

  if (mapClickScope.value === 'europe') {
    const eur = localizedCountries.value.filter(c => c.continent === 'Europe');
    mapClickCountriesPool.value = eur;
    mapClickQueue.value = [...eur].sort(() => 0.5 - Math.random());
    mapClickCenter.value = [54.0, 15.0];
    mapClickZoom.value = 3.8;
  } else {
    const sample = [...localizedCountries.value].sort(() => 0.5 - Math.random()).slice(0, 25);
    mapClickCountriesPool.value = sample;
    mapClickQueue.value = [...sample].sort(() => 0.5 - Math.random());
    mapClickCenter.value = [20.0, 10.0];
    mapClickZoom.value = 2;
  }
};

const getMapClickRadius = (country) => {
  if (currentMapClickTarget.value && mapClickWrongTries.value >= 3 && country.iso === currentMapClickTarget.value.iso) {
    return 14; // Grossit le point cible si le joueur s'est trompé 3 fois pour l'aider !
  }
  return mapClickScope.value === 'europe' ? 8 : 7;
};

const getMapClickFillColor = (country) => {
  const st = mapClickStatus.value[country.iso];
  if (st === 'first') return '#10b981'; // Vert du 1er coup
  if (st === 'second') return '#f59e0b'; // Jaune au 2e essai
  if (st === 'late') return '#ef4444'; // Rouge à partir du 3e essai
  if (currentMapClickTarget.value && mapClickWrongTries.value >= 3 && country.iso === currentMapClickTarget.value.iso) {
    return '#3b82f6'; // Indice visuel bleu
  }
  return '#ffffff';
};

const getMapClickBorderColor = (country) => {
  if (mapClickStatus.value[country.iso]) return '#ffffff';
  return '#475569';
};

const onCountryMarkerClick = (clickedCountry) => {
  if (mapClickFinished.value || !currentMapClickTarget.value) return;
  if (mapClickStatus.value[clickedCountry.iso]) return;

  if (clickedCountry.iso === currentMapClickTarget.value.iso) {
    mapClickFeedback.value = '';
    if (mapClickWrongTries.value === 0) {
      mapClickStatus.value[clickedCountry.iso] = 'first';
      mapClickScore.value++;
    } else if (mapClickWrongTries.value === 1) {
      mapClickStatus.value[clickedCountry.iso] = 'second';
    } else {
      mapClickStatus.value[clickedCountry.iso] = 'late';
    }
    playSound('correct');
    mapClickWrongTries.value = 0;

    if (mapClickIndex.value < mapClickQueue.value.length - 1) {
      mapClickIndex.value++;
    } else {
      mapClickFinished.value = true;
      playSound('victory');
      sauvegarderScore('Cliquez sur la Carte', mapClickScore.value, mapClickQueue.value.length);
    }
  } else {
    mapClickWrongTries.value++;
    playSound('wrong');
    mapClickFeedback.value = locale.value === 'fr'
      ? `❌ Ceci est : ${clickedCountry.name}. Cherchez ${currentMapClickTarget.value.name} !`
      : `❌ That is ${clickedCountry.name}. Find ${currentMapClickTarget.value.name}!`;
  }
};

// =========================================================
// MODE : GRILLE DES DRAPEAUX
// =========================================================
const flagGridContinent = ref('');
const flagGridInputs = ref({});
const flagGridFound = ref({});
const flagGridTime = ref(900);
const flagGridFinished = ref(false);
const flagInputRefs = ref({});
let flagGridInterval = null;

const setFlagInputRef = (el, index) => {
  if (el) flagInputRefs.value[index] = el;
};

const flagGridCountries = computed(() => {
  let list = localizedCountries.value;
  if (flagGridContinent.value) {
    list = list.filter(c => c.continent === flagGridContinent.value);
  }
  return list;
});

const flagGridFoundCount = computed(() =>
  flagGridCountries.value.filter(c => flagGridFound.value[c.iso]).length
);

const stopFlagGridTimer = () => {
  if (flagGridInterval) {
    clearInterval(flagGridInterval);
    flagGridInterval = null;
  }
};

const initFlagGrid = () => {
  stopFlagGridTimer();
  flagGridInputs.value = {};
  flagGridFound.value = {};
  flagGridFinished.value = false;
  flagInputRefs.value = {};
  flagGridTime.value = flagGridContinent.value ? 300 : 900;

  flagGridInterval = setInterval(() => {
    if (flagGridTime.value > 0) {
      flagGridTime.value--;
    } else {
      finishFlagGrid();
    }
  }, 1000);
};

const checkSingleFlagInput = async (country, currentIndex) => {
  if (flagGridFinished.value || flagGridFound.value[country.iso]) return;
  const userTyped = normalizeStr(flagGridInputs.value[country.iso] || '');
  if (!userTyped) return;

  const validNames = [
    normalizeStr(country.name_fr),
    normalizeStr(country.name_en),
    ...(country.aliases || []).map(a => normalizeStr(a))
  ];

  if (validNames.includes(userTyped)) {
    flagGridFound.value[country.iso] = true;
    flagGridInputs.value[country.iso] = country.name;
    playSound('correct');

    if (flagGridFoundCount.value === flagGridCountries.value.length) {
      finishFlagGrid();
      return;
    }

    await nextTick();
    const total = flagGridCountries.value.length;
    for (let step = 1; step < total; step++) {
      const nextIdx = (currentIndex + step) % total;
      const nextCountry = flagGridCountries.value[nextIdx];
      if (!flagGridFound.value[nextCountry.iso] && flagInputRefs.value[nextIdx]) {
        flagInputRefs.value[nextIdx].focus();
        break;
      }
    }
  }
};

const finishFlagGrid = () => {
  if (flagGridFinished.value) return;
  flagGridFinished.value = true;
  stopFlagGridTimer();
  playSound('victory');
  sauvegarderScore('Grille Drapeaux', flagGridFoundCount.value, flagGridCountries.value.length);
};

// =========================================================
// MODES QCM (CAPITALES, DRAPEAUX, CULTURE) + DUEL D'AMI
// =========================================================
const qcmCurrentType = ref('capital'); 
const cultureSubType = ref('lang');
const qcmQuestionsList = ref([]);
const qcmMaxQuestions = 15;
const qcmIndex = ref(0);
const qcmScore = ref(0);
const qcmOptions = ref([]); 
const qcmFini = ref(false);
const qcmSelected = ref(null);
const qcmIsAnswered = ref(false);
const qcmCorrectAnswer = ref('');

const duelChallenge = ref(null);
const activeDuelTarget = ref(null);
const activeDuelFrom = ref('');
const duelLinkCopied = ref(false);

const initQcm = (type, customQuestionIds = null) => {
  qcmCurrentType.value = type;
  if (customQuestionIds && customQuestionIds.length > 0) {
    qcmQuestionsList.value = customQuestionIds;
  } else {
    const shuffled = [...countriesData.value].sort(() => 0.5 - Math.random());
    qcmQuestionsList.value = shuffled.slice(0, Math.min(qcmMaxQuestions, shuffled.length)).map(c => c.id);
  }
  qcmIndex.value = 0; 
  qcmScore.value = 0; 
  qcmFini.value = false;
  genererOptionsQcm();
};

const copyDuelQcmLink = async () => {
  try {
    const savedUser = localStorage.getItem('geolearn_user');
    let myName = 'Joueur';
    if (savedUser) {
      const p = JSON.parse(savedUser);
      myName = p.username || p.name || p.pseudo || 'Joueur';
    }
    const payload = `${qcmCurrentType.value}:${qcmQuestionsList.value.join('-')}:${qcmScore.value}:${encodeURIComponent(myName)}`;
    const link = `${window.location.origin}/quiz?duel=${btoa(payload)}`;
    await navigator.clipboard.writeText(link);
    duelLinkCopied.value = true;
    setTimeout(() => { duelLinkCopied.value = false; }, 3500);
  } catch (e) {}
};

const startDuelQcm = () => {
  if (!duelChallenge.value) return;
  activeDuelTarget.value = duelChallenge.value.score;
  activeDuelFrom.value = duelChallenge.value.from;
  currentMode.value = 'qcm';
  initQcm(duelChallenge.value.type, duelChallenge.value.ids);
};

const genererOptionsQcm = () => {
  qcmIsAnswered.value = false;
  qcmSelected.value = null;
  const baseId = qcmQuestionsList.value[qcmIndex.value];
  const baseCountry = getCountry(baseId);

  if (qcmCurrentType.value === 'culture') {
    const cycle = ['population', 'lang', 'currency'];
    cultureSubType.value = cycle[qcmIndex.value % 3];

    if (cultureSubType.value === 'population') {
      const chosen = [baseCountry];
      const pool = [...localizedCountries.value].sort(() => 0.5 - Math.random());
      for (const candidate of pool) {
        if (chosen.length >= 4) break;
        const isDistinct = chosen.every(
          c => c.id !== candidate.id && Math.abs(c.populationNumeric - candidate.populationNumeric) > 250_000
        );
        if (isDistinct) chosen.push(candidate);
      }
      const mostPopulous = [...chosen].sort((a, b) => b.populationNumeric - a.populationNumeric)[0];
      qcmCorrectAnswer.value = mostPopulous.id;
      qcmOptions.value = chosen.map(c => c.id).sort(() => 0.5 - Math.random());
      return;
    }

    qcmCorrectAnswer.value = baseId;
    const field = cultureSubType.value === 'lang' ? 'lang' : 'currency';
    const usedValues = new Set([baseCountry[field]]);
    const distractors = [];
    const pool = [...localizedCountries.value].sort(() => 0.5 - Math.random());

    for (const candidate of pool) {
      if (distractors.length >= 3) break;
      const val = candidate[field];
      if (candidate.id !== baseId && val && val !== '-' && !usedValues.has(val)) {
        usedValues.add(val);
        distractors.push(candidate.id);
      }
    }
    qcmOptions.value = [baseId, ...distractors].sort(() => 0.5 - Math.random());
    return;
  }

  qcmCorrectAnswer.value = baseId;
  const sameContinent = countriesData.value
    .filter(c => c.id !== baseId && c.continent_en === baseCountry.continent_en)
    .map(c => c.id);
    
  const distractors = [...sameContinent].sort(() => 0.5 - Math.random()).slice(0, 3);
  
  while (distractors.length < 3) {
    const randomC = countriesData.value[Math.floor(Math.random() * countriesData.value.length)].id;
    if (randomC !== baseId && !distractors.includes(randomC)) {
      distractors.push(randomC);
    }
  }
  
  qcmOptions.value = [baseId, ...distractors].sort(() => 0.5 - Math.random());
};

const getOptionLabel = (choixId) => {
  const c = getCountry(choixId);
  if (!c) return '';
  if (qcmCurrentType.value === 'capital') return c.capital;
  if (qcmCurrentType.value === 'flag') return c.name;
  if (cultureSubType.value === 'population') return c.name;
  if (cultureSubType.value === 'lang') return c.lang;
  return c.currency;
};

const verifierReponseQcm = (choixId) => {
  if (qcmIsAnswered.value) return; 
  qcmSelected.value = choixId;
  qcmIsAnswered.value = true;

  if (choixId === qcmCorrectAnswer.value) {
    qcmScore.value++;
    playSound('correct');
  } else {
    playSound('wrong');
  }

  setTimeout(() => {
    if (qcmIndex.value < qcmMaxQuestions - 1) {
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
      sauvegarderScore(modeName, qcmScore.value, qcmMaxQuestions);
    }
  }, 1150);
};

// =========================================================
// MODE FLASHCARDS 3D
// =========================================================
const flashcardIndex = ref(0);
const flashcardFlipped = ref(false);
const flashcardContinent = ref('');
const flashcardFrontPrompt = ref('flag');
const flashcardOrderIds = ref([]);

const toggleFlashcardFlip = () => {
  flashcardFlipped.value = !flashcardFlipped.value;
  playSound('flip');
};

const initFlashcards = () => {
  flashcardContinent.value = '';
  resetFlashcards();
};

const resetFlashcards = () => {
  let list = localizedCountries.value;
  if (flashcardContinent.value) {
    list = list.filter(c => c.continent === flashcardContinent.value);
  }
  flashcardOrderIds.value = list.map(c => c.id);
  flashcardIndex.value = 0;
  flashcardFlipped.value = false;
};

const shuffleFlashcards = () => {
  flashcardOrderIds.value = [...flashcardOrderIds.value].sort(() => 0.5 - Math.random());
  flashcardIndex.value = 0;
  flashcardFlipped.value = false;
};

const activeFlashcards = computed(() => {
  if (flashcardOrderIds.value.length === 0) return localizedCountries.value;
  return flashcardOrderIds.value.map(id => getCountry(id)).filter(Boolean);
});

const currentFlashcard = computed(() => activeFlashcards.value[flashcardIndex.value] || null);

const flashcardSuivante = () => { 
  if (flashcardIndex.value < activeFlashcards.value.length - 1) { 
    flashcardFlipped.value = false; 
    setTimeout(() => { flashcardIndex.value++; }, 160); 
  } 
};

const flashcardPrecedente = () => { 
  if (flashcardIndex.value > 0) { 
    flashcardFlipped.value = false; 
    setTimeout(() => { flashcardIndex.value--; }, 160); 
  } 
};

// =========================================================
// MODE CHRONO CARTE (CLAVIER EUROPE & MONDE)
// =========================================================
const isChronoStarted = ref(false);
const chronoRegion = ref('europe');
const chronoTemps = ref(180);
const chronoInput = ref('');
const paysTrouves = ref([]);
const chronoFini = ref(false);
let intervalId = null;

const mapZoom = ref(3.8);
const mapCenter = ref([50.0, 10.0]);

const selectChronoMode = (region) => {
  chronoRegion.value = region;
  if (region === 'europe') {
    chronoTemps.value = 180;
    mapCenter.value = [54.0, 15.0];
    mapZoom.value = 3.8;
  } else {
    chronoTemps.value = 900;
    mapCenter.value = [20.0, 10.0];
    mapZoom.value = 2;
  }
};

const targetCountries = computed(() => {
  if (chronoRegion.value === 'europe') {
    return localizedCountries.value.filter(c => c.continent === 'Europe').sort((a, b) => a.name.localeCompare(b.name));
  }
  return [...localizedCountries.value].sort((a, b) => a.name.localeCompare(b.name));
});

const getMarkerRadius = (iso) => {
  if (chronoRegion.value === 'europe') {
    const micro = ['ad', 'li', 'mt', 'mc', 'sm', 'va']; 
    const massive = ['ru', 'fr', 'de', 'es', 'se', 'no', 'fi', 'pl', 'it', 'gb', 'ua', 'ro', 'by']; 
    if (micro.includes(iso)) return 5;
    if (massive.includes(iso)) return 14;
    return 9;
  }
  return 6;
};

const demarrerChrono = () => {
  isChronoStarted.value = true;
  arreterChrono();
  chronoInput.value = '';
  paysTrouves.value = [];
  chronoFini.value = false;
  
  intervalId = setInterval(() => {
    if (chronoTemps.value > 0) {
      chronoTemps.value--;
    } else {
      chronoFini.value = true;
      arreterChrono();
      playSound('victory');
      sauvegarderScore(chronoRegion.value === 'europe' ? 'Défi Europe' : 'Défi Monde', paysTrouves.value.length, targetCountries.length);
    }
  }, 1000);
};

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const verifierSaisieChrono = () => {
  if (chronoFini.value) return;
  const inputNormalise = normalizeStr(chronoInput.value);
  
  const pays = targetCountries.value.find(c => {
    const mainName = normalizeStr(c.name);
    const altNames = (c.aliases || []).map(a => normalizeStr(a));
    return mainName === inputNormalise || altNames.includes(inputNormalise);
  });

  if (pays && !paysTrouves.value.includes(pays.iso)) {
    paysTrouves.value.push(pays.iso); 
    chronoInput.value = ''; 
    playSound('correct');
    
    if (paysTrouves.value.length === targetCountries.value.length) {
      chronoFini.value = true;
      arreterChrono();
      playSound('victory');
      sauvegarderScore(chronoRegion.value === 'europe' ? 'Défi Europe' : 'Défi Monde', paysTrouves.value.length, targetCountries.length);
    }
  }
};

const arreterChrono = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

onMounted(() => {
  if (route.query.duel) {
    try {
      const decoded = atob(route.query.duel);
      const [type, idsStr, targetScore, fromName] = decoded.split(':');
      const ids = idsStr.split('-').map(Number).filter(Boolean);
      if (ids.length > 0) {
        duelChallenge.value = {
          type: type || 'capital',
          ids,
          score: Number(targetScore || 0),
          from: decodeURIComponent(fromName || 'Ami')
        };
      }
    } catch (e) {}
  }
});

onUnmounted(() => {
  arreterChrono();
  stopFlagGridTimer();
});
</script>

<style scoped>
.leaflet-container {
  z-index: 10;
  background-color: #aad3df !important;
}
:global(.dark) .leaflet-container,
:global(body.dark-mode) .leaflet-container {
  background-color: #1e293b !important;
}

.flip-scene {
  perspective: 1500px;
  margin-bottom: 1.5rem;
}

.flip-card-inner {
  display: grid;
  grid-template-columns: 1fr;
  position: relative;
  width: 100%;
  min-height: 540px;
  transform-style: preserve-3d;
  transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
  cursor: pointer;
}

.flip-card-inner.is-flipped {
  transform: rotateY(180deg);
}

.flip-card-face {
  grid-area: 1 / 1;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.flip-card-front {
  transform: rotateY(0deg);
}

.flip-card-back {
  transform: rotateY(180deg);
}
</style>