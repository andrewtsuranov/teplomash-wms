import {createRouter, createWebHistory} from 'vue-router'
import {useUserStore} from "@/stores/http/UserStore.js";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            name: '',
            path: '/login',
            component: () => import('@/layouts/AuthorizationLayout.vue'),
            meta: {guestOnly: true},
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
        },
        {
            name: '',
            path: '/',
            component: () => import('@/layouts/HomeLayout.vue'),
            meta: {requiresAuth: true},
            children: [
                {
                    name: 'General',
                    path: '',
                    component: () => import('@/views/HomeView/HomeView.vue'),
                },
                {
                    name: 'WMSAccept',
                    path: 'wms/acceptance',
                    component: () => import('@/views/HomeView/WMSView/AcceptanceView.vue'),
                },
                {
                    name: 'WMSShip',
                    path: 'wms/shipment',
                    component: () => import('@/views/HomeView/WMSView/ShipmentView.vue'),
                },
                {
                    name: 'Profile',
                    path: 'profile',
                    component: () => import('@/views/HomeView/ProfileView.vue'),
                    meta: {
                        isPersonalPage: true
                    },
                },
                {
                    name: 'Users',
                    path: 'users/:id',
                    component: () => import('@/views/HomeView/UsersView.vue')
                },
                {
                    name: 'Info',
                    path: 'info/',
                    component: () => import('@/views/HomeView/InfoView.vue')
                },
                {
                    name: 'Support',
                    path: 'support/',
                    component: () => import('@/views/HomeView/SupportView.vue')
                },
            ]
        },
        {
            name: 'NotFound',
            path: '/login/:pathMatch(.*)*',
            component: () => import('@/components/404/NotFound404.vue')
        },
        {
            name: 'NotFound',
            path: '/:pathMatch(.*)*',
            component: () => import('@/components/404/NotFound404.vue')
        }
    ],
    linkExactActiveClass: 'teplomash-active-exact-link'
});
router.beforeEach(async (to) => {
    const userStore = useUserStore()
    if (!!to.meta.requiresAuth && userStore.isAuthenticated) {
        try {
            // Проверяем валидность токенов
            const isValid = await userStore.VERIFY(userStore.user.access, userStore.user.refresh)
            // Если верификация не прошла, отправляем на логин
            if (!isValid) {
                userStore.clearUserData() // Метод очистки данных пользователя
                return {name: 'Login'}
            }
        } catch (error) {
            userStore.clearUserData()
            return {name: 'Login'}
        }
    }
    if (!!to.meta.requiresAuth && !userStore.isAuthenticated) {
        return {name: 'Login'}
    }
    if (userStore.isAuthenticated && !!to.meta.guestOnly) {
        return {name: 'General'}
    }
})
router.onError((error) => {
    console.error('Ошибка роутинга:', error)
})
export default router
