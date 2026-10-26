<script setup>
import { ref, onMounted } from "vue"
const selectedLength = ref(10)
const selectedRegions = ref([])
let regions = ref([]);

const emit = defineEmits(["start", "error"])

const setLength = (len) => {
    selectedLength.value = len
}
const handleStart = () => {
    emit("start", {
        length: selectedLength.value,
        regions: selectedRegions.value
    })
}

const toggleRegion = (region) => {
    const allIsSelected = selectedRegions.value.length === regions.value.length
    const isTheOnlyoneLeft = selectedRegions.value.length === 1 && selectedRegions.value.includes(region)
    const isAlreadySelected = selectedRegions.value.includes(region)

    if (isTheOnlyoneLeft) {
        selectedRegions.value = regions.value.map(r => r.RegionsID)
    } else if (allIsSelected) {
        selectedRegions.value = [region]
    } else if (isAlreadySelected) {
        const index = selectedRegions.value.indexOf(region)
        selectedRegions.value.splice(index, 1)
    } else {
        selectedRegions.value.push(region)
    }
}

async function addAllRegions() {
    await getRegions()
    selectedRegions.value = regions.value.map(r => r.RegionsID)
}

function togglebuttonclass(id) {
    return selectedRegions.value.includes(id) ? "default-blue" : "toggle-off-blue"
}

function setLengthButton(len) {
    return selectedLength.value === len ? "default-blue" : "toggle-off-blue"
}


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
            emit("error", "Kunde inte nå servern vid hämtningar av regioner.")
        else
            emit("error", "Övrigt fel: " + error.message)
    }
}
onMounted(() => {
    addAllRegions()
})

</script>

<template>
    <div class="main-settings">
        <fieldset>
            <legend>Inställningar</legend>
            <section class="text-box">
                <h2>Typ av quiz</h2>
            </section>
            <section class="settings-length">
                <section>
                    <span>Antal frågor</span>
                    <div class="difficulty-buttons">
                        <button v-for="len in [5, 10, 20]" :key="len" :class="setLengthButton(len)"
                            @click="setLength(len)">{{
                                len
                            }}</button>
                    </div>
                </section>
                <section>
                    <span>Special</span>
                    <div class="difficulty-buttons">
                        <button :class="setLengthButton(0)" @click="setLength(0)">Första miss</button>
                        <button :class="setLengthButton(0)" @click="setLength(0)">På tid</button>
                    </div>
                </section>
            </section>
            <article class="text-box">
                <h2>Vilka områden ska vara med</h2>
            </article>
            <div class="region-buttons">
                <button v-for="region in regions" :key="region" :class="togglebuttonclass(region.RegionsID)"
                    @click="toggleRegion(region.RegionsID)">{{ region.Regionname }}</button>
            </div>
            <button class="default-green" @click="handleStart">Starta Quiz!</button>
        </fieldset>
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