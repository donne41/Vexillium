<script setup>
import { ref } from "vue"

let isLoading = ref(true)
let showFlagQuiz = ref(false)
let showCaptialQuiz = ref(false)
let flagurl = ref(null)
let capitalName = ref(null)
let buttonChoise = ref(null)
let selectedAnswer = ref(null)
const isChecking = ref(false)
let quizData = ref(null)


async function getQuiz() {
    try {
        let resp = await fetch("http://localhost:3000/api/random")
        if (!resp.ok)
            throw new Error(`Error fetching quiz data: ${resp.status}. Message: ${resp.statusText}`)
        const data = await resp.json()
        quizData.value = data

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
    buttonChoise.value = quizData.value.countries.sort((a, b) => a.Countryname.localeCompare(b.Countryname))
    capitalName = quizData.value.countries[quizData.value.correctIndex].Capital
}

function flagQuiz() {
    buttonChoise.value = quizData.value.countries.sort((a, b) => a.Countryname.localeCompare(b.Countryname))
    flagurl.value = quizData.value.countries[quizData.value.correctIndex].Flag
}

function submit(answer) {
    if (isChecking.value) return
    isChecking.value = true
    selectedAnswer.value = answer
    const correctAnswer = quizData.value.countries[quizData.value.correctIndex].Countryname
    const isCorrect = (answer === correctAnswer)
    quizStatsData.value.totalQuestions++;
    if (selectedAnswer.value === correctAnswer) {
        quizStatsData.value.correctAnswers++
    }
    quizStatsData.value.history.push({
        userAnswer: answer,
        correctCountry: correctAnswer,
        isCorrect: isCorrect
    })
    setTimeout(async () => {
        selectedAnswer.value = null
        isChecking.value = false
        if (quizStatsData.value.totalQuestions >= quizLength) {
            let list = loadFromLocal("quizData") || [];
            list.push(quizStatsData.value);
            try {
                saveToLocal("quizData", list);
            } catch (error) {
                console.error(`Error saving to local: ${error}`)
            } finally {
                gameOn = false
            }
        } else {
            gameOn = true
            await getQuiz()
        }
    }, 3000)
}

function getButtonClass(option) {
    if (!selectedAnswer.value) return '';
    const correctCountryname = quizData.value.countries[quizData.value.correctIndex].Countryname
    const isOptionCorrect = option === correctCountryname
    const isSelected = selectedAnswer.value === option

    if (isOptionCorrect) return 'correct'
    if (isSelected && !isOptionCorrect) return 'wrong'

    return 'dimmed'
}

</script>

<template>
    <div v-if="!isLoading" class="quiz-content">

        <img v-if="showFlagQuiz" class="flag-img" :src="flagurl" alt="Flag of country" width="400" height="300" />
        <h1 v-if="showCaptialQuiz">Vilket land tillhör huvudstaden <span class="captialname">{{ capitalName
        }}</span>?</h1>
        <div class="button-container">
            <button v-for="option in buttonChoise" :key="option.Countryname" :class="getButtonClass(option.Countryname)"
                @click="submit(option.Countryname)">{{
                    option.Countryname }}</button>
        </div>
    </div>
    <div v-else>
        <p>Loading quiz content...</p>
    </div>
</template>