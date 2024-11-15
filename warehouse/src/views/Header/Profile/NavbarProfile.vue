<template>
  <div class="profile-container">
    <div class="dropdown">
      <div class="avatar-mobile" data-bs-toggle="dropdown">
        <span>Профиль: {{ userData.lastName }} {{ userData.initialsDot }}</span>
      </div>
      <BAvatar aria-expanded="false"
               bg-variant="secondary"
               class="btn btn-secondary avatar-desktop"
               data-bs-toggle="dropdown"
               :text=userData.initials
               text-variant=""
               size="2.7rem"
      />
      <div class="dropdown-menu dropdown-menu-dark" style="background-color: #2e2e2e">
        <div class="profile-dropdown">
          <div class="profile-name">
            <BAvatar aria-expanded="false"
                     bg-variant="secondary"
                     class="btn btn-secondary avatar-dropdown"
                     data-bs-toggle="dropdown"
                     :text=userData.initials
                     text-variant=""
                     size="2.7rem"
            />
            <div>{{ userData.lastName }} {{ userData.firstName }} {{ userData.middlename }}</div>
            <div>({{ userRole }})</div>
          </div>
          <router-link class="profile-item" :to="{name:'Profile'}"><span>Профиль</span></router-link>
          <router-link class="profile-item" :to="{name:'Admin'}"><span>Администрирование</span></router-link>
          <div class="profile-logout"
               @click="logout"
          ><i style="color: red" class="bi bi-box-arrow-right"></i><span>Выйти из профиля</span>
          </div>
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
}

.profile-dropdown {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: minmax(auto, .8fr);
}

.profile-name {
  display: grid;
  grid-template-columns: auto 250px;
  grid-template-rows: 1fr 1fr;
  align-items: center;
  padding: 0 0 .5rem 1rem;
  column-gap: 1rem;
  row-gap: .5rem;
  color: #A4A4A4;
  border-bottom: 1px solid #414141;
}

.avatar-dropdown {
  grid-row: 1/3;
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

.profile-item {
  align-content: center;
  padding: 0 1rem;
}

.profile-item:hover {
  background-color: #353d48;
  border-radius: 1rem;
  cursor: pointer;
}

.profile-logout {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr;
  column-gap: 1rem;
  padding: 0 1rem;
  border-top: 1px solid #414141;
  color: #b9cad9;
  align-items: center;
}

.profile-logout:hover {
  background-color: #84323233;
  border-radius: 1rem;
  cursor: pointer;
}

a {
  color: #b9cad9;
  text-decoration: none;
}

i {
  font-size: 1.3rem;
}

.teplomash-active-exact-link {
  background-color: #9B9482;
}

@media (max-width: 800px) {
  .profile-container {
    grid-template-rows: minmax(3rem, max-content);
    background-color: rgba(255, 255, 255, 0.1);
    align-items: center;
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
    grid-template-rows: 1fr;
    justify-content: center;
  }
}
</style>