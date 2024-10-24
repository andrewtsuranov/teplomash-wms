<template>
  <div   class="header-profile-container">
    <div class="profile-name">{{ userData.user.username }} ({{ userData.user.role }})</div>
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
import {useUserStore} from "@/stores/http/UserStore.js";
import {useRouter} from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const userData = userStore.user
const logout = () => {
  if (userStore.clearUserData()) {
    router.push({name: 'Login'})
  }
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