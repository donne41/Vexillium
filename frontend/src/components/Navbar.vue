<script setup>
import '@/assets/css/Navbar.css'
import NavIcon from './NavIcon.vue'
import { useAuth } from '@/composables/useAuth'

import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const isMenuOpen = ref(false)
const isAccountOpen = ref(false)
const accountMenu = ref(null)
const accountButton = ref(null)

function closeAccountOutside(event) {
  if (!accountMenu.value?.contains(event.target)) {
    isAccountOpen.value = false
  }
}

function closeAccountOnBlur(event) {
  if (!accountMenu.value?.contains(event.relatedTarget)) {
    isAccountOpen.value = false
  }
}

/**
 * closeAccountMenu stänger kontomenyn med Esc och flyttar fokus tillbaka till knappen,
 * så att tangentbordsanvändare inte tappar bort var de är.
 */
function closeAccountMenu() {
  isAccountOpen.value = false
  accountButton.value?.focus()
}

onMounted(() => document.addEventListener('pointerdown', closeAccountOutside))
onUnmounted(() => document.removeEventListener('pointerdown', closeAccountOutside))
const route = useRoute()
const router = useRouter()

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
    if (route.meta.requiresAuth) {
      router.replace({ name: 'home' })
    }
  } catch (error) {
    logoutError.value = error.message
  } finally {
    isLoggingOut.value = false
  }
}

function closeMenu() {
  isMenuOpen.value = false
  isAccountOpen.value = false
}
watch(
  () => route.fullPath,
  () => {
    closeMenu()
    logoutError.value = ''
  },
)
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
        <RouterLink :to="{ path: '/leaderboard', hash: '#leaderboard' }" @click="closeMenu">
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
      <div
        v-else
        ref="accountMenu"
        class="navbar-account"
        @mouseenter="isAccountOpen = true"
        @mouseleave="isAccountOpen = false"
        @focusout="closeAccountOnBlur"
        @keydown.esc.stop="closeAccountMenu"
      >
        <button
          ref="accountButton"
          type="button"
          class="navbar-username"
          :title="currentUser.username"
          :aria-expanded="isAccountOpen"
          aria-controls="account-dropdown"
          @click="isAccountOpen = true"
        >
          <NavIcon name="user" />
          <span class="navbar-username-text">{{ currentUser.username }}</span>
        </button>

        <div v-if="isAccountOpen" id="account-dropdown" class="account-dropdown">
          <RouterLink :to="{ name: 'profile' }" @click="closeMenu"> Min profil </RouterLink>

          <button type="button" :disabled="isLoggingOut" @click="handleLogout">
            {{ isLoggingOut ? 'Loggar ut...' : 'Logga ut' }}
          </button>
        </div>
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

      <RouterLink :to="{ path: '/leaderboard', hash: '#leaderboard' }" @click="closeMenu">
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
    </nav>
  </header>
</template>
