<template>
  <div class="feedback-page fade-in-up">
    <transition name="fade">
      <div v-if="toast.show" :class="['toast-notification', toast.type]">
        {{ toast.message }}
      </div>
    </transition>

    <header class="feedback-header">
      <span class="feedback-badge">
        {{ locale === 'fr' ? 'Amélioration continue' : 'Continuous Improvement' }}
      </span>
      <h1>
        {{ locale === 'fr' ? 'Suggérer une idée ou signaler un bug' : 'Suggest an Idea or Report a Bug' }}
      </h1>
      <p>
        {{ locale === 'fr'
          ? 'Vos retours sont transmis directement au panneau administrateur de GeoLearn pour faire évoluer la plateforme.'
          : 'Your feedback is sent directly to the GeoLearn admin dashboard to help improve the platform.' }}
      </p>
    </header>

    <div class="feedback-layout">
      <!-- FORMULAIRE PRINCIPAL -->
      <div class="feedback-card">
        <div v-if="submitted" class="success-state">
          <div class="success-check">OK</div>
          <h2>{{ locale === 'fr' ? 'Merci pour votre retour !' : 'Thank you for your feedback!' }}</h2>
          <p>
            {{ locale === 'fr'
              ? 'Votre message a bien été enregistré dans notre base de données et sera examiné rapidement.'
              : 'Your message has been saved to our database and will be reviewed shortly.' }}
          </p>
          <button type="button" class="btn-primary" @click="resetForm">
            {{ locale === 'fr' ? 'Envoyer un autre message' : 'Send another message' }}
          </button>
        </div>

        <form v-else @submit.prevent="submitFeedback" class="feedback-form">
          <!-- Choix du type de retour -->
          <div class="form-group">
            <label>{{ locale === 'fr' ? 'Nature de votre message' : 'Message Category' }}</label>
            <div class="type-selector">
              <button
                type="button"
                :class="['type-btn', { active: form.type === 'suggestion' }]"
                @click="form.type = 'suggestion'"
              >
                <span class="type-dot dot-blue"></span>
                {{ locale === 'fr' ? 'Idée / Suggestion' : 'Idea / Suggestion' }}
              </button>

              <button
                type="button"
                :class="['type-btn', { active: form.type === 'bug' }]"
                @click="form.type = 'bug'"
              >
                <span class="type-dot dot-red"></span>
                {{ locale === 'fr' ? 'Signaler un bug' : 'Report a Bug' }}
              </button>

              <button
                type="button"
                :class="['type-btn', { active: form.type === 'autre' }]"
                @click="form.type = 'autre'"
              >
                <span class="type-dot dot-gray"></span>
                {{ locale === 'fr' ? 'Autre question' : 'Other Inquiry' }}
              </button>
            </div>
          </div>

          <!-- Nom & Email -->
          <div class="form-row">
            <div class="form-group">
              <label>{{ locale === 'fr' ? 'Nom ou Pseudo' : 'Name or Username' }}</label>
              <input
                type="text"
                v-model="form.username"
                :placeholder="locale === 'fr' ? 'Votre pseudo' : 'Your username'"
                maxlength="50"
                required
              />
            </div>

            <div class="form-group">
              <label>{{ locale === 'fr' ? 'Adresse e-mail (pour vous répondre)' : 'Email address (for reply)' }}</label>
              <input
                type="email"
                v-model="form.email"
                placeholder="votre@email.com"
                maxlength="100"
                required
              />
            </div>
          </div>

          <!-- Sujet -->
          <div class="form-group">
            <label>{{ locale === 'fr' ? 'Titre ou résumé court' : 'Short Title or Summary' }}</label>
            <input
              type="text"
              v-model="form.subject"
              :placeholder="locale === 'fr' ? 'Ex : Ajouter un mode sur les fleuves, problème d\'affichage...' : 'E.g., Add a rivers quiz mode, display issue...'"
              minlength="4"
              maxlength="120"
              required
            />
          </div>

          <!-- Description détaillée -->
          <div class="form-group">
            <label>{{ locale === 'fr' ? 'Description détaillée' : 'Detailed Description' }}</label>
            <textarea
              v-model="form.message"
              rows="5"
              :placeholder="locale === 'fr' ? 'Décrivez votre idée ou les étapes pour reproduire le bug...' : 'Describe your idea or the steps to reproduce the bug...'"
              minlength="10"
              maxlength="1500"
              required
            ></textarea>
            <small class="char-count">{{ form.message.length }} / 1500</small>
          </div>

          <button type="submit" class="btn-primary" :disabled="isLoading">
            {{ isLoading
              ? (locale === 'fr' ? 'Envoi en cours...' : 'Sending...')
              : (locale === 'fr' ? 'Envoyer mon retour' : 'Submit Feedback') }}
          </button>
        </form>
      </div>

      <!-- COLONNE D'INFORMATION LATÉRALE -->
      <aside class="feedback-sidebar">
        <div class="info-box">
          <h3>{{ locale === 'fr' ? 'Pourquoi contribuer ?' : 'Why contribute?' }}</h3>
          <p>
            {{ locale === 'fr'
              ? 'GeoLearn est développé de manière indépendante. Chaque suggestion pertinente est étudiée pour être intégrée dans les prochaines mises à jour.'
              : 'GeoLearn is independently developed. Every relevant suggestion is reviewed for integration into upcoming updates.' }}
          </p>
        </div>

        <div class="info-box">
          <h3>{{ locale === 'fr' ? 'Contact direct par e-mail' : 'Direct Email Contact' }}</h3>
          <p>
            {{ locale === 'fr'
              ? 'Vous préférez nous écrire directement depuis votre messagerie ?'
              : 'Prefer writing to us directly from your email client?' }}
          </p>
          <a href="mailto:geolearn-webapp@gmail.com" class="sidebar-mail">
            geolearn-webapp@gmail.com
          </a>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const API_URL = 'https://geolearn-backend-bj65.onrender.com';

const isLoading = ref(false);
const submitted = ref(false);
const currentUser = ref(null);

const form = ref({
  type: 'suggestion',
  username: '',
  email: '',
  subject: '',
  message: ''
});

const toast = ref({ show: false, message: '', type: 'success' });
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => { toast.value.show = false; }, 3500);
};

onMounted(() => {
  const savedUser = localStorage.getItem('geolearn_user');
  if (savedUser) {
    try {
      currentUser.value = JSON.parse(savedUser);
      form.value.username = currentUser.value.name || '';
      form.value.email = currentUser.value.email || '';
    } catch (e) {
      currentUser.value = null;
    }
  }
});

const submitFeedback = async () => {
  isLoading.value = true;
  try {
    const res = await fetch(`${API_URL}/api/feedbacks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser.value ? currentUser.value.id : null,
        username: form.value.username.trim(),
        email: form.value.email.trim(),
        type: form.value.type,
        subject: form.value.subject.trim(),
        message: form.value.message.trim()
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Erreur lors de l\'envoi');
    }

    submitted.value = true;
    showToast(locale.value === 'fr' ? 'Retour envoyé avec succès !' : 'Feedback sent successfully!', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  form.value.subject = '';
  form.value.message = '';
  submitted.value = false;
};
</script>

<style scoped>
.feedback-page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 1rem 0 3rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.feedback-header {
  text-align: center;
  max-width: 680px;
  margin: 0 auto;
}

.feedback-badge {
  display: inline-block;
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
  border: 1px solid rgba(37, 99, 235, 0.25);
  padding: 0.4rem 1rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 1rem;
}

.feedback-header h1 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 900;
  color: var(--text-main);
  margin-bottom: 0.6rem;
}

.feedback-header p {
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.6;
}

.feedback-layout {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 2rem;
  align-items: start;
}

.feedback-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 22px;
  padding: 2.5rem;
  box-shadow: var(--shadow-sm);
}

.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text-main);
}

.type-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.type-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 0.9rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--input-bg);
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-btn.active {
  border-color: #2563eb;
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
}

.type-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.dot-blue { background: #2563eb; }
.dot-red { background: #ef4444; }
.dot-gray { background: #64748b; }

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--input-bg);
  color: var(--text-main);
  font-size: 0.95rem;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.char-count {
  align-self: flex-end;
  font-size: 0.78rem;
  color: var(--text-muted);
}

.btn-primary {
  padding: 0.95rem 1.5rem;
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.success-state {
  text-align: center;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.success-check {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.success-state h2 {
  color: var(--text-main);
  font-size: 1.6rem;
}

.success-state p {
  color: var(--text-muted);
  max-width: 440px;
  margin-bottom: 0.75rem;
}

.feedback-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.info-box {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  padding: 1.75rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.info-box h3 {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-main);
}

.info-box p {
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.sidebar-mail {
  margin-top: 0.4rem;
  display: inline-block;
  color: #2563eb;
  font-weight: 700;
  font-size: 0.92rem;
  text-decoration: none;
}

.sidebar-mail:hover {
  text-decoration: underline;
}

.toast-notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  color: #ffffff;
  font-weight: 600;
  z-index: 9999;
}
.toast-notification.success { background: #10b981; }
.toast-notification.error { background: #ef4444; }

@media (max-width: 860px) {
  .feedback-layout,
  .form-row,
  .type-selector {
    grid-template-columns: 1fr;
  }
  .feedback-card {
    padding: 1.5rem 1.25rem;
  }
}
</style>