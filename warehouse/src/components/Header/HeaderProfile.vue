<template>
  <div class="header-profile-container">
    <div style="color: red;">Welcome, {{ dataUser.user.username }}</div>
    <nav>
      <router-link to="/profile">Профиль</router-link>
    </nav>
    <my-button @click="logout">Выход</my-button>
  </div>
</template>
<script setup>
import {useUserStore} from "@/stores/UserStore.js";
import router from "@/router/index.js";
import MyButton from "@/components/UI/MyButton.vue";

const UserStorage = useUserStore()
const dataUser = UserStorage.user
const logout = async () => {
  UserStorage.clearUserData()
  await router.push({path: '/'})
}
</script>
<style scoped>
.header-profile-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
}

nav a {
  color: blanchedalmond;
  text-decoration: none;
}

nav .teplomash-active-exact-link {
  /*background-color: rgba(255, 255, 255, 0.1);*/
  color: violet;
}

i {
  font-size: 1.3rem;
}
</style>