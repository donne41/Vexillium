<script setup>
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import QuizCategories from './components/QuizCategories.vue'
import RecentGames from './components/RecentGames.vue'
import Leaderboard from './components/Leaderboard.vue'
import QuizRoom from './components/QuizRoom.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="app">

    <Navbar />

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

      <!-- Quizrum -->
      <QuizRoom />

    </main>

    <!-- Footer -->
    <Footer />

  </div>
</template>

<style scoped>
/* Gemensam layout för de två sektionerna */

.homepage-stats {
  max-width: 1364px;
  margin: 0 auto;
  padding: 70px 32px;

  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

/* Mobil */

@media (max-width: 700px) {
  .homepage-stats {
    grid-template-columns: 1fr;
    padding: 48px 20px;
    gap: 20px;
  }
}
</style>