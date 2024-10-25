import {createRouter, createWebHistory} from 'vue-router'
import {useUserStore} from "@/stores/http/UserStore.js";
// import {useLocalStorage} from "@/composables/useLocalStorage.js";
// import {watch} from "vue";

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
        },
        {
            name: 'HomeView',
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
            ]
        },
    ],
    linkExactActiveClass: 'teplomash-active-exact-link'
});
router.beforeEach(async (to) => {
    const userStore = useUserStore()

    // const userData = useLocalStorage('userData', null)
    //
    // // userData теперь реактивное и синхронизировано с localStorage
    // watch(userData, (newValue) => {
    //     console.log('Данные пользователя изменились:', newValue)
    //     return { userData }
    // })



    // Если маршрут требует аутентификации
    if (to.meta.requiresAuth) {
        // Если пользователь не авторизован, сразу на логин
        if (!userStore.isAuthenticated ) {
            return { name: 'Login' }
        }

        try {
            // Проверяем валидность токенов
            await userStore.VERIFY(userStore.user.access, userStore.user.refresh)

            // Если верификация не прошла, отправляем на логин
            // if (!isValid) {
            //     userStore.clearUserData() // Метод очистки данных пользователя
            //     return { name: 'Login' }
            // }
        } catch (error) {
            userStore.clearUserData()
            return { name: 'Login' }
        }
    }

    // Если маршрут не требует аутентификации или все проверки пройдены
    return true
})
router.onError((error) => {
    console.error('Ошибка роутинга:', error)
})
export default router
// if (userStore.user?.access) {
//     try {
//         // Проверяем access token
//         try {
//             await kyVerifyandRefresh
//                 .post('token/verify/', {json: {token: userStore.user.access}})
//                 .json()
//             // Access token валиден, разрешаем переход
//             return true
//         } catch {
//             // Access token невалиден, пробуем refresh
//             if (userStore.user?.refresh) {
//                 try {
//                     const refreshResponse = await kyVerifyandRefresh
//                         .post('token/refresh/', {json: {refresh: userStore.user.refresh}})
//                         .json()
//
//                     // Обновляем access token
//                     const userData = JSON.parse(localStorage.getItem('userData'))
//                     userData.access = refreshResponse.access
//                     localStorage.setItem('userData', JSON.stringify(userData))
//                     userStore.user = userData
//
//                     // Разрешаем переход с новым access token
//                     return true
//                 } catch {
//                     // Refresh token тоже невалиден
//                     userStore.clearUserData()
//                     return { name: 'Login' }
//                 }
//             } else {
//                 // Нет refresh token
//                 userStore.clearUserData()
//                 return { name: 'Login' }
//             }
//         }
//     } catch (error) {
//         // Общая ошибка верификации
//         userStore.clearUserData()
//         return { name: 'Login' }
//     }
// } else {
//     // Если нет access token и маршрут требует аутентификации
//     if (to.meta.requiresAuth) {
//         return { name: 'Login' }
//     }
// }
//
// // Разрешаем переход если не требуется аутентификация
// return true