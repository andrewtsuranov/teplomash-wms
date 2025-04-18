<template>
  <div class="confirm-wrapper">
    <h5>
      На ваш почтовый ящик отправлен код подтверждения. Для завершения
      регистрации введите полученный код:
    </h5>
    <div class="verification-inputs">
      <template v-for="index in 6" :key="index">
        <my-input
          :ref="(el) => setInputRef(el, index - 1)"
          v-model="digits[index - 1]"
          :placeholder="'•'"
          class="digit-input"
          inputmode="numeric"
          maxlength="1"
          @input="(value) => handleInput(index - 1, value)"
          @keydown="(e) => handleKeyDown(e, index - 1)"
          @paste="handlePaste"
        />
      </template>
    </div>
    <div
      v-if="error"
      class="alert alert-danger alert-dismissible fade show"
      role="alert"
    >
      {{ error }}
      <button
        aria-label="Close"
        class="btn-close"
        type="button"
        @click="error = ''"
      ></button>
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
import { ref, onMounted, nextTick, onUnmounted } from "vue";
import MyInput from "@/components/UI/Inputs/MyInput.vue";
import { useUserStore } from "@/stores/HTTP/UserStore";
import { useRouter } from "vue-router";
import { useVerificationCode } from "@/composables/Validations/useVerificationCode.js";

const router = useRouter();
const userStore = useUserStore();
const error = ref("");
const {
  digits,
  code,
  isComplete,
  setInputRef,
  handleInput,
  handleKeyDown,
  handlePaste,
  focusInput,
} = useVerificationCode(6);
const countdown = ref(30);
let timer = null;
const startTimer = () => {
  clearInterval(timer);
  countdown.value = 30;
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer);
    }
  }, 1000);
};
const handleSubmit = async () => {
  try {
    const loginSuccess = await userStore.REQ_CONFIRM(code.value);
    if (loginSuccess) {
      await router.push("/");
    }
  } catch (error) {
    error.value =
      "Неверный код подтверждения. Пожалуйста, проверьте код или запросите новый.";
  }
};
const handleResend = async () => {
  try {
    error.value = ""; // Сбрасываем предыдущие ошибки
    const email = userStore.tempCredentials?.email;
    if (!email) {
      error.value =
        "Ошибка: Email не найден. Заполните регистрационные форму ещё раз.";
      return;
    }
    await userStore.RESEND_CODE(email);
    startTimer();
    // Очищаем поля ввода
    digits.value = Array(6).fill("");
    await focusInput(0);
  } catch (err) {
    error.value = "Не удалось отправить новый код. Попробуйте позже.";
  }
};
onMounted(async () => {
  startTimer();
  await nextTick().then(() => {
    focusInput(0);
  });
});
// Очистка таймера при размонтировании
onUnmounted(() => {
  clearInterval(timer);
});
</script>
<style scoped>
.confirm-wrapper {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  row-gap: 2rem;
}

.verification-inputs {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(6, 1fr);
}

.digit-input {
  aspect-ratio: 1;
  border-color: #ffc107;
  color: #80ff00;
  font-size: 3rem !important;
  padding: 0 !important;
  text-align: center;
}

.timer {
  opacity: 0.8;
  text-align: center;
}
</style>
