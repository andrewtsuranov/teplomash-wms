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
            meta: {guestOnly: true}
        },
        {
            name: 'HomeView',
            path: '/',
            component: () => import('@/layouts/HomeLayout.vue'),
            meta: {
                requiresAuth: true,
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
router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    // Проверяем, есть ли сохраненные данные пользователя
    if (localStorage.getItem('userData')) {
        // Загружаем данные пользователя, если они еще не загружены
        if (!userStore.user) {
            userStore.loadUser()
        }
        // Проверяем валидность токена, если пользователь считается аутентифицированным
        // if (userStore.isAuthenticated) {
        //     try {
        //         await userStore.REQ_VERIFY(userStore.token_access)
        //     } catch (error) {
        //         console.error('Токен недействителен:', error)
        //         userStore.clearUserData()
        //     }
        // }
    }
    // Проверяем, требует ли маршрут аутентификации

    if (!!to.meta.requiresAuth && !userStore.isAuthenticated) {
        // Сохраняем целевой маршрут для перенаправления после входа
        next({name: 'Login', query: {redirect: to.fullPath}})
    }
    // Проверяем, доступен ли маршрут только для гостей
    else if (!!to.meta.guestOnly && userStore.isAuthenticated) {
        // Перенаправляем на домашнюю страницу, если пользователь уже аутентифицирован
        next({name: 'HomeView'})
    } else {
        next()
    }
})
router.onError((error) => {
    console.error('Ошибка роутинга:', error)
})
export default router
