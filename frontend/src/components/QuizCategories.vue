<script setup>
import {RouterLink} from 'vue-router'
import './QuizCategories.css'

const categories = [
  {
    title: 'Flaggor',
    quizPath: '/quiz/flags',
    description: 'Snabba visuella matchningar mot klockan. Världens alla nationer ingår.'
  },
  {
    title: 'Huvudstäder',
    quizPath: '/quiz/capitals',
    description: 'Navigera kontinenterna och bevisa dina kunskaper om globala centralorter.'
  },
  {
    title: 'Grannländer',
    description: 'Gränsanalys och geopolitiska relationer i ett unikt pusselformat.'
  },
  {
    title: 'Befolkning & yta',
    description: 'Sortera, väg och värdera länders storlek och demografiska densitet.'
  },
  {
    title: 'Valutor',
    description: 'Ekonomisk geografi. Koppla ihop rätt valutaenhet med motsvarande rike.'
  },
  {
    title: 'Språk',
    description: 'Hitta den geografiska hemvisten för globala tungomål och dialekter.'
  }
]
</script>

<template>
  <section class="quiz-section" id="quiz">
    <div class="quiz-container">

      <h2>Utmaningar för alla nivåer</h2>

      <p class="quiz-intro">
        Välj bland våra ämnesområden och testa dina geografikunskaper.
      </p>

      <div class="quiz-grid">

        <component
            :is="category.quizPath ? RouterLink : 'article'"
            v-for="category in categories"
            :key="category.title"
            :to="category.quizPath || undefined"
            class="quiz-card"
            :class="{ 'quiz-card-disabled': !category.quizPath }"
            :title="!category.quizPath
        ? 'Detta quiz är inte tillgängligt ännu'
        : ''"
        >
  <span class="quiz-tag">
    {{ category.title }}
  </span>

          <p>{{ category.description }}</p>

          <span v-if="category.quizPath" class="quiz-link">
    Börja quiz →
  </span>

          <span v-else class="quiz-link quiz-link-disabled">
    Kommer snart
  </span>
        </component>

      </div>

    </div>
  </section>
</template>
