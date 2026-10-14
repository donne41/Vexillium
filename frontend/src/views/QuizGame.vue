<script setup>
import { ref } from "vue"
import QuizResult from "@/components/QuizResult.vue"
import QuizSettings from "@/components/QuizSettings.vue";
import QuizContent from "@/components/QuizContent.vue";

const gameState = ref("settings")

const gameSettigns = ref(null)
const quizStats = ref(null)

const startGame = (settings) => {
    gameSettings.value = settings
    gameState.value = "playing"
}

const finishGame = (stats) => {
    quizStats.value = stats,
    gameState.value = "result"
}

const restartGame = () => {
    gameState.value = "settings"
}


</script>
<template>
    <div class = main>
        <QuizSettings v-if="gameState === 'settings'" @start="startGame" />
        <QuizContent v-if="gameState === 'playing'"
        :settings="gameSettigns"
        @finished="finishGame"/>
        <QuizResult v-if="gameState === 'result'" 
        :stats="quizStats"
        :settings="gameSettigns"
        @restart="restartGame"/>
    </div>

</template>