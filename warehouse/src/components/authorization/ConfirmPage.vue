<template>
  <div class="confirm-wrapper">
    <h3>На ваш почтовый ящик отправлен код подтверждения. Для завершения регистрации введите полученный код:</h3>
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
    >Подтвердить
    </my-button>
    <my-button>Получить код повторно</my-button>
  </div>
</template>
<script setup>
import MyInput from "@/components/UI/MyInput.vue";
import MyButton from "@/components/UI/MyButton.vue"
import {ref} from "vue";

const digit = () => ({
  "sixdigit": sixdigit.value,
})
const sixdigit = ref('')
const isDisabled = () => !(digit().sixdigit.length === 6)
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