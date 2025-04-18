export default {
  path: "/:pathMatch(.*)*",
  name: "NotFound",
  component: () => import("@/router/404/NotFound404.vue"),
};

// {
//     path: '/:pathMatch(.*)*',
//         name: 'NotFound',
//     component: () => import('@/router/404/NotFound404.vue')
// }
