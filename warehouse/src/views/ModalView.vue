<template>
  <Teleport to="body">
    <my-modal :show="showModal" @close="showModal = false">
      <template #header>
        <h3>Приветствуем Вас, {{ username.name }} {{ username.middlename }}!</h3>
      </template>
      <template #body>
        <h3>sdfkhskfhd kmks</h3>
      </template>
    </my-modal>
  </Teleport>
</template>
<script setup>
import MyModal from '@/components/UI/MyModal.vue'
import {reactive, ref} from 'vue'

const showModal = ref(false)
const getUserData = JSON.parse(localStorage.getItem('userData'))
const rowUserName = getUserData.user.username
const regex = /^(?<surname>[^_]+)_(?<name>[^_]+)_(?<middlename>[^_]+)$/
const match = rowUserName.match(regex);
const obj = match.groups
const username = reactive(obj)
</script>
<style scoped>
</style>