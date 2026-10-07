<script setup>
import './LoginView.css'
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

      <form class="login-form">

        <div class="form-group">
          <label for="email">E-post eller användarnamn</label>

          <input
              id="email"
              type="text"
              placeholder="Ange e-post eller användarnamn"
          />
        </div>

        <div class="form-group">
          <label for="password">Lösenord</label>

          <input
              id="password"
              type="password"
              placeholder="Ange ditt lösenord"
          />
        </div>

        <a href="#" class="forgot-password">
          Glömt lösenord?
        </a>

        <button type="submit" class="login-submit">
          Logga in
        </button>

      </form>

      <div class="create-account">
        <p>Har du inget konto?</p>

        <RouterLink to="/register">
          Skapa ett konto
        </RouterLink>
      </div>

    </div>

  </main>
</template>