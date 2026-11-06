<script setup>
import { computed, ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
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
const { currentUser } = useAuth()
let hasEnded = false
watch(
  () => props.timer,
  (timer) => {
    if (timer <= 0 && isTimed) quizEnd()
  },
)
const categoryClass = (type) => {
  switch (type) {
    case 'FLAGS':
      return "Flaggor"
    case 'CAPITALS':
      return "Huvudstäder"
    case 'NEIGHBOURS':
      return "Grannländer"
    case 'POPULATION':
      return "Befolkning"
    case 'AREA':
      return "Yta"
    default:
      return null
  }
}
const lengthClass = (type) => {
  if (type === "first")
    return "Första miss"
  else if (type === "time")
    return "Tidsbegränsat"
  else
    return maxLen
}

const emit = defineEmits(['finished', 'error'])
let isLoading = ref(true)
let showFlagQuiz = ref(false)
let showCaptialQuiz = ref(false)
let showLanguageQuiz = ref(false)
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
const quizString = categoryClass(route.params.quizType.toUpperCase())
const isLanguage = quizType === "language"
const maxLen = props.settings.length
const infinite = maxLen === 'first'
const isTimed = maxLen === 'time'
const delayTime = isTimed ? 500 : 2000
const audioPlayer = ref(null)
const currentLanguage = ref(null)
const audioFile = computed(() => {
  return `/speech/${currentLanguage.value}.mp3`
})



const changeLanguage = async (lang) => {
  currentLanguage.value = lang
  await nextTick()

  if (audioPlayer.value) {
    audioPlayer.value.play().catch(error => {
      console.error("Autoplay har blockerats av webbläsaren: ", error)
    })
  }
}

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
  category: quizString,
  type: lengthClass(maxLen),
  timeStamp: new Date(),
  userId: null,
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
    if (isLanguage) split = 3
    else split = 7
  }
  if (regions.length === 1 && regions.includes(5)) {
    split = 5
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
    let url = '/api/random?category=' + quizType
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
  } else if (isLanguage) {
    languageQuiz()
    showLanguageQuiz.value = true
    showFlagQuiz.value = false
    showFlagQuiz.value = false
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
  selectedAnswer.value = null
  isChecking.value = false
}

function capitalQuiz() {
  buttonChoise.value = [...quizData.value.countries].sort(() => 0.5 - Math.random())
  capitalName.value = quizData.value.countries[quizData.value.correctIndex].Capital
}

function flagQuiz() {
  buttonChoise.value = [...quizData.value.countries].sort(() => 0.5 - Math.random())
  flagurl.value = quizData.value.countries[quizData.value.correctIndex].Flag
}


function languageQuiz() {
  const speech = quizData.value.countries[quizData.value.correctIndex].Language
  changeLanguage(speech)
  buttonChoise.value = [...quizData.value.countries].sort(() => 0.5 - Math.random())
}

function getCorrectArray() {
  let correctAnswers = []
  if (isLanguage) {
    const correctSpeech = quizData.value.countries[quizData.value.correctIndex].Language
    quizData.value.countries.forEach(c => {
      if (c.Language === correctSpeech) correctAnswers.push({ ...c })
    })
  } else {
    correctAnswers.push({ ...quizData.value.countries[quizData.value.correctIndex] })
  }
  return correctAnswers
}

function checkCorrect(options, correctArray) {
  const arrayIds = correctArray.map(c => c.CountryID)
  return arrayIds.includes(options.CountryID)
}


function submit(answer) {
  if (isChecking.value || hasEnded) return
  isChecking.value = true
  selectedAnswer.value = answer
  if (audioPlayer.value) {
    audioPlayer.value.pause()
    audioPlayer.value.currentTime = 0
  }
  const correctObj = quizData.value.countries[quizData.value.correctIndex]
  let isCorrect = false
  let correctArray = [];
  if (isLanguage || quizType === "flags" || quizType === "capitals") {
    correctArray = getCorrectArray()
    isCorrect = checkCorrect(answer, correctArray)
  } else {
    isCorrect = answer.Countryname === correctObj.Countryname
    correctArray.push(correctObj)
  }

  playAnswerSound(isCorrect)

  quizStatsData.value.totalQuestions++

  if (isCorrect) {
    quizStatsData.value.correctAnswers++
  }
  quizStatsData.value.history.push({
    userAnswer: answer,
    correctCountry: correctArray,
    correctID: correctObj.CountryID,
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
    await getQuiz()

    if (hasEnded || errorFirstFetch.value) return

    await presentQuestion()
  }, delayTime)
}

function quizEnd() {
  if (hasEnded) return
  hasEnded = true
  isChecking.value = true
  setTimeout(async () => {

    let list = loadFromLocal('quizData') || []
    quizStatsData.value.type = quizString
    quizStatsData.value.timeStamp = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })
    list.push(quizStatsData.value)
    if (list.length > 10) list = list.slice(-10)
    try {
      saveToLocal('quizData', list)
    } catch (error) {
      console.error(`Kunde inte spara lokalt: ${error}`)
    } finally {
      emit('finished', {
        ...quizStatsData.value,
        category: quizType
      })

    if (currentUser.value) {
      // spara till database
      quizStatsData.value.userId = currentUser.value.id
      fetch("http://localhost:3000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizStatsData.value),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Något gick fel vid sparandet av quizresultatet.");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Quizresultat sparat i databasen:", data);
        })
        .catch((error) => {
          console.error("Fel vid sparandet av quizresultatet till databasen:", error);
        });
    } else {
      // Använd data från Local
      let list = loadFromLocal('quizData') || []
      quizStatsData.value.type = quizString
      quizStatsData.value.timeStamp = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })
      list.push(quizStatsData.value)
      if (list.length > 10) list = list.slice(-10)
      try {
        saveToLocal('quizData', list)
      } catch (error) {
        console.error(`Kunde inte spara lokalt: ${error}`)
      }

    }
    emit('finished', quizStatsData.value)
  }, delayTime)
}

function getButtonClass(option) {
  if (!selectedAnswer.value) return ''
  let correctArray = []
  let isOptionCorrect = null
  let isSelected = false
  if (isLanguage || quizType === "flags" || quizType === "capitals") {
    correctArray = getCorrectArray()
    isOptionCorrect = checkCorrect(option, correctArray)
    isSelected = selectedAnswer.value === option
  } else {
    const correct = quizData.value.countries[quizData.value.correctIndex].Countryname
    isOptionCorrect = option.Countryname === correct
    isSelected = selectedAnswer.value === option
  }

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

        <div v-if="!infinite && !isTimed" class="progress-track" role="progressbar" :aria-valuenow="questionNumber"
          :aria-valuemin="0" :aria-valuemax="maxLen"
          :aria-label="`Framsteg: ${questionNumber} av ${lengthString} frågor`">
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
    <img v-if="showFlagQuiz" class="flag-img" :src="flagurl" alt="Flag of country" width="400" height="300" />
    <h1 v-if="showCaptialQuiz">
      Vilket land tillhör huvudstaden <span class="captialname">{{ capitalName }}</span>?
    </h1>
    <h1 v-if="quizType === 'neighbours' || quizType === 'population' || quizType === 'area'">
      {{ quizData.prompt }}
    </h1>
    <h1 v-if="showLanguageQuiz">I vilket land pratar man detta spåket? <audio ref="audioPlayer" controls autoplay
        :src="audioFile">
        <source :src="audioFile">
      </audio></h1>
    <div class="button-container">
      <button v-for="option in buttonChoise" :key="option.Countryname" :class="getButtonClass(option)"
        @click="submit(option)">
        {{ option.Countryname }}
      </button>
    </div>
  </div>
  <div v-else>
    <p>Laddar quiz...</p>
  </div>
</template>
