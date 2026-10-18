<template>
  <div class="admin-page fade-in-up">
    <div class="admin-header">
      <div>
        <span class="admin-tag">Administration GeoLearn</span>
        <h1>{{ locale === 'fr' ? 'Gestion des retours & bugs' : 'Feedback & Bug Management' }}</h1>
      </div>
      <button type="button" class="btn-refresh" @click="fetchFeedbacks" :disabled="isLoading">
        {{ isLoading ? (locale === 'fr' ? 'Actualisation...' : 'Refreshing...') : (locale === 'fr' ? 'Actualiser' : 'Refresh') }}
      </button>
    </div>

    <!-- COMPTEURS STATISTIQUES -->
    <div class="admin-stats-grid">
      <div class="admin-stat-card">
        <span class="stat-label">{{ locale === 'fr' ? 'Total reçus' : 'Total Received' }}</span>
        <strong class="stat-number">{{ feedbacks.length }}</strong>
      </div>
      <div class="admin-stat-card">
        <span class="stat-label">{{ locale === 'fr' ? 'Nouveaux à traiter' : 'New / Unread' }}</span>
        <strong class="stat-number text-amber">{{ countByStatus('nouveau') }}</strong>
      </div>
      <div class="admin-stat-card">
        <span class="stat-label">{{ locale === 'fr' ? 'Idées proposées' : 'Suggested Ideas' }}</span>
        <strong class="stat-number text-blue">{{ countByType('suggestion') }}</strong>
      </div>
      <div class="admin-stat-card">
        <span class="stat-label">{{ locale === 'fr' ? 'Bugs signalés' : 'Reported Bugs' }}</span>
        <strong class="stat-number text-red">{{ countByType('bug') }}</strong>
      </div>
    </div>

    <!-- BARRE DE FILTRES -->
    <div class="admin-filters">
      <button
        v-for="tab in filterTabs"
        :key="tab.value"
        type="button"
        :class="['filter-btn', { active: activeFilter === tab.value }]"
        @click="activeFilter = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- LISTE DES RETOURS -->
    <div v-if="errorMessage" class="admin-error">
      {{ errorMessage }}
    </div>

    <div v-else-if="filteredFeedbacks.length === 0" class="admin-empty">
      <h3>{{ locale === 'fr' ? 'Aucun message dans cette catégorie' : 'No messages in this category' }}</h3>
      <p>{{ locale === 'fr' ? 'Les nouveaux retours des utilisateurs apparaîtront ici.' : 'New user feedback will appear here.' }}</p>
    </div>

    <div v-else class="feedback-list">
      <article
        v-for="item in filteredFeedbacks"
        :key="item.id"
        class="feedback-item-card"
      >
        <div class="item-top">
          <div class="item-badges">
            <span :class="['type-pill', `pill-${item.type}`]">
              {{ formatType(item.type) }}
            </span>
            <span :class="['status-pill', `status-${item.status}`]">
              {{ formatStatus(item.status) }}
            </span>
            <span class="item-date">
              {{ formatDate(item.created_at) }}
            </span>
          </div>

          <div class="item-actions">
            <select
              :value="item.status"
              @change="updateStatus(item.id, $event.target.value)"
              class="status-select"
            >
              <option value="nouveau">{{ locale === 'fr' ? 'Statut : Nouveau' : 'Status: New' }}</option>
              <option value="en_cours">{{ locale === 'fr' ? 'Statut : En cours' : 'Status: In Progress' }}</option>
              <option value="resolu">{{ locale === 'fr' ? 'Statut : Résolu' : 'Status: Resolved' }}</option>
            </select>

            <button type="button" class="btn-delete" @click="deleteFeedback(item.id)">
              {{ locale === 'fr' ? 'Supprimer' : 'Delete' }}
            </button>
          </div>
        </div>

        <h3 class="item-subject">{{ item.subject }}</h3>
        <p class="item-message">{{ item.message }}</p>

        <div class="item-footer">
          <span>
            <strong>{{ locale === 'fr' ? 'Auteur :' : 'Author:' }}</strong> {{ item.username }}
          </span>
          <a :href="`mailto:${item.email}?subject=Re:%20${encodeURIComponent(item.subject)}`" class="reply-link">
            {{ item.email }} ({{ locale === 'fr' ? 'Répondre par mail' : 'Reply by email' }})
          </a>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const API_URL = 'https://geolearn-backend-bj65.onrender.com';

const feedbacks = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');
const activeFilter = ref('all');

const filterTabs = computed(() => [
  { value: 'all', label: locale.value === 'fr' ? 'Tous' : 'All' },
  { value: 'nouveau', label: locale.value === 'fr' ? 'Nouveaux' : 'New' },
  { value: 'suggestion', label: locale.value === 'fr' ? 'Idées' : 'Ideas' },
  { value: 'bug', label: locale.value === 'fr' ? 'Bugs' : 'Bugs' },
  { value: 'resolu', label: locale.value === 'fr' ? 'Résolus' : 'Resolved' }
]);

const getAdminEmail = () => {
  const saved = localStorage.getItem('geolearn_user');
  if (!saved) return '';
  try {
    return JSON.parse(saved).email || '';
  } catch (e) {
    return '';
  }
};

const fetchFeedbacks = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const adminEmail = getAdminEmail();
    const res = await fetch(`${API_URL}/api/admin/feedbacks?email=${encodeURIComponent(adminEmail)}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Accès refusé');
    }
    feedbacks.value = data.feedbacks || [];
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const updateStatus = async (id, status) => {
  try {
    const adminEmail = getAdminEmail();
    const res = await fetch(`${API_URL}/api/admin/feedbacks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, status })
    });
    if (res.ok) {
      const target = feedbacks.value.find(f => f.id === id);
      if (target) target.status = status;
    }
  } catch (e) {
    console.error(e);
  }
};

const deleteFeedback = async (id) => {
  try {
    const adminEmail = getAdminEmail();
    const res = await fetch(`${API_URL}/api/admin/feedbacks/${id}?email=${encodeURIComponent(adminEmail)}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      feedbacks.value = feedbacks.value.filter(f => f.id !== id);
    }
  } catch (e) {
    console.error(e);
  }
};

const filteredFeedbacks = computed(() => {
  if (activeFilter.value === 'all') return feedbacks.value;
  if (activeFilter.value === 'nouveau' || activeFilter.value === 'resolu') {
    return feedbacks.value.filter(f => f.status === activeFilter.value);
  }
  return feedbacks.value.filter(f => f.type === activeFilter.value);
});

const countByStatus = (status) => feedbacks.value.filter(f => f.status === status).length;
const countByType = (type) => feedbacks.value.filter(f => f.type === type).length;

const formatType = (type) => {
  if (type === 'bug') return 'Bug';
  if (type === 'suggestion') return locale.value === 'fr' ? 'Idée' : 'Idea';
  return locale.value === 'fr' ? 'Autre' : 'Other';
};

const formatStatus = (status) => {
  if (status === 'resolu') return locale.value === 'fr' ? 'Résolu' : 'Resolved';
  if (status === 'en_cours') return locale.value === 'fr' ? 'En cours' : 'In Progress';
  return locale.value === 'fr' ? 'Nouveau' : 'New';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(fetchFeedbacks);
</script>

<style scoped>
.admin-page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 1rem 0 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.admin-tag {
  display: inline-block;
  background: rgba(245, 158, 11, 0.15);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 0.3rem 0.85rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 0.4rem;
}

.admin-header h1 {
  font-size: 2rem;
  font-weight: 900;
  color: var(--text-main);
}

.btn-refresh {
  background: var(--card-bg);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  padding: 0.7rem 1.25rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-refresh:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.admin-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.admin-stat-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.4rem 1.5rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.stat-label {
  font-size: 0.88rem;
  color: var(--text-muted);
  font-weight: 600;
}

.stat-number {
  font-size: 2rem;
  font-weight: 900;
  color: var(--text-main);
}

.text-amber { color: #d97706 !important; }
.text-blue { color: #2563eb !important; }
.text-red { color: #ef4444 !important; }

.admin-filters {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.6rem 1.15rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn.active {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}

.admin-empty,
.admin-error {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  padding: 3rem 2rem;
  text-align: center;
  color: var(--text-muted);
}

.feedback-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.feedback-item-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  padding: 1.75rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.item-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.item-badges {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.type-pill,
.status-pill {
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
}

.pill-suggestion { background: rgba(37, 99, 235, 0.12); color: #2563eb; }
.pill-bug { background: rgba(239, 68, 68, 0.12); color: #ef4444; }
.pill-autre { background: rgba(100, 116, 139, 0.15); color: #64748b; }

.status-nouveau { background: rgba(245, 158, 11, 0.15); color: #d97706; }
.status-en_cours { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
.status-resolu { background: rgba(16, 185, 129, 0.15); color: #10b981; }

.item-date {
  font-size: 0.82rem;
  color: var(--text-muted);
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.status-select {
  padding: 0.45rem 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--input-bg);
  color: var(--text-main);
  font-size: 0.85rem;
  font-weight: 600;
}

.btn-delete {
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.2);
}

.item-subject {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text-main);
}

.item-message {
  color: var(--text-muted);
  font-size: 0.96rem;
  line-height: 1.65;
  white-space: pre-line;
}

.item-footer {
  border-top: 1px solid var(--border-color);
  padding-top: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.88rem;
  color: var(--text-muted);
}

.reply-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.reply-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .admin-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>