<template>
  <div class="header-profile-container">
    <div class="dropdown">
      <BAvatar aria-expanded="false"
               bg-variant="secondary"
               class="btn btn-secondary"
               data-bs-toggle="dropdown"
               text="AП"
               text-variant=""
               size="3rem"
      />
      <div class="dropdown-menu dropdown-menu-dark">
        <div class="header-profile-dropdown">
          <div class="profile-name dropdown-header">
            {{ userData.lastName }} {{ userData.firstName }} {{ userData.middlename }} ({{ userRole }})
          </div>
          <router-link class="dropdown-item active" to="/profile">Профиль</router-link>
          <div class="dropdown-item logout-btn" @click="logout">Выход</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {useUserStore} from "@/stores/http/UserStore.js";
import {useRouter} from 'vue-router'
import {computed} from "vue";
import {BAvatar} from "bootstrap-vue-next";

const router = useRouter()
const userStore = useUserStore()
const userData = computed(() => userStore.getFullNameUser)
const userRole = computed(() => userStore.roleUser)
const logout = () => {
  router.push({name: 'Login'})
  userStore.clearUserData()
}
</script>
<style scoped>
.header-profile-container {
  display: grid;
  grid-template-columns: 1fr max-content;
  align-items: center;
  column-gap: 20px;
}

.header-profile-dropdown {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;
  place-items: center;
  row-gap: 10px;
}

.logout-btn {
  border-top: 1px solid grey;
}

nav a {
  color: blanchedalmond;
  text-decoration: none;
}

nav.teplomash-active-exact-link {
  /*background-color: rgba(255, 255, 255, 0.1);*/
  color: chocolate;
}

i {
  font-size: 1.3rem;
}
</style>