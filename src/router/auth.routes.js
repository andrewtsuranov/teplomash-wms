export default {
  path: "/login",
  component: () => import("@/layouts/AuthorizationLayout.vue"),
  meta: { guestOnly: true },
  children: [
    {
      path: "",
      name: "Login",
      component: () => import("@/views/Authorization/Login/LoginFormView.vue"),
    },
    {
      path: "/registration",
      name: "Registration",
      component: () =>
        import("@/views/Authorization/Registration/RegistrationFormView.vue"),
    },
    {
      path: "/registration/confirm",
      name: "Confirmation",
      component: () =>
        import("@/views/Authorization/Registration/SixDigitView.vue"),
    },
  ],
};
