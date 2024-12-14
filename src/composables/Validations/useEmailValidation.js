import { ref, computed } from 'vue'

export const useEmailValidation = (initialEmail = '') => {
    const email = ref(initialEmail)
    const emailError = ref('')

    const validateEmail = () => {
        const corporateEmailRegex = /^[a-zA-Z0-9._%+-]+@teplomash\.ru$/

        if (!email.value) {
            emailError.value = 'Email обязателен'
            return false
        }

        if (!corporateEmailRegex.test(email.value)) {
            emailError.value = 'Разрешена только корпоративная почта @teplomash.ru'
            return false
        }

        emailError.value = ''
        return true
    }

    const emailValidationClass = computed(() => {
        if (!email.value) return ''
        return emailError.value ? 'is-invalid' : 'is-valid'
    })

    return {
        email,
        emailError,
        validateEmail,
        emailValidationClass
    }
}