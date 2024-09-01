import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import datadog from './datadog'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const token = (import.meta as any).env.VITE_DD_CLIENT_TOKEN as string

app.use(createPinia())
app.use(datadog, {
    clientToken: token
})
app.use(router)

app.mount('#app')
