<script setup>
import { ref, onMounted } from "vue"
const selectedLength = ref(10)
const selectedRegions = ref([])

const emit = defineEmits(["start", "error"])

const setLength = (len) => {
    selectedLength.value = len
}
const handleStart = () => {
    if (selectedRegions.value.length === 0) {
        regions.value.entries(element => selectedRegions.value.push(element)
        );
    }
    emit("start", {
        length: selectedLength.value,
        regions: selectedRegions.value
    })
}

const toggleRegion = (region) => {
    const index = selectedRegions.value.indexOf(region)

    if (index === -1) {
        selectedRegions.value.push(region)
    } else {
        selectedRegions.value.splice(index, 1)
    }
}

function togglebuttonclass(id) {
    return selectedRegions.value.includes(id) ? "default-blue" : "toggle-off-blue"
}

function setLengthButton(len) {
    return selectedLength.value === len ? "default-blue" : "toggle-off-blue"
}


let regions = ref([]);
async function getRegions() {
    try {
        const resp = await fetch("http://localhost:3000/api/regions")
        if (!resp.ok)
            throw new Error(`Kunde inte hämta regioner från databasen: ${resp.status}`)
        const data = await resp.json()
        if (data.length < 1) throw new Error("Databasen svarade utan data vid hämtning av regioner!")
        regions.value = data;
    } catch (error) {
        console.error(`Fel vid hämtning: ${error}`)
        if (error instanceof TypeError)
            emit("error", "Kunde inte nå servern.")
        else
            emit("error", "Övrigt fel: " + error.message)
    }
}
onMounted(() => {
    getRegions()
})

</script>

<template>
    <div class="main-settings">
        <article class="text-box">
            <h2>Välj längd på quizet</h2>
        </article>
        <div class="difficulty-buttons">
            <button v-for="len in [5, 10, 20]" :key="len" :class="setLengthButton(len)" @click="setLength(len)">{{ len
                }}</button>
            <button :class="setLengthButton(0)" @click="setLength(0)">Oändligt</button>
        </div>
        <article class="text-box">
            <h2>Välj vilka regioner som ska vara med</h2>
            <p>Obs lämna blankt för att alla ska vara med</p>
        </article>
        <div class="region-buttons">
            <button v-for="region in regions" :key="region" :class="togglebuttonclass(region.RegionsID)"
                @click="toggleRegion(region.RegionsID)">{{ region.Regionname }}</button>
        </div>
        <button class="default-green" @click="handleStart">Starta Quiz!</button>
    </div>
</template>
<style scoped>
h2 {
    margin: 0;
}

p {
    margin: 0;
}
</style>