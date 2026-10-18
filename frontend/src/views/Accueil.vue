<template>
  <div class="home-wrapper">
    <!-- ========================================== -->
    <!-- SECTION 1 : HERO                           -->
    <!-- ========================================== -->
    <section class="hero-section fade-in-up">
      <div class="version-pill">
        <span class="pulse-dot"></span>
        <span>{{ t('home.new_version') }}</span>
      </div>

      <h1 class="hero-heading">
        {{ t('home.title_1') }} <span class="brand-gradient">GeoLearn</span>
      </h1>

      <p class="hero-description">
        {{ t('home.desc') }}
      </p>

      <div class="hero-buttons">
        <router-link to="/quiz" class="btn-main">
          <span>{{ t('home.play_btn') }}</span>
          <span class="arrow">→</span>
        </router-link>
        <router-link to="/explorer" class="btn-outline">
          <span>🌍</span>
          <span>{{ t('home.explore_btn') }}</span>
        </router-link>
      </div>
    </section>

    <!-- ========================================== -->
    <!-- SECTION 2 : LES 4 FAÇONS D'APPRENDRE       -->
    <!-- ========================================== -->
    <section class="modes-section fade-in-up delay-1">
      <div class="modes-header">
        <h2>{{ t('home.ways_title') }}</h2>
        <p>{{ t('home.ways_desc') }}</p>
      </div>

      <div class="modes-grid">
        <!-- Carte 1 : Défi Europe -->
        <router-link to="/quiz" class="mode-card card-red">
          <div class="mode-icon-box icon-red">⏱️</div>
          <h3>{{ t('home.mode_chrono_title') }}</h3>
          <p>{{ t('home.mode_chrono_desc') }}</p>
          <span class="mode-cta cta-red">{{ t('home.try_mode') }} ▸</span>
          <div class="watermark-icon">⏱️</div>
        </router-link>

        <!-- Carte 2 : Quiz des Capitales -->
        <router-link to="/quiz" class="mode-card card-blue">
          <div class="mode-icon-box icon-blue">🏛️</div>
          <h3>{{ t('home.mode_caps_title') }}</h3>
          <p>{{ t('home.mode_caps_desc') }}</p>
          <span class="mode-cta cta-blue">{{ t('home.try_mode') }} ▸</span>
          <div class="watermark-icon">🏛️</div>
        </router-link>

        <!-- Carte 3 : Reconnaissance de Drapeaux -->
        <router-link to="/quiz" class="mode-card card-orange">
          <div class="mode-icon-box icon-orange">🚩</div>
          <h3>{{ t('home.mode_flags_title') }}</h3>
          <p>{{ t('home.mode_flags_desc') }}</p>
          <span class="mode-cta cta-orange">{{ t('home.try_mode') }} ▸</span>
          <div class="watermark-icon">🚩</div>
        </router-link>

        <!-- Carte 4 : Flashcards -->
        <router-link to="/quiz" class="mode-card card-green">
          <div class="mode-icon-box icon-green">🃏</div>
          <h3>{{ t('home.mode_flash_title') }}</h3>
          <p>{{ t('home.mode_flash_desc') }}</p>
          <span class="mode-cta cta-green">{{ t('home.try_mode') }} ▸</span>
          <div class="watermark-icon">🃏</div>
        </router-link>
      </div>
    </section>

    <!-- ========================================== -->
    <!-- SECTION 3 : BANNIÈRE STATISTIQUES          -->
    <!-- ========================================== -->
    <section class="stats-bar fade-in-up delay-2">
      <div class="stat-col">
        <span class="stat-val">190+</span>
        <span class="stat-lbl">{{ t('home.stat_countries') }}</span>
      </div>

      <div class="stat-sep"></div>

      <div class="stat-col">
        <span class="stat-val">100%</span>
        <span class="stat-lbl">{{ t('home.stat_free') }}</span>
      </div>

      <div class="stat-sep"></div>

      <div class="stat-col">
        <span class="stat-val stat-chart">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
            <polyline points="16 7 22 7 22 13"></polyline>
          </svg>
        </span>
        <span class="stat-lbl">{{ t('home.stat_tracking') }}</span>
      </div>
    </section>

    <!-- ========================================== -->
    <!-- SECTION 4 : APPEL À L'ACTION (CTA)         -->
    <!-- ========================================== -->
    <section v-if="!isLoggedIn" class="cta-section fade-in-up delay-2">
      <h2>{{ t('home.cta_title') }}</h2>
      <router-link to="/profil" class="btn-main">
        {{ t('home.cta_btn') }} →
      </router-link>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const isLoggedIn = ref(false);

onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem('geolearn_user');
});
</script>

<style scoped>
.home-wrapper {
  max-width: 1140px;
  margin: 0 auto;
  padding: 1.5rem 0 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 5.5rem;
}

/* HERO SECTION */
.hero-section {
  text-align: center;
  max-width: 820px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.version-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
  border: 1px solid rgba(37, 99, 235, 0.2);
  padding: 0.45rem 1.1rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 1.8rem;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #2563eb;
  border-radius: 50%;
  animation: pulseDot 2s infinite;
}

.hero-heading {
  font-size: clamp(2.6rem, 5vw, 4.1rem);
  font-weight: 900;
  color: var(--text-main);
  line-height: 1.14;
  letter-spacing: -0.025em;
  margin-bottom: 1.5rem;
}

.brand-gradient {
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-description {
  font-size: 1.18rem;
  color: var(--text-muted);
  line-height: 1.65;
  max-width: 680px;
  margin-bottom: 2.4rem;
}

.hero-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.15rem;
  flex-wrap: wrap;
}

.btn-main {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: #2563eb;
  color: #ffffff !important;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.05rem;
  padding: 0.95rem 1.9rem;
  border-radius: 14px;
  box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);
  transition: all 0.25s ease;
}

.btn-main:hover {
  background: #1d4ed8;
  transform: translateY(-3px);
  box-shadow: 0 15px 30px -5px rgba(37, 99, 235, 0.5);
}

.btn-main .arrow {
  transition: transform 0.25s ease;
}

.btn-main:hover .arrow {
  transform: translateX(4px);
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  background: var(--card-bg);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  text-decoration: none;
  font-weight: 700;
  font-size: 1.05rem;
  padding: 0.95rem 1.8rem;
  border-radius: 14px;
  box-shadow: var(--shadow-sm);
  transition: all 0.25s ease;
}

.btn-outline:hover {
  border-color: #2563eb;
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

/* SECTION DES 4 MODES */
.modes-section {
  width: 100%;
}

.modes-header {
  text-align: center;
  margin-bottom: 3.2rem;
}

.modes-header h2 {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 0.75rem;
}

.modes-header p {
  font-size: 1.08rem;
  color: var(--text-muted);
  max-width: 620px;
  margin: 0 auto;
}

.modes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.mode-card {
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  padding: 2.2rem;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-red {
  background: linear-gradient(145deg, var(--card-bg) 40%, rgba(254, 226, 226, 0.35) 100%);
  border-color: rgba(254, 202, 202, 0.6);
}
.card-blue {
  background: linear-gradient(145deg, var(--card-bg) 40%, rgba(219, 234, 254, 0.35) 100%);
  border-color: rgba(191, 219, 254, 0.6);
}
.card-orange {
  background: linear-gradient(145deg, var(--card-bg) 40%, rgba(255, 237, 213, 0.35) 100%);
  border-color: rgba(254, 215, 170, 0.6);
}
.card-green {
  background: linear-gradient(145deg, var(--card-bg) 40%, rgba(220, 252, 231, 0.35) 100%);
  border-color: rgba(187, 247, 208, 0.6);
}

:global(body.dark-mode) .card-red {
  background: linear-gradient(145deg, #1e293b 40%, rgba(239, 68, 68, 0.12) 100%);
  border-color: rgba(239, 68, 68, 0.25);
}
:global(body.dark-mode) .card-blue {
  background: linear-gradient(145deg, #1e293b 40%, rgba(59, 130, 246, 0.12) 100%);
  border-color: rgba(59, 130, 246, 0.25);
}
:global(body.dark-mode) .card-orange {
  background: linear-gradient(145deg, #1e293b 40%, rgba(249, 115, 22, 0.12) 100%);
  border-color: rgba(249, 115, 22, 0.25);
}
:global(body.dark-mode) .card-green {
  background: linear-gradient(145deg, #1e293b 40%, rgba(16, 185, 129, 0.12) 100%);
  border-color: rgba(16, 185, 129, 0.25);
}

.mode-card:hover {
  transform: translateY(-7px);
  box-shadow: var(--shadow-lg);
}

.mode-icon-box {
  width: 54px;
  height: 54px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.55rem;
  margin-bottom: 1.35rem;
  z-index: 1;
}

.icon-red { background: rgba(239, 68, 68, 0.15); }
.icon-blue { background: rgba(59, 130, 246, 0.15); }
.icon-orange { background: rgba(249, 115, 22, 0.15); }
.icon-green { background: rgba(16, 185, 129, 0.15); }

.mode-card h3 {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 0.65rem;
  z-index: 1;
}

.mode-card p {
  color: var(--text-muted);
  font-size: 0.96rem;
  line-height: 1.6;
  margin-bottom: 1.6rem;
  flex: 1;
  z-index: 1;
}

.mode-cta {
  font-weight: 700;
  font-size: 0.92rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  z-index: 1;
  transition: transform 0.2s ease;
}

.mode-card:hover .mode-cta {
  transform: translateX(5px);
}

.cta-red { color: #ef4444; }
.cta-blue { color: #3b82f6; }
.cta-orange { color: #f97316; }
.cta-green { color: #10b981; }

.watermark-icon {
  position: absolute;
  right: -10px;
  bottom: -18px;
  font-size: 6.5rem;
  opacity: 0.06;
  pointer-events: none;
  transform: rotate(-12deg);
  transition: transform 0.35s ease, opacity 0.35s ease;
}

.mode-card:hover .watermark-icon {
  transform: rotate(0deg) scale(1.08);
  opacity: 0.11;
}

/* BANNIÈRE STATISTIQUES */
.stats-bar {
  background: linear-gradient(135deg, #091e3a 0%, #0f172a 100%);
  border-radius: 22px;
  padding: 2.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: #ffffff;
  box-shadow: 0 20px 35px -10px rgba(9, 30, 58, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.stat-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.4rem;
}

.stat-val {
  font-size: 2.4rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #ffffff;
}

.stat-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  color: #38bdf8;
}

.stat-lbl {
  font-size: 0.92rem;
  color: #94a3b8;
  font-weight: 500;
}

.stat-sep {
  width: 1px;
  height: 54px;
  background: rgba(255, 255, 255, 0.12);
}

/* SECTION CTA */
.cta-section {
  text-align: center;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 22px;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.cta-section h2 {
  font-size: 1.85rem;
  font-weight: 800;
  color: var(--text-main);
}

/* ANIMATIONS */
@keyframes pulseDot {
  0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.6); }
  70% { box-shadow: 0 0 0 7px rgba(37, 99, 235, 0); }
  100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.delay-1 {
  animation-delay: 0.12s;
  opacity: 0;
}

.delay-2 {
  animation-delay: 0.24s;
  opacity: 0;
}

@media (max-width: 860px) {
  .modes-grid {
    grid-template-columns: 1fr;
  }
  .stats-bar {
    flex-direction: column;
    gap: 1.8rem;
  }
  .stat-sep {
    width: 60%;
    height: 1px;
  }
}
</style>