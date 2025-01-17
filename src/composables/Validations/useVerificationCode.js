import { ref, computed, watch, nextTick } from 'vue'

export const useVerificationCode = (length = 6) => {
    const digits = ref(Array(length).fill(''))
    const inputRefs = ref([])
    const setInputRef = (el, index) => {
        if (el) {
            inputRefs.value[index] = el
        }
    }
    const getInput = (index) => inputRefs.value[index]?.$el
    const focusInput = async (index) => {
        if (index >= 0 && index < length) {
            await nextTick();
            const input = getInput(index);
            if (input) {
                input.focus();
            }
        }
    }
    const handleInput = async (index, event) => {
        // Получаем значение из события или используем сам параметр, если это строка
        const inputValue = typeof event === 'object' ? event.target.value : event;
        const numericValue = inputValue.toString().replace(/\D/g, '');
        digits.value[index] = numericValue.slice(-1);

        if (digits.value[index] && index < length - 1) {
            await focusInput(index + 1);
        }
    };
    const handleKeyDown = (event, index) => {
        switch (event.key) {
            case 'Backspace':
                if (!digits.value[index] && index > 0) {
                    digits.value[index - 1] = ''
                    focusInput(index - 1)
                }
                break
            case 'ArrowLeft':
                focusInput(index - 1)
                break
            case 'ArrowRight':
                focusInput(index + 1)
                break
        }
    }
    const handlePaste = async (event) => {
        event.preventDefault()
        const pastedText = event.clipboardData.getData('text')
        const numbers = pastedText.replace(/\D/g, '').slice(0, length)
        digits.value = [...numbers.padEnd(length, '').split('')]
        await nextTick()
        if (numbers.length > 0) {
            focusInput(Math.min(numbers.length, length) - 1);
        }
    }
    watch(digits, async (newVal, oldVal) => {
        // Используем простое сравнение массивов, так как у нас только строки
        const changedIndex = newVal.findIndex((digit, i) => digit !== oldVal[i]);
        if (changedIndex !== -1 && newVal[changedIndex] && changedIndex < length - 1) {
            await focusInput(changedIndex + 1);
        }
    }, { deep: true });
    const isComplete = computed(() => digits.value.every(digit => digit !== ''))
    const code = computed(() => digits.value.join(''))
    const reset = () => {
        digits.value = Array(length).fill('')
        focusInput(0)
    }
    return {
        digits,
        code,
        isComplete,
        setInputRef,
        handleInput,
        handleKeyDown,
        handlePaste,
        reset,
        focusInput
    }
}
