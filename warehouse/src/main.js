import {createApp} from 'vue'
import {createPinia} from 'pinia'
import {createBootstrap} from 'bootstrap-vue-next'
import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(bootstrap)
app.use(createBootstrap())
app.use(router)
app.mount('#app')

