import {createApp} from 'vue'
import {createPinia} from 'pinia'
import {createBootstrap} from 'bootstrap-vue-next'
import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
// import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import App from './App.vue'
import router from './router'

// Импорт bootstrap.bundle.min.js не нужен, если вы импортируете его в компонентах
// Но если вы хотите сделать его глобальным:
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
window.bootstrap = bootstrap; // Делаем bootstrap доступным глобально (опционально)

const app = createApp(App)
app.use(createPinia())
app.use(createBootstrap())
app.use(router)
app.mount('#app')

