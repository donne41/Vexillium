
<script setup>
import '@/assets/css/RecentGames.css'

// Hämtas från backend längre fram.
const recentGames = []

function categoryName(category) {
  const categories = {
    flags: 'Flaggor',
    capitals: 'Huvudstäder'
  };

  return categories[category] || category;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('sv-SE');
}
</script>

<template>
  <section class="recent-games">

    <div class="recent-games-header">
      <div>
        <p class="recent-games-label">DIN AKTIVITET</p>
        <h2>Senaste spel</h2>
        <RouterLink class="router" to="/games/history">
          Visa alla matcher
        </RouterLink>
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
          <h3>{{ game.username }}</h3>
          <p>{{ categoryName(game.category) }}</p>
          <p>{{ formatDate(game.completedAt) }}</p>
        </div>

        <strong>{{ game.score }}/{{ game.maxScore }}</strong>
      </div>
    </div>

  </section>
</template>
