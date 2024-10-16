import {defineStore} from 'pinia'
import ky from "ky";

const api = ky.create({
    // prefixUrl: 'http://38.180.192.229/api/auth/'
    prefixUrl: 'http://lab:8080/api/auth/'
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
        user: [],
        token_access: null,
        loading: false,
        error: null,
        role: [
            {
                name: 'Грузчик',
                value: "LOADER",
            },
            {
                name: 'Диспетчер',
                value: "MANAGER",
            }
        ]
    }),
    getters: {
        isAuthenticated: (state) => !!state.token_access
    },
    actions: {
        async REQ_LOGIN(email, password) {
            try {
                this.user = await api
                    .post('login/', {json: {email: email, password: password}})
                    .json()
                this.setUser(this.user)
            } catch (err) {
                this.error = err.message
            } finally {
                this.loading = false
            }
        }, async REQ_SIGNUP(username, role, email, password) {
            const data = {
                username: username,
                role: role,
                email: email,
                password: password
            }
            try {
                this.user = await api
                    .post('register/', {json: data})
                    .json()
                this.setUser(this.user)
            } catch (err) {
                console.log(err.message)
            }
        }, async REQ_CONFIRM(code) {
            const digit = {
                "activation_code": code,
                "email": this.user.email
            }
            try {
                this.user = await api
                    .post('activate/', {json: digit})
                    .json()
                if (this.user.message) {
                    this.loadUser()
                    await this.REQ_LOGIN(this.user.email, this.user.password)
                }
            } catch (err) {
                console.log(err.message)
            }
        }, async REQ_VERIFY(data) {
            const token = {
                "token": data
            }
            try {
                const response = await api
                    .post('token/verify/', {json: token})
                if (response.ok) {
                    this.isAuthenticated = true
                }
                return response
            } catch (err) {
                console.log(err.message)
            }
        },
        setUser(user) {
            localStorage.setItem('userData', JSON.stringify(user))
        },
        getToken() {
            return this.token_access
        },
        loadToken() {
            const token = localStorage.getItem('userData')
            if (token.access) {
                this.token_access = token.access
            }
        },
        loadUser() {
            const user = localStorage.getItem(JSON.parse('userData'))
            if (user) {
                this.user = user
            }
        },
        clearUserData() {
            this.user = null;
            localStorage.removeItem('userData');
        }
    }
})
