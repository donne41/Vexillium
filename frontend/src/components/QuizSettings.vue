<script setup>
let regions = ref(ref);
async function getRegions(){
    try {
        const resp = await fetch("http://localhost:3000/api/regions")
        if(!resp.ok)
            throw new Error(`Could not fetch regions from database: ${resp.status}`)
        const data = await resp.json()
        console.log("data: ", data)
    }catch(error){
        console.error(`Error fetching... ${error}`)
    }
}
</script>

<template>
    <div class="main">
        <div class="difficulty-buttons">
            <button @click="setLenght(5)">5</button>
            <button @click="setLenght(10)">10</button>
            <button @click="setLenght(20)">20</button>
            <button @click="setLenght(0)">Oändligt</button>
        </div>
        <div class="region-buttons">
            <button v-for="region in regions" :key="region" :class="togglebuttonclass"
            @click="toggleoption(region)">{{ region }}</button>
        </div>
    </div>
</template>