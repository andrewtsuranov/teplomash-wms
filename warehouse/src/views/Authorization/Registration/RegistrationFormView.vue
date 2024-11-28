<template>
  <!-- Modal -->
<!--  <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">-->
<!--    <div class="modal-dialog">-->
<!--      <div class="modal-content">-->
<!--        <div class="modal-header">-->
<!--          <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>-->
<!--          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>-->
<!--        </div>-->
<!--        <div class="modal-body">-->
<!--         -->
<!--        </div>-->
<!--        <div class="modal-footer">-->
<!--          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>-->
<!--          <button type="button" class="btn btn-primary">Understood</button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
  <form class="login-wrapper" @submit.prevent="handleSignup">
    <h2>Заполните регистрационную форму</h2>
    <div class="form-floating mb-3">
      <input id="floatingInput" class="form-control" placeholder="name@example.com" type="email">
      <label for="floatingInput">email* ___@teplomash.ru</label>
    </div>
    <div class="form-floating">
      <input id="floatingPassword"
             :type="passwordType"
             class="form-control"
             placeholder="Введите пароль"
      >
      <label for="floatingPassword">Введите пароль</label>
      <button class="toggle-btn"
              type="button"
              @click="togglePasswordVisibility"
      >
        <i :class="passwordIconClass"></i>
      </button>
    </div>
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
        pattern="^\S+@teplomash.ru"
        placeholder="email* ___@teplomash.ru"
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
        type="submit"
    >Регистрация
    </my-button>
  </form>

</template>
<script setup>
import {useUserStore} from "@/stores/HTTP/Auth/UserStore.js";
import MyInput from "@/components/UI/MyInput.vue";
import MyButton from "@/components/UI/MyButton.vue"
import {computed, ref} from "vue";
import MySelect from "@/components/UI/MySelect.vue"
import {usePasswordToggle} from "@/composables/passwordToggle.js";

const userStore = useUserStore()
const {passwordType, passwordIconClass, togglePasswordVisibility} = usePasswordToggle()
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
  color: black;
}
.toggle-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
}
</style>
