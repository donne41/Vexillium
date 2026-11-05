<script setup>
import { categoryLabel } from '../utils/quizCategories'
import { formatDate } from '../utils/formatDate'
import '@/assets/css/ProfilePanels.css'

defineProps({
  results: { type: Array, required: true },
})
</script>

<template>
  <section class="profile-panel">
    <h2>Senaste quiz</h2>

    <p v-if="results.length === 0" class="profile-panel-empty">Inga spelade quiz ännu.</p>

    <ul v-else class="profile-list">
      <li v-for="result in results" :key="result.id" class="profile-list-item">
        <div>
          <strong>{{ categoryLabel(result.category) }}</strong>
          <span class="profile-list-meta">{{ formatDate(result.completedAt) }}</span>
        </div>
        <div class="profile-list-value">
          {{ result.score }}/{{ result.maxScore }}
          <span class="profile-list-meta">{{ result.percentage }} %</span>
        </div>
      </li>
    </ul>
  </section>
</template>
