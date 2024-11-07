<template>
  <div class="wms-packing-container">
    <h1>Упаковка:</h1>
    <div class="wms-packing-data-product">
      <div class="date-range-picker">
        <div class="input-group">
          <label for="start-date">Начальная дата:</label>
          <input
              id="start-date"
              v-model="startDate"
              type="date"
          />
        </div>
        <div class="input-group">
          <label for="time">Время:</label>
          <input id="time" v-model="selectedTimeStart" type="time"/>
        </div>
        <div class="input-group">
          <label for="end-date">Конечная дата:</label>
          <input
              id="end-date"
              v-model="endDate"
              type="date"
          />
        </div>
        <div class="input-group">
          <label for="time">Время:</label>
          <input id="time" v-model="selectedTimeEnd" type="time"/>
        </div>
      </div>
    </div>
    <button @click="ERPStore.GET_PRODUCT_BY_DAY(getTimeForERP(startDate, selectedTimeStart),getTimeForERP(endDate, selectedTimeEnd) )">Получить данные</button>
    {{ getTimeForERP(startDate, selectedTimeStart)}} {{getTimeForERP(endDate, selectedTimeEnd)}}
    <div class="wms-packing-pallet">
      <div v-for="n in 9" :key="n" class="pallet-item">
        <div class="pallet-container">
          <div>
            <div class="pallet-ID-line-one">
              <span>Зона: А</span>
              <span>Дата создания: {{ dataYYYYMMDD }}</span>
              <span>Паллета №{{ n }}</span>
            </div>
            <div class="pallet-ID-line-two">
              <span>Длина паллеты: 800мм</span>
              <span>Тип: Продукция</span>
            </div>
          </div>
          <div class="pallet-product">
            <span>Изделие: КЭВ-9П2021Е</span>
            <span>Комментарий: Панель из глянцевой нержавеющей стали</span>
            <span>Кол-во изделий: 9 шт.</span>
          </div>
        </div>
        <div class="pallet-status">Сборка:</div>
        <div class="pallet-qrcode" v-html="qrcode"></div>
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
import {useERPStore} from "@/stores/HTTP/WMS/1С/ERPStore.js";

const ERPStore = useERPStore()
const startDate = ref('2022-10-05');
const endDate = ref('2022-10-06');
const selectedTimeStart = ref('09:00')
const selectedTimeEnd = ref('22:00')


const getTimeForERP = (date , time) => {
  const dateTime = date +" " + time;
  const currentDate = new Date(dateTime);
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

onMounted(async () => {
  await generateQR(text.value)

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