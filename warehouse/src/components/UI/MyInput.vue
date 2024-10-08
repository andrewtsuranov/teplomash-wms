<template>
  <input v-model="model"
         class="input"
  >
</template>
<script setup>
const model = defineModel()
</script>
<style scoped>
.input {
  width: 100%;
  border: 1px solid blanchedalmond;
  border-radius: 10px;
  color: blanchedalmond;
  padding: 10px 15px;
  font-size: 1.1rem;
  background: none;
  outline: none;
}


</style>