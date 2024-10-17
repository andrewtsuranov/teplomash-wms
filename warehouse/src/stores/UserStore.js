import {defineStore} from 'pinia'
import ky from "ky";

const api = ky.create({
    prefixUrl: 'http://38.180.192.229/api/auth/'
    // prefixUrl: 'http://lab:8080/api/auth/'
})
// const secureApi = api.extend({
//     Authorization: 'token'
// })
// const response = await ky('https://example.com', {
//     hooks: {
//         beforeRetry: [
//             async ({request, options, error, retryCount}) => {
//                 const token = await ky('https://example.com/refresh-token');
//                 request.headers.set('Authorization', `token ${token}`);
//             }
//         ]
//     }
// });
export const useUserStore = defineStore('UserStore', {
    state: () => ({
        user: null,
        userUP: null,
        token_access: null,
        loading: false,
        error: null,
        tempPassword: null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token_access
    },
    actions: {
        async REQ_LOGIN(email, password) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api
                    .post('login/', {json: {email, password}})
                    .json()
                this.setUser(response)
                this.loadUser()
                return response;
            } catch (err) {
                this.error = err.message
                throw err;
            } finally {
                this.loading = false
            }
        },
        async REQ_SIGNUP(username, role, email, password) {
            this.loading = true;
            this.error = null;
            this.setUserUP(password)
            try {
                const response = await api
                    .post('register/', {json: {username, role, email, password}})
                    .json()
                this.setUserUP(response)
                this.tempPassword = password
                return response;
            } catch (err) {
                this.error = err.message
                throw err;
            } finally {
                this.loading = false
            }
        },
        async REQ_CONFIRM(activation_code) {
            try {
                const email = this.userUP.email || JSON.parse(localStorage.getItem('userUP')).email || '{}'
                const response = await api
                    .post('activate/', {json: {activation_code, email}})
                    .json()
                if (response.message) {
                    if (this.tempPassword) {
                        await this.REQ_LOGIN(email, this.tempPassword)
                    } else {
                        this.error = "Не удалось выполнить автоматический вход. Пожалуйста, войдите вручную."
                    }
                }
                return response
            } catch (err) {
                this.error = err.message
                throw err;
            } finally {
                this.loading = false
                this.tempPassword = null
            }
        },
        async REQ_VERIFY(token) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api
                    .post('token/verify/', {json: token})
                console.log(response)
                return response
            } catch (err) {
                this.error = err.message
                this.isAuthenticated()
                throw err;
            } finally {
                this.loading = false
            }
        },
        async REQ_REFRESH(refresh) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api
                    .post('token/refresh/', {json: refresh})
                console.log(response.access)
                this.token_access = response.access
                return response
            } catch (err) {
                this.error = err.message
                throw err;
            } finally {
                this.loading = false
            }
        },
        setUser(user) {
            this.user = user;
            localStorage.setItem('userData', JSON.stringify(user))
        },
        setUserUP(user) {
            this.userUP = user;
            localStorage.setItem('userUP', JSON.stringify(user))
        },
        loadUser() {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            this.user = userData || null;
            this.token_access = userData.access || null;
        },
        clearUserData() {
            this.user = null;
            this.token_access = null;
            localStorage.removeItem('userData');
        },
    }
})
