<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'
import { useRouter } from 'vue-router'
import RoomQuizSettings from './RoomQuizSettings.vue'
import '@/assets/css/QuizGame.css'
import '@/assets/css/RoomLobby.css'
import globe from '@/assets/images/globe.png'
import vexilliumOverlay from '@/assets/images/vexillium-overlay.png'

const props = defineProps({
  roomId: {
    type: Number,
    required: true,
  },
  roomName: {
    type: String,
    default: '',
  },
  inviteCode: {
    type: String,
    default: '',
  },
  roomClosed: {
    type: Boolean,
    default: false,
  },
  guestToken: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['closed', 'phase', 'room-closed'])
const router = useRouter()
const state = ref(null)
const clock = ref(Date.now())
const receivedAt = ref(Date.now())

watch(
  state,
  () => {
    receivedAt.value = Date.now()
  },
  { flush: 'sync' },
)
watch(
  () => state.value?.phase,
  (phase) => {
    if (phase) {
      emit('phase', phase)
    }
  },
)
const category = ref('flags')
const questionCount = ref(5)
const errorMessage = ref('')
const busy = ref(false)

let interval = null
let socket = null
let active = false
let starting = false
let loading = false
let requestNumber = 0

const secondsLeft = computed(() => {
  if (!state.value?.deadline) return 0

  const elapsed = Math.max(0, clock.value - receivedAt.value)
  const remaining = state.value.deadline - state.value.serverTime - elapsed

  return Math.max(0, Math.ceil(remaining / 1000))
})

async function request(path = '', body) {
  const headers = {}

  if (props.guestToken) {
    headers['X-Guest-Token'] = props.guestToken
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch('http://localhost:3000/api/rooms/' + props.roomId + '/game' + path, {
    method: body === undefined ? 'GET' : 'POST',
    credentials: 'include',
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(path === '/start' ? 45000 : 15000),
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.error || 'Kunde inte hämta spelet.')

    error.status = response.status
    throw error
  }

  return data
}

async function refresh() {
  if (!active || loading || (busy.value && !starting)) return

  loading = true
  const number = ++requestNumber

  try {
    const data = await request()

    if (active && number === requestNumber) {
      state.value = data
      errorMessage.value = ''
    }
  } catch (error) {
    if (active && number === requestNumber) {
      if (error.status === 404) {
        markRoomClosed()
        return
      }

      errorMessage.value = error.message
    }
  } finally {
    loading = false
  }
}

async function send(path, body) {
  if (busy.value) return

  busy.value = true
  errorMessage.value = ''

  const number = ++requestNumber

  try {
    const data = await request(path, body)

    if (active && number === requestNumber) {
      state.value = data
    }
  } catch (error) {
    if (active) {
      if (error.status === 404) {
        markRoomClosed()
        return
      }

      errorMessage.value = error.message
    }
  } finally {
    busy.value = false
  }
}

function markRoomClosed() {
  if (state.value?.phase === 'closed') return

  active = false
  requestNumber++

  clearInterval(interval)
  socket?.disconnect()

  state.value = {
    ...state.value,
    phase: 'closed',
    deadline: null,
    scores: state.value?.scores || [],
  }

  errorMessage.value = ''
  emit('room-closed')
}

function goHome() {
  emit('closed')
  router.push('/')
}

function getButtonClass(index) {
  if (state.value.phase !== 'reveal') return ''

  if (index === state.value.correctIndex) {
    return 'correct'
  }

  if (index === state.value.myAnswer) {
    return 'wrong'
  }

  return 'dimmed'
}

async function startGame() {
  starting = true
  await send('/start', {
    category: category.value,
    count: questionCount.value,
  })
  starting = false
}

function answer(index) {
  send('/answer', {
    questionIndex: state.value.questionIndex,
    choice: index,
    roundId: state.value.roundId,
  })
}

watch(
  () => props.roomClosed,
  (closed) => {
    if (closed) {
      markRoomClosed()
    }
  },
)

onMounted(() => {
  if (props.roomClosed) {
    markRoomClosed()
    return
  }

  active = true

  refresh()

  interval = setInterval(() => {
    clock.value = Date.now()
    refresh()
  }, 1000)

  socket = io('http://localhost:3000')
  socket.on('rooms:updated', refresh)
})

onUnmounted(() => {
  active = false

  clearInterval(interval)
  socket?.disconnect()
})
</script>

<template>
  <div class="room-game">
    <dialog
      :open="state?.phase === 'preparing'"
      class="room-close-dialog room-countdown"
      aria-label="Nedräkning till quizstart"
    >
      <h2>Quizet börjar om {{ secondsLeft }} sekunder</h2>
      <p>Fler spelare kan gå med tills quizet börjar.</p>
    </dialog>
    <p v-if="errorMessage" role="alert">
      {{ errorMessage }}
    </p>

    <p v-if="!state">Laddar spelet...</p>

    <div v-else-if="state.phase === 'waiting' || state.phase === 'preparing'" class="room-lobby">
      <header class="lobby-header">
        <div>
          <span class="lobby-status">Väntrum</span>

          <h2>{{ roomName }}</h2>

          <p v-if="state.isHost">Samla dina vänner och välj vilket quiz ni ska spela.</p>

          <p v-else>Du är med! Quizet startar när värden är redo.</p>

          <div v-if="state.isHost && inviteCode" class="lobby-code">
            <span>Inbjudningskod</span>
            <strong>{{ inviteCode }}</strong>
          </div>
        </div>

        <div class="lobby-logo">
          <img :src="globe" alt="" class="lobby-globe" />

          <img :src="vexilliumOverlay" alt="Vexillium" class="lobby-overlay" />
        </div>
      </header>

      <div class="lobby-columns">
        <section class="lobby-card">
          <div class="lobby-card-heading">
            <h3>Deltagare</h3>
            <span class="lobby-count">{{ state.players.length }}</span>
          </div>

          <p>Alla här spelar tillsammans.</p>

          <ul class="lobby-players">
            <li v-for="(player, index) in state.players" :key="index">
              <span class="lobby-avatar" aria-hidden="true">
                {{ player.name.charAt(0).toUpperCase() }}
              </span>

              <span class="lobby-player-name">{{ player.name }}</span>

              <span v-if="player.isHost" class="lobby-host">Värd</span>
            </li>
          </ul>
        </section>

        <section class="lobby-card">
          <template v-if="state.phase === 'preparing'">
            <span class="lobby-status">Snart dags</span>
            <h3>Förbereder quizet...</h3>
            <p>Gör dig redo! Spelet startar strax för alla deltagare.</p>
          </template>

          <RoomQuizSettings
            v-else-if="state.isHost"
            v-model:category="category"
            v-model:question-count="questionCount"
            :busy="busy"
            :player-count="state.players.length"
            @start="startGame"
          />

          <div v-else class="lobby-waiting" role="status">
            <span class="lobby-status">Du är redo</span>

            <h3>Väntar på värden<span class="waiting-dots" aria-hidden="true"></span></h3>

            <p>
              Värden väljer kategori och antal frågor. Du kommer automatiskt in i spelet när quizet
              startar.
            </p>
          </div>
        </section>
      </div>
    </div>

    <div v-else-if="state.phase === 'playing' || state.phase === 'reveal'" class="quiz-content">
      <div class="quiz-stats">
        <div class="quiz-stat">
          <span>Fråga</span>

          <strong> {{ state.questionNumber }} / {{ state.totalQuestions }} </strong>

          <div class="progress-track">
            <div
              class="progress-fill"
              :style="{
                width: (state.questionNumber / state.totalQuestions) * 100 + '%',
              }"
            ></div>
          </div>
        </div>

        <div class="quiz-stat">
          <span>Poäng</span>

          <strong> {{ state.myScore }} / {{ state.totalQuestions }} </strong>
        </div>

        <div class="quiz-stat">
          <span>Tid kvar</span>
          <strong>{{ secondsLeft }} s</strong>
        </div>
      </div>

      <img
        v-if="state.category === 'flags'"
        class="flag-img"
        :src="state.question.image"
        alt="Flaggan du ska identifiera"
        width="400"
        height="300"
      />

      <h1 v-if="state.category === 'capitals'">
        Vilket land tillhör huvudstaden
        <span class="captialname"> {{ state.question.capital }} </span>?
      </h1>

      <h1 v-else-if="state.category !== 'flags'">
        {{ state.question.prompt }}
      </h1>

      <div class="button-container">
        <button
          v-for="(option, index) in state.question.options"
          :key="index"
          type="button"
          :class="getButtonClass(index)"
          :aria-pressed="state.myAnswer === index"
          :disabled="busy || state.phase !== 'playing' || state.myAnswer !== null"
          @click="answer(index)"
        >
          {{ option }}
        </button>
      </div>

      <p v-if="state.phase === 'playing'">
        {{ state.answeredCount }}
        av {{ state.playerCount }} har svarat.
      </p>

      <p v-if="state.phase === 'playing' && state.myAnswer !== null">Ditt svar är sparat.</p>

      <p v-if="state.phase === 'reveal'">
        Rätt svar: {{ state.question.options[state.correctIndex] }}. Nästa fråga kommer automatiskt.
      </p>
    </div>

    <div
      v-else-if="state.phase === 'finished' || state.phase === 'closed'"
      class="room-lobby room-results"
    >
      <header class="lobby-header">
        <div>
          <span class="lobby-status">
            {{ state.phase === 'closed' ? 'Rummet är stängt' : 'Resultat' }}
          </span>

          <h2>
            {{ state.phase === 'closed' ? 'Quizrummet har avslutats' : 'Bra spelat!' }}
          </h2>

          <p>
            {{
              state.phase === 'closed'
                ? 'Värden har avslutat quizrummet.'
                : 'Quizet är slut. Här ser du deltagarnas resultat.'
            }}
          </p>
        </div>

        <div class="lobby-logo">
          <img :src="globe" alt="" class="lobby-globe" />

          <img :src="vexilliumOverlay" alt="Vexillium" class="lobby-overlay" />
        </div>
      </header>

      <div class="lobby-columns">
        <section class="lobby-card">
          <h3>
            {{ state.phase === 'closed' ? 'Senast visade resultat' : 'Resultatlista' }}
          </h3>

          <ol v-if="state.scores && state.scores.length" class="results-list">
            <li v-for="(player, index) in state.scores" :key="index">
              <span class="results-position" aria-hidden="true">
                {{ index + 1 }}
              </span>

              <span class="results-name">{{ player.name }}</span>

              <span class="results-score"> {{ player.score }} poäng </span>
            </li>
          </ol>

          <p v-else>Det finns inget resultat att visa ännu.</p>
        </section>

        <section class="lobby-card">
          <div v-if="state.phase === 'closed'" class="results-message">
            <h3>Tack för att du spelade!</h3>

            <p>Gå tillbaka till startsidan för att spela igen eller hitta ett annat quizrum.</p>

            <button type="button" class="lobby-start" @click="goHome">Gå till startsidan</button>
          </div>

          <RoomQuizSettings
            v-else-if="state.isHost"
            v-model:category="category"
            v-model:question-count="questionCount"
            :busy="busy"
            :player-count="state.playerCount"
            restart
            @start="startGame"
          />

          <div v-else class="results-message" role="status">
            <span class="lobby-status">Nästa omgång</span>

            <h3>Redo för ett nytt quiz?</h3>

            <p>
              Väntar på att värden ska starta ett nytt quiz. Du följer automatiskt med när nästa
              omgång börjar.
            </p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>