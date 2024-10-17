<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link to="/profile">Профиль</router-link>
    <router-link to="/users">Пользователи</router-link>
    <my-button @click="logout()">Выход</my-button>
    <div style="color: red;">Welcome, {{ dataUser.user.username }}</div>
  </nav>
</template>
<script setup>
import MyButton from "@/components/UI/MyButton.vue";
import {useUserStore} from "@/stores/UserStore.js";
import router from "@/router/index.js";

const UserStorage = useUserStore()
const dataUser = UserStorage.user
const logout = async () => {
  UserStorage.clearUserData()
  await router.push({path: '/'})
}
</script>
<style scoped>
nav a {
  color: dimgray;
  text-decoration: none;
}

nav .teplomash-active-exact-link {
  background-color: rgba(255, 255, 255, 0.1);
}

a:hover {
  /*background: none;*/
}

i {
  font-size: 1.3rem;
}
</style>