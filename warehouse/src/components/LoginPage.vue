<template>
  <div class="login-head">
    Войдите, чтобы продолжить
  </div>
  <div class="login-input">
    <input v-bind:value="email"
           @input="email = $event.target.value"
           type="text"
           placeholder="Введите email...">
    <input v-bind:value="password"
           @input="password = $event.target.value"
           type="text"
           placeholder="Введите пароль...">
  </div>
  <button v-on:click="login">Войти</button>
  <button>Зарегистрироваться</button>
</template>
<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  methods: {
    login() {
      const logUser = {
        email: this.email,
        password: this.password
      }
      console.log(logUser)
    }
  }
}
</script>
<style scoped>
.login-head {
  color: aquamarine;
  font-size: 30px;
}

.login-input {
  display: grid;
  gap: 10px;
  max-height: 100vh;
}
</style>