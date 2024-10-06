<template>
  <div class="list-users-wraper">
    <h1>Пользователи в сети (всего: {{ userStore.activeUsers.length }})</h1>
    <users-test
        v-for="user of userStore.activeUsers"
        :key="user.id"
        :user="user"
    />
    <h1>Список пользователей (всего: {{ userStore.users.length }})</h1>
    <users-test
        v-for="user of userStore.users"
        :key="user.id"
        :user="user"
    />
    <my-button @click="userStore.setActiveTab(1)"/>
    <my-button @click="userStore.setActiveTab(2)"/>
  </div>
</template>
<script setup>
import {useUserStore} from "@/stores/UserStore.js";
import UsersTest from "@/components/UsersTest.vue";
import MyButton from "@/components/UI/MyButton.vue";

const userStore = useUserStore()
</script>
<style>
.list-users-wraper {
  display: grid;
}

/*@media (min-width: 1024px) {*/
/*  .about {*/
/*    min-height: 100vh;*/
/*    display: flex;*/
/*    align-items: center;*/
/*  }*/
/*}*/
</style>
