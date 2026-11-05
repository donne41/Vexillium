<script setup>
import { computed } from 'vue'
import { QUIZ_CATEGORIES } from '../utils/quizCategories'
import '@/assets/css/ProfilePanels.css'

const props = defineProps({
  stats: { type: Array, required: true },
})

// Alla kategorier i fast ordning, med användarens statistik där den finns.
const rows = computed(() =>
    QUIZ_CATEGORIES.map((category) => ({
      ...category,
      stats: props.stats.find((stat) => stat.category === category.key) ?? null,
    })),
)
</script>

<template>
  <section class="profile-panel">
    <h2>Kategoristatistik</h2>

    <ul class="profile-list">
      <li v-for="row in rows" :key="row.key" class="profile-stat">
        <div class="profile-stat-heading">
          <strong>{{ row.label }}</strong>
          <span v-if="row.stats" class="profile-list-meta">
            {{ row.stats.gamesPlayed }} quiz · {{ row.stats.totalScore }} poäng
          </span>
          <span v-else class="profile-list-meta">Inga quiz spelade</span>
        </div>

        <template v-if="row.stats">
          <div
              class="profile-stat-bar"
              role="progressbar"
              aria-label="Träffsäkerhet"
              aria-valuemin="0"
              aria-valuemax="100"
              :aria-valuenow="row.stats.accuracy"
          >
            <div class="profile-stat-bar-fill" :style="{ width: `${row.stats.accuracy}%` }"></div>
          </div>
          <span class="profile-list-meta">{{ row.stats.accuracy }} % rätt</span>
        </template>
      </li>
    </ul>

    <p class="profile-panel-placeholder">Andel av kategorin som besvarats: kommer snart</p>
  </section>
</template>