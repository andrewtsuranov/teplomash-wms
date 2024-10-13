import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '@/views/MainView/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/signin',
            name: 'signin',
            component: () => import('../views/AuthorizationView/SignInView.vue')
        },
        {
            path: '/signup',
            name: 'signup',
            component: () => import('../views/AuthorizationView/SignUpView.vue'),
        },
        {
            path: '/confirmation',
            name: 'confirmation',
            component: () => import('../views/AuthorizationView/ConfirmSignUpView.vue'),
        },
    ],
    linkExactActiveClass: 'teplomash-active-exact-link'
})
export default router
