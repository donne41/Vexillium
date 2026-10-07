
<script setup>
import './QuizCategories.css'

const categories = [
  {
    title: 'Flaggor',
    description: 'Snabba visuella matchningar mot klockan. Världens alla nationer ingår.'
  },
  {
    title: 'Huvudstäder',
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

        <article
            v-for="category in categories"
            :key="category.title"
            class="quiz-card"
        >
          <span class="quiz-tag">
            {{ category.title }}
          </span>

          <p>{{ category.description }}</p>

          <span class="quiz-link">
            Börja quiz →
          </span>
        </article>

      </div>

    </div>
  </section>
</template>
