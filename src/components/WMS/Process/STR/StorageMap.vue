<script setup>
import { useStorageStore } from "@/stores/WMSStores/StorageStore.js";
import { computed } from "vue";
import { useWarehouseStore } from "@/stores/WMSStores/WarehouseStore.js";

const warehouseStore = useWarehouseStore();
const storageStore = useStorageStore();
const getRackStatus = (rack) => {
  const totalPallets = rack.cells.reduce((acc, cell) => {
    return (
      acc + cell.levels.reduce((levelAcc, level) => {
        return levelAcc + level.pallets.filter((p) => p.occupied).length;
      }, 0)
    );
  }, 0);
  return `${totalPallets}/${11 * 7 * 4}`;
};
const getOccupiedPercentage = (rack) => {
  const total = 11 * 7 * 4;
  const occupied = rack.cells.reduce((acc, cell) => {
    return (
      acc +
      cell.levels.reduce((levelAcc, level) => {
        return levelAcc + level.pallets.filter((p) => p.occupied).length;
      }, 0)
    );
  }, 0);
  return Math.round((occupied / total) * 100);
};
const getOccupancyClass = (rack) => {
  const percentage = getOccupiedPercentage(rack);
  if (percentage > 90) return "occupancy-high";
  if (percentage > 50) return "occupancy-medium";
  return "occupancy-low";
};
const middleRackPairs = computed(() => {
  if (storageStore.racks.length <= 2) {
    return [];
  }
  const middleRacks = storageStore.racks.slice(
    1,
    storageStore.racks.length - 1
  );
  const pairs = [];
  for (let i = 0; i < middleRacks.length; i += 2) {
    pairs.push(middleRacks.slice(i, i + 2));
  }
  return pairs;
});
</script>
<template>
  <div v-if="storageStore.error" class="alert alert-danger">{{ storageStore.error }}</div>
  <div class="storage-map-container">
    <h3 class="storage-map-name m-0">
      <!--      Интерактивная карта склада (1-{{ storageStore.getZoneDimensions.rows }})-->
      Интерактивная карта склада (1-{{ storageStore.racks?.length }})
    </h3>
    <div class="storage-map">
      <div class="storage-map-one">
        <div class="workers-zone-container">
          <div>
            <h6 class="STR-name">Диспетчерская</h6>
          </div>
        </div>
        <div class="REC-SHP-zone-container">
          <div class="REC-SHP-zone">
            <h6 class="STR-name m-0">REC/SHP-01</h6>
          </div>
          <div class="REC-SHP-zone">
            <h6 class="STR-name m-0">REC/SHP-02</h6>
          </div>
          <div class="REC-SHP-zone">
            <h6 class="STR-name m-0">REC/SHP-03</h6>
          </div>
          <div class="REC-SHP-zone">
            <h6 class="STR-name m-0">REC/SHP-04</h6>
          </div>
        </div>
        <div class="STR-02-container">
          <h6 class="STR-name STR-02-name m-0">STR-02</h6>
          <div v-if="warehouseStore.selectedZonesByZoneType.code === 'STR-02'" class="STR-02-racks">
            <div v-if="storageStore.racks?.length > 0"
                 :key="storageStore.racks[0]?.id"
                 :class="[
          { selected: storageStore.selectedRack?.id === storageStore.racks[0].id },
          getOccupancyClass(storageStore.racks[0]),
        ]"
                 class="rack single-rack first-rack"
                 @click="storageStore.setSelectedRack(storageStore.racks[0])"
            >
              <div class="rack-content">
                <div class="rack-number">Ряд {{ storageStore.racks[0].id.split(".")[0] }}</div>
                <div class="rack-status">
                  <small>{{ getRackStatus(storageStore.racks[0]) }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="storage-map-two">
        <div class="STR-01-container">
          <h6 class="STR-name m-0">STR-01</h6>
          <div v-if="warehouseStore.selectedZonesByZoneType.code === 'STR-01'" class="STR-01-racks">
            <!-- First Rack (always single) -->
            <div v-if="storageStore.racks?.length > 0"
                 :key="storageStore.racks[0]?.id"
                 :class="[
          { selected: storageStore.selectedRack?.id === storageStore.racks[0].id },
          getOccupancyClass(storageStore.racks[0]),
        ]"
                 class="rack single-rack first-rack"
                 @click="storageStore.setSelectedRack(storageStore.racks[0])"
            >
              <div class="rack-content">
                <div class="rack-number">Ряд {{ storageStore.racks[0].id.split(".")[0] }}</div>
                <div class="rack-status">
                  <small>{{ getRackStatus(storageStore.racks[0]) }}</small>
                </div>
              </div>
            </div>
            <div class="aisle">Проход 1</div>
            <!-- Middle Racks (in pairs) with Aisles -->
            <div v-if="storageStore.racks.length > 2" class="middle-racks-container">
              <template v-for="(rackPair, index) in middleRackPairs"
                        :key="`pair-${rackPair[0]?.id}-${rackPair[1]?.id}`"
              >
                <div class="rack-pair">
                  <div
                    v-for="rack in rackPair"
                    :key="rack.id"
                    :class="[
                { selected: storageStore.selectedRack?.id === rack.id },
                getOccupancyClass(rack),
              ]"
                    class="rack paired-rack"
                    @click="storageStore.setSelectedRack(rack)"
                  >
                    <div class="rack-content">
                      <div class="rack-numbe ">Ряд {{ rack.id.split(".")[0] }}</div>
                      <div class="rack-status">
                        <small>{{ getRackStatus(rack) }}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="aisle">Проход {{ index + 2 }}</div>
              </template>
            </div>
            <!-- Last Rack (always single) -->
            <div
              v-if="storageStore.racks.length > 1"
              :key="storageStore.racks[storageStore.racks.length - 1].id"
              :class="[
          {
            selected: storageStore.selectedRack?.id === storageStore.racks[storageStore.racks.length - 1].id,
          },
          getOccupancyClass(storageStore.racks[storageStore.racks.length - 1]),
        ]"
              class="rack single-rack last-rack"
              @click="storageStore.setSelectedRack(storageStore.racks[storageStore.racks.length - 1])"
            >
              <div class="rack-content">
                <div class="rack-number">
                  Ряд {{ storageStore.racks[storageStore.racks.length - 1].id.split(".")[0] }}
                </div>
                <div class="rack-status">
                  <small>{{ getRackStatus(storageStore.racks[storageStore.racks.length - 1]) }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.storage-map-container {
  display: grid;
  grid-template-rows: auto 1fr;
  background-color: #2623238f;
  border: 1px solid #605039e0;
  border-radius: 1rem;
  padding: 1rem 2rem;
  row-gap: 1rem;
}

.storage-map-name {
  display: grid;
}

.storage-map {
  display: grid;
  grid-template-columns: auto 1fr;
}

.storage-map-one {
  display: grid;
  grid-template-columns: minmax(180px, 1fr);
  grid-template-rows: 300px auto 600px;

}

.storage-map-two {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
}

.STR-01-container {
  display: grid;
  grid-template-rows: auto 1fr;
  border: 1px solid #d5cdc07d;
  border-left: none;
}

.workers-zone-container {
  display: grid;
  border: 1px solid #d5cdc07d;
  border-bottom: none;
}

.REC-SHP-zone-container {
  display: grid;
  grid-template-rows: repeat(4, 1fr);
}

.REC-SHP-zone {
  display: grid;
  border: 1px solid #d5cdc07d;
  border-bottom: none;
}

.STR-02-container {
  display: grid;
  grid-template-columns: minmax(auto, 1fr) minmax(auto, 1fr);
  grid-template-rows: auto minmax(auto, 1fr);

  border: 1px solid #d5cdc07d;
}

.STR-name {
  display: grid;
  color: #d5cdc07d;
  padding: .5rem;
  justify-items: end;

}

.STR-02-name {
  grid-column: 1/3;
}

.STR-01-racks {
  display: grid;
  padding: 0 2rem 2rem 5rem;
}

.STR-02-racks {
  display: grid;
  /*padding: 0 2rem 2rem 5rem;*/
}

.rack {
  background-color: rgba(213, 211, 207, 0.18);
  padding: 8px 15px;
  cursor: pointer;
  border: 1px solid #d5cdc07d;
  border-radius: 4px;
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
}

.rack:hover {
  background-color: #d5cdc07d;
  transform: translateX(5px);
}

.rack.selected {
  background-color: #8a703e7d;
  color: white;
  transform: translateX(10px);
}

.rack-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rack-number {
  font-weight: bold;
}

.rack-status {
  opacity: 0.8;
}

.single-rack {
  margin-bottom: 0;
}

.rotated-div {
  transform: rotate(-90deg);
}

.middle-racks-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
}

.rack-pair {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.4rem;
}

.paired-rack {
  margin-bottom: 0;
}

.paired-rack:hover {
  transform: translateX(5px);
}

.paired-rack.selected {
  transform: translateX(10px);
}

.aisle {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: minmax(auto, 3rem);
  align-items: center;
  /*padding: 0 2rem;*/
  color: #d5cdc07d;
}

/*.road {*/
/*  background-color: #ffc107;*/
/*  !*border: 1px dashed #d5cdc07d;*!*/
/*}*/

.rack.occupancy-high {
  border-left-color: #dc3545;
}

.rack.occupancy-medium {
  border-left-color: #ffc107;
}

.rack.occupancy-low {
  border-left-color: #28a745;
}

/* Styles for scrollbar */
.warehouse-top-view::-webkit-scrollbar {
  width: 8px;
}

.warehouse-top-view::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.warehouse-top-view::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.warehouse-top-view::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
