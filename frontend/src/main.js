import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useAuth } from './composables/useAuth'

import './assets/css/main.css'

const app = createApp(App)

app.use(router)

// Ta reda på vem som är inloggad (via session-cookien) innan appen visas,
// så att sidan direkt visar rätt inloggningsläge efter en omladdning.
const { fetchMe } = useAuth()
fetchMe().finally(() => {
    app.mount('#app')
})

window.auth = useAuth()