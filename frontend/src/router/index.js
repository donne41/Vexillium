import { createRouter, createWebHistory } from 'vue-router'

import { nextTick } from 'vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import QuizGameView from "@/views/QuizGameView.vue"
import AchievementsView from '../views/AchievementsView.vue'

import Leaderboard from '../components/Leaderboard.vue'
import GameHistoryView from '../views/GameHistoryView.vue'

import ProfileView from '../views/ProfileView.vue'
import { useAuth } from '@/composables/useAuth'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  async scrollBehavior(to, from, savedPosition) {
    await nextTick()

    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return {
        el: to.hash === '#quiz-rooms' ? '#create-room' : to.hash,
        top: 110,
      }
    }

    return { top: 0 }
  },

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },

    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    
    {
      path: "/quiz/:quizType",
      name: "quiz",
      component: QuizGameView,
    },

      {
          path: '/achievements',
          name: 'achievements',
          component: AchievementsView,
      },
      {
          path: '/leaderboard',
          name: 'leaderboard',
          component: Leaderboard,
      },
      {
          path: '/games/history',
          name: 'game-history',
          component: GameHistoryView
      }

    {
        path: '/achievements',
        name: 'achievements',
        component: AchievementsView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },

  ],

})

/**
 * Inloggningsskydd som körs före varje navigering:
 * - Utloggade som går till en sida med meta.requiresAuth skickas till inloggningen,
 *   med sidan som ?redirect= så att de kommer tillbaka efteråt.
 * - Inloggade som går till inloggning eller registrering stannar där de är, eller
 *   skickas till startsidan om sidan öppnades direkt via adressfältet.
 */
router.beforeEach((to, from) => {
  const { currentUser } = useAuth()

  if (to.meta.requiresAuth && !currentUser.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if ((to.name === 'login' || to.name === 'register') && currentUser.value) {
    return from.matched.length > 0 ? false : { name: 'home' }
  }
})

export default router