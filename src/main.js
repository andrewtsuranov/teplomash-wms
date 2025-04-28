import {createApp} from "vue";
import {createPinia} from "pinia";
import App from "@/App.vue";
import router from '@/router'
import {useGuardRouter} from "@/router/useGuardRouter.js";
import "@/assets/main.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap; // Делаем bootstrap доступным глобально (опционально)

const app = createApp(App);
const pinia = createPinia()
app.use(pinia);
app.use(router);
useGuardRouter(router)
app.mount("#app");
