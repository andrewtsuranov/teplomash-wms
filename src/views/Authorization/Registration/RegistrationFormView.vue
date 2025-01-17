<template>
  <form class="login-wrapper" novalidate @submit.prevent="handleSignup">
    <label style="font-size: 1.7rem">Заполните регистрационную форму</label>
    <my-input
        v-model.trim="lastName"
        :disabled="loading"
        class="form-control"
        maxlength="20"
        placeholder="Фамилия*"
        required
        type="text"
    />
    <div v-if="!lastName" class="invalid-feedback">
      Фамилия обязательна
    </div>
    <my-input
        v-model.trim="firstName"
        :disabled="loading"
        class="form-control"
        maxlength="20"
        placeholder="Имя*"
        required
        type="text"
    />
    <div v-if="!firstName" class="invalid-feedback">
      Имя обязательно
    </div>
    <my-input
        v-model.trim="middleName"
        :disabled="loading"
        class="form-control"
        maxlength="20"
        placeholder="Отчество*"
        required
        type="text"
    />
    <div v-if="!middleName" class="invalid-feedback">
      Отчество обязательно
    </div>
    <!-- Email -->
    <my-input
        v-model.trim="emailValidation.email.value"
        :class="emailValidation.emailValidationClass.value"
        :disabled="loading"
        class="form-control"
        maxlength="25"
        pattern="^\S+@teplomash.ru"
        placeholder="Корпоративная почта @teplomash.ru*"
        required
        type="email"
        @blur="emailValidation.validateEmail"
    />
    <div v-if="emailValidation.emailError.value" class="invalid-feedback">
      {{ emailValidation.emailError.value }}
    </div>
    <!-- Пароль -->
    <div class="password-wrapper">
      <my-input
          v-model="passwordValidation.password.value"
          :class="passwordValidation.passwordValidationClass"
          :disabled="loading"
          :type="passwordType"
          class="form-control"
          placeholder="Введите пароль*"
          required
      />
      <button
          class="password-toggle btn btn-link"
          type="button"
          @click="togglePasswordVisibility"
      >
        <i :class="passwordIconClass"></i>
      </button>
    </div>
    <div v-if="passwordValidation.password.value">
      <password-strength-meter :strength="passwordValidation.passwordStrength.value"/>
      <div v-if="passwordValidation.passwordError" class="invalid-feedback d-block">
        {{ passwordValidation.passwordError }}
      </div>
    </div>
    <!-- Подтверждение пароля -->
    <div class="password-wrapper">
      <my-input
          v-model="passwordValidation.repassword.value"
          :class="passwordValidation.repasswordValidationClass"
          :disabled="loading"
          :type="passwordType"
          class="form-control"
          placeholder="Повторите пароль*"
          required
      />
    </div>
    <div v-if="passwordValidation.password.value" class="invalid-feedback d-block">
      {{ passwordValidation.repasswordError }}
    </div>
    <!-- Кнопки -->
    <div class="group-of-btn">
      <button
          :disabled="loading"
          class="btn btn-secondary"
          type="button"
          @click="router.push({name: 'Login'})"
      >
        Отмена
      </button>
      <button
          :disabled="loading || !isFormValid"
          class="btn btn-primary flex-grow-1"
          type="submit"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
        {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
      </button>
    </div>
  </form>
</template>
<script setup>
import {ref, computed} from 'vue';
import {useRouter} from 'vue-router';
import {useUserStore} from '@/stores/HTTP/UserStore';
import {usePasswordValidation} from '@/composables/Validations/usePasswordValidation';
import {usePasswordToggle} from '@/composables/Validations/usePasswordToggle';
import {useEmailValidation} from '@/composables/Validations/useEmailValidation';
import MyInput from '@/components/UI/Inputs/MyInput.vue';
import PasswordStrengthMeter from '@/components/UI/PasswordStrengthMeter.vue';

const router = useRouter();
const userStore = useUserStore();
const passwordValidation = usePasswordValidation();
const emailValidation = useEmailValidation();
const {passwordType, passwordIconClass, togglePasswordVisibility} = usePasswordToggle();
const loading = ref(false);
const firstName = ref('');
const lastName = ref('');
const middleName = ref('');
// Валидация формы
const isFormValid = computed(() => {
  return (
      firstName.value.length > 0 &&
      lastName.value.length > 0 &&
      middleName.value.length > 0 &&
      !emailValidation.emailError.value &&
      passwordValidation.validateForm()
  );
});
// Обработка отправки формы
const handleSignup = async () => {
  router.push({name: 'Confirmation'})
  // if (!isFormValid.value) return
  // try {
  //   loading.value = true;
  //   const signupData = {
  //     username: `${lastName.value}_${firstName.value}_${middleName.value}`,
  //     email: emailValidation.email.value,
  //     password: passwordValidation.password.value,
  //     role: 'MANAGER'
  //   }
  //   await userStore.SIGNUP(signupData)
  //   router.push({name: 'Login'})
  // } catch (error) {
  //   console.error('Ошибка регистрации:', error);
  // } finally {
  //   loading.value = false;
  // }
};
</script>
<style scoped>
.login-wrapper {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  row-gap: 1rem;
  border: 1px solid #605039e0;
  background-color: #2623238f;
  border-radius: 1rem;
  padding: 1rem;
}

.invalid-feedback {
  margin-top: 0;
  font-size: 1rem;
}

.form-control::placeholder {
  font-size: 1.1rem;
  color: #8b7f6f;
}

.password-wrapper {
  position: relative;
  width: 100%;
}

.password-toggle {
  display: flex;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: .2rem .5rem;
  align-items: center;
  z-index: 2;
  color: #6c757d;
}

.password-toggle:hover {
  color: #495057;
}

.password-toggle i {
  font-size: 1.5rem;
}

.password-wrapper .form-control {
  padding-right: 3rem;
}

.group-of-btn {
  display: grid;
  grid-template-columns: 1fr 3fr;
  column-gap: 2rem;
}
</style>