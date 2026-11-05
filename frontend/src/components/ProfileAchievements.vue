<script setup>
import { formatDate } from '../utils/formatDate.js'
import '@/assets/css/ProfilePanels.css'

defineProps({
  achievements: { type: Array, required: true },
})
</script>

<template>
  <section class="profile-panel">
    <h2>Senaste prestationer</h2>

    <p v-if="achievements.length === 0" class="profile-panel-empty">Inga prestationer ännu.</p>

    <ul v-else class="profile-list">
      <li v-for="achievement in achievements" :key="achievement.id" class="profile-list-item">
        <span class="profile-achievement-icon" aria-hidden="true">{{ achievement.icon }}</span>
        <div class="profile-achievement-text">
          <strong>{{ achievement.name }}</strong>
          <span class="profile-list-meta">{{ achievement.description }}</span>
        </div>
        <span class="profile-list-meta">{{ formatDate(achievement.unlockedAt) }}</span>
      </li>
    </ul>

    <RouterLink to="/achievements" class="profile-panel-link">Alla prestationer →</RouterLink>
  </section>
</template>
