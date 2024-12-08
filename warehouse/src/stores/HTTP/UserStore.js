import {defineStore} from 'pinia'
import {useRouter} from "vue-router";
import {ref, computed} from "vue"
import {requestUrls} from '@/stores/request-urls.js';
import {useErrorStore} from "@/stores/Error/ErrorStore.js"
import ky from "ky"

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
                        }
                    )
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
const kyVerifyAndRefresh = kyStd.extend({
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
//state
    const user = ref(JSON.parse(localStorage.getItem('userData')) || null)
    const loading = ref(false)
    const tempPassword = ref(null)
//getters
    const isAuthenticated = computed(() => !!user.value)
    const getFullNameUser = computed(() => {
        if (!user.value) return null;
        const [lastName, firstName, middleName] = user.value.user.username.split('_');
        return {
            lastName,
            firstName,
            middleName,
            initials: `${firstName[0]}${middleName[0]}`,
            initialsDot: `${firstName[0]}.${middleName[0]}.`,
        };
    });
    const roleUser = computed(() => user.value?.user?.role);
    const getTokenAccess = computed(() => user.value?.access);
    const getUserId = computed(() => user.value?.user?.id);
    const getUserEmail = computed(() => user.value?.user?.email);
    const getUserById = computed(() => (id) => {
        if (user.value.user && user.value.user.id === id) {
            return getFullNameUser.value;
        } else {
            return null; // Или undefined, в зависимости от ваших предпочтений
        }
    });
//actions
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
        } catch (e) {
            if (e.response?.status === 401) {
                errorStore.setError({
                    status: e.response?.status,
                    message: 'Ошибка авторизации! Проверьте правильность введённых данных или зарегистрируйтесь!'
                })
            } else {
                errorStore.setError({
                    status: e.response?.status || 500,
                    message: 'Ошибка авторизации! Произошла ошибка при загрузке данных, попробуйте позже!'
                })
            }
            throw e
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
                await router.push('/')
                return true
            }
        } catch (err) {
            errorStore.error = err.message
            throw err;
        } finally {
            loading.value = false
        }
    }
    const REQ_CONFIRM = async (activation_code, email) => {
        try {
            // const email = userUP.value?.email || JSON.parse(localStorage.getItem('userUP')).email || '{}'
            const response = await kyStd
                .post('activate/', {json: {activation_code, email}})
                .json()
            if (response.message) {
                if (tempPassword.value) {
                    await LOGIN(email, tempPassword.value)
                } else {
                    errorStore.Error = "Не удалось выполнить автоматический вход. Пожалуйста, войдите вручную."
                }
            }
            return response
        } catch (err) {
            errorStore.Error = err.message
            throw err;
        } finally {
            loading.value = false
            tempPassword.value = null
        }
    }
    const VERIFY = async (token_access, token_refresh) => {
        loading.value = true;
        errorStore.error = null;
        try {
            // Проверяем access token
            try {
                await kyVerifyAndRefresh
                    .post('token/verify/', {json: {token: token_access}})
                    .json()
                return true
            } catch {
                // Если access token невалидный, пробуем refresh
                try {
                    const refreshResponse = await kyVerifyAndRefresh
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
            errorStore.error = err.message
            return false
        } finally {
            loading.value = false
        }
    }
    const clearUserData = () => {
        user.value = null
        tempPassword.value = null
    }
    return {
        user,
        loading,
        tempPassword,
        isAuthenticated,
        getUserById,
        LOGIN,
        SIGNUP,
        VERIFY,
        REQ_CONFIRM,
        getFullNameUser,
        roleUser,
        getTokenAccess,
        getUserId,
        getUserEmail,
        clearUserData,
    }
})