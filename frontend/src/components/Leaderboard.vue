<script setup>
import '@/assets/css/Leaderboard.css'
import { ref, onMounted } from 'vue'

const players = ref([])
const loadError = ref(false)

async function fetchLeaderboard() {
  loadError.value = false
  try {
    const response = await fetch('/api/leaderboard')
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    players.value = await response.json()
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    loadError.value = true
  }
}

onMounted(fetchLeaderboard)
</script>

<template>
  <section id="leaderboard" class="leaderboard">
    <div class="leaderboard-header">
      <div>
        <p class="leaderboard-label">RANKING</p>
        <h2>Topplistan</h2>
      </div>
    </div>

    <!-- Visas tills vi har riktiga resultat -->
    <div v-if="loadError" class="leaderboard-empty" role="alert">
      <span class="leaderboard-empty-icon">⚠</span>
      <h3>Topplistan kunde inte laddas</h3>
      <p>Försök igen genom att ladda om sidan.</p>
    </div>

    <div v-else-if="players.length === 0" class="leaderboard-empty">
      <span class="leaderboard-empty-icon">☆</span>

      <h3>Topplistan är tom</h3>

      <p>Här kommer spelarnas placeringar och poäng att visas när resultaten finns tillgängliga.</p>
    </div>

    <!-- Visas när backend skickar riktiga spelare -->
    <div v-else class="leaderboard-list">
      <div v-for="(player, index) in players" :key="player.id" class="leaderboard-player">
        <span class="leaderboard-position">
          {{ index + 1 }}
        </span>

        <RouterLink
            :to="{ name: 'user-profile', params: { id: player.id } }"
            class="leaderboard-name"
        >
          {{ player.username }}
        </RouterLink>
        <strong class="leaderboard-score"> {{ player.score }} poäng </strong>
      </div>
    </div>
  </section>
</template>