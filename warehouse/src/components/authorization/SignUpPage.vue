<template>
  <div class="login-wrapper">
    <h2>Заполните регистрационную форму</h2>
    <my-input
        v-model="surname"
        maxlength="64"
        placeholder="Фамилия*"
        required
        size="64"
        title="Введите фамилию.."
        type="text"
    />
    <my-input
        v-model="usrname"
        maxlength="64"
        placeholder="Имя*"
        required
        size="64"
        title="Введите имя.."
        type="text"
    />
    <my-input
        v-model="middlename"
        maxlength="64"
        placeholder="Отчество*"
        required
        size="64"
        title="Введите отчество.."
        type="text"
    />
    <my-input
        v-model="role"
        maxlength="64"
        placeholder="Role*"
        required
        size="64"
        title="Введите отчество.."
        type="text"
    />
    <my-input
        v-model="email"
        maxlength="50"
        pattern="@teplomash\.ru"
        placeholder="email* (example@teplomash.ru)"
        required
        size="64"
        title="Пожалуйста, используйте корпоративный адрес почты"
        type="email"
    />
    <my-input
        v-model="password"
        minlength="8"
        placeholder="пароль*"
        required
        type="password"
    />
    <my-input
        v-model="repassword"
        minlength="8"
        placeholder="повторите пароль*"
        required
        type="password"
    />
    <my-button
        @click="router.push({path: '/confirmation'})"
        v-on:click="userStore.REQ_SIGNUP(formDataUser())"
        :disabled=isDisabled()
    >Регистрация
    </my-button>
  </div>
</template>
<script setup>
import MyInput from "@/components/UI/MyInput.vue";
import MyButton from "@/components/UI/MyButton.vue"
import router from "@/router/index.js";
import {ref} from "vue";
import {useUserStore} from "@/stores/UserStore.js";

const userStore = useUserStore()
const usrname = ref('')
const surname = ref('')
const middlename = ref('')
const role = ref('')
const email = ref('')
const password = ref('')
const repassword = ref('')
const formDataUser = () => ({
  "username": surname.value + '_' + usrname.value + '_' + middlename.value,
  "role": role.value,
  "email": email.value,
  "password": password.value,
})
const isDisabled = () => !(usrname.value.length !== 0 && surname.value.length !== 0 && middlename.value.length !== 0 && email.value.length !== 0 && password.value.length !== 0 && repassword.value.length !== 0)
</script>
<style scoped>
.login-wrapper {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 15px;
  color: blanchedalmond;
}
</style>