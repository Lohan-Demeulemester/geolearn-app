<template>
  <div class="max-w-4xl mx-auto space-y-8 relative">
    
    <div>
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-500 mb-2">{{ t('profil.title') }}</h2>
      <p class="text-gray-600 dark:text-gray-400 transition-colors duration-500">{{ t('profil.subtitle') }}</p>
    </div>

    <!-- VUE : UTILISATEUR CONNECTÉ -->
    <div v-if="isLoggedIn" class="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <div class="md:col-span-1 space-y-6">
        <div class="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center transition-colors duration-500">
          <div class="relative w-32 h-32 mx-auto mb-4">
            <img :src="user.avatar" alt="Avatar" class="w-full h-full rounded-full object-cover border-4 border-blue-50 dark:border-gray-700">
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ user.name }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">{{ t('profil.member_since', { date: user.joinDate }) }}</p>
          
          <button @click="logout" class="w-full py-3 rounded-xl font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
            <i class="fas fa-sign-out-alt mr-2"></i> {{ t('profil.logout') }}
          </button>
        </div>
      </div>

      <div class="md:col-span-2 space-y-6">
        <div class="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-500">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">{{ t('profil.personal_info') }}</h3>
          
          <form @submit.prevent="updateProfile" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('profil.username') }}</label>
                <input type="text" v-model="user.name" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brandBlue transition-all">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('profil.email') }}</label>
                <input type="email" v-model="user.email" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brandBlue transition-all">
              </div>
            </div>
            <div class="pt-4 flex justify-end">
              <button type="submit" class="bg-brandBlue text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition shadow-sm">
                {{ t('common.save') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- VUE : NON CONNECTÉ -->
    <div v-else class="max-w-md mx-auto">
      <div class="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-500">
        
        <!-- ÉCRAN DE VÉRIFICATION -->
        <div v-if="showVerificationForm" class="text-center">
          <div class="w-16 h-16 bg-brandBlue/10 text-brandBlue rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
            <i class="fas fa-envelope-open-text"></i>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">{{ t('profil.verify_title') }}</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6 text-sm">{{ t('profil.verify_desc') }} <br><span class="font-bold text-gray-900 dark:text-white">{{ registeredEmail }}</span></p>

          <div v-if="errorMessage" class="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
            {{ errorMessage }}
          </div>

          <form @submit.prevent="verifyCode" class="space-y-5">
            <div>
              <input type="text" v-model="verificationCode" placeholder="000000" maxlength="6" class="w-full text-center tracking-[0.5em] text-2xl py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brandBlue transition-all font-mono" required>
            </div>
            <button type="submit" class="w-full bg-brandBlue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm" :disabled="isLoading">
              {{ isLoading ? t('common.loading') : t('profil.validate_btn') }}
            </button>
          </form>

          <div class="mt-6 space-y-3">
            <button @click="resendCode" class="text-sm font-medium text-brandBlue hover:underline w-full">
              {{ t('profil.resend') }}
            </button>
            <button @click="showVerificationForm = false" class="text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 w-full">
              {{ t('profil.back_register') }}
            </button>
          </div>
        </div>

        <!-- FORMULAIRES CLASSIQUES -->
        <div v-else>
          <div class="flex p-1 mb-6 bg-gray-100 dark:bg-gray-900 rounded-xl">
            <button 
              @click="showLoginForm = true; errorMessage = ''" 
              :class="showLoginForm ? 'bg-white dark:bg-gray-800 text-brandBlue shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
              class="flex-1 py-2 text-sm font-bold rounded-lg transition-all"
            >
              {{ t('profil.login_tab') }}
            </button>
            <button 
              @click="showLoginForm = false; errorMessage = ''" 
              :class="!showLoginForm ? 'bg-white dark:bg-gray-800 text-brandBlue shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
              class="flex-1 py-2 text-sm font-bold rounded-lg transition-all"
            >
              {{ t('profil.register_tab') }}
            </button>
          </div>

          <div v-if="errorMessage" class="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium text-center">
            {{ errorMessage }}
          </div>

          <form v-if="showLoginForm" @submit.prevent="login" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('profil.email') }}</label>
              <div class="relative">
                <i class="fas fa-envelope absolute left-4 top-3.5 text-gray-400"></i>
                <input type="email" v-model="loginForm.email" placeholder="votre@email.com" class="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brandBlue transition-all" required>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('profil.password') }}</label>
              <div class="relative">
                <i class="fas fa-lock absolute left-4 top-3.5 text-gray-400"></i>
                <input type="password" v-model="loginForm.password" placeholder="••••••••" class="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brandBlue transition-all" required>
              </div>
            </div>
            <button type="submit" class="w-full bg-brandBlue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm mt-4" :disabled="isLoading">
              {{ isLoading ? t('profil.connecting') : t('profil.connect_btn') }}
            </button>
          </form>

          <form v-else @submit.prevent="register" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('profil.username') }}</label>
              <div class="relative">
                <i class="fas fa-user absolute left-4 top-3.5 text-gray-400"></i>
                <input type="text" v-model="registerForm.username" placeholder="Pseudo" class="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brandBlue transition-all" required>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('profil.email') }}</label>
              <div class="relative">
                <i class="fas fa-envelope absolute left-4 top-3.5 text-gray-400"></i>
                <input type="email" v-model="registerForm.email" placeholder="votre@email.com" class="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brandBlue transition-all" required>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('profil.password') }}</label>
              <div class="relative">
                <i class="fas fa-lock absolute left-4 top-3.5 text-gray-400"></i>
                <input type="password" v-model="registerForm.password" placeholder="••••••••" class="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brandBlue transition-all" required>
              </div>
            </div>
            <button type="submit" class="w-full bg-brandBlue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm mt-4" :disabled="isLoading">
              {{ isLoading ? t('profil.creating') : t('profil.create_btn') }}
            </button>
          </form>

          <!-- SÉPARATEUR & BOUTON GOOGLE -->
          <div class="flex items-center my-6">
            <div class="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            <span class="mx-4 text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('profil.or_continue') }}</span>
            <div class="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          </div>

          <div class="flex justify-center">
            <GoogleLogin :callback="handleGoogleLogin" prompt />
          </div>
        </div>

      </div>
    </div>

    <!-- NOTIFICATION PERSONNALISÉE (TOAST) -->
    <transition name="toast">
      <div v-if="toast.show" class="fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-xl border flex items-center gap-3 z-50 transition-colors duration-300"
           :class="toast.type === 'success' ? 'bg-white dark:bg-gray-800 border-green-200 dark:border-green-800 text-gray-900 dark:text-white' : 'bg-white dark:bg-gray-800 border-red-200 dark:border-red-800 text-gray-900 dark:text-white'">
        <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
             :class="toast.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'">
          <i :class="toast.type === 'success' ? 'fas fa-check' : 'fas fa-exclamation'"></i>
        </div>
        <div>
          <h4 class="font-bold text-sm">{{ toast.type === 'success' ? t('common.success') : t('common.error') }}</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ toast.message }}</p>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { GoogleLogin } from 'vue3-google-login';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Ton URL Render exacte
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

onMounted(() => {
  const savedUser = localStorage.getItem('geolearn_user');
  if (savedUser) {
    user.value = JSON.parse(savedUser);
    isLoggedIn.value = true;
  }
});

// --- BOUCLIER DE SÉCURITÉ POUR LES APPELS API ---
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
  
  if (!res.ok) throw new Error(data.error || t('common.error'));
  return data;
};

// --- FONCTIONS D'AUTHENTIFICATION ---
const handleGoogleLogin = async (response) => {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    const data = await apiCall('/api/google-login', { credential: response.credential });
    connectUser(data.user);
    showToast(t('common.success'), 'success');
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

const register = async () => {
  errorMessage.value = '';
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
    await apiCall('/api/verify-code', { email: registeredEmail.value, code: verificationCode.value });
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
  try {
    await apiCall(`/api/users/${user.value.id}`, { name: user.value.name, email: user.value.email }, 'PUT');
    user.value.avatar = `https://ui-avatars.com/api/?name=${user.value.name}&background=E0F2FE&color=2563EB&size=128`;
    localStorage.setItem('geolearn_user', JSON.stringify(user.value));
    window.dispatchEvent(new Event('auth-change'));
    showToast(t('common.success'), 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
};

const connectUser = (userData) => {
  user.value = {
    id: userData.id,
    name: userData.username,
    email: userData.email,
    joinDate: new Date(userData.createdAt).toLocaleDateString(locale.value === 'en' ? 'en-US' : 'fr-FR'),
    avatar: `https://ui-avatars.com/api/?name=${userData.username}&background=E0F2FE&color=2563EB&size=128`
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
.toast-enter-active, .toast-leave-active {
  transition: all 0.4s ease;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>