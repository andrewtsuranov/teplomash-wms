<!-- src/components/QRCodePrinter.vue -->
<template>
  <div class="qr-printer">
    <div class="settings">
      <div class="setting-group">
        <label>Позиция X (мм):
          <input
              type="number"
              v-model="positionX"
              min="0"
              step="1"
          />
        </label>
      </div>
      <div class="setting-group">
        <label>Позиция Y (мм):
          <input
              type="number"
              v-model="positionY"
              min="0"
              step="1"
          />
        </label>
      </div>
      <div class="setting-group">
        <label>Размер QR (1-10):
          <input
              type="number"
              v-model="qrSize"
              min="1"
              max="10"
              step="1"
          />
        </label>
      </div>
    </div>
    <button
        @click="printQR"
        :disabled="isPrinting"
        class="print-button"
    >
      {{ isPrinting ? 'Печать...' : 'Напечатать QR-код' }}
    </button>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>
<script setup>
import {ref} from 'vue';
import {printerService} from '@/services/PrinterService';

const isPrinting = ref(false);
const error = ref('');
const positionX = ref(10); // начальная позиция X в мм
const positionY = ref(10); // начальная позиция Y в мм
const qrSize = ref(5);     // размер QR-кода (1-10)
const printQR = async () => {
  if (isPrinting.value) return;
  error.value = '';
  isPrinting.value = true;
  try {
    const qrData = 'https://example.com/product/123'; // Замените на ваши данные
    await printerService.printQRCode(qrData, {
      position: {
        x: Number(positionX.value),
        y: Number(positionY.value)
      },
      size: Number(qrSize.value),
      labelWidth: 50,  // ширина этикетки в мм
      labelHeight: 30  // высота этикетки в мм
    });
  } catch (err) {
    error.value = err.message;
  } finally {
    isPrinting.value = false;
  }
};
</script>
<style scoped>
.qr-printer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.settings {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.setting-group {
  display: flex;
  flex-direction: column;
}

.setting-group label {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.setting-group input {
  padding: 0.25rem;
  width: 80px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.print-button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.print-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
</style>