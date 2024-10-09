import {defineStore} from 'pinia'
import ky from "ky";

const api = ky.create({
    // prefixUrl: 'http://38.180.192.229/api/auth/'
    prefixUrl: 'http://lab:8080/api/auth/'

})


const secureApi = api.extend({
    Authorization: 'token'
})

export const useUserStore = defineStore('userStore', {
    state: () => ({
        users: [
            {
                id: 1,
                name: 'Andrew',
                surname: 'Tsuranov',
                middleName: 'Pavlovich',
                email: 'a.tsuranov@teplomash.ru',
                password: '12345678',
                isActive: true,
            },
            {
                id: 2,
                name: 'Alex',
                surname: 'Ivanov',
                middleName: 'Dmitrievich',
                email: 'a.ivanov@teplomash.ru',
                password: '12345678',
                isActive: true,
            },
            {
                id: 3,
                name: 'Helen',
                surname: 'Novikova',
                middleName: 'Alexandrovna',
                email: 'h.novikova@teplomash.ru',
                password: '12345678',
                isActive: false,
            },
        ],
    }),
    getters: {
        activeUsers() {
            return this.users.filter((el) => el.isActive === true)
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
                const response = await api
                    .post('register/', {json: formDataUser})
                    .json()
                console.log(response)
            } catch (err) {
                console.log(err.message)
            }
        },
        async REQ_CONFIRM(confirmData) {
            console.log(confirmData)
            try {
                const response = await api
                    .post('activate/', {json: confirmData})
                    .json()
                console.log(response)
            } catch (err) {
                console.log(err.message)
            }
        }
    }
})
