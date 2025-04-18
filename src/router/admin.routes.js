export default {
  path: "/dashboard",
  name: "Admin",
  component: () => import("@/layouts/AdminLayout.vue"),
  meta: {
    adminOnly: true,
    breadcrumb: "Профиль пользователя",
  },
};
