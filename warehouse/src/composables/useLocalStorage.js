import { onMounted, onUnmounted, ref, watch } from 'vue'

export function useLocalStorage(key, initialValue) {
    const storedValue = ref(JSON.parse(localStorage.getItem(key)) || initialValue)

    // Отслеживаем изменения значения
    watch(storedValue, (newValue) => {
        if (newValue === null) {
            localStorage.removeItem(key)
        } else {
            localStorage.setItem(key, JSON.stringify(newValue))
        }
    })

    // Отслеживаем изменения в других вкладках
    const handleStorage = (event) => {
        if (event.key === key) {
            storedValue.value = event.newValue ? JSON.parse(event.newValue) : null
        }
    }

    onMounted(() => {
        window.addEventListener('storage', handleStorage)
    })

    onUnmounted(() => {
        window.removeEventListener('storage', handleStorage)
    })

    return storedValue
}