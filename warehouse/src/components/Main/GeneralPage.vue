<template>
  <div class="general-page-container">
    <div class="wms-input">
      Приёмка
    </div>
    <div class="wms-output">
      Отгрузка
    </div>
  </div>
</template>
<script setup>
</script>
<style scoped>
.general-page-container {
  display: grid;
  overflow: hidden;
  grid-template-columns: 1fr;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px 0 20px;
  justify-items: center;
  gap: 5rem;
  align-content: center;
}

.wms-input {
  border: 2px double #E32029;
  font-size: 5rem;
  text-transform: uppercase;
  padding: 10px;
  cursor: pointer;
}

.wms-input:hover {
  background-color: #42b983;
}

.wms-output {
  border: 2px double #E32029;
  font-size: 5rem;
  text-transform: uppercase;
  padding: 10px;
  cursor: pointer;
}

.wms-output:hover {
  background-color: #42b983;
}
</style>