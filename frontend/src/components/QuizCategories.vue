<script setup>
import { RouterLink } from 'vue-router'
import flagsBackground from '@/assets/images/quizflaggor.png'
import capitalsBackground from '@/assets/images/quizhuvudstader.png'
import neighboursBackground from '@/assets/images/quizgrannlander.png'
import populationBackground from '@/assets/images/population.png'
import areaBackground from '@/assets/images/area.png'
import languagesBackground from '@/assets/images/quizsprak.png'
import '@/assets/css/QuizCategories.css'

const categories = [
  {
    title: 'Flaggor',
    background: flagsBackground,
    quizPath: '/quiz/flags',
    description: 'Snabba visuella matchningar mot klockan. Världens alla nationer ingår.',
  },
  {
    title: 'Huvudstäder',
    background: capitalsBackground,
    quizPath: '/quiz/capitals',
    description: 'Navigera kontinenterna och bevisa dina kunskaper om globala centralorter.',
  },
  {
    title: 'Grannländer',
    background: neighboursBackground,
    quizPath: '/quiz/neighbours',
    description: 'Testa vilka länder som har landgräns mot varandra.',
  },
  {
    title: 'Befolkning',
    background: populationBackground,
    quizPath: '/quiz/population',
    description: 'Testa dina kunskaper om ländernas befolkning år 2025.',
  },
  {
    title: 'Yta',
    background: areaBackground,
    quizPath: '/quiz/area',
    description: 'Testa dina kunskaper om hur stora världens länder är.',
  },
  {
    title: 'Språk',
    background: languagesBackground,
    description: 'Hitta den geografiska hemvisten för globala tungomål och dialekter.',
  },
]
</script>

<template>
  <section class="quiz-section" id="quiz">
    <div class="quiz-container">
      <h2>Utmaningar för alla nivåer</h2>

      <p class="quiz-intro">Välj bland våra ämnesområden och testa dina geografikunskaper.</p>

      <div class="quiz-grid">
        <component
          :is="category.quizPath ? RouterLink : 'article'"
          v-for="category in categories"
          :key="category.title"
          :to="category.quizPath || undefined"
          class="quiz-card"
          :style="{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${category.background})`,
          }"
          :class="{ 'quiz-card-disabled': !category.quizPath }"
          :title="!category.quizPath ? 'Detta quiz är inte tillgängligt ännu' : ''"
        >
          <span class="quiz-tag">
            {{ category.title }}
          </span>

          <p>{{ category.description }}</p>

          <span v-if="category.quizPath" class="quiz-link"> Börja quiz → </span>

          <span v-else class="quiz-link quiz-link-disabled"> Kommer snart </span>
        </component>
      </div>
    </div>
  </section>
</template>
