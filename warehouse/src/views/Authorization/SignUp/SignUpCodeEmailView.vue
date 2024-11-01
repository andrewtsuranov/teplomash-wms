<template>
  <div class="confirm-wrapper">
    <h5>На ваш почтовый ящик отправлен код подтверждения. Для завершения регистрации введите полученный код:</h5>
    <my-input
        v-model="sixdigit"
        maxlength="6"
        placeholder="Введите 6-значный код"
        required
        size="6"
        type="text"
    />
    <my-button
        :disabled=isDisabled()
        @click="[userStore.REQ_CONFIRM(sixdigit), router.push({path: '/'})]"

    >Подтвердить
    </my-button>
    <my-button
        :disabled=isDisabled()
    >Получить код повторно</my-button>
  </div>
</template>
<script setup>
import MyInput from "@/components/UI/MyInput.vue";
import MyButton from "@/components/UI/MyButton.vue"
import {ref} from "vue";
import {useUserStore} from "@/stores/HTTP/Auth/UserStore.js";
import router from "@/router/index.js";

const userStore = useUserStore()

const sixdigit = ref('')
const isDisabled = () => !(sixdigit.value.length === 6)


</script>
<style scoped>
.confirm-wrapper {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 15px;
  color: blanchedalmond;
}
</style>