import {defineStore} from 'pinia'

export const useErrorStore = defineStore('ErrorStore', {
    state: () => ({
        error: null
    }),
    getters: {},
    actions: {
        setError(error) {
            this.error = error
        },
        clearError() {
            this.error = null
        }
    }
})
