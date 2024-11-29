import { ref, computed } from 'vue'

export const usePasswordValidation = (initialPassword = '') => {
    const password = ref(initialPassword)
    const passwordError = ref('')

    const validatePassword = () => {
        // Пароль должен содержать:
        // - Минимум 8 символов
        // - Хотя бы одну заглавную букву
        // - Хотя бы одну цифру
        // - Хотя бы один спецсимвол
        const passwordRegex = /^(?=.*[A-ZА-Я])(?=.*\d)(?=.*).{8,}$/

        if (!password.value) {
            passwordError.value = 'Пароль обязателен'
            return false
        }

        if (password.value.length < 8) {
            passwordError.value = 'Пароль должен содержать не менее 8 символов'
            return false
        }

        if (!passwordRegex.test(password.value)) {
            passwordError.value = 'Пароль должен содержать заглавную букву и цифру'
            return false
        }

        passwordError.value = ''
        return true
    }

    const passwordValidationClass = computed(() => {
        if (!password.value) return ''
        return passwordError.value ? 'is-invalid' : 'is-valid'
    })

    return {
        password,
        passwordError,
        validatePassword,
        passwordValidationClass
    }
}