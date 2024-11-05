<template>
  <div class="profile-container">
    <div class="dropdown d-grid">
      <div class="avatar-mobile" data-bs-toggle="dropdown">
        <label>Профиль: {{ userData.lastName }} {{ userData.initialsDot }}</label>
      </div>
      <BAvatar aria-expanded="false"
               bg-variant="secondary"
               class="btn btn-secondary avatar-desktop"
               data-bs-toggle="dropdown"
               :text=userData.initials
               text-variant=""
               size="2.7rem"
      />
      <div class="dropdown-menu dropdown-menu-dark">
        <div class="profile-dropdown">
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
import {useUserStore} from "@/stores/HTTP/Auth/UserStore.js";
import {useRouter} from 'vue-router'
import {computed} from "vue";
import {BAvatar} from "bootstrap-vue-next";

const router = useRouter()
const userStore = useUserStore()
const userData = computed(() => userStore.getFullNameUser)
const userRole = computed(() => userStore.roleUser)
const logout = () => {
  router.push({name: 'Login'})
  userStore.clearFullLocalStorage()
}
</script>
<style scoped>
.profile-container {
  display: grid;
  place-items: center;
}

.profile-dropdown {
  display: grid;
  row-gap: 0.8rem;
}

.avatar-desktop {
  display: block;
  background: none !important;
  border: 1px solid blanchedalmond;
  color: blanchedalmond !important;
}

.avatar-mobile {
  display: none;
}

.logout-btn {
  border-top: 1px solid grey;
}

nav a {
  color: blanchedalmond;
  text-decoration: none;
}

i {
  font-size: 1.3rem;
}

@media (max-width: 800px) {
  .profile-container {
    grid-template-rows: minmax(3rem, max-content);
    background-color: rgba(255, 255, 255, 0.1);
    place-items: stretch;
    text-transform: uppercase;
    font-size: 1.3rem;
    font-weight: bold;
    cursor: pointer;
  }

  .profile-dropdown {
    display: grid;
  }

  .avatar-desktop {
    display: none;
  }

  .avatar-mobile {
    display: grid;
  }

  label {
    place-self: center;
  }
}
</style>