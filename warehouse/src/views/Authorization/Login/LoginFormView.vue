<template>
  <div class="login-container">
    <form class="login-form"
          data-bs-theme="dark"
          @submit.prevent="handleLogin"
    >
      <div class="form-floating">
        <input id="floatingInput"
               class="form-control"
               placeholder="user@teplomash.ru"
               type="email"
               v-model="form.email"
        >
        <label for="floatingInput">E-mail (user@teplomash.ru)</label>
      </div>
      <div class="form-floating">
        <input id="floatingPassword"
               class="form-control"
               placeholder="Password"
               :type="passwordType"
               v-model="form.password"
        >
        <label for="floatingPassword">Пароль</label>
        <button class="toggle-btn"
                type="button"
                @click="togglePasswordVisibility"
        >
          <i :class="passwordIconClass"></i>
        </button>
      </div>
      <div v-if="error" class="alert alert-danger" role="alert">
        {{ error.message }}
      </div>
      <div class="group-btn-login">
        <my-button
            type="submit"
            id="show-modal"
            :disabled="loading"
        >{{ loading ? 'Обработка...' : 'Вход' }}
        </my-button>
        <my-button form="" @click="handleSignup">
          Регистрация
        </my-button>
      </div>
    </form>
  </div>
  <!--  <form @submit.prevent="handleLogin" class="sign-in-container">-->
  <!--    <span style="font-size: 1.5rem">Вход в систему:</span>-->
  <!--    <my-input-->
  <!--        v-model="form.email"-->
  <!--        maxlength="50"-->
  <!--        placeholder="Введите email..."-->
  <!--        required-->
  <!--        :disabled="loading"-->
  <!--        size="64"-->
  <!--        type="email"-->
  <!--    />-->
  <!--    <my-input-->
  <!--        v-model="form.password"-->
  <!--        minlength="8"-->
  <!--        placeholder="Введите пароль..."-->
  <!--        required-->
  <!--        :disabled="loading"-->
  <!--        type="password"-->
  <!--    />-->
  <!--      <div v-if="error" class="alert alert-danger" role="alert">-->
  <!--        {{ error.message }}-->
  <!--      </div>-->
  <!--      <div class="group-btn-login">-->
  <!--        <my-button-->
  <!--            type="submit"-->
  <!--            id="show-modal"-->
  <!--            :disabled="loading"-->
  <!--        >{{ loading ? 'Обработка...' : 'Вход' }}-->
  <!--        </my-button>-->
  <!--        <my-button form="" @click="handleSignup">-->
  <!--          Регистрация-->
  <!--        </my-button>-->
  <!--      </div>-->
  <!--  </form>-->
</template>
<script setup>
import {ref, computed} from 'vue'
import {useUserStore} from "@/stores/HTTP/UserStore.js";
import {useErrorStore} from "@/stores/Error/ErrorStore.js";
import MyButton from "@/components/UI/MyButton.vue";
import MyInput from "@/components/UI/MyInput.vue";
import {useRouter} from 'vue-router'
import {usePasswordToggle} from "@/composables/Validations/usePasswordToggle.js";

const {passwordType, passwordIconClass, togglePasswordVisibility} = usePasswordToggle()
const router = useRouter()
const userStore = useUserStore()
const errorStore = useErrorStore()
const form = ref({
  email: '',
  password: ''
})
const loading = computed(() => userStore.loading)
const error = computed(() => errorStore.error)
const handleLogin = async () => {
  const success = await userStore.LOGIN(form.value)
  if (success) {
    router.push({name: 'Home'})
  }
}
const handleSignup = async () => {
  router.push({name: 'Registration'})
}
</script>
<style scoped>
.login-container {
  display: grid;
  grid-template-columns: 1fr;
  align-content: center;
}

.login-form {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;
  row-gap: 2rem;
}

.group-btn-login {
  display: grid;
  grid-template-columns: min-content min-content;
  column-gap: 1.2rem;
}

.alert {
  margin: 0;
}

.bi-eye-slash,
.bi-eye::before {
  font-size: 1.5rem;
}

.toggle-btn {
  margin: 0;
  padding: 0;
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-48%);
  background: none;
  border: none;
  cursor: pointer;
}

.error-message {
  color: #E32029;
  color: #E32029;
}

.form-control {
  font-size: 1.2rem;
}

input[type="password"] {
  font-size: 1.5rem;
}

@media (max-width: 800px) {
  .group-btn-login {
    grid-template-columns: 1fr;
    row-gap: 1rem;
  }
}
</style>