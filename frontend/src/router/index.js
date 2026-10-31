import { createRouter, createWebHistory } from 'vue-router'

import { nextTick } from 'vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import QuizGameView from "@/views/QuizGameView.vue"
import AchievementsView from '../views/AchievementsView.vue'
import Leaderboard from '../components/Leaderboard.vue'

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

  ],

})

export default router