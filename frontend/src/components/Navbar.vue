
<script setup>
import './Navbar.css'
</script>

<template>
  <header class="navbar">
    <div class="navbar-content">

      <RouterLink to="/" class="navbar-logo">
        <h1>VEXILLIUM</h1>
      </RouterLink>

      <nav>
        <a href="#">Hem</a>
        <a href="#">Quiz</a>
        <a href="#">Topplista</a>
      </nav>

      <RouterLink to="/login" class="login-button">
        Logga in
      </RouterLink>

    </div>
  </header>
</template>
