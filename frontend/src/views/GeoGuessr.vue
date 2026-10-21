<template>
  <div class="max-w-6xl mx-auto space-y-6 pb-12">

    <!-- EN-TÊTE -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <span class="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
          📍 {{ locale === 'fr' ? 'Exploration Géolocalisée en Direct' : 'Live Geotagged Exploration' }}
        </span>
        <h2 class="text-3xl font-black text-gray-900 dark:text-white">
          GeoLearn PinDrop (360° & Photo)
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ locale === 'fr'
            ? 'Observez le lieu, placez votre épingle sur la carte mondiale et visez les 25 000 points en 5 manches !'
            : 'Observe the location, drop your pin on the world map, and aim for 25,000 points across 5 rounds!' }}
        </p>
      </div>

      <button
        v-if="gameState !== 'menu'"
        type="button"
        @click="returnToMenu"
        class="self-start sm:self-auto px-5 py-2.5 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-sm font-bold transition cursor-pointer flex items-center gap-2"
      >
        ← {{ locale === 'fr' ? 'Changer de mode' : 'Change mode' }}
      </button>
    </div>

    <!-- ========================================================= -->
    <!-- ÉCRAN 1 : MENU DE SÉLECTION DU MODE & DU CHRONOMÈTRE      -->
    <!-- ========================================================= -->
    <div v-if="gameState === 'menu'" class="space-y-8 mt-4">
      
      <!-- Bandeau si un ami nous a envoyé un lien de Défi (Seed partagée) -->
      <div
        v-if="sharedChallengeRounds"
        class="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-3xl p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div class="flex items-center gap-4">
          <div class="text-4xl">⚔️</div>
          <div>
            <span class="text-xs font-extrabold uppercase tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full">
              {{ locale === 'fr' ? 'Défi d\'un ami détecté !' : 'Friend Challenge Detected!' }}
            </span>
            <h3 class="text-xl font-black mt-1">
              {{ sharedChallengerName
                ? (locale === 'fr' ? `${sharedChallengerName} vous défie (${sharedTargetScore} / 25 000 pts) !` : `${sharedChallengerName} challenged you (${sharedTargetScore} / 25,000 pts)!`)
                : (locale === 'fr' ? 'Relevez ce défi sur les 5 mêmes lieux !' : 'Take on this challenge on the exact same 5 locations!') }}
            </h3>
          </div>
        </div>
        <button
          type="button"
          @click="startSharedChallenge"
          class="px-6 py-3 rounded-xl bg-white text-orange-600 font-black text-sm hover:bg-orange-50 transition shadow cursor-pointer shrink-0"
        >
          🚀 {{ locale === 'fr' ? 'Lancer le Duel' : 'Start Duel' }}
        </button>
      </div>

      <!-- Choix du Chronomètre par manche -->
      <div class="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 class="font-bold text-gray-900 dark:text-white text-base">
            ⏱️ {{ locale === 'fr' ? 'Temps imparti par manche' : 'Time limit per round' }}
          </h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ locale === 'fr' ? 'Choisissez votre rythme avant de lancer les 5 manches.' : 'Choose your pace before starting the 5 rounds.' }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            v-for="opt in timerOptions"
            :key="opt.value"
            type="button"
            @click="selectedTimeLimit = opt.value"
            class="px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer border"
            :class="selectedTimeLimit === opt.value
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-400'"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- Les 2 grands modes GeoGuessr -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- MODE A : EXPLORATION 360° IMMERSIVE -->
        <div
          @click="startNewGame('360')"
          class="group bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-8 shadow-xl border-2 border-blue-500/30 hover:border-cyan-400 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
        >
          <div class="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-cyan-400/15 blur-3xl"></div>
          <div>
            <div class="flex items-center justify-between mb-6">
              <div class="w-16 h-16 rounded-2xl bg-cyan-400/20 border border-cyan-400/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                🌐
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                Vue 360° Interactive
              </span>
            </div>

            <h3 class="text-2xl font-black mb-2">
              {{ locale === 'fr' ? 'Mode Panorama 360°' : '360° Panorama Mode' }}
            </h3>
            <p class="text-sm text-slate-300 leading-relaxed mb-6">
              {{ locale === 'fr'
                ? 'Plongez au cœur de panoramas 360° tirés aléatoirement dans le monde. Tournez la caméra à 360°, zoomez sur les indices (architecture, panneaux, végétation) et localisez l\'endroit exact !'
                : 'Dive into random 360° panoramas around the world. Rotate the camera 360°, zoom in on clues (architecture, signs, vegetation), and pinpoint the exact location!' }}
            </p>
          </div>

          <div class="pt-4 border-t border-white/10 flex items-center justify-between text-sm font-extrabold text-cyan-300">
            <span>5 {{ locale === 'fr' ? 'manches • 25 000 pts max' : 'rounds • 25,000 pts max' }}</span>
            <span class="group-hover:translate-x-1 transition-transform">{{ locale === 'fr' ? 'Jouer en 360° →' : 'Play 360° →' }}</span>
          </div>
        </div>

        <!-- MODE B : PHOTO-LOCALISATION MONDIALE -->
        <div
          @click="startNewGame('photo')"
          class="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border-2 border-emerald-500/30 hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
        >
          <div>
            <div class="flex items-center justify-between mb-6">
              <div class="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                📸
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                196 Pays • API Live
              </span>
            </div>

            <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-2">
              {{ locale === 'fr' ? 'Mode Photo-Localisation' : 'Photo-Location Mode' }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              {{ locale === 'fr'
                ? 'Une photographie géolocalisée tirée au hasard parmi les 196 pays (villes, monuments, paysages, rues). Trouvez où la photo a été prise avec la plus grande précision possible !'
                : 'A random geotagged photograph pulled live across all 196 countries (cities, monuments, landscapes, streets). Pinpoint where the photo was taken as accurately as possible!' }}
            </p>
          </div>

          <div class="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
            <span>5 {{ locale === 'fr' ? 'manches • 25 000 pts max' : 'rounds • 25,000 pts max' }}</span>
            <span class="group-hover:translate-x-1 transition-transform">{{ locale === 'fr' ? 'Jouer en Photo →' : 'Play Photo →' }}</span>
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================================= -->
    <!-- ÉCRAN 2 : EN COURS DE PARTIE (MANCHE 1 À 5)               -->
    <!-- ========================================================= -->
    <div v-else-if="gameState === 'playing'" class="space-y-5">

      <!-- BARRE DE STATUT DE LA MANCHE -->
      <div class="bg-white dark:bg-gray-800 px-5 py-3.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <span class="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-black text-sm">
            {{ locale === 'fr' ? `Manche ${currentRound} / 5` : `Round ${currentRound} / 5` }}
          </span>
          <span class="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400">
            {{ activeMode === '360'
              ? (locale === 'fr' ? '🌐 Panorama 360°' : '🌐 360° Panorama')
              : (locale === 'fr' ? '📸 Photo-Localisation' : '📸 Photo-Location') }}
          </span>
        </div>

        <!-- Chronomètre si activé -->
        <div
          v-if="selectedTimeLimit > 0 && !roundConfirmed"
          class="px-4 py-1.5 rounded-xl font-black text-base flex items-center gap-2"
          :class="roundTimeLeft <= 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'"
        >
          <span>⏱️</span>
          <span>{{ formatTime(roundTimeLeft) }}</span>
        </div>

        <!-- Score cumulé -->
        <div class="flex items-baseline gap-1.5">
          <span class="text-xs font-bold uppercase text-gray-400">Score :</span>
          <strong class="text-xl font-black text-blue-600 dark:text-blue-400">
            {{ totalScore.toLocaleString() }}
          </strong>
          <span class="text-xs font-bold text-gray-400">/ 25 000</span>
        </div>
      </div>

      <!-- ZONE PRINCIPALE : VUE 360° OU PHOTO + MINI-CARTE DE VOTE -->
      <div v-if="!roundConfirmed" class="relative h-[560px] w-full rounded-3xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-slate-950">

        <!-- Écran de chargement d'un lieu aléatoire depuis l'API -->
        <div
          v-if="isLoadingLocation"
          class="absolute inset-0 z-30 bg-slate-900/95 flex flex-col items-center justify-center text-white p-6 text-center space-y-4"
        >
          <div class="w-14 h-14 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <h3 class="text-xl font-black">
            {{ locale === 'fr' ? 'Recherche d\'un lieu aléatoire dans le monde...' : 'Fetching a random location in the world...' }}
          </h3>
          <p class="text-xs text-slate-400">
            {{ locale === 'fr' ? 'Connexion en direct à l\'API géolocalisée Wikimedia Commons' : 'Connecting live to Wikimedia Commons Geotagged API' }}
          </p>
        </div>

        <!-- VUE 1 : VISIONNEUSE 360° PANNELLUM -->
        <div
          v-show="activeMode === '360'"
          id="geo-pannellum-viewer"
          class="w-full h-full"
        ></div>

        <!-- VUE 2 : PHOTO-LOCALISATION HAUTE DÉFINITION AVEC ZOOM -->
        <div
          v-if="activeMode === 'photo' && currentLocation"
          class="w-full h-full flex items-center justify-center bg-slate-950 relative overflow-hidden"
        >
          <!-- Fond flouté esthétique -->
          <img
            :src="currentLocation.imageUrl"
            alt=""
            class="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
          />
          <!-- Vraie photo zoomable -->
          <img
            :src="currentLocation.imageUrl"
            :alt="locale === 'fr' ? 'Lieu mystère' : 'Mystery location'"
            class="relative z-10 max-w-full max-h-full object-contain transition-transform duration-300 select-none"
            :class="photoZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'"
            @click="photoZoomed = !photoZoomed"
          />
        </div>

        <!-- BARRE D'OUTILS FLOTTANTE EN HAUT À GAUCHE (INDICE + AUTRE LIEU SI IMAGE CASSÉE) -->
        <div class="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
          <button
            v-if="!hintUsed && currentLocation"
            type="button"
            @click="useHint"
            class="px-3.5 py-2 rounded-xl bg-slate-900/85 hover:bg-amber-500 text-white text-xs font-bold backdrop-blur-md border border-white/15 transition cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            💡 {{ locale === 'fr' ? 'Indice Continent' : 'Continent Hint' }}
          </button>

          <span
            v-else-if="hintUsed && currentLocation"
            class="px-3.5 py-2 rounded-xl bg-amber-500/95 text-slate-950 text-xs font-black shadow-md"
          >
            🧭 {{ locale === 'fr' ? 'Continent :' : 'Continent:' }} {{ currentLocation.continent }}
          </span>

          <button
            type="button"
            @click="skipBrokenLocation"
            :disabled="isLoadingLocation"
            class="px-3 py-2 rounded-xl bg-slate-900/75 hover:bg-slate-800 text-slate-200 text-xs font-semibold backdrop-blur-md border border-white/10 transition cursor-pointer"
            :title="locale === 'fr' ? 'Charger une autre vue si l\'image met trop de temps' : 'Load another view if image is slow'"
          >
            🔄 {{ locale === 'fr' ? 'Autre vue' : 'Skip view' }}
          </button>
        </div>

        <!-- ======================================================= -->
        <!-- MINI-CARTE DE VOTE FLOTTANTE EN BAS À DROITE            -->
        <!-- ======================================================= -->
        <div
          class="absolute bottom-4 right-4 z-20 transition-all duration-300 flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-white/80 dark:border-gray-700 overflow-hidden"
          :class="miniMapExpanded
            ? 'w-[92%] sm:w-[540px] h-[360px] sm:h-[400px]'
            : 'w-64 sm:w-80 h-48 sm:h-56 hover:w-72 sm:hover:w-96 hover:h-56 sm:hover:h-64'"
        >
          <!-- En-tête de la mini-carte -->
          <div class="bg-slate-900 text-white px-3 py-1.5 flex items-center justify-between text-xs font-bold">
            <span>📍 {{ guessLatLng ? (locale === 'fr' ? 'Épingle placée !' : 'Pin placed!') : (locale === 'fr' ? 'Cliquez sur la carte' : 'Click on the map') }}</span>
            <button
              type="button"
              @click="toggleMiniMapSize"
              class="px-2 py-0.5 rounded bg-white/15 hover:bg-white/25 text-white cursor-pointer"
            >
              {{ miniMapExpanded ? (locale === 'fr' ? 'Réduire ↙' : 'Shrink ↙') : (locale === 'fr' ? 'Agrandir ↗' : 'Expand ↗') }}
            </button>
          </div>

          <!-- Carte Leaflet pour poser l'épingle -->
          <div class="flex-1 w-full relative">
            <l-map
              ref="guessMapRef"
              v-model:zoom="guessZoom"
              v-model:center="guessCenter"
              :min-zoom="1"
              :max-zoom="12"
              :use-global-leaflet="false"
              @click="onGuessMapClick"
            >
              <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                :no-wrap="true"
              ></l-tile-layer>

              <l-marker v-if="guessLatLng" :lat-lng="guessLatLng"></l-marker>
            </l-map>
          </div>

          <!-- Bouton de validation du Pin -->
          <button
            type="button"
            :disabled="!guessLatLng || isLoadingLocation"
            @click="confirmGuess"
            class="w-full py-2.5 font-black text-xs sm:text-sm uppercase tracking-wider transition cursor-pointer"
            :class="guessLatLng
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'"
          >
            {{ guessLatLng
              ? (locale === 'fr' ? '✓ Valider ma position' : '✓ Confirm Guess')
              : (locale === 'fr' ? 'Placez une épingle...' : 'Place a pin...') }}
          </button>
        </div>

      </div>

      <!-- ========================================================= -->
      <!-- RÉSULTAT DE LA MANCHE : CARTE AVEC TRAIT EN POINTILLÉS    -->
      <!-- ========================================================= -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-md border border-gray-100 dark:border-gray-700 space-y-6">
        
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-4">
            <img
              v-if="currentLocation?.iso"
              :src="`https://flagcdn.com/w80/${currentLocation.iso}.png`"
              class="h-12 w-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              alt=""
            />
            <div>
              <span class="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                {{ currentLocation?.countryName }} ({{ currentLocation?.continent }})
              </span>
              <h3 class="text-2xl font-black text-gray-900 dark:text-white">
                {{ currentLocation?.title }}
              </h3>
            </div>
          </div>

          <!-- Distance & Points gagnés -->
          <div class="flex items-center gap-4">
            <div class="bg-gray-50 dark:bg-gray-900 px-4 py-2.5 rounded-2xl border border-gray-100 dark:border-gray-700 text-center">
              <span class="text-[11px] font-bold uppercase text-gray-400 block">
                📏 {{ locale === 'fr' ? 'Distance' : 'Distance' }}
              </span>
              <strong class="text-lg font-black text-gray-900 dark:text-white">
                {{ lastRoundDistanceDisplay }}
              </strong>
            </div>

            <div class="bg-emerald-50 dark:bg-emerald-950/50 px-5 py-2.5 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center">
              <span class="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block">
                🏆 {{ locale === 'fr' ? 'Score Manche' : 'Round Score' }}
              </span>
              <strong class="text-xl font-black text-emerald-600 dark:text-emerald-400">
                +{{ lastRoundScore.toLocaleString() }} <span class="text-xs font-bold">/ 5 000</span>
              </strong>
            </div>
          </div>
        </div>

        <!-- Barre de précision sur 5 000 pts -->
        <div class="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-500 transition-all duration-500 rounded-full"
            :style="{ width: `${(lastRoundScore / 5000) * 100}%` }"
          ></div>
        </div>

        <!-- Carte du résultat avec l'épingle du joueur, la cible et la ligne en pointillés -->
        <div class="h-[400px] w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 relative z-0">
          <l-map
            ref="resultMapRef"
            v-model:zoom="resultZoom"
            v-model:center="resultCenter"
            :min-zoom="1"
            :max-zoom="12"
            :use-global-leaflet="false"
          >
            <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              :no-wrap="true"
            ></l-tile-layer>

            <!-- Ligne en pointillés entre le clic du joueur et la vraie position -->
            <l-polyline
              v-if="guessLatLng && currentLocation"
              :lat-lngs="[guessLatLng, [currentLocation.lat, currentLocation.lng]]"
              :color="'#ef4444'"
              :weight="3"
              :options="{ dashArray: '8, 8' }"
            ></l-polyline>

            <!-- Point bleu : Estimation du joueur -->
            <l-circle-marker
              v-if="guessLatLng"
              :lat-lng="guessLatLng"
              :radius="9"
              :color="'#ffffff'"
              :weight="2.5"
              :fill-color="'#2563eb'"
              :fill-opacity="1"
            >
              <l-popup>
                <strong>📍 {{ locale === 'fr' ? 'Votre estimation' : 'Your guess' }}</strong>
              </l-popup>
            </l-circle-marker>

            <!-- Point vert : Vraie position exacte -->
            <l-circle-marker
              v-if="currentLocation"
              :lat-lng="[currentLocation.lat, currentLocation.lng]"
              :radius="10"
              :color="'#ffffff'"
              :weight="2.5"
              :fill-color="'#10b981'"
              :fill-opacity="1"
            >
              <l-popup>
                <div class="text-center">
                  <strong>🎯 {{ currentLocation.title }}</strong><br />
                  <span class="text-xs">{{ currentLocation.countryName }}</span>
                </div>
              </l-popup>
            </l-circle-marker>
          </l-map>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div class="flex items-center gap-4 text-xs font-bold text-gray-500 dark:text-gray-400">
            <span class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
              {{ locale === 'fr' ? 'Votre épingle' : 'Your pin' }}
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              {{ locale === 'fr' ? 'Position réelle' : 'Actual location' }}
            </span>
          </div>

          <button
            type="button"
            @click="nextRound"
            class="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm transition shadow-md cursor-pointer"
          >
            {{ currentRound < 5
              ? (locale === 'fr' ? `Manche suivante (${currentRound + 1}/5) →` : `Next Round (${currentRound + 1}/5) →`)
              : (locale === 'fr' ? 'Voir mon score final (/ 25 000) 🏆' : 'See Final Score (/ 25,000) 🏆') }}
          </button>
        </div>

      </div>

    </div>

    <!-- ========================================================= -->
    <!-- ÉCRAN 3 : BILAN FINAL DES 5 MANCHES SUR 25 000 POINTS     -->
    <!-- ========================================================= -->
    <div v-else-if="gameState === 'summary'" class="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-10 shadow-md border border-gray-100 dark:border-gray-700 space-y-8">
      
      <div class="text-center space-y-2">
        <div class="text-5xl mb-2">🏆</div>
        <span class="px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300">
          {{ activeMode === '360' ? 'GeoGuessr 360°' : 'GeoGuessr Photo' }}
        </span>
        <h3 class="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
          {{ totalScore.toLocaleString() }} <span class="text-xl text-gray-400">/ 25 000 pts</span>
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ locale === 'fr'
            ? 'Retrouvez ci-dessous la carte globale de vos 5 manches et défiez vos amis sur cette même partie !'
            : 'Check out the global map of your 5 rounds below and challenge your friends on this exact same seed!' }}
        </p>
      </div>

      <!-- Carte récapitulative des 5 manches -->
      <div class="h-[380px] w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 relative z-0">
        <l-map
          :zoom="2"
          :center="[20, 10]"
          :min-zoom="1"
          :max-zoom="10"
          :use-global-leaflet="false"
        >
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            :no-wrap="true"
          ></l-tile-layer>

          <template v-for="(item, idx) in roundHistory" :key="'sum-' + idx">
            <l-polyline
              v-if="item.guessLatLng"
              :lat-lngs="[item.guessLatLng, [item.actual.lat, item.actual.lng]]"
              :color="'#ef4444'"
              :weight="2.5"
              :options="{ dashArray: '6, 6' }"
            ></l-polyline>

            <l-circle-marker
              v-if="item.guessLatLng"
              :lat-lng="item.guessLatLng"
              :radius="7"
              :color="'#ffffff'"
              :weight="2"
              :fill-color="'#2563eb'"
              :fill-opacity="1"
            ></l-circle-marker>

            <l-circle-marker
              :lat-lng="[item.actual.lat, item.actual.lng]"
              :radius="8"
              :color="'#ffffff'"
              :weight="2"
              :fill-color="'#10b981'"
              :fill-opacity="1"
            >
              <l-popup>
                <strong>#{{ idx + 1 }} — {{ item.actual.title }}</strong> ({{ item.actual.countryName }})<br />
                <span>{{ item.distanceDisplay }} • +{{ item.score }} pts</span>
              </l-popup>
            </l-circle-marker>
          </template>
        </l-map>
      </div>

      <!-- Tableau détail des 5 manches -->
      <div class="grid grid-cols-1 sm:grid-cols-5 gap-3">
        <div
          v-for="(item, idx) in roundHistory"
          :key="'card-sum-' + idx"
          class="bg-gray-50 dark:bg-gray-900/70 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 text-center space-y-1"
        >
          <span class="text-xs font-extrabold text-gray-400 block">
            {{ locale === 'fr' ? `Manche ${idx + 1}` : `Round ${idx + 1}` }}
          </span>
          <strong class="text-sm font-bold text-gray-900 dark:text-white block truncate" :title="item.actual.title">
            {{ item.actual.countryName }}
          </strong>
          <span class="text-xs text-gray-500 block">{{ item.distanceDisplay }}</span>
          <strong class="text-base font-black text-emerald-600 dark:text-emerald-400 block">
            +{{ item.score.toLocaleString() }} pts
          </strong>
        </div>
      </div>

      <!-- Boutons Rejouer + Défier un ami -->
      <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
        <button
          type="button"
          @click="copyChallengeLink"
          class="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm transition shadow cursor-pointer flex items-center gap-2"
        >
          <span>⚔️</span>
          <span>{{ challengeLinkCopied ? (locale === 'fr' ? 'Lien copié ! Envoyez-le à un ami' : 'Link copied! Send it to a friend') : (locale === 'fr' ? 'Défier un ami sur ces 5 lieux' : 'Challenge a friend on these 5 locations') }}</span>
        </button>

        <button
          type="button"
          @click="startNewGame(activeMode)"
          class="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm transition shadow-md cursor-pointer"
        >
          ↻ {{ locale === 'fr' ? 'Nouvelle partie (5 nouveaux lieux)' : 'Play Again (5 new locations)' }}
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
import { LMap, LTileLayer, LMarker, LPopup, LPolyline, LCircleMarker } from "@vue-leaflet/vue-leaflet";
import L from 'leaflet';

const { locale } = useI18n();
const route = useRoute();
const API_URL = 'https://geolearn-backend-bj65.onrender.com';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// État général
const gameState = ref('menu'); // 'menu' | 'playing' | 'summary'
const activeMode = ref('photo'); // '360' | 'photo'
const selectedTimeLimit = ref(0); // 0 = illimité, 60 = 60s, 30 = 30s
const roundTimeLeft = ref(0);
let roundTimerInterval = null;

const timerOptions = computed(() => [
  { value: 0, label: locale.value === 'fr' ? '∞ Sans limite' : '∞ No limit' },
  { value: 60, label: '⏱️ 60 sec' },
  { value: 30, label: '⚡ 30 sec' }
]);

const currentRound = ref(1);
const totalScore = ref(0);
const isLoadingLocation = ref(false);
const roundConfirmed = ref(false);
const currentLocation = ref(null);
const roundHistory = ref([]);

// Mini-carte & Résultat
const guessMapRef = ref(null);
const resultMapRef = ref(null);
const miniMapExpanded = ref(false);
const photoZoomed = ref(false);
const hintUsed = ref(false);

const guessZoom = ref(1);
const guessCenter = ref([20, 0]);
const guessLatLng = ref(null);

const resultZoom = ref(2);
const resultCenter = ref([20, 0]);
const lastRoundScore = ref(0);
const lastRoundDistanceKm = ref(0);

// Historique en session pour ne JAMAIS retomber sur la même image/panorama
const seenUrls = new Set(JSON.parse(sessionStorage.getItem('geolearn_seen_pano') || '[]'));
const recordSeenUrl = (url) => {
  seenUrls.add(url);
  const arr = [...seenUrls].slice(-250);
  sessionStorage.setItem('geolearn_seen_pano', JSON.stringify(arr));
};

// Chargement dynamique de Pannellum (Visionneuse WebGL 360° open-source)
let pannellumViewer = null;
const ensurePannellumLoaded = () => {
  return new Promise((resolve) => {
    if (window.pannellum) return resolve();

    if (!document.getElementById('pannellum-css')) {
      const link = document.createElement('link');
      link.id = 'pannellum-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
      document.head.appendChild(link);
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
};

// Calcul de la distance exacte en km (Formule de Haversine)
const computeDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = d => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
};

// Formule de score GeoGuessr (0 à 5 000 points par manche)
const computeGeoScore = (distanceKm) => {
  if (distanceKm <= 0.05) return 5000;
  const score = Math.round(5000 * Math.exp(-distanceKm / 2000));
  return Math.max(0, Math.min(5000, score));
};

const lastRoundDistanceDisplay = computed(() => {
  const d = lastRoundDistanceKm.value;
  if (d < 1) return `${Math.round(d * 1000)} m`;
  return `${Math.round(d).toLocaleString()} km`;
});

// Trouve le pays de notre base le plus proche des coordonnées GPS de la photo/panorama
const findNearestCountry = (lat, lng) => {
  let best = ALL_COUNTRIES[0];
  let minD = Infinity;
  for (const c of ALL_COUNTRIES) {
    const d = computeDistanceKm(lat, lng, c.lat, c.lng);
    if (d < minD) {
      minD = d;
      best = c;
    }
  }
  return best;
};

// ============================================================================
// MOTEUR D'API EN DIRECT (WIKIMEDIA COMMONS GEOTAGGED API - INFINI & GRATUIT)
// ============================================================================
const PHOTO_THEMES = [
  'street', 'city', 'landscape', 'architecture', 'monument', 'road',
  'village', 'coast', 'mountain', 'square', 'bridge', 'harbor', 'castle', 'valley'
];

const PANO_QUERIES = [
  'filetype:bitmap "equirectangular"',
  'filetype:bitmap "360" "panorama"',
  'filetype:bitmap incategory:"360-degree_panoramas"',
  'filetype:bitmap incategory:"Equirectangular_projections"',
  'filetype:bitmap "360°" panorama'
];

const cleanWikiTitle = (rawTitle = '') => {
  return rawTitle
    .replace(/^File:/i, '')
    .replace(/\.(jpg|jpeg|png|webp)\$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b(DSC|IMG|PANO|DJI)\s*\d+\b/gi, '')
    .trim()
    .slice(0, 65) || 'Lieu Mystère';
};

// Récupère un panorama 360° géolocalisé aléatoire via l'API Wikimedia Commons
const fetchRandomLive360 = async () => {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const q = PANO_QUERIES[Math.floor(Math.random() * PANO_QUERIES.length)];
      const randomOffset = Math.floor(Math.random() * 250);
      const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(q)}&gsrlimit=50&gsroffset=${randomOffset}&prop=coordinates|imageinfo&iiprop=url|dimensions&iiurlwidth=2048&format=json&origin=*`;

      const res = await fetch(url);
      const data = await res.json();
      const pages = Object.values(data?.query?.pages || {});

      const validPanos = pages.filter(p => {
        const coord = p.coordinates && p.coordinates[0];
        const info = p.imageinfo && p.imageinfo[0];
        if (!coord || !info) return false;
        const imgUrl = info.thumburl || info.url;
        if (!imgUrl || seenUrls.has(imgUrl)) return false;
        if (!/\.(jpg|jpeg|png)$/i.test(info.url || '')) return false;
        const ratio = (info.width || 0) / Math.max(1, info.height || 1);
        return ratio >= 1.7 && ratio <= 2.3 && (info.width || 0) >= 1600;
      });

      if (validPanos.length > 0) {
        const chosen = validPanos[Math.floor(Math.random() * validPanos.length)];
        const coord = chosen.coordinates[0];
        const info = chosen.imageinfo[0];
        const imgUrl = info.thumburl || info.url;
        const country = findNearestCountry(coord.lat, coord.lon);
        recordSeenUrl(imgUrl);

        return {
          mode: '360',
          lat: Number(coord.lat),
          lng: Number(coord.lon),
          imageUrl: imgUrl,
          title: cleanWikiTitle(chosen.title),
          countryName: locale.value === 'en' ? country.name_en : country.name_fr,
          continent: country.continent_en,
          iso: country.iso
        };
      }
    } catch (e) {
      // Continue au prochain essai
    }
  }
  // Fallback sur une photo géolocalisée si le réseau bloque le 360
  return fetchRandomLivePhoto();
};

// Récupère une photographie géolocalisée aléatoire parmi les 196 pays
const fetchRandomLivePhoto = async () => {
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const randomCountry = ALL_COUNTRIES[Math.floor(Math.random() * ALL_COUNTRIES.length)];
      const randomTheme = PHOTO_THEMES[Math.floor(Math.random() * PHOTO_THEMES.length)];
      const query = `filetype:bitmap "${randomCountry.name_en}" ${randomTheme}`;
      const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=50&prop=coordinates|imageinfo&iiprop=url|dimensions&iiurlwidth=1400&format=json&origin=*`;

      const res = await fetch(url);
      const data = await res.json();
      const pages = Object.values(data?.query?.pages || {});

      const validPhotos = pages.filter(p => {
        const coord = p.coordinates && p.coordinates[0];
        const info = p.imageinfo && p.imageinfo[0];
        if (!coord || !info) return false;
        const imgUrl = info.thumburl || info.url;
        if (!imgUrl || seenUrls.has(imgUrl)) return false;
        if (!/\.(jpg|jpeg|png|webp)$/i.test(info.url || '')) return false;
        const t = (p.title || '').toLowerCase();
        if (t.includes('map') || t.includes('flag') || t.includes('coat of arms') || t.includes('locator')) return false;
        return (info.width || 0) >= 700 && (info.width || 0) >= (info.height || 0);
      });

      if (validPhotos.length > 0) {
        const chosen = validPhotos[Math.floor(Math.random() * validPhotos.length)];
        const coord = chosen.coordinates[0];
        const info = chosen.imageinfo[0];
        const imgUrl = info.thumburl || info.url;
        const nearest = findNearestCountry(coord.lat, coord.lon);
        recordSeenUrl(imgUrl);

        return {
          mode: 'photo',
          lat: Number(coord.lat),
          lng: Number(coord.lon),
          imageUrl: imgUrl,
          title: cleanWikiTitle(chosen.title),
          countryName: locale.value === 'en' ? nearest.name_en : nearest.name_fr,
          continent: nearest.continent_en,
          iso: nearest.iso
        };
      }
    } catch (e) {
      // Continue au prochain essai
    }
  }

  // Fallback par recherche radiale GPS autour d'un pays aléatoire
  const c = ALL_COUNTRIES[Math.floor(Math.random() * ALL_COUNTRIES.length)];
  return {
    mode: 'photo',
    lat: c.lat,
    lng: c.lng,
    imageUrl: `https://flagcdn.com/w640/${c.iso}.png`,
    title: locale.value === 'en' ? c.capital_en : c.capital_fr,
    countryName: locale.value === 'en' ? c.name_en : c.name_fr,
    continent: c.continent_en,
    iso: c.iso
  };
};

// Montage de la caméra 360° Pannellum
const mountPannellum = async (imageUrl) => {
  await ensurePannellumLoaded();
  await nextTick();
  if (!window.pannellum) return;
  try {
    if (pannellumViewer && typeof pannellumViewer.destroy === 'function') {
      pannellumViewer.destroy();
    }
  } catch (e) {}

  const container = document.getElementById('geo-pannellum-viewer');
  if (!container) return;

  pannellumViewer = window.pannellum.viewer('geo-pannellum-viewer', {
    type: 'equirectangular',
    panorama: imageUrl,
    autoLoad: true,
    showControls: true,
    compass: true,
    hfov: 100,
    minHfov: 50,
    maxHfov: 120
  });
};

// ============================================================================
// GESTION DES MANCHES ET DU CHRONOMÈTRE
// ============================================================================
const preloadedSharedRounds = ref(null);

const stopRoundTimer = () => {
  if (roundTimerInterval) {
    clearInterval(roundTimerInterval);
    roundTimerInterval = null;
  }
};

const startRoundTimer = () => {
  stopRoundTimer();
  if (selectedTimeLimit.value <= 0) return;
  roundTimeLeft.value = selectedTimeLimit.value;
  roundTimerInterval = setInterval(() => {
    if (roundTimeLeft.value > 0) {
      roundTimeLeft.value--;
    } else {
      stopRoundTimer();
      confirmGuess();
    }
  }, 1000);
};

const loadRoundLocation = async () => {
  isLoadingLocation.value = true;
  roundConfirmed.value = false;
  guessLatLng.value = null;
  photoZoomed.value = false;
  hintUsed.value = false;
  miniMapExpanded.value = false;
  guessZoom.value = 1;
  guessCenter.value = [20, 0];

  // Si on joue un Défi partagé par un ami, on charge exactement son lieu !
  if (preloadedSharedRounds.value && preloadedSharedRounds.value[currentRound.value - 1]) {
    currentLocation.value = preloadedSharedRounds.value[currentRound.value - 1];
  } else {
    currentLocation.value =
      activeMode.value === '360'
        ? await fetchRandomLive360()
        : await fetchRandomLivePhoto();
  }

  isLoadingLocation.value = false;

  if (activeMode.value === '360' && currentLocation.value) {
    await mountPannellum(currentLocation.value.imageUrl);
  }

  await nextTick();
  if (guessMapRef.value && guessMapRef.value.leafletObject) {
    guessMapRef.value.leafletObject.invalidateSize();
  }

  startRoundTimer();
};

const startNewGame = (mode) => {
  preloadedSharedRounds.value = null;
  activeMode.value = mode;
  currentRound.value = 1;
  totalScore.value = 0;
  roundHistory.value = [];
  gameState.value = 'playing';
  loadRoundLocation();
};

const skipBrokenLocation = () => {
  stopRoundTimer();
  loadRoundLocation();
};

const useHint = () => {
  hintUsed.value = true;
};

const toggleMiniMapSize = async () => {
  miniMapExpanded.value = !miniMapExpanded.value;
  await nextTick();
  setTimeout(() => {
    if (guessMapRef.value && guessMapRef.value.leafletObject) {
      guessMapRef.value.leafletObject.invalidateSize();
    }
  }, 250);
};

const onGuessMapClick = (e) => {
  if (e && e.latlng) {
    guessLatLng.value = [e.latlng.lat, e.latlng.lng];
  }
};

const confirmGuess = async () => {
  if (roundConfirmed.value || !currentLocation.value) return;
  stopRoundTimer();
  roundConfirmed.value = true;

  if (!guessLatLng.value) {
    // Temps écoulé sans épingle posée -> 0 pt
    lastRoundDistanceKm.value = 20000;
    lastRoundScore.value = 0;
  } else {
    const dKm = computeDistanceKm(
      guessLatLng.value[0],
      guessLatLng.value[1],
      currentLocation.value.lat,
      currentLocation.value.lng
    );
    lastRoundDistanceKm.value = dKm;
    lastRoundScore.value = computeGeoScore(dKm);
  }

  totalScore.value += lastRoundScore.value;

  roundHistory.value.push({
    actual: { ...currentLocation.value },
    guessLatLng: guessLatLng.value ? [...guessLatLng.value] : null,
    distanceKm: lastRoundDistanceKm.value,
    distanceDisplay: lastRoundDistanceDisplay.value,
    score: lastRoundScore.value
  });

  // Recentre et ajuste le zoom sur les 2 points
  await nextTick();
  if (resultMapRef.value && resultMapRef.value.leafletObject && guessLatLng.value) {
    const bounds = L.latLngBounds([
      guessLatLng.value,
      [currentLocation.value.lat, currentLocation.value.lng]
    ]);
    resultMapRef.value.leafletObject.invalidateSize();
    resultMapRef.value.leafletObject.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
  } else if (currentLocation.value) {
    resultCenter.value = [currentLocation.value.lat, currentLocation.value.lng];
    resultZoom.value = 4;
  }
};

const saveFinalGeoScore = async () => {
  const savedUser = localStorage.getItem('geolearn_user');
  if (!savedUser) return;
  try {
    const parsed = JSON.parse(savedUser);
    const userId = parsed.id || (parsed.user && parsed.user.id);
    if (!userId) return;
    const modeLabel = activeMode.value === '360' ? 'GeoGuessr 360' : 'GeoGuessr Photo';
    await fetch(`${API_URL}/api/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        mode: modeLabel,
        score: totalScore.value,
        max_score: 25000
      })
    });
  } catch (e) {
    console.error('Erreur sauvegarde score GeoGuessr:', e);
  }
};

const nextRound = () => {
  if (currentRound.value < 5) {
    currentRound.value++;
    loadRoundLocation();
  } else {
    gameState.value = 'summary';
    saveFinalGeoScore();
  }
};

const returnToMenu = () => {
  stopRoundTimer();
  gameState.value = 'menu';
};

const formatTime = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// ============================================================================
// PARTAGE D'UN DÉFI ENTRE AMIS (SEED ENCODÉE DANS L'URL)
// ============================================================================
const challengeLinkCopied = ref(false);
const sharedChallengeRounds = ref(null);
const sharedChallengerName = ref('');
const sharedTargetScore = ref(0);

const copyChallengeLink = async () => {
  try {
    const savedUser = localStorage.getItem('geolearn_user');
    let myName = 'Joueur';
    if (savedUser) {
      const p = JSON.parse(savedUser);
      myName = p.username || p.name || p.pseudo || 'Joueur';
    }
    const payload = {
      m: activeMode.value,
      from: myName,
      s: totalScore.value,
      r: roundHistory.value.map(h => ({
        lat: h.actual.lat,
        lng: h.actual.lng,
        imageUrl: h.actual.imageUrl,
        title: h.actual.title,
        countryName: h.actual.countryName,
        continent: h.actual.continent,
        iso: h.actual.iso
      }))
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(payload)));
    const link = `${window.location.origin}/geoguessr?seed=${encoded}`;
    await navigator.clipboard.writeText(link);
    challengeLinkCopied.value = true;
    setTimeout(() => { challengeLinkCopied.value = false; }, 4000);
  } catch (e) {}
};

const startSharedChallenge = () => {
  if (!sharedChallengeRounds.value) return;
  preloadedSharedRounds.value = sharedChallengeRounds.value;
  activeMode.value = sharedChallengeRounds.value[0]?.mode || 'photo';
  currentRound.value = 1;
  totalScore.value = 0;
  roundHistory.value = [];
  gameState.value = 'playing';
  loadRoundLocation();
};

onMounted(() => {
  if (route.query.seed) {
    try {
      const decoded = JSON.parse(decodeURIComponent(atob(route.query.seed)));
      if (decoded && Array.isArray(decoded.r) && decoded.r.length === 5) {
        sharedChallengeRounds.value = decoded.r.map(item => ({ ...item, mode: decoded.m || 'photo' }));
        sharedChallengerName.value = decoded.from || '';
        sharedTargetScore.value = Number(decoded.s || 0);
      }
    } catch (e) {}
  }
});

onUnmounted(() => {
  stopRoundTimer();
  try {
    if (pannellumViewer && typeof pannellumViewer.destroy === 'function') {
      pannellumViewer.destroy();
    }
  } catch (e) {}
});
</script>

<style scoped>
.leaflet-container {
  z-index: 10;
  background-color: #aad3df !important;
  cursor: crosshair !important;
}
</style>