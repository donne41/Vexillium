<script setup>
import { useRoute, useRouter } from 'vue-router'
import './LoginView.css'
import LoginForm from '../components/LoginForm.vue'

const route = useRoute()
const router = useRouter()

/**
 * goToNextPage skickar användaren vidare efter inloggning: till sidan i ?redirect=
 * om den är en sökväg inom sajten, annars till startsidan.
 */
function goToNextPage() {
  const redirect = route.query.redirect
  const isInternalPath = typeof redirect === 'string'
    && redirect.startsWith('/')
    && !redirect.startsWith('//')
    && !redirect.startsWith('/\\')

  router.replace(isInternalPath ? redirect : '/')
}
</script>

<template>
  <main class="login-page">

    <div class="login-card">

      <div class="login-heading">
        <h1>Logga in</h1>
        <p>
          Logga in för att spara dina resultat och följa dina framsteg.
        </p>
      </div>

      <LoginForm @success="goToNextPage" />

      <div class="create-account">
        <p>Har du inget konto?</p>

        <RouterLink to="/register">
          Skapa ett konto
        </RouterLink>
      </div>

    </div>

  </main>
</template>