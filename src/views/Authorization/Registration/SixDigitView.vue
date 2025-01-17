<template>
  <div class="confirm-wrapper">
    <h5>На ваш почтовый ящик отправлен код подтверждения. Для завершения регистрации введите полученный код:</h5>
    <div class="verification-inputs">
      <template v-for="index in 6" :key="index">
        <my-input
            v-model="digits[index - 1]"
            maxlength="1"
            inputmode="numeric"
            class="digit-input"
            :placeholder="'•'"
            :ref="el => setInputRef(el, index - 1)"
            @input="value => handleInput(index - 1, value)"
            @keydown="(e) => handleKeyDown(e, index - 1)"
            @paste="handlePaste"
        />
      </template>
    </div>
    <button
        :disabled="!isComplete"
        class="btn btn-outline-warning"
        @click="handleSubmit"
    >
      Подтвердить
    </button>
    <div v-if="countdown > 0" class="timer">
      Повторная отправка через {{ countdown }}с
    </div>
    <button
        :disabled="countdown > 0"
        class="btn btn-outline-secondary"
        @click="handleResend"
    >
      Получить код повторно
    </button>
  </div>
</template>
<script setup>
import {ref, computed, onMounted, nextTick, onUnmounted, watch} from 'vue'
import MyInput from "@/components/UI/Inputs/MyInput.vue"
import MyButton from "@/components/UI/Buttons/MyButton.vue"
import {useUserStore} from "@/stores/HTTP/UserStore"
import {useRouter} from 'vue-router'
import {useVerificationCode} from "@/composables/Validations/useVerificationCode.js";

const router = useRouter()
const userStore = useUserStore()
const {
  digits,
  code,
  isComplete,
  setInputRef,
  handleInput,
  handleKeyDown,
  handlePaste,
  focusInput
} = useVerificationCode(6)
const countdown = ref(30)
let timer = null
const startTimer = () => {
  clearInterval(timer)
  countdown.value = 30
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(timer)
    }
  }, 1000)
}
const handleSubmit = async () => {
  try {
    await userStore.REQ_CONFIRM(code.value)
    router.push('/')
  } catch (error) {
    // Ошибка обработана в сторе
  }
}
const handleResend = async () => {
  try {
    await userStore.RESEND_CODE()
    startTimer()
  } catch (error) {
    // Ошибка обработана в сторе
  }
}
onMounted(async () => {
  startTimer()
  await nextTick().then(() => {
    focusInput(0)
  })
})
// Очистка таймера при размонтировании
onUnmounted(() => {
  clearInterval(timer)
})
</script>
<style scoped>
.confirm-wrapper {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  row-gap: 2rem;
}

.verification-inputs {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
}

.digit-input {
  text-align: center;
  aspect-ratio: 1;
  padding: 0 !important;
  font-size: 2rem !important;
  border-color: #ffc107;
}

.timer {
  text-align: center;
  opacity: 0.8;
}
</style>