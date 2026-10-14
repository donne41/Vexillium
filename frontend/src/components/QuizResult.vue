<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import "@/assets/QuizGame.css"

const route = useRoute()

const quizType = route.params.quizType
const quizLength = Number(route.query.diff) || 10;
const quizString = quizType === "capitals" ? "huvudstäder" : "flaggor"

let gameOn = ref(true)

let quizStatsData = ref({
    totalQuestions: 0,
    correctAnswers: 0,
    history: []
});

function restartGame() {
    quizStatsData.value = {
        totalQuestions: 0,
        correctAnswers: 0,
        history: []
    }
    getQuiz();
    gameOn = true
}

function loadFromLocal(name) {
    return JSON.parse(localStorage.getItem(name))
}

function saveToLocal(name, content) {
    localStorage.setItem(name, JSON.stringify(content))
}

onMounted(() => {
    
})
</script>

<template class="main">
    <div>
        <div class="result-container">
            <h2>Quizet för {{ quizString }} är slut!</h2>
            <p>Du fick {{ quizStatsData.correctAnswers }} utav {{ quizLength }}</p>
            <ol>
                <li v-for="(item, index) in quizStatsData.history" :key="index">
                    <p>Du svarade <span :class="item.isCorrect ? 'text-green' : 'text-red'"> {{ item.userAnswer
                            }}</span> rätt svar var {{ item.correctCountry }}</p>
                </li>
            </ol>
            <button @click="restartGame" class="default">Spela igen</button>
        </div>
    </div>
</template>