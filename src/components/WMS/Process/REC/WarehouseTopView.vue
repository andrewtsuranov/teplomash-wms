<!-- components/WarehouseTopView.vue -->
<template>
  <div class="warehouse-top-view">
    <div class="racks-container">
      <div
          v-for="rack in storageStore.racks"
          :key="rack.id"
          class="rack"
          :class="[
          { 'selected': storageStore.selectedRack === rack.id },
          { 'section-divider': rack.id % 2 === 0 },
          getOccupancyClass(rack)
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
  </div>
</template>
<script setup>
import {useStorageStore} from "@/stores/HTTP/StorageStore.js";

const storageStore = useStorageStore()
const getRackStatus = (rack) => {
  const totalPallets = rack.cells.reduce((acc, cell) => {
    return acc + cell.levels.reduce((levelAcc, level) => {
      return levelAcc + level.pallets.filter(p => p.occupied).length
    }, 0)
  }, 0)
  return `${totalPallets}/${11 * 7 * 4}`
}
const getOccupiedPercentage = (rack) => {
  const total = 11 * 7 * 4
  const occupied = rack.cells.reduce((acc, cell) => {
    return acc + cell.levels.reduce((levelAcc, level) => {
      return levelAcc + level.pallets.filter(p => p.occupied).length
    }, 0)
  }, 0)
  return Math.round((occupied / total) * 100)
}
const getOccupancyClass = (rack) => {
  const percentage = getOccupiedPercentage(rack)
  if (percentage > 90) return 'occupancy-high'
  if (percentage > 50) return 'occupancy-medium'
  return 'occupancy-low'
}
</script>
<style scoped>
.warehouse-top-view {
  display: grid;
  grid-template-columns: 1fr;
  padding: 20px;
  max-height: 80vh;
  max-width: 1280px;
  overflow-y: auto;
  color: #2F2D2B;
}

.racks-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
}

.rack {
  background-color: #e9ecef;
  padding: 8px 15px;
  cursor: pointer;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  transition: all 0.2s ease;
  border-left: 4px solid transparent;
}

.rack:hover {
  background-color: #dee2e6;
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

.rack.section-divider {
  margin-bottom: 15px;
  border-bottom: 2px dashed #dee2e6;
}

.rack.section-divider:last-child {
  margin-bottom: 0;
  border-bottom: none;
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

/* Стили для скроллбара */
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