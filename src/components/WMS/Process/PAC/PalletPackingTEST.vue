<script setup>
import { useWarehouseStore } from "@/stores/WMSStores/WarehouseStore.js";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import QRCode from "qrcode";
import { useWebSocketStore } from "@/stores/WebSocketStore.js";
import { usePalletStore } from "@/stores/WMSStores/PalletStore.js";

const webSocketStore = useWebSocketStore();
const warehouseStore = useWarehouseStore();
const palletStore = usePalletStore()
const packingPalletData = computed(() =>
  warehouseStore.detailedZoneStatistics?.zones[0].pallets || null
);
// Создание QR-кода
const generateQR = async (data) => {
  const opts = {
    errorCorrectionLevel: "H",
    quality: 0.1,
    width: 90,
    margin: 0,
    color: {
      dark: "#000",
      light: "none"
    }
  };
  return new Promise((resolve, reject) => {
    QRCode.toString(data, opts, (err, string) => {
      if (err) reject(err);
      resolve(string);
    });
  });
};
const showORCode = async (palletData) => {
  try {
    if (palletData?.length > 0 && Array.isArray(palletData)) {
      await Promise.all(
        palletData.map(async (pallet) => {
          try {
            pallet.qrCode = pallet.barcode ? await generateQR(pallet.barcode) : null;
          } catch (error) {
            console.error(`Ошибка генерации QR для паллета ${pallet.barcode}:`, error);
            pallet.qrCode = null;
          }
        })
      );
    }
  } catch (e) {
    console.log(e);
  }
};
// watch(
//   () => palletStore.getTransactionsByTypeADD_PALLET,
//   async (newPallets, oldPallets) => {
//    if (newPallets[0].status === 'COMPLETED') {
//      await webSocketStore.ensureConnected();
//      await webSocketStore.GET_WAREHOUSE_ZONE_STATISTICS(
//        warehouseStore.selectedWarehouse.id,
//        warehouseStore.selectedZonesByZoneType.id,
//        true
//      )}
//   },
//   { deep: true }
// );
watch(
  packingPalletData,
  async (newPallets) => {
    try {
      await showORCode(newPallets);
    } catch (e) {
      console.log(e);
    }
  },
  { immediate: true }
);
</script>
<template>
  <div v-if="!packingPalletData"
       class="spinner-border text-warning"
       role="status"
  >
    <span class="visually-hidden">Loading...</span>
  </div>
  <div v-else
       class="wms-packing-pallet"
  >
    <template v-for="(pallet) in packingPalletData"
              :key="pallet.id">
      <div class="pallet-item-content">
        <div class="pallet-item-row-one">
          <div class="piro">
            <div class="piro-id">Паллета #{{ pallet.id }}</div>
            <div class="piro-qyt">Кол-во груза: {{ pallet.items_count }} шт</div>
          </div>
          <div v-if="pallet.qrCode" class="pirt-qr" v-html="pallet.qrCode"></div>
        </div>
        <div class="pallet-item-row-two">
          <!--          <div style="font-size: 1.2rem; font-weight: bold">{{ pallet.barcode}}</div>-->
          <div v-for="(item) in pallet.product_types
" style="font-size: 1.2rem; font-weight: bold">
            {{ item.name }}
          </div>
          <!--          <div v-if="pallet.pallet">Зона: {{ pallet.zone_info.to_zone?.name.replace(/_/g, ' ') }}</div>-->
        </div>
        <div class="pallet-item-row-three">
          <!--          <div>Статус: {{ getStatusText(pallet.status) }}</div>-->
          <!--          <div>Создано: {{ formatTimestamp(pallet.timestamp).date }} {{ formatTimestamp(pallet.timestamp).time }}</div>-->
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
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: min-content auto min-content;
  row-gap: 0.7rem;
  padding: 1rem;
  color: #2f2d2b;
  background-color: #d9d9d9;
  border: 0.5rem solid #19da21;
  border-radius: 1rem;
  font-family: Helvetica, Arial, sans-serif;
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


@media (max-width: 800px) {
  .wms-packing-pallet {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
}
</style>