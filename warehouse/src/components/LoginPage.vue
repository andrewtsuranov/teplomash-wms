<template>
  <div class="login-wrapper">
    <div class="login-head">
      Авторизируйтесь, чтобы продолжить...
    </div>
    <div class="login-input">
      <my-input
          v-model="email"
          type="email"
          size="64"
          maxlength="64"
          title="Пожалуйста, введите только корпоративный адрес почты"
          pattern=".+@teplomash\.ru"
          placeholder="Введите email..."
          required
      />
      <my-input
          v-model="password"
          type="password"
          minlength="8"
          placeholder="Введите пароль..."
          required
      />
    </div>
    <div>
      <my-button class="login-btn" v-on:click="userStore.login(user())" :disabled=isDisabled()>Войти</my-button>
      <my-button class="login-btn">Зарегистрироваться</my-button>
    </div>
  </div>
</template>
<script setup>
import {ref} from 'vue'
import {useUserStore} from "@/stores/UserStore.js";
import myButton from "@/components/UI/MyButton.vue";
import myInput from "@/components/UI/MyInput.vue";

const email = ref('')
const password = ref('')
const userStore = useUserStore()
const user = () => ({
  "email": email.value,
  "password": password.value
})
const isDisabled = () => !(user().email.length !== 0 && user().password.length !== 0)
</script>
<style scoped>
.login-wrapper {
  display: grid;
  gap: 10px;
  max-height: 100vh;
}

.login-head {
  color: blanchedalmond;
  font-size: 1.5rem;
}

.login-input {
}

.login-btn {
  margin-top: 15px;
}
</style>