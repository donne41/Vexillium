<script setup>
defineProps({
  achievement: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="achievement-item">
    <div class="achievement-card" :class="{ unlocked: achievement.unlocked }">
      <span v-if="achievement.unlocked"> 🔓 </span>

      <span v-else> 🔒 </span>

      <h3>{{ achievement.name }}</h3>
      <h1>{{ achievement.icon}}</h1>

      <p>{{ achievement.description }}</p>

      <p v-if="achievement.progress">
        {{ achievement.progress.current }} /
        {{ achievement.progress.threshold }}
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
  margin-bottom:10px;
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