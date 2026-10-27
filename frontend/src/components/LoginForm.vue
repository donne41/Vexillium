<script setup>
import './LoginForm.css'
</script>

<template>
  <form class="login-form">

    <div class="form-group">
      <label for="login-identifier">E-post eller användarnamn</label>

      <input
          id="login-identifier"
          type="text"
          placeholder="Ange e-post eller användarnamn"
      />
    </div>

    <div class="form-group">
      <label for="login-password">Lösenord</label>

      <input
          id="login-password"
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
</template>