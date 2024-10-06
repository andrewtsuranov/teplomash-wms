<template>
  <input :value="props.modelValue" @input="emit('update:modelValue', $event.target.value)" class="input" type="text">
</template>
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>
<style scoped>
.input {
  width: 100%;
  border: 1px solid teal;
  padding: 10px 15px;
  margin-top: 15px;
}
</style>