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

</style>