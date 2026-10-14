<script setup>
import HeroSection from '../components/HeroSection.vue'
import QuizCategories from '../components/QuizCategories.vue'
import RecentGames from '../components/RecentGames.vue'
import Leaderboard from '../components/Leaderboard.vue'
import QuizRoom from '../components/QuizRoom.vue'
</script>

<template>
  <main>

    <!-- Översta delen av startsidan -->
    <HeroSection />

    <!-- Våra sex quizkategorier -->
    <QuizCategories />

    <!-- Senaste spel och topplistan -->
    <div class="homepage-stats">
      <RecentGames />
      <Leaderboard />
    </div>

    <QuizRoom />

  </main>
</template>

<style scoped>
.homepage-stats {
  max-width: 1364px;
  margin: 0 auto;
  padding: 70px 32px;

  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

@media (max-width: 700px) {
  .homepage-stats {
    grid-template-columns: 1fr;
    padding: 48px 20px;
    gap: 20px;
  }
}
</style>