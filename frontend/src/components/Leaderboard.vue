<script setup>
import './Leaderboard.css'

// Riktiga användare och poäng hämtas från backend senare.
const players = []
</script>

<template>
  <section class="leaderboard">

    <div class="leaderboard-header">
      <div>
        <p class="leaderboard-label">RANKING</p>
        <h2>Topplistan</h2>
      </div>
    </div>

    <!-- Visas tills vi har riktiga resultat -->
    <div v-if="players.length === 0" class="leaderboard-empty">
      <span class="leaderboard-empty-icon">☆</span>

      <h3>Topplistan är tom</h3>

      <p>
        Här kommer spelarnas placeringar och poäng
        att visas när resultaten finns tillgängliga.
      </p>
    </div>

    <!-- Visas när backend skickar riktiga spelare -->
    <div v-else class="leaderboard-list">
      <div
          v-for="(player, index) in players"
          :key="player.id"
          class="leaderboard-player"
      >
        <span class="leaderboard-position">
          {{ index + 1 }}
        </span>

        <span class="leaderboard-name">
          {{ player.username }}
        </span>

        <strong class="leaderboard-score">
          {{ player.score }} poäng
        </strong>
      </div>
    </div>

  </section>
</template>