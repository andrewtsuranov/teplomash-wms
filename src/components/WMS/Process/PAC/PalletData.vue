<template>
  <div class="wms-packing-pallet">
    <div v-for="n in 2"
         :key="n"
         class="pallet-item-content"
         :class="['pallet-status', 'pallet-background', { 'pending': true, 'finish': false, 'error': f }]"
    >
      <div class="pallet-item-row-one">
        <span>Зона:{{ packingStore.palletData.zoneStorage }}</span>
        <span>Паллета №{{ n }}</span>
        <span>Дата создания:{{ dataYYYYMMDD }}</span>
      </div>
      <div class="pallet-item-row-two">
        <svg-eur-one100-mini841/>
      </div>
      <div class="pallet-item-row-three">
        <div class="in-table-item-container">
          <table class="table table-dark table-hover"
          >
            <thead>
            <tr>
              <th scope="col">№</th>
              <th scope="col">Изделие</th>
              <th scope="col">Кол-во</th>
              <th scope="col">Штрихкод</th>
              <th scope="col">Дата выпуска</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in packingStore.selectedGroupUnregProduct?.data" :key="index">
              <th scope="row">{{ index+1 }}</th>
              <td>{{ packingStore.selectedGroupUnregProduct.key }}</td>
              <td>1</td>
                            <td>{{ item.barcode }}</td>
                            <td>{{ item.created_at }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import SvgEurOne100Mini841 from "@/components/UI/SVG/svgEurOne100Mini841.vue";
import {useSplitDateByT} from "@/composables/SpliDateByT.js";
import {useWebSocketStore} from "@/stores/WebSockets/WebSocketStore.js";
import {usePackingStore} from "@/stores/HTTP/PackingStore.js";
import QRCode from 'qrcode'
import {onMounted, ref} from "vue";

const packingStore = usePackingStore()
const webSocketStore = useWebSocketStore()
const text = ref('[А]-[2024101600]-[П]-[800]-[КЭВ-9П2021Е]-[Панель из глянцевой нержавеющей стали]-[9]')
const qrcode = ref(null)
const dataYYYYMMDD = ref(new Date().toISOString().slice(0, 10));
const generateQR = async (data) => {
  const opts = {
    errorCorrectionLevel: 'H',
    quality: 0.3,
    width: 130,
    margin: 1,
    color: {
      dark: "#000",
      light: '#EEE'
    }
  }
  await QRCode.toString(data, opts, (err, string) => {
    if (err) throw err
    qrcode.value = string
  })
}
onMounted(async () => {
  await generateQR(text.value)
})
</script>
<style scoped>
.wms-packing-pallet {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1rem;
  width: 100%;
  padding: 1rem 0;
}

.pallet-item-content {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(auto-fill, 1fr);
  /*padding: 1rem;*/
  /*row-gap: .5rem;*/
  border-radius: 1rem;
  min-height: 400px;

}

.pallet-item-row-one {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  color: #2e2e2e;
  /*border: 2px solid #ecaf0e;*/
  font-size: 1.2rem;
  font-weight: bold;
  /*border-radius: 1rem;*/
}

.pallet-item-row-two {
  display: grid;
  grid-template-columns: 1fr;
  padding: 1rem;
  background-color: #2F2D2B;
}

.pallet-item-row-three {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: minmax(auto, 200px);
  overflow: auto;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
}

.pallet-qrcode {
  grid-area: qrcode;
  align-self: end;
}
.pallet-background.error,
.pallet-status.error {
  background-color:#e80f0f ;
  border: 2px solid #e80f0f;
  animation-name: blinking;
  animation-duration: 1s;
  animation-iteration-count: 50;
}
.pallet-background.pending,
.pallet-status.pending {
  background-color: #ecaf0e;
  border: 2px solid #ecaf0e;
}
.pallet-background.finish,
.pallet-status.finish {
  background-color: #19da21;
  border: 2px solid #19da21;
}

@media (max-width: 800px) {
  .wms-packing-pallet {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
}

@keyframes blinking {
  50% {
    border-color: #ecaf0e;
    background-color:#ecaf0e ;
  }
}
</style>