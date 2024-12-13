<template>
  <div class="dropdown-wrapper" ref="dropDown">
    <div class="dropdown-selected-option"
         @click="isDropdownVisible = !isDropdownVisible"
    >
      {{ mappedSelectOption }} <span>&#9663;</span>
    </div>
    <transition>
      <div class="options-wrapper"
           v-if="isDropdownVisible"
      >
        <div class="option"
             v-for="(option, index) in options"
             :key="index"
             @click="toggleOptionSelect(option)"
        >{{ option.name || option }}
        </div>
      </div>
    </transition>
  </div>
</template>
<script setup>
import {computed, onBeforeUnmount, onMounted, ref} from "vue";

defineProps({
  options: {
    type: Array,
    required: true
  },
  modelValue: {
    default: null
  }
})
const emit = defineEmits([
  'update:modelValue'
])
const dropDown = ref('')
const isDropdownVisible = ref(false)
const selectedOption = ref('')
const toggleOptionSelect = (option) => {
  selectedOption.value = option
  emit('update:modelValue', option.value)
  isDropdownVisible.value = false
}
const mappedSelectOption = computed(() => {
  return (selectedOption.value?.name || selectedOption.value) || 'Пожалуйста, выберете из списка...'
})
const closeDropdown = (el) => {
  if (!dropDown.value.contains(el.target)) {
    isDropdownVisible.value = false
  }
}
onMounted(() => {
  window.addEventListener('click', closeDropdown)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', closeDropdown)
})
</script>
<style scoped>
.dropdown-wrapper {
  font-size: 1.1rem;
  cursor: pointer;
  margin: 0 auto;
  width: 100%;
}

.dropdown-selected-option {
  padding: 8px;
  /*color: #897f72;*/
  box-sizing: border-box;
  margin-bottom: 4px;
  border: 1px solid blanchedalmond;
  border-radius: 10px;
}

.option:hover {
  background: rgba(0, 0, 200, 0.5);
}

.option {
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid blanchedalmond;
}

.option:first-of-type {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.option:last-of-type {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>