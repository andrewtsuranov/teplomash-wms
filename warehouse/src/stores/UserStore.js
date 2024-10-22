import {defineStore} from 'pinia'
import ky from "ky";

const api = ky.create({
    prefixUrl: 'http://38.180.192.229/api/auth/'
    // prefixUrl: 'http://lab:8080/api/auth/'
})
// const response = await ky('https://example.com', {
//     hooks: {
//         afterResponse: [
//             (_request, _options, response) => {
//                 // You could do something with the response, for example, logging.
//                 log(response);
//
//                 // Or return a `Response` instance to overwrite the response.
//                 return new Response('A different response', {status: 200});
//             },
//
//             // Or retry with a fresh token on a 403 error
//             async (request, options, response) => {
//                 if (response.status === 403) {
//                     // Get a fresh token
//                     const token = await ky('https://example.com/token').text();
//
//                     // Retry with the token
//                     request.headers.set('Authorization', `token ${token}`);
//
//                     return ky(request);
//                 }
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
        isAuthenticated: (state) => !!state.token_access && !!state.user
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
                this.clearUserData()
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
                    .post('token/refresh/', {json: {refresh}})
                    .json()
                console.log(response.access)
                this.token_access = response.access
                return response
            } catch (err) {
                this.error = err.message
                this.clearUserData()
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
        async loadUser() {
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            this.user = userData || null;
            this.token_access = userData.access || null;
            if (!this.token_access) {
                try {
                    await this.REQ_VERIFY(this.token_access);
                } catch (error) {
                    console.error('Failed to verify token:', error);
                   await this.clearUserData();
                }
            }
        },
        async clearUserData() {
            this.user = null;
            this.token_access = null;
             localStorage.removeItem('userData');
        },
    }
})
