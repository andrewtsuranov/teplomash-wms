<template>
  <form class="login-wrapper needs-validation" @submit.prevent="handleSignup" novalidate>
    <h2 class="mb-4">Заполните регистрационную форму</h2>

    <!-- Основные поля -->
    <div class="mb-3">
      <my-input
          v-model.trim="lastName"
          type="text"
          maxlength="20"
          class="form-control"
          placeholder="Фамилия*"
          :disabled="loading"
          required
      />
    </div>

    <div class="mb-3">
      <my-input
          v-model.trim="firstName"
          type="text"
          maxlength="20"
          class="form-control"
          placeholder="Имя*"
          :disabled="loading"
          required
      />
    </div>

    <div class="mb-3">
      <my-input
          v-model.trim="middleName"
          type="text"
          maxlength="20"
          class="form-control"
          placeholder="Отчество*"
          :disabled="loading"
          required
      />
    </div>

    <!-- Email -->
    <div class="mb-3">
      <my-input
          v-model.trim="emailValidation.email.value"
          type="email"
          class="form-control"
          :class="emailValidation.emailValidationClass.value"
          placeholder="Корпоративная почта @teplomash.ru*"
          pattern="^\S+@teplomash.ru"
          maxlength="25"
          required
          :disabled="loading"
          @blur="emailValidation.validateEmail"
      />
      <div v-if="emailValidation.emailError.value" class="invalid-feedback">
        {{ emailValidation.emailError.value }}
      </div>
    </div>

    <!-- Пароль -->
    <div class="mb-3">
      <div class="password-wrapper">
        <my-input
            v-model="passwordValidation.password"
            :type="passwordType"
            class="form-control"
            :class="passwordValidation.passwordValidationClass"
            placeholder="Введите пароль*"
            required
            :disabled="loading"
        />
        <button
            class="password-toggle btn btn-link"
            type="button"
            @click="togglePasswordVisibility"
        >
          <i :class="passwordIconClass"></i>
        </button>
      </div>
   <password-strength-meter
       :strength="passwordValidation.passwordStrength.value"
   />

      <div v-if="passwordValidation.passwordError" class="invalid-feedback d-block">
        {{ passwordValidation.passwordError }}
      </div>
    </div>

    <!-- Подтверждение пароля -->
    <div class="mb-4">
      <div class="password-wrapper">
        <my-input
            v-model="passwordValidation.repassword"
            :type="passwordType"
            class="form-control"
            :class="passwordValidation.repasswordValidationClass"
            placeholder="Повторите пароль*"
            required
            :disabled="loading"
        />
      </div>
      <div v-if="passwordValidation.repasswordError" class="invalid-feedback d-block">
        {{ passwordValidation.repasswordError }}
      </div>
    </div>

    <!-- Кнопки -->
    <div class="d-flex gap-3">
      <button
          type="button"
          class="btn btn-secondary"
          :disabled="loading"
          @click="router.push({name: 'Login'})"
      >
        Отмена
      </button>
      <button
          type="submit"
          class="btn btn-primary flex-grow-1"
          :disabled="loading || !isFormValid"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
        {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/HTTP/UserStore'
import { usePasswordValidation } from '@/composables/Validations/usePasswordValidation'
import { usePasswordToggle } from '@/composables/Validations/usePasswordToggle'
import { useEmailValidation } from '@/composables/Validations/useEmailValidation'
import MyInput from '@/components/UI/Inputs/MyInput.vue'
import PasswordStrengthMeter from '@/components/UI/PasswordStrengthMeter.vue'

const router = useRouter()
const userStore = useUserStore()
const passwordValidation = usePasswordValidation()
const emailValidation = useEmailValidation()
const { passwordType, passwordIconClass, togglePasswordVisibility } = usePasswordToggle()

const loading = ref(false)
const firstName = ref('')
const lastName = ref('')
const middleName = ref('')

// Валидация формы
const isFormValid = computed(() => {
  return firstName.value.length > 0 &&
      lastName.value.length > 0 &&
      middleName.value.length > 0 &&
      !emailValidation.emailError.value &&
      !passwordValidation.passwordError &&
      !passwordValidation.repasswordError &&
      passwordValidation.password.length >= 8
})

// Обработка отправки формы
const handleSignup = async () => {
  if (!isFormValid.value) return

  try {
    loading.value = true

    const signupData = {
      username: `${lastName.value}_${firstName.value}_${middleName.value}`,
      email: emailValidation.email.value,
      password: passwordValidation.password,
      role: 'MANAGER'
    }

    await userStore.SIGNUP(signupData)
    router.push({ name: 'Login' })
  } catch (error) {
    console.error('Ошибка регистрации:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrapper {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.password-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.375rem 0.75rem;
  color: #6c757d;
}

.password-toggle:hover {
  color: #495057;
}

.form-control:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}
</style>