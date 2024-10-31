<template>
  <form @submit.prevent="handleSignup" class="login-wrapper">
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
        v-model="form.role"
        :options="role_options"
        required
    />
    <my-input
        v-model="form.email"
        maxlength="50"
        placeholder="email* ___@teplomash.ru"
        required
        size="64"
        title="Пожалуйста, используйте корпоративный адрес почты"
        type="email"
        pattern="^\S+@teplomash.ru"
    />
    <my-input
        v-model="form.password"
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
        type="submit"
    >Регистрация
    </my-button>
  </form>
</template>
<script setup>
import {useUserStore} from "@/stores/HTTP/UserStore.js";
import MyInput from "@/components/UI/MyInput.vue";
import MyButton from "@/components/UI/MyButton.vue"
import {computed, ref} from "vue";
import MySelect from "@/components/UI/MySelect.vue"

const userStore = useUserStore()
const uName = ref('')
const uSurname = ref('')
const uMidname = ref('')
const role = ref('')
const email = ref('')
const password = ref('')
const repassword = ref('')
const role_options = [
  {name: 'Грузчик', value: "LOADER"},
  {name: 'Диспетчер', value: "MANAGER"}
]
const username = computed(() => {
return `${uSurname.value}_${uName.value}_${uMidname.value}`
})
const form = ref({
  email: email.value,
  role: role.value,
  password: (repassword.value === password.value) ? password.value : ''
})
const handleSignup = () => {
  if (form.value.password !== repassword.value) {
    alert('Пароли не совпадают');
    return;
  }
  const signupData = {
    ...form.value,
    username: username.value
  }
 userStore.SIGNUP(signupData);
};
// const isDisabled = () => !(uName.value.length !== 0 && uSurname.value.length !== 0 && uMidname.value.length !== 0 && email.value.length !== 0 && password.value.length !== 0 && repassword.value.length !== 0)

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
