import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "../views/HomeView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/quiz/flags",
      name: "quiz-flags",
      component: () => import("../views/QuizGame.vue"),
    }
  ],

})

export default router
