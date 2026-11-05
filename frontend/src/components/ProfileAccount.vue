<script setup>
import { ref } from 'vue'
import { useProfile } from '../composables/useProfile'
import { formatDate } from '../utils/formatDate'
import '@/assets/css/ProfileAccount.css'

const props = defineProps({
  userId: { type: Number, required: true },
})

const { getAccount } = useProfile()

const isOpen = ref(false)
const account = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

/**
 * loadAccount hämtar kontouppgifterna (inklusive e-post) från backend.
 */
async function loadAccount() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    account.value = await getAccount(props.userId)
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}
/**
 * toggleAccount visar eller döljer kontouppgifterna. De hämtas första gången
 * de visas, eller på nytt om förra försöket misslyckades.
 */
async function toggleAccount() {
  isOpen.value = !isOpen.value
  if (isOpen.value && !account.value) {
    await loadAccount()
  }
}
</script>

<template>
  <section class="profile-account">
    <button
        type="button"
        class="profile-account-toggle"
        :aria-expanded="isOpen"
        aria-controls="profile-account-card"
        @click="toggleAccount"
    >
      {{ isOpen ? 'Dölj kontouppgifter' : 'Visa kontouppgifter' }}
    </button>

    <div v-show="isOpen" id="profile-account-card" class="profile-account-card">
      <p v-if="isLoading" class="profile-account-status">Laddar kontouppgifter…</p>

      <p v-else-if="errorMessage" class="profile-account-error" role="alert">
        {{ errorMessage }}
      </p>

      <dl v-else-if="account" class="profile-account-details">
        <div>
          <dt>Användarnamn</dt>
          <dd>{{ account.username }}</dd>
        </div>
        <div>
          <dt>E-post</dt>
          <dd>{{ account.email }}</dd>
        </div>
        <div>
          <dt>Medlem sedan</dt>
          <dd>{{ formatDate(account.created_at) }}</dd>
        </div>
        <div v-if="account.role === 'admin'">
          <dt>Roll</dt>
          <dd>Admin</dd>
        </div>
      </dl>
    </div>
  </section>
</template>