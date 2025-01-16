// composables/Validations/usePasswordValidation.js
import {ref, computed} from 'vue'
// Вынесли регулярные выражения и требования за пределы функции для оптимизации
const REQUIREMENTS = [
    {
        regex: /^.{8,}$/,
        message: 'минимум 8 символов',
        points: 20
    },
    {
        regex: /[A-ZА-Я]/,
        message: 'заглавную букву',
        points: 20
    },
    {
        regex: /[a-zа-я]/,
        message: 'строчную букву',
        points: 20
    },
    {
        regex: /[0-9]/,
        message: 'цифру',
        points: 20
    },
    {
        regex: /[!@#$%^&*(),.?":{}|<>]/,
        message: 'специальный символ',
        points: 20
    }
]
export const usePasswordValidation = () => {
    const password = ref('')
    const repassword = ref('')
    const passwordError = computed(() => {
        if (!password.value) return 'Пароль обязателен'
        const failedRequirements = REQUIREMENTS
            .filter(req => !req.regex.test(password.value))
            .map(req => req.message)
        return failedRequirements.length > 0
            ? `Пароль должен содержать: ${failedRequirements.join(', ')}`
            : ''
    })
    const repasswordError = computed(() => {
        if (!repassword.value) return 'Повторите пароль'
        if (password.value !== repassword.value) return 'Пароли не совпадают'
        return ''
    })
    const passwordStrength = computed(() => {
        if (!password.value) return 0
        return REQUIREMENTS.reduce((strength, req) =>
                req.regex.test(password.value) ? strength + req.points : strength
            , 0)
    })
    const passwordValidationClass = computed(() => {
        if (!password.value) return ''
        return passwordError.value ? 'is-invalid' : 'is-valid'
    })
    const repasswordValidationClass = computed(() => {
        if (!repassword.value) return ''
        return repasswordError.value ? 'is-invalid' : 'is-valid'
    })
    // Методы для внешней валидации, если требуется
    const validatePassword = () => !passwordError.value
    const validateRepassword = () => !repasswordError.value
    // Общий метод валидации
    const validateForm = () => validatePassword() && validateRepassword()
    return {
        // Реактивные свойства
        password,
        repassword,
        passwordError,
        repasswordError,
        passwordStrength,
        passwordValidationClass,
        repasswordValidationClass,
        // Методы валидации
        validatePassword,
        validateRepassword,
        validateForm
    }
}