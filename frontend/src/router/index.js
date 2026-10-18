import { createRouter, createWebHistory } from 'vue-router'
import Accueil from '../views/Accueil.vue'
import Explorer from '../views/Explorer.vue'
import Quiz from '../views/Quiz.vue'
import Scores from '../views/Scores.vue'
import Profil from '../views/Profil.vue'
import Confidentialite from '../views/Confidentialite.vue'
import APropos from '../views/APropos.vue'
import Feedback from '../views/Feedback.vue'
import Admin from '../views/Admin.vue'

const ADMIN_EMAILS = [
  'lohan.dtr@gmail.com',
  'lohan.dtr.muscu@gmail.com',
  'lohan.demeulemester@efrei.net'
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // --- ROUTES PUBLIQUES ---
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
    {
      path: '/confidentialite',
      name: 'confidentialite',
      component: Confidentialite
    },
    {
      path: '/a-propos',
      name: 'a-propos',
      component: APropos
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: Feedback
    },

    // --- ROUTES PROTÉGÉES ---
    {
      path: '/explorer',
      name: 'explorer',
      component: Explorer,
      meta: { requiresAuth: true }
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
    },

    // --- ROUTE ADMINISTRATEUR ---
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  }
})

// ==========================================
// LE GARDIEN DE SÉCURITÉ (ROUTE GUARD)
// ==========================================
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const savedUser = localStorage.getItem('geolearn_user')

  let currentUser = null
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser)
    } catch (e) {
      currentUser = null
    }
  }

  if (requiresAuth && !currentUser) {
    next('/profil')
  } else if (requiresAdmin) {
    const email = (currentUser?.email || '').toLowerCase()
    if (!ADMIN_EMAILS.includes(email)) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router