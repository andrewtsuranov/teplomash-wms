import {defineStore} from 'pinia'
import {ref} from "vue";

export const useErrorStore = defineStore('errorStore', () => {
    const error = ref(null)
    const setError = (errorData) => {
        error.value = errorData
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
