<template>
  <div class="sign-in-container">
    <span style="font-size: 1.5rem">Вход в систему:</span>
    <my-input
        v-model="email"
        maxlength="50"
        pattern=".+@teplomash\.ru"
        placeholder="Введите email..."
        required
        size="64"
        type="email"
    />
    <my-input
        v-model="password"
        minlength="8"
        placeholder="Введите пароль..."
        required
        type="password"
    />
    <div class="group-btn-login">
      <my-button
          id="show-modal"
          :disabled=isDisabled()
          v-on:click="clickLogin()"
      >Войти
      </my-button>
      <my-button @click="router.push({path : '/signup'})">
        Зарегистрироваться
      </my-button>
    </div>
  </div>
</template>
<script setup>
import {ref} from 'vue'
import {useUserStore} from "@/stores/UserStore.js";
import MyButton from "@/components/UI/MyButton.vue";
import MyInput from "@/components/UI/MyInput.vue";
import router from "@/router/index.js";

const UserStore = useUserStore()
const email = ref('')
const password = ref('')
const isDisabled = () => !(email.value.length !== 0 && password.value.length !== 0)
const clickLogin = async () => {
  await UserStore.REQ_LOGIN(email.value, password.value)
  if (UserStore.isAuthenticated) {
    router.push({name: 'HomeView'})
  }
}
</script>
<style scoped>
.sign-in-container {
  display: grid;
  row-gap: 20px;
  align-content: start;
  justify-content: center;
}

.group-btn-login {
  display: grid;
  grid-template-columns: max-content max-content;
  column-gap: 20px;
}

@media (max-width: 1024px) {
  .group-btn-login {
    grid-template-columns: 1fr;
    row-gap: 20px;
  }
}
</style>