<template>
  <form @submit.prevent="handleLogin" class="sign-in-container">
    <span style="font-size: 1.5rem">Вход в систему:</span>
    <my-input
        v-model="form.email"
        maxlength="50"
        placeholder="Введите email..."
        required
        :disabled="loading"
        size="64"
        type="email"
    />
    <my-input
        v-model="form.password"
        minlength="8"
        placeholder="Введите пароль..."
        required
        :disabled="loading"
        type="password"
    />
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error.message }}
    </div>
    <div class="group-btn-login">
      <my-button
          type="submit"
          id="show-modal"
          :disabled="loading"
      >{{ loading ? 'Обработка...' : 'Вход' }}
      </my-button>
      <my-button form="" @click="handleSignup">
        Регистрация
      </my-button>
    </div>
  </form>
</template>
<script setup>
import {ref, computed} from 'vue'
import {useUserStore} from "@/stores/HTTP/UserStore.js";
import {useErrorStore} from "@/stores/Error/ErrorStore.js";
import MyButton from "@/components/UI/MyButton.vue";
import MyInput from "@/components/UI/MyInput.vue";
import {useRouter} from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const errorStore = useErrorStore()
const form = ref({
  email: '',
  password: ''
})
const loading = computed(() => userStore.loading)
const error = computed(() => errorStore.error)
const handleLogin = async () => {
  const success = await userStore.LOGIN(form.value)
  if (success) {
    router.push({name: 'Home'})
  }
}
const handleSignup = async () => {
  router.push({name: 'Signup'})
}
</script>
<style scoped>
.sign-in-container {
  display: grid;
  row-gap: 20px;
  align-content: start;
  justify-content: center;
}

.group-btn-login {
  display: grid;
  grid-template-columns: max-content max-content;
  column-gap: 20px;
}

.error-message {
  color: #E32029;
  color: #E32029;
}

@media (max-width: 1024px) {
  .group-btn-login {
    grid-template-columns: 1fr;
    row-gap: 20px;
  }
}
</style>