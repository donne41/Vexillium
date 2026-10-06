
<script setup>
import { ref } from 'vue'
import logoQuiz from '../assets/logoquiz.png'
import './HeroSection.css'

const showCategories = ref(false)
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
            <button>Flaggor</button>
            <button>Huvudstäder</button>
            <button>Länder</button>
          </div>

        </div>

      </div>

      <!-- Logotyp till höger -->
      <div class="hero-graphic">

        <img
            :src="logoQuiz"
            alt="Vexillium Quiz"
            class="hero-logo"
        />

      </div>

    </div>
  </section>
</template>
