<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import "@/assets/QuizGame.css"

const route = useRoute()
let quizContent = ref(null)
let flagurl = ref(null)
let capitalName = ref(null)
let buttonChoise = ref(null)
const quizType = route.params.quizType
const quizLength = 2
const selectedAnswer = ref(null)
const isChecking = ref(false)
let isLoading = ref(true)
let showFlagQuiz = ref(false)
let showCaptialQuiz = ref(false)    
let quizCount = ref(quizLength)
let quizStatsData = ref({
    totalQuestions: 0,
    correctAnswers: 0,
    correctCountries: [],
    incorrectCountries: []
});

async function getQuiz() {
    try {
        let resp = await fetch("http://localhost:3000/api/random")
        if (!resp.ok)
            throw new Error(`Error fetching quiz data: ${resp.status}. Message: ${resp.statusText}`)
        const data = await resp.json()
        quizContent.value = data

        if (quizType === "flags") {
            flagQuiz()
            showFlagQuiz = true
            showCaptialQuiz = false
        } else {
            capitalQuiz()
            showCaptialQuiz = true
            showFlagQuiz = false
        }

        isLoading.value = false
    } catch (error) {
        console.error(`Error fetching in quizGame.vue: ${error}`)
        isLoading.value = true
    }
}

function capitalQuiz() {
    buttonChoise.value = quizContent.value.countries.sort((a, b) => a.Countryname.localeCompare(b.Countryname))
    capitalName = quizContent.value.countries[quizContent.value.correctIndex].Capital
}

function flagQuiz() {
    buttonChoise.value = quizContent.value.countries.sort((a, b) => a.Countryname.localeCompare(b.Countryname))
    flagurl.value = quizContent.value.countries[quizContent.value.correctIndex].Flag
}

function submit(answer) {
    if (isChecking.value) return
    isChecking.value = true
    selectedAnswer.value = answer
    const correctAnswer = quizContent.value.countries[quizContent.value.correctIndex].Countryname

    if (selectedAnswer === correctAnswer) {
        quizStatsData.value.correctAnswers++
        quizStatsData.value.correctCountries.push(answer)
        quizStatsData.value.totalQuestions++
    } else {
        quizStatsData.value.totalQuestions++
        quizStatsData.value.incorrectCountries.push(quizContent.value.countries[quizContent.value.correctIndex].Countryname)
    }
    setTimeout(async () => {
        selectedAnswer.value = null
        isChecking.value = false
        await getQuiz()
    }, 3000)
    if (quizCount.value > 1) {
        quizCount.value--
    } else {
        alert(`Quiz finished! You got ${quizStatsData.value.correctAnswers} out of ${quizLength} correct.`)
        quizCount.value = quizLength
        let list = loadFromLocal("quizData") || [];
        list.push(quizStatsData);
        saveToLocal("quizData", list);
    }
}

function getButtonClass(option) {
    if (!selectedAnswer.value) return '';
    const correctCountryname = quizContent.value.countries[quizContent.value.correctIndex].Countryname
    const isOptionCorrect = option === correctCountryname
    const isSelected = selectedAnswer.value === option

    if (isOptionCorrect) return 'correct'
    if (isSelected && !isOptionCorrect) return 'wrong'

    return 'dimmed'
}

function loadFromLocal(name) {
    return JSON.parse(localStorage.getItem(name))
}

function saveToLocal(name, content) {
    localStorage.setItem(name, JSON.stringify(content))
}

onMounted(() => {
    getQuiz()
})
</script>

<template class="main">
    <div>
        <div v-if="!isLoading" class="quiz-content">

            <img v-if="showFlagQuiz" class="flag-img" :src="flagurl" alt="Flag of country" width="400" height="300" />
            <h1 v-if="showCaptialQuiz">Vilket land tillhör huvudstaden <span class="captialname">{{ capitalName
                    }}</span>?</h1>
            <div class="button-container">
                <button v-for="option in buttonChoise" :key="option.Countryname"
                    :class="getButtonClass(option.Countryname)" @click="submit(option.Countryname)">{{
                        option.Countryname }}</button>
            </div>
        </div>
        <div v-else>
            <p>Loading quiz content...</p>
        </div>
    </div>
</template>