<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProfile } from '../composables/useProfile'
import { useToast } from '../composables/useToast'
import '@/assets/css/RegisterView.css'
import '@/assets/css/ProfileAccount.css'

const props = defineProps({
  userId: { type: Number, required: true },
  username: { type: String, required: true },
  isOwnAccount: { type: Boolean, required: true },
})

const router = useRouter()
const { deleteAccount } = useProfile()
const { showToast } = useToast()

const isConfirming = ref(false)
const password = ref('')
const errorMessage = ref('')
const isDeleting = ref(false)

/**
 * cancel stänger bekräftelsen och tömmer lösenordsfältet.
 */
function cancel() {
  isConfirming.value = false
  password.value = ''
  errorMessage.value = ''
}

/**
 * handleDelete raderar kontot efter lösenordsbekräftelse (den inloggades eget lösenord)
 * och skickar sedan användaren till startsidan med ett meddelande.
 */
async function handleDelete() {
  if (isDeleting.value) return

  errorMessage.value = ''
  if (password.value === '') {
    errorMessage.value = 'Ange ditt lösenord för att bekräfta'
    return
  }

  isDeleting.value = true
  try {
    await deleteAccount(props.userId, password.value)
    showToast(props.isOwnAccount
        ? 'Ditt konto har raderats'
        : `Användaren ${props.username} har raderats`)
    router.replace({ name: 'home' })
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <section class="profile-delete">
    <h3>{{ isOwnAccount ? 'Radera konto' : 'Radera användare' }}</h3>

    <p class="profile-delete-warning">
      {{ isOwnAccount ? 'Ditt konto' : `Kontot ${username}` }} raderas permanent,
      tillsammans med alla quizresultat och prestationer. Det går inte att ångra.
    </p>

    <button
        v-if="!isConfirming"
        type="button"
        class="profile-delete-button"
        @click="isConfirming = true"
    >
      {{ isOwnAccount ? 'Radera mitt konto' : 'Radera användaren' }}
    </button>

    <form v-else novalidate @submit.prevent="handleDelete">
      <div class="form-group">
        <label for="profile-delete-password">
          {{ isOwnAccount ? 'Ditt lösenord' : 'Ditt administratörslösenord' }}
        </label>
        <input
            id="profile-delete-password"
            v-model="password"
            type="password"
            autocomplete="current-password"
        />
      </div>

      <p v-if="errorMessage" class="register-error" role="alert">
        {{ errorMessage }}
      </p>

      <div class="profile-delete-actions">
        <button type="submit" class="profile-delete-button" :disabled="isDeleting">
          {{ isDeleting ? 'Raderar…' : 'Radera permanent' }}
        </button>
        <button type="button" class="profile-account-toggle" @click="cancel">
          Avbryt
        </button>
      </div>
    </form>
  </section>
</template>