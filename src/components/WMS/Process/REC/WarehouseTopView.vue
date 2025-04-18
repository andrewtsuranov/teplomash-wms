<template>
  <div class="warehouse-top-view">
    <div class="racks-container">
      <!-- First Rack (always single) -->
      <div
        v-if="storageStore.racks.length > 0"
        :key="storageStore.racks[0].id"
        class="rack single-rack first-rack"
        :class="[
          { selected: storageStore.selectedRack === storageStore.racks[0].id },
          getOccupancyClass(storageStore.racks[0]),
        ]"
        @click="storageStore.selectRack(storageStore.racks[0].id)"
      >
        <div class="rack-content">
          <div class="rack-number">Ряд {{ storageStore.racks[0].id }}</div>
          <div class="rack-status">
            <small>{{ getRackStatus(storageStore.racks[0]) }}</small>
          </div>
        </div>
      </div>
      <!-- Aisle after first rack -->
      <div class="aisle">
        <div class="aisle-road">
          <div class="aisle-number">Проход 1</div>
          <div class="markings"></div>
          <div class="aisle-number">Проход 1</div>
        </div>
      </div>
      <!-- Middle Racks (in pairs) with Aisles -->
      <div v-if="storageStore.racks.length > 2" class="middle-racks-container">
        <template
          v-for="(rackPair, index) in middleRackPairs"
          :key="`pair-${rackPair[0]?.id}-${rackPair[1]?.id}`"
        >
          <div class="rack-pair">
            <div
              v-for="rack in rackPair"
              :key="rack.id"
              class="rack paired-rack"
              :class="[
                { selected: storageStore.selectedRack === rack.id },
                getOccupancyClass(rack),
              ]"
              @click="storageStore.selectRack(rack.id)"
            >
              <div class="rack-content">
                <div class="rack-number">Ряд {{ rack.id }}</div>
                <div class="rack-status">
                  <small>{{ getRackStatus(rack) }}</small>
                </div>
              </div>
            </div>
          </div>
          <div class="aisle">
            <div class="aisle-road">
              <div class="aisle-number">Проход {{ index + 2 }}</div>
              <div class="markings"></div>
              <div class="aisle-number">Проход {{ index + 2 }}</div>
            </div>
          </div>
        </template>
      </div>
      <!-- Last Rack (always single) -->
      <div
        v-if="storageStore.racks.length > 1"
        :key="storageStore.racks[storageStore.racks.length - 1].id"
        class="rack single-rack last-rack"
        :class="[
          {
            selected:
              storageStore.selectedRack ===
              storageStore.racks[storageStore.racks.length - 1].id,
          },
          getOccupancyClass(storageStore.racks[storageStore.racks.length - 1]),
        ]"
        @click="
          storageStore.selectRack(
            storageStore.racks[storageStore.racks.length - 1].id,
          )
        "
      >
        <div class="rack-content">
          <div class="rack-number">
            Ряд {{ storageStore.racks[storageStore.racks.length - 1].id }}
          </div>
          <div class="rack-status">
            <small>{{
              getRackStatus(storageStore.racks[storageStore.racks.length - 1])
            }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useStorageStore } from "@/stores/HTTP/StorageStore.js";
import { computed } from "vue";

const storageStore = useStorageStore();
const getRackStatus = (rack) => {
  const totalPallets = rack.cells.reduce((acc, cell) => {
    return (
      acc +
      cell.levels.reduce((levelAcc, level) => {
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
    storageStore.racks.length - 1,
  );
  const pairs = [];
  for (let i = 0; i < middleRacks.length; i += 2) {
    pairs.push(middleRacks.slice(i, i + 2));
  }
  return pairs;
});
</script>
<style scoped>
.warehouse-top-view {
  display: grid;
  grid-template-columns: 1fr;
  max-width: 1280px;
}

.racks-container {
  display: grid;
  grid-template-columns: 1fr;
  background-color: #2623238f;
  border: 1px solid #605039e0;
  border-radius: 1rem;
  padding: 2rem 5rem 2rem 15rem;
}

.rack {
  background-color: #0280b0bd;
  padding: 8px 15px;
  cursor: pointer;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
}

.rack:hover {
  background-color: #311617;
  transform: translateX(5px);
}

.rack.selected {
  background-color: #0d6efd;
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
  grid-template-rows: minmax(auto, 4rem);
}

.aisle-road {
  display: grid;
  grid-template-columns: minmax(3rem, auto) 1fr minmax(3rem, auto);
  align-items: center;
}

.markings {
  --stripe-width: 3rem; /* длина каждой полосы */
  --stripe-gap: 1.6rem; /* промежуток между полосами */
  display: grid;
  grid-template-rows: 0.1rem;
  background: repeating-linear-gradient(
    to right,
    #6c757d 0,
    #6c757d var(--stripe-width),
    transparent var(--stripe-width),
    transparent calc(var(--stripe-width) + var(--stripe-gap))
  );
}

.aisle-number {
  /*text-align: left;*/
  /*font-size: 1rem;*/
  color: #6c757d;
  /*background-color: #ffd700;*/
  padding: 0 1rem;
  /*border-radius: 1rem;* /
  /*white-space: nowrap;*/
  /*justify-self: start;*/
}

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
