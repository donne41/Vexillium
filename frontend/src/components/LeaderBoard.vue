<script>

</script>


<template>


  <body>
  <div class="leaderboard">
    <div class="leaderboard-header">Vexillium Leaderboard🌍 </div>
    <table>
      <thead>
      <tr>
        <th>Rank</th>
        <th>Username</th>
        <th>Score</th>
        <th>Wins</th>
        <th>Losses</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td class="rank">1</td>
        <td>User</td>
        <td>100</td>
        <td>10</td>
        <td>0</td>
      </tr>
      <tr>
        <td class="rank">2</td>
        <td>User 2</td>
        <td>50</td>
        <td>20</td>
        <td>2</td>
      </tr>
      </tbody>
    </table>

  </div>
  </body>


</template>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

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

body{

  background-color: var(--background);
  color: var(--text);
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

}

::selection {
  background-color: var(--teal);
  color: var(--text);
}

.leaderboard {
  width: 100%;
  max-width: 600px;
  background-color: var(--section);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.leaderboard-header{
  background-color: var(--card);
  padding: 20px;
  text-align: center;
  color:white;
  font-size:1.5rem;
  font-weight:600;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

tr:nth-child(even) {
  background-color: var(--card);
}

tr:hover {
  background-color: var(--border);
}

.rank {
  font-weight: bold;
}

table {
  width: 100%;
  border-collapse: collapse;
}

@media (max-width: 600px) {
  .leaderboard {
    width: 95%;
  }

  th,
  td {
    padding: 8px;
    font-size: 0.9rem;
  }
}
</style>