<script setup>
import { ref } from 'vue'
import { useProfile } from '../composables/useProfile'
import { formatDate } from '../utils/formatDate'
import '@/assets/css/ProfileAccount.css'
import ProfileAccountEdit from './ProfileAccountEdit.vue'

const props = defineProps({
  userId: { type: Number, required: true },
})

const { getAccount } = useProfile()

const emit = defineEmits(['updated'])

const isOpen = ref(false)
const account = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')
const isEditing = ref(false)

/**
 * handleUpdated tar emot det sparade kontot från redigeringen, visar det i kortet
 * och meddelar profilsidan så att rubriken kan uppdateras.
 */
function handleUpdated(updatedAccount) {
  account.value = updatedAccount
  emit('updated', updatedAccount)
}

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

      <template v-else-if="account">
        <ProfileAccountEdit
            v-if="isEditing"
            :user-id="userId"
            :account="account"
            @updated="handleUpdated"
            @close="isEditing = false"
        />

        <template v-else>
          <dl class="profile-account-details">
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

          <button type="button" class="profile-account-toggle profile-account-edit-button" @click="isEditing = true">
            Redigera
          </button>
        </template>
      </template>
    </div>
  </section>
</template>