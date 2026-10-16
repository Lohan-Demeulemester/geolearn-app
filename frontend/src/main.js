import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import 'leaflet/dist/leaflet.css'
import vue3GoogleLogin from 'vue3-google-login'
import i18n from './i18n' // <-- On importe le dictionnaire

const app = createApp(App)

app.use(router)
app.use(i18n) // <-- On dit à Vue de l'utiliser
app.use(vue3GoogleLogin, {
  clientId: '485811451753-a283aab6heui9oejasblcje4sl5p7p1d.apps.googleusercontent.com'
})

app.mount('#app')