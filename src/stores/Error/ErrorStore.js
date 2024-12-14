import {defineStore} from 'pinia'
import {ref} from "vue";

export const useErrorStore = defineStore('ErrorStore', () => {
    const error = ref(null)
    const setError = (error) => {
        error.value = error
    }
    const clearError = () => {
        error.value = null
    }
    return {
        error,
        setError,
        clearError,
    }
})
