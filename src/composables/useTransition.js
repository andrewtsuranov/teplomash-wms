import { ref } from 'vue'

export function useTransition() {
    const transitionKey = ref(Date.now())

    const triggerTransition = () => {
        transitionKey.value = Date.now()
    }

    return {
        transitionKey,
        triggerTransition
    }
}