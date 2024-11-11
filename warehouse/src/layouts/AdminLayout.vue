<template>
  <div class="datetime-picker-wrapper">
    <!-- Toggle кнопка -->
    <button
        class="toggle-button"
        :class="{ 'active': isPickerVisible }"
        @click="togglePicker"
        ref="toggleButton"
    >
            <span class="toggle-icon">
              <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </span>
      <span class="toggle-text">
        {{ selectedDateRange || 'Выберите период' }}
      </span>
      <span class="toggle-arrow" :class="{ 'rotated': isPickerVisible }">
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
        >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
      </span>
    </button>
    <!-- Выпадающее окно с выбором даты -->
    <div
        v-if="isPickerVisible"
        class="picker-dropdown"
        ref="pickerDropdown"
    >
      <div class="datetime-range-container">
        <h2 class="datetime-range-title">{{ title }}</h2>
        <!-- Начальная дата и время -->
        <div class="datetime-group start">
          <label class="datetime-label">Начало периода</label>
          <div class="input-grid">
            <div class="custom-date">
              <input
                  type="date"
                  :value="startDate"
                  @input="updateStartDate"
                  :min="minDate"
                  :max="endDate || maxDate"
              >
              <span class="calendar-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </span>
            </div>
            <div class="custom-time">
              <input
                  type="time"
                  :value="startTime"
                  @input="updateStartTime"
                  :min="getMinTime"
                  :required="!!startDate"
              >
              <span class="time-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </span>
            </div>
          </div>
        </div>
        <!-- Конечная дата и время -->
        <div class="datetime-group end">
          <label class="datetime-label">Конец периода</label>
          <div class="input-grid">
            <div class="custom-date">
              <input
                  type="date"
                  :value="endDate"
                  @input="updateEndDate"
                  :min="startDate || minDate"
                  :max="maxDate"
                  :required="!!startDate"
              >
              <span class="calendar-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </span>
            </div>
            <div class="custom-time">
              <input
                  type="time"
                  :value="endTime"
                  @input="updateEndTime"
                  :min="getMinEndTime"
                  :required="!!endDate"
              >
              <span class="time-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </span>
            </div>
          </div>
        </div>
        <!-- Кнопки управления -->
        <div class="picker-actions">
          <button
              @click="clearSelection"
              class="btn-secondary"
          >
            Очистить
          </button>
          <button
              @click="applySelection"
              class="btn-primary"
              :disabled="!isValidRange"
          >
            Применить
          </button>
        </div>
        <!-- Сообщение об ошибке -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, computed} from 'vue'
import {useClickOutside} from '@/composables/vClickOutside'

defineProps({
  title: {
    type: String,
    default: 'Выберите период'
  }
})
const emit = defineEmits(['update:range'])
// Состояния
const isPickerVisible = ref(false)
const toggleButton = ref(null)
const startDate = ref('')
const startTime = ref('')
const endDate = ref('')
const endTime = ref('')
const errorMessage = ref('')
const selectedDateRange = ref('')
const pickerDropdown = ref(null)
// Вычисляемые значения
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})
const maxDate = computed(() => {
  const date = new Date()
  date.setFullYear(date.getFullYear() + 1)
  return date.toISOString().split('T')[0]
})
const getMinTime = computed(() => {
  if (startDate.value === minDate.value) {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  }
  return '00:00'
})
const getMinEndTime = computed(() => {
  if (endDate.value === startDate.value) {
    return startTime.value || '00:00'
  }
  return '00:00'
})
const isValidRange = computed(() => {
  if (!startDate.value || !startTime.value) return false
  if (!endDate.value || !endTime.value) return false
  const start = new Date(`${startDate.value}T${startTime.value}`)
  const end = new Date(`${endDate.value}T${endTime.value}`)
  return start <= end
})
// Методы
const togglePicker = () => {
  isPickerVisible.value = !isPickerVisible.value
}
const closePicker = () => {
  isPickerVisible.value = false
}
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
const formatTime = (time) => {
  return time
}
const updateStartDate = (event) => {
  startDate.value = event.target.value
  if (!startTime.value) {
    startTime.value = getMinTime.value
  }
  validateRange()
}
const updateStartTime = (event) => {
  startTime.value = event.target.value
  validateRange()
}
const updateEndDate = (event) => {
  endDate.value = event.target.value
  if (!endTime.value) {
    endTime.value = getMinEndTime.value
  }
  validateRange()
}
const updateEndTime = (event) => {
  endTime.value = event.target.value
  validateRange()
}
const validateRange = () => {
  errorMessage.value = ''
  if (!startDate.value || !startTime.value) {
    errorMessage.value = 'Укажите дату и время начала'
    return false
  }
  if (!endDate.value || !endTime.value) {
    errorMessage.value = 'Укажите дату и время окончания'
    return false
  }
  const start = new Date(`${startDate.value}T${startTime.value}`)
  const end = new Date(`${endDate.value}T${endTime.value}`)
  if (end < start) {
    errorMessage.value = 'Дата окончания не может быть раньше даты начала'
    return false
  }
  return true
}
const clearSelection = () => {
  startDate.value = ''
  startTime.value = ''
  endDate.value = ''
  endTime.value = ''
  selectedDateRange.value = ''
  errorMessage.value = ''
  emit('update:range', null)
}
const applySelection = () => {
  if (validateRange()) {
    const range = {
      start: {
        date: startDate.value,
        time: startTime.value
      },
      end: {
        date: endDate.value,
        time: endTime.value
      }
    }
    selectedDateRange.value = `${formatDate(startDate.value)} ${formatTime(startTime.value)} - ${formatDate(endDate.value)} ${formatTime(endTime.value)}`
    emit('update:range', range)
    closePicker()
  }
}
useClickOutside(pickerDropdown, toggleButton, () => {
  closePicker()
})
</script>
<style scoped>
.datetime-picker-wrapper {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.toggle-button {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-button:hover {
  border-color: #cbd5e0;
}

.toggle-button.active {
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

.toggle-icon {
  color: #718096;
  margin-right: 0.75rem;
}

.toggle-text {
  flex: 1;
  text-align: left;
  color: #1a202c;
  font-size: 1rem;
}

input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator {
  /*background-color: yellow;*/
  /*  opacity: 0;*/
  /*  width: 100%;*/
  /*  height: 100%;*/
  /*  position: absolute;*/
  /* */
  /*  top: 0;*/
  /*  left: 0;*/
  /*  cursor: pointer;*/
}

.toggle-arrow {
  color: #718096;
  transition: transform 0.2s ease;
}

.toggle-arrow.rotated {
  transform: rotate(180deg);
}

.picker-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  z-index: 50;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  animation: fadeIn 0.2s ease;
}

.datetime-range-container {
  padding: 1.5rem;
}

.datetime-range-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 1.5rem 0;
}

.datetime-group {
  display: grid;
  gap: 0.5rem;
}

.datetime-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
}

.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/*.custom-date,*/
/*.custom-time {*/
/*  position: relative;*/
/*}*/
/*.custom-date input,*/
/*.custom-time input {*/
/*  width: 100%;*/
/*  padding: 0.75rem 2.5rem 0.75rem 1rem;*/
/*  border: 2px solid #e2e8f0;*/
/*  border-radius: 8px;*/
/*  font-size: 1rem;*/
/*  background: white;*/
/*  color: #1a202c;*/
/*  transition: all 0.2s ease;*/
/*  cursor: pointer;*/
/*  appearance: none;*/
/*  -webkit-appearance: none;*/
/*}*/
.custom-date input:hover,
.custom-time input:hover {
  border-color: #cbd5e0;
}

.custom-date input:focus,
.custom-time input:focus {
  outline: none;
  border-color: #9B9482;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

.calendar-icon,
.time-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #718096;
  pointer-events: none;
}

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

/* Медиа-запросы для адаптивности */
@media (max-width: 640px) {
  .datetime-range-container {
    padding: 1rem;
  }

  .input-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .custom-date input,
  .custom-time input {
    padding: 0.625rem 2.5rem 0.625rem 0.75rem;
    font-size: 0.875rem;
  }
}
</style>