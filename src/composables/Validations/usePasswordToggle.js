import { ref, computed } from 'vue'

export const usePasswordToggle = () => {
    const showPassword = ref(false)

    const passwordType = computed(() => showPassword.value ? 'text' : 'password')

    const passwordIconClass = computed(() =>
        showPassword.value ? 'bi bi-eye-slash' : 'bi bi-eye'
    )

    const togglePasswordVisibility = () => {
        showPassword.value = !showPassword.value
    }

    return {
        passwordType,
        passwordIconClass,
        togglePasswordVisibility
    }
}