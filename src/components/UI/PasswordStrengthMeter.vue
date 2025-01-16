
<template>
  <div class="password-strength mt-2">
    <div class="progress" style="height: 4px;">
      <div
          class="progress-bar"
          role="progressbar"
          :style="{ width: `${strength}%` }"
          :class="strengthClass"
          :aria-valuenow="strength"
          aria-valuemin="0"
          aria-valuemax="100"
      ></div>
    </div>
    <small class="d-block mt-1" :class="textColorClass">
      {{ strengthText }}
    </small>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  strength: {
    type: Number,
    required: true,
    default: 0
  }
});

const strengthClass = computed(() => {
  if (props.strength <= 20) return 'bg-danger';
  if (props.strength <= 40) return 'bg-warning';
  if (props.strength <= 60) return 'bg-info';
  if (props.strength <= 80) return 'bg-primary';
  return 'bg-success';
});

const textColorClass = computed(() => {
  if (props.strength <= 20) return 'text-danger';
  if (props.strength <= 40) return 'text-warning';
  if (props.strength <= 60) return 'text-info';
  if (props.strength <= 80) return 'text-primary';
  return 'text-success';
});

const strengthText = computed(() => {
  if (props.strength <= 20) return 'Очень слабый пароль';
  if (props.strength <= 40) return 'Слабый пароль';
  if (props.strength <= 60) return 'Средний пароль';
  if (props.strength <= 80) return 'Хороший пароль';
  return 'Отличный пароль';
});
</script>