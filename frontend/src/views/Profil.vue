<template>
  <div class="profil-container">
    <!-- NOTIFICATION TOAST -->
    <transition name="fade">
      <div v-if="toast.show" :class="['toast-notification', toast.type]">
        {{ toast.message }}
      </div>
    </transition>

    <!-- EN-TÊTE DE LA PAGE -->
    <div class="profil-header">
      <h1>{{ t('profil.title') }}</h1>
      <p>{{ t('profil.subtitle') }}</p>
    </div>

    <!-- ========================================== -->
    <!-- CAS 1 : UTILISATEUR NON CONNECTÉ           -->
    <!-- ========================================== -->
    <div v-if="!isLoggedIn" class="auth-wrapper">
      <div class="auth-card">
        
        <!-- A. ÉCRAN DE VÉRIFICATION DU CODE PAR EMAIL -->
        <div v-if="showVerificationForm" class="verification-box">
          <div class="verify-icon">📩</div>
          <h2>{{ t('profil.verify_title') }}</h2>
          <p class="verify-text">
            {{ t('profil.verify_subtitle') }}<br />
            <strong>{{ registeredEmail }}</strong>
          </p>

          <div v-if="errorMessage" class="error-banner">
            {{ errorMessage }}
          </div>

          <form @submit.prevent="verifyCode" class="auth-form">
            <div class="form-group">
              <label>{{ t('profil.verify_code_label') }}</label>
              <input
                type="text"
                v-model="verificationCode"
                placeholder="123456"
                maxlength="6"
                class="code-input"
                required
              />
            </div>

            <button type="submit" class="btn-primary" :disabled="isLoading">
              {{ isLoading ? t('profil.verifying') : t('profil.verify_btn') }}
            </button>
          </form>

          <div class="verify-actions">
            <button @click="resendCode" class="btn-link" type="button">
              {{ t('profil.resend_code') }}
            </button>
            <button @click="showVerificationForm = false" class="btn-link secondary" type="button">
              ← {{ t('common.back') }}
            </button>
          </div>
        </div>

        <!-- B. ÉCRAN CONNEXION / INSCRIPTION -->
        <div v-else>
          <!-- Onglets Login / Register -->
          <div class="auth-tabs">
            <button
              type="button"
              :class="['tab-btn', { active: showLoginForm }]"
              @click="switchTab(true)"
            >
              {{ t('profil.login_tab') }}
            </button>
            <button
              type="button"
              :class="['tab-btn', { active: !showLoginForm }]"
              @click="switchTab(false)"
            >
              {{ t('profil.register_tab') }}
            </button>
          </div>

          <!-- Bannière d'erreur -->
          <div v-if="errorMessage" class="error-banner">
            {{ errorMessage }}
          </div>

          <!-- FORMULAIRE DE CONNEXION -->
          <form v-if="showLoginForm" @submit.prevent="login" class="auth-form">
            <div class="form-group">
              <label>{{ t('profil.email') }}</label>
              <div class="input-wrapper">
                <span class="input-icon">✉️</span>
                <input
                  type="email"
                  v-model="loginForm.email"
                  :placeholder="t('profil.email_placeholder')"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label>{{ t('profil.password') }}</label>
              <div class="input-wrapper">
                <span class="input-icon">🔒</span>
                <input
                  type="password"
                  v-model="loginForm.password"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" class="btn-primary" :disabled="isLoading">
              {{ isLoading ? t('profil.logging_in') : t('profil.login_btn') }}
            </button>
          </form>

          <!-- FORMULAIRE D'INSCRIPTION -->
          <form v-else @submit.prevent="register" class="auth-form">
            <div class="form-group">
              <label>{{ t('profil.username') }}</label>
              <div class="input-wrapper">
                <span class="input-icon">👤</span>
                <input
                  type="text"
                  v-model="registerForm.username"
                  :placeholder="t('profil.username_placeholder')"
                  minlength="3"
                  maxlength="25"
                  required
                />
              </div>
              <small class="input-hint">3 à 25 caractères (lettres, chiffres, espace, -, _, .)</small>
            </div>

            <div class="form-group">
              <label>{{ t('profil.email') }}</label>
              <div class="input-wrapper">
                <span class="input-icon">✉️</span>
                <input
                  type="email"
                  v-model="registerForm.email"
                  :placeholder="t('profil.email_placeholder')"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label>{{ t('profil.password') }}</label>
              <div class="input-wrapper">
                <span class="input-icon">🔒</span>
                <input
                  type="password"
                  v-model="registerForm.password"
                  placeholder="••••••••"
                  minlength="6"
                  maxlength="30"
                  required
                />
              </div>
              <small class="input-hint">6 à 30 caractères, au moins 1 majuscule et 1 chiffre</small>
            </div>

            <button type="submit" class="btn-primary" :disabled="isLoading">
              {{ isLoading ? t('profil.creating') : t('profil.register_btn') }}
            </button>
          </form>

          <!-- SÉPARATEUR GOOGLE -->
          <div class="divider">
            <span>{{ t('profil.or_continue') }}</span>
          </div>

          <div class="google-btn-container">
            <GoogleLogin :callback="handleGoogleLogin" />
          </div>
        </div>

      </div>
    </div>

    <!-- ========================================== -->
    <!-- CAS 2 : UTILISATEUR CONNECTÉ               -->
    <!-- ========================================== -->
    <div v-else class="profile-connected">
      <div class="profile-card">
        <div class="profile-top">
          <img :src="user.avatar" alt="Avatar" class="profile-avatar" />
          <div class="profile-meta">
            <h2>{{ user.name }}</h2>
            <p class="profile-email">{{ user.email }}</p>
            <span class="member-badge">
              📅 {{ t('profil.member_since') }} {{ user.joinDate }}
            </span>
          </div>
        </div>

        <hr class="profile-divider" />

        <form @submit.prevent="updateProfile" class="profile-edit-form">
          <h3>{{ t('profil.edit_info') }}</h3>

          <div class="form-group">
            <label>{{ t('profil.username') }}</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input
                type="text"
                v-model="user.name"
                minlength="3"
                maxlength="25"
                required
              />
            </div>
            <small class="input-hint">3 à 25 caractères (lettres, chiffres, espace, -, _, .)</small>
          </div>

          <div class="form-group">
            <label>{{ t('profil.email') }}</label>
            <div class="input-wrapper">
              <span class="input-icon">✉️</span>
              <input
                type="email"
                v-model="user.email"
                required
              />
            </div>
          </div>

          <div class="profile-actions">
            <button type="submit" class="btn-save">
              💾 {{ t('profil.save_changes') }}
            </button>
            <button type="button" @click="logout" class="btn-logout">
              🚪 {{ t('profil.logout') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { GoogleLogin } from 'vue3-google-login';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// URL du Backend Render
const API_URL = 'https://geolearn-backend-bj65.onrender.com';

const isLoggedIn = ref(false);
const showLoginForm = ref(true);
const errorMessage = ref('');
const isLoading = ref(false);

const showVerificationForm = ref(false);
const verificationCode = ref('');
const registeredEmail = ref('');

const user = ref({ id: null, name: '', email: '', joinDate: '', avatar: '' });
const loginForm = ref({ email: '', password: '' });
const registerForm = ref({ username: '', email: '', password: '' });

const toast = ref({ show: false, message: '', type: 'success' });
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => { toast.value.show = false; }, 3500);
};

const switchTab = (isLogin) => {
  showLoginForm.value = isLogin;
  errorMessage.value = '';
};

onMounted(() => {
  const savedUser = localStorage.getItem('geolearn_user');
  if (savedUser) {
    try {
      user.value = JSON.parse(savedUser);
      isLoggedIn.value = true;
    } catch (e) {
      localStorage.removeItem('geolearn_user');
    }
  }
});

// --- VALIDATION STRICTE PSEUDO & MOT DE PASSE ---
const checkCredentials = (username, password = null) => {
  const cleanUsername = (username || '').trim();
  
  if (cleanUsername.length < 3 || cleanUsername.length > 25) {
    return "L'identifiant doit contenir entre 3 et 25 caractères.";
  }
  if (/ {2,}/.test(cleanUsername)) {
    return "L'identifiant ne peut pas contenir plusieurs espaces à la suite.";
  }
  if (!/^[a-zA-Z0-9À-ÿ_.\- ]+\$/.test(cleanUsername)) {
    return "Caractères autorisés pour l'identifiant : lettres, chiffres, espace, -, _ et .";
  }

  if (password !== null) {
    if (password.length < 6 || password.length > 30) {
      return "Le mot de passe doit contenir entre 6 et 30 caractères.";
    }
    if (!/[A-Z]/.test(password) || !/\d/.test(password)) {
      return "Le mot de passe doit contenir au moins une majuscule et un chiffre.";
    }
  }
  return null;
};

// --- APPEL API SÉCURISÉ ---
const apiCall = async (endpoint, payload, method = 'POST') => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error("Erreur de communication avec le serveur.");
    }
  }

  if (!res.ok) {
    throw new Error(data.error || "Une erreur est survenue.");
  }
  return data;
};

// --- AUTHENTIFICATION GOOGLE ---
const handleGoogleLogin = async (response) => {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    const data = await apiCall('/api/google-login', { credential: response.credential });
    connectUser(data.user);
    showToast("Connexion Google réussie !", 'success');
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

// --- INSCRIPTION CLASSIQUE ---
const register = async () => {
  errorMessage.value = '';
  registerForm.value.username = registerForm.value.username.trim();

  const validationError = checkCredentials(registerForm.value.username, registerForm.value.password);
  if (validationError) {
    errorMessage.value = validationError;
    return;
  }

  isLoading.value = true;
  try {
    await apiCall('/api/register', registerForm.value);
    registeredEmail.value = registerForm.value.email;
    showVerificationForm.value = true;
    showToast("Code de vérification envoyé par e-mail !", 'success');
    registerForm.value.password = '';
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

// --- VÉRIFICATION DU CODE EMAIL ---
const verifyCode = async () => {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    await apiCall('/api/verify-code', {
      email: registeredEmail.value,
      code: verificationCode.value.trim()
    });
    showToast("Compte vérifié ! Tu peux maintenant te connecter.", 'success');
    showVerificationForm.value = false;
    showLoginForm.value = true;
    loginForm.value.email = registeredEmail.value;
    verificationCode.value = '';
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

// --- RENVOYER LE CODE ---
const resendCode = async () => {
  errorMessage.value = '';
  try {
    await apiCall('/api/resend-code', { email: registeredEmail.value });
    showToast("Un nouveau code a été envoyé !", 'success');
  } catch (error) {
    errorMessage.value = error.message;
  }
};

// --- CONNEXION CLASSIQUE ---
const login = async () => {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    const data = await apiCall('/api/login', loginForm.value);
    connectUser(data.user);
    showToast("Ravi de te revoir !", 'success');
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

// --- MISE À JOUR DU PROFIL ---
const updateProfile = async () => {
  user.value.name = user.value.name.trim();
  const validationError = checkCredentials(user.value.name);
  if (validationError) {
    showToast(validationError, 'error');
    return;
  }

  try {
    await apiCall(`/api/users/${user.value.id}`, {
      name: user.value.name,
      email: user.value.email
    }, 'PUT');

    user.value.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.value.name)}&background=E0F2FE&color=2563EB&size=128`;
    localStorage.setItem('geolearn_user', JSON.stringify(user.value));
    window.dispatchEvent(new Event('auth-change'));
    showToast("Profil mis à jour avec succès !", 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
};

// --- CONNEXION EN MÉMOIRE LOCALE ---
const connectUser = (userData) => {
  let formattedDate = new Date().toLocaleDateString('fr-FR');
  if (userData.createdAt) {
    const parsedDate = new Date(userData.createdAt);
    if (!isNaN(parsedDate)) {
      formattedDate = parsedDate.toLocaleDateString('fr-FR');
    }
  }

  user.value = {
    id: userData.id,
    name: userData.username,
    email: userData.email,
    joinDate: formattedDate,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.username)}&background=E0F2FE&color=2563EB&size=128`
  };
  isLoggedIn.value = true;
  localStorage.setItem('geolearn_user', JSON.stringify(user.value));
  window.dispatchEvent(new Event('auth-change'));
};

// --- DÉCONNEXION ---
const logout = () => {
  isLoggedIn.value = false;
  loginForm.value = { email: '', password: '' };
  user.value = { id: null, name: '', email: '', joinDate: '', avatar: '' };
  localStorage.removeItem('geolearn_user');
  window.dispatchEvent(new Event('auth-change'));
};
</script>

<style scoped>
.profil-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.profil-header {
  margin-bottom: 2rem;
}

.profil-header h1 {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.3rem;
}

.profil-header p {
  color: #64748b;
  font-size: 1rem;
}

/* CARTE AUTHENTIFICATION */
.auth-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.auth-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 2.2rem;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
  border: 1px solid #f1f5f9;
}

/* ONGLETS */
.auth-tabs {
  display: flex;
  background: #f1f5f9;
  padding: 0.35rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.tab-btn {
  flex: 1;
  padding: 0.65rem;
  border: none;
  background: transparent;
  border-radius: 9px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: #ffffff;
  color: #2563eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* BANNIÈRE ERREUR */
.error-banner {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.25rem;
}

/* FORMULAIRE */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.88rem;
  font-weight: 600;
  color: #334155;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  font-size: 1rem;
  opacity: 0.65;
}

.input-wrapper input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.7rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  background: #f8fafc;
  color: #0f172a;
  transition: all 0.2s;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #2563eb;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.input-hint {
  font-size: 0.76rem;
  color: #64748b;
  margin-top: 0.1rem;
}

.btn-primary {
  margin-top: 0.5rem;
  padding: 0.9rem;
  background: #1d4ed8;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #1e40af;
}

.btn-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* SÉPARATEUR & GOOGLE */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0 1.2rem;
  color: #94a3b8;
  font-size: 0.85rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e2e8f0;
}

.divider span {
  padding: 0 0.75rem;
}

.google-btn-container {
  display: flex;
  justify-content: center;
}

/* VÉRIFICATION EMAIL */
.verification-box {
  text-align: center;
}

.verify-icon {
  font-size: 2.8rem;
  margin-bottom: 0.5rem;
}

.verify-text {
  color: #64748b;
  font-size: 0.92rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.code-input {
  width: 100%;
  padding: 0.85rem;
  font-size: 1.5rem;
  letter-spacing: 8px;
  text-align: center;
  font-weight: 700;
  border: 2px solid #cbd5e1;
  border-radius: 10px;
}

.verify-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.2rem;
}

.btn-link {
  background: none;
  border: none;
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-link.secondary {
  color: #64748b;
}

/* PROFIL CONNECTÉ */
.profile-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 2.2rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
  border: 1px solid #f1f5f9;
}

.profile-top {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #dbeafe;
}

.profile-meta h2 {
  font-size: 1.5rem;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
}

.profile-email {
  color: #64748b;
  margin: 0 0 0.6rem 0;
}

.member-badge {
  display: inline-block;
  background: #eff6ff;
  color: #2563eb;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
}

.profile-divider {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 1.8rem 0;
}

.profile-edit-form h3 {
  margin-bottom: 1.2rem;
  color: #0f172a;
}

.profile-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-save {
  flex: 1;
  padding: 0.85rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.btn-logout {
  padding: 0.85rem 1.4rem;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

/* TOAST */
.toast-notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  z-index: 9999;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.toast-notification.success {
  background: #10b981;
}

.toast-notification.error {
  background: #ef4444;
}
</style>