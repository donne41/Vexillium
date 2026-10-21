<script setup>
import { ref } from "vue"
import QuizResult from "@/components/QuizResult.vue"
import QuizSettings from "@/components/QuizSettings.vue"
import QuizContent from "@/components/QuizContent.vue"
import QuizError from "@/components/QuizError.vue"

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

const finishGame = (stats) => {
    quizStats.value = stats
    stopTimer()
    gameState.value = "result"
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