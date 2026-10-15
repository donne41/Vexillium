<script setup>
defineProps({
  achievement: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <article class="achievement-item">
    <div class="award-item-img-container">
      <img
          v-if="achievement.image"
          class="award-item-img"
          :src="achievement.image"
          :alt="achievement.name"
          width="140"
          height="140"
      />

      <span v-else class="achievement-icon" aria-hidden="true">
        {{ achievement.icon || '🏆' }}
      </span>
    </div>

    <div class="achievement-info">
      <h2 class="achievement-name">
        {{ achievement.name }}
      </h2>

      <p class="achievement-description">
        {{ achievement.description }}
      </p>
    </div>
  </article>
</template>

<style scoped>
.achievement-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #1e222a;
  border: 1px solid #2f3643;
  border-radius: 10px;
  color: #fff;
}

.award-item-img-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 100px;
  height: 100px;
}

.award-item-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.achievement-icon {
  font-size: 3rem;
}

.achievement-info h2 {
  margin: 0 0 0.5rem;
}

.achievement-description {
  margin: 0;
  color: #939ea9;
}
</style>