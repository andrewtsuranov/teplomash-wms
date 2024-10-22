<template>
  <div class="header-profile-container">
    <div class="profile-name">{{ dataUser.user.username }} ({{ dataUser.user.role}})</div>
    <div class="dropdown">
      <BAvatar aria-expanded="false"
               bg-variant="warning"
               class="btn btn-secondary"
               data-bs-toggle="dropdown"
               text="AП"
               text-variant="light"
      />
      <ul class="dropdown-menu dropdown-menu-dark">
        <li>
          <router-link class="dropdown-item active" to="/profile">Профиль</router-link>
        </li>
        <li>
          <hr class="dropdown-divider">
        </li>
        <li><a class="dropdown-item" @click="logout">Выход</a></li>
      </ul>
    </div>
  </div>
</template>
<script setup>
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
.header-profile-container {
  display: grid;
  grid-template-columns: 1fr max-content;
  align-items: center;
  column-gap: 20px;
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