<template>
  <input
    v-model="model"
    class="input"
    :ref="inputRef"
    v-bind="attrsWithoutRef"
  />
</template>

<script setup>
import { defineModel, ref, useAttrs, computed } from "vue";

const model = defineModel();
const inputRef = ref(null);
const attrs = useAttrs();

const attrsWithoutRef = computed(() => {
  const { ref, ...rest } = attrs;
  return rest;
});

defineExpose({
  focus: () => inputRef.value?.focus(),
});
</script>

<style scoped>
.input {
  width: 100%;
  border: 1px solid blanchedalmond;
  border-radius: 0.5rem;
  color: blanchedalmond;
  padding: 0.5rem 1rem;
  font-size: 1.1rem;
  background: none;
  outline: none;
}
</style>
