<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"

const props = defineProps({
    settings: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(["finished"])
let isLoading = ref(true)
let showFlagQuiz = ref(false)
let showCaptialQuiz = ref(false)
let flagurl = ref(null)
let capitalName = ref(null)
let buttonChoise = ref(null)
let selectedAnswer = ref(null)
const isChecking = ref(false)
let quizData = ref(null)
let nextQuestion = ref(null)
const route = useRoute()
const quizType = route.params.quizType
const maxLen = props.settings.length
const infinite = maxLen === 0 ? true : false
const lengthString = infinite ? "Oändligt" : maxLen

const quizStatsData = ref({
    totalQuestions: 0,
    correctAnswers: 0,
    history: []
})



async function getQuiz() {
    try {
        const regions = props.settings.regions.join(',');
        let url = "http://localhost:3000/api/random"
        if (regions.length > 0) {
            url += `?regions=${regions}`
        }
        let resp = await fetch(url)
        if (!resp.ok)
            throw new Error(`Error fetching quiz data: ${resp.status}. Message: ${resp.statusText}`)
        const data = await resp.json()
        nextQuestion.value = data
    } catch (error) {
        console.error(`Error fetching in quizGame.vue: ${error}`)
        isLoading.value = true
    }
}

function presentQuestion() {
    quizData.value = nextQuestion.value
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

    if (isCorrect) {
        quizStatsData.value.correctAnswers++
    }
    quizStatsData.value.history.push({
        userAnswer: answer,
        correctCountry: correctAnswer,
        isCorrect: isCorrect
    })
    if (infinite && !isCorrect) {
        quizEnd()
    } else if(!infinite && quizStatsData.value.totalQuestions >= maxLen) {
        quizEnd()
    } else {
        delayNext()
    }
}

function delayNext() {
    getQuiz();
    setTimeout(async () => {
        selectedAnswer.value = null
        isChecking.value = false

        presentQuestion()
        isLoading.value = false
    }, 3000)
}

function quizEnd() {
    let list = loadFromLocal("quizData") || [];
    list.push(quizStatsData.value);
    try {
        saveToLocal("quizData", list);
    } catch (error) {
        console.error(`Error saving to local: ${error}`)
    }
    emit("finished", quizStatsData.value)
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

function loadFromLocal(name) {
    return JSON.parse(localStorage.getItem(name))
}

function saveToLocal(name, content) {
    localStorage.setItem(name, JSON.stringify(content))
}

async function loadNext() {
    await getQuiz()
    presentQuestion()
}

onMounted(() => {
    loadNext()
})

</script>

<template>
    <div v-if="!isLoading" class="quiz-content">
        <p>Fråga {{ totalQuestions + 1 }} av {{ lengthString }}</p>
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