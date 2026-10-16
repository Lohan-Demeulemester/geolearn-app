import { createRouter, createWebHistory } from 'vue-router'
import Accueil from '../views/Accueil.vue'
import Explorer from '../views/Explorer.vue'
import Quiz from '../views/Quiz.vue'
import Scores from '../views/Scores.vue'
import Profil from '../views/Profil.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'accueil',
      component: Accueil
    },
    {
      path: '/profil',
      name: 'profil',
      component: Profil
    },
    // --- ROUTES PROTÉGÉES ---
    {
      path: '/explorer',
      name: 'explorer',
      component: Explorer,
      meta: { requiresAuth: true } // Cette ligne marque la route comme "protégée"
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: Quiz,
      meta: { requiresAuth: true }
    },
    {
      path: '/scores',
      name: 'scores',
      component: Scores,
      meta: { requiresAuth: true }
    }
  ]
})

// ==========================================
// LE GARDIEN DE SÉCURITÉ (ROUTE GUARD)
// ==========================================
router.beforeEach((to, from, next) => {
  // On regarde si la page où l'on veut aller possède le badge "requiresAuth"
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  // On vérifie si notre utilisateur est dans le localStorage
  const isAuthenticated = localStorage.getItem('geolearn_user');

  if (requiresAuth && !isAuthenticated) {
    // Si la page est protégée et qu'il n'est pas connecté -> Retour au Profil !
    next('/profil');
  } else {
    // Sinon, la voie est libre, on le laisse passer
    next();
  }
});

export default router