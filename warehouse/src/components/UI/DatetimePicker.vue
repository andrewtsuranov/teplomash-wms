<template>
  <div class="datetime-picker-wrapper">
    <!-- Выпадающее окно с выбором даты -->
    <div class="datetime-range">
      <!-- Начальная дата и время -->
      <label class="datetime-label">Начало периода</label>
      <label class="datetime-label">Конец периода</label>
      <div class="datetime-group start">
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
    </div>
    <!-- Кнопки управления -->
    <div class="picker-actions">
      <div class="group-btn-picker">
        <button
            @click="clearSelection"
            class="btn btn-outline-light"
        >
          Очистить
        </button>
        <button
            @click="applySelection"
            class="btn btn-outline-primary"
            :disabled="!isValidRange"
        >
          Применить
        </button>
      </div>
    </div>
    <!-- Сообщение об ошибке -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>
<script setup>
import {ref, computed} from 'vue'

const emit = defineEmits(['update:range'])
// Состояния
// const startDate = ref('2022-10-05');
// const endDate = ref('2022-10-05');
// const selectedTimeStart = ref('09:00')
// const selectedTimeEnd = ref('10:00')
// const getTimeForERP = (date, time) => {
//   const dateTime = date + " " + time;
//   const currentDate = new Date(dateTime);
//   const year = currentDate.getFullYear();
//   const month = String(currentDate.getMonth() + 1).padStart(2, '0');
//   const day = String(currentDate.getDate()).padStart(2, '0');
//   const hours = String(currentDate.getHours()).padStart(2, '0');
//   const minutes = String(currentDate.getMinutes()).padStart(2, '0');
//   const seconds = String(currentDate.getSeconds()).padStart(2, '0');
//   return `${year}${month}${day}${hours}${minutes}${seconds}`;
const startDate = ref('')
const startTime = ref('')
const endDate = ref('')
const endTime = ref('')
const errorMessage = ref('')
const selectedDateRange = ref('')
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
  }
}
</script>
<style scoped>
.datetime-picker-wrapper {
  display: grid;
  grid-template-rows: 1fr auto;
  max-width: 800px;
  row-gap: 1rem;
}

.picker-actions {
  display: grid;
  grid-template-columns: 15rem;
  grid-template-rows: min-content;
}

.group-btn-picker {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1rem;
}

.datetime-range {
  display: grid;
  grid-template-columns: repeat(2, minmax(auto, 300px));
  grid-template-rows: repeat(2, min-content);
  column-gap: 3rem;
  row-gap: .5rem;
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
  grid-template-columns: 9fr 8fr;
  gap: 1rem;
}

.custom-date,
.custom-time {
  position: relative;
}

.custom-date input,
.custom-time input {
  width: 100%;
  padding: .5rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  color: #1a202c;
  transition: all 0.2s ease;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
}

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
@media (max-width: 800px) {
  .datetime-picker-wrapper {
    display: grid;
    grid-auto-rows: min-content;
  }

  .datetime-range {
    display: grid;
    grid-template-columns: 1fr;
    /*grid-template-rows: repeat(2, min-content);*/
    column-gap: 3rem;
    row-gap: .5rem;
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