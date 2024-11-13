import {useErrorStore} from "@/stores/Error/ErrorStore.js"
import {useRouter} from "vue-router";
import {defineStore} from 'pinia'
import ky from "ky"
import {ref, computed} from "vue"
import { requestUrls } from '@/stores/Config/request-urls.js';

const router = useRouter()
const kyStd = ky.create({
    prefixUrl: requestUrls.auth,
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
        afterResponse: [
            async (request, options, response) => {
                if (response.ok) {
                    return response
                }
            }
        ],
    }
})
export const useUserStore = defineStore('userStore', () => {
    const errorStore = useErrorStore()
//---------------------------------------state--------------------------------
    const user = ref(JSON.parse(localStorage.getItem('userData')) || null)
    const loading = ref(false)
    const tempPassword = ref(null)
    // const userUP = ref(null)
//--------------------------------------getters------------------------------
    const isAuthenticated = computed(() => !!user.value)
    const getFullNameUser = computed(() => {
        const [lastName, firstName, middlename] = user.value.user.username.split('_')
        return {
            lastName,
            firstName,
            middlename,
            initials: `${firstName[0]}${middlename[0]}`,
            initialsDot: `${firstName[0]}.${middlename[0]}.`
        }
    })
    const roleUser = computed(() => {
        return user.value.user.role
    })
    const getTokenAccess = computed(() => user.value.access)
    const getUserId = computed(() => user.value.user.id)
    const getUserEmail = computed(() => user.value.user.email)

//----------------------------------actions--------------------------------

 const LOGIN = async (credentials) => {
        loading.value = true;
        errorStore.clearError();
        try {
            const response = await kyLogin
                .post('login/', {json: credentials})
                .json()
            user.value = response
            localStorage.setItem('userData', JSON.stringify(response))
            return true
        } catch (err) {
            if (err.response?.status === 401) {
                errorStore.setError({
                    status: err.response?.status,
                    message: 'Ошибка авторизации! Проверьте правильность введённых данных или зарегистрируйтесь!'
                })
            } else {
                errorStore.setError({
                    status: err.response?.status || 500,
                    message: 'Ошибка авторизации! Произошла ошибка при загрузке данных, попробуйте позже!'
                })
            }
            throw err
        } finally {
            loading.value = false
        }
    }

    const SIGNUP = async (userData) => {
        console.log(userData)
        const errorStore = useErrorStore()
        loading.value = true;
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
            const loginSuccess = await LOGIN(loginCredentials)
            if (loginSuccess) {
                router.push('/')
                return true
            }
        } catch (err) {
            errorStore.error = err.message
            throw err;
        } finally {
            loading.value = false
        }
    }

    //  const REQ_CONFIRM = async (activation_code) => {
    //     try {
    //         const email = userUP.value.email || JSON.parse(localStorage.getItem('userUP')).email || '{}'
    //         const response = await api
    //             .post('activate/', {json: {activation_code, email}})
    //             .json()
    //         if (response.message) {
    //             if (tempPassword.value) {
    //                 await LOGIN(email, tempPassword.value)
    //             } else {
    //                 errorStore.Error = "Не удалось выполнить автоматический вход. Пожалуйста, войдите вручную."
    //             }
    //         }
    //         return response
    //     } catch (err) {
    //         errorStore.Error = err.message
    //         throw err;
    //     } finally {
    //         loading.value = false
    //         tempPassword.value = null
    //     }
    // },
    const VERIFY = async (token_access, token_refresh) => {
        loading.value = true;
        errorStore.error = null;
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
            // eslint-disable-next-line no-unreachable
        } catch (err) {
            errorStore.error = err.message
            return false
        } finally {
            loading.value = false
        }
    }

    const clearFullLocalStorage = () => {
        user.value = null
        localStorage.clear()
        return true
    }

    return {
        user,
        loading,
        tempPassword,
        isAuthenticated,
        LOGIN,
        SIGNUP,
        VERIFY,
        getFullNameUser,
        roleUser,
        getTokenAccess,
        getUserId,
        getUserEmail,
        clearFullLocalStorage,
    }
})