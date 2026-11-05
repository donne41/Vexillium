<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useProfile } from '../composables/useProfile'
import { formatDate } from '../utils/formatDate'
import '@/assets/css/ProfileView.css'
import ProfileRecentResults from '../components/ProfileRecentResults.vue'
import ProfileCategoryStats from '../components/ProfileCategoryStats.vue'
import ProfileAchievements from '../components/ProfileAchievements.vue'
import ProfileAccount from '../components/ProfileAccount.vue'
import ProfileDeleteAccount from '../components/ProfileDeleteAccount.vue'

const route = useRoute()
const { currentUser } = useAuth()
const { getProfile } = useProfile()

const profile = ref(null)
const isLoading = ref(false)
const notFound = ref(false)
const errorMessage = ref('')
let latestRequest = 0

// Vems profil som visas: id:t i adressen (/profile/11), annars den inloggades egen (/profile).
const profileId = computed(() => route.params.id ?? currentUser.value?.id)

// Om profilen som visas tillhör den inloggade användaren (styr kontodelen).
const isOwnProfile = computed(() =>
    currentUser.value !== null
    && profile.value !== null
    && profile.value.user.id === currentUser.value.id,
)

// Admin som tittar på någon annans profil får möjlighet att radera användaren.
const isAdminViewingOther = computed(() =>
    currentUser.value?.role === 'admin'
    && profile.value !== null
    && !isOwnProfile.value,
)

/**
 * loadProfile hämtar profilen för profileId och hanterar lägena laddar,
 * användaren saknas (404/400) och övriga fel.
 */
async function loadProfile() {
  const requestNumber = ++latestRequest
  const requestedId = profileId.value
  if (!requestedId) {
    isLoading.value = false
    return
  }

  isLoading.value = true
  notFound.value = false
  errorMessage.value = ''

  try {
    const data = await getProfile(requestedId)
    if (requestNumber !== latestRequest) return
    profile.value = data
  } catch (error) {
    if (requestNumber !== latestRequest) return
    profile.value = null
    if (error.status === 404 || error.status === 400) {
      notFound.value = true
    } else {
      errorMessage.value = error.message
    }
  } finally {
    if (requestNumber === latestRequest) {
      isLoading.value = false
    }
  }
}

/**
 * handleAccountUpdated uppdaterar rubriken när användaren bytt namn, utan att
 * ladda om hela profilen (då skulle redigeringsläget stängas).
 */
function handleAccountUpdated(account) {
  profile.value.user.username = account.username
}

watch(profileId, loadProfile, { immediate: true })
</script>

<template>
  <main class="profile-page">

    <p v-if="isLoading" class="profile-status">Laddar profil…</p>

    <p v-else-if="notFound" class="profile-status">Användaren finns inte.</p>

    <p v-else-if="errorMessage" class="profile-error" role="alert">
      {{ errorMessage }}
    </p>

    <template v-else-if="profile">
      <header class="profile-header">
        <h1>
          {{ profile.user.username }}
          <span v-if="profile.user.isAdmin" class="profile-badge">Admin</span>
        </h1>
        <p class="profile-member-since">
          Medlem sedan {{ formatDate(profile.user.createdAt) }}
        </p>
      </header>

      <ProfileAccount v-if="isOwnProfile" :user-id="profile.user.id" @updated="handleAccountUpdated" />

      <div v-if="isAdminViewingOther" class="profile-admin-card">
        <ProfileDeleteAccount
            :user-id="profile.user.id"
            :username="profile.user.username"
            :is-own-account="false"
        />
      </div>

      <div class="profile-panels">
        <ProfileRecentResults :results="profile.recentResults" />
        <ProfileCategoryStats :stats="profile.categoryStats" />
        <ProfileAchievements :achievements="profile.recentAchievements" />
      </div>
    </template>

  </main>
</template>