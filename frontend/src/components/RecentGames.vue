<script setup>
import '@/assets/css/RecentGames.css'
import { ref, onMounted, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useProfile } from '../composables/useProfile'
import { formatDate } from '../utils/formatDate'

// Hämtas från backend längre fram.
const recentGames = ref([])

const { currentUser } = useAuth()
const { getProfile } = useProfile()

function updateRecentGames() {
  const data = loadFromLocal('quizData')
  recentGames.value = data.slice(-3).sort((a, b) => a.timeStamp < b.timeStamp)
}
async function loadRecentFromDatabase() {
  const data = await getProfile(currentUser.value.id)
  const sortOnDate = [...data.recentResults.sort((a, b) => a.completedAt > b.completedAt)].slice(-3)
  recentGames.value = adapter(sortOnDate.sort((a, b) => a.completedAt < b.completedAt))
  console.log('recent: ', recentGames.value)
}

function adapter(data) {
  return data.map((item) => ({
    type: item.category,
    timeStamp: formatDate(item.completedAt),
    correctAnswers: item.score,
    totalQuestions: item.maxScore,
  }))
}

onMounted(() => {
  if (currentUser.value) {
    // Använd data från databas
    loadRecentFromDatabase()
  } else {
    // Använd data från Local
    updateRecentGames()
  }
})

watch(
  currentUser,
  (newUser) => {
    if (newUser || currentUser.value) {
      // data från databas
      console.log('laddar från databas')
      loadRecentFromDatabase()
    } else {
      // data från local när man loggar ut
      updateRecentGames()
    }
  },
  { immediate: true },
)

function loadFromLocal(name) {
  try {
    const data = JSON.parse(localStorage.getItem(name) || '[]')
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}
</script>

<template>
  <section class="recent-games">
    <div class="recent-games-header">
      <div>
        <p class="recent-games-label">DIN AKTIVITET</p>
        <h2>Senaste spel</h2>
        <RouterLink to="/recent-games">Alla senaste spel</RouterLink>
      </div>
    </div>

    <!-- Visas när användaren inte har några spel -->
    <div v-if="recentGames.length === 0" class="recent-games-empty">
      <span class="recent-games-icon">◷</span>

      <h3>Inga spel ännu</h3>

      <p>Dina senaste quiz kommer att visas här när du har börjat spela.</p>
    </div>

    <!-- Används när vi har riktig data från backend -->
    <ul v-else class="recent-games-list">
      <li v-for="(game, index) in recentGames" :key="index" class="recent-game-item">
        <h3>{{ game.type }}</h3>
        <h3>{{ game.timeStamp }}</h3>
        <strong>{{ game.correctAnswers }} / {{ game.totalQuestions }} poäng</strong>
      </li>
    </ul>
  </section>
</template>
