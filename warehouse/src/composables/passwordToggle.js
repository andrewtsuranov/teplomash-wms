import {computed, ref} from "vue";

export function usePasswordToggle() {
    const isPasswordVisible = ref(false)
    const passwordType = computed(() =>
        isPasswordVisible.value ? 'text' : 'password'
    )
    const passwordIconClass = computed(() =>
        isPasswordVisible.value
            ? 'bi bi-eye-slash'
            : 'bi bi-eye'
    )
    const togglePasswordVisibility = () => {
        isPasswordVisible.value = !isPasswordVisible.value
    }
    return {
        isPasswordVisible,
        passwordType,
        passwordIconClass,
        togglePasswordVisibility
    }
}