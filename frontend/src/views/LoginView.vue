<script setup>
import '@/assets/css/LoginView.css'
import LoginForm from '../components/LoginForm.vue'
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