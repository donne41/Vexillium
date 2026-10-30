<script setup>
import '@/assets/css/Navbar.css'
import NavIcon from './NavIcon.vue'

import {computed, ref, watch} from 'vue'
import {useRoute} from 'vue-router'

const isMenuOpen = ref(false)
const route = useRoute()

// "Logga in" tar med nuvarande sida som ?redirect=, så att användaren kommer tillbaka
// hit efter inloggningen. På inloggnings- och registreringssidan behövs ingen redirect.
const loginLink = computed(() => {
  if (route.name === 'login' || route.name === 'register') {
    return { name: 'login' }
  }
  return { name: 'login', query: { redirect: route.fullPath } }
})

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

      <RouterLink to="/" class="navbar-logo" @click="closeMenu">
        <h1>VEXILLIUM</h1>
      </RouterLink>

      <nav class="desktop-nav">
        <RouterLink to="/" @click="closeMenu">
          <NavIcon name="home" />
          Hem
        </RouterLink>
        <RouterLink :to="{ path: '/', hash: '#quiz' }" @click="closeMenu">
          <NavIcon name="quiz" />
          Quiz
        </RouterLink>
        <RouterLink :to="{ path: '/', hash: '#leaderboard' }" @click="closeMenu">
          <NavIcon name="trophy" />
          Topplista
        </RouterLink>
        <RouterLink :to="{ path: '/', hash: '#quiz-rooms' }" @click="closeMenu">
          <NavIcon name="group" />
          Quizrum
        </RouterLink>
      </nav>

      <RouterLink :to="loginLink" class="login-button desktop-login">
        <NavIcon name="user" />
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
      <RouterLink to="/" @click="closeMenu">
        <NavIcon name="home" />
        Hem
      </RouterLink>
      <RouterLink :to="{ path: '/', hash: '#quiz' }" @click="closeMenu">
        <NavIcon name="quiz" />
        Quiz
      </RouterLink>

      <RouterLink :to="{ path: '/', hash: '#leaderboard' }" @click="closeMenu">
        <NavIcon name="trophy" />
        Topplista
      </RouterLink>

      <RouterLink :to="{ path: '/', hash: '#quiz-rooms' }" @click="closeMenu">
        <NavIcon name="group" />
        Quizrum
      </RouterLink>
      <RouterLink :to="loginLink" class="mobile-login" @click="closeMenu">
        <NavIcon name="user" />
        Logga in
      </RouterLink>
    </nav>
  </header>
</template>
