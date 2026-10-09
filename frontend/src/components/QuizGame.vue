<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import "./QuizGame.css"

const route = useRoute()
let quizContent = ref(null)
let flagurl = ref(null)
let buttonChoise = ref(null)
const quizType = route.params.quizType
const quizLength = 10
let isLoading = ref(true)
let quizCount = ref(quizLength)
let correctAnswers = ref(0)

async function getQuiz() {
    try {
        let resp = await fetch("http://localhost:3000/api/random")
        if (!resp.ok)
            throw new Error(`Error fetching quiz data: ${resp.status}`)
        const data = await resp.json()

        quizContent.value = data
        buttonChoise.value = quizContent.value.countries.sort((a, b) => a.Countryname.localeCompare(b.Countryname));
        flagurl.value = data.countries[data.correctIndex].Flag
        isLoading.value = false
        console.log("DATA: ", quizContent.value)
    } catch (error) {
        console.error(`Error fetching in quizGame.vue: ${error}`)
        isLoading.value = true
    }
}

async function submit(answer) {
    if (answer === quizContent.value.countries[quizContent.value.correctIndex].Countryname) {
        correctAnswers.value++
        alert("Correct answer!")
    } else {
        alert("Wrong answer!");
    }
    if(quizCount.value > 1){
        quizCount.value--
    } else {
        alert(`Quiz finished! You got ${correctAnswers.value} out of ${quizLength} correct.`)
        quizCount.value = quizLength
        correctAnswers.value = 0
    }
    getQuiz()
}

onMounted(() => {
    getQuiz()
})
</script>

<template class="main">
    <div>
        <div v-if="!isLoading" class="quiz-content">
        <h1>Quiz Game</h1>
            
            <img class="flag-img" :src="flagurl" alt="Flag of country" width="400" height="300" />
            <div class="button-container">
                <button class="play-button" @click="submit(buttonChoise[0].Countryname)"> {{ buttonChoise[0].Countryname }}</button>
                <button class="play-button" @click="submit(buttonChoise[1].Countryname)"> {{ buttonChoise[1].Countryname }}</button>
                <button class="play-button" @click="submit(buttonChoise[2].Countryname)"> {{ buttonChoise[2].Countryname }}</button>
                <button class="play-button" @click="submit(buttonChoise[3].Countryname)"> {{ buttonChoise[3].Countryname }}</button>
            </div>
        </div>
        <div v-else>
            <p>Loading quiz content...</p>
        </div>
    </div>
</template>