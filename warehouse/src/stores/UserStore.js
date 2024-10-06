import {defineStore} from 'pinia'

const url = 'http://38.180.192.229/api/auth/login/'
export const useUserStore = defineStore('userStore', {
    state: () => ({
        users: [
            // {
            //     id: 1,
            //     name: 'Andrew',
            //     surname: 'Tsuranov',
            //     middleName: 'Pavlovich',
            //     email: 'a.tsuranov@teplomash.ru',
            //     password: '12345678',
            //     isActive: true,
            // },
            // {
            //     id: 2,
            //     name: 'Alex',
            //     surname: 'Ivanov',
            //     middleName: 'Dmitrievich',
            //     email: 'a.ivanov@teplomash.ru',
            //     password: '12345678',
            //     isActive: false,
            // },
            // {
            //     id: 3,
            //     name: 'Helen',
            //     surname: 'Novikova',
            //     middleName: 'Alexandrovna',
            //     email: 'h.novikova@teplomash.ru',
            //     password: '12345678',
            //     isActive: false,
            // },
        ],
    }),
    getters: {
        activeUsers() {
            return this.users.filter((el) => el.isActive === true)
        },
    },
    actions: {
        async login(user) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                });
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }
                const json = await response.json();
                console.log(json);
            } catch (error) {
                console.error(error.message);
            }
        }
    }
})
