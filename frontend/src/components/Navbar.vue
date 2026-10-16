
<script setup>
import './Navbar.css'

import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const isMenuOpen = ref(false)
const route = useRoute()

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

watch(() => route.fullPath, closeMenu)

</script>

<template>
  <header class="navbar">
    <div class="navbar-content">

      <RouterLink to="/" class="navbar-logo">
        <h1>VEXILLIUM</h1>
      </RouterLink>

      <nav class="desktop-nav">
        <a href="#">Hem</a>
        <a href="#">Quiz</a>
        <a href="#">Topplista</a>
      </nav>

      <RouterLink to="/login" class="login-button desktop-login">
        Logga in
      </RouterLink>

      <button
        class="hamburger-button"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-navigation"
        :aria-label="isMenuOpen ? 'Stäng meny' : 'Öppna meny'"
        @click="toggleMenu"
      >
        <span :class="{ active: isMenuOpen }"></span>
        <span :class="{ active: isMenuOpen }"></span>
        <span :class="{ active: isMenuOpen }"></span>
      </button>

    </div>

    <nav
      id="mobile-navigation"
      class="mobile-nav"
      :class="{ 'is-open': isMenuOpen }"
    :inert="!isMenuOpen"
    aria-label="Mobilnavigation"
    >
    <RouterLink to="/" @click="closeMenu">Hem</RouterLink>
    <a href="/#quiz-categories" @click="closeMenu">Quiz</a>
    <a href="/#leaderboard" @click="closeMenu">Topplista</a>
    <a href="/#quiz-rooms" @click="closeMenu">Quizrum</a>
    <RouterLink to="/login" class="mobile-login" @click="closeMenu">
      Logga in
    </RouterLink>
    </nav>
  </header>
</template>
