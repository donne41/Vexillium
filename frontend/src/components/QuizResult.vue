<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import "@/assets/QuizGame.css"

const route = useRoute()

const quizType = route.params.quizType
let quizString = 'flaggor'

if (quizType === 'capitals') {
  quizString = 'huvudstäder'
} else if (quizType === 'neighbours') {
  quizString = 'grannländer'
} else if (quizType === 'population') {
  quizString = 'befolkning'
} else if (quizType === 'area') {
  quizString = 'yta'
}

const props = defineProps({
    stats: {
        type: Object,
        required: true
    },
    settings: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(["restart", "goToSettings"])


let quizStatsData = ref({
    totalQuestions: props.stats.totalQuestions,
    correctAnswers: props.stats.correctAnswers,
    history: props.stats.history
});

function restartGame() {
    quizStatsData.value = {
        totalQuestions: 0,
        correctAnswers: 0,
        history: []
    }
    emit("restart")
}

function goToSettings() {
    emit("goToSettings")
}


onMounted(() => {
    
})
</script>

<template class="main">
    <div>
        <div class="result-container">
            <h2>Quizet för {{ quizString }} är slut!</h2>
            <p>Du fick {{ quizStatsData.correctAnswers }} utav {{ props.settings.length }}</p>
            <ol>
                <li v-for="(item, index) in quizStatsData.history" :key="index">
                    <p>Du svarade <span :class="item.isCorrect ? 'text-green' : 'text-red'"> {{ item.userAnswer
                            }}</span> rätt svar var {{ item.correctCountry }}</p>
                </li>
            </ol>
            <button @click="goToSettings" class="default-blue">Inställningar</button>
            <button @click="restartGame" class="default-green">Spela igen</button>
        </div>
    </div>
</template>