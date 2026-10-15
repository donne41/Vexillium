<script setup>
import { ref, onMounted } from "vue"
    const selectedLength = ref(10)
const selectedRegions = ref([])

const emit = defineEmits(["start"])

const setLength = (len) => {
    console.log(`Setting length to ${len}`)
    if(len === 0) console.log("Fix infinte mode")
    selectedLength.value = len
}
const handleStart = () => {
    emit("start", {
        length: selectedLength.value,
        regions: selectedRegions.value
    })
}

const toggleRegion = (region) => {
    const index = selectedRegions.value.indexOf(region)

    if(index === -1){
        selectedRegions.value.push(region)
    }else {
        selectedRegions.value.splice(index, 1)
    }
    console.log(`all regions: ${selectedRegions.value}`)
}

function togglebuttonclass(id){
    return selectedRegions.value.includes(id) ? "default-blue" : "toggle-off-blue"
}

function setLengthButton(len) {
    return selectedLength.value === len ? "default-blue" : "toggle-off-blue"
}


let regions = ref([]);
async function getRegions(){
    try {
        const resp = await fetch("http://localhost:3000/api/regions")
        if(!resp.ok)
            throw new Error(`Could not fetch regions from database: ${resp.status}`)
        const data = await resp.json()
        regions.value = data;
    }catch(error){
        console.error(`Error fetching... ${error}`)
    }
}
onMounted(() => {
    getRegions()
})

</script>

<template>
    <div class="main">
        <div class="difficulty-buttons">
            <button v-for="len in [1, 10, 20, 0]" :key="len" :class="setLengthButton(len)" @click="setLength(len)">{{ len }}</button>
<!--             <button @click="setLength(1)" :class="setLengthButton(1)">5</button>
            <button @click="setLength(10)" :class="setLengthButton(10)">10</button>
            <button @click="setLength(20)" :class="setLengthButton(20)">20</button>
            <button @click="setLength(0)" :class="setLengthButton(0)">Oändligt</button> -->
        </div>
        <div class="region-buttons">
            <button v-for="region in regions" :key="region" :class="togglebuttonclass(region.RegionsID)"
            @click="toggleRegion(region.RegionsID)">{{ region.Regionname }}</button>
        </div>
        <button class="default-green" @click="handleStart">Starta Quiz!</button>
    </div>
</template>