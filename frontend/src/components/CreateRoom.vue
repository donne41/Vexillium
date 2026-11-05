<script setup>
import { ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import '@/assets/css/CreateRoom.css'
import RoomGame from './RoomGame.vue'
import RoomConfirmDialog from './RoomConfirmDialog.vue'

const props = defineProps({
  currentUser: {
    type: Object,
    default: null,
  },
  // För JWT: skicka { Authorization: `Bearer ${token}` } från auth-lösningen.
  authHeaders: {
    type: Object,
    default: () => ({}),
  },
})

const roomName = ref('')
const isPublic = ref(false)
const isCreating = ref(false)
const errorMessage = ref('')
const createdRoom = ref(null)
const isDeleting = ref(false)
const deleteError = ref('')
const emit = defineEmits(['room-active'])
const gamePhase = ref('waiting')
const roomClosed = ref(false)
const closeRoomDialog = ref(null)

const hostRoomKey = 'vexillium-host-room'

watch(
  createdRoom,
  (room) => {
    emit('room-active', Boolean(room))

    if (room && props.currentUser) {
      localStorage.setItem(hostRoomKey, JSON.stringify({ userId: props.currentUser.id, room }))
    }
  },
  { immediate: true },
)

watch(
  () => props.currentUser?.id,
  (userId) => {
    if (!userId) return

    try {
      const saved = JSON.parse(localStorage.getItem(hostRoomKey) || 'null')

      if (saved?.userId === userId && Number.isSafeInteger(saved.room?.id) && saved.room.id > 0) {
        createdRoom.value = saved.room
      }
    } catch {
      localStorage.removeItem(hostRoomKey)
    }
  },
  { immediate: true },
)

async function createRoom() {
  if (isCreating.value) return

  errorMessage.value = ''

  if (!props.currentUser) {
    errorMessage.value = 'Du behöver logga in för att skapa ett quizrum.'
    return
  }

  const name = roomName.value.trim()

  if (name.length < 3 || name.length > 100) {
    errorMessage.value = 'Rumsnamnet måste vara mellan 3 och 100 tecken.'
    return
  }

  isCreating.value = true

  try {
    const response = await fetch('/api/rooms', {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...props.authHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomName: name,
        isPublic: isPublic.value,
      }),
    })

    if (response.status === 401) {
      errorMessage.value = 'Du behöver logga in för att skapa ett quizrum.'
      return
    }

    if (response.status === 400) {
      const data = await response.json().catch(() => null)

      errorMessage.value =
        typeof data?.error === 'string' ? data.error : 'Kontrollera uppgifterna och försök igen.'

      return
    }

    if (response.status !== 201) {
      errorMessage.value = 'Kunde inte skapa quizrummet. Försök igen senare.'
      return
    }

    createdRoom.value = await response.json()
  } catch (error) {
    console.error('Fel vid skapande av quizrum:', error)
    errorMessage.value = 'Kunde inte skapa quizrummet. Försök igen senare.'
  } finally {
    isCreating.value = false
  }
}

async function deleteRoom() {
  if (!createdRoom.value || isDeleting.value) return

  isDeleting.value = true
  deleteError.value = ''

  try {
    const response = await fetch(`/api/rooms/${createdRoom.value.id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        ...props.authHeaders,
      },
    })

    if (response.status === 204 || response.status === 404) {
      closeRoomDialog.value.close()
      roomClosed.value = true
      return
    }

    const messages = {
      400: 'Ogiltigt rums-ID.',
      401: 'Du behöver logga in för att ta bort quizrummet.',
      403: 'Bara den som skapade quizrummet får ta bort det.',
    }

    deleteError.value =
      messages[response.status] || 'Kunde inte ta bort quizrummet. Försök igen senare.'
  } catch (error) {
    console.error('Fel vid borttagning av quizrum:', error)
    deleteError.value = 'Kunde inte ta bort quizrummet. Försök igen senare.'
  } finally {
    isDeleting.value = false
  }
}

function clearSavedRoom() {
  localStorage.removeItem(hostRoomKey)
}

function resetForm() {
  localStorage.removeItem(hostRoomKey)

  roomClosed.value = false
  gamePhase.value = 'waiting'
  createdRoom.value = null
  roomName.value = ''
  isPublic.value = false
  errorMessage.value = ''
  deleteError.value = ''
}
</script>

<template>
  <section id="create-room" class="create-room-section" :class="{ 'room-session': createdRoom }">
    <div class="create-room-card">
      <h2 v-if="!createdRoom">Skapa quizrum</h2>

      <div v-if="!currentUser">
        <p>Skapa ett konto eller logga in för att kunna skapa ett quizrum.</p>

        <div class="create-room-actions">
          <RouterLink to="/register" class="create-room-button"> Skapa ett konto </RouterLink>

          <RouterLink to="/login" class="create-room-login"> Logga in </RouterLink>
        </div>
      </div>

      <div v-else-if="createdRoom">
        <RoomGame
          :key="createdRoom.id"
          :room-id="createdRoom.id"
          :room-name="createdRoom.name"
          :invite-code="createdRoom.isPublic ? '' : createdRoom.inviteCode"
          :room-closed="roomClosed"
          @phase="gamePhase = $event"
          @room-closed="clearSavedRoom"
          @closed="resetForm"
        />

        <p v-if="deleteError" class="create-room-error" role="alert">
          {{ deleteError }}
        </p>

        <button
          v-if="gamePhase !== 'closed'"
          type="button"
          class="create-room-button"
          :disabled="isDeleting"
          @click="closeRoomDialog.showModal()"
        >
          {{
            isDeleting
              ? 'Stänger...'
              : gamePhase === 'finished'
                ? 'Stäng quizrum'
                : 'Avbryt quizrum'
          }}
        </button>
      </div>

      <form v-else @submit.prevent="createRoom">
        <p>Skapa ett quizrum och bjud in andra spelare.</p>

        <label for="create-room-name">Rumsnamn</label>

        <input
          id="create-room-name"
          v-model="roomName"
          type="text"
          placeholder="Ange ett rumsnamn"
          minlength="3"
          maxlength="100"
          required
          :disabled="isCreating"
        />

        <label for="create-room-visibility">Vem kan hitta rummet?</label>

        <select id="create-room-visibility" v-model="isPublic" :disabled="isCreating">
          <option :value="false">Privat – gå med via inbjudningskod</option>
          <option :value="true">Offentligt – syns bland tillgängliga quizrum</option>
        </select>

        <p v-if="errorMessage" class="create-room-error" role="alert">
          {{ errorMessage }}
        </p>

        <button type="submit" class="create-room-button" :disabled="isCreating">
          {{ isCreating ? 'Skapar quizrum...' : 'Skapa quizrum' }}
        </button>
      </form>
    </div>

    <RoomConfirmDialog
      ref="closeRoomDialog"
      label="Avsluta sessionen"
      title="Vill du avsluta quizrummet?"
      description="Rummet stängs för alla deltagare och ni kan inte starta fler quiz i det här rummet."
      :error="deleteError"
      :busy="isDeleting"
      cancel-text="Fortsätt spela"
      :confirm-text="isDeleting ? 'Avslutar...' : 'Avsluta quizrum'"
      @open="deleteError = ''"
      @confirm="deleteRoom"
    />
  </section>
</template>
