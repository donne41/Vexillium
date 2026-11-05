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

const emailForm = reactive({
  email: props.account.email,
  currentPassword: '',
  error: '',
  isSaving: false,
})

const passwordForm = reactive({
  password: '',
  confirmPassword: '',
  currentPassword: '',
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

/**
 * saveEmail kontrollerar att fälten är ifyllda och att adressen är ändrad, och sparar
 * sedan den nya e-postadressen. Backend kontrollerar formatet och nuvarande lösenord.
 */
async function saveEmail() {
  const email = emailForm.email.trim()

  if (email === '' || emailForm.currentPassword === '') {
    emailForm.error = 'Fyll i ny e-post och nuvarande lösenord'
    return
  }
  if (email === props.account.email) {
    emailForm.error = 'Det är redan din e-postadress'
    return
  }

  const saved = await save(
      emailForm,
      { email, currentPassword: emailForm.currentPassword },
      'E-postadressen har sparats',
  )
  if (saved) {
    emailForm.currentPassword = ''
  }
}

/**
 * savePassword kontrollerar att alla fält är ifyllda, att de nya lösenorden matchar och
 * skiljer sig från det nuvarande, och sparar sedan det nya lösenordet.
 */
async function savePassword() {
  const { password, confirmPassword, currentPassword } = passwordForm

  if (password === '' || confirmPassword === '' || currentPassword === '') {
    passwordForm.error = 'Fyll i alla lösenordsfält'
    return
  }
  if (password !== confirmPassword) {
    passwordForm.error = 'De nya lösenorden matchar inte'
    return
  }
  if (password === currentPassword) {
    passwordForm.error = 'Det nya lösenordet måste skilja sig från det nuvarande'
    return
  }

  const saved = await save(passwordForm, { password, currentPassword }, 'Lösenordet har ändrats')
  if (saved) {
    passwordForm.password = ''
    passwordForm.confirmPassword = ''
    passwordForm.currentPassword = ''
  }
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

    <form class="profile-account-form" novalidate @submit.prevent="saveEmail">
      <h3>E-post</h3>

      <div class="form-group">
        <label for="profile-email">Ny e-post</label>
        <input
            id="profile-email"
            v-model="emailForm.email"
            type="email"
            autocomplete="email"
        />
      </div>

      <div class="form-group">
        <label for="profile-email-current-password">Nuvarande lösenord</label>
        <input
            id="profile-email-current-password"
            v-model="emailForm.currentPassword"
            type="password"
            autocomplete="current-password"
        />
      </div>

      <p v-if="emailForm.error" class="register-error" role="alert">
        {{ emailForm.error }}
      </p>

      <button type="submit" class="register-submit" :disabled="emailForm.isSaving">
        {{ emailForm.isSaving ? 'Sparar…' : 'Spara e-post' }}
      </button>
    </form>

    <form class="profile-account-form" novalidate @submit.prevent="savePassword">
      <h3>Lösenord</h3>

      <div class="form-group">
        <label for="profile-new-password">Nytt lösenord</label>
        <input
            id="profile-new-password"
            v-model="passwordForm.password"
            type="password"
            autocomplete="new-password"
            aria-describedby="profile-new-password-hint"
        />
        <p id="profile-new-password-hint" class="field-hint">Minst 8 tecken</p>
      </div>

      <div class="form-group">
        <label for="profile-confirm-password">Bekräfta nytt lösenord</label>
        <input
            id="profile-confirm-password"
            v-model="passwordForm.confirmPassword"
            type="password"
            autocomplete="new-password"
        />
      </div>

      <div class="form-group">
        <label for="profile-password-current-password">Nuvarande lösenord</label>
        <input
            id="profile-password-current-password"
            v-model="passwordForm.currentPassword"
            type="password"
            autocomplete="current-password"
        />
      </div>

      <p v-if="passwordForm.error" class="register-error" role="alert">
        {{ passwordForm.error }}
      </p>

      <button type="submit" class="register-submit" :disabled="passwordForm.isSaving">
        {{ passwordForm.isSaving ? 'Sparar…' : 'Byt lösenord' }}
      </button>
    </form>

    <button type="button" class="profile-account-toggle" @click="emit('close')">
      Klar
    </button>

  </div>
</template>