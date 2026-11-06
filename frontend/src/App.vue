<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import ToastMessage from './components/ToastMessage.vue'

import AchievementToast from './components/AchievementToast.vue'
import { useAchievementToast } from './composables/useAchievementToast'

const { currentAchievement } = useAchievementToast()

const roomActive = ref(false)
const route = useRoute()

watch(
  () => route.path,
  () => {
    roomActive.value = false
  },
)
</script>

<template>
  <div class="app">
    <AchievementToast :achievement="currentAchievement" />
    <Navbar v-show="!roomActive" />

    <RouterView @room-active="roomActive = $event" />

    <Footer v-show="!roomActive" />
    <ToastMessage />
  </div>
</template>