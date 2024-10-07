<template>
  <button class="btn" :disabled="props.disabled">
    <slot></slot>
  </button>
</template>
<script setup>
const props = defineProps({
  disabled: Boolean,
})
</script>
<style scoped>
.btn {
  padding: 10px 20px;
  background: none;
  color: blanchedalmond;
  border: 1px solid blanchedalmond;
  border-radius: 20px;
  font-size: 1rem;
  margin-right: 15px;
}

.btn:hover {
  background-color: blanchedalmond;
  /*background-color: rgba(255, 255, 255, 0.2);*/
  cursor: pointer;
  transition: background-color 0.5s;
  color: black;
}

.btn:disabled {
  color: grey;
  border: 1px solid grey;
  cursor: default;
}

.btn:disabled:hover {
  background: none;
}
</style>