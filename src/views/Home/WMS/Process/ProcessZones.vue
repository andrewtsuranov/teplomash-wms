<script setup>
import {useWarehouseStore} from "@/stores/WMSStores/WarehouseStore.js";
import {computed, onActivated, onMounted, ref, watch} from "vue";
import {onBeforeRouteUpdate, useRoute, useRouter} from "vue-router";
import gsap from 'gsap'
import {useGeneralDictionary} from "@/composables/Dictionary/useGeneralDictionary.js";
import Button78 from "@/components/UI/Buttons/button78.vue";
import {useWebSocketStore} from "@/stores/WebSocketStore.js";

const router = useRouter();
const route = useRoute();
const warehouseStore = useWarehouseStore();
const webSocketStore = useWebSocketStore()
// Реактивные переменные
const selectedPackingZone = ref(null);
const animatedTotalArea = ref(0);
const animatedOccupiedArea = ref(0);
const animatedCapacityPercentage = ref(0);
const props = defineProps({
  process: {
    type: String || Number,
    required: true,
  },
  processRouteName: {
    type: String,
    required: true,
  },
});
// Анимация total_area
const animateTotalArea = (newValue) => {
  gsap.killTweensOf(animatedTotalArea); // Очищаем предыдущие анимации
  animatedTotalArea.value = 0; // Сбрасываем значение
  gsap.to(animatedTotalArea, {
    duration: .5,
    value: Number(newValue.total_area) || 0,
  });
};
// Анимация occupied_area
const animateOccupiedArea = (newValue) => {
  gsap.killTweensOf(animatedOccupiedArea); // Очищаем предыдущие анимации
  animatedOccupiedArea.value = 0; // Сбрасываем значение
  gsap.to(animatedOccupiedArea, {
    duration: .5,
    value: Number(newValue.occupied_area) || 0,
  });
};
// Анимация occupancy_percentage
const animateCapacityPercentage = (newValue) => {
  gsap.killTweensOf(animatedCapacityPercentage); // Очищаем предыдущие анимации
  animatedCapacityPercentage.value = 0; // Сбрасываем значение
  gsap.to(animatedCapacityPercentage, {
    duration: .5,
    value: Number(newValue.occupancy_percentage) || 0,
  });
};
const handleZoneClick = async (zone) => {
  if (webSocketStore.isConnected) {
    webSocketStore.GET_WAREHOUSE_ZONE_STATISTICS(warehouseStore.selectedWarehouse.id, zone.id, true)
    warehouseStore.setSelectedZonesByZoneType(zone);
    await router.push({
      name: props.processRouteName,
      params: {
        idWarehouse: route.params.idWarehouse,
        code: zone.code.toLowerCase()
      },
    });
  }
};
// Отслеживание изменений selectedPackingZone
watch(
    selectedPackingZone,
    (newValue) => {
      if (newValue && newValue.total_area !== undefined && newValue.occupied_area !== undefined) {
        animateTotalArea(newValue);
        animateOccupiedArea(newValue);
        animateCapacityPercentage(newValue);
      } else {
        animatedTotalArea.value = 0;
        animatedOccupiedArea.value = 0;
        animatedCapacityPercentage.value = 0;
      }
    },
    {immediate: true}
);
onMounted(async () => {
  try {
    if (warehouseStore.selectedZonesByZoneType) {
      selectedPackingZone.value = await warehouseStore.zonesByZoneType[0]
      await handleZoneClick(selectedPackingZone.value)
    }
  } catch (e) {
    console.log(e)
  }
})
</script>
<template>
  <div class="wms-zone-container">
    <div class="wms-zone-select">
      <select id="selectZone"
              v-model="selectedPackingZone"
              aria-label="Выберите зону"
              class="form-select"
              data-bs-theme="dark"
              @change="handleZoneClick(selectedPackingZone)"
      >
        <option :value="null" disabled>Выберите зону</option>
        <option v-for="zone in warehouseStore.zonesByZoneType"
                :key="zone.id"
                :value="zone"
        >
          {{ zone.name.replace(/_/g, " ").toUpperCase() }}
        </option>
      </select>
    </div>
    <div class="wms-zone-info">
      <div class="wms-zone-name"
      >
        {{ selectedPackingZone?.name ? selectedPackingZone.name.replace(/_/g, " ") : 'Выберите зону' }}
      </div>
      <div class="wms-zone-detail">
        <div class="wms-zone-detail-item">
          <div class="wms-zone-detail-item--item-name">Общая площадь:</div>
          <div class="wms-zone-detail-item--item-value">
            {{ animatedTotalArea.toFixed(0) }}
            <span style="font-size:1.5rem">м<sup>2</sup></span>
          </div>
        </div>
        <div class="wms-zone-detail-item">
          <div class="wms-zone-detail-item--item-name"> Занято:</div>
          <div class="wms-zone-detail-item--item-value">
            {{ animatedOccupiedArea.toFixed(2) }}
            <span style="font-size:1.5rem">м<sup>2</sup></span></div>
        </div>
        <div class="wms-zone-detail-item">
          <div class="wms-zone-detail-item--item-name">Загруженность:</div>
          <div :class="{
            partially: selectedPackingZone?.status === 'PARTIALLY',
            available: selectedPackingZone?.status === 'AVAILABLE',
            occupied: selectedPackingZone?.status === 'OCCUPIED'
          }"
               class="wms-zone-detail-item--item-value"
          >
            {{ animatedCapacityPercentage.toFixed(1) }}
            <span style="font-size: 1.5rem">%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.wms-zone-container {
  display: grid;
  grid-template-columns: max-content minmax(auto, 1fr);
  column-gap: 5rem;
  padding-bottom: 2rem;
}

.wms-zone-info {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: auto auto;
  row-gap: 1rem;
}

.wms-zone-name {
  display: grid;
  align-items: center;
  background-color: #2e2e2e;
  border: 1px solid #605039e0;
  border-radius: 10px;
  padding: .5rem 1rem;
  text-transform: uppercase;
  font-size: 1.5rem;
}

.wms-zone-detail {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
  column-gap: 1.5rem;
}

.wms-zone-detail-item {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: min-content auto;
  place-items: center;
  background-color: #0000004a;
  border: 1px solid #605039e0;
  border-radius: 10px;
}

.wms-zone-detail-item--item-name {
  padding: .3rem 0;
  font-size: 1.2rem;
}

.wms-zone-detail-item--item-value {
  font-size: 2.8rem;
}

.wms-zone-detail-item--item-value.partially {
  color: #ecaf0e;
}

.wms-zone-detail-item--item-value.available {
  color: #4CAF50;
}

.wms-zone-detail-item--item-value.occupied {
  color: #e80f0f;
}

@media (max-width: 800px) {

}
</style>