import {defineStore} from 'pinia'
import ky from "ky";

const api = ky.create({
    prefixUrl: 'http://38.180.192.229/api/auth/'
    // prefixUrl: 'http://l/zab:8080/api/auth/'
})
const secureApi = api.extend({
    Authorization: 'token'
})
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
        async login(logDataUser) {
            try {
                const response = await secureApi
                    .post('login/', {json: logDataUser})
                    .json()
                console.log(response)
            } catch (err) {
                console.log(err.message)
            }
        },
        async REQ_SIGNUP(formDataUser) {
            console.log(formDataUser)
            try {
                this.userData = await api
                    .post('register/', {json: formDataUser})
                    .json()
                console.log(this.userData)
            } catch (err) {
                console.log(err.message)
            }
        },
        async REQ_CONFIRM(confirmData) {
            console.log(this.userData.email, confirmData)
            try {
                const response = await api
                    .post('activate/', {json: this.userData.email})
                    .json()
                console.log(response)
            } catch (err) {
                console.log(err.message)
            }
        }
    }
})
