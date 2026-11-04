<script setup>
import { computed, ref, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import HeroSection from '../components/HeroSection.vue'
import QuizCategories from '../components/QuizCategories.vue'
import RecentGames from '../components/RecentGames.vue'
import Leaderboard from '../components/Leaderboard.vue'
import QuizRoom from '../components/QuizRoom.vue'
import CreateRoom from '../components/CreateRoom.vue'

const route = useRoute()

const emit = defineEmits(['room-active'])

const hosting = ref(false)
const participating = ref(false)

const roomActive = computed(() => {
  return hosting.value || participating.value
})

watch(
  roomActive,
  async (active) => {
    emit('room-active', active)

    if (active) {
      await nextTick()
      window.scrollTo(0, 0)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  emit('room-active', false)
})

const showJoinRoom = computed(() => route.hash === '#quiz-rooms')
const showCreateRoom = computed(() => route.hash === '#quiz-rooms' || route.hash === '#create-room')
const showQuizCategories = computed(() => route.hash === '#quiz')

const { currentUser } = useAuth()

defineProps({
  authHeaders: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <main>
    <HeroSection v-show="!roomActive">
      <RecentGames />
      <Leaderboard />
    </HeroSection>

    <QuizCategories v-show="!roomActive && showQuizCategories" />

    <CreateRoom
      v-show="hosting || (!roomActive && showCreateRoom)"
      :current-user="currentUser"
      :auth-headers="authHeaders"
      @room-active="hosting = $event"
    />

    <QuizRoom
      v-show="!hosting && (participating || (!roomActive && showJoinRoom))"
      @room-active="participating = $event"
    />
  </main>
</template>