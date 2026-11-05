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

const route = useRoute()
const { currentUser } = useAuth()
const { getProfile } = useProfile()

const profile = ref(null)
const isLoading = ref(false)
const notFound = ref(false)
const errorMessage = ref('')

// Vems profil som visas: id:t i adressen (/profile/11), annars den inloggades egen (/profile).
const profileId = computed(() => route.params.id ?? currentUser.value?.id)

/**
 * loadProfile hämtar profilen för profileId och hanterar lägena laddar,
 * användaren saknas (404/400) och övriga fel.
 */
async function loadProfile() {
  const requestedId = profileId.value
  if (!requestedId) return

  isLoading.value = true
  notFound.value = false
  errorMessage.value = ''

  try {
    const data = await getProfile(requestedId)
    if (requestedId !== profileId.value) return
    profile.value = data
  } catch (error) {
    if (requestedId !== profileId.value) return
    profile.value = null
    if (error.status === 404 || error.status === 400) {
      notFound.value = true
    } else {
      errorMessage.value = error.message
    }
  } finally {
    isLoading.value = false
  }
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

      <div class="profile-panels">
        <ProfileRecentResults :results="profile.recentResults" />
        <ProfileCategoryStats :stats="profile.categoryStats" />
        <ProfileAchievements :achievements="profile.recentAchievements" />
      </div>
    </template>

  </main>
</template>