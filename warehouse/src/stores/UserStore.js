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
export const useUserStore = defineStore('userStore', {
    state: () => ({
        userData: null
    }),
    getters: {
        activeUsers() {
            return this.userData.filter((el) => el.isActive === true)
        },
    },
    actions: {
        async LOGIN(email, password) {
            const data = {email: email, password: password}
            try {
                this.userData = await api
                    .post('login/', {
                        json: data
                    })
                    .json()
                localStorage.setItem("userData", JSON.stringify(this.userData))
                console.log(this.userData.access)
            } catch (err) {
                console.log(err.message)
            }
        },
        async REQ_SIGNUP(username, role, email, password) {
            const data = {
                username: username,
                role: role,
                email: email,
                password: password
            }
            console.log(data)
            try {
                this.userData = await api
                    .post('register/', {
                        json: data
                    })
                    .json()
                localStorage.setItem("userData", JSON.stringify(this.userData))
            } catch
                (err) {
                console.log(err.message)
            }
        },
        async REQ_CONFIRM(sixdigit) {
            const digit = () => ({
                "activation_code": sixdigit,
                "email": this.userData.email
            })
            console.log(sixdigit)
            try {
                this.userData = await api
                    .post('activate/', {json: digit()})
                    .json()
                localStorage.setItem("userData", JSON.stringify(this.userData))
            } catch (err) {
                console.log(err.message)
            }
        }
    }
})
