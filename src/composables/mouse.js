import {ref} from 'vue'
import {useEventListener} from '@/composables/event.js'

// по соглашению имена composables функций начинаются с "use"
export function useMouse() {
    // состояние, инкапсулированное и управляемое composable
    const x = ref(0)
    const y = ref(0)
    // самое интересное в composables - это возможность их вложения: одна composable функция может вызывать одну или несколько других composable функций
    useEventListener(window, 'mousemove', (event) => {
        x.value = event.pageX
        y.value = event.pageY
    })
    // представлять управляемое состояние в качестве возвращаемого значения
    return {x, y}
}