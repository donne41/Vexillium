
<script setup>
import { ref } from 'vue'
import './HeroSection.css'
import QuizGame from "./QuizGame.vue"

const showCategories = ref(false)
function openQuiz(quizType){
  
}
</script>

<template>
  <section class="hero">
    <div class="hero-content">

      <!-- Text till vänster -->
      <div class="hero-text">

        <p class="hero-label">
          EXPLORE THE WORLD
        </p>

        <h2>Hur väl känner du till världen?</h2>

        <p class="hero-description">
          Välj en utmaning och börja klättra direkt. Ingen registrering krävs för att köra de
          dagliga länderna. Snabbt, kaxigt och beroendeframkallande.
        </p>

        <button
            class="play-button"
            @click="showCategories = !showCategories"
        >
          Välj quiz
        </button>

        <!-- Visas endast när användaren klickar -->
        <div v-if="showCategories" class="quiz-categories">

          <h3>Välj kategori</h3>

          <div class="category-buttons">
            <button @click="openQuiz(flags)">Flaggor</button>
            <button>Huvudstäder</button>
            <button>Länder</button>
          </div>

        </div>
      </div>

      <!-- Cirkelgrafik till höger -->
      <div class="hero-graphic">

        <div class="circle circle-one">
          <div class="circle circle-two">
            <div class="circle circle-three">
              <div class="circle-center"></div>
            </div>
          </div>
        </div>

        <!-- Informationsruta utan teststatistik -->
        <div class="graphic-stats">

          <div class="stat-item">
            <span>ACTIVE NODES</span>
            <strong>–</strong>
          </div>

          <div class="stat-item">
            <span>GLOBAL LOBBIES</span>
            <strong>–</strong>
          </div>

        </div>

      </div>

    </div>
  </section>
</template>
