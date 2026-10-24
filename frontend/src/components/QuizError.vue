<script setup>
import { ref } from "vue"

const props = defineProps({
    msg: {
        type: String,
        required: true
    }
})

</script>

<template>
    <section class="main">
        <h2>Hoppsan! Ett fel har inträffat!</h2>
        <h3>{{ props.msg }}</h3>
    </section>
</template>
<style scoped>
    .main {
        display: flex;
        flex-direction: column;
        width: 50%;
        margin: 0 auto;
        text-align: center;
    }
</style>