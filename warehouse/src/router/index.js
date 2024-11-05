import {createRouter, createWebHistory} from 'vue-router'
import {useUserStore} from "@/stores/HTTP/Auth/UserStore.js";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            component: () => import('@/layouts/AuthorizationLayout.vue'),
            meta: {guestOnly: true},
            children: [
                {
                    path: '',
                    name: 'Login',
                    component: () => import('@/views/Authorization/SignIn/SignInView.vue'),
                },
                {
                    path: '/signup',
                    name: 'Signup',
                    component: () => import('@/views/Authorization/SignUp/SignUpView.vue'),
                },
                {
                    path: '/signup/confirm',
                    name: 'Confirmation',
                    component: () => import('@/views/Authorization/SignUp/SignUpCodeEmailView.vue'),
                },
            ],
        },
        {
            path: '/admin',
            component: () => import('@/layouts/AdminLayout.vue'),
            meta: {adminOnly: true},
        },
        {
            path: '/',
            component: () => import('@/layouts/HomeLayout.vue'),
            meta: {requiresAuth: true},
            children: [
                {
                    path: '',
                    name: 'Home',
                    component: () => import('@/views/Home/HomeView.vue'),
                },
                {
                    path: 'warehouse',
                    name: 'WMS',
                    component: () => import('@/views/Home/WMS/StoragesView.vue'),
                },
                {
                    path: '/warehouse/storage-:id',
                    name: 'WMSStorage',
                    component: () => import('@/views/Home/WMS/Storage/StorageID.vue'),
                    children: [
                        {
                            path: 'receiving',
                            name: 'wmsReceiving',
                            components: {
                                default: () => import('@/views/Home/WMS/Storage/Receiving/Data/StorageReceivingView.vue'),
                                TTM: () => import('@/views/Home/WMS/TeplomashTaskManager/TeplomashTaskManagerView.vue'),
                                props: {TTM: true}
                            },
                            children: [
                                {
                                    path: 'tsd#:tsd',
                                    name: 'TTMTerminal',
                                    components: {
                                        default: () => import('@/views/Home/WMS/TeplomashTaskManager/Terminal/TTMTerminal.vue'),
                                    },
                                    props: {default: true},
                                },
                            ]
                        },
                        {
                            path: 'shipping',
                            name: 'wmsShipping',
                            component: () => import('@/views/Home/WMS/Storage/Shipping/Data/StorageShippingView.vue'),
                        },
                        {
                            path: 'picking',
                            name: 'wmsPicking',
                            component: () => import('@/views/Home/WMS/Storage/Picking/StoragePickingView.vue'),
                        },
                        {
                            path: 'returns',
                            name: 'wmsReturns',
                            component: () => import('@/views/Home/WMS/Storage/Returns/StorageReturnsView.vue'),
                        },
                        {
                            path: 'inventory',
                            name: 'wmsInventory',
                            component: () => import('@/views/Home/WMS/Storage/Inventory/StorageInventoryView.vue'),
                        },
                        {
                            path: 'reporting',
                            name: 'wmsReporting',
                            component: () => import('@/views/Home/WMS/Storage/Reporting/StorageReportingView.vue'),
                        },
                    ]
                },
                {
                    path: 'profile',
                    name: 'Profile',
                    component: () => import('@/views/Home/Profile/ProfileView.vue'),
                    meta: {
                        isPersonalPage: true
                    },
                },
                {
                    path: 'info',
                    name: 'Info',
                    component: () => import('@/views/Home/About/AboutView.vue')
                },
                {
                    path: 'support',
                    name: 'Support',
                    component: () => import('@/views/Home/Support/SupportView.vue')
                },
            ],
        },
        {
            path: '/login/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('@/router/404/NotFound404.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('@/router/404/NotFound404.vue')
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
        return {name: 'Home'}
    }
})
router.onError((error) => {
    console.error('Ошибка роутинга:', error)
})
export default router
