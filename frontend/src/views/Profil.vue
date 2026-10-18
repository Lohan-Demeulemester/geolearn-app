<template>
  <div class="profil-container">
    <transition name="fade">
      <div v-if="toast.show" :class="['toast-notification', toast.type]">
        {{ toast.message }}
      </div>
    </transition>

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
          <h2>{{ t('profil.verify_title') }}</h2>
          <p class="verify-text">
            {{ t('profil.verify_desc') }}<br />
            <strong>{{ registeredEmail }}</strong>
          </p>

          <div v-if="errorMessage" class="error-banner">
            {{ errorMessage }}
          </div>

          <form @submit.prevent="verifyCode" class="auth-form">
            <div class="form-group">
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
              {{ isLoading ? t('common.loading') : t('profil.validate_btn') }}
            </button>
          </form>

          <div class="verify-actions">
            <button @click="resendCode" class="btn-link" type="button">
              {{ t('profil.resend') }}
            </button>
            <button @click="showVerificationForm = false" class="btn-link secondary" type="button">
              {{ t('profil.back_register') }}
            </button>
          </div>
        </div>

        <!-- B. ÉCRAN CONNEXION / INSCRIPTION -->
        <div v-else>
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

          <div v-if="errorMessage" class="error-banner">
            {{ errorMessage }}
          </div>

          <!-- FORMULAIRE DE CONNEXION -->
          <form v-if="showLoginForm" @submit.prevent="login" class="auth-form">
            <div class="form-group">
              <label>{{ t('profil.email') }}</label>
              <div class="input-wrapper">
                <input
                  type="email"
                  v-model="loginForm.email"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label>{{ t('profil.password') }}</label>
              <div class="input-wrapper">
                <input
                  type="password"
                  v-model="loginForm.password"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" class="btn-primary" :disabled="isLoading">
              {{ isLoading ? t('profil.connecting') : t('profil.connect_btn') }}
            </button>
          </form>

          <!-- FORMULAIRE D'INSCRIPTION -->
          <form v-else @submit.prevent="register" class="auth-form">
            <div class="form-group">
              <label>{{ t('profil.username') }}</label>
              <div class="input-wrapper">
                <input
                  type="text"
                  v-model="registerForm.username"
                  :placeholder="t('profil.username')"
                  minlength="3"
                  maxlength="25"
                  required
                />
              </div>
              <small class="input-hint">
                {{ locale === 'fr' ? '3 à 25 caractères (lettres, chiffres, espace, -, _, .)' : '3 to 25 characters (letters, numbers, space, -, _, .)' }}
              </small>
            </div>

            <div class="form-group">
              <label>{{ t('profil.email') }}</label>
              <div class="input-wrapper">
                <input
                  type="email"
                  v-model="registerForm.email"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label>{{ t('profil.password') }}</label>
              <div class="input-wrapper">
                <input
                  type="password"
                  v-model="registerForm.password"
                  placeholder="••••••••"
                  minlength="6"
                  maxlength="30"
                  required
                />
              </div>
              <small class="input-hint">
                {{ locale === 'fr' ? '6 à 30 caractères, au moins 1 majuscule et 1 chiffre' : '6 to 30 characters, at least 1 uppercase letter and 1 number' }}
              </small>
            </div>

            <button type="submit" class="btn-primary" :disabled="isLoading">
              {{ isLoading ? t('profil.creating') : t('profil.create_btn') }}
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
              {{ t('profil.member_since', { date: user.joinDate }) }}
            </span>
          </div>
        </div>

        <hr class="profile-divider" />

        <form @submit.prevent="updateProfile" class="profile-edit-form">
          <h3>{{ t('profil.personal_info') }}</h3>

          <div class="form-group">
            <label>{{ t('profil.username') }}</label>
            <div class="input-wrapper">
              <input
                type="text"
                v-model="user.name"
                minlength="3"
                maxlength="25"
                required
              />
            </div>
            <small class="input-hint">
              {{ locale === 'fr' ? '3 à 25 caractères (lettres, chiffres, espace, -, _, .)' : '3 to 25 characters (letters, numbers, space, -, _, .)' }}
            </small>
          </div>

          <div class="form-group">
            <label>{{ t('profil.email') }}</label>
            <div class="input-wrapper">
              <input
                type="email"
                v-model="user.email"
                required
              />
            </div>
          </div>

          <div class="profile-actions">
            <button type="submit" class="btn-save">
              {{ t('common.save') }}
            </button>
            <button type="button" @click="logout" class="btn-logout">
              {{ t('profil.logout') }}
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

const { t, locale } = useI18n();

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
      throw new Error(t('common.error'));
    }
  }

  if (!res.ok) {
    throw new Error(data.error || t('common.error'));
  }
  return data;
};

const handleGoogleLogin = async (response) => {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    const data = await apiCall('/api/google-login', { credential: response.credential });
    connectUser(data.user);
    showToast(t('profil.welcome_back'), 'success');
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

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
    showToast(t('profil.code_sent'), 'success');
    registerForm.value.password = '';
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

const verifyCode = async () => {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    await apiCall('/api/verify-code', {
      email: registeredEmail.value,
      code: verificationCode.value.trim()
    });
    showToast(t('common.success'), 'success');
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

const resendCode = async () => {
  errorMessage.value = '';
  try {
    await apiCall('/api/resend-code', { email: registeredEmail.value });
    showToast(t('profil.new_code_sent'), 'success');
  } catch (error) {
    errorMessage.value = error.message;
  }
};

const login = async () => {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    const data = await apiCall('/api/login', loginForm.value);
    connectUser(data.user);
    showToast(t('profil.welcome_back'), 'success');
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

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
    showToast(t('common.success'), 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
};

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
  max-width: 820px;
  margin: 0 auto;
}

.profil-header {
  margin-bottom: 2.2rem;
}

.profil-header h1 {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 0.35rem;
}

.profil-header p {
  color: var(--text-muted);
  font-size: 1.05rem;
}

.auth-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.auth-card {
  background: var(--card-bg);
  border-radius: 22px;
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
}

.auth-tabs {
  display: flex;
  background: var(--input-bg);
  padding: 0.35rem;
  border-radius: 12px;
  margin-bottom: 1.6rem;
  border: 1px solid var(--border-color);
}

.tab-btn {
  flex: 1;
  padding: 0.65rem;
  border: none;
  background: transparent;
  border-radius: 9px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: var(--card-bg);
  color: #2563eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.error-banner {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 0.85rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.25rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-main);
}

.input-wrapper input {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.95rem;
  background: var(--input-bg);
  color: var(--text-main);
  transition: all 0.2s;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.input-hint {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-top: 0.1rem;
}

.btn-primary {
  margin-top: 0.5rem;
  padding: 0.9rem;
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

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.6rem 0 1.25rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--border-color);
}

.divider span {
  padding: 0 0.75rem;
}

.google-btn-container {
  display: flex;
  justify-content: center;
}

.verification-box {
  text-align: center;
}

.verification-box h2 {
  margin-bottom: 0.6rem;
  color: var(--text-main);
}

.verify-text {
  color: var(--text-muted);
  font-size: 0.94rem;
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
  border: 2px solid var(--border-color);
  background: var(--input-bg);
  color: var(--text-main);
  border-radius: 10px;
}

.verify-actions {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  margin-top: 1.25rem;
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
  color: var(--text-muted);
}

.profile-card {
  background: var(--card-bg);
  border-radius: 22px;
  padding: 2.5rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
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
  border: 3px solid rgba(37, 99, 235, 0.25);
}

.profile-meta h2 {
  font-size: 1.55rem;
  color: var(--text-main);
  margin: 0 0 0.25rem 0;
}

.profile-email {
  color: var(--text-muted);
  margin: 0 0 0.65rem 0;
}

.member-badge {
  display: inline-block;
  background: rgba(37, 99, 235, 0.12);
  color: #3b82f6;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
}

.profile-divider {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 1.8rem 0;
}

.profile-edit-form h3 {
  margin-bottom: 1.2rem;
  color: var(--text-main);
  font-size: 1.2rem;
}

.profile-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.8rem;
}

.btn-save {
  flex: 1;
  padding: 0.9rem;
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-save:hover {
  background: #1d4ed8;
}

.btn-logout {
  padding: 0.9rem 1.5rem;
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-logout:hover {
  background: rgba(239, 68, 68, 0.22);
}

.toast-notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  z-index: 9999;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.toast-notification.success {
  background: #10b981;
}

.toast-notification.error {
  background: #ef4444;
}
</style>