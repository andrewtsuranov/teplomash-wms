import { createRouter, createWebHistory } from "vue-router";
import { setupGuards } from "@/router/guards.js";
import authRoutes from "@/router/auth.routes.js";
import adminRoutes from "@/router/admin.routes.js";
import homeRoutes from "@/router/home.routes.js";
import notFoundRoute from "@/router/notFound.routes.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [authRoutes, adminRoutes, homeRoutes, notFoundRoute],
  linkExactActiveClass: "teplomash-active-exact-link",
});

// Настраиваем гварды авторизации
setupGuards(router);

router.onError((error) => {
  console.error("Ошибка роутинга:", error);
});

export default router;
