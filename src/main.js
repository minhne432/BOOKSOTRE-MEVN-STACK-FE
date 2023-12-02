import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


const app = createApp(App) // Create a Vue application instance.

app.use(router) // Use the Vue Router in your Vue application.
app.mount('#app') // Mount (attach) the Vue application to an HTML element with the id "app".

