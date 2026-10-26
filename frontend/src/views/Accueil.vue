<template>
  <div class="max-w-6xl mx-auto space-y-16 pb-12">

    <!-- ========================================================= -->
    <!-- 1. HERO SECTION MODERNE AVEC CARTE 3D INTERACTIVE         -->
    <!-- ========================================================= -->
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-12 lg:p-14 shadow-xl border border-blue-500/20">
      <!-- Halos lumineux décoratifs en arrière-plan -->
      <div class="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-cyan-400/15 blur-3xl"></div>

      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        <!-- Colonne Gauche : Accroche & Actions -->
        <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-extrabold uppercase tracking-wider text-cyan-300">
            <span>🌍</span>
            <span>{{ locale === 'fr' ? 'Plateforme Géographique Interactive' : 'Interactive Geography Platform' }}</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            {{ locale === 'fr' ? 'Explorez et maîtrisez' : 'Explore and master' }}
            <span class="block bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent mt-1">
              {{ locale === 'fr' ? 'les 196 pays du monde.' : 'all 196 countries.' }}
            </span>
          </h1>

          <p class="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            {{ locale === 'fr'
              ? 'Défis quotidiens Worldle, exploration Satellite & Photo PinDrop, enquêtes aux 5 indices, grilles par continent style JetPunk et flashcards 3D pour réviser et progresser à votre rythme.'
              : 'Daily Worldle challenges, Satellite & Photo PinDrop exploration, 5-clue detective cases, JetPunk-style continent grids, and 3D flashcards to learn and progress at your own pace.' }}
          </p>

          <!-- Boutons d'action principaux -->
          <div class="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
            <router-link
              to="/quiz"
              class="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-base shadow-lg shadow-blue-600/30 hover:-translate-y-0.5 transition-all text-center"
            >
              🎮 {{ locale === 'fr' ? 'Lancer un Quiz' : 'Start a Quiz' }}
            </router-link>

            <router-link
              to="/geoguessr"
              class="w-full sm:w-auto px-7 py-4 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 font-extrabold text-base border border-cyan-400/40 backdrop-blur-sm hover:-translate-y-0.5 transition-all text-center"
            >
              🛰️ {{ locale === 'fr' ? 'GeoLearn PinDrop' : 'GeoLearn PinDrop' }}
            </router-link>

            <router-link
              to="/explorer"
              class="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-base border border-white/15 backdrop-blur-sm hover:-translate-y-0.5 transition-all text-center"
            >
              🗺️ {{ locale === 'fr' ? 'Atlas 3D' : '3D Atlas' }}
            </router-link>
          </div>

          <!-- Chiffres clés mis à jour (196 Pays / 10 Modes / 100% Bilingue) -->
          <div class="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
            <div>
              <strong class="text-2xl sm:text-3xl font-black text-white block">196</strong>
              <span class="text-xs sm:text-sm text-slate-400 font-medium">
                {{ locale === 'fr' ? 'Pays & Fiches 3D' : 'Countries & 3D Cards' }}
              </span>
            </div>
            <div>
              <strong class="text-2xl sm:text-3xl font-black text-cyan-300 block">10</strong>
              <span class="text-xs sm:text-sm text-slate-400 font-medium">
                {{ locale === 'fr' ? 'Modes de jeu' : 'Game Modes' }}
              </span>
            </div>
            <div>
              <strong class="text-2xl sm:text-3xl font-black text-emerald-300 block">100%</strong>
              <span class="text-xs sm:text-sm text-slate-400 font-medium">
                {{ locale === 'fr' ? 'Interactif & Bilingue' : 'Interactive & Bilingual' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Colonne Droite : Carte Pays 3D Interactive en direct -->
        <div class="lg:col-span-5 flex flex-col items-center">
          <div class="w-full max-w-sm">
            <div class="flex items-center justify-between text-xs font-bold text-slate-300 mb-2.5 px-1">
              <span>🃏 {{ locale === 'fr' ? 'Aperçu Fiche 3D (Cliquez dessus !)' : '3D Card Preview (Click it!)' }}</span>
              <button
                type="button"
                @click="pickRandomHeroCountry"
                class="text-cyan-300 hover:text-white transition cursor-pointer flex items-center gap-1"
              >
                ⟳ {{ locale === 'fr' ? 'Autre pays' : 'Random' }}
              </button>
            </div>

            <!-- Scène 3D de démonstration -->
            <div class="hero-flip-scene" @click="heroCardFlipped = !heroCardFlipped">
              <div class="hero-flip-inner" :class="{ 'is-flipped': heroCardFlipped }">
                
                <!-- Recto de la carte démo -->
                <div class="hero-flip-face hero-flip-front bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-7 flex flex-col items-center justify-between text-center shadow-2xl">
                  <div class="w-full flex justify-between items-center">
                    <span class="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/30 text-cyan-200">
                      {{ heroCountry.subregion }}
                    </span>
                    <span class="text-xs text-slate-300 font-semibold">↻ Flip 3D</span>
                  </div>

                  <div class="my-6 flex flex-col items-center">
                    <img
                      :src="`https://flagcdn.com/w320/${heroCountry.iso}.png`"
                      :alt="heroCountry.name"
                      class="h-24 w-auto rounded-xl shadow-lg mb-4 border border-white/20"
                    />
                    <h3 class="text-2xl font-black text-white mb-1">{{ heroCountry.name }}</h3>
                    <p class="text-sm text-slate-300">
                      {{ t('common.capital') }} : <strong class="text-white">{{ heroCountry.capital }}</strong>
                    </p>
                  </div>

                  <div class="w-full pt-3 border-t border-white/10 text-xs font-bold text-cyan-300">
                    {{ locale === 'fr' ? 'Cliquez pour retourner la carte ↻' : 'Click to flip card ↻' }}
                  </div>
                </div>

                <!-- Verso de la carte démo -->
                <div class="hero-flip-face hero-flip-back bg-slate-900/95 border border-cyan-400/40 rounded-3xl p-6 flex flex-col justify-between text-left shadow-2xl">
                  <div>
                    <div class="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-white/10">
                      <div class="flex items-center gap-3">
                        <img
                          :src="`https://flagcdn.com/w80/${heroCountry.iso}.png`"
                          :alt="heroCountry.name"
                          class="h-8 w-auto rounded shadow-sm"
                        />
                        <h4 class="font-black text-lg text-white leading-tight">{{ heroCountry.name }}</h4>
                      </div>
                      <span class="text-xs text-cyan-300 font-bold">↻</span>
                    </div>

                    <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div class="bg-white/5 p-2.5 rounded-xl">
                        <span class="text-slate-400 block">🏛️ {{ t('common.capital') }}</span>
                        <strong class="text-white">{{ heroCountry.capital }}</strong>
                      </div>
                      <div class="bg-white/5 p-2.5 rounded-xl">
                        <span class="text-slate-400 block">👥 {{ locale === 'fr' ? 'Habitants' : 'Population' }}</span>
                        <strong class="text-white">{{ heroCountry.population }}</strong>
                      </div>
                      <div class="bg-white/5 p-2.5 rounded-xl">
                        <span class="text-slate-400 block">🗣️ {{ locale === 'fr' ? 'Langue' : 'Language' }}</span>
                        <strong class="text-white truncate block">{{ heroCountry.lang }}</strong>
                      </div>
                      <div class="bg-white/5 p-2.5 rounded-xl">
                        <span class="text-slate-400 block">💶 {{ locale === 'fr' ? 'Monnaie' : 'Currency' }}</span>
                        <strong class="text-white truncate block">{{ heroCountry.currency }}</strong>
                      </div>
                    </div>

                    <div class="bg-blue-500/15 border border-blue-400/30 rounded-xl p-3 text-xs text-slate-200 leading-relaxed">
                      <strong class="text-cyan-300 block mb-0.5">💡 Fun Fact :</strong>
                      {{ heroCountry.fact }}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ========================================================= -->
    <!-- 2. BARRE DE REPRISE RAPIDE & BADGES (SI CONNECTÉ)         -->
    <!-- ========================================================= -->
    <section
      v-if="currentUser"
      class="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6"
    >
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl font-black shrink-0">
            👋
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-xl font-black text-gray-900 dark:text-white">
                {{ locale === 'fr' ? `Bon retour parmi nous, ${displayUsername} !` : `Welcome back, ${displayUsername}!` }}
              </h2>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                🏅 {{ unlockedBadgesCount }} / {{ userBadges.length }} {{ locale === 'fr' ? 'Trophées' : 'Trophies' }}
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              <template v-if="userStats.totalGames > 0">
                {{ locale === 'fr'
                  ? `Vous avez déjà joué ${userStats.totalGames} partie(s). Dernier mode joué : ${userStats.lastMode} (${userStats.lastScore}).`
                  : `You have played ${userStats.totalGames} game(s). Last played: ${userStats.lastMode} (${userStats.lastScore}).` }}
              </template>
              <template v-else>
                {{ locale === 'fr'
                  ? 'Prêt à enregistrer votre tout premier score et débloquer votre premier trophée ?'
                  : 'Ready to record your very first score and unlock your first trophy?' }}
              </template>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3 w-full md:w-auto justify-end shrink-0">
          <router-link
            to="/leaderboard"
            class="px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-sm font-bold transition"
          >
            🏆 {{ locale === 'fr' ? 'Classement' : 'Leaderboard' }}
          </router-link>
          <router-link
            to="/scores"
            class="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-sm font-bold transition"
          >
            📊 {{ locale === 'fr' ? 'Mes stats' : 'My Stats' }}
          </router-link>
          <router-link
            to="/quiz"
            class="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition shadow-sm"
          >
            ▷ {{ locale === 'fr' ? 'Jouer' : 'Play' }}
          </router-link>
        </div>
      </div>

      <!-- Mini-vitrine des Trophées & Badges de Succès débloqués en direct -->
      <div class="pt-5 border-t border-gray-100 dark:border-gray-700/70">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            🏅 {{ locale === 'fr' ? 'Vos Badges de Succès GeoLearn' : 'Your GeoLearn Achievement Badges' }}
          </span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <div
            v-for="badge in userBadges"
            :key="badge.id"
            class="p-3 rounded-2xl border flex items-center gap-2.5 transition-all"
            :class="badge.unlocked
              ? 'bg-gradient-to-br from-amber-50/90 to-orange-50/60 dark:from-amber-950/40 dark:to-orange-950/20 border-amber-300 dark:border-amber-700/80 shadow-2xs'
              : 'bg-gray-50/60 dark:bg-gray-900/40 border-gray-200/70 dark:border-gray-700/60 opacity-55 grayscale'"
          >
            <span class="text-2xl shrink-0">{{ badge.icon }}</span>
            <div class="min-w-0">
              <strong class="text-xs font-black text-gray-900 dark:text-white block truncate" :title="badge.title">
                {{ badge.title }}
              </strong>
              <span class="text-[10px] text-gray-500 dark:text-gray-400 block truncate" :title="badge.desc">
                {{ badge.desc }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- 3. EN-TÊTE GLOBAL & FILTRE RAPIDE DES RUBRIQUES DE JEU    -->
    <!-- ========================================================= -->
    <div class="space-y-12">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
        <div>
          <span class="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
            {{ locale === 'fr' ? '10 Modes de Jeu & Atlas' : '10 Game Modes & Atlas' }}
          </span>
          <h2 class="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
            {{ locale === 'fr' ? 'Choisissez votre façon d\'apprendre' : 'Choose Your Way to Learn' }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ locale === 'fr'
              ? 'Nos modes sont organisés en 4 univers complémentaires : Défis Phares, Classiques, Innovations et Révision sans pression.'
              : 'Our modes are organized into 4 complementary universes: Featured Challenges, Classics, Innovations, and Stress-free Review.' }}
          </p>
        </div>

        <!-- Filtres d'affichage par rubrique -->
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="tab in categoryTabs"
            :key="tab.id"
            type="button"
            @click="selectedCategory = tab.id"
            class="px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer border"
            :class="selectedCategory === tab.id
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-400'"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- RUBRIQUE 1 : 🌟 À LA UNE & DÉFIS D'EXPLORATION          -->
      <!-- ======================================================= -->
      <section v-if="selectedCategory === 'all' || selectedCategory === 'featured'" class="space-y-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg font-black">
              🌟
            </span>
            <div>
              <h3 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                {{ locale === 'fr' ? 'À la Une & Exploration Géolocalisée' : 'Featured & Geotagged Exploration' }}
              </h3>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {{ locale === 'fr' ? 'Les deux expériences phares de GeoLearn pour tester votre sens de l\'orientation.' : 'The two flagship GeoLearn experiences to test your sense of direction.' }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Mode 1 : Le Pays Mystère (Worldle) -->
          <router-link
            :to="{ path: '/quiz', query: { mode: 'mystery' } }"
            class="group bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white p-7 sm:p-8 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col justify-between relative overflow-hidden"
          >
            <div class="flex items-center justify-between mb-4">
              <span class="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-black/20 text-white">
                🔥 {{ locale === 'fr' ? 'Défi Quotidien & Infini' : 'Daily & Infinite Challenge' }}
              </span>
              <span class="text-3xl group-hover:scale-110 transition-transform">🧭</span>
            </div>
            <div>
              <h4 class="text-2xl font-black mb-2">
                {{ locale === 'fr' ? 'Le Pays Mystère (Worldle)' : 'Mystery Country (Worldle)' }}
              </h4>
              <p class="text-sm text-white/90 leading-relaxed">
                {{ locale === 'fr'
                  ? '6 essais pour deviner le pays secret grâce à la distance en kilomètres, la flèche de boussole (🧭 ↗️) et le pourcentage de proximité. Partagez votre grille d\'émojis avec vos amis !'
                  : '6 tries to guess the secret country using distance in km, compass direction (🧭 ↗️), and proximity percentage. Share your emoji grid with friends!' }}
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-xs sm:text-sm font-black">
              <span>{{ locale === 'fr' ? 'Partageable sur Discord / WhatsApp' : 'Shareable on Discord / WhatsApp' }}</span>
              <span class="group-hover:translate-x-1 transition-transform">{{ locale === 'fr' ? 'Jouer maintenant →' : 'Play now →' }}</span>
            </div>
          </router-link>

          <!-- Mode 2 : GeoLearn PinDrop (Satellite Espion & Photo) -->
          <router-link
            to="/geoguessr"
            class="group bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-7 sm:p-8 rounded-3xl shadow-lg border-2 border-cyan-400/30 hover:border-cyan-400 hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col justify-between relative overflow-hidden"
          >
            <div class="flex items-center justify-between mb-4">
              <span class="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                🛰️ {{ locale === 'fr' ? 'Satellite Espion & Photo HD' : 'Spy Satellite & HD Photo' }}
              </span>
              <span class="text-3xl group-hover:scale-110 transition-transform">📍</span>
            </div>
            <div>
              <h4 class="text-2xl font-black mb-2">
                GeoLearn PinDrop (25 000 pts)
              </h4>
              <p class="text-sm text-slate-300 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Inspectez une zone en vue satellite orbitale sans texte ou une photographie extérieure vérifiée dans le monde, placez votre épingle sur la carte et défiez vos amis sur les 5 mêmes manches !'
                  : 'Inspect an orbital satellite zone with zero labels or a verified outdoor photo around the world, drop your pin on the map, and challenge friends on the same 5 rounds!' }}
              </p>
            </div>
            <div class="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs sm:text-sm font-black text-cyan-300">
              <span>{{ locale === 'fr' ? '5 manches • 2 Modes • Défi entre amis' : '5 rounds • 2 Modes • Friend Duel' }}</span>
              <span class="group-hover:translate-x-1 transition-transform">{{ locale === 'fr' ? 'Ouvrir PinDrop →' : 'Open PinDrop →' }}</span>
            </div>
          </router-link>
        </div>
      </section>

      <!-- ======================================================= -->
      <!-- RUBRIQUE 2 : ⚡ CLASSIQUES & COMPÉTITION                 -->
      <!-- ======================================================= -->
      <section v-if="selectedCategory === 'all' || selectedCategory === 'classics'" class="space-y-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg font-black">
              ⚡
            </span>
            <div>
              <h3 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                {{ locale === 'fr' ? 'Classiques & Compétition' : 'Classics & Competition' }}
              </h3>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {{ locale === 'fr' ? 'Les grands incontournables de la géographie pour grimper dans le classement mondial.' : 'The essential geography challenges to climb the world leaderboard.' }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Mode 3 : Quiz des Capitales -->
          <router-link
            :to="{ path: '/quiz', query: { mode: 'qcm', type: 'capital' } }"
            class="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🏛️
                </div>
                <span class="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300">
                  QCM • Duel
                </span>
              </div>
              <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {{ t('home.mode_caps_title') }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {{ t('home.mode_caps_desc') }}
              </p>
            </div>
            <span class="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700/60 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center justify-between">
              <span>{{ locale === 'fr' ? '15 questions + Lien Duel Ami' : '15 questions + Friend Duel Link' }}</span>
              <span>→</span>
            </span>
          </router-link>

          <!-- Mode 4 : Reconnaissance de Drapeaux -->
          <router-link
            :to="{ path: '/quiz', query: { mode: 'qcm', type: 'flag' } }"
            class="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-orange-500 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🚩
                </div>
                <span class="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-300">
                  Visuel HD
                </span>
              </div>
              <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {{ t('home.mode_flags_title') }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {{ t('home.mode_flags_desc') }}
              </p>
            </div>
            <span class="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700/60 text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center justify-between">
              <span>{{ locale === 'fr' ? 'Drapeaux officiels des 6 continents' : 'Official flags from 6 continents' }}</span>
              <span>→</span>
            </span>
          </router-link>

          <!-- Mode 5 : Défis Chrono Clavier (Style JetPunk) -->
          <router-link
            :to="{ path: '/quiz', query: { mode: 'chrono' } }"
            class="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-red-500 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  ⏱️
                </div>
                <span class="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-300">
                  Style JetPunk
                </span>
              </div>
              <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {{ locale === 'fr' ? 'Défis Chrono (Clavier)' : 'Timed Map Typing' }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Tapez les 47 pays d\'Europe (3 min / 5 min / ∞) ou les 196 pays du Monde (15 min / ∞) avec remplissage de la grille alphabétique par continent !'
                  : 'Type all 47 European countries (3m / 5m / ∞) or all 196 World countries (15m / ∞) with live alphabetical continent grids!' }}
              </p>
            </div>
            <span class="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700/60 text-xs font-bold text-red-600 dark:text-red-400 flex items-center justify-between">
              <span>{{ locale === 'fr' ? 'Carte muette + Grilles par continent' : 'Blank map + Continent grids' }}</span>
              <span>→</span>
            </span>
          </router-link>
        </div>
      </section>

      <!-- ======================================================= -->
      <!-- RUBRIQUE 3 : 💡 INNOVATION & IMMERSION (MODES INÉDITS)  -->
      <!-- ======================================================= -->
      <section v-if="selectedCategory === 'all' || selectedCategory === 'innovation'" class="space-y-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg font-black">
              💡
            </span>
            <div>
              <h3 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                {{ locale === 'fr' ? 'Innovation & Immersion' : 'Innovation & Immersion' }}
              </h3>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {{ locale === 'fr' ? 'Des mécaniques de jeu originales pour découvrir la culture, la démographie et les cartes autrement.' : 'Original game mechanics to discover culture, demographics, and maps in a new way.' }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Mode 6 : Enquête aux 5 Indices -->
          <router-link
            :to="{ path: '/quiz', query: { mode: 'detective' } }"
            class="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border-2 border-indigo-500/30 hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between relative"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🕵️
                </div>
                <span class="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                  {{ locale === 'fr' ? 'Inédit' : 'Unique' }}
                </span>
              </div>
              <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {{ locale === 'fr' ? 'Enquête aux 5 Indices' : '5-Clue Detective' }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Dévoilez jusqu\'à 5 indices progressifs (superficie, habitants & monnaie, fun fact masqué, langue & capitale, drapeau). Moins d\'indices = plus de points !'
                  : 'Reveal up to 5 progressive clues (area, population & currency, masked fun fact, language & capital, flag). Fewer clues = more points!' }}
              </p>
            </div>
            <span class="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700/60 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
              <span>{{ locale === 'fr' ? '5 enquêtes • Score sur 25 pts' : '5 cases • Score out of 25 pts' }}</span>
              <span>→</span>
            </span>
          </router-link>

          <!-- Mode 7 : Cliquez sur la Carte (Style Seterra) -->
          <router-link
            :to="{ path: '/quiz', query: { mode: 'map-click' } }"
            class="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border-2 border-cyan-500/30 hover:border-cyan-500 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between relative"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🖱️
                </div>
                <span class="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300">
                  Mobile & PC
                </span>
              </div>
              <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {{ locale === 'fr' ? 'Cliquez sur la Carte' : 'Click on the Map' }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Style Seterra : cliquez directement sur le pays demandé sur la carte muette sans rien taper au clavier (Europe 47 ou Sprint Monde 25) !'
                  : 'Seterra style: click directly on the requested country on the blank map with zero typing required (Europe 47 or World Sprint 25)!' }}
              </p>
            </div>
            <span class="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700/60 text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center justify-between">
              <span>{{ locale === 'fr' ? 'Zéro saisie clavier • Précision pure' : 'Zero typing • Pure accuracy' }}</span>
              <span>→</span>
            </span>
          </router-link>

          <!-- Mode 8 : Population, Langues & Monnaies -->
          <router-link
            :to="{ path: '/quiz', query: { mode: 'qcm', type: 'culture' } }"
            class="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border-2 border-purple-500/30 hover:border-purple-500 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between relative"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🗣️
                </div>
                <span class="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                  Culture & Démo
                </span>
              </div>
              <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {{ locale === 'fr' ? 'Population & Langues' : 'Population & Languages' }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Lequel de ces 4 pays est le plus peuplé ? Quelle est sa langue officielle ou sa monnaie nationale ? Un quiz complet sur la culture mondiale.'
                  : 'Which of these 4 countries is most populous? What is its official language or national currency? A complete world culture quiz.' }}
              </p>
            </div>
            <span class="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700/60 text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center justify-between">
              <span>{{ locale === 'fr' ? 'Démographie, Langues & Devises' : 'Demographics, Languages & Currencies' }}</span>
              <span>→</span>
            </span>
          </router-link>
        </div>
      </section>

      <!-- ======================================================= -->
      <!-- RUBRIQUE 4 : 📚 RÉVISION & EXPLORATION SANS PRESSION    -->
      <!-- ======================================================= -->
      <section v-if="selectedCategory === 'all' || selectedCategory === 'revision'" class="space-y-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg font-black">
              📚
            </span>
            <div>
              <h3 class="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                {{ locale === 'fr' ? 'Révision & Exploration Atlas' : 'Review & Atlas Exploration' }}
              </h3>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {{ locale === 'fr' ? 'Entraînez votre mémoire visuelle avec nos Flashcards 3D, la grille complète des drapeaux et le comparateur de pays.' : 'Train your visual memory with our 3D Flashcards, the full flag grid, and the country comparator.' }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Mode 9 : Flashcards 3D (Révision) -->
          <router-link
            :to="{ path: '/quiz', query: { mode: 'flashcards' } }"
            class="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border-2 border-emerald-500/30 hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🃏
                </div>
                <span class="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                  {{ locale === 'fr' ? 'Mode Révision' : 'Study Mode' }}
                </span>
              </div>
              <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {{ t('home.mode_flash_title') }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Apprenez sans pression grâce aux cartes mémoire 3D recto-verso filtrables par continent (navigation aux boutons ou aux flèches du clavier).'
                  : 'Learn with zero pressure using 3D flip flashcards filterable by continent (button or keyboard arrow navigation).' }}
              </p>
            </div>
            <span class="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700/60 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
              <span>{{ locale === 'fr' ? '196 fiches complètes recto-verso' : '196 full double-sided cards' }}</span>
              <span>→</span>
            </span>
          </router-link>

          <!-- Mode 10 : Grille Mondiale des 196 Drapeaux -->
          <router-link
            :to="{ path: '/quiz', query: { mode: 'flag-grid' } }"
            class="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-teal-500 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🏳️
                </div>
                <span class="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
                  196 Drapeaux
                </span>
              </div>
              <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {{ locale === 'fr' ? 'Grille des Drapeaux' : 'World Flag Grid' }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Tous les drapeaux du monde ou d\'un continent affichés devant vous : saisissez le nom du pays sous chaque drapeau pour verdir la carte.'
                  : 'All flags from the world or a continent in front of you: type the country name under each flag to turn the card green.' }}
              </p>
            </div>
            <span class="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700/60 text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center justify-between">
              <span>{{ locale === 'fr' ? 'Filtre par continent • Auto-focus' : 'Continent filter • Auto-focus' }}</span>
              <span>→</span>
            </span>
          </router-link>

          <!-- Atlas 3D Plein Écran & Comparateur de Pays -->
          <router-link
            to="/explorer"
            class="group bg-gradient-to-br from-blue-600 to-cyan-600 text-white p-6 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  ⚖️
                </div>
                <span class="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-black/20 text-white">
                  Atlas & Outil
                </span>
              </div>
              <h4 class="text-xl font-bold mb-2">
                {{ locale === 'fr' ? 'Atlas Plein Écran & Comparateur' : 'Fullscreen Atlas & Comparator' }}
              </h4>
              <p class="text-sm text-blue-100 leading-relaxed">
                {{ locale === 'fr'
                  ? 'Comparez deux pays côte à côte (superficie, habitants, distance à vol d\'oiseau) et explorez librement les 196 fiches pays.'
                  : 'Compare any two countries side-by-side (area, population, flight distance) and freely explore all 196 country cards.' }}
              </p>
            </div>
            <span class="mt-5 pt-4 border-t border-white/20 text-xs font-bold text-white flex items-center justify-between">
              <span>{{ locale === 'fr' ? 'Ouvrir l\'Explorateur' : 'Open Explorer' }}</span>
              <span>→</span>
            </span>
          </router-link>
        </div>
      </section>

    </div>

    <!-- ========================================================= -->
    <!-- 4. WIDGET « LE SAVIEZ-VOUS ? » (ANECDOTE GÉOGRAPHIQUE)     -->
    <!-- ========================================================= -->
    <section class="bg-gradient-to-r from-blue-50 via-indigo-50/60 to-cyan-50 dark:from-gray-800 dark:via-gray-800 dark:to-slate-800 rounded-3xl p-6 sm:p-10 border border-blue-100 dark:border-gray-700 shadow-sm">
      <div class="flex flex-col lg:flex-row items-center justify-between gap-8">
        
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left flex-1">
          <img
            :src="`https://flagcdn.com/w160/${spotlightCountry.iso}.png`"
            :alt="spotlightCountry.name"
            class="h-20 w-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700 shrink-0"
          />
          <div class="space-y-2">
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span class="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-blue-600 text-white">
                💡 {{ locale === 'fr' ? 'Le saviez-vous ?' : 'Did you know?' }}
              </span>
              <span class="text-xs font-bold text-gray-500 dark:text-gray-400">
                {{ spotlightCountry.name }} • {{ t('common.capital') }} : {{ spotlightCountry.capital }} ({{ spotlightCountry.population }})
              </span>
            </div>

            <p class="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-relaxed">
              « {{ spotlightCountry.fact }} »
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <button
            type="button"
            @click="pickRandomSpotlight"
            class="px-5 py-3 rounded-xl bg-white dark:bg-gray-900 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-gray-800 dark:text-white font-bold text-sm border border-gray-200 dark:border-gray-700 transition shadow-xs cursor-pointer flex items-center gap-2"
          >
            🎲 {{ locale === 'fr' ? 'Autre anecdote' : 'Another fact' }}
          </button>
        </div>

      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ALL_COUNTRIES from '../data/countries.js';

const { t, locale } = useI18n();
const API_URL = 'https://geolearn-backend-bj65.onrender.com';

// Filtre de rubriques thématiques
const selectedCategory = ref('all');
const categoryTabs = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'all', label: isFr ? '✨ Tout voir (10)' : '✨ All Modes (10)' },
    { id: 'featured', label: isFr ? '🌟 À la Une' : '🌟 Featured' },
    { id: 'classics', label: isFr ? '⚡ Classiques' : '⚡ Classics' },
    { id: 'innovation', label: isFr ? '💡 Innovation' : '💡 Innovation' },
    { id: 'revision', label: isFr ? '📚 Révision & Atlas' : '📚 Review & Atlas' }
  ];
});

const localizedCountries = computed(() => {
  const isEn = locale.value === 'en';
  return ALL_COUNTRIES.map(c => ({
    ...c,
    name: isEn ? c.name_en : c.name_fr,
    capital: isEn ? c.capital_en : c.capital_fr,
    subregion: isEn ? c.subregion_en : c.subregion_fr,
    population: isEn ? c.population_en : c.population_fr,
    lang: isEn ? c.lang_en : c.lang_fr,
    fact: isEn ? c.fact_en : c.fact_fr
  }));
});

// Carte 3D interactive du Hero
const heroIndex = ref(14); // France par défaut
const heroCardFlipped = ref(false);
const heroCountry = computed(() => localizedCountries.value[heroIndex.value] || localizedCountries.value[0]);

const pickRandomHeroCountry = () => {
  heroCardFlipped.value = false;
  heroIndex.value = Math.floor(Math.random() * localizedCountries.value.length);
};

// Widget "Le saviez-vous ?"
const spotlightIndex = ref(Math.floor(Math.random() * ALL_COUNTRIES.length));
const spotlightCountry = computed(() => localizedCountries.value[spotlightIndex.value] || localizedCountries.value[0]);

const pickRandomSpotlight = () => {
  let next = Math.floor(Math.random() * localizedCountries.value.length);
  if (next === spotlightIndex.value) next = (next + 1) % localizedCountries.value.length;
  spotlightIndex.value = next;
};

// Informations rapides et Trophées de l'utilisateur connecté
const currentUser = ref(null);
const userScoresList = ref([]);

const displayUsername = computed(() => {
  if (!currentUser.value) return '';
  return (
    currentUser.value.username ||
    currentUser.value.pseudo ||
    currentUser.value.name ||
    (currentUser.value.user && (currentUser.value.user.username || currentUser.value.user.name)) ||
    (currentUser.value.email ? currentUser.value.email.split('@')[0] : 'Explorateur')
  );
});

const userStats = ref({
  totalGames: 0,
  lastMode: '',
  lastScore: ''
});

// Système de Badges de Succès calculé dynamiquement depuis les parties jouées
const userBadges = computed(() => {
  const isFr = locale.value === 'fr';
  const scores = userScoresList.value;
  const total = scores.length;

  const hasPerfectQcm = scores.some(s => Number(s.max_score) === 15 && Number(s.score) >= 14);
  const hasEuropeMaster = scores.some(s => (s.mode || '').includes('Europe') && Number(s.score) >= 40);
  const hasWorldExplorer = scores.some(s => (s.mode || '').includes('Monde') && Number(s.score) >= 100);
  const hasPinDropAce = scores.some(s => (s.mode || '').includes('GeoGuessr') && Number(s.score) >= 18000);
  const hasVeteran = total >= 10;

  return [
    {
      id: 'first-step',
      icon: '🚀',
      title: isFr ? 'Premier Pas' : 'First Step',
      desc: isFr ? '1re partie terminée' : '1st game completed',
      unlocked: total >= 1
    },
    {
      id: 'qcm-ace',
      icon: '🎯',
      title: isFr ? 'Expert QCM' : 'Quiz Ace',
      desc: isFr ? '14/15 ou 15/15 en QCM' : '14/15 or 15/15 in QCM',
      unlocked: hasPerfectQcm
    },
    {
      id: 'europe-master',
      icon: '🇪🇺',
      title: isFr ? 'Maître d\'Europe' : 'Europe Master',
      desc: isFr ? '40+ pays en Défi Europe' : '40+ in Europe Challenge',
      unlocked: hasEuropeMaster
    },
    {
      id: 'world-globetrotter',
      icon: '🌍',
      title: isFr ? 'Globetrotter' : 'Globetrotter',
      desc: isFr ? '100+ pays en Défi Monde' : '100+ in World Challenge',
      unlocked: hasWorldExplorer
    },
    {
      id: 'pindrop-hawk',
      icon: '🛰️',
      title: isFr ? 'Œil de Faucon' : 'Hawk Eye',
      desc: isFr ? '18 000+ pts sur PinDrop' : '18,000+ pts on PinDrop',
      unlocked: hasPinDropAce
    },
    {
      id: 'veteran',
      icon: '👑',
      title: isFr ? 'Vétéran GeoLearn' : 'GeoLearn Veteran',
      desc: isFr ? '10+ parties jouées' : '10+ games played',
      unlocked: hasVeteran
    }
  ];
});

const unlockedBadgesCount = computed(() => userBadges.value.filter(b => b.unlocked).length);

onMounted(async () => {
  const savedUser = localStorage.getItem('geolearn_user');
  if (!savedUser) return;
  try {
    const parsed = JSON.parse(savedUser);
    currentUser.value = parsed;
    const uid = parsed.id || (parsed.user && parsed.user.id);
    if (uid) {
      const res = await fetch(`${API_URL}/api/scores/${uid}`);
      if (res.ok) {
        const scores = await res.json();
        if (Array.isArray(scores) && scores.length > 0) {
          userScoresList.value = scores;
          userStats.value.totalGames = scores.length;
          userStats.value.lastMode = scores[0].mode;
          userStats.value.lastScore = `${scores[0].score}/${scores[0].max_score}`;
        }
      }
    }
  } catch (e) {
    // Silencieux si hors-ligne
  }
});
</script>

<style scoped>
.hero-flip-scene {
  perspective: 1400px;
  cursor: pointer;
}

.hero-flip-inner {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  min-height: 340px;
  transform-style: preserve-3d;
  transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
}

.hero-flip-inner.is-flipped {
  transform: rotateY(180deg);
}

.hero-flip-face {
  grid-area: 1 / 1;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.hero-flip-front {
  transform: rotateY(0deg);
}

.hero-flip-back {
  transform: rotateY(180deg);
}
</style>