<!--&lt;!&ndash;<template>&ndash;&gt;-->
<!--&lt;!&ndash;  <div class="about-view">&ndash;&gt;-->
<!--&lt;!&ndash;    <h1>Here is gonna be About/Info page</h1>&ndash;&gt;-->
<!--&lt;!&ndash;  </div>&ndash;&gt;-->
<!--&lt;!&ndash;</template>&ndash;&gt;-->
<!--&lt;!&ndash;<script setup>&ndash;&gt;-->
<!--&lt;!&ndash;</script>&ndash;&gt;-->
<!--&lt;!&ndash;<style scoped>&ndash;&gt;-->
<!--&lt;!&ndash;.about-view {&ndash;&gt;-->
<!--&lt;!&ndash;  display: grid;&ndash;&gt;-->
<!--&lt;!&ndash;  grid-template-columns: 1fr;&ndash;&gt;-->
<!--&lt;!&ndash;}&ndash;&gt;-->
<!--&lt;!&ndash;</style>&ndash;&gt;-->

<!--<template>-->
<!--  <div class="warehouse-rack">-->
<!--    <div-->
<!--        v-for="row in 7"-->
<!--        :key="row"-->
<!--        class="warehouse-row"-->
<!--    >-->
<!--      <div-->
<!--          v-for="col in 11"-->
<!--          :key="col"-->
<!--          class="warehouse-cell"-->
<!--      >-->
<!--        <div class="cell-label">-->
<!--          {{ String.fromCharCode(64 + row) + col }}-->
<!--        </div>-->
<!--        <div class="pallets-row">-->
<!--          <div-->
<!--              v-for="(pallet, index) in 4"-->
<!--              :key="index"-->
<!--              class="pallet"-->
<!--              :class="{-->
<!--              'occupied': isCellOccupied(row, col, index),-->
<!--              'selectable': true-->
<!--            }"-->
<!--              @click="togglePallet(row, col, index)"-->
<!--          >-->
<!--            {{ getPalletLabel(row, col, index) }}-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup>-->
<!--import { ref } from 'vue'-->

<!--const occupiedPallets = ref({})-->

<!--const isCellOccupied = (row, col, palletIndex) => {-->
<!--  const key = `${row}-${col}-${palletIndex}`-->
<!--  return occupiedPallets.value[key]-->
<!--}-->

<!--const getPalletLabel = (row, col, palletIndex) => {-->
<!--  const key = `${row}-${col}-${palletIndex}`-->
<!--  return occupiedPallets.value[key] ? `П${key}` : ''-->
<!--}-->

<!--const togglePallet = (row, col, palletIndex) => {-->
<!--  const key = `${row}-${col}-${palletIndex}`-->
<!--  occupiedPallets.value[key] = !occupiedPallets.value[key]-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.warehouse-rack {-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  gap: 5px;-->
<!--}-->
<!--.warehouse-row {-->
<!--  display: flex;-->
<!--  gap: 5px;-->
<!--}-->
<!--.warehouse-cell {-->
<!--  border: 1px solid #ccc;-->
<!--  width: 100px;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--}-->
<!--.cell-label {-->
<!--  text-align: center;-->
<!--  padding: 5px;-->
<!--  background-color: #f0f0f0;-->
<!--}-->
<!--.pallets-row {-->
<!--  display: flex;-->
<!--  width: 100%;-->
<!--}-->
<!--.pallet {-->
<!--  flex: 1;-->
<!--  height: 50px;-->
<!--  border: 1px solid #eee;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--  cursor: pointer;-->
<!--  transition: background-color 0.3s ease;-->
<!--}-->
<!--.pallet.occupied {-->
<!--  background-color: #4CAF50;-->
<!--  color: white;-->
<!--}-->
<!--</style>-->


<!--<template>-->
<!--  <div class="storage-map">-->
<!--    <div class="row g-2">-->
<!--      <div v-for="cell in cells" :key="cell.id" class="col-md-2 col-sm-3 col-4">-->
<!--        <b-card-->
<!--            :bg-variant="cell.isOccupied ? 'danger' : 'success'"-->
<!--            :text-variant="cell.isOccupied ? 'white' : 'black'"-->
<!--            class="cell mb-2"-->
<!--            @mouseenter="showInfo(cell)"-->
<!--            @mouseleave="hideInfo"-->
<!--        >-->
<!--          {{ cell.id }}-->
<!--        </b-card>-->
<!--      </div>-->
<!--    </div>-->
<!--    <b-popover-->
<!--        :show="showPopover"-->
<!--        :target="popoverTarget"-->
<!--        triggers="hover"-->
<!--        placement="top"-->
<!--    >-->
<!--      <template #title>Информация о ячейке</template>-->
<!--      <div v-if="selectedCell">-->
<!--        <p><strong>ID:</strong> {{ selectedCell.id }}</p>-->
<!--        <p><strong>Товар:</strong> {{ selectedCell.product }}</p>-->
<!--        <p><strong>Количество:</strong> {{ selectedCell.quantity }}</p>-->
<!--      </div>-->
<!--    </b-popover>-->
<!--  </div>-->
<!--</template>-->
<!--<style scoped>-->
<!--.storage-map {-->
<!--  padding: 20px;-->
<!--}-->
<!--.cell {-->
<!--  cursor: pointer;-->
<!--  height: 100px;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--  font-weight: bold;-->
<!--}-->
<!--</style>-->