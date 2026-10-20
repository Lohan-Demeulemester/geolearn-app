<template>
  <div class="max-w-6xl mx-auto space-y-8">
    
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-500 mb-2">{{ t('quiz.title') }}</h2>
        <p class="text-gray-600 dark:text-gray-400 transition-colors duration-500">{{ t('quiz.subtitle') }}</p>
      </div>
      <button 
        v-if="currentMode !== 'menu'" 
        @click="retourMenu"
        class="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-5 py-2 rounded-full font-medium transition-colors flex items-center gap-2 cursor-pointer"
      >
        <i class="fas fa-arrow-left"></i> {{ t('quiz.back') }}
      </button>
    </div>

    <!-- ========================================== -->
    <!-- MENU PRINCIPAL DES 5 MODES DE JEU          -->
    <!-- ========================================== -->
    <div v-if="currentMode === 'menu'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mt-8">
      <!-- 1. QCM Capitales -->
      <div @click="lancerMode('qcm', 'capital')" class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center group">
        <div class="w-14 h-14 bg-blue-100 dark:bg-gray-700 text-brandBlue dark:text-blue-400 rounded-full flex items-center justify-center text-xl mx-auto mb-4 group-hover:scale-110 transition-transform">🏛️</div>
        <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">{{ t('home.mode_caps_title') }}</h3>
        <p class="text-gray-500 dark:text-gray-400 text-xs">{{ t('home.mode_caps_desc') }}</p>
      </div>

      <!-- 2. QCM Drapeaux -->
      <div @click="lancerMode('qcm', 'flag')" class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center group">
        <div class="w-14 h-14 bg-orange-100 dark:bg-gray-700 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center text-xl mx-auto mb-4 group-hover:scale-110 transition-transform">🚩</div>
        <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">{{ t('home.mode_flags_title') }}</h3>
        <p class="text-gray-500 dark:text-gray-400 text-xs">{{ t('home.mode_flags_desc') }}</p>
      </div>

      <!-- 3. Grille des Drapeaux -->
      <div @click="lancerMode('flag-grid')" class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border-2 border-emerald-500/30 dark:border-emerald-500/30 hover:border-emerald-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center group relative">
        <span class="absolute top-3 right-3 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
          {{ locale === 'fr' ? 'Nouveau' : 'New' }}
        </span>
        <div class="w-14 h-14 bg-emerald-100 dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-xl mx-auto mb-4 group-hover:scale-110 transition-transform">🏳️</div>
        <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">
          {{ locale === 'fr' ? 'Grille des Drapeaux' : 'World Flag Grid' }}
        </h3>
        <p class="text-gray-500 dark:text-gray-400 text-xs">
          {{ locale === 'fr'
            ? 'Tous les drapeaux devant vous : remplissez le nom du pays sous chaque drapeau pour valider la carte en vert !'
            : 'All flags in front of you: type the country name under each flag to turn the card green!' }}
        </p>
      </div>
      
      <!-- 4. Flashcards 3D -->
      <div @click="lancerMode('flashcards')" class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center group">
        <div class="w-14 h-14 bg-green-100 dark:bg-gray-700 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xl mx-auto mb-4 group-hover:scale-110 transition-transform">🃏</div>
        <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">{{ t('home.mode_flash_title') }}</h3>
        <p class="text-gray-500 dark:text-gray-400 text-xs">{{ t('home.mode_flash_desc') }}</p>
      </div>

      <!-- 5. Défis Chronométrés Carte -->
      <div @click="lancerMode('chrono')" class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center group">
        <div class="w-14 h-14 bg-red-100 dark:bg-gray-700 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center text-xl mx-auto mb-4 group-hover:scale-110 transition-transform">⏱️</div>
        <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2">
          {{ locale === 'fr' ? 'Défis Chronométrés' : 'Timed Challenges' }}
        </h3>
        <p class="text-gray-500 dark:text-gray-400 text-xs">
          {{ locale === 'fr' ? 'Testez votre rapidité sur la carte interactive : Europe ou Monde entier.' : 'Test your speed on the interactive map: Europe or World.' }}
        </p>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- MODE 1 & 2 : QCM (CAPITALES & DRAPEAUX)    -->
    <!-- ========================================== -->
    <div v-if="currentMode === 'qcm'" class="max-w-2xl mx-auto mt-8">
      <div v-if="!qcmFini" class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-center mb-8 text-sm font-medium text-gray-500 dark:text-gray-400">
          <span>{{ t('quiz.question_x_of_y', { current: qcmIndex + 1, total: qcmMaxQuestions }) }}</span>
          <span>{{ t('quiz.score', { score: qcmScore }) }}</span>
        </div>
        
        <h3 v-if="qcmCurrentType === 'capital'" class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8 flex flex-col items-center gap-4">
          {{ t('quiz.ask_capital', { country: getLocalizedName(qcmQuestionsList[qcmIndex]) }) }}
          <img :src="`https://flagcdn.com/w80/${getIso(qcmQuestionsList[qcmIndex])}.png`" class="h-10 w-auto shadow-sm rounded-sm" alt="drapeau">
        </h3>
        <div v-else class="text-center mb-8">
          <img :src="`https://flagcdn.com/w160/${getIso(qcmQuestionsList[qcmIndex])}.png`" class="h-24 w-auto mx-auto mb-6 shadow-md rounded-md" alt="drapeau">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ t('quiz.ask_flag') }}
          </h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            v-for="choixId in qcmOptions" :key="choixId"
            @click="verifierReponseQcm(choixId)"
            :disabled="qcmIsAnswered"
            class="p-4 rounded-xl border-2 font-medium transition-all duration-300 cursor-pointer"
            :class="[
              !qcmIsAnswered ? 'border-gray-200 hover:border-brandBlue hover:bg-blue-50 text-gray-800 dark:border-gray-600 dark:hover:border-brandBlue dark:hover:bg-gray-700 dark:text-white' : '',
              qcmIsAnswered && choixId === qcmCorrectAnswer ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/50 dark:border-green-500 dark:text-green-300 scale-[1.02] shadow-sm' : '',
              qcmIsAnswered && choixId === qcmSelected && choixId !== qcmCorrectAnswer ? 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/50 dark:border-red-500 dark:text-red-300 scale-95' : '',
              qcmIsAnswered && choixId !== qcmSelected && choixId !== qcmCorrectAnswer ? 'border-gray-100 text-gray-400 dark:border-gray-800 dark:text-gray-600 opacity-50 cursor-not-allowed' : ''
            ]"
          >
            {{ qcmCurrentType === 'capital' ? getLocalizedCapital(choixId) : getLocalizedName(choixId) }}
          </button>
        </div>
      </div>
      
      <div v-else class="text-center py-12 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div class="text-6xl mb-4">🏆</div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('quiz.finished') }}</h3>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-6">{{ t('quiz.your_score', { score: qcmScore, total: qcmMaxQuestions }) }}</p>
        <button @click="lancerMode('qcm', qcmCurrentType)" class="bg-brandBlue text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition cursor-pointer">{{ t('quiz.replay') }}</button>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- MODE 3 : GRILLE DES DRAPEAUX (REMPLIR SOUS CHAQUE DRAPEAU)                -->
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
            ? `Vous avez identifié ${flagGridFoundCount} drapeaux sur ${flagGridCountries.length}. Les réponses manquantes sont affichées en rouge sous chaque drapeau.`
            : `You identified ${flagGridFoundCount} out of ${flagGridCountries.length} flags. Missed answers are shown in red below each flag.` }}
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
    <!-- MODE 4 : FLASHCARDS 3D ENRICHIES (AVEC LA VRAIE FICHE PAYS AU VERSO)      -->
    <!-- ========================================================================= -->
    <div v-if="currentMode === 'flashcards'" class="max-w-xl mx-auto mt-6 space-y-6">
      
      <!-- BARRE D'OUTILS SUPÉRIEURE : CONTINENT + INDICE RECTO + MÉLANGER -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
        <!-- Filtre Continent -->
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

        <!-- Choix de l'indice affiché au Recto -->
        <select 
          v-model="flashcardFrontPrompt"
          @change="flashcardFlipped = false"
          class="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-none"
        >
          <option value="flag">{{ locale === 'fr' ? 'Recto : Drapeau' : 'Front: Flag' }}</option>
          <option value="country">{{ locale === 'fr' ? 'Recto : Nom du pays' : 'Front: Country Name' }}</option>
          <option value="capital">{{ locale === 'fr' ? 'Recto : Capitale' : 'Front: Capital' }}</option>
        </select>

        <!-- Bouton Mélanger -->
        <button 
          type="button"
          @click="shuffleFlashcards"
          class="bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white hover:text-blue-600 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer flex items-center gap-2"
        >
          <i class="fas fa-random"></i> {{ locale === 'fr' ? 'Mélanger' : 'Shuffle' }}
        </button>
      </div>

      <!-- FILTRE DE RÉVISION (TOUTES / À REVOIR / MAÎTRISÉES) + COMPTEUR -->
      <div class="flex flex-wrap items-center justify-between gap-2 px-1">
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            @click="setFlashcardFilter('all')"
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
            :class="flashcardFilterMode === 'all' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'"
          >
            {{ locale === 'fr' ? 'Toutes' : 'All' }} ({{ baseFlashcardList.length }})
          </button>
          <button
            type="button"
            @click="setFlashcardFilter('review')"
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
            :class="flashcardFilterMode === 'review' ? 'bg-amber-500 text-white' : 'bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 border border-gray-200 dark:border-gray-700'"
          >
            ⏳ {{ locale === 'fr' ? 'À revoir' : 'To Review' }} ({{ reviewCount }})
          </button>
          <button
            type="button"
            @click="setFlashcardFilter('mastered')"
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
            :class="flashcardFilterMode === 'mastered' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 border border-gray-200 dark:border-gray-700'"
          >
            ✓ {{ locale === 'fr' ? 'Maîtrisées' : 'Mastered' }} ({{ masteredCount }})
          </button>
        </div>

        <span v-if="currentFlashcard" class="text-sm font-extrabold text-gray-500 dark:text-gray-400">
          {{ t('quiz.card_x_of_y', { current: flashcardIndex + 1, total: activeFlashcards.length }) }}
        </span>
      </div>

      <!-- BARRE DE PROGRESSION DE LA SESSION -->
      <div v-if="currentFlashcard" class="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300"
          :style="{ width: `${((flashcardIndex + 1) / activeFlashcards.length) * 100}%` }"
        ></div>
      </div>

      <!-- ÉTAT VIDE SI AUCUNE CARTE DANS LE FILTRE ACTUEL -->
      <div v-if="!currentFlashcard" class="bg-white dark:bg-gray-800 rounded-3xl p-10 text-center border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
        <div class="text-4xl">🎉</div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ locale === 'fr' ? 'Aucune carte dans cette catégorie !' : 'No cards in this category!' }}
        </h3>
        <button
          type="button"
          @click="setFlashcardFilter('all')"
          class="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition cursor-pointer"
        >
          {{ locale === 'fr' ? 'Afficher toutes les cartes' : 'Show all cards' }}
        </button>
      </div>

      <!-- ================================================================= -->
      <!-- SCÈNE 3D FLIP : LA VRAIE CARTE PAYS RECTO / VERSO                 -->
      <!-- ================================================================= -->
      <div v-else class="flip-scene w-full select-none">
        <div 
          class="flip-card-inner" 
          :class="{ 'is-flipped': flashcardFlipped }"
          @click="flashcardFlipped = !flashcardFlipped"
        >
          <!-- ==================== FACE RECTO (QUESTION DE RÉVISION) ==================== -->
          <div class="flip-card-face flip-card-front bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-between text-center">
            
            <!-- En-tête du recto : Badge Sous-région + Statut éventuel -->
            <div class="w-full flex items-center justify-between">
              <span class="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300">
                {{ currentFlashcard.subregion || currentFlashcard.continent }}
              </span>

              <span 
                v-if="flashcardStatus[currentFlashcard.iso] === 'mastered'"
                class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
              >
                ✓ {{ locale === 'fr' ? 'Maîtrisée' : 'Mastered' }}
              </span>
              <span 
                v-else-if="flashcardStatus[currentFlashcard.iso] === 'review'"
                class="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
              >
                ⏳ {{ locale === 'fr' ? 'À revoir' : 'To Review' }}
              </span>
            </div>

            <!-- Contenu central selon le mode d'indice choisi -->
            <div class="my-auto flex flex-col items-center justify-center py-6">
              <!-- Indice 1 : Drapeau -->
              <template v-if="flashcardFrontPrompt === 'flag'">
                <img 
                  :src="`https://flagcdn.com/w320/${currentFlashcard.iso}.png`" 
                  :alt="currentFlashcard.name"
                  class="h-36 w-auto rounded-xl shadow-md mb-6 border border-gray-200 dark:border-gray-700 object-contain"
                >
                <p class="text-lg font-bold text-gray-700 dark:text-gray-200">
                  {{ locale === 'fr' ? 'Quel est ce pays et sa capitale ?' : 'What is this country and its capital?' }}
                </p>
              </template>

              <!-- Indice 2 : Nom du pays -->
              <template v-else-if="flashcardFrontPrompt === 'country'">
                <div class="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300 flex items-center justify-center text-3xl mb-4">
                  🌍
                </div>
                <h3 class="text-4xl font-black text-gray-900 dark:text-white mb-3">
                  {{ currentFlashcard.name }}
                </h3>
                <p class="text-base font-medium text-gray-500 dark:text-gray-400">
                  {{ locale === 'fr' ? 'Devinez sa capitale, son drapeau et ses infos clés !' : 'Guess its capital, flag, and key facts!' }}
                </p>
              </template>

              <!-- Indice 3 : Capitale -->
              <template v-else>
                <div class="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-gray-700 text-amber-600 dark:text-amber-300 flex items-center justify-center text-3xl mb-4">
                  🏛️
                </div>
                <span class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  {{ t('common.capital') }}
                </span>
                <h3 class="text-4xl font-black text-gray-900 dark:text-white mb-3">
                  {{ currentFlashcard.capital }}
                </h3>
                <p class="text-base font-medium text-gray-500 dark:text-gray-400">
                  {{ locale === 'fr' ? 'De quel pays est-ce la capitale ?' : 'Which country is this the capital of?' }}
                </p>
              </template>
            </div>

            <!-- Pied du recto -->
            <div class="w-full pt-4 border-t border-gray-100 dark:border-gray-700/70 flex items-center justify-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
              <i class="fas fa-sync-alt"></i>
              <span>{{ locale === 'fr' ? 'Cliquez ou appuyez sur Espace pour retourner la fiche complète ↻' : 'Click or press Space to flip for full country card ↻' }}</span>
            </div>
          </div>

          <!-- ==================== FACE VERSO (LA VRAIE FICHE COMPLÈTE + FUN FACT) ==================== -->
          <div class="flip-card-face flip-card-back bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col justify-between text-left">
            
            <div>
              <!-- En-tête du verso : Drapeau + Sous-région + Nom du pays -->
              <div class="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-gray-100 dark:border-gray-700">
                <div class="flex items-center gap-3.5">
                  <img 
                    :src="`https://flagcdn.com/w160/${currentFlashcard.iso}.png`" 
                    :alt="currentFlashcard.name"
                    class="h-12 w-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 shrink-0"
                  >
                  <div>
                    <span class="text-[11px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                      {{ currentFlashcard.subregion }}
                    </span>
                    <h3 class="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                      {{ currentFlashcard.name }}
                    </h3>
                  </div>
                </div>

                <span class="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold shrink-0">
                  ↻ {{ locale === 'fr' ? 'Recto' : 'Front' }}
                </span>
              </div>

              <!-- Grille des 6 informations clés (identique à Explorer.vue) -->
              <div class="grid grid-cols-2 gap-3 mb-5">
                <div class="bg-gray-50 dark:bg-gray-900/70 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/70">
                  <span class="text-xs font-semibold text-gray-400 dark:text-gray-500 block mb-0.5">
                    🏛️ {{ t('common.capital') }}
                  </span>
                  <strong class="text-sm font-bold text-gray-900 dark:text-white">
                    {{ currentFlashcard.capital }}
                  </strong>
                </div>

                <div class="bg-gray-50 dark:bg-gray-900/70 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/70">
                  <span class="text-xs font-semibold text-gray-400 dark:text-gray-500 block mb-0.5">
                    👥 {{ locale === 'fr' ? 'Habitants' : 'Population' }}
                  </span>
                  <strong class="text-sm font-bold text-gray-900 dark:text-white">
                    {{ currentFlashcard.population }}
                  </strong>
                </div>

                <div class="bg-gray-50 dark:bg-gray-900/70 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/70">
                  <span class="text-xs font-semibold text-gray-400 dark:text-gray-500 block mb-0.5">
                    🗣️ {{ locale === 'fr' ? 'Langue(s) officielle(s)' : 'Official Language(s)' }}
                  </span>
                  <strong class="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">
                    {{ currentFlashcard.lang }}
                  </strong>
                </div>

                <div class="bg-gray-50 dark:bg-gray-900/70 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/70">
                  <span class="text-xs font-semibold text-gray-400 dark:text-gray-500 block mb-0.5">
                    💶 {{ locale === 'fr' ? 'Monnaie' : 'Currency' }}
                  </span>
                  <strong class="text-sm font-bold text-gray-900 dark:text-white">
                    {{ currentFlashcard.currency }}
                  </strong>
                </div>

                <div class="bg-gray-50 dark:bg-gray-900/70 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/70">
                  <span class="text-xs font-semibold text-gray-400 dark:text-gray-500 block mb-0.5">
                    📐 {{ locale === 'fr' ? 'Superficie' : 'Area' }}
                  </span>
                  <strong class="text-sm font-bold text-gray-900 dark:text-white">
                    {{ currentFlashcard.area }}
                  </strong>
                </div>

                <div class="bg-gray-50 dark:bg-gray-900/70 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/70">
                  <span class="text-xs font-semibold text-gray-400 dark:text-gray-500 block mb-0.5">
                    🧭 {{ locale === 'fr' ? 'Code ISO / GPS' : 'ISO / Coordinates' }}
                  </span>
                  <strong class="text-sm font-bold text-gray-900 dark:text-white">
                    {{ currentFlashcard.iso3 }} ({{ currentFlashcard.lat.toFixed(1) }}°, {{ currentFlashcard.lng.toFixed(1) }}°)
                  </strong>
                </div>
              </div>

              <!-- Encadré Fun Fact -->
              <div class="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/60 rounded-2xl p-4">
                <div class="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300 mb-1.5">
                  <span>💡 {{ locale === 'fr' ? 'Le saviez-vous ? (Fun Fact)' : 'Did you know? (Fun Fact)' }}</span>
                </div>
                <p class="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                  {{ currentFlashcard.fact }}
                </p>
              </div>
            </div>

            <!-- Boutons d'auto-évaluation en bas du verso -->
            <div class="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-gray-100 dark:border-gray-700/70">
              <button
                type="button"
                @click.stop="markCardStatus(currentFlashcard.iso, 'review')"
                class="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm border transition cursor-pointer flex items-center justify-center gap-1.5"
                :class="flashcardStatus[currentFlashcard.iso] === 'review'
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100'"
              >
                ⏳ {{ locale === 'fr' ? 'À revoir' : 'Need Review' }}
              </button>

              <button
                type="button"
                @click.stop="markCardStatus(currentFlashcard.iso, 'mastered')"
                class="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm border transition cursor-pointer flex items-center justify-center gap-1.5"
                :class="flashcardStatus[currentFlashcard.iso] === 'mastered'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'"
              >
                ✓ {{ locale === 'fr' ? 'Maîtrisée !' : 'Mastered!' }}
              </button>
            </div>

          </div>
        </div>
      </div>

      <!-- CONTRÔLES DE NAVIGATION BAS DE PAGE -->
      <div v-if="currentFlashcard" class="flex items-center justify-center gap-5 pt-2">
        <button 
          @click="flashcardPrecedente" 
          :disabled="flashcardIndex === 0"
          class="w-12 h-12 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center shadow-xs"
        >
          <i class="fas fa-arrow-left"></i>
        </button>

        <button
          type="button"
          @click="flashcardFlipped = !flashcardFlipped"
          class="px-6 py-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white font-bold text-sm hover:border-blue-500 transition cursor-pointer shadow-xs"
        >
          ↻ {{ flashcardFlipped ? (locale === 'fr' ? 'Voir la question' : 'Show Question') : (locale === 'fr' ? 'Voir la fiche complète' : 'Show Full Card') }}
        </button>

        <button 
          @click="flashcardSuivante" 
          :disabled="flashcardIndex >= activeFlashcards.length - 1"
          class="w-12 h-12 bg-brandBlue text-white rounded-full hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center shadow-sm"
        >
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- MODE 5 : CHRONO CARTE (EUROPE & MONDE)     -->
    <!-- ========================================== -->
    <div v-if="currentMode === 'chrono'" class="max-w-4xl mx-auto mt-8">
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        
        <div v-if="!isChronoStarted && !chronoFini" class="text-center py-4 space-y-6">
          <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ locale === 'fr' ? 'Choisissez votre Défi Chrono' : 'Choose Your Timed Challenge' }}</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mt-6">
            <div 
              @click="selectChronoMode('europe')" 
              class="p-6 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col gap-3"
              :class="chronoRegion === 'europe' ? 'border-brandBlue bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-brandBlue'"
            >
              <div class="text-3xl">🇪🇺</div>
              <h4 class="font-bold text-lg text-gray-900 dark:text-white">{{ t('home.mode_chrono_title') }}</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ locale === 'fr' ? 'Retrouvez les 47 pays d\'Europe en 3 minutes.' : 'Find all 47 European countries in 3 minutes.' }}</p>
            </div>

            <div 
              @click="selectChronoMode('world')" 
              class="p-6 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col gap-3"
              :class="chronoRegion === 'world' ? 'border-brandBlue bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-brandBlue'"
            >
              <div class="text-3xl">🌍</div>
              <h4 class="font-bold text-lg text-gray-900 dark:text-white">{{ locale === 'fr' ? 'Défi Monde (196 pays)' : 'World Challenge (196 countries)' }}</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ locale === 'fr' ? 'Le test ultime : retrouvez le maximum de pays de la planète en 15 minutes !' : 'The ultimate test: find as many countries as possible in 15 minutes!' }}</p>
            </div>
          </div>

          <button @click="demarrerChrono" class="bg-brandBlue text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-md cursor-pointer mt-6">
            {{ t('quiz.start_timer') }}
          </button>
        </div>

        <div v-else>
          <div class="text-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {{ chronoRegion === 'europe' ? t('home.mode_chrono_title') : (locale === 'fr' ? 'Défi Mondial Chrono' : 'World Timed Challenge') }}
            </h3>
            
            <div class="w-full h-[480px] bg-[#aad3df] dark:bg-[#1e293b] rounded-2xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700 relative z-0">
              <l-map 
                ref="map" 
                v-model:zoom="mapZoom" 
                v-model:center="mapCenter" 
                :min-zoom="2"
                :max-zoom="7"
                :use-global-leaflet="false"
              >
                <l-tile-layer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  :no-wrap="true"
                  attribution='&copy; OpenStreetMap contributors'
                ></l-tile-layer>
                
                <l-circle-marker 
                  v-for="country in targetCountries" 
                  :key="'marker-' + country.id" 
                  :lat-lng="[country.lat, country.lng]"
                  :radius="getMarkerRadius(country.iso)"
                  :color="'#9ca3af'"
                  :weight="1.5"
                  :fill-color="paysTrouves.includes(country.iso) ? '#22c55e' : '#ffffff'"
                  :fill-opacity="0.9"
                >
                  <l-popup>
                    <div class="text-center p-1">
                      <template v-if="paysTrouves.includes(country.iso)">
                        <img :src="`https://flagcdn.com/w40/${country.iso}.png`" class="mx-auto mb-1 shadow-sm rounded-sm" :alt="country.name">
                        <strong class="text-sm font-bold text-green-600">{{ country.name }}</strong>
                      </template>
                      <template v-else>
                        <strong class="text-sm font-bold text-gray-500">???</strong>
                      </template>
                    </div>
                  </l-popup>
                </l-circle-marker>
              </l-map>
            </div>
          </div>

          <div class="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 bg-white dark:bg-gray-800 border-2 border-brandBlue/20 p-4 rounded-2xl shadow-sm">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-inner transition-colors duration-300" :class="chronoTemps <= 20 && !chronoFini ? 'bg-red-500 animate-pulse' : 'bg-brandBlue'">
                {{ formatTime(chronoTemps) }}
              </div>
              <div>
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ t('quiz.progression') }}</p>
                <h3 class="font-bold text-gray-900 dark:text-white text-xl">{{ t('quiz.found', { current: paysTrouves.length, total: targetCountries.length }) }}</h3>
              </div>
            </div>
            
            <div class="w-full md:w-1/2 relative">
              <input 
                v-model="chronoInput"
                @input="verifierSaisieChrono"
                :disabled="chronoFini"
                type="text" 
                :placeholder="locale === 'fr' ? 'Tapez le nom d\'un pays...' : 'Type a country name...'" 
                class="w-full pl-6 pr-4 py-4 rounded-xl border-2 border-brandBlue/40 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-brandBlue focus:ring-4 focus:ring-blue-100 dark:focus:ring-brandBlue/20 text-lg font-bold transition-all shadow-sm"
              >
            </div>
          </div>

          <div v-if="chronoFini" class="bg-blue-50 dark:bg-blue-900/20 text-brandBlue dark:text-blue-300 p-4 rounded-xl text-center font-medium mb-8">
            <span v-if="paysTrouves.length === targetCountries.length">{{ locale === 'fr' ? 'Incroyable ! Vous avez trouvé tous les pays ! 🎉' : 'Incredible! You found all countries! 🎉' }}</span>
            <span v-else>{{ t('quiz.time_up', { current: paysTrouves.length }) }}</span>
          </div>

          <div class="border-t border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm max-h-96 overflow-y-auto">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-sm">
              <div 
                v-for="country in targetCountries" :key="country.id"
                class="border-b border-r border-gray-200 dark:border-gray-700 p-2.5 flex items-center justify-between transition-colors duration-300"
                :class="[
                  paysTrouves.includes(country.iso) ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800/50',
                ]"
              >
                <template v-if="paysTrouves.includes(country.iso)">
                  <span class="font-bold text-green-700 dark:text-green-400 truncate pr-2">{{ country.name }}</span>
                  <img :src="`https://flagcdn.com/w20/${country.iso}.png`" class="w-4 h-auto shadow-sm rounded-sm shrink-0">
                </template>
                <template v-else-if="chronoFini">
                  <span class="text-red-500 dark:text-red-400 font-medium truncate pr-2">{{ country.name }}</span>
                </template>
                <template v-else>
                  <span class="text-gray-400 dark:text-gray-600">???</span>
                </template>
              </div>
            </div>
          </div>
          
          <div v-if="chronoFini" class="mt-8 text-center">
            <button @click="isChronoStarted = false; chronoFini = false;" class="bg-brandBlue text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition cursor-pointer">{{ t('quiz.retry') }}</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n'; 
import ALL_COUNTRIES from '../data/countries.js';

import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LPopup, LCircleMarker } from "@vue-leaflet/vue-leaflet";
import L from 'leaflet';

const { t, locale } = useI18n();

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const API_URL = 'https://geolearn-backend-bj65.onrender.com';

const countriesData = ref(ALL_COUNTRIES);

const currentMode = ref('menu'); 
const retourMenu = () => {
  currentMode.value = 'menu';
  arreterChrono();
  stopFlagGridTimer();
};

const lancerMode = (mode, type = null) => {
  arreterChrono();
  stopFlagGridTimer();
  currentMode.value = mode;
  if (mode === 'qcm') initQcm(type);
  if (mode === 'flag-grid') initFlagGrid();
  if (mode === 'flashcards') initFlashcards();
  if (mode === 'chrono') { isChronoStarted.value = false; paysTrouves.value = []; chronoFini.value = false; }
};

const sauvegarderScore = async (mode, score, maxScore) => {
  const savedUser = localStorage.getItem('geolearn_user');
  if (!savedUser) return; 
  try {
    const user = JSON.parse(savedUser);
    await fetch(`${API_URL}/api/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, mode: mode, score: score, max_score: maxScore })
    });
  } catch (error) {
    console.error("Erreur serveur scores:", error);
  }
};

const normalizeStr = (str = '') =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[-']/g, " ").toLowerCase().trim();

// Inclut désormais toutes les données enrichies (population, langue, monnaie, superficie, fun fact)
const localizedCountries = computed(() => {
  const isEn = locale.value === 'en';
  return countriesData.value.map(c => ({
    ...c,
    name: isEn ? c.name_en : c.name_fr,
    capital: isEn ? c.capital_en : c.capital_fr,
    continent: c.continent_en,
    subregion: isEn ? c.subregion_en : c.subregion_fr,
    population: isEn ? c.population_en : c.population_fr,
    lang: isEn ? c.lang_en : c.lang_fr,
    fact: isEn ? c.fact_en : c.fact_fr
  }));
});

const getCountry = (id) => localizedCountries.value.find(c => c.id === id);
const getLocalizedName = (id) => getCountry(id)?.name || '';
const getLocalizedCapital = (id) => getCountry(id)?.capital || '';
const getIso = (id) => getCountry(id)?.iso || '';

// =========================================================
// LOGIQUE MODE 3 : GRILLE DES DRAPEAUX
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
  sauvegarderScore('Grille Drapeaux', flagGridFoundCount.value, flagGridCountries.value.length);
};

// =========================================================
// LOGIQUE MODE 1 & 2 : QCM SUR 196 PAYS
// =========================================================
const qcmCurrentType = ref('capital'); 
const qcmQuestionsList = ref([]);
const qcmMaxQuestions = 15;
const qcmIndex = ref(0);
const qcmScore = ref(0);
const qcmOptions = ref([]); 
const qcmFini = ref(false);
const qcmSelected = ref(null);
const qcmIsAnswered = ref(false);
const qcmCorrectAnswer = ref('');

const initQcm = (type) => {
  qcmCurrentType.value = type;
  let shuffled = [...countriesData.value].sort(() => 0.5 - Math.random());
  qcmQuestionsList.value = shuffled.slice(0, Math.min(qcmMaxQuestions, shuffled.length)).map(c => c.id);
  qcmIndex.value = 0; 
  qcmScore.value = 0; 
  qcmFini.value = false;
  genererOptionsQcm();
};

const genererOptionsQcm = () => {
  qcmIsAnswered.value = false;
  qcmSelected.value = null;
  const correctId = qcmQuestionsList.value[qcmIndex.value];
  qcmCorrectAnswer.value = correctId;
  const correctCountry = getCountry(correctId);

  let sameContinent = countriesData.value
    .filter(c => c.id !== correctId && c.continent_en === correctCountry.continent_en)
    .map(c => c.id);
    
  let distractors = [...sameContinent].sort(() => 0.5 - Math.random()).slice(0, 3);
  
  while (distractors.length < 3) {
    const randomC = countriesData.value[Math.floor(Math.random() * countriesData.value.length)].id;
    if (randomC !== correctId && !distractors.includes(randomC)) {
      distractors.push(randomC);
    }
  }
  
  qcmOptions.value = [correctId, ...distractors].sort(() => 0.5 - Math.random());
};

const verifierReponseQcm = (choixId) => {
  if (qcmIsAnswered.value) return; 
  qcmSelected.value = choixId;
  qcmIsAnswered.value = true;
  if (choixId === qcmCorrectAnswer.value) qcmScore.value++;
  setTimeout(() => {
    if (qcmIndex.value < qcmMaxQuestions - 1) {
      qcmIndex.value++;
      genererOptionsQcm();
    } else {
      qcmFini.value = true;
      sauvegarderScore(qcmCurrentType.value === 'capital' ? 'QCM Capitales' : 'QCM Drapeaux', qcmScore.value, qcmMaxQuestions);
    }
  }, 1000);
};

// =========================================================
// LOGIQUE MODE 4 : FLASHCARDS 3D ENRICHIES
// =========================================================
const flashcardIndex = ref(0);
const flashcardFlipped = ref(false);
const flashcardContinent = ref('');
const flashcardFrontPrompt = ref('flag');
const flashcardFilterMode = ref('all'); // 'all' | 'review' | 'mastered'
const flashcardOrderIds = ref([]);
const flashcardStatus = ref({}); // { iso: 'review' | 'mastered' }

const initFlashcards = () => {
  flashcardContinent.value = '';
  flashcardFilterMode.value = 'all';
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

const setFlashcardFilter = (mode) => {
  flashcardFilterMode.value = mode;
  flashcardIndex.value = 0;
  flashcardFlipped.value = false;
};

// Liste de base (selon le continent sélectionné et l'ordre actuel)
const baseFlashcardList = computed(() => {
  if (flashcardOrderIds.value.length === 0) return localizedCountries.value;
  return flashcardOrderIds.value
    .map(id => getCountry(id))
    .filter(Boolean);
});

const reviewCount = computed(() =>
  baseFlashcardList.value.filter(c => flashcardStatus.value[c.iso] === 'review').length
);

const masteredCount = computed(() =>
  baseFlashcardList.value.filter(c => flashcardStatus.value[c.iso] === 'mastered').length
);

const activeFlashcards = computed(() => {
  if (flashcardFilterMode.value === 'review') {
    return baseFlashcardList.value.filter(c => flashcardStatus.value[c.iso] === 'review');
  }
  if (flashcardFilterMode.value === 'mastered') {
    return baseFlashcardList.value.filter(c => flashcardStatus.value[c.iso] === 'mastered');
  }
  return baseFlashcardList.value;
});

const currentFlashcard = computed(() => activeFlashcards.value[flashcardIndex.value] || null);

const markCardStatus = (iso, status) => {
  flashcardStatus.value[iso] = status;
  // Passe automatiquement à la carte suivante après avoir évalué la carte
  if (flashcardIndex.value < activeFlashcards.value.length - 1) {
    flashcardSuivante();
  } else {
    flashcardFlipped.value = false;
  }
};

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

// Raccourcis clavier pour les Flashcards (Espace = Flip, Flèches = Précédent/Suivant)
const handleFlashcardKeydown = (e) => {
  if (currentMode.value !== 'flashcards' || !currentFlashcard.value) return;
  if (e.code === 'Space') {
    e.preventDefault();
    flashcardFlipped.value = !flashcardFlipped.value;
  } else if (e.code === 'ArrowRight') {
    e.preventDefault();
    flashcardSuivante();
  } else if (e.code === 'ArrowLeft') {
    e.preventDefault();
    flashcardPrecedente();
  }
};

onMounted(() => window.addEventListener('keydown', handleFlashcardKeydown));

// =========================================================
// LOGIQUE MODE 5 : CHRONO CARTE (EUROPE & MONDE)
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
    
    if (paysTrouves.value.length === targetCountries.value.length) {
      chronoFini.value = true;
      arreterChrono();
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

onUnmounted(() => {
  arreterChrono();
  stopFlagGridTimer();
  window.removeEventListener('keydown', handleFlashcardKeydown);
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

/* ========================================================= */
/* ANIMATION 3D FLIP POUR LES FLASHCARDS                     */
/* ========================================================= */
.flip-scene {
  perspective: 1500px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  min-height: 510px;
  transform-style: preserve-3d;
  transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
  cursor: pointer;
}

.flip-card-inner.is-flipped {
  transform: rotateY(180deg);
}

.flip-card-face {
  position: absolute;
  inset: 0;
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