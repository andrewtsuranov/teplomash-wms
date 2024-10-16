<template>
  <div class="login-wrapper">
    <h2>Заполните регистрационную форму</h2>
    <my-input
        v-model="uSurname"
        maxlength="64"
        placeholder="Фамилия*"
        required
        size="64"
        title="Введите фамилию.."
        type="text"
    />
    <my-input
        v-model="uName"
        maxlength="64"
        placeholder="Имя*"
        required
        size="64"
        title="Введите имя.."
        type="text"
    />
    <my-input
        v-model="uMidname"
        maxlength="64"
        placeholder="Отчество*"
        required
        size="64"
        title="Введите отчество.."
        type="text"
    />
    <my-select
        v-model="role"
        :options="UserStore.role"
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
        :disabled=isDisabled()
        @click="router.push({name: 'Confirmation'})"
        v-on:click="UserStore.REQ_SIGNUP(uSurname + '_' + uName + '_' + uMidname, role, email, password)"
    >Регистрация
    </my-button>
  </div>
</template>
<script setup>
import {useUserStore} from "@/stores/UserStore.js";
import MyInput from "@/components/UI/MyInput.vue";
import MyButton from "@/components/UI/MyButton.vue"
import router from "@/router/index.js";
import {ref} from "vue";
import MySelect from "@/components/UI/MySelect.vue"

const UserStore = useUserStore()
const uName = ref('')
const uSurname = ref('')
const uMidname = ref('')
const role = ref('')
const email = ref('')
const password = ref('')
const repassword = ref('')
const isDisabled = () => !(uName.value.length !== 0 && uSurname.value.length !== 0 && uMidname.value.length !== 0 && email.value.length !== 0 && password.value.length !== 0 && repassword.value.length !== 0)
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