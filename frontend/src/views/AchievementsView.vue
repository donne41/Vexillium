<script setup>
import { ref, onMounted } from 'vue'
import AchievementCard from '@/components/AchievementCard.vue'

const achievements = ref([])
const loading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  try {
    const response = await fetch('/api/achievements', {
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Kunde inte hämta prestationer')
    }

    achievements.value = await response.json()
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Kunde inte ladda prestationerna.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="achievements">
    <h1>Achievements 🏆</h1>

    <p v-if="loading">Laddar prestationer...</p>

    <p v-else-if="errorMessage" role="alert">
      {{ errorMessage }}
    </p>

    <p v-else-if="achievements.length === 0">Inga prestationer finns ännu.</p>

    <div v-else class="achievements-list">
      <AchievementCard
        v-for="achievement in achievements"
        :key="achievement.id"
        :achievement="achievement"
      />
    </div>
  </main>
</template>

<style scoped>
:root {
  --background: #15181c;
  --section: #1a1f26;
  --card: #1e222a;
  --border: #2f3643;
  --teal: #00b8c8;
  --green: #4caf50;
  --text: #ffffff;
  --muted: #939ea9;
}

body {
  font-family: Arial, sans-serif;
  background-color: var(--background);
  color: var(--text);
  margin: 0;
  padding: 0;
}

.achievements {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.achievements h1 {
  text-align: center;
}

.achievement-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.achievement {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: #f5f5f5;
}

.achievement-image {
  font-size: 2.5rem;
}

.achievement-info h2 {
  margin: 0;
}

.achievement-info p {
  margin: 0.4rem 0;
}

.achievement-info span {
  font-size: 0.9rem;
}

.achievement:not(.unlocked) {
  opacity: 0.5;
}
</style>