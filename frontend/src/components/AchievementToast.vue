<script>
export default {
  props: {
    achievement: {
      type: Object,
      default: null
    }
  }
}
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

.achievement-toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--green);
  border-radius: 8px;
  color: var(--text);
  width: 300px;
}
</style>