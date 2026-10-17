<script setup>
import { ref, watch, onBeforeUnmount } from "vue"
import QuizResult from "@/components/QuizResult.vue"
import QuizSettings from "@/components/QuizSettings.vue"
import QuizContent from "@/components/QuizContent.vue"

const gameState = ref("settings")
const gameSettings = ref(null)
const quizStats = ref(null)


const GAME_TIME_SECONDS = 120
const timer = ref(GAME_TIME_SECONDS)
let timerInterval = null

function startTimer() {
  if (timerInterval !== null) return

  timerInterval = setInterval(() => {
    timer.value--

    if (timer.value <= 0) {
      timer.value = 0
      stopTimer()
      gameState.value = "result"
    }
  }, 1000)
}

function stopTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

watch(gameState, (state) => {
  if (state === "playing") startTimer()
  else stopTimer()
})

onBeforeUnmount(() => {
  stopTimer()
})

const startGame = (settings) => {
  gameSettings.value = settings
  quizStats.value = null
  timer.value = GAME_TIME_SECONDS
  gameState.value = "playing"
}

const finishGame = (stats) => {
  quizStats.value = stats
  stopTimer()
  gameState.value = "result"
}

const restartGame = () => {
  quizStats.value = null
  timer.value = GAME_TIME_SECONDS
  gameState.value = "playing"
}

const gotToSettings = () => {
  stopTimer()
  gameState.value = "settings"
}
</script>
<template>
    <div class = main>
        <QuizSettings v-if="gameState === 'settings'" @start="startGame" />
         
        <QuizContent v-if="gameState === 'playing'"
        :settings="gameSettings"
                     :timer="timer"
        @finished="finishGame" />

        <QuizResult v-if="gameState === 'result'" 
        :stats="quizStats"
        :settings="gameSettings"
        @goToSettings="gotToSettings"
        @restart="restartGame"/> 
    
    </div>

</template>