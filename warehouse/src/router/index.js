import {createRouter, createWebHistory} from 'vue-router'
import {useUserStore} from "@/stores/UserStore.js";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            name: 'LoginPage',
            path: '/login',
            component: () => import('@/layouts/AuthorizationLayout.vue'),
            children: [
                {
                    name: 'Login',
                    path: '',
                    component: () => import('@/views/AuthorizationView/SignInView.vue'),
                },
                {
                    name: 'Signup',
                    path: '/signup',
                    component: () => import('@/views/AuthorizationView/SignUpView.vue'),
                },
                {
                    name: 'Confirmation',
                    path: '/signup/confirm',
                    component: () => import('@/views/AuthorizationView/ConfirmSignUpView.vue'),
                },
            ],
            meta: {}
        },
        {
            name: 'HomeView',
            path: '/',
            component: () => import('@/layouts/HomeLayout.vue'),
            meta: {
                needAuth: true,
            },
            children: [
                {
                    name: 'General',
                    path: '',
                    component: () => import('@/views/HomeView/GeneralView.vue'),
                },
                {
                    name: 'Profile',
                    path: 'profile',
                    component: () => import('@/views/HomeView/ProfileView.vue'),
                    meta: {
                        isPersonalPage: true,
                        needAuth: true,
                    },
                },
                {
                    name: 'Users',
                    path: 'users',
                    component: () => import('@/views/HomeView/UsersView.vue')
                },
            ]
        },
    ],
    linkExactActiveClass: 'teplomash-active-exact-link'
});
router.beforeEach((to) => {
    const UserStore = useUserStore()
    if (localStorage.getItem('userData')) {
        UserStore.loadUser()
        UserStore.loadToken()
    } else if (to.meta.needAuth && !UserStore.isAuthenticated) {
        return {name: 'Login'}
    }
})
router.onError((e) => {
    console.log('Ошибка роутинга:', e)
})
export default router


