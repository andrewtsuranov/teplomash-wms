<template>
  <div class="login-wrapper">
    <div class="login-head">
      Авторизируйтесь, чтобы продолжить...
    </div>
    <div class="login-input">
      <my-input
          v-model="email"
          type="text"
          placeholder="Введите email..."
      />
      {{ email }}
      <my-input
          v-model="password"
          type="text"
          placeholder="Введите пароль..."
      />
      {{ password }}
    </div>
    <div>
      <my-button class="login-btn" v-on:click="userStore.login(user())">Войти</my-button>
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