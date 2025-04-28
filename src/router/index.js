import { createRouter, createWebHistory } from "vue-router";
import authRoutes from "@/router/routes/auth.routes.js";
import adminRoutes from "@/router/routes/admin.routes.js";
import homeRoutes from "@/router/routes/home.routes.js";
import notFoundRoute from "@/router/routes/notFound.routes.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    authRoutes,
    adminRoutes,
    homeRoutes,
    notFoundRoute
  ],
  linkExactActiveClass: "teplomash-active-exact-link",

})

router.onError((error) => {
  console.error("Ошибка маршрутизации:", error);
})
export default router;