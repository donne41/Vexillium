<script setup>
import { useAuth } from '../composables/useAuth'
import '@/assets/css/ProfileView.css'

const { currentUser } = useAuth()
</script>

<template>
  <main class="profile-page">
    <h1>Profil</h1>
    <p v-if="currentUser">
      Inloggad som <strong>{{ currentUser.username }}</strong>.
    </p>
    <p>Här kommer du snart att kunna se och ändra dina kontouppgifter.</p>
  </main>
</template>