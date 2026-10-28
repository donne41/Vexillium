<script setup>
import { useRoute, useRouter } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import '@/assets/css/LoginView.css'

const route = useRoute()
const router = useRouter()

function goToNextPage() {
  const redirect = route.query.redirect

  const isInternalPath =
    typeof redirect === 'string' &&
    redirect.startsWith('/') &&
    !redirect.startsWith('//') &&
    !redirect.startsWith('/\\')

  const destination = isInternalPath ? router.resolve(redirect) : null

  const isValidDestination =
    destination !== null && destination.matched.length > 0 && destination.name !== 'login'

  router.replace(isValidDestination ? destination.fullPath : '/')
}
</script>

<template>
  <main class="login-page">
    <div class="login-card">
      <div class="login-heading">
        <h1>Logga in</h1>
        <p>Logga in för att spara dina resultat och följa dina framsteg.</p>
      </div>

      <LoginForm @success="goToNextPage" />

      <div class="create-account">
        <p>Har du inget konto?</p>

        <RouterLink to="/register"> Skapa ett konto </RouterLink>
      </div>
    </div>
  </main>
</template>
