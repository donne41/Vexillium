<script setup>
import './RegisterView.css'
</script>

<template>
  <main class="register-page">

    <div class="register-card">

      <div class="register-heading">
        <h1>Skapa konto</h1>
        <p>Skapa ett konto för att spara dina resultat och följa dina framsteg.</p>
      </div>

      <form class="register-form">

        <div class="form-group">
          <label for="username">Användarnamn</label>
          <input
              id="username"
              type="text"
              placeholder="Välj ett användarnamn"
          />
        </div>

        <div class="form-group">
          <label for="email">E-post</label>
          <input
              id="email"
              type="email"
              placeholder="Ange din e-post"
          />
        </div>

        <div class="form-group">
          <label for="password">Lösenord</label>
          <input
              id="password"
              type="password"
              placeholder="Välj ett lösenord"
          />
        </div>

        <div class="form-group">
          <label for="confirm-password">Bekräfta lösenord</label>
          <input
              id="confirm-password"
              type="password"
              placeholder="Ange lösenordet igen"
          />
        </div>

        <label class="terms">
          <input type="checkbox" />
          <span>Jag godkänner villkoren och integritetspolicyn.</span>
        </label>

        <button type="submit" class="register-submit">
          Skapa konto
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