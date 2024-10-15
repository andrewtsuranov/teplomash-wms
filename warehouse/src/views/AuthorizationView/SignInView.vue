<template>
  <div class="login-wrapper">
    <div class="login-head">
      Вход в систему:
    </div>
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
    <div class="btn__login">
      <my-button
          :disabled=isDisabled()
          v-on:click="clickLogin()"
          id="show-modal"
      >Войти
      </my-button>
      <my-button @click="router.push({path : '/signup'})">
        Зарегистрироваться
      </my-button>
    </div>
  </div>
  <!--  <ModalView/>-->
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
const clickLogin = () => {
  UserStore.LOGIN(email, password)
  UserStore.isAuthenticated = true
  if (UserStore.isAuthenticated) {
    router.push({name: 'HomeView'})
  }
}
</script>
<style scoped>
.login-wrapper {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 15px;
}

.login-head {
  color: blanchedalmond;
  font-size: 1.5rem;
}

.btn__login {
  display: flex;
  flex-direction: row;
  gap: 15px
}
</style>