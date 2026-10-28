<script setup>
import { RouterLink } from 'vue-router'
import globe from '../assets/globe.png'
import vexilliumOverlay from '../assets/vexillium-overlay.png'
import flagsBackground from '../assets/flaggor.png'
import roomsBackground from '../assets/quizrum.png'
import './HeroSection.css'
</script>

<template>
  <section class="hero">
    <div class="hero-content">
      <!-- Text till vänster -->
      <div class="hero-text">
        <!-- Logotyp ovanför texten -->
        <div class="hero-graphic">
          <div class="animated-logo">
            <img :src="globe" alt="" class="hero-globe" />

            <img :src="vexilliumOverlay" alt="Vexillium" class="hero-overlay" />
          </div>
        </div>

        <p class="hero-label">EXPLORE THE WORLD</p>

        <h2>Hur väl känner du till världen?</h2>

        <p class="hero-description">
          Testa dina kunskaper om flaggor, huvudstäder, grannländer samt länders befolkning och yta.
          Spela direkt – inget konto behövs.
        </p>

        <div class="hero-actions">
          <RouterLink :to="{ path: '/', hash: '#quiz' }" class="play-button">
            <svg class="hero-button-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="currentColor" />
              <path d="M10 7.5 17 12l-7 4.5z" fill="var(--green)" />
            </svg>
            <span>Välj quiz</span>
            <svg
              class="hero-button-arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m9 5 7 7-7 7" />
            </svg>
          </RouterLink>

          <RouterLink :to="{ path: '/', hash: '#quiz-rooms' }" class="hero-secondary-button">
            <svg
              class="hero-button-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="7" r="3" />
              <path d="M3 21v-2a6 6 0 0 1 12 0v2Z" />
              <path d="M16 4a3 3 0 0 1 0 6M18 15a5 5 0 0 1 3 4v2" />
            </svg>
            <span>Spela med andra</span>
            <svg
              class="hero-button-arrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m9 5 7 7-7 7" />
            </svg>
          </RouterLink>
        </div>
      </div>

      <div class="hero-dashboard">
        <slot />
      </div>

      <div class="hero-feature-cards">
        <RouterLink
          :to="{ path: '/', hash: '#quiz' }"
          class="hero-feature-card"
          :style="{ '--card-image': `url(${flagsBackground})` }"
        >
          <h3>Quiz</h3>
          <p>
            Testa dina kunskaper om flaggor, huvudstäder, grannländer samt länders befolkning och
            yta.
          </p>
        </RouterLink>

        <RouterLink
          :to="{ path: '/', hash: '#quiz-rooms' }"
          class="hero-feature-card"
          :style="{ '--card-image': `url(${roomsBackground})` }"
        >
          <h3>Quizrum</h3>
          <p>Skapa ett eget rum eller gå med i ett befintligt.</p>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
