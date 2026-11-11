<template>
  <div class="quiz-experience max-w-[1400px] mx-auto px-2 sm:px-6 pb-24 space-y-8">

    <!-- ========================================================= -->
    <!-- 1. BARRE SUPÉRIEURE FLOTTANTE : TITRE, AUDIO & RETOUR     -->
    <!-- ========================================================= -->
    <header class="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-[#090E1A]/85 backdrop-blur-2xl p-5 sm:p-7 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="space-y-1">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-600 dark:text-sky-400 font-mono text-[11px] font-bold uppercase tracking-wider">
          <span class="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
          <span>{{ activeModeBadge }}</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {{ activeModeTitle }}
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {{ t('quiz.subtitle') }}
        </p>
      </div>

      <!-- Contrôles Audio & Retour aux modes (whitespace-nowrap garanti sur mobile) -->
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
          v-if="currentMode !== 'menu'"
          type="button"
          @click="retourMenu"
          class="px-4 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:opacity-90 text-xs font-black transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-md"
        >
          <span>←</span>
          <span>{{ t('quiz.back') }}</span>
        </button>
      </div>
    </header>

    <!-- ========================================================= -->
    <!-- TRANSITION SPATIALE ENTRE LES MODES DE JEU                -->
    <!-- ========================================================= -->
    <transition name="stage-morph" mode="out-in">

      <!-- ======================================================= -->
      <!-- MENU PRINCIPAL : RÉPERTOIRE DES 11 EXPÉRIENCES          -->
      <!-- ======================================================= -->
      <div v-if="currentMode === 'menu'" key="quiz-menu" class="space-y-8">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-slate-200/70 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10">
            <button
              v-for="cat in menuCategories"
              :key="cat.id"
              type="button"
              @click="selectedMenuCat = cat.id"
              class="px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer"
              :class="selectedMenuCat === cat.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
            >
              {{ cat.label }}
            </button>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <router-link
              to="/geoguessr"
              class="px-4 py-2 rounded-full bg-sky-500/15 border border-sky-500/35 text-sky-600 dark:text-sky-300 text-xs font-bold hover:bg-sky-500 hover:text-slate-950 transition flex items-center gap-2"
            >
              <span>GeoLearn PinDrop (25 000 pts)</span>
              <span>→</span>
            </router-link>
            <router-link
              to="/duel"
              class="px-4 py-2 rounded-full bg-rose-500/15 border border-rose-500/35 text-rose-600 dark:text-rose-300 text-xs font-bold hover:bg-rose-500 hover:text-white transition flex items-center gap-2"
            >
              <span>{{ locale === 'fr' ? 'Arène Duel 1v1' : '1v1 Duel Arena' }}</span>
              <span>→</span>
            </router-link>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <button
            v-for="card in filteredMenuCards"
            :key="card.id"
            type="button"
            @click="card.action()"
            class="group text-left rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/60 hover:shadow-2xl cursor-pointer"
          >
            <div>
              <div class="flex items-center justify-between gap-2 mb-4">
                <span class="font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border" :class="card.badgeClass">
                  {{ card.tag }}
                </span>
                <span class="font-mono text-xs text-slate-400">
                  {{ card.metric }}
                </span>
              </div>

              <h3 class="text-xl font-black text-slate-900 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors mb-2">
                {{ card.title }}
              </h3>

              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {{ card.desc }}
              </p>
            </div>

            <div class="mt-6 pt-4 border-t border-slate-100 dark:border-white/[0.06] w-full flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-sky-500 dark:group-hover:text-sky-400">
              <span>{{ card.cta }}</span>
              <span class="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/5 group-hover:bg-sky-500 group-hover:text-white flex items-center justify-center transition-all">→</span>
            </div>
          </button>
        </div>
      </div>

      <!-- ======================================================= -->
      <!-- MODE 1 : QCM CLASSIQUES (15 QUESTIONS + BILAN DÉTAILLÉ) -->
      <!-- ======================================================= -->
      <div v-else-if="currentMode === 'qcm'" key="quiz-qcm" class="max-w-3xl mx-auto">
        <transition name="card-flip-fade" mode="out-in">
          <!-- QUESTION ACTIVE -->
          <div
            v-if="!qcmFini && currentQcmQuestion"
            :key="'qcm-q-' + qcmIndex"
            class="rounded-3xl border border-slate-200/90 dark:border-white/12 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl space-y-7"
          >
            <!-- Barre de progression segmentée (15 questions) + Série active -->
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

            <!-- Visuel central de la question -->
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

            <!-- 4 Options de réponse (Pilotables à la souris ou touches 1, 2, 3, 4) -->
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

            <!-- Note culturelle instantanée après réponse -->
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

          <!-- ÉCRAN DE FIN DE QCM + BILAN COMPLET DES 15 QUESTIONS -->
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

            <!-- Récapitulatif détaillé des 15 réponses (Correction) -->
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
      <div v-else-if="currentMode === 'flash60'" key="quiz-flash60" class="max-w-3xl mx-auto">
        <div
          v-if="!flashFinished && currentFlashQuestion"
          class="rounded-3xl border border-amber-500/30 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl space-y-6"
        >
          <!-- Jauge circulaire SVG 60s + Multiplicateur de Combo -->
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
              ? `${flashCorrectCount} bonnes réponses • Meilleure série : ${flashBestStreak}`
              : `${flashCorrectCount} correct answers • Best streak: ${flashBestStreak}` }}
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
      <div v-else-if="currentMode === 'mystery'" key="quiz-mystery" class="max-w-5xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          <!-- Colonne Principale (7 cols) : Saisie Mobile/PC & Grille des 6 essais -->
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

            <!-- Saisie : Bouton Valider centré en dessous sur mobile (<640px), en ligne sur PC (sm:flex-row) -->
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

              <!-- Suggestions cliquables pendant la frappe -->
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

            <!-- Grille des 6 tentatives (Nom complet du pays jamais tronqué en Fr...) -->
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

            <!-- Bilan final du Pays Mystère -->
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

          <!-- Colonne Droite (5 cols) : Globe Radar 3D de Triangulation Thermique -->
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
      <div v-else-if="currentMode === 'detective'" key="quiz-detective" class="max-w-4xl mx-auto">
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

          <!-- 5 Vraies Cartes d'Indices 3D Recto-Verso -->
          <div class="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div
              v-for="(clue, idx) in currentDetectiveClues"
              :key="'clue-' + idx"
              class="clue-3d-scene"
              @click="idx === detectiveCluesRevealed && !detectiveRoundAnswered ? detectiveCluesRevealed++ : null"
            >
              <div class="clue-3d-inner" :class="{ 'is-flipped': idx < detectiveCluesRevealed }">
                <!-- Dos verrouillé de l'indice -->
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

                <!-- Face révélée en 3D de l'indice -->
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

          <!-- Saisie de la réponse d'enquête -->
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
      <!-- MODE 5 : DÉFIS CHRONO (AVEC GLOBE 3D INTERACTIF + 2D)   -->
      <!-- ======================================================= -->
      <div v-else-if="currentMode === 'chrono'" key="quiz-chrono" class="space-y-6">
        <div class="rounded-3xl border border-slate-200 dark:border-white/12 bg-white/90 dark:bg-[#090E1A]/90 backdrop-blur-2xl p-5 sm:p-7 shadow-2xl space-y-5">

          <!-- Barre de contrôle : Europe (47) / Monde (196) + Bascule Globe 3D / Carte 2D + Temps -->
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

              <!-- Sélecteur de Vue : Globe 3D Interactif vs Carte Muette 2D -->
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
                  {{ locale === 'fr' ? 'Planisphère 2D' : '2D World Map' }}
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

            <!-- Compteur & Progression -->
            <div class="flex items-center gap-2.5 font-mono">
              <span class="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-black">
                {{ chronoFoundIds.length }} / {{ chronoTargetCountries.length }} ({{ Math.round((chronoFoundIds.length / chronoTargetCountries.length) * 100) }}%)
              </span>
              <span class="px-4 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-sm font-black">
                {{ chronoDuration === 0 ? '∞' : formatTime(chronoTimeLeft) }}
              </span>
            </div>
          </div>

          <!-- Barre de saisie + Feedback Dernier Pays Trouvé ou Doublon -->
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

            <!-- Toast du dernier pays validé ou alerte doublon -->
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

          <!-- VUE 1 : GLOBE 3D INTERACTIF AVEC ROTATION AUTOMATIQUE SUR LE DERNIER PAYS TROUVÉ -->
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

          <!-- VUE 2 : PLANISPHÈRE MUET 2D LEAFLET -->
          <div
            v-else
            class="h-[390px] sm:h-[450px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 relative z-0"
          >
            <l-map
              v-model:zoom="chronoMapZoom"
              v-model:center="chronoMapCenter"
              :min-zoom="2"
              :max-zoom="6"
              :use-global-leaflet="false"
            >
              <l-tile-layer :url="blankTileUrl" :no-wrap="false"></l-tile-layer>
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

          <!-- Grille alphabétique par continent style JetPunk -->
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
      <div v-else-if="currentMode === 'map-click'" key="quiz-mapclick" class="space-y-5">
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

          <div class="h-[440px] sm:h-[500px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 relative z-0">
            <l-map
              v-model:zoom="mapClickZoom"
              v-model:center="mapClickCenter"
              :min-zoom="2"
              :max-zoom="7"
              :use-global-leaflet="false"
            >
              <l-tile-layer :url="blankTileUrl" :no-wrap="false"></l-tile-layer>
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
      <div v-else-if="currentMode === 'flashcards'" key="quiz-flashcards" class="max-w-2xl mx-auto space-y-6">
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

        <!-- Scène 3D de la Flashcard -->
        <div
          v-if="currentFlashcard"
          class="flash-3d-scene"
          @click="isFlipped = !isFlipped"
        >
          <div class="flash-3d-inner" :class="{ 'is-flipped': isFlipped }">
            <!-- Recto -->
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

            <!-- Verso -->
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

        <!-- Contrôles Précédent / Retourner / Acquis / Suivant -->
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
      <div v-else-if="currentMode === 'flag-grid'" key="quiz-flaggrid" class="space-y-6">
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
      <div v-else-if="currentMode === 'custom-builder'" key="quiz-builder" class="max-w-4xl mx-auto">
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
import { LMap, LTileLayer, LPopup, LCircleMarker } from "@vue-leaflet/vue-leaflet";

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const API_URL = 'https://geolearn-backend-bj65.onrender.com';

// =========================================================
// DICTIONNAIRE D'ALIAS POUR SAISIE NATURELLE (CHRONO & GRILLE)
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
   Centrafrique: 'cf', 'republique centrafricaine': 'cf', 'central african republic': 'cf'
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
// BASE DES 196 PAYS AVEC IDENTIFIANT UNIQUE GARANTI (FIX 15 QCM)
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

const blankTileUrl = computed(() => {
  const isDark = document.documentElement.classList.contains('dark');
  return isDark
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
    : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
});

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

const renderActiveQuizGlobe = () => {
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

    // Sphère océanique
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

    // Frontières vectorielles
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

    // Rendu spécifique : Défi Chrono sur Globe 3D
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

    // Rendu spécifique : Triangulation Worldle sur Globe 3D
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

  globeAnimId = requestAnimationFrame(renderActiveQuizGlobe);
};

// =========================================================
// NAVIGATION INTERNE & ENREGISTREMENT DES SCORES
// =========================================================
const currentMode = ref('menu');
const selectedMenuCat = ref('all');

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
// MODE 2 : SPRINT 60 SECONDES (FLASH 60)
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
      sauvegarderScore('QCM Flash 60s', flashScore.value, 40);
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
// MODE 5 : DÉFIS CHRONO (AVEC GLOBE 3D INTERACTIF & ALIAS)
// =========================================================
const chronoScope = ref('europe');
const chronoViewMode = ref('globe3d'); // 'globe3d' | 'map2d'
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

  // Vérifie d'abord si le pays est déjà trouvé (pour afficher le message de doublon)
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
  // Dépendance réactive sur flashShuffleSeed pour mélanger
  void flashShuffleSeed.value;
  const base =
    selectedFlashContinent.value === 'all'
      ? [...localizedCountries.value]
      : localizedCountries.value.filter((c) => c.continent === selectedFlashContinent.value);
  return base;
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
// MODE 8 : GRILLE MONDIALE DES 196 DRAPEAUX (AVEC AUTO-FOCUS)
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

    // Auto-focus fluide sur le champ suivant non résolu
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
// CATALOGUE DU MENU QUIZ & ROUTAGE PAR QUERY
// =========================================================
const menuCategories = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    { id: 'all', label: isFr ? 'Tous les modes (11)' : 'All Modes (11)' },
    { id: 'featured', label: isFr ? 'Défis Phares 3D' : '3D Featured' },
    { id: 'classics', label: isFr ? 'QCM & Chrono' : 'QCM & Timed' },
    { id: 'study', label: isFr ? 'Révision & Sur-mesure' : 'Study & Custom' }
  ];
});

const allMenuCards = computed(() => {
  const isFr = locale.value === 'fr';
  return [
    {
      id: 'mystery',
      cat: 'featured',
      tag: 'WORLDLE + RADAR 3D',
      metric: '6 ESSAIS',
      title: isFr ? 'Le Pays Mystère (Worldle)' : 'Mystery Country (Worldle)',
      desc: isFr
        ? 'Devinez le pays secret en 6 tentatives grâce à la distance en kilomètres, la boussole et le Globe Radar 3D de triangulation.'
        : 'Guess the secret country in 6 tries using distance in km, compass bearing, and the 3D Triangulation Globe.',
      cta: isFr ? 'Lancer le Pays Mystère' : 'Play Mystery Country',
      badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
      action: () => initDailyMystery()
    },
    {
      id: 'chrono',
      cat: 'featured',
      tag: 'GLOBE 3D + JETPUNK',
      metric: '47 / 196',
      title: isFr ? 'Défis Chrono (Globe 3D & Carte)' : 'Timed Challenge (3D Globe & Map)',
      desc: isFr
        ? 'Saisissez au clavier les 47 pays d\'Europe ou les 196 pays du Monde et regardez le Globe 3D tourner et s\'illuminer à chaque pays trouvé.'
        : 'Type all 47 European countries or all 196 World countries as the 3D Globe spins and lights up on every hit.',
      cta: isFr ? 'Lancer le Défi Chrono 3D' : 'Start 3D Timed Challenge',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      action: () => demarrerChrono()
    },
    {
      id: 'flash60',
      cat: 'featured',
      tag: 'SPRINT 60S',
      metric: 'COMBO X4',
      title: isFr ? 'Contre-la-montre 60 secondes' : '60-Second Flash Sprint',
      desc: isFr
        ? 'Enchaînez un maximum de capitales et drapeaux en 60 secondes avec multiplicateur de combo et bonus de +2s.'
        : 'Chain as many capitals and flags as possible in 60 seconds with combo multipliers and +2s bonuses.',
      cta: isFr ? 'Démarrer le Sprint 60s' : 'Start 60s Sprint',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      action: () => startFlash60()
    },
    {
      id: 'detective',
      cat: 'featured',
      tag: 'CARTES 3D',
      metric: '25 PTS MAX',
      title: isFr ? 'Enquête aux 5 Indices 3D' : '5-Clue 3D Detective',
      desc: isFr
        ? 'Retournez les cartes d\'indices en 3D une par une (superficie, monnaie, anecdote, capitale, drapeau) pour démasquer l\'État.'
        : 'Flip 3D clue cards one by one to unmask the target sovereign state with maximum points.',
      cta: isFr ? 'Ouvrir le dossier' : 'Start Investigation',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      action: () => initDetective()
    },
    {
      id: 'qcm-cap',
      cat: 'classics',
      tag: 'CAPITALES',
      metric: '15 QUESTIONS',
      title: t('home.mode_caps_title'),
      desc: t('home.mode_caps_desc'),
      cta: isFr ? 'Lancer les 15 questions' : 'Start 15 Questions',
      badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      action: () => initQcm('capital')
    },
    {
      id: 'qcm-flag',
      cat: 'classics',
      tag: 'DRAPEAUX',
      metric: '15 QUESTIONS',
      title: t('home.mode_flags_title'),
      desc: t('home.mode_flags_desc'),
      cta: isFr ? 'Lancer les 15 questions' : 'Start 15 Questions',
      badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      action: () => initQcm('flag')
    },
    {
      id: 'qcm-culture',
      cat: 'classics',
      tag: 'CULTURE & DÉMO',
      metric: '15 QUESTIONS',
      title: isFr ? 'Population, Langues & Devises' : 'Population, Languages & Currencies',
      desc: isFr
        ? 'Comparez les ordres de grandeur démographiques et identifiez les langues officielles et les monnaies.'
        : 'Compare population magnitudes and identify official languages and national currencies.',
      cta: isFr ? 'Lancer le quiz culture' : 'Start Culture Quiz',
      badgeClass: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30',
      action: () => initQcm('culture')
    },
    {
      id: 'map-click',
      cat: 'classics',
      tag: 'SETERRA',
      metric: 'SANS CLAVIER',
      title: isFr ? 'Cliquez sur la Carte Muette' : 'Click on the Blank Map',
      desc: isFr
        ? 'Pointez directement chaque État demandé sur la carte muette sans aucune saisie clavier.'
        : 'Click directly on each requested country on the blank map with zero typing.',
      cta: isFr ? 'Tester ma précision' : 'Test Map Accuracy',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      action: () => initMapClick('europe')
    },
    {
      id: 'flashcards',
      cat: 'study',
      tag: 'ÉTUDE 3D',
      metric: '196 FICHES',
      title: t('home.mode_flash_title'),
      desc: isFr
        ? 'Révisez sans pression avec les cartes mémoire 3D recto-verso filtrables par continent.'
        : 'Study with zero pressure using 3D flip flashcards filterable by continent.',
      cta: isFr ? 'Ouvrir les Flashcards 3D' : 'Open 3D Flashcards',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      action: () => { currentMode.value = 'flashcards'; }
    },
    {
      id: 'flag-grid',
      cat: 'study',
      tag: '196 DRAPEAUX',
      metric: 'AUTO-FOCUS',
      title: isFr ? 'Grille Mondiale des Drapeaux' : 'World Flag Matrix',
      desc: isFr
        ? 'Visualisez simultanément tous les drapeaux d\'un continent ou du monde avec passage automatique au drapeau suivant.'
        : 'View all flags from a continent or the world simultaneously with auto-focusing inputs.',
      cta: isFr ? 'Ouvrir la Grille' : 'Open Flag Matrix',
      badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      action: () => { currentMode.value = 'flag-grid'; }
    },
    {
      id: 'custom-builder',
      cat: 'study',
      tag: 'SUR-MESURE',
      metric: '5 À 15 PAYS',
      title: isFr ? 'Créateur de Défis Personnalisés' : 'Custom Challenge Builder',
      desc: isFr
        ? 'Sélectionnez de 5 à 15 pays précis pour générer un lien de défi sur-mesure à envoyer à vos amis.'
        : 'Select 5 to 15 specific countries to generate a shareable custom challenge link.',
      cta: isFr ? 'Créer un défi' : 'Build Challenge',
      badgeClass: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30',
      action: () => { currentMode.value = 'custom-builder'; }
    }
  ];
});

const filteredMenuCards = computed(() => {
  if (selectedMenuCat.value === 'all') return allMenuCards.value;
  return allMenuCards.value.filter((c) => c.cat === selectedMenuCat.value);
});

const retourMenu = () => {
  if (flashTimer) clearInterval(flashTimer);
  if (chronoTimer) clearInterval(chronoTimer);
  currentMode.value = 'menu';
  router.replace({ path: '/quiz', query: {} });
};

const applyRouteQuery = (q) => {
  const m = q?.mode;
  if (!m) {
    currentMode.value = 'menu';
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

// Raccourcis clavier universels (Flèches/Espace en Flashcards, Touches 1-4 en QCM & Sprint 60s)
const handleKeydown = (e) => {
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

  if (currentMode.value === 'flashcards') {
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
  renderActiveQuizGlobe();
  applyRouteQuery(route.query);
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  if (globeAnimId) cancelAnimationFrame(globeAnimId);
  if (flashTimer) clearInterval(flashTimer);
  if (chronoTimer) clearInterval(chronoTimer);
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.grid-cols-15 {
  grid-template-columns: repeat(15, minmax(0, 1fr));
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
</style>