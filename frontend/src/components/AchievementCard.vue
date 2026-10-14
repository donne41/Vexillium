<script setup>
</script>

<template>
  <body>

  <div class="container">
    <h1 class="h1-achievements">Achievements 🏆</h1>

    <div class="award-achievement-container">

      <button class="achievement-item">
        <div class="award-item-img-container">
          <img class="award-item-img" width="140" height="140" src="../achievement-images/Vexillium.jpg" alt="Achievement Icon">
        </div>
        <span class="achievement-name">Avatar👨🏻‍🦲</span>
      </button>

      <button class="achievement-item">
        <div class="award-item-img-container">
          <img class="award-item-img" width="140" height="140" src="../achievement-images/Vexillium.jpg" alt="Achievement Icon">
        </div>
        <span class="achievement-name">First Game🎮</span>
      </button>
      <button class="achievement-item">
        <div class="award-item-img-container">
          <img class="award-item-img" width="140" height="140" src="../achievement-images/Vexillium.jpg"alt="Achievement Icon">
        </div>
        <span class="achievement-name">Anniversity🎂</span>
      </button>
      <button class="achievement-item">
        <div class="award-item-img-container">
          <img class="award-item-img" width="140" height="140" src="../achievement-images/Vexillium.jpg" alt="Achievement Icon">
        </div>
        <span class="achievement-name">Vexillium master🥇</span>
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
  background-color: var(--background);
  border-radius:10px;
  margin:5px;
}

.achievement-icon{
  background-color: var(--background);
}

.achievement-name{
  color:white;
}

.h1-achievements {
  color: white;
}

body {
  font-family: Arial, sans-serif;
  background-color: var(--background);
  color: var(--text);
  margin: 0;
  padding: 0;
}




</style>
