
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'
import './QuizRoom.css'

const availableRooms = ref([])
const inviteCode = ref('')
const guestName = ref('')
const loggedInUser = ref(null)
const selectedPublicRoom = ref(null)
const publicGuestName = ref('')
const publicRoomError = ref('')

const errorMessage = ref('')
const waitingRoomError = ref('')
const isJoining = ref(false)
const isLeaving = ref(false)
const joinedRoom = ref(null)
const roomPlayers = ref([])

let playersInterval = null
let socket = null

const guestSessionKey = 'vexillium-guest-room'

function startPlayersInterval() {
  stopPlayersInterval()

  playersInterval = setInterval(() => {
    fetchRoomPlayers()
  }, 5000)
}

async function fetchRoomPlayers() {
  if (!joinedRoom.value) return

  const roomId = joinedRoom.value.roomId

  try {
    const response = await fetch(
        `http://localhost:3000/api/rooms/${roomId}/players`,
        {
          headers: {
            'X-Guest-Token': joinedRoom.value.guestToken,
          }
        }
    )

    if (!response.ok) {
      throw new Error('Kunde inte hämta spelare.')
    }

    const data = await response.json()

    if (joinedRoom.value?.roomId === roomId) {
      roomPlayers.value = [
        ...data.accounts,
        ...data.guests
      ]
    }
  } catch (error) {
    console.error('Fel vid hämtning av spelare:', error)
  }
}

function stopPlayersInterval() {
  if (playersInterval) {
    clearInterval(playersInterval)
    playersInterval = null
  }
}

function getErrorMessage(error, fallback) {
  if (error instanceof TypeError) {
    return 'Kunde inte ansluta. Försök igen senare.'
  }

  return error?.message || fallback
}

async function leaveWaitingRoom() {
  if (!joinedRoom.value || isLeaving.value) return

  isLeaving.value = true
  waitingRoomError.value = ''

  const roomId = joinedRoom.value.roomId
  const guestToken = joinedRoom.value.guestToken

  try {
    const response = await fetch(
        `http://localhost:3000/api/rooms/${roomId}/leave`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            guestToken
          })
        }
    )

    const data = await response.json()

    if (!response.ok && response.status !== 404) {
      throw new Error(data.error || 'Kunde inte lämna rummet.')
    }

    stopPlayersInterval()
    sessionStorage.removeItem(guestSessionKey)
    joinedRoom.value = null
    roomPlayers.value = []
    errorMessage.value = ''
    waitingRoomError.value = ''

    await fetchRooms()
  } catch (error) {
    waitingRoomError.value = getErrorMessage(
        error,
        'Kunde inte lämna rummet.'
    )

    console.error('Fel vid lämnande av rum:', error)
  } finally {
    isLeaving.value = false
  }
}

async function fetchRooms() {
  try {
    const response = await fetch('http://localhost:3000/api/rooms')

    if (!response.ok) {
      throw new Error('Kunde inte hämta quizrum.')
    }

    availableRooms.value = await response.json()
  } catch (error) {
    console.error('Fel vid hämtning av quizrum:', error)
  }
}

function openPublicRoom(room) {
  publicRoomError.value = ''

  if (loggedInUser.value) {
    publicRoomError.value =
        'Anslutning för inloggade användare är inte kopplad ännu.'
    return
  }

  selectedPublicRoom.value = room
  publicGuestName.value = ''
}

function closePublicRoom() {
  if (isJoining.value) return

  selectedPublicRoom.value = null
  publicGuestName.value = ''
  publicRoomError.value = ''
}

async function joinPublicRoom() {
  if (isJoining.value || !selectedPublicRoom.value) return

  publicRoomError.value = ''

  const playerName = publicGuestName.value.trim()
  const roomId = selectedPublicRoom.value.id

  if (playerName.length < 2 || playerName.length > 50) {
    publicRoomError.value =
        'Spelarnamnet måste vara mellan 2 och 50 tecken.'
    return
  }

  isJoining.value = true

  try {
    const response = await fetch(
        `http://localhost:3000/api/rooms/${roomId}/join-public`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            guestName: playerName
          })
        }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Kunde inte gå med i rummet.')
    }

    joinedRoom.value = data
    sessionStorage.setItem(guestSessionKey, JSON.stringify(data))

    selectedPublicRoom.value = null
    publicGuestName.value = ''
    waitingRoomError.value = ''

    await fetchRoomPlayers()
    startPlayersInterval()
  } catch (error) {
    publicRoomError.value = getErrorMessage(
        error,
        'Kunde inte gå med i rummet'
    )
  } finally {
    isJoining.value = false
  }
}

async function joinRoom() {
  if (isJoining.value) return

  errorMessage.value = ''

  const code = inviteCode.value.trim().toUpperCase()

  const playerName = loggedInUser.value
      ? loggedInUser.value.username
      : guestName.value.trim()

  if (!/^[A-Z0-9]{6}$/.test(code)) {
    errorMessage.value = 'Ange en giltig inbjudningskod med 6 tecken.'
    return
  }

  if (!loggedInUser.value && (playerName.length < 2 || playerName.length > 50)) {
    errorMessage.value = 'Spelarnamnet måste vara mellan 2 och 50 tecken.'
    return
  }

  isJoining.value = true

  try {
    const roomResponse = await fetch(
        `http://localhost:3000/api/rooms/${code}`
    )

    const room = await roomResponse.json()

    if (!roomResponse.ok) {
      throw new Error(room.error || 'Kunde inte hitta quizrummet.')
    }

    if (room.isPublic) {
      throw new Error(
          'Detta är ett offentligt rum. Välj det i listan till höger.'
      )
    }

    if (room.status !== 'waiting') {
      throw new Error('Quizet har redan startat eller avslutats.')
    }

    if (loggedInUser.value) {
      throw new Error('Anslutning för inloggade användare är inte kopplad ännu.')
    }

    const response = await fetch(
        'http://localhost:3000/api/rooms/join',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inviteCode: code,
            guestName: playerName
          })
        }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Kunde inte gå med i rummet.')
    }

    joinedRoom.value = data
    sessionStorage.setItem(guestSessionKey, JSON.stringify(data))
    waitingRoomError.value = ''

    await fetchRoomPlayers()
    startPlayersInterval()
  } catch (error) {
    errorMessage.value = getErrorMessage(
        error,
        'Kunde inte gå med i rummet.'
    )
  } finally {
    isJoining.value = false
  }
}

onMounted(async () => {
  socket = io('http://localhost:3000')

  socket.on('rooms:updated', fetchRooms)

  socket.on('connect', fetchRooms)

  const savedSession = sessionStorage.getItem(guestSessionKey)

  if (!savedSession) return

  let session

  try {
    session = JSON.parse(savedSession)
  } catch (error) {
    sessionStorage.removeItem(guestSessionKey)
    console.error('Ogiltig sparad gästsession:', error)
    return
  }

  if (
      !Number.isSafeInteger(session?.roomId) ||
      session.roomId <= 0 ||
      typeof session.guestToken !== 'string' ||
      !/^[a-f0-9]{64}$/.test(session.guestToken)
  ) {
    sessionStorage.removeItem(guestSessionKey)
    return
  }

  try {
    const response = await fetch(
        `http://localhost:3000/api/rooms/${session.roomId}/validate-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            guestToken: session.guestToken
          })
        }
    )

    if (!response.ok) {
      throw new Error('Kunde inte kontrollera gästsessionen.')
    }

    const data = await response.json()

    if (!data.valid) {
      sessionStorage.removeItem(guestSessionKey)
      return
    }

    joinedRoom.value = session
    await fetchRoomPlayers()
    startPlayersInterval()
  } catch (error) {
    console.error('Kunde inte återställa gästsessionen:', error)
    errorMessage.value = 'Kunde inte återställa väntrummet. Försök ladda om sidan.'
  }
})


onUnmounted(() => {
  stopPlayersInterval()

  if (socket) {
    socket.disconnect()
    socket = null
  }
})
</script>

<template>
  <section id="quiz-rooms" class="quiz-room-section">
    <div class="quiz-room-container">

      <div class="quiz-room-heading">
        <h2>Hitta och gå med i ett quizrum</h2>

        <p>
          Bläddra bland offentliga quizrum eller gå med i ett
          privat quizrum med en inbjudningskod.
        </p>
      </div>

      <div v-if="!joinedRoom" class="quiz-room-grid">

        <div class="quiz-room-left">

          <div class="join-room-card">
            <h3>Gå med i privat quizrum</h3>

            <label for="invite-code">
              Inbjudningskod
            </label>

            <input
                id="invite-code"
                v-model="inviteCode"
                type="text"
                placeholder="Ange din inbjudningskod"
                minlength="6"
                maxlength="6"
            />

            <div v-if="!loggedInUser">
              <label for="guest-name">
                Ditt spelarnamn
              </label>

              <input
                  id="guest-name"
                  v-model="guestName"
                  type="text"
                  placeholder="Välj ett spelarnamn"
                  minlength="2"
                  maxlength="50"
              />
            </div>

            <p
                v-if="errorMessage"
                class="room-error"
                role="alert"
            >
              {{ errorMessage }}
            </p>

            <button
                class="join-room-button"
                :disabled="isJoining"
                @click="joinRoom"
            >
              {{ isJoining ? 'Ansluter...' : 'Gå med i rummet' }}
            </button>
          </div>

        </div>

        <div class="available-rooms-card">

          <div class="available-rooms-header">
            <h3>Tillgängliga quizrum</h3>
            <span>OFFENTLIGA RUM</span>
          </div>

          <div
              v-if="availableRooms.length === 0"
              class="rooms-empty"
          >
            <p>Inga quizrum att visa ännu.</p>
          </div>

          <div v-else class="rooms-list">
            <div
                v-for="room in availableRooms"
                :key="room.id"
                class="room-item"
            >
              <span>{{ room.name }}</span>

              <button
                  type="button"
                  class="public-room-join-button"
                  :disabled="isJoining"
                  @click="openPublicRoom(room)"
              >
                Gå med i quizrum
              </button>
            </div>
          </div>

          <p
              v-if="publicRoomError && !selectedPublicRoom"
              class="room-error"
              role="alert"
          >
            {{ publicRoomError }}
          </p>

        </div>

      </div>

      <div v-else class="waiting-room-card">
        <h3>Väntrum – {{ joinedRoom.roomName }}</h3>

        <p>
          Väntar på att värden ska starta quizet.
        </p>

        <h4>Spelare ({{ roomPlayers.length }})</h4>

        <div class="waiting-room-players">
          <div
              v-for="(player, index) in roomPlayers"
              :key="`${player.id}-${index}`"
              class="waiting-room-player"
          >
            {{ player.name }}
          </div>
        </div>

        <p
            v-if="waitingRoomError"
            class="room-error"
            role="alert"
        >
          {{ waitingRoomError }}
        </p>

        <button
            class="join-room-button"
            :disabled="isLeaving"
            @click="leaveWaitingRoom"
        >
          {{ isLeaving ? 'Lämnar rummet...' : 'Lämna väntrummet' }}
        </button>
      </div>

    </div>


    <div
        v-if="selectedPublicRoom"
        class="public-room-modal-overlay"
        @click.self="closePublicRoom"
    >
      <div
          class="public-room-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="public-room-modal-title"
      >
        <h3 id="public-room-modal-title">
          Gå med i {{ selectedPublicRoom.name }}
        </h3>

        <p>Välj ett spelarnamn för att gå med i quizrummet.</p>

        <label for="public-guest-name">
          Ditt spelarnamn
        </label>

        <input
            id="public-guest-name"
            v-model="publicGuestName"
            type="text"
            placeholder="Välj ett spelarnamn"
            minlength="2"
            maxlength="50"
            @keyup.enter="joinPublicRoom"
        />

        <p
            v-if="publicRoomError"
            class="room-error"
            role="alert"
        >
          {{ publicRoomError }}
        </p>

        <div class="public-room-modal-actions">
          <button
              type="button"
              :disabled="isJoining"
              @click="closePublicRoom"
          >
            Avbryt
          </button>

          <button
              type="button"
              class="join-room-button"
              :disabled="isJoining"
              @click="joinPublicRoom"
          >
            {{ isJoining ? 'Ansluter...' : 'Gå med i rummet' }}
          </button>
        </div>
      </div>
    </div>

  </section>
</template>
