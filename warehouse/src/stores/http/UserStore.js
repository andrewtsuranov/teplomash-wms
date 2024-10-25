import {defineStore} from 'pinia'
import ky from "ky";
import {useErrorStore} from "@/stores/error/ErrorStore.js";
import router from "@/router/index.js";
import {useLocalStorage} from "@/composables/useLocalStorage.js";

const kyStd = ky.create({
    prefixUrl: 'http://38.180.192.229/api/auth/',
    // prefixUrl: 'http://lab:8080/api/auth/',
    retry: 0,
})
const kyLogin = kyStd.extend({
    hooks: {
        afterResponse: [
            async (request, options, response) => {
                if (response.status === 401) {
                    const errorStore = useErrorStore()
                    errorStore.setError({
                        status: response.status,
                        message: 'Ошибка авторизации! Пользователь не авторизован, требуется регистрация!'
                    })
                }
            }
        ]
    }
})
const kySignup = kyStd.extend({
    hooks: {
        afterResponse: [
            async (request, options, response) => {
                if (response.ok) {
                    return response
                }
            }
        ],
    }
})
const kyVerifyandRefresh = kyStd.extend({
    hooks: {
        beforeRequest: [
            async (request, options) => {
                console.log(request)
                console.log(options)
            }
        ],
        afterResponse: [
            async (request, options, response) => {
                console.log(request)
                console.log(options)
                console.log(response)
                if (response.ok) {
                    return response
                }
            }
        ],
    }
})
//     afterResponse: [
//         (_request, _options, response) => {
//             // You could do something with the response, for example, logging.
//             console.log(response)
//             // Or return a `Response` instance to overwrite the response.
//             return new Response('A different response', {status: 200});
//         },
//         // Or retry with a fresh token on a 403 error
//         async (request, options, response) => {
//             if (response.status === 403) {
//                 // Get a fresh token
//                 const token = await ky('https://example.com/token').text();
//                 // Retry with the token
//                 request.headers.set('Authorization', `token ${token}`);
//                 return ky(request);
//             }
//         }
//     ]
export const useUserStore = defineStore('userStore', {
    state: () => {
        const userData = useLocalStorage('userData', null)
        return {
        user: userData || null,
        userUP: null,
        loading: false,
        tempPassword: null,
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.user,
    },
    actions: {
        async LOGIN(credentials) {
            const errorStore = useErrorStore()
            this.loading = true;
            errorStore.clearError();
            try {
                const response = await kyLogin
                    .post('login/', {json: credentials})
                    .json()
                localStorage.setItem('userData', JSON.stringify(response))
                return true
            } catch (err) {
                if (err.response?.status === 401) {
                    errorStore.setError({
                        status: err.response?.status,
                        message: 'Ошибка авторизации! Пользователь не авторизован, требуется регистрация'
                    })
                } else {
                    errorStore.setError({
                        status: err.response?.status || 500,
                        message: 'Ошибка авторизации! Произошла ошибка при загрузке данных!'
                    })
                }
                throw err
            } finally {
                this.loading = false
            }
        },
        async SIGNUP(userData) {
            const errorStore = useErrorStore()
            this.loading = true;
            errorStore.clearError();
            try {
                const registerResponse = await kySignup
                    .post('register/', {json: userData})
                    .json()
                console.log('Registration successful:', registerResponse)
                const loginCredentials = {
                    email: userData.email,
                    password: userData.password
                }
                const loginSuccess = await this.LOGIN(loginCredentials)
                if (loginSuccess) {
                    router.push('/')
                    return true
                }
            } catch (err) {
                this.error = err.message
                throw err;
            } finally {
                this.loading = false
            }
        },
        // async REQ_CONFIRM(activation_code) {
        //     try {
        //         const email = this.userUP.email || JSON.parse(localStorage.getItem('userUP')).email || '{}'
        //         const response = await api
        //             .post('activate/', {json: {activation_code, email}})
        //             .json()
        //         if (response.message) {
        //             if (this.tempPassword) {
        //                 await this.REQ_LOGIN(email, this.tempPassword)
        //             } else {
        //                 this.error = "Не удалось выполнить автоматический вход. Пожалуйста, войдите вручную."
        //             }
        //         }
        //         return response
        //     } catch (err) {
        //         this.error = err.message
        //         throw err;
        //     } finally {
        //         this.loading = false
        //         this.tempPassword = null
        //     }
        // },
        async VERIFY(token_access, token_refresh) {
            this.loading = true;
            this.error = null;
            try {
                // Проверяем access token
                try {
                    await kyVerifyandRefresh
                        .post('token/verify/', {json: {token: token_access}})
                        .json()
                    return true
                } catch {
                    // Если access token невалидный, пробуем refresh
                    try {
                        const refreshResponse = await kyVerifyandRefresh
                            .post('token/refresh/', {json: {refresh: token_refresh}})
                            .json()

                        // Обновляем access token в userData в localStorage
                        const userData = JSON.parse(localStorage.getItem('userData'))
                        userData.access = refreshResponse.access
                        localStorage.setItem('userData', JSON.stringify(userData))
                        return true
                    } catch {
                        // Если refresh тоже не работает
                        return false
                    }
                }
            } catch (err) {
                this.error = err.message
                return false
            } finally {
                this.loading = false
            }
        },
        // setUserToLocalStorage(user) {
        //     this.user = user;
        //     localStorage.setItem('userData', JSON.stringify(user))
        // },
        // setUserUP(user) {
        //     this.userUP = user;
        //     localStorage.setItem('userUP', JSON.stringify(user))
        // },
        clearUserData() {
            this.user = null
            localStorage.removeItem('userData')
            return true
        },
    }
})
