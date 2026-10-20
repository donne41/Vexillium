<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import './CreateRoom.css'

const props = defineProps({
  currentUser: {
    type: Object,
    default: null,
  },
  // För JWT: skicka { Authorization: `Bearer ${token}` } från auth-lösningen.
  authHeaders: {
    type: Object,
    default: () => ({})
  },
})

const roomName = ref('')
const isPublic = ref(false)
const isCreating = ref(false)
const errorMessage = ref('')
const createdRoom = ref(null)
const isDeleting = ref(false)
const deleteError = ref('')

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
    const response = await fetch('http://localhost:3000/api/rooms', {
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
          typeof data?.error === 'string'
              ? data.error
              : 'Kontrollera uppgifterna och försök igen.'

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

  const confirmed = window.confirm(
      'Vill du avbryta quizrummet? Alla deltagare tas bort från rummet.'
  )

  if (!confirmed) return

  isDeleting.value = true
  deleteError.value = ''

  try {
    const response = await fetch(
        `http://localhost:3000/api/rooms/${createdRoom.value.id}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            ...props.authHeaders,
          },
        }
    )

    if (response.status === 204 || response.status === 404) {
      resetForm()
      return
    }

    const messages = {
      400: 'Ogiltigt rums-ID.',
      401: 'Du behöver logga in för att ta bort quizrummet.',
      403: 'Bara den som skapade quizrummet får ta bort det.',
      409: 'Du kan bara avbryta ett quizrum innan quizet har startat.',
    }

    deleteError.value =
        messages[response.status] ||
        'Kunde inte ta bort quizrummet. Försök igen senare.'
  } catch (error) {
    console.error('Fel vid borttagning av quizrum:', error)
    deleteError.value =
        'Kunde inte ta bort quizrummet. Försök igen senare.'
  } finally {
    isDeleting.value = false
  }
}

function resetForm() {
  createdRoom.value = null
  roomName.value = ''
  isPublic.value = false
  errorMessage.value = ''
  deleteError.value = ''
}
</script>

<template>
  <section id="create-room" class="create-room-section">
    <div class="create-room-card">
      <h2>Skapa quizrum</h2>

      <div v-if="!currentUser">
        <p>Skapa ett konto eller logga in för att kunna skapa ett quizrum.</p>

        <div class="create-room-actions">
          <RouterLink to="/register" class="create-room-button">
            Skapa ett konto
          </RouterLink>

          <RouterLink to="/login" class="create-room-login">
            Logga in
          </RouterLink>
        </div>
      </div>

      <div v-else-if="createdRoom" role="status">
        <h3>Quizrummet har skapats!</h3>

        <p>Rumsnamn: {{ createdRoom.name }}</p>
        <p>
          {{ createdRoom.isPublic ? 'Offentligt rum' : 'Privat Rum'}}
        </p>

        <p>Inbjudningskod:</p>
        <strong class="create-room-code">
          {{ createdRoom.inviteCode }}
        </strong>

        <p>Dela koden med dem du vill bjuda in.</p>

        <p v-if="deleteError" class="create-room-error" role="alert">
          {{ deleteError }}
        </p>

        <button
          type="button"
          class="create-room-button"
          :disabled="isDeleting"
          @click="deleteRoom"
        >
          {{ isDeleting ? 'Avbryter quizrummet...' : 'Avbryt quizrum' }}
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

        <select
            id="create-room-visibility"
            v-model="isPublic"
            :disabled="isCreating"
        >
          <option :value="false">
            Privat – gå med via inbjudningskod
          </option>
          <option :value="true">
            Offentligt – syns bland tillgängliga quizrum
          </option>
        </select>

        <p v-if="errorMessage" class="create-room-error" role="alert">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          class="create-room-button"
          :disabled="isCreating"
        >
          {{ isCreating ? 'Skapar quizrum...' : 'Skapa quizrum'}}
        </button>
      </form>
    </div>
  </section>
</template>


