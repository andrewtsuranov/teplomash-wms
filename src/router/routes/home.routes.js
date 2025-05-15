import wmsRoutes from "@/router/routes/wms.routes.js";
export default {
  path: "/",
  component: () => import("@/layouts/HomeLayout.vue"),
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: "",
      name: "Home",
      component: () => import("@/views/Home/HomeView.vue"),
      meta: {
        breadcrumb: {
          text: "Home",
          icon: "bi-house-door-fill",
          textOnly: false,
          iconSize: "lg", // sm, md, lg, xl, 2xl
          iconClass: "text-secondary",
          root: true,
        },
      },
      children: [
        wmsRoutes,
        {
          path: "profile",
          name: "Profile",
          component: () => import("@/views/Home/Profile/ProfileView.vue"),
          meta: {
            isPersonalPage: true,
            breadcrumb: "Профиль",
          },
        },
        {
          path: "info",
          name: "Info",
          component: () => import("@/views/Home/About/AboutView.vue"),
          meta: { breadcrumb: "Справка" },
        },
        {
          path: "support",
          name: "Support",
          component: () => import("@/views/Home/Support/SupportView.vue"),
          meta: { breadcrumb: "Поддержка" },
        },
      ],
    },
  ],
};
