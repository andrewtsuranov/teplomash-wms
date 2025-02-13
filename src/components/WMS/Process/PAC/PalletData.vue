<template>
  <div class="wms-packing-pallet">
    <div v-for="n in 7"
         :key="n"
         :class="['pallet-status', 'pallet-background', { 'pending': true, 'finish': false, 'error': false }]"
         class="pallet-item-content"
    >
      <div class="pallet-item-row-one">
        <div class="piro-id">ID:</div>
        <div class="piro-date">Создано:</div>
      </div>
      <div class="pallet-item-row-two">
        <div>Content</div>
        <div class="pirt-qr">QR code</div>
      </div>
      <div class="pallet-item-row-three">
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
  grid-template-rows: repeat(auto-fit, 365px);
  gap: 1rem;
}

.pallet-item-content {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;
  row-gap: .7rem;
  border-radius: 1rem;
  color: #2F2D2B;
  background-color: #D9D9D9;
  font-family: Helvetica, Arial, sans-serif;
  padding: 1rem;
}

.pallet-item-row-one {
  display: grid;
  grid-template-columns: auto 1fr;
  font-weight: bold;

}

.piro-id {
  font-size: 1.7rem;
}

.piro-date {
  justify-self: end;
  font-size: 1.2rem;
}

.pallet-item-row-two {
  display: grid;
  grid-template-columns: auto 1fr;
}

.pirt-qr {
  justify-self: end;
  display: grid;
  grid-template-columns: 150px;
  grid-template-rows: 150px;
  border: 1px solid #2F2D2B;
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
  border: .7rem solid #e80f0f;
  animation-name: blinking;
  animation-duration: 1s;
  animation-iteration-count: 50;
}

.pallet-background.pending,
.pallet-status.pending {
  border: .7rem solid #ecaf0e;
}

.pallet-background.finish,
.pallet-status.finish {

  border: .7rem solid #19da21;
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
  }
}
</style>