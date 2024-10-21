<template>
  <div class="header-profile-container">
    <div style="color: red;">Welcome, {{ dataUser.user.username }}</div>
<!--    <nav>-->
<!--      <router-link to="/profile">Профиль</router-link>-->
<!--    </nav>-->
    <div style="width:30%;" class="bg-info rounded-circle">FW</div>
<!--    <nav class="account">-->
<!--      <span v-if="this.showAvatar">-->
<!--    <b-dropdown variant="link" no-caret text-decoration-none>-->
<!--      <template #button-content>-->
<!--        <b-avatar button variant="primary" :src="getImgLink()" :text="getMyInitial"></b-avatar>-->
<!--      </template>-->
<!--			 <b-dropdown-header id="dropdown-header-1">-->
<!--         <div class="d-grid d-h">-->
<!--           <b-avatar class="d-h-avatar" :src="getImgLink()" :text="getMyInitial"></b-avatar>-->
<!--           <span class="name-lastname">{{ this.ApiUserData.name + ' ' + this.ApiUserData.surname }}</span>-->
<!--           <span class="rank">{{ this.ApiUserData.rank }}</span>-->
<!--         </div>-->
<!--			 </b-dropdown-header>-->

<!--			<b-dropdown-divider></b-dropdown-divider>-->
<!--			<router-link :to="{name: 'profile'}" class="p-0">-->
<!--        <b-dropdown-item>-->
<!--          <p class="wh">Мой профиль</p>-->
<!--        </b-dropdown-item>-->
<!--      </router-link>-->
<!--      <b-dropdown-item @click="signOut">-->
<!--        <p class="wh">Выйти</p>-->
<!--      </b-dropdown-item>-->
<!--    </b-dropdown>-->
<!--			</span>-->
<!--    <span v-else>-->
<!--        <router-link class="m-0" to="/registration">-->
<!--          <b-button class="mx-1" variant="outline-primary">-->
<!--						        <b-icon scale="1.3" icon="person-circle"></b-icon> Войти-->
<!--          </b-button>-->
<!--			</router-link>-->
<!--      </span>-->
<!--  </nav>-->
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