<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

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
    <Navbar v-show="!roomActive" />

    <RouterView @room-active="roomActive = $event" />

    <Footer v-show="!roomActive" />
  </div>
</template>