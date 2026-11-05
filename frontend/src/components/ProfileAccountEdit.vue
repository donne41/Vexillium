<script setup>
import { reactive } from 'vue'
import { useProfile } from '../composables/useProfile'
import { useToast } from '../composables/useToast'
import '@/assets/css/RegisterView.css'
import '@/assets/css/ProfileAccount.css'

const props = defineProps({
  userId: { type: Number, required: true },
  account: { type: Object, required: true },
})

const emit = defineEmits(['updated', 'close'])

const { updateAccount } = useProfile()
const { showToast } = useToast()

const usernameForm = reactive({
  username: props.account.username,
  error: '',
  isSaving: false,
})

/**
 * save skickar ändringarna till backend och visar en toast när det lyckas. Ett fel
 * hamnar i formulärets egen error. Returnerar true om sparandet lyckades.
 */
async function save(form, changes, successMessage) {
  if (form.isSaving) return false

  form.error = ''
  form.isSaving = true
  try {
    const account = await updateAccount(props.userId, changes)
    emit('updated', account)
    showToast(successMessage)
    return true
  } catch (error) {
    form.error = error.message
    return false
  } finally {
    form.isSaving = false
  }
}

/**
 * saveUsername kontrollerar att fältet är ifyllt och ändrat, och sparar sedan det nya
 * användarnamnet. Övrig validering (längd, @, upptaget) sköts av backend.
 */
async function saveUsername() {
  const username = usernameForm.username.trim()

  if (username === '') {
    usernameForm.error = 'Ange ett användarnamn'
    return
  }
  if (username === props.account.username) {
    usernameForm.error = 'Det är redan ditt användarnamn'
    return
  }

  await save(usernameForm, { username }, 'Användarnamnet har sparats')
}
</script>

<template>
  <div class="profile-account-edit">

    <form class="profile-account-form" novalidate @submit.prevent="saveUsername">
      <h3>Användarnamn</h3>

      <div class="form-group">
        <label for="profile-username">Nytt användarnamn</label>
        <input
            id="profile-username"
            v-model="usernameForm.username"
            type="text"
            autocomplete="username"
            aria-describedby="profile-username-hint"
        />
        <p id="profile-username-hint" class="field-hint">3–50 tecken, inte @</p>
      </div>

      <p v-if="usernameForm.error" class="register-error" role="alert">
        {{ usernameForm.error }}
      </p>

      <button type="submit" class="register-submit" :disabled="usernameForm.isSaving">
        {{ usernameForm.isSaving ? 'Sparar…' : 'Spara användarnamn' }}
      </button>
    </form>

    <!-- E-post och lösenord läggs till i nästa steg -->

    <button type="button" class="profile-account-toggle" @click="emit('close')">
      Klar
    </button>

  </div>
</template>