<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { usePalletStore } from "@/stores/WMSStores/PalletStore.js";
import { useTranslationsDictionary } from "@/composables/Dictionary/useTransactionsDictionary.js";
import QRCode from "qrcode";
import { useFormatDate } from "@/composables/Date/useFormatDate.js";
import { useWebSocketStore } from "@/stores/WebSocketStore.js";
import { usePackingStore } from "@/stores/WMSStores/PackingStore.js";

const palletStore = usePalletStore();
const webSocketStore = useWebSocketStore();
const packingStore = usePackingStore();
const translationsDictionary = useTranslationsDictionary;
const palletVisibility = ref("");

// Реактивный массив для ID паллет, которые нужно исключить из рендеринга
const canceledPalletIds = ref([]);

// Состояние компонента
const isLoading = ref(false);
const { formatTimestamp } = useFormatDate();

// Статусы транзакций
const TRANSACTION_STATUS = {
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELED: "CANCELED",
};

// Проверка статусов
const isProgress = (pallet) => pallet.status === "IN_PROGRESS";
const isCompleted = (pallet) => pallet.status === "COMPLETED";
const isCanceled = (pallet) => pallet.status === "CANCELED";

// Получение текста статуса из словаря
const getStatusText = (status) => {
  return translationsDictionary[status] || status;
};

// Создание QR-кода
const generateQR = async (data) => {
  const opts = {
    errorCorrectionLevel: "H",
    quality: 0.1,
    width: 90,
    margin: 0,
    color: {
      dark: "#000",
      light: "none",
    },
  };
  return new Promise((resolve, reject) => {
    QRCode.toString(data, opts, (err, string) => {
      if (err) reject(err);
      resolve(string);
    });
  });
};

// Функция для добавления ID отменённой паллеты с задержкой
const schedulePalletRemoval = (palletId) => {
  setTimeout(() => {
    canceledPalletIds.value = [...canceledPalletIds.value, palletId];
  }, 10000); // 10 секунд
};

// Фильтрация паллет, исключая те, что уже должны быть удалены
const filteredPallets = computed(() =>
    palletStore.getTransactionsByTypeADD_PALLET.filter(
        (pallet) => !canceledPalletIds.value.includes(pallet.id)
    )
);

onMounted(async () => {
  isLoading.value = true;
  try {
    const pallets = palletStore.getTransactionsByTypeADD_PALLET;
    for (const pallet of pallets) {
      if (pallet.pallet?.barcode) {
        pallet.qrCode = await generateQR(pallet.pallet.barcode);
      } else {
        pallet.qrCode = null;
      }
      // Немедленно исключаем ранее отменённые паллеты
      if (pallet.status === "CANCELED") {
        canceledPalletIds.value = [...canceledPalletIds.value, pallet.id];
      }
    }
  } catch (error) {
    console.error("Ошибка при генерации QR-кодов:", error);
  } finally {
    isLoading.value = false;
  }
});

watch(
    () => palletStore.getTransactionsByTypeADD_PALLET,
    async (newPallets, oldPallets) => {
      for (const pallet of newPallets) {
        if (pallet.pallet?.barcode && !pallet.qrCode) {
          pallet.qrCode = await generateQR(pallet.pallet.barcode);
          await webSocketStore.GET_UNREGISTERED_ITEMS();
          if (packingStore.isShownTableItemUnregProduct) {
            await packingStore.closeTableItemUnregProduct();
          }
        }
        // Проверяем, изменился ли статус на CANCELED
        const oldPallet = oldPallets?.find((p) => p.id === pallet.id);
        if (pallet.status === "CANCELED" && oldPallet?.status !== "CANCELED") {
          schedulePalletRemoval(pallet.id);
        }
      }
    },
    { deep: true }
);
</script>

<template>
  <div class="wms-packing-pallet">
    <template v-for="pallet in filteredPallets" :key="pallet.id">
      <div
          v-if="palletVisibility !== pallet.status"
          :class="[
          'pallet-status',
          'pallet-background',
          {
            in_progress: isProgress(pallet),
            completed: isCompleted(pallet),
            canceled: isCanceled(pallet)
          }
        ]"
          class="pallet-item-content"
      >
        <div class="pallet-item-row-one">
          <div class="piro">
            <div class="piro-id">Паллета #{{ pallet.pallet?.id || pallet.id}}</div>
            <div v-if="pallet.pallet" class="piro-abc">Класс: {{ pallet.pallet?.abc_class }}</div>
            <div v-if="pallet.pallet" class="piro-size">Габарит: {{ pallet.pallet?.length }} мм</div>
            <div v-if="pallet.pallet" class="piro-qyt">Кол-во груза: {{ pallet.pallet?.items.length }} шт</div>
          </div>
          <div v-if="pallet.qrCode" class="pirt-qr" v-html="pallet.qrCode"></div>
        </div>
        <div class="pallet-item-row-two">
          <div style="font-size: 1.2rem; font-weight: bold">{{ pallet.pallet?.barcode || 'Ожидание данных...' }}</div>
          <div v-if="pallet.pallet">Зона: {{ pallet.zone_info.to_zone.name.replace(/_/g, ' ') }}</div>
        </div>
        <div class="pallet-item-row-three">
          <div>Статус: {{ getStatusText(pallet.status) }}</div>
          <div>Создано: {{ formatTimestamp(pallet.timestamp).date }} {{ formatTimestamp(pallet.timestamp).time }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.wms-packing-pallet {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: minmax(350px, 1fr);
}

.pallet-item-content {
  display: grid;
  padding: 1rem;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: min-content auto min-content;
  row-gap: 0.7rem;
  background-color: #d9d9d9;
  border-radius: 1rem;
  color: #2f2d2b;
  font-family: Helvetica, Arial, sans-serif;
  transition: border-color 0.3s ease;
}

.pallet-item-row-one {
  display: grid;
  font-weight: bold;
  grid-template-columns: auto 1fr;
}

.piro {
  display: grid;
  grid-auto-rows: min-content;
  grid-template-columns: minmax(auto, 1fr);
}

.piro-id {
  font-size: 1.7rem;
}

.pallet-item-row-two {
  display: grid;
  grid-template-columns: auto;
  overflow-y: auto;
}

.pallet-item-row-three {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;
}

.pirt-qr {
  display: grid;
  justify-self: end;
}

/* Стили для статусов */
.pallet-status.in_progress,
.pallet-background.in_progress {
  border: 0.5rem solid #ecaf0e; /* Желтая рамка для PENDING */
}

.pallet-status.completed,
.pallet-background.completed {
  border: 0.5rem solid #19da21; /* Зеленая рамка для COMPLETED */
}

.pallet-status.canceled,
.pallet-background.canceled {
  border: 0.5rem solid #e80f0f; /* Красная рамка для CANCELED */
}

/* Стиль для мигания */
.pallet-status.canceled,
.pallet-background.canceled {
  animation-duration: 1s;
  animation-iteration-count: 10; /* 10 секунд */
  animation-name: blinking;
}

@keyframes blinking {
  0%,
  100% {
    border-color: #e80f0f; /* Красный */
  }
  50% {
    border-color: #ecaf0e; /* Желтый */
  }
}

@media (max-width: 800px) {
  .wms-packing-pallet {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
}
</style>