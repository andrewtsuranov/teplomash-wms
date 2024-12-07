<!--<template>-->
<!--  <div class="about-view">-->
<!--    <h1>Here is gonna be About/Info page</h1>-->
<!--  </div>-->
<!--</template>-->
<!--<script setup>-->
<!--</script>-->
<!--<style scoped>-->
<!--.about-view {-->
<!--  display: grid;-->
<!--  grid-template-columns: 1fr;-->
<!--}-->
<!--</style>-->

<template>
  <div class="warehouse-rack">
    <div
        v-for="row in 7"
        :key="row"
        class="warehouse-row"
    >
      <div
          v-for="col in 11"
          :key="col"
          class="warehouse-cell"
      >
        <div class="cell-label">
          {{ String.fromCharCode(64 + row) + col }}
        </div>
        <div class="pallets-row">
          <div
              v-for="(pallet, index) in 4"
              :key="index"
              class="pallet"
              :class="{
              'occupied': isCellOccupied(row, col, index),
              'selectable': true
            }"
              @click="togglePallet(row, col, index)"
          >
            {{ getPalletLabel(row, col, index) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const occupiedPallets = ref({})

const isCellOccupied = (row, col, palletIndex) => {
  const key = `${row}-${col}-${palletIndex}`
  return occupiedPallets.value[key]
}

const getPalletLabel = (row, col, palletIndex) => {
  const key = `${row}-${col}-${palletIndex}`
  return occupiedPallets.value[key] ? `П${key}` : ''
}

const togglePallet = (row, col, palletIndex) => {
  const key = `${row}-${col}-${palletIndex}`
  occupiedPallets.value[key] = !occupiedPallets.value[key]
}
</script>

<style scoped>
.warehouse-rack {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.warehouse-row {
  display: flex;
  gap: 5px;
}
.warehouse-cell {
  border: 1px solid #ccc;
  width: 100px;
  display: flex;
  flex-direction: column;
}
.cell-label {
  text-align: center;
  padding: 5px;
  background-color: #f0f0f0;
}
.pallets-row {
  display: flex;
  width: 100%;
}
.pallet {
  flex: 1;
  height: 50px;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.pallet.occupied {
  background-color: #4CAF50;
  color: white;
}
</style>