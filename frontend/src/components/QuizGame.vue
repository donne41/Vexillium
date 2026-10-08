<script setup>
import { ref } from "vue"
const quizContent = ref(null)


</script>

<template>
  <div>
    <h1>Quiz Game</h1>
    <div v-if="quizContent">
      <p>Correct Index: {{ quizContent.correctIndex }}</p>
      <ul>
        <li v-for="(country, index) in quizContent.countries" :key="index">
          {{ country.name }} - {{ country.capital }}
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Loading quiz content...</p>
    </div>
  </div>
  </template>