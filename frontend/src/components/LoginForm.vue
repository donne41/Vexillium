<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import '@/assets/css/LoginForm.css'

const emit = defineEmits(['success'])

const { login } = useAuth()

const identifier = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

/**
 * handleSubmit kontrollerar att båda fälten är ifyllda och loggar sedan in via useAuth.
 * Lyckas inloggningen skickas eventet success med användaren, annars visas felmeddelandet.
 */
async function handleSubmit() {
  if (isSubmitting.value) return

  errorMessage.value = ''

  if (identifier.value.trim() === '' || password.value === '') {
    errorMessage.value = 'Ange användarnamn eller e-post samt lösenord'
    return
  }

  isSubmitting.value = true
  try {
    const user = await login(identifier.value.trim(), password.value)
    password.value = ''
    emit('success', user)
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form class="login-form" @submit.prevent="handleSubmit">

    <div class="form-group">
      <label for="login-identifier">E-post eller användarnamn</label>

      <input
          id="login-identifier"
          v-model="identifier"
          type="text"
          autocomplete="username"
          placeholder="Ange e-post eller användarnamn"
      />
    </div>

    <div class="form-group">
      <label for="login-password">Lösenord</label>

      <input
          id="login-password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          placeholder="Ange ditt lösenord"
      />
    </div>

    <a href="#" class="forgot-password">
      Glömt lösenord?
    </a>

    <p v-if="errorMessage" class="login-error" role="alert">
      {{ errorMessage }}
    </p>

    <button type="submit" class="login-submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Loggar in...' : 'Logga in' }}
    </button>

  </form>
</template>