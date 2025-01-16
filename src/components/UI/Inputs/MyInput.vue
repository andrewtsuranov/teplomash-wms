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
  border-radius: .5rem;
  color: blanchedalmond;
  padding: .5rem 1rem;
  font-size: 1.1rem;
  background: none;
  outline: none;
}


</style>