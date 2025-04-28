import {useUserStore} from "@/stores/HTTP/UserStore.js"

export function useGuardRouter(router) {
    router.beforeEach(async (to, from, next) => {
        const userStore = useUserStore()
        // Редиректы для гостей
        if (to.meta.requiresAuth && !userStore.isAuthenticated) {
            return next({name: "Login"})
        }
        // Редиректы для авторизованных
        if (to.meta.guestOnly && userStore.isAuthenticated) {
            return next({name: "Home"})
        }
        // Проверка токенов
        if (to.meta.requiresAuth && userStore.isAuthenticated) {
            try {
                const isValid = await userStore.VERIFY(userStore.user.access, userStore.user.refresh)
                if (!isValid) {
                    userStore.clearUserData()
                    return next({name: "Login"})
                }
            } catch (error) {
                console.error("Ошибка при проверке токенов:", error)
                userStore.clearUserData()
                return next({name: "Login"})
            }
        }
        // if (to.name === 'WMS') {
        //   warehouseStore.warehouseData = null
        //   warehouseStore.warehouseAliasMap = {}
        //   localStorage.removeItem('warehouseData')
        // }
        next()
    })
}