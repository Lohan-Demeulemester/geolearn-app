<template>
  <div class="max-w-5xl mx-auto space-y-8">
    
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-500 mb-2">{{ t('scores.title') }}</h2>
        <p class="text-gray-600 dark:text-gray-400 transition-colors duration-500">{{ t('scores.subtitle') }}</p>
      </div>
    </div>

    <!-- Si l'utilisateur n'est pas connecté -->
    <div v-if="!isLoggedIn" class="text-center py-12 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div class="text-4xl mb-4">🔒</div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">{{ t('scores.locked_title') }}</h3>
      <router-link to="/profil" class="bg-brandBlue text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition inline-block">
        {{ t('scores.go_to_profile') }}
      </router-link>
    </div>

    <!-- Si l'utilisateur est connecté -->
    <div v-else>
      <!-- Cartes de statistiques rapides -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-all duration-300 hover:shadow-md">
          <div class="w-14 h-14 bg-blue-100 dark:bg-gray-700 text-brandBlue dark:text-blue-400 rounded-full flex items-center justify-center text-2xl">🎮</div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">{{ t('scores.played') }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.totalParties }}</p>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-all duration-300 hover:shadow-md">
          <div class="w-14 h-14 bg-green-100 dark:bg-gray-700 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-2xl">📈</div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">{{ t('scores.avg_score') }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.scoreMoyen }} <span class="text-sm font-normal text-gray-500">/ 15</span></p>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-all duration-300 hover:shadow-md">
          <div class="w-14 h-14 bg-yellow-100 dark:bg-gray-700 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center text-2xl">🏆</div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">{{ t('scores.best_score') }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.meilleurScore }} <span class="text-sm font-normal text-gray-500">/ 15</span></p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Graphique de progression -->
        <div class="lg:col-span-2 bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-500">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">{{ t('scores.chart_title') }}</h3>
          
          <div v-if="historiqueQcm.length >= 2" class="h-72 w-full">
            <Line :data="chartData" :options="chartOptions" :key="chartKey" />
          </div>
          <div v-else class="h-72 w-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-900/50 rounded-xl text-center px-4">
            {{ t('scores.need_more_games') }}
          </div>
        </div>

        <!-- Historique récent -->
        <div class="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-500 overflow-hidden flex flex-col">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">{{ t('scores.history_title') }}</h3>
          
          <div class="space-y-4 overflow-y-auto pr-2 max-h-72">
            <div v-if="historique.length === 0" class="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
              {{ t('scores.no_games') }}
            </div>
            
            <div v-for="partie in historique" :key="partie.id" class="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div class="flex items-center gap-3">
                <span class="text-2xl">{{ getIcon(partie.mode) }}</span>
                <div>
                  <p class="font-bold text-gray-900 dark:text-white text-sm">{{ traduireMode(partie.mode) }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(partie.played_at) }}</p>
                </div>
              </div>
              <div class="font-bold text-brandBlue dark:text-blue-400">
                {{ partie.score }}/{{ partie.max_score }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const { t, locale } = useI18n(); // <-- On importe t ici
const isLoggedIn = ref(false);
const historique = ref([]);
const chartKey = ref(0); 

const stats = ref({
  totalParties: 0,
  scoreMoyen: 0,
  meilleurScore: 0
});

const chartData = ref({ labels: [], datasets: [] });

const historiqueQcm = computed(() => {
  return historique.value.filter(p => p.mode.includes('QCM')).reverse();
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { min: 0, max: 15, grid: { color: 'rgba(156, 163, 175, 0.2)' } },
    x: { grid: { display: false } }
  }
};

const getIcon = (mode) => {
  if (mode.includes('Capitales')) return '🏛️';
  if (mode.includes('Drapeaux')) return '🚩';
  if (mode.includes('Défi') || mode.includes('Challenge')) return '⏱️';
  return '🎮';
};

const traduireMode = (mode) => {
  if (locale.value === 'en') {
    if (mode === 'QCM Capitales') return 'Capitals Quiz';
    if (mode === 'QCM Drapeaux') return 'Flags Quiz';
    if (mode === 'Défi Europe') return 'Europe Challenge';
  }
  return mode; 
};

const formatDate = (dateString) => {
  const codeLangue = locale.value === 'en' ? 'en-US' : 'fr-FR';
  const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(codeLangue, options);
};

const fetchScores = async () => {
  const savedUser = localStorage.getItem('geolearn_user');
  if (!savedUser) {
    isLoggedIn.value = false;
    return;
  }
  
  isLoggedIn.value = true;
  const user = JSON.parse(savedUser);

  try {
    const response = await fetch(`http://localhost:3000/api/scores/${user.id}`);
    if (response.ok) {
      historique.value = await response.json();
      calculerStats();
      mettreAJourGraphique();
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des scores :", error);
  }
};

const calculerStats = () => {
  stats.value.totalParties = historique.value.length;
  
  const qcms = historique.value.filter(p => p.mode.includes('QCM'));
  if (qcms.length > 0) {
    const totalScore = qcms.reduce((sum, partie) => sum + partie.score, 0);
    stats.value.scoreMoyen = (totalScore / qcms.length).toFixed(1);
    stats.value.meilleurScore = Math.max(...qcms.map(p => p.score));
  }
};

const mettreAJourGraphique = () => {
  const qcms = historiqueQcm.value;
  const recentQcms = qcms.slice(-10);
  
  chartData.value = {
    labels: recentQcms.map((_, i) => `P${i + 1}`),
    datasets: [{
      label: 'Score QCM',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      borderColor: '#2563eb',
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#2563eb',
      pointBorderWidth: 2,
      pointRadius: 4,
      fill: true,
      data: recentQcms.map(p => p.score)
    }]
  };
  
  chartKey.value++;
};

onMounted(() => {
  fetchScores();
});
</script>