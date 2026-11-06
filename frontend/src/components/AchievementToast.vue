<script setup>
defineProps({
  achievement: {
    type: Object,
    default: null
  }
})
</script>

<template>
  <div v-if="achievement" class="achievement-toast">
    <span>{{ achievement.icon }}</span>

    <div>
      <strong>Prestation upplåst!</strong>
      <p>{{ achievement.name }}</p>
    </div>
  </div>
</template>

<style scoped>

.achievement-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;

  display: flex;
  align-items: center;
  gap: 12px;

  padding: 12px 16px;
  background: #4CAF50;
  border-radius: 8px;
  color: white;
  width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}
</style>