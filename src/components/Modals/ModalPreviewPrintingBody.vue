<template>
  <div id="modalPreviewPrintingBody"
       aria-hidden="true"
       aria-labelledby="modalPreviewPrintingBodyLabel"
       class="modal fade"
       data-bs-theme="dark"
       tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 id="modalPreviewPrintingBodyLabel"
              class="modal-title fs-5"
          > Предварительный просмотр
          </h1>
          <button aria-label="Close"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  type="button"
          >
          </button>
        </div>
        <div class="modal-body">
          <div class="barcodes-container">
            <div v-for="(barcode, index) in ERPStore.getBarcodes"
                 :key="index"
                 class="barcode-item">
              <label>{{ packingStore.detailInfoPackingProduct?.name }}</label>
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
import {useERPStore} from "@/stores/HTTP/ERPStore.js";
import {watch, nextTick, onMounted} from "vue";
import JsBarcode from 'jsbarcode'

const ERPStore = useERPStore()
const packingStore = usePackingStore()
const generateBarcodes = () => {
  ERPStore.getBarcodes.forEach((barcode, index) => {
    const element = document.getElementById(`barcode-${index}`)
    if (element) {
      try {
        JsBarcode(element, barcode, {
          format: 'CODE128',
          width: 3,
          height: 100,
          displayValue: true,
          marginTop: 0,
          background: 'none',
          lineColor: '#000000',
          fontSize: 30,
          font: 'Arial',
          text: `Зав.№ ${barcode}`,
          textAlign: "center",
        })
      } catch (error) {
        console.error(`Ошибка генерации штрих-кода для индекса ${index}:`, error)
      }
    }
  })
}
onMounted(() => {
  if (ERPStore.getBarcodes) {
    generateBarcodes()
  }
})
watch(() => ERPStore.minItemsByIdUnreg, () => {
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
  padding: 1rem;
  grid-template-columns: 350px;
  background: #FFFFFF;
  border-radius: 1rem;
  justify-items: center;
}

label {
  color: #000;
  font-size: 1.6rem;
  font-weight: bold;
  padding: 0 1.2rem;
  font-family: "Arial Narrow";
  line-height: 1.2;
}
</style>