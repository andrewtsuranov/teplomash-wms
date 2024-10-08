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
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  padding-inline: 20px;
  background: none;
  color: blanchedalmond;
  border: 1px solid blanchedalmond;
  border-radius: 20px;
  font-size: 1rem;

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