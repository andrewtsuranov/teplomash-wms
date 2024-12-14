<template>
  <div class="modal fade"
       id="modalPreviewPrintingBody"
       aria-hidden="true"
       aria-labelledby="modalPreviewPrintingBodyLabel"
       data-bs-theme="dark"
       tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5"
              id="modalPreviewPrintingBodyLabel"
          > Предварительный просмотр
          </h1>
          <button type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
          >
          </button>
        </div>
        <div class="modal-body">
          <div class="barcodes-container">
            <div v-for="(barcode, index) in packingStore.getBarcodesFromSelectedGroupUnregProduct"
                 :key="index"
                 class="barcode-item">
              <svg :id="'barcode-' + index"></svg>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary"
                  data-bs-target="#modalPrintSettings"
                  data-bs-toggle="modal"
          >
            Назад
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {usePackingStore} from "@/stores/HTTP/PackingStore.js";
import {onMounted, watch, nextTick} from "vue";
import JsBarcode from 'jsbarcode'

const packingStore = usePackingStore()
const generateBarcodes = () => {
  packingStore.getBarcodesFromSelectedGroupUnregProduct.forEach((barcode, index) => {
    const element = document.getElementById(`barcode-${index}`)
    if (element) {
      try {
        JsBarcode(element, barcode, {
          format: 'CODE128',
          width: 3,
          height: 100,
          displayValue: true,
          margin: 30,
          background: 'none',
          lineColor: '#000000',
          fontSize: 30,
          font: 'monospace',
          textAlign: "center",
        })
      } catch (error) {
        console.error(`Ошибка генерации штрих-кода для индекса ${index}:`, error)
      }
    }
  })
}
onMounted(() => {
  generateBarcodes()
})
watch(() => packingStore.getBarcodesFromSelectedGroupUnregProduct, () => {
      nextTick(() => {
        generateBarcodes()
      })
    },
    {deep: true}
)
</script>
<style scoped>
.barcodes-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: minmax(auto, 1fr);
  justify-items: center;
  row-gap: 1rem;
}

.barcode-item {
  display: grid;
  background: #FFFFFF;
  border-radius: 1rem;
}
</style>