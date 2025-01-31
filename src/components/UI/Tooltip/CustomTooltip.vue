<template>
  <div class="tooltip-wrapper">
    <div
        class="trigger"
        @mouseenter="showTooltip"
        @mouseleave="hideTooltip"
    >
      <slot></slot>
    </div>

    <Transition name="fade">
      <div
v-if="isVisible"
class="tooltip-custom"
:style="tooltipStyle"
      >
        {{ text }}
      </div>
    </Transition>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const props = defineProps({
  text: String,
})

// Состояние видимости подсказки
const isVisible = ref(false)

// Позиция подсказки
const tooltipStyle = ref({
  left: '0',
  top: '0',
})

// Показ подсказки
const showTooltip = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  tooltipStyle.value = {
    left: `${rect.left}px`,
    top: `${rect.bottom + 5 }px`, // Отступ 5px от элемента
  }
  isVisible.value = true
}

// Скрытие подсказки
const hideTooltip = () => {
  isVisible.value = false
}
</script>
<style scoped>
.tooltip-wrapper {
  display: inline-grid;
}

.trigger {
  display: inline-block;
}

.tooltip-custom {
  position: fixed;
  padding: 8px 12px;
  background: #333;
  color: white;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  pointer-events: none; /* Чтобы подсказка не перехватывала события */
}

/* Анимация появления/исчезновения */
.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>