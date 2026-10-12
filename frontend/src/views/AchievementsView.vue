<script>
export default {
  data() {
    return {
      achievements: [
        {
          code: 'FIRST_LOGIN',
          name: 'Du är nu en vexuillare',
          description: 'Logga in för första gången.',
          icon: '👋',
          unlocked: true
        },
        {
          code: 'FIRST_GAME',
          name: 'First Journey',
          description: 'Complete your first quiz.',
          icon: '🌍',
          unlocked: false
        },
        {
          code: 'PERFECT_GAME',
          name: 'Perfect Score',
          description: 'Get every question correct.',
          icon: '🏆',
        unlocked: false
  },
    {
      code: 'TEN_CORRECT',
          name: 'Geography Rookie',
        description: 'Answer 10 questions correctly.',
        icon: '🧠',
        unlocked: false
    }
  ]
  }
  }
}
</script>

<template>
  <main class="achievements">
    <h1>Achievements 🏆</h1>

    <div class="achievement-list">
      <div
          v-for="achievement in achievements"
          :key="achievement.code"
          class="achievement"
          :class="{ unlocked: achievement.unlocked }"
      >
        <span class="achievement-icon">
          {{ achievement.icon }}
        </span>

        <div class="achievement-info">
          <h2>{{ achievement.name }}</h2>
          <p>{{ achievement.description }}</p>

          <span v-if="achievement.unlocked">
            ✅ Unlocked
          </span>

          <span v-else>
            🔒 Locked
          </span>
        </div>
      </div>
    </div>
  </main>
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

.achievement-icon {
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