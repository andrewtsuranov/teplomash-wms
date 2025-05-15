<script setup>
import QRCode from "qrcode";
import { useWebSocketStore } from "@/stores/WebSocketStore.js";
import { useWarehouseStore } from "@/stores/WMSStores/WarehouseStore.js";
import { useERPStore } from "@/stores/WMSStores/ERPStore.js";
import { ref, onMounted, watch } from "vue";
import { usePackingStore } from "@/stores/WMSStores/PackingStore.js";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import SvgLogoERP from "@/components/UI/SVG/svgLogoERP.vue";

const route = useRoute();
const warehouseStore = useWarehouseStore();
const {
  selectedWarehouse,
  selectedZonesByZoneType
} = storeToRefs(warehouseStore);
const webSocketStore = useWebSocketStore();
const ERPStore = useERPStore();
const qrcode = ref(null);
const packingStore = usePackingStore();
const generateQR = async (data) => {
  const opts = {
    errorCorrectionLevel: "H",
    quality: 0.3,
    width: 200,
    margin: 1,
    color: {
      dark: "#000",
      light: "#EEE"
    }
  };
  return new Promise((resolve, reject) => {
    QRCode.toString(data, opts, (err, string) => {
      if (err) reject(err);
      resolve(string);
    });
  });
};
const taskScanData = (task_code) => {
  const data = {
    task_code: task_code,
    variables: {
      warehouse_id: selectedWarehouse.value?.id,
      to_zone_id: selectedZonesByZoneType.value?.id,
      total: 1
    }
  };
  return JSON.stringify(data);
};
const updateQRCode = async () => {
  if (!selectedZonesByZoneType.value?.id) return;
  try {
    if (selectedWarehouse.value.id === 6)
      qrcode.value = await generateQR(taskScanData("CREATE_PALLET_MATERIAL_WITH_SCAN"));
    if (selectedWarehouse.value.id === 1) {
      qrcode.value = await generateQR(taskScanData("CREATE_PALLET_FROM_MANUFACTURE"));
    }
    if (selectedWarehouse.value.id === 2) {
      qrcode.value = await generateQR(taskScanData("CREATE_PALLET_FROM_HIMIKOV"));
    }
  } catch (e) {
    console.log(e);
  }
};
// Отслеживаем изменения warehouse и zones
watch([
    () => selectedWarehouse.value,
    () => selectedZonesByZoneType.value
  ],
  updateQRCode,
  { immediate: true });
onMounted(async () => {
  try {
    await updateQRCode();
  } catch (e) {
    console.log(e);
  }
});
</script>
<template>
  <div class="task-qr-container">
    <SvgLogoERP />
    <div class="task-qr">
      <span class="task-qr-text"><b>Задача:</b><br>Собрать паллету</span>
      <div v-html="qrcode"></div>
    </div>
  </div>
</template>
<style scoped>
.task-qr-container {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  background-color: #2e2e2e;
  border: 1px solid #605039e0;
  border-radius: .5rem;
  padding: 1rem;
}

.task-qr {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: min-content 1fr;
  row-gap: 1rem;
}

.task-qr-text {
  font-size: 1.2rem;
}
</style>