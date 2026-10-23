<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import HeroSection from '../components/HeroSection.vue'
import QuizCategories from '../components/QuizCategories.vue'
import RecentGames from '../components/RecentGames.vue'
import Leaderboard from '../components/Leaderboard.vue'
import QuizRoom from '../components/QuizRoom.vue'
import CreateRoom from '../components/CreateRoom.vue'

const route = useRoute()

const showJoinRoom = computed(() => route.hash === '#quiz-rooms')
const showCreateRoom = computed(() =>
    route.hash === '#quiz-rooms' || route.hash === '#create-room'
)
const showQuizCategories = computed(() => route.hash === '#quiz')

defineProps({
  currentUser: {
    type: Object,
    default: null,
  },
  authHeaders: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <main>

    <!-- Översta delen av startsidan -->
    <HeroSection>
      <RecentGames />
      <Leaderboard />
    </HeroSection>

    <!-- Våra sex quizkategorier -->
    <QuizCategories v-show="showQuizCategories" />

    <CreateRoom
        v-show="showCreateRoom"
        :current-user="currentUser"
        :auth-headers="authHeaders"
    />

    <QuizRoom v-show="showJoinRoom" />

  </main>
</template>