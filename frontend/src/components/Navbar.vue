<script setup>
import '@/assets/css/Navbar.css'
import NavIcon from './NavIcon.vue'
import {useAuth} from '@/composables/useAuth'

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

const { currentUser, logout } = useAuth()
const isLoggingOut = ref(false)
const logoutError = ref('')

/**
 * handleLogout loggar ut via useAuth och stänger menyn. Misslyckas utloggningen
 * förblir användaren inloggad och felmeddelandet visas under menyraden.
 */
async function handleLogout() {
  if (isLoggingOut.value) return

  logoutError.value = ''
  isLoggingOut.value = true
  try {
    await logout()
    closeMenu()
  } catch (error) {
    logoutError.value = error.message
  } finally {
    isLoggingOut.value = false
  }
}

function closeMenu() {
  isMenuOpen.value = false
}

watch(() => route.fullPath, () => {
  closeMenu()
  logoutError.value = ''
})

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

      <RouterLink v-if="!currentUser" :to="loginLink" class="login-button desktop-login">
        Logga in
      </RouterLink>
      <div v-else class="navbar-account desktop-login">
        <RouterLink :to="{ name: 'profile' }" class="navbar-username" :title="currentUser.username">
          <NavIcon name="user" />
          <span class="navbar-username-text">{{ currentUser.username }}</span>
        </RouterLink>
        <button
            type="button"
            class="login-button desktop-login"
            :disabled="isLoggingOut"
            @click="handleLogout"
        >
          Logga ut
        </button>
      </div>

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
    <p v-if="logoutError" class="logout-error" role="alert">
      {{ logoutError }}
    </p>

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
      <RouterLink v-if="!currentUser" :to="loginLink" class="mobile-login" @click="closeMenu">
        Logga in
      </RouterLink>
      <template v-else>
        <RouterLink :to="{ name: 'profile' }" class="mobile-username" @click="closeMenu">
          <NavIcon name="user" />
          {{ currentUser.username }}
        </RouterLink>
        <button
            type="button"
            class="mobile-login"
            :disabled="isLoggingOut"
            @click="handleLogout"
        >
          Logga ut
        </button>
      </template>
    </nav>
  </header>
</template>
