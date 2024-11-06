<template>
  <div class="wms-packing-container">
    <h1>Упаковка:</h1>
    <div class="wms-packing-pallet">
      <div v-for="n in 9" :key="n" class="pallet-item">
        <span class="pallet-name">
          <span>Зона: А</span>
          <span>Дата создания: {{ dataYYYYMMDD }}</span>
         <span>Паллета №{{ n }}</span>

        </span>
        <span>Длина паллеты: 800мм</span>
        <span>Тип: Продукция</span>
        <span>Изделие: КЭВ-9П2021Е</span>
        <span>Комментарий: Панель из глянцевой нержавеющей стали</span>
        <span>Кол-во изделий: 9 шт.</span>
        <div class="pallet-qrcode" v-html="qrcode"></div>
        <div class="pallet-status">Статус/Этапы сборки:</div>
      </div>
    </div>
    <div>
      <router-view name="TTM"/>
    </div>
  </div>
</template>
<script setup>
import {onMounted, ref} from 'vue'
import QRCode from 'qrcode'

onMounted(() => {
  generateQR(text.value)
})
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
</script>
<style scoped>
.wms-packing-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content;
}

.wms-packing-pallet {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1rem;
  width: 100%;
  padding: 1rem 0;
}

.pallet-item {
  display: grid;
  grid-template-areas:
        "palletID palletID"
        ". ."
        "status qrcode";
  grid-template-columns: 1fr min-content;
  grid-template-rows: min-content min-content 1fr;
  /*border: 2px solid #4CAF50;*/
  border: 2px solid #E8B53F;
  /*border: 2px solid #B01010;*/
  padding: 1rem;
  row-gap: 1rem;
  border-radius: 1rem;
  min-height: 400px;
}

.pallet-name {
  display: grid;
  grid-area: palletID;
  /*grid-auto-flow: column;*/
  grid-template-columns: auto 1fr auto;
  grid-auto-rows: min-content;
  font-size: 1.1rem;
  column-gap: 1rem;
  justify-items: center;
  /*overflow: auto;*/
}

.pallet-qrcode {
  grid-area: qrcode;
  align-self: end;
}

.pallet-status {
  grid-area: status;
  padding: .5rem 0;
  border-top: 1px solid red;
  font-size: 1.3rem;
}
</style>