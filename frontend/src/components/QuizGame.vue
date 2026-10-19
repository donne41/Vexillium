<script setup>
import {ref, onMounted, onBeforeUnmount} from "vue"
import { useRoute } from "vue-router"
import "@/assets/QuizGame.css"
import { watch } from 'vue'

const route = useRoute()
let quizContent = ref(null)
let flagurl = ref(null)
let capitalName = ref(null)
let buttonChoise = ref(null)
const quizType = route.params.quizType
const quizLength = Number(route.query.diff) || 10;
const isChecking = ref(false)
const quizString = quizType === "capitals" ? "huvudstäder" : "flaggor"
let selectedAnswer = ref(null)
let gameOn = ref(true)
let isLoading = ref(true)
let showFlagQuiz = ref(false)
let showCaptialQuiz = ref(false)
let quizStatsData = ref({
    totalQuestions: 0,
    correctAnswers: 0,
    history: []
});




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

watch(
    () => props.timer,
    (newTimer) => {
      if (newTimer <= 0) {
        finishQuiz('time_up')
      }
    }
)



function finishQuiz(reason = 'completed') {
  if (!gameOn.value) return

  // Avsluta spelet direkt så att det inte avslutas två gånger.
  gameOn.value = false
  stopTimer()

  emit('finish', {
    ...quizStatsData.value,
    finishReason: reason,
    maxScore: quizLength
  })

  try {
    const list = loadFromLocal('quizData') || []
    list.push(quizStatsData.value)
    saveToLocal('quizData', list)
  } catch (error) {
    console.error('Error saving quiz result:', error)
  }
}

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

      if (timerInterval === null && gameOn.value) {
        startTimer()
      }
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
    const correctCountryname = quizContent.value.countries[quizContent.value.correctIndex].Countryname
    const isOptionCorrect = option === correctCountryname
    const isSelected = selectedAnswer.value === option

    if (isOptionCorrect) return 'correct'
    if (isSelected && !isOptionCorrect) return 'wrong'

    return 'dimmed'
}
function restartGame() {
  stopTimer()


  quizStatsData.value = {
    totalQuestions: 0,
    correctAnswers: 0,
    history: []
  }

  selectedAnswer.value = null
  isChecking.value = false
  gameOn.value = true

  getQuiz()
}

function loadFromLocal(name) {
    return JSON.parse(localStorage.getItem(name))
}

function saveToLocal(name, content) {
    localStorage.setItem(name, JSON.stringify(content))
}


</script>

<template class="main">


    <div v-if="gameOn">
      <QuizContent
          :settings="settings"
          :timer="timer"
          @finished="finishQuiz"
      />




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
    <div v-else>
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