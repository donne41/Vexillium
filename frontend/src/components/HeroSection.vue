<script setup>
import {ref} from 'vue'
import { useRouter } from "vue-router"
import globe from '../assets/globe.png'
import vexilliumOverlay from '../assets/vexillium-overlay.png'
import './HeroSection.css'

const router = useRouter()

const showCategories = ref(false)
function openQuiz(quizType){
  console.log("button pressed for quiz type: " + quizType)
  router.push(`/quiz/${quizType}`)
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
          Testa dina kunskaper om flaggor, länder och huvudstäder.
          Spela direkt – inget konto behövs.
        </p>

        <button
            class="play-button"
            @click="showCategories = !showCategories"
        >
          Välj quiz
        </button>

        <!-- Visas när användaren klickar -->
        <div v-if="showCategories" class="quiz-categories">

          <h3>Välj kategori</h3>

          <div class="category-buttons">
            <button @click="openQuiz('flags')">Flaggor</button>
            <button>Huvudstäder</button>
            <button>Länder</button>
          </div>

        </div>

      </div>

      <!-- Logotyp till höger -->
      <div class="hero-graphic">

        <div class="animated-logo">

          <img
              :src="globe"
              alt=""
              class="hero-globe"
          />

          <img
              :src="vexilliumOverlay"
              alt="Vexillium"
              class="hero-overlay"
          />

        </div>

      </div>

    </div>
  </section>
</template>
