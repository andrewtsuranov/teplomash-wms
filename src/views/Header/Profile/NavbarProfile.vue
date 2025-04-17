<template>
  <div class="profile-container">
    <div v-if="userStore.user" class="dropdown">
      <div class="avatar-mobile" data-bs-toggle="dropdown">
        <span>Профиль: {{ userStore.getFullNameUser?.lastName }} {{ userStore.getFullNameUser?.initialsDot }}</span>
      </div>
      <div aria-expanded="false"
           class="avatar-desktop rounded-circle d-flex align-items-center justify-content-center"
           data-bs-toggle="dropdown"
           style="width: 40px; height: 40px;"
      >
        {{ userStore.getFullNameUser?.initials }}
      </div>
      <div class="dropdown-menu dropdown-menu-dark p-0" style="background-color: #2e2e2e">
        <div class="profile-dropdown">
          <div class="profile-name">
            <div aria-expanded="false"
                 class="avatar-dropdown rounded-circle d-flex align-items-center justify-content-center"
                 data-bs-toggle="dropdown"
                 style="width: 40px; height: 40px;"
            >
              {{ userStore.getFullNameUser?.initials }}
            </div>
            <div>{{ userStore.getFullNameUser?.lastName }} {{ userStore.getFullNameUser?.firstName }}
                 {{ userStore.getFullNameUser?.middleName }}
            </div>
            <div>({{ userStore?.roleUser }})</div>
          </div>
          <router-link :to="{name:'Profile'}" class="profile-item"><span>Профиль</span></router-link>
          <router-link :to="{name:'Admin'}" class="profile-item"><span>Администрирование</span></router-link>
          <div class="profile-logout"
               @click="logout"
          ><i class="bi bi-box-arrow-right" style="color: red"></i><span>Выйти из профиля</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {useUserStore} from "@/stores/HTTP/UserStore.js";
import {useRouter} from 'vue-router'
import {useErrorStore} from "@/stores/Error/ErrorStore.js";

const errorStore = useErrorStore()
const router = useRouter()
const userStore = useUserStore()
const logout = async () => {
  try {
    userStore.clearUserData();
    localStorage.clear()
    await router.push({name: 'Login'});
  } catch (error) {
    console.error('Ошибка при выходе:', error)
    errorStore.setError({
      status: error.response?.status,
      message: 'Произошла ошибка при выходе из системы.'
    })
  }
}
</script>
<style scoped>
.profile-container {
  display: grid;
  align-items: center;
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
  padding: .4rem 1rem;
  column-gap: 1rem;
  row-gap: .5rem;
  color: #A4A4A4;
  border-bottom: 1px solid #414141;
}

.avatar-dropdown {
  border: 1px solid #A4A4A4;
  grid-row: 1/3;
}

.avatar-desktop {
  display: block;
  border: 1px solid blanchedalmond;
  cursor: pointer;
}

.avatar-desktop:hover {
  background-color: #4a383882;

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
  background-color: #353d48;
  border-radius: 1rem;
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