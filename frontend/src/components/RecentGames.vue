
<script setup>
import './RecentGames.css'

// Hämtas från backend längre fram.
const recentGames = []
</script>

<template>
  <section class="recent-games">

    <div class="recent-games-header">
      <div>
        <p class="recent-games-label">DIN AKTIVITET</p>
        <h2>Senaste spel</h2>
      </div>
    </div>

    <!-- Visas när användaren inte har några spel -->
    <div v-if="recentGames.length === 0" class="recent-games-empty">
      <span class="recent-games-icon">◷</span>

      <h3>Inga spel ännu</h3>

      <p>
        Dina senaste quiz kommer att visas här
        när du har börjat spela.
      </p>
    </div>

    <!-- Används när vi har riktig data från backend -->
    <div v-else class="recent-games-list">
      <div
          v-for="game in recentGames"
          :key="game.id"
          class="recent-game-item"
      >
        <div>
          <h3>{{ game.category }}</h3>
          <p>{{ game.date }}</p>
        </div>

        <strong>{{ game.score }} poäng</strong>
      </div>
    </div>

  </section>
</template>
