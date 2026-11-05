<script setup>
import { ref, watch, onBeforeUnmount } from "vue"
import QuizResult from "@/components/QuizResult.vue"
import QuizSettings from "@/components/QuizSettings.vue"
import QuizContent from "@/components/QuizContent.vue"
import QuizError from "@/components/QuizError.vue"
import "@/assets/css/QuizGame.css"

const gameState = ref("settings")

const gameSettings = ref(null)
const quizStats = ref(null)
const errorMessage = ref(null)

const GAME_TIME_SECONDS = 120
const timer = ref(GAME_TIME_SECONDS)
let timerInterval = null

function stopTimer() {
    if (timerInterval !== null) {
        clearInterval(timerInterval)
        timerInterval = null
    }
}
function startTimer() {
    if (timerInterval !== null) return

    timerInterval = setInterval(() => {
        timer.value--

        if (timer.value <= 0) {
            timer.value = 0
            stopTimer()
        }
    }, 1000)
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
    timer.value = GAME_TIME_SECONDS
    gameState.value = "playing"
}

const finishGame = async (stats) => {
  if (gameState.value !== "playing") return

  quizStats.value = stats
  stopTimer()
  gameState.value = "result"

  try {
    const response = await fetch('/api/games/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        category: stats.category,
        score: stats.correctAnswers,
        maxScore: stats.totalQuestions
      })
    })

    if (!response.ok) {
      throw new Error(`Kunde inte spara resultatet: ${response.status}`)
    }

    const result = await response.json()
    console.log('Resultatet sparades:', result)

  } catch (error) {
    console.error('Fel vid sparande av spelresultat:', error)
  }
}

const restartGame = () => {
    timer.value = GAME_TIME_SECONDS
    gameState.value = "playing"
}

const gotToSettings = () => {
    stopTimer()
    gameState.value = "settings"
}

const goToError = (msg) => {
    errorMessage.value = msg
    gameState.value = "error"
}


</script>
<template>
    <div class=main>
        <QuizSettings v-if="gameState === 'settings'"
        @start="startGame"
        @error="goToError" />

        <QuizContent v-if="gameState === 'playing'"
        :settings="gameSettings"
        :timer="timer"
        @finished="finishGame"
        @error="goToError" />

        <QuizResult v-if="gameState === 'result'"
        :stats="quizStats"
        :settings="gameSettings"
        @goToSettings="gotToSettings"
        @restart="restartGame" />

        <QuizError v-if="gameState === 'error'"
        :msg="errorMessage" />

    </div>

</template>