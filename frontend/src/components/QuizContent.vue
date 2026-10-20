<script setup>
import {computed, ref, onMounted, watch} from "vue"
import { useRoute } from "vue-router"


const props = defineProps({
  settings: {
    type: Object,
    required: true
  },
  timer: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['finish'])
let hasEnded = false
watch(() => props.timer, (timer) => {
  if (timer <= 0) quizEnd()
})

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
let errorFirstFetch = ref(false)
const route = useRoute()
const quizType = route.params.quizType
const maxLen = props.settings.length
const infinite = maxLen === 0 ? true : false
const lengthString = infinite ? "Oändligt" : maxLen
const progressPercent = computed(() =>
    maxLen <= 0
        ? 0
        : Math.min((quizStatsData.value.totalQuestions / maxLen) * 100, 100))


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
          throw new Error(`Kunde inte hämta quizdata: ${resp.status}`)
        const data = await resp.json()
        nextQuestion.value = data


    } catch (error) {
        console.error(`Fel vid hämtning av quizdata: ${error}`)
        isLoading.value = true
        errorFirstFetch.value = true
    }


}



function presentQuestion() {
    quizData.value = nextQuestion.value
    if (quizType === "flags") {
        flagQuiz()
        showFlagQuiz.value = true
        showCaptialQuiz.value = false
    } else {
        capitalQuiz()
        showCaptialQuiz.value = true
        showFlagQuiz.value = false
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
    } else if (!infinite && quizStatsData.value.totalQuestions >= maxLen) {
        quizEnd()
    } else {
        delayNext()
    }
}

function delayNext() {
    setTimeout(async () => {
        selectedAnswer.value = null
        isChecking.value = false
        await getQuiz()
        presentQuestion()
        isLoading.value = false
    }, 3000)
}

function quizEnd() {
  if (hasEnded) return
  hasEnded = true
    setTimeout(async () => {
        let list = loadFromLocal("quizData") || [];
        list.push(quizStatsData.value);
        try {
            saveToLocal("quizData", list);
        } catch (error) {
            console.error(`Kunde inte spara lokalt: ${error}`)
        } finally {
            emit("finished", quizStatsData.value)
        }
    }, 2000)

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

async function loadFirst() {
    await getQuiz()
    presentQuestion()
}

onMounted(() => {
    loadFirst()
})

</script>
<template>

  
    <div v-if="!isLoading" class="quiz-content">
        <p>Fråga {{ quizStatsData.history.length + 1 }} av {{ lengthString }}</p>
      <div class="quiz-stats">
        <div class="quiz-stat">
          <span>Framsteg</span>

          <strong>
            {{ quizStatsData.totalQuestions }} / {{ lengthString }}
          </strong>

          <div
              v-if="!infinite"
              class="progress-track"
              role="progressbar"
              :aria-valuenow="quizStatsData.totalQuestions"
              :aria-valuemin="0"
              :aria-valuemax="maxLen"
              :aria-label="`Framsteg: ${quizStatsData.totalQuestions} av ${lengthString} frågor`"
          >
            <div
                class="progress-fill"
                :style="{ width: `${progressPercent}%` }"
            ></div>
          </div>
        </div>

        <div class="quiz-stat">
          <span>Poäng</span>

          <strong>
            {{ quizStatsData.correctAnswers }} / {{ lengthString }}
          </strong>
        </div>

        <div class="quiz-stat">
          <span>Tid kvar</span>
          <strong>{{ props.timer }} s</strong>
        </div>
      </div>
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
        <p>Laddar quiz...</p>
        <button v-if="errorFirstFetch" @click="loadFirst" class="button-error">Ladda om</button>
    </div>
</template>