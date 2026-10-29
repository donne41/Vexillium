<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import '@/assets/css/QuizGame.css'

const props = defineProps({
  settings: {
    type: Object,
    required: true,
  },
  timer: {
    type: Number,
    required: true,
  },
})

let hasEnded = false
watch(
  () => props.timer,
  (timer) => {
    if (timer <= 0 && isTimed) quizEnd()
  },
)

const emit = defineEmits(['finished', 'error'])
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
const infinite = maxLen === 'first'
const isTimed = maxLen === 'time'
const delayTime = isTimed ? 500 : 2000

const lengthString = computed(() => {
  if (infinite) return 'Oändligt'
  if (isTimed) return quizStatsData.value.totalQuestions
  return maxLen
})
let questionNumber = ref(0)
const progressPercent = computed(() =>
  infinite || isTimed ? 0 : Math.min((questionNumber.value / maxLen) * 100, 100),
)

const quizStatsData = ref({
  totalQuestions: 0,
  correctAnswers: 0,
  history: [],
})

const correctSound = new Audio('/sounds/correct.mp3')
const wrongSound = new Audio('/sounds/wrong.mp3')

function playAnswerSound(isCorrect) {
  const sound = isCorrect ? correctSound : wrongSound

  sound.currentTime = 0

  sound.play().catch((error) => {
    console.warn('Kunde inte spela upp ljudet:', error)
  })
}

function getLatestFilter(regions) {
  let split = 10
  if (regions.length === 1 && regions.includes(1)) {
    split = 4
  }
  let lateHistory = []
  if (quizStatsData.value?.history.length >= split)
    lateHistory = quizStatsData.value.history.slice(split * -1).map((item) => item.correctID)
  else lateHistory = quizStatsData.value.history.map((item) => item.correctID)
  return lateHistory
}

async function getQuiz() {
  try {
    const regions = props.settings.regions.join(',')
    const answeredCountries = getLatestFilter(regions)
    let url = 'http://localhost:3000/api/random?category=' + quizType
    if (regions.length > 0) {
      url += `&regions=${regions}`
    }
    if (answeredCountries.length > 0) {
      const filterName = answeredCountries.join(',')
      url += `${url.includes('?') ? '&' : '?'}filter=${filterName}`
    }
    let resp = await fetch(url)
    if (!resp.ok) throw new Error(`Kunde inte hämta quizdata: ${resp.status}`)
    const data = await resp.json()
    if (data.length < 1) throw new Error('Databasen svarade utan data!')
    nextQuestion.value = data
  } catch (error) {
    if (error instanceof TypeError) {
      emit('error', 'Kunde inte nå servern.')
    } else {
      emit('error', 'Övrigt fel: ' + error.message)
    }
    console.error(`Fel vid hämtning av quizdata: ${error}`)
    isLoading.value = true
    errorFirstFetch.value = true
  }
}

async function presentQuestion() {
  questionNumber.value++
  quizData.value = nextQuestion.value

  if (quizType === 'flags') {
    flagQuiz()
    showFlagQuiz.value = true
    showCaptialQuiz.value = false
  } else if (quizType === 'neighbours' || quizType === 'population' || quizType === 'area') {
    buttonChoise.value = [...quizData.value.countries].sort(() => 0.5 - Math.random())
    showFlagQuiz.value = false
    showCaptialQuiz.value = false
  } else {
    capitalQuiz()
    showCaptialQuiz.value = true
    showFlagQuiz.value = false
  }
  isLoading.value = false
}

function capitalQuiz() {
  buttonChoise.value = [...quizData.value.countries].sort(() => 0.5 - Math.random())
  capitalName.value = quizData.value.countries[quizData.value.correctIndex].Capital
}

function flagQuiz() {
  buttonChoise.value = [...quizData.value.countries].sort(() => 0.5 - Math.random())
  flagurl.value = quizData.value.countries[quizData.value.correctIndex].Flag
}

function submit(answer) {
  if (isChecking.value || hasEnded) return
  isChecking.value = true
  selectedAnswer.value = answer

  const correctAnswer = quizData.value.countries[quizData.value.correctIndex]
  const isCorrect = answer === correctAnswer.Countryname

  playAnswerSound(isCorrect)

  quizStatsData.value.totalQuestions++

  if (isCorrect) {
    quizStatsData.value.correctAnswers++
  }
  quizStatsData.value.history.push({
    userAnswer: answer,
    correctCountry: correctAnswer.Countryname,
    correctID: correctAnswer.CountryID,
    isCorrect: isCorrect,
  })
  if (infinite && !isCorrect) {
    quizEnd()
  } else if (!infinite && !isTimed && quizStatsData.value.totalQuestions >= maxLen) {
    quizEnd()
  } else {
    delayNext()
  }
}

function delayNext() {
  setTimeout(async () => {
    if (hasEnded) return

    selectedAnswer.value = null
    isChecking.value = false

    await getQuiz()

    if (hasEnded || errorFirstFetch.value) return

    await presentQuestion()
    isLoading.value = false
  }, delayTime)
}

function quizEnd() {
  if (hasEnded) return
  hasEnded = true
  setTimeout(async () => {
    let list = loadFromLocal('quizData') || []
    list.push(quizStatsData.value)
    try {
      saveToLocal('quizData', list)
    } catch (error) {
      console.error(`Kunde inte spara lokalt: ${error}`)
    } finally {
      emit('finished', quizStatsData.value)
    }
  }, delayTime)
}

function getButtonClass(option) {
  if (!selectedAnswer.value) return ''
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
  await presentQuestion()
}

onMounted(() => {
  loadFirst()
})
</script>
<template>
  <div v-if="!isLoading" class="quiz-content">
    <div class="quiz-stats">
      <div class="quiz-stat">
        <span>Fråga</span>

        <strong>{{ questionNumber }}</strong>

        <div
          v-if="!infinite && !isTimed"
          class="progress-track"
          role="progressbar"
          :aria-valuenow="questionNumber"
          :aria-valuemin="0"
          :aria-valuemax="maxLen"
          :aria-label="`Framsteg: ${questionNumber} av ${lengthString} frågor`"
        >
          <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
        </div>
      </div>

      <div class="quiz-stat">
        <span>Poäng</span>

        <strong> {{ quizStatsData.correctAnswers }} / {{ lengthString }} </strong>
      </div>

      <div v-if="isTimed" class="quiz-stat">
        <span>Tid kvar</span>
        <strong>{{ props.timer }} s</strong>
      </div>
    </div>
    <img
      v-if="showFlagQuiz"
      class="flag-img"
      :src="flagurl"
      alt="Flag of country"
      width="400"
      height="300"
    />
    <h1 v-if="showCaptialQuiz">
      Vilket land tillhör huvudstaden <span class="captialname">{{ capitalName }}</span
      >?
    </h1>
    <h1 v-if="quizType === 'neighbours' || quizType === 'population' || quizType === 'area'">
      {{ quizData.prompt }}
    </h1>
    <div class="button-container">
      <button
        v-for="option in buttonChoise"
        :key="option.Countryname"
        :class="getButtonClass(option.Countryname)"
        @click="submit(option.Countryname)"
      >
        {{ option.Countryname }}
      </button>
    </div>
  </div>
  <div v-else>
    <p>Laddar quiz...</p>
  </div>
</template>
