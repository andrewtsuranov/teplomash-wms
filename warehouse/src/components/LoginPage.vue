<template>
  <div class="login-wrapper">
    <div class="login-head">
      Авторизируйтесь, чтобы продолжить...
    </div>
    <my-input
        v-model="email"
        maxlength="50"
        pattern=".+@teplomash\.ru"
        placeholder="Введите email..."
        required
        size="64"
        title="Пожалуйста, введите только корпоративный адрес почты"
        type="email"
    />
    <my-input
        v-model="password"
        minlength="8"
        placeholder="Введите пароль..."
        required
        type="password"
    />
    <div class="btn__login">
      <my-button
          :disabled=isDisabled()
          v-on:click="userStore.login(user())"
      >Войти
      </my-button>
      <my-button>Зарегистрироваться</my-button>
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
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 15px;

  /*max-height: 100vh;*/
  /*justify-content: center;*/
}

.login-head {
  color: blanchedalmond;
  font-size: 1.5rem;
}

.login-input {
  /*padding-right: 170px;*/
  max-width: 400px;
}

.btn__login {
  display: flex;
  flex-direction: row;
  gap: 15px
}
</style>