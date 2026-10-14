<script setup>
import './QuizRoom.css'

const availableRooms = []
</script>

<template>
  <section class="quiz-room-section">
    <div class="quiz-room-container">

      <div class="quiz-room-heading">
        <h2>Hitta och gå med i ett quizrum</h2>

        <p>
          Bläddra bland öppna quizrum eller anslut till ett privat
          quizrum med namn och lösenord.
        </p>
      </div>

      <div class="quiz-room-grid">

        <!-- Vänster sida -->
        <div class="quiz-room-left">

          <button class="browse-rooms-button">
            Bläddra bland quizrum
          </button>

          <div class="join-room-card">
            <h3>Anslut via rumsnamn och lösenord</h3>

            <label for="room-name">
              Rumsnamn
            </label>

            <input
                id="room-name"
                type="text"
                placeholder="Ange namnet på quizrummet"
            />

            <label for="room-password">
              Lösenord
            </label>

            <input
                id="room-password"
                type="password"
                placeholder="Ange lösenord om rummet är privat"
            />

            <button class="join-room-button">
              Gå med i rummet
            </button>
          </div>

        </div>

        <!-- Höger sida -->
        <div class="available-rooms-card">

          <div class="available-rooms-header">
            <h3>Tillgängliga quizrum</h3>
            <span>PUBLIC + PRIVAT</span>
          </div>

          <div
              v-if="availableRooms.length === 0"
              class="rooms-empty"
          >
            <p>Inga quizrum att visa ännu.</p>
          </div>

          <div v-else class="rooms-list">
            <div
                v-for="room in availableRooms"
                :key="room.id"
                class="room-item"
            >
              <span>{{ room.name }}</span>
              <span>{{ room.players }}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  </section>
</template>