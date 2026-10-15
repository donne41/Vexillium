<script setup>
import { ref } from "vue"
import QuizResult from "@/components/QuizResult.vue"
import QuizSettings from "@/components/QuizSettings.vue";
import QuizContent from "@/components/QuizContent.vue";

const gameState = ref("settings")

const gameSettings = ref(null)
const quizStats = ref(null)

const startGame = (settings) => {
    console.log(`Settings: ${settings.length} regions ${settings.regions}`)
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


</script>
<template>
    <div class = main>
        <QuizSettings v-if="gameState === 'settings'" @start="startGame" />
         
        <QuizContent v-if="gameState === 'playing'"
        :settings="gameSettings"
        @finished="finishGame"/>
        
        <QuizResult v-if="gameState === 'result'" 
        :stats="quizStats"
        :settings="gameSettings"
        @goToSettings="gotToSettings"
        @restart="restartGame"/> 
    
    </div>

</template>