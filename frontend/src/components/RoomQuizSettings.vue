<script setup>
const category = defineModel('category', { type: String, required: true })
const questionCount = defineModel('questionCount', { type: Number, required: true })

defineProps({
  busy: Boolean,
  restart: Boolean,
  playerCount: Number,
})

const emit = defineEmits(['start'])
</script>

<template>
  <form class="lobby-settings" @submit.prevent="!busy && playerCount >= 2 && emit('start')">
    <div>
      <h3>{{ restart ? 'Spela en gång till' : 'Välj quiz' }}</h3>

      <p>
        {{
          restart
            ? 'Behåll kategorin eller välj ett nytt quiz för gruppen.'
            : 'Inställningarna gäller för alla i rummet.'
        }}
      </p>
    </div>

    <label class="lobby-field">
      Kategori

      <select v-model="category" :disabled="busy">
        <option value="flags">Flaggor</option>
        <option value="capitals">Huvudstäder</option>
        <option value="neighbours">Grannländer</option>
        <option value="population">Befolkning</option>
        <option value="area">Yta</option>
      </select>
    </label>

    <label class="lobby-field">
      Antal frågor

      <select v-model.number="questionCount" :disabled="busy">
        <option :value="5">5 frågor</option>
        <option :value="10">10 frågor</option>
        <option :value="15">15 frågor</option>
        <option :value="20">20 frågor</option>
      </select>
    </label>

    <p v-if="playerCount < 2">Väntar på minst en deltagare till.</p>

    <button type="submit" class="lobby-start" :disabled="busy || playerCount < 2">
      {{ busy ? 'Startar...' : restart ? 'Starta nästa quiz' : 'Starta quiz för alla' }}
    </button>
  </form>
</template>
