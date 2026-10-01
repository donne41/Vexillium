<script setup>
</script>

<template>
  <body>
  <header class="navbar">
    <nav>
      <a href="#">Hem</a>
      <a href="#">Quiz</a>
      <a href="#">Topplista</a>
      <button>Logga in</button>
    </nav>
  </header>

  <div class="container">
    <h1 class="h1-achievements">Achievements 🏆</h1>

    <div class="award-achievement-container">

      <button class="achievement-item">
        <span class="achievement-icon">👋</span>
        <span class="achievement-name">DU ÄR NU EN VEXILLIUMARE</span>
        <span class="achievement-count">1/1</span>
      </button>

      <button class="achievement-item">
        <span class="achievement-icon">🌍</span>
        <span class="achievement-name">First Journey</span>
        <span class="achievement-count">1/1</span>
      </button>

      <button class="achievement-item">
        <span class="achievement-icon"> 🥇🏆</span>
        <span class="achievement-name">VEXILLIUM MASTER</span>
        <span class="achievement-count">0/1</span>
      </button>

    </div>
  </div>
  </body>
</template>

<style scoped>


:root {
  --background: #15181C;
  --section: #1A1F26;
  --card: #1E222A;
  --border: #2F3643;
  --teal: #00B8C8;
  --green: #4CAF50;
  --text: #FFFFFF;
  --muted: #939EA9;
}


.achievement-item{
  display:flex;
  background-color: white;
  border:none;

  margin:5px;
}

.achievement-icon{
  background-color: white;
}

.h1-achievements {
  color: white;
}

body {
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  background-color: var(--background);
  color: var(--text);
}

.h1-achievements {
  color: white;
}

.navbar {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar h1 {
  margin: 0;
  color: #4fd1c5;
  font-size: 26px;
  letter-spacing: 2px;
}

.navbar nav {
  display: flex;
  align-items: center;
  gap: 28px;
}

.navbar a {
  color: white;
  text-decoration: none;
  font-size: 16px;
}

.navbar a:hover {
  color: #4fd1c5;
}

.navbar button {
  padding: 10px 20px;
  background-color: transparent;
  color: #4fd1c5;
  border: 1px solid #4fd1c5;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
}

.navbar button:hover {
  background-color: #4fd1c5;
  color: #081b2c;
}

@media (max-width: 600px) {
  .navbar {
    padding: 20px;
  }

  .navbar-content {
    flex-wrap: wrap;
    gap: 18px;
  }

  .navbar h1 {
    font-size: 22px;
  }

  .navbar nav {
    order: 3;
    width: 100%;
    justify-content: center;
    gap: 20px;
  }

  .navbar a {
    font-size: 14px;
  }

  .login-button {
    padding: 9px 14px;
    font-size: 13px;
  }
}

</style>
