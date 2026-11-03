<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import '@/assets/css/RegisterView.css'

const router = useRouter()
const { register } = useAuth()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

/**
 * handleSubmit gör de enkla kontrollerna (alla fält ifyllda, lösenorden lika) och skapar
 * sedan kontot via useAuth, som även loggar in. Därefter skickas användaren till startsidan.
 * Övrig validering (längd, format, upptaget namn) sköts av backend.
 */
async function handleSubmit() {
  if (isSubmitting.value) return

  errorMessage.value = ''

  if (
      username.value.trim() === '' ||
      email.value.trim() === '' ||
      password.value === '' ||
      confirmPassword.value === ''
  ) {
    errorMessage.value = 'Fyll i alla fält'
    return
  }

  if (password.value !== confirmPassword.value ) {
    errorMessage.value = 'Lösenorden matchar inte'
    return
  }

  isSubmitting.value = true
  try {
    await register(username.value.trim(), email.value.trim(), password.value)
    router.replace('/')
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="register-page">

    <div class="register-card">

      <div class="register-heading">
        <h1>Skapa konto</h1>
        <p>Skapa ett konto för att spara dina resultat och följa dina framsteg.</p>
      </div>

      <form class="register-form" novalidate @submit.prevent="handleSubmit">

        <div class="form-group">
          <label for="register-username">Användarnamn</label>
          <input
              id="register-username"
              v-model="username"
              type="text"
              autocomplete="username"
              placeholder="Välj ett användarnamn"
              aria-describedby="register-username-hint"
          />
          <p id="register-username-hint" class="field-hint">3-50 tecken, inga @ symboler</p>
        </div>

        <div class="form-group">
          <label for="register-email">E-post</label>
          <input
              id="register-email"
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="Ange din e-post"
          />
        </div>

        <div class="form-group">
          <label for="register-password">Lösenord</label>
          <input
              id="register-password"
              v-model="password"
              type="password"
              autocomplete="new-password"
              placeholder="Välj ett lösenord"
              aria-describedby="register-password-hint"
          />
          <p id="register-password-hint" class="field-hint">Minst 8 tecken</p>
        </div>

        <div class="form-group">
          <label for="register-confirm-password">Bekräfta lösenord</label>
          <input
              id="register-confirm-password"
              v-model="confirmPassword"
              type="password"
              autocomplete="new-password"
              placeholder="Ange lösenordet igen"
          />
        </div>

        <label class="terms">
          <input type="checkbox" />
          <span>Jag godkänner villkoren och integritetspolicyn.</span>
        </label>

        <p v-if="errorMessage" class="register-error" role="alert">
          {{ errorMessage }}
        </p>

        <button type="submit" class="register-submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Skapar konto...' : 'Skapa konto' }}
        </button>

      </form>

      <div class="login-link">
        <p>Har du redan ett konto?</p>

        <RouterLink to="/login">
          Logga in
        </RouterLink>
      </div>

    </div>

  </main>
</template>