<template>
  <div class="password-wrapper">
    <input
        v-bind="$attrs"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :type="passwordType"
        class="form-control"
    />
    <button
        class="password-toggle"
        type="button"
        @click="togglePasswordVisibility"
    >
      <i :class="passwordIconClass" />
    </button>
  </div>
</template>

<script setup>
import { usePasswordToggle } from '@/composables/Validations/usePasswordToggle.js'

defineProps(['modelValue'])
defineEmits(['update:modelValue'])

const { passwordType, passwordIconClass, togglePasswordVisibility } = usePasswordToggle()
</script>