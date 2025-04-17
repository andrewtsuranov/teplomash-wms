import {createRouter, createWebHistory} from 'vue-router'
import {useUserStore} from "@/stores/HTTP/UserStore.js";

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
                    component: () => import('@/views/Authorization/Login/LoginFormView.vue'),
                },
                {
                    path: '/registration',
                    name: 'Registration',
                    component: () => import('@/views/Authorization/Registration/RegistrationFormView.vue'),
                },
                {
                    path: '/registration/confirm',
                    name: 'Confirmation',
                    component: () => import('@/views/Authorization/Registration/SixDigitView.vue'),
                },
            ],
        },
        {
            path: '/dashboard',
            name: 'Admin',
            component: () => import('@/layouts/AdminLayout.vue'),
            meta: {
                adminOnly: true,
                breadcrumb: 'Профиль пользователя',
            },
        },
        {
            path: '/',
            component: () => import('@/layouts/HomeLayout.vue'),
            meta: {
                requiresAuth: true,
            },
            children: [
                {
                    path: '',
                    name: 'Home',
                    component: () => import('@/views/Home/WMSHomeView.vue'),
                    meta: {
                        breadcrumb: {
                            text: 'Home',
                            icon: 'bi-house-door-fill',
                            textOnly: false,
                            iconSize: 'lg', // sm, md, lg, xl, 2xl
                            iconClass: 'text-secondary',
                            root: true
                        }
                    },
                    children: [
                        {
                            path: 'warehouses',
                            name: 'WMS',
                            component: () => import('@/views/Home/WMS/WarehousesView.vue'),
                            meta: {
                                breadcrumb: {
                                    text: 'Склады',
                                    textOnly: true,
                                }
                            },
                            children: [
                                {
                                    path: ':idWarehouse',
                                    name: 'WMSProcess',
                                    component: () => import('@/views/Home/WMS/Process/WarehouseProcess.vue'),
                                    meta: {
                                        breadcrumb: {
                                            text: 'Процессы',
                                            textOnly: true,
                                        }
                                    },
                                    children: [
                                        {
                                            path: 'packing',
                                            name: 'wmsPackingZone',
                                            component: () => import('@/views/Home/WMS/Process/ProcessZones.vue'),
                                            props: {process: 'Упаковка', processRouteName: 'wmsPacking'},
                                            meta: {
                                                breadcrumb: {
                                                    text: 'Упаковка',
                                                    textOnly: true,
                                                }
                                            },
                                            children: [
                                                {
                                                    path: ':code',
                                                    name: 'wmsPacking',
                                                    component: () => import('@/views/Home/WMS/Process/Packing/StoragePackingView.vue'),
                                                    props: true,
                                                    meta: {
                                                        breadcrumb: {
                                                            text: 'Зона',
                                                            textOnly: true,
                                                        }
                                                    },
                                                    children: [
                                                        {
                                                            path: 'tsd-pac',
                                                            name: 'TTM-packing',
                                                            components: {
                                                                default: () => import('@/components/TeplomashTaskManager/Terminal/TTMTerminal.vue'),
                                                            },
                                                            meta: {
                                                                breadcrumb: {
                                                                    text: 'ТСД',
                                                                    textOnly: true,
                                                                }
                                                            },
                                                            props: true
                                                        },
                                                    ]
                                                },
                                            ]
                                        },
                                        {
                                            path: 'receiving',
                                            name: 'wmsReceivingZone',
                                            component: () => import('@/views/Home/WMS/Process/ProcessZones.vue'),
                                            props: {process: 'Приёмка', processRouteName: 'wmsReceiving'},
                                            meta: {
                                                breadcrumb: {
                                                    text: 'Приёмка',
                                                    textOnly: true,
                                                }
                                            },
                                        },
                                        {
                                            path: 'storage',
                                            name: 'wmsStorageZone',
                                            component: () => import('@/views/Home/WMS/Process/ProcessZones.vue'),
                                            props: {process: 'Хранение', processRouteName: 'wmsStorage'},
                                            meta: {
                                                breadcrumb: {
                                                    text: 'Хранение',
                                                    textOnly: true,
                                                }
                                            },
                                        },
                                        {
                                            path: 'shipping',
                                            name: 'wmsShippingZone',
                                            component: () => import('@/views/Home/WMS/Process/ProcessZones.vue'),
                                            props: {process: 'Отгрузка', processRouteName: 'wmsShipping'},
                                            meta: {
                                                breadcrumb: {
                                                    text: 'Отгрузка',
                                                    textOnly: true,
                                                }
                                            },
                                        },

                                        {
                                            path: 'receiving/:code',
                                            name: 'wmsReceiving',
                                            component: () => import('@/views/Home/WMS/Process/Receiving/StorageReceivingView.vue'),
                                            children: [
                                                {
                                                    path: 'rec-tsd',
                                                    name: 'TTM',
                                                    components: {
                                                        default: () => import('@/components/TeplomashTaskManager/Terminal/TTMTerminal.vue'),
                                                    },
                                                },
                                            ]
                                        },
                                        {
                                            path: 'storage/:code',
                                            name: 'wmsStorage',
                                            component: () => import('@/views/Home/WMS/Process/Storage/StorageView.vue'),
                                        },
                                        {
                                            path: 'shipping/:code',
                                            name: 'wmsShipping',
                                            component: () => import('@/views/Home/WMS/Process/Shipping/Data/StorageShippingView.vue'),
                                        },
                                        {
                                            path: 'inventory',
                                            name: 'wmsInventory',
                                            component: () => import('@/views/Home/WMS/Process/Inventory/StorageInventoryView.vue'),
                                            meta: {breadcrumb: 'Инвентаризация'}
                                        },
                                        {
                                            path: 'reporting',
                                            name: 'wmsReporting',
                                            component: () => import('@/views/Home/WMS/Process/Reporting/StorageReportingView.vue'),
                                            meta: {breadcrumb: 'Аналитика'}
                                        },
                                    ]
                                },
                            ]
                        },
                        {
                            path: 'profile',
                            name: 'Profile',
                            component: () => import('@/views/Home/Profile/ProfileView.vue'),
                            meta: {
                                isPersonalPage: true,
                                breadcrumb: 'Профиль'
                            },
                        },
                        {
                            path: 'info',
                            name: 'Info',
                            component: () => import('@/views/Home/About/AboutView.vue'),
                            meta: {breadcrumb: 'О нас'},
                        },
                        {
                            path: 'support',
                            name: 'Support',
                            component: () => import('@/views/Home/Support/SupportView.vue'),
                            meta: {breadcrumb: 'Поддержка'},
                        },
                    ]
                },
            ]
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
    // scrollBehavior() {
    //     // всегда прокручивать до верха
    //     return {top: 0}
    // },
    linkExactActiveClass: 'teplomash-active-exact-link'
});
router.beforeEach(async (to, from, next) => {
        const userStore = useUserStore()
        const redirectToLogin = (next) => {
            next({name: 'Login'});
        }
        if (to.meta.requiresAuth) {
            if (userStore.isAuthenticated) {
                try {
                    // Проверяем валидность токенов
                    const isValid = await userStore.VERIFY(
                        userStore.user.access,
                        userStore.user.refresh
                    )
                    if (isValid) {
                        next() // Всё в порядке, продолжаем навигацию
                    } else {
                        // Токены невалидны, очищаем данные и перенаправляем на Login
                        console.error("Токены невалидны"); // Или другое сообщение
                        userStore.clearUserData();
                        redirectToLogin(next)
                    }
                } catch (error) {
                    console.error("Ошибка при проверке токенов:", error);
                    if (error.response && error.response.status === 401) {
                        console.error('Токены просрочены');
                    }
                    userStore.clearUserData();
                    return redirectToLogin(next)
                }
            } else {
                // Пользователь не авторизован, перенаправляем на Login
                redirectToLogin(next)
            }
        } else if (userStore.isAuthenticated && to.meta.guestOnly) {
            // Пользователь авторизован, но пытается перейти на гостевую страницу
            next({name: "Home"});
        } else {
            // Остальные случаи
            next();
        }
    }
)
router.onError((error) => {
    console.error('Ошибка роутинга:', error)
})
export default router
