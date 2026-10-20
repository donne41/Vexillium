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

const startGame = (settings) => {
    gameSettings.value = settings
    gameState.value = "playing"
}

const finishGame = (stats) => {
    quizStats.value = stats,
    gameState.value = "result"
}

const restartGame = () => {
    gameState.value = "playing"
}

const gotToSettings = () => {
    gameState.value = "settings"
}

const goToError = (msg) => {
    errorMessage.value = msg
    gameState.value = "error"
}


</script>
<template>
    <div class = main>
        <QuizSettings v-if="gameState === 'settings'"
        @start="startGame"
        @error="goToError" />
         
        <QuizContent v-if="gameState === 'playing'"
        :settings="gameSettings"
        @finished="finishGame"
        @error="goToError"/>

        <QuizResult v-if="gameState === 'result'" 
        :stats="quizStats"
        :settings="gameSettings"
        @goToSettings="gotToSettings"
        @restart="restartGame"/> 

        <QuizError v-if="gameState === 'error'"
        :msg="errorMessage" />
    
    </div>

</template>