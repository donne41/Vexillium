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
    console.log(`Setting regions to ${region}`)
    selectedRegions.value.push(region) // fixa toggle, om man trycker på samma, ta bort
    console.log(`all regions: ${selectedRegions.value}`)
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
            <button @click="setLength(1)">5</button>
            <button @click="setLength(10)">10</button>
            <button @click="setLength(20)">20</button>
            <button @click="setLength(0)">Oändligt</button>
        </div>
        <div class="region-buttons">
            <button v-for="region in regions" :key="region" :class="togglebuttonclass"
            @click="toggleRegion(region.RegionsID)">{{ region.Regionname }}</button>
        </div>
        <button class="play" @click="handleStart">Starta Quiz!</button>
    </div>
</template>