<template>
  <div class="max-w-6xl mx-auto space-y-6 pb-12">

    <!-- EN-TÊTE -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <span class="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
          📍 {{ locale === 'fr' ? 'Exploration Géolocalisée Vérifiée' : 'Verified Geotagged Exploration' }}
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
      
      <!-- Bandeau si un ami nous a envoyé un lien de Défi -->
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
        
        <!-- MODE A : EXPLORATION 360° NO MOVE -->
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
                Vue 360° • No Move
              </span>
            </div>

            <h3 class="text-2xl font-black mb-2">
              {{ locale === 'fr' ? 'Mode Panorama 360° (No Move)' : '360° Panorama Mode (No Move)' }}
            </h3>
            <p class="text-sm text-slate-300 leading-relaxed mb-6">
              {{ locale === 'fr'
                ? 'Plongez au cœur de vraies photosphères 360° vérifiées de rues, villes et paysages à travers le monde. Tournez la caméra à 360°, zoomez sur les indices et localisez l\'endroit exact !'
                : 'Dive into verified 360° photospheres of streets, cities, and landscapes across the world. Rotate 360°, zoom in on clues, and pinpoint the exact location!' }}
            </p>
          </div>

          <div class="pt-4 border-t border-white/10 flex items-center justify-between text-sm font-extrabold text-cyan-300">
            <span>5 {{ locale === 'fr' ? 'lieux uniques • 25 000 pts max' : 'unique locations • 25,000 pts max' }}</span>
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
                GPS Vérifié • HD
              </span>
            </div>

            <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-2">
              {{ locale === 'fr' ? 'Mode Photo-Localisation' : 'Photo-Location Mode' }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              {{ locale === 'fr'
                ? 'De vraies photographies extérieures géolocalisées (rues, architectures, côtes, reliefs) avec coordonnées GPS certifiées. Trouvez où la photo a été prise !'
                : 'Real outdoor geotagged photographs (streets, architecture, coastlines, mountains) with verified GPS coordinates. Pinpoint where it was taken!' }}
            </p>
          </div>

          <div class="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
            <span>5 {{ locale === 'fr' ? 'lieux uniques • 25 000 pts max' : 'unique locations • 25,000 pts max' }}</span>
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
              ? (locale === 'fr' ? '🌐 Panorama 360° (No Move)' : '🌐 360° Panorama (No Move)')
              : (locale === 'fr' ? '📸 Photo-Localisation' : '📸 Photo-Location') }}
          </span>
        </div>

        <div
          v-if="selectedTimeLimit > 0 && !roundConfirmed"
          class="px-4 py-1.5 rounded-xl font-black text-base flex items-center gap-2"
          :class="roundTimeLeft <= 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'"
        >
          <span>⏱️</span>
          <span>{{ formatTime(roundTimeLeft) }}</span>
        </div>

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

        <!-- Écran de chargement -->
        <div
          v-if="isLoadingLocation"
          class="absolute inset-0 z-30 bg-slate-900/95 flex flex-col items-center justify-center text-white p-6 text-center space-y-4"
        >
          <div class="w-14 h-14 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <h3 class="text-xl font-black">
            {{ activeMode === '360'
              ? (locale === 'fr' ? 'Chargement d\'une photosphère 360° vérifiée...' : 'Loading a verified 360° photosphere...')
              : (locale === 'fr' ? 'Chargement d\'un lieu mystère vérifié...' : 'Loading a verified mystery location...') }}
          </h3>
        </div>

        <!-- VUE 1 : VISIONNEUSE 360° PANNELLUM (Uniquement si vraie sphère 2:1) -->
        <div
          v-show="activeMode === '360' && currentLocation?.isTrueEquirectangular"
          id="geo-pannellum-viewer"
          class="w-full h-full"
        ></div>

        <!-- VUE 2 : PHOTO-LOCALISATION HAUTE DÉFINITION AVEC ZOOM -->
        <div
          v-if="currentLocation && (activeMode === 'photo' || !currentLocation.isTrueEquirectangular)"
          class="w-full h-full flex items-center justify-center bg-slate-950 relative overflow-hidden"
        >
          <img
            :src="currentLocation.imageUrl"
            alt=""
            class="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
          />
          <img
            :src="currentLocation.imageUrl"
            :alt="locale === 'fr' ? 'Lieu mystère' : 'Mystery location'"
            class="relative z-10 max-w-full max-h-full object-contain transition-transform duration-300 select-none"
            :class="photoZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'"
            @click="photoZoomed = !photoZoomed"
            @error="skipBrokenLocation"
          />
        </div>

        <!-- BARRE D'OUTILS FLOTTANTE EN HAUT À GAUCHE -->
        <div class="absolute top-4 left-14 z-20 flex flex-wrap items-center gap-2">
          <button
            v-if="!hintUsed"
            type="button"
            :disabled="isLoadingLocation || !currentLocation"
            @click="useHint"
            class="px-3.5 py-2 rounded-xl bg-slate-900/85 hover:bg-amber-500 text-white text-xs font-bold backdrop-blur-md border border-white/15 transition cursor-pointer flex items-center gap-1.5 shadow-md disabled:opacity-50"
          >
            💡 {{ locale === 'fr' ? 'Indice Continent (Points ÷ 2)' : 'Continent Hint (Points ÷ 2)' }}
          </button>

          <span
            v-else-if="currentLocation"
            class="px-3.5 py-2 rounded-xl bg-amber-500/95 text-slate-950 text-xs font-black shadow-md"
          >
            🧭 {{ currentLocation.continent }}{{ currentLocation.subregion ? ` — ${currentLocation.subregion}` : '' }} (Score ÷ 2)
          </span>

          <button
            type="button"
            @click="skipBrokenLocation"
            :disabled="isLoadingLocation"
            class="px-3 py-2 rounded-xl bg-slate-900/75 hover:bg-slate-800 text-slate-200 text-xs font-semibold backdrop-blur-md border border-white/10 transition cursor-pointer"
          >
            🔄 {{ locale === 'fr' ? 'Autre vue' : 'Skip view' }}
          </button>
        </div>

        <!-- MINI-CARTE DE VOTE FLOTTANTE EN BAS À DROITE -->
        <div
          class="absolute bottom-4 right-4 z-20 transition-all duration-300 flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-white/80 dark:border-gray-700 overflow-hidden"
          :class="miniMapExpanded
            ? 'w-[92%] sm:w-[540px] h-[360px] sm:h-[400px]'
            : 'w-64 sm:w-80 h-48 sm:h-56 hover:w-72 sm:hover:w-96 hover:h-56 sm:hover:h-64'"
        >
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
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {{ currentLocation?.countryName }} ({{ currentLocation?.continent }})
                </span>
                <span
                  v-if="hintUsed"
                  class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300"
                >
                  💡 {{ locale === 'fr' ? 'Indice utilisé (Score ÷ 2)' : 'Hint used (Score ÷ 2)' }}
                </span>
              </div>
              <h3 class="text-2xl font-black text-gray-900 dark:text-white">
                {{ currentLocation?.title }}
              </h3>
            </div>
          </div>

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

        <div class="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-500 transition-all duration-500 rounded-full"
            :style="{ width: `${(lastRoundScore / 5000) * 100}%` }"
          ></div>
        </div>

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

            <l-polyline
              v-if="guessLatLng && currentLocation"
              :lat-lngs="[guessLatLng, [currentLocation.lat, currentLocation.lng]]"
              :color="'#ef4444'"
              :weight="3"
              :options="{ dashArray: '8, 8' }"
            ></l-polyline>

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
          {{ activeMode === '360' ? 'GeoGuessr 360° (No Move)' : 'GeoGuessr Photo' }}
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

      <div class="grid grid-cols-1 sm:grid-cols-5 gap-3">
        <div
          v-for="(item, idx) in roundHistory"
          :key="'card-sum-' + idx"
          class="bg-gray-50 dark:bg-gray-900/70 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 text-center space-y-1.5"
        >
          <span class="text-xs font-extrabold text-gray-400 block">
            {{ locale === 'fr' ? `Manche ${idx + 1}` : `Round ${idx + 1}` }}
          </span>
          <div class="flex items-center justify-center gap-1.5">
            <img
              v-if="item.actual.iso"
              :src="`https://flagcdn.com/w20/${item.actual.iso}.png`"
              class="h-3.5 w-auto rounded-2xs shadow-2xs shrink-0"
              alt=""
            />
            <strong class="text-sm font-bold text-gray-900 dark:text-white truncate" :title="item.actual.countryName">
              {{ item.actual.countryName }}
            </strong>
          </div>
          <span class="text-[11px] text-gray-400 block truncate" :title="item.actual.title">{{ item.actual.title }}</span>
          <span class="text-xs text-gray-500 block">{{ item.distanceDisplay }}</span>
          <strong class="text-base font-black text-emerald-600 dark:text-emerald-400 block">
            +{{ item.score.toLocaleString() }} pts
          </strong>
        </div>
      </div>

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

const gameState = ref('menu');
const activeMode = ref('photo');
const selectedTimeLimit = ref(0);
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

// ============================================================================
// 1. BASE DE LIEUX MONDIAUX CERTIFIÉS (COORDONNÉES GPS VÉRIFIÉES AU MÈTRE PRÈS)
// ============================================================================
const VERIFIED_WORLD_LOCATIONS = [
  { title: 'Pont de Bir-Hakeim, Paris', country_fr: 'France', country_en: 'France', continent: 'Europe', subregion: 'Europe de l\'Ouest', iso: 'fr', lat: 48.8556, lng: 2.2876, wikiFile: 'File:Tour_Eiffel_seen_from_Pont_de_Bir-Hakeim.jpg' },
  { title: 'Mont Saint-Michel, Normandie', country_fr: 'France', country_en: 'France', continent: 'Europe', subregion: 'Europe de l\'Ouest', iso: 'fr', lat: 48.6360, lng: -1.5115, wikiFile: 'File:Mont-Saint-Michel_vu_du_ciel.jpg' },
  { title: 'Vieux-Port de Marseille', country_fr: 'France', country_en: 'France', continent: 'Europe', subregion: 'Europe de l\'Ouest', iso: 'fr', lat: 43.2951, lng: 5.3744, wikiFile: 'File:Marseille_-_Vieux-Port_2.jpg' },
  { title: 'Westminster & Big Ben, Londres', country_fr: 'Royaume-Uni', country_en: 'United Kingdom', continent: 'Europe', subregion: 'Europe du Nord', iso: 'gb', lat: 51.5007, lng: -0.1246, wikiFile: 'File: Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall.jpg' },
  { title: 'Calton Hill, Édimbourg', country_fr: 'Royaume-Uni', country_en: 'United Kingdom', continent: 'Europe', subregion: 'Europe du Nord', iso: 'gb', lat: 55.9548, lng: -3.1824, wikiFile: 'File:Edinburgh_from_Calton_Hill.jpg' },
  { title: 'Colisée & Forum Romain, Rome', country_fr: 'Italie', country_en: 'Italy', continent: 'Europe', subregion: 'Europe du Sud', iso: 'it', lat: 41.8902, lng: 12.4922, wikiFile: 'File:Colosseo_2020.jpg' },
  { title: 'Grand Canal, Venise', country_fr: 'Italie', country_en: 'Italy', continent: 'Europe', subregion: 'Europe du Sud', iso: 'it', lat: 45.4310, lng: 12.3325, wikiFile: 'File:Canale_Grande_Chiesa_della_Salute_e_Dogana_dal_ponte_dell_Accademia.jpg' },
  { title: 'Manarola, Cinque Terre', country_fr: 'Italie', country_en: 'Italy', continent: 'Europe', subregion: 'Europe du Sud', iso: 'it', lat: 44.1068, lng: 9.7276, wikiFile: 'File:Manarola_Cinque_Terre_Italy.jpg' },
  { title: 'Plaza de España, Séville', country_fr: 'Espagne', country_en: 'Spain', continent: 'Europe', subregion: 'Europe du Sud', iso: 'es', lat: 37.3772, lng: -5.9869, wikiFile: 'File:Plaza_de_Espa%C3%B1a_(Sevilla)_-_01.jpg' },
  { title: 'Parc Güell, Barcelone', country_fr: 'Espagne', country_en: 'Spain', continent: 'Europe', subregion: 'Europe du Sud', iso: 'es', lat: 41.4145, lng: 2.1527, wikiFile: 'File:Parc_G%C3%BCell,_Barcelona.jpg' },
  { title: 'Tour de Belém, Lisbonne', country_fr: 'Portugal', country_en: 'Portugal', continent: 'Europe', subregion: 'Europe du Sud', iso: 'pt', lat: 38.6916, lng: -9.2160, wikiFile: 'File:Torre_de_Bel%C3%A9m_(Lisboa)_2013.jpg' },
  { title: 'Porte de Brandebourg, Berlin', country_fr: 'Allemagne', country_en: 'Germany', continent: 'Europe', subregion: 'Europe de l\'Ouest', iso: 'de', lat: 52.5163, lng: 13.3777, wikiFile: 'File:Brandenburger_Tor_abends.jpg' },
  { title: 'Château de Neuschwanstein, Bavière', country_fr: 'Allemagne', country_en: 'Germany', continent: 'Europe', subregion: 'Europe de l\'Ouest', iso: 'de', lat: 47.5576, lng: 10.7498, wikiFile: 'File:Castle_Neuschwanstein.jpg' },
  { title: 'Canaux d\'Amsterdam', country_fr: 'Pays-Bas', country_en: 'Netherlands', continent: 'Europe', subregion: 'Europe de l\'Ouest', iso: 'nl', lat: 52.3676, lng: 4.8945, wikiFile: 'File:Amsterdam_Canals_-_July_2006.jpg' },
  { title: 'Grand-Place de Bruxelles', country_fr: 'Belgique', country_en: 'Belgium', continent: 'Europe', subregion: 'Europe de l\'Ouest', iso: 'be', lat: 50.8467, lng: 4.3525, wikiFile: 'File:Brussels_Grand-Place_at_night_2.jpg' },
  { title: 'Cervin (Matterhorn), Zermatt', country_fr: 'Suisse', country_en: 'Switzerland', continent: 'Europe', subregion: 'Europe de l\'Ouest', iso: 'ch', lat: 45.9766, lng: 7.6585, wikiFile: 'File:Matterhorn_from_Domh%C3%BCtte_-_2.jpg' },
  { title: 'Hallstatt, Haute-Autriche', country_fr: 'Autriche', country_en: 'Austria', continent: 'Europe', subregion: 'Europe de l\'Ouest', iso: 'at', lat: 47.5622, lng: 13.6493, wikiFile: 'File:Hallstatt_300.jpg' },
  { title: 'Pont Charles, Prague', country_fr: 'Tchéquie', country_en: 'Czechia', continent: 'Europe', subregion: 'Europe de l\'Est', iso: 'cz', lat: 50.0865, lng: 14.4114, wikiFile: 'File:Prague_07-2016_View_from_Old_Town_Bridge_Tower_img2.jpg' },
  { title: 'Parlement Hongrois, Budapest', country_fr: 'Hongrie', country_en: 'Hungary', continent: 'Europe', subregion: 'Europe de l\'Est', iso: 'hu', lat: 47.5071, lng: 19.0457, wikiFile: 'File:Hungarian_Parliament_Building_from_across_the_Danube.jpg' },
  { title: 'Acropole d\'Athènes', country_fr: 'Grèce', country_en: 'Greece', continent: 'Europe', subregion: 'Europe du Sud', iso: 'gr', lat: 37.9715, lng: 23.7257, wikiFile: 'File:The_Parthenon_in_Athens.jpg' },
  { title: 'Oia, Île de Santorin', country_fr: 'Grèce', country_en: 'Greece', continent: 'Europe', subregion: 'Europe du Sud', iso: 'gr', lat: 36.4618, lng: 25.3753, wikiFile: 'File:Santorini-Oia-2007-10-16.jpg' },
  { title: 'Vieille Ville de Dubrovnik', country_fr: 'Croatie', country_en: 'Croatia', continent: 'Europe', subregion: 'Europe du Sud', iso: 'hr', lat: 42.6403, lng: 18.1083, wikiFile: 'File:Dubrovnik_Old_Town_from_above.jpg' },
  { title: 'Lac de Bled', country_fr: 'Slovénie', country_en: 'Slovenia', continent: 'Europe', subregion: 'Europe du Sud', iso: 'si', lat: 46.3625, lng: 14.0900, wikiFile: 'File:Bled_Lake_with_Island.jpg' },
  { title: 'Bryggen, Bergen', country_fr: 'Norvège', country_en: 'Norway', continent: 'Europe', subregion: 'Europe du Nord', iso: 'no', lat: 60.3976, lng: 5.3245, wikiFile: 'File:Bryggen_i_Bergen.jpg' },
  { title: 'Reine, Îles Lofoten', country_fr: 'Norvège', country_en: 'Norway', continent: 'Europe', subregion: 'Europe du Nord', iso: 'no', lat: 67.9324, lng: 13.0886, wikiFile: 'File:Reine_Lofoten_2009.jpg' },
  { title: 'Gamla Stan, Stockholm', country_fr: 'Suède', country_en: 'Sweden', continent: 'Europe', subregion: 'Europe du Nord', iso: 'se', lat: 59.3251, lng: 18.0708, wikiFile: 'File:Stockholm_Gamla_stan_2016.jpg' },
  { title: 'Nyhavn, Copenhague', country_fr: 'Danemark', country_en: 'Denmark', continent: 'Europe', subregion: 'Europe du Nord', iso: 'dk', lat: 55.6798, lng: 12.5914, wikiFile: 'File:Nyhavn,_Copenhagen.jpg' },
  { title: 'Kirkjufell, Snæfellsnes', country_fr: 'Islande', country_en: 'Iceland', continent: 'Europe', subregion: 'Europe du Nord', iso: 'is', lat: 64.9244, lng: -23.3122, wikiFile: 'File:Kirkjufell_mountain_and_Kirkjufellsfoss_waterfall.jpg' },
  { title: 'Mosquée Bleue & Sainte-Sophie, Istanbul', country_fr: 'Turquie', country_en: 'Turkey', continent: 'Asia', subregion: 'Asie de l\'Ouest', iso: 'tr', lat: 41.0054, lng: 28.9768, wikiFile: 'File:Sultan_Ahmed_Mosque_Istanbul_Turkey_retouched.jpg' },
  { title: 'Pont de Brooklyn & Manhattan, New York', country_fr: 'États-Unis', country_en: 'United States', continent: 'Americas', subregion: 'Amérique du Nord', iso: 'us', lat: 40.7061, lng: -73.9969, wikiFile: 'File:Brooklyn_Bridge_Manhattan.jpg' },
  { title: 'Golden Gate Bridge, San Francisco', country_fr: 'États-Unis', country_en: 'United States', continent: 'Americas', subregion: 'Amérique du Nord', iso: 'us', lat: 37.8199, lng: -122.4783, wikiFile: 'File:GoldenGateBridge-001.jpg' },
  { title: 'Grand Canyon, Arizona', country_fr: 'États-Unis', country_en: 'United States', continent: 'Americas', subregion: 'Amérique du Nord', iso: 'us', lat: 36.0544, lng: -112.1401, wikiFile: 'File:Grand_Canyon_view_from_Pima_Point_2010.jpg' },
  { title: 'Lac Moraine, Parc National de Banff', country_fr: 'Canada', country_en: 'Canada', continent: 'Americas', subregion: 'Amérique du Nord', iso: 'ca', lat: 51.3217, lng: -116.1860, wikiFile: 'File:Moraine_Lake_17092005.jpg' },
  { title: 'Château Frontenac, Québec', country_fr: 'Canada', country_en: 'Canada', continent: 'Americas', subregion: 'Amérique du Nord', iso: 'ca', lat: 46.8119, lng: -71.2052, wikiFile: 'File:Chateau_Frontenac_Quebec.jpg' },
  { title: 'Chichén Itzá, Yucatán', country_fr: 'Mexique', country_en: 'Mexico', continent: 'Americas', subregion: 'Amérique Centrale', iso: 'mx', lat: 20.6843, lng: -88.5678, wikiFile: 'File:Chichen_Itza_3.jpg' },
  { title: 'Machu Picchu, Cusco', country_fr: 'Pérou', country_en: 'Peru', continent: 'Americas', subregion: 'Amérique du Sud', iso: 'pe', lat: -13.1631, lng: -72.5450, wikiFile: 'File:Machu_Picchu,_Peru.jpg' },
  { title: 'Baie de Rio & Pain de Sucre, Rio de Janeiro', country_fr: 'Brésil', country_en: 'Brazil', continent: 'Americas', subregion: 'Amérique du Sud', iso: 'br', lat: -22.9486, lng: -43.1566, wikiFile: 'File:Rio_de_Janeiro_from_Christ_the_Redeemer.jpg' },
  { title: 'Puerto Madero & Obélisque, Buenos Aires', country_fr: 'Argentine', country_en: 'Argentina', continent: 'Americas', subregion: 'Amérique du Sud', iso: 'ar', lat: -34.6037, lng: -58.3816, wikiFile: 'File:Obelisco_BA_2015.jpg' },
  { title: 'Parc National Torres del Paine, Patagonie', country_fr: 'Chili', country_en: 'Chile', continent: 'Americas', subregion: 'Amérique du Sud', iso: 'cl', lat: -51.0411, lng: -72.9856, wikiFile: 'File:Cuernos_del_Paine_from_Lake_Peho%C3%A9.jpg' },
  { title: 'Pagode Chureito & Mont Fuji', country_fr: 'Japon', country_en: 'Japan', continent: 'Asia', subregion: 'Asie de l\'Est', iso: 'jp', lat: 35.5012, lng: 138.8014, wikiFile: 'File:Chureito_Pagoda_and_Mount_Fuji.jpg' },
  { title: 'Sanctuaire Fushimi Inari, Kyoto', country_fr: 'Japon', country_en: 'Japan', continent: 'Asia', subregion: 'Asie de l\'Est', iso: 'jp', lat: 34.9671, lng: 135.7727, wikiFile: 'File:Kiyomizu-dera_in_Kyoto-r.jpg' },
  { title: 'Carrefour de Shibuya, Tokyo', country_fr: 'Japon', country_en: 'Japan', continent: 'Asia', subregion: 'Asie de l\'Est', iso: 'jp', lat: 35.6595, lng: 139.7004, wikiFile: 'File:Shibuya_Crossing_at_night.jpg' },
  { title: 'Grande Muraille de Chine, Jinshanling', country_fr: 'Chine', country_en: 'China', continent: 'Asia', subregion: 'Asie de l\'Est', iso: 'cn', lat: 40.6769, lng: 117.2319, wikiFile: 'File:The_Great_Wall_of_China_at_Jinshanling-edit.jpg' },
  { title: 'Marina Bay, Singapour', country_fr: 'Singapour', country_en: 'Singapore', continent: 'Asia', subregion: 'Asie du Sud-Est', iso: 'sg', lat: 1.2834, lng: 103.8607, wikiFile: 'File:Marina_Bay_Sands_in_the_evening_-_20101120.jpg' },
  { title: 'Baie d\'Along (Hạ Long)', country_fr: 'Viêt Nam', country_en: 'Vietnam', continent: 'Asia', subregion: 'Asie du Sud-Est', iso: 'vn', lat: 20.9101, lng: 107.1839, wikiFile: 'File:Ha_Long_Bay_in_Vietnam.jpg' },
  { title: 'Wat Arun, Bangkok', country_fr: 'Thaïlande', country_en: 'Thailand', continent: 'Asia', subregion: 'Asie du Sud-Est', iso: 'th', lat: 13.7437, lng: 100.4889, wikiFile: 'File:Wat_Arun_Bangkok.jpg' },
  { title: 'Taj Mahal, Agra', country_fr: 'Inde', country_en: 'India', continent: 'Asia', subregion: 'Asie du Sud', iso: 'in', lat: 27.1751, lng: 78.0421, wikiFile: 'File:Taj_Mahal_in_March_2004.jpg' },
  { title: 'Pétra (Al-Khazneh)', country_fr: 'Jordanie', country_en: 'Jordan', continent: 'Asia', subregion: 'Asie de l\'Ouest', iso: 'jo', lat: 30.3222, lng: 35.4517, wikiFile: 'File:Al_Khazneh_Petra_edit_2.jpg' },
  { title: 'Pyramides de Gizeh, Le Caire', country_fr: 'Égypte', country_en: 'Egypt', continent: 'Africa', subregion: 'Afrique du Nord', iso: 'eg', lat: 29.9792, lng: 31.1342, wikiFile: 'File:All_Gizah_Pyramids.jpg' },
  { title: 'Koutoubia & Médina, Marrakech', country_fr: 'Maroc', country_en: 'Morocco', continent: 'Africa', subregion: 'Afrique du Nord', iso: 'ma', lat: 31.6241, lng: -7.9934, wikiFile: 'File:Koutoubia_Mosque_Marrakesh.jpg' },
  { title: 'Montagne de la Table, Le Cap', country_fr: 'Afrique du Sud', country_en: 'South Africa', continent: 'Africa', subregion: 'Afrique Australe', iso: 'za', lat: -33.9249, lng: 18.4241, wikiFile: 'File:Cape_Town_and_Table_Mountain.jpg' },
  { title: 'Opéra & Harbour Bridge, Sydney', country_fr: 'Australie', country_en: 'Australia', continent: 'Oceania', subregion: 'Australie et Nouvelle-Zélande', iso: 'au', lat: -33.8568, lng: 151.2153, wikiFile: 'File:Sydney_Opera_House_and_Harbour_Bridge_Dusk_(2)_2019-06-21.jpg' },
  { title: 'Milford Sound, Île du Sud', country_fr: 'Nouvelle-Zélande', country_en: 'New Zealand', continent: 'Oceania', subregion: 'Australie et Nouvelle-Zélande', iso: 'nz', lat: -44.6414, lng: 167.8974, wikiFile: 'File:Milford_Sound_(New_Zealand).JPG' }
];

// ============================================================================
// 2. SYSTÈME ANTI-DOUBLON STRICT + CALCUL DE DISTANCE ET SCORE
// ============================================================================
const seenUrls = new Set(JSON.parse(sessionStorage.getItem('geolearn_seen_urls_v6') || '[]'));
const seenCoords = JSON.parse(sessionStorage.getItem('geolearn_seen_coords_v6') || '[]');
const panoCachePool = [];

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

const isLocationAlreadyUsed = (imgUrl, lat, lng) => {
  if (imgUrl && seenUrls.has(imgUrl)) return true;

  for (const r of roundHistory.value) {
    if (r.actual && computeDistanceKm(lat, lng, r.actual.lat, r.actual.lng) < 50) {
      return true;
    }
  }

  for (const c of seenCoords) {
    if (computeDistanceKm(lat, lng, c.lat, c.lng) < 25) {
      return true;
    }
  }
  return false;
};

const markLocationAsUsed = (imgUrl, lat, lng) => {
  if (imgUrl) seenUrls.add(imgUrl);
  seenCoords.push({ lat, lng });
  sessionStorage.setItem('geolearn_seen_urls_v6', JSON.stringify([...seenUrls].slice(-300)));
  sessionStorage.setItem('geolearn_seen_coords_v6', JSON.stringify(seenCoords.slice(-120)));
};

// ============================================================================
// 3. FILTRE ULTRA-STRICT ANTI-OBJETS / ANTI-INTÉRIEURS & GÉOCODAGE VÉRIFIÉ
// ============================================================================
const FORBIDDEN_TITLE_WORDS = [
  'flag', 'drapeau', 'map', 'carte', 'coat of arms', 'blason', 'emblem',
  'logo', 'icon', 'symbol', 'stamp', 'diagram', 'chart', 'locator', 'blank',
  'orthographic', 'globe', 'planet', 'mars', 'moon', 'skybox', 'fractal',
  'render', 'blender', 'portrait', 'selfie', 'person', 'man ', 'woman ',
  'laptop', 'macbook', 'computer', 'keyboard', 'screen', 'phone', 'iphone',
  'interior', 'inside', 'room', 'bedroom', 'office', 'desk', 'kitchen',
  'museum', 'exhibit', 'painting', 'statue', 'sculpture', 'plate', 'food',
  'dish', 'cat ', 'dog ', 'insect', 'flower', 'plant', 'book', 'document',
  'newspaper', 'poster', 'sign', 'plaque', 'ticket', 'coin', 'banknote', 'svg'
];

const isForbiddenTitle = (title = '') => {
  const lower = title.toLowerCase();
  return FORBIDDEN_TITLE_WORDS.some(w => lower.includes(w));
};

const cleanWikiTitle = (rawTitle = '') => {
  return rawTitle
    .replace(/^File:/i, '')
    .replace(/\.(jpe?g|png|webp|tiff?|gif|svg|bmp)/gi, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b(DSC|IMG|PANO|DJI|GPANO|PANORAMA|360|EQUIRECTANGULAR|CROPPED)\s*\d*\b/gi, '')
    .replace(/\(\s*\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 60) || 'Lieu Mystère';
};

const resolveExactLocationFromCoords = async (lat, lng, rawWikiTitle = '') => {
  const cleanedFallbackTitle = cleanWikiTitle(rawWikiTitle);

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1800);
    const lang = locale.value === 'en' ? 'en' : 'fr';
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=${lang}`,
      { signal: controller.signal }
    );
    clearTimeout(timer);

    if (res.ok) {
      const geo = await res.json();
      const isoCode = (geo.countryCode || '').toLowerCase();
      const matchedCountry = ALL_COUNTRIES.find(c => c.iso === isoCode);

      const city = (geo.city || geo.locality || '').trim();
      const region = (geo.principalSubdivision || '').trim();
      let placeTitle = '';
      if (city && region && city !== region) {
        placeTitle = `${city}, ${region}`;
      } else if (city || region) {
        placeTitle = city || region;
      } else {
        placeTitle = cleanedFallbackTitle;
      }

      if (matchedCountry) {
        return {
          countryName: locale.value === 'en' ? matchedCountry.name_en : matchedCountry.name_fr,
          continent: matchedCountry.continent_en,
          subregion: locale.value === 'en' ? matchedCountry.subregion_en : matchedCountry.subregion_fr,
          iso: matchedCountry.iso,
          title: placeTitle
        };
      }
    }
  } catch (e) {}

  return null;
};

// ============================================================================
// 4. VISIONNEUSE 360° PANNELLUM & PRÉCHARGEMENT AVEC VÉRIFICATION RATIO 2:1
// ============================================================================
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

// Précharge l'image et renvoie ses vraies dimensions pour vérifier s'il s'agit d'une vraie sphère 2:1
const inspectAndPreloadImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => resolve({ ok: false }), 2500);
    img.onload = () => {
      clearTimeout(timer);
      const w = img.naturalWidth || 0;
      const h = img.naturalHeight || 1;
      const ratio = w / h;
      resolve({
        ok: w >= 700 && h >= 350,
        width: w,
        height: h,
        isEquirectangular: ratio >= 1.92 && ratio <= 2.08
      });
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve({ ok: false });
    };
    img.src = url;
  });
};

// Récupère l'URL CDN officielle d'un lieu vérifié sur Wikimedia Commons
const fetchVerifiedPlace = async (targetMode = 'photo') => {
  let pool = VERIFIED_WORLD_LOCATIONS.filter(
    loc => !isLocationAlreadyUsed(loc.wikiFile, loc.lat, loc.lng)
  );
  if (pool.length === 0) {
    seenCoords.length = 0;
    pool = [...VERIFIED_WORLD_LOCATIONS];
  }
  pool.sort(() => 0.5 - Math.random());

  for (const loc of pool.slice(0, 6)) {
    try {
      const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(loc.wikiFile)}&prop=imageinfo&iiprop=url&iiurlwidth=1280&format=json&origin=*`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      const pages = Object.values(data?.query?.pages || {});
      const info = pages[0]?.imageinfo?.[0];
      const imgUrl = info?.thumburl || info?.url;

      if (imgUrl) {
        const check = await inspectAndPreloadImage(imgUrl);
        if (check.ok) {
          markLocationAsUsed(loc.wikiFile, loc.lat, loc.lng);
          markLocationAsUsed(imgUrl, loc.lat, loc.lng);
          return {
            mode: targetMode,
            isTrueEquirectangular: false,
            lat: loc.lat,
            lng: loc.lng,
            imageUrl: imgUrl,
            title: loc.title,
            countryName: locale.value === 'en' ? loc.country_en : loc.country_fr,
            continent: loc.continent,
            subregion: loc.subregion,
            iso: loc.iso
          };
        }
      }
    } catch (e) {}
  }

  // En cas de coupure réseau Wikimedia, utilise un lieu vérifié avec miniature directe
  const fallbackLoc = pool[0];
  markLocationAsUsed(fallbackLoc.wikiFile, fallbackLoc.lat, fallbackLoc.lng);
  return {
    mode: targetMode,
    isTrueEquirectangular: false,
    lat: fallbackLoc.lat,
    lng: fallbackLoc.lng,
    imageUrl: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fallbackLoc.wikiFile.replace(/^File:/i, ''))}?width=1280`,
    title: fallbackLoc.title,
    countryName: locale.value === 'en' ? fallbackLoc.country_en : fallbackLoc.country_fr,
    continent: fallbackLoc.continent,
    subregion: fallbackLoc.subregion,
    iso: fallbackLoc.iso
  };
};

// Remplit le cache de vraies photosphères 360° équirectangulaires (ratio strict 2.0)
const refillPanoCache = async () => {
  const queries = [
    'filetype:bitmap incategory:"360-degree_panoramas_with_Pannellum"',
    'filetype:bitmap incategory:"Equirectangular_panoramas"'
  ];
  const q = queries[Math.floor(Math.random() * queries.length)];
  const offset = Math.floor(Math.random() * 50);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(q)}&gsrlimit=40&gsroffset=${offset}&prop=coordinates|imageinfo&colimit=max&coprimary=all&iiprop=url|dimensions&iiurlwidth=1920&format=json&origin=*`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const pages = Object.values(data?.query?.pages || {});

    for (const p of pages) {
      const coord = p.coordinates && p.coordinates[0];
      const info = p.imageinfo && p.imageinfo[0];
      if (!coord || !info) continue;
      if (typeof coord.lat !== 'number' || typeof coord.lon !== 'number') continue;
      if (isForbiddenTitle(p.title)) continue;

      const w = Number(info.width || 0);
      const h = Number(info.height || 1);
      const ratio = w / h;

      // Ratio 2:1 strict obligatoire pour éviter toute image classique étirée !
      if (w >= 2000 && ratio >= 1.95 && ratio <= 2.05) {
        const imgUrl = info.thumburl || (info.width <= 4096 ? info.url : null);
        if (imgUrl && /\.(jpg|jpeg|png)$/i.test(info.url || '')) {
          panoCachePool.push({
            lat: Number(coord.lat),
            lng: Number(coord.lon),
            imageUrl: imgUrl,
            rawTitle: p.title
          });
        }
      }
    }
  } catch (e) {}
};

const fetchRandomLive360 = async () => {
  if (panoCachePool.length < 3) {
    await refillPanoCache();
  }
  panoCachePool.sort(() => 0.5 - Math.random());

  while (panoCachePool.length > 0) {
    const candidate = panoCachePool.pop();
    if (isLocationAlreadyUsed(candidate.imageUrl, candidate.lat, candidate.lng)) continue;

    const check = await inspectAndPreloadImage(candidate.imageUrl);
    if (check.ok && check.isEquirectangular) {
      const exactPlace = await resolveExactLocationFromCoords(candidate.lat, candidate.lng, candidate.rawTitle);
      if (exactPlace) {
        markLocationAsUsed(candidate.imageUrl, candidate.lat, candidate.lng);
        return {
          mode: '360',
          isTrueEquirectangular: true,
          lat: candidate.lat,
          lng: candidate.lng,
          imageUrl: candidate.imageUrl,
          title: exactPlace.title,
          countryName: exactPlace.countryName,
          continent: exactPlace.continent,
          subregion: exactPlace.subregion,
          iso: exactPlace.iso
        };
      }
    }
  }

  return fetchVerifiedPlace('360');
};

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
    crossOrigin: 'anonymous',
    autoLoad: true,
    showControls: true,
    compass: true,
    mouseZoom: true,
    hfov: 100,
    minHfov: 40,
    maxHfov: 120
  });
};

// ============================================================================
// 5. GESTION DES MANCHES, INDICE (SCORE ÷ 2) ET CHRONOMÈTRE
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

  if (preloadedSharedRounds.value && preloadedSharedRounds.value[currentRound.value - 1]) {
    currentLocation.value = preloadedSharedRounds.value[currentRound.value - 1];
  } else {
    currentLocation.value =
      activeMode.value === '360'
        ? await fetchRandomLive360()
        : await fetchVerifiedPlace('photo');
  }

  isLoadingLocation.value = false;

  if (activeMode.value === '360' && currentLocation.value?.isTrueEquirectangular) {
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
    const rawScore = computeGeoScore(dKm);
    lastRoundScore.value = hintUsed.value ? Math.round(rawScore / 2) : rawScore;
  }

  totalScore.value += lastRoundScore.value;

  roundHistory.value.push({
    actual: { ...currentLocation.value },
    guessLatLng: guessLatLng.value ? [...guessLatLng.value] : null,
    distanceKm: lastRoundDistanceKm.value,
    distanceDisplay: lastRoundDistanceDisplay.value,
    score: lastRoundScore.value,
    hintUsed: hintUsed.value
  });

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
// 6. PARTAGE D'UN DÉFI ENTRE AMIS
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
        isTrueEquirectangular: h.actual.isTrueEquirectangular,
        title: h.actual.title,
        countryName: h.actual.countryName,
        continent: h.actual.continent,
        subregion: h.actual.subregion,
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