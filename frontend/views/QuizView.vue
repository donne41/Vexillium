<script></script>


<template>
  <body>
  <main class="quiz-page">

    <header class="quiz-header">
      <div class="quiz-stat">
        <span>Progress</span>
        <strong>—</strong>
      </div>

      <div class="quiz-stat">
        <span>Streak</span>
        <strong>—</strong>
      </div>

      <div class="quiz-stat">
        <span>Score</span>
        <strong>—</strong>
      </div>
    </header>

    <section class="question-card">

      <div class="timer">
        ⏱ 00:30
      </div>
      <div class="question-div">
        <h1>Question</h1>

      </div>

      <div class="flag">
        🇸🇪
      </div>


      <div class="answer-options">
        <button class="btn-answer">Answer option</button>
        <button class="btn-answer">Answer option</button>
      </div>
      <div class="answer-options">
        <button class="btn-answer">Answer option</button>
        <button class="btn-answer">Answer option</button>
      </div>

    </section>

    <div class="leave-quiz-div">
      <button class="leave-quiz">
        Leave Quiz
      </button>
    </div>

  </main>
  </body>
</template>

<style scoped>

:root {
  --background: #15181C;
  --section: #1A1F26;
  --card: #1E222A;
  --border: #2F3643;
  --teal: #00B8C8;
  --green: #4CAF50;
  --text: #FFFFFF;
  --muted: #939EA9;
}

body {
  font-family: Arial, sans-serif;
  background-color: var(--background);
  color: var(--text);
  margin: 0;
  padding: 0;
}

.question-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.question-top h1 {
  margin: 0;
}


.timer {
  display:flex;
  font-size:25px;
  align-items: center;
  justify-content: center;
  margin-top:10px;
}

.flag {
  text-align: center;
  font-size: 5rem;
  margin-bottom: 2rem;
}

.answer-options{
  display:flex;
  align-items: center;
  justify-content: center;
}


.question-div{
  display:flex;
  align-items: center;
  justify-content: center;
}

button{
  border:none;
  border-radius:5px;
  font-size:25px;
  margin:10px;
}

.leave-quiz-div{
  position: absolute;
  bottom: 10px;
  width: 50%;

}

.quiz-header {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 2rem;
}

.quiz-stat {
  background-color: var(--section);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
}

.quiz-stat span {
  display: block;
  color: var(--muted);
  margin-bottom: 0.4rem;
}

.quiz-stat strong {
  font-size: 1.4rem;
}

.leave-quiz-div {
  width: 100%;
  max-width: 700px;
  margin-top: 8rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: flex-end;
}

.leave-quiz {
  padding: 0.6rem 1rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background-color: transparent;
  color: var(--muted);
  font-size: 0.9rem;
  cursor: pointer;
}

.leave-quiz:hover {
  color: var(--text);
  border-color: var(--muted);
}

@media (max-width: 600px) {
  .quiz-header {
    grid-template-columns: 1fr;
  }

  .question-card {
    padding: 1.5rem;
    margin-top: 2rem;
  }

  .question-div h1 {
    font-size: 1.5rem;
  }

  .leave-quiz-div {
    margin-top: 4rem;
  }
}


</style>