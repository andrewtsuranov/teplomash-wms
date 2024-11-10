import {onMounted, onUnmounted} from 'vue'

export const useClickOutside = (el, callback) => {
    onMounted(() => {
        const handler = (event) => {
            if (!(el.value === event.target || el.value?.contains(event.target))) {
                callback(event)
            }
        }
        document.addEventListener('click', handler)
        onUnmounted(() => {
            document.removeEventListener('click', handler)
        })
    })
}