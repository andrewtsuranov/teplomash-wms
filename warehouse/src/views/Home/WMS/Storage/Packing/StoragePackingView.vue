<template>
  <div class="wms-packing-container">
    <h1>Упаковка:</h1>
    <div class="wms-packing-erp-product">
      <div class="wms-packing-erp-data">
        <div>
          <p class="d-inline-flex">
            <button class="btn btn-primary"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseExample"
                    aria-expanded="false"
                    aria-controls="collapseExample"
            >
              Выбрать период
            </button>
          </p>
          <div class="collapse" id="collapseExample">
            <datetime-picker/>
            <!--            <div class="erp-data-range">-->
            <!--              <div class="input-group">-->
            <!--                <label for="start-date">Начальная дата:</label>-->
            <!--                <input-->
            <!--                    class="start-date"-->
            <!--                    v-model="startDate"-->
            <!--                    type="date"-->
            <!--                />-->
            <!--                <input id="time" v-model="selectedTimeStart" type="time"/>-->
            <!--              </div>-->
            <!--              <div class="input-group">-->
            <!--                <label for="end-date">Конечная дата:</label>-->
            <!--                <input-->
            <!--                    class="end-date"-->
            <!--                    v-model="endDate"-->
            <!--                    type="date"-->
            <!--                />-->
            <!--                <input id="time" v-model="selectedTimeEnd" type="time"/>-->
            <!--              </div>-->
            <!--              <my-button class="btn-get-erp"-->
            <!--                         type="button"-->
            <!--                         @click="ERPStore.GET_PRODUCT_BY_DAY(getTimeForERP(startDate, selectedTimeStart),getTimeForERP(endDate, selectedTimeEnd) )">-->
            <!--                Получить данные с ERP-->
            <!--              </my-button>-->
            <!--            </div>-->
          </div>
        </div>
        <erp-one-c class="erp-logo"></erp-one-c>
      </div>
    </div>
    <div class="in-table-container">
      <table class="table table-dark table-hover">
        <thead>
        <tr>
          <th scope="col">№</th>
          <th scope="col">Изделие</th>
          <th scope="col">Особенности</th>
          <th scope="col">Заводской номер</th>
          <th scope="col">Кол-во</th>
          <th scope="col">Паллета</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <th scope="row">1</th>
          <td>КЭВ-9П2022Е</td>
          <td>Панель из матовой нержавеющей стали</td>
          <td>1234567898765</td>
          <td>9</td>
          <td>id404</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>КЭВ-12П3011Е</td>
          <td>Панель из глянцевой нержавеющей стали</td>
          <td>1234567898765</td>
          <td>9</td>
          <td>id435</td>
        </tr>
        <tr>
          <th scope="row">3</th>
          <td>КЭВ-24П4023Е</td>
          <td>Исполнение 30</td>
          <td>1234567898765</td>
          <td>9</td>
          <td>id43</td>
        </tr>
        </tbody>
      </table>
    </div>
    <TeplomashTaskManagerView/>
    <div class="wms-packing-pallet">
      <div v-for="n in 7" :key="n" class="pallet-item-content">
        <div class="pallet-item-row-one">
          <span>Зона:{{ packingStore.palletData.zoneStorage }}</span>
          <span>Паллета №{{ n }}</span>
          <span>Дата создания:{{ dataYYYYMMDD }}</span>
        </div>
        <div class="pallet-item-row-two"></div>
        <div class="pallet-item-row-three"></div>
        <!--        <div class="pallet-ID-line-one">-->
        <!--          <span>Паллета №</span>-->
        <!--          {{ n }}-->
        <!--                  <span>Дата создания:</span>-->
        <!--          {{ dataYYYYMMDD }}-->
        <!--          <span>Зона:</span>-->
        <!--          {{ packingStore.palletData.zoneStorage }}-->
        <!--          <span>Длина паллеты:</span>-->
        <!--          {{ packingStore.palletData.dimensions }} мм-->
        <!--          <div>ID Паллеты</div>-->
        <!--          <div v-html="qrcode"></div>-->
        <!--        </div>-->
        <!--        <div class="pallet-product">-->
        <!--          <span>Тип: {{ packingStore.palletData.productType }}</span>-->
        <!--          <span>Изделие: {{ packingStore.palletData.productName }}</span>-->
        <!--          <span>Комментарий: {{ packingStore.palletData.addInfo }}</span>-->
        <!--          <span>Кол-во изделий: {{ packingStore.palletData.productQty }} шт.</span>-->
        <!--        </div>-->
        <!--        <div class="pallet-status">Сборка:</div>-->
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
import {usePackingStore} from "@/stores/HTTP/WMS/PackingStore.js";
import TeplomashTaskManagerView from "@/views/Home/WMS/TeplomashTaskManager/TeplomashTaskManagerView.vue";
import ErpOneC from "@/components/UI/SVG/ErpOneС.vue"
import DatetimePicker from "@/components/UI/DatetimePicker.vue";

const packingStore = usePackingStore()
const ERPStore = useERPStore()
const startDate = ref('2022-10-05');
const endDate = ref('2022-10-05');
const selectedTimeStart = ref('09:00')
const selectedTimeEnd = ref('10:00')
const getTimeForERP = (date, time) => {
  const dateTime = date + " " + time;
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
  row-gap: 1rem;
}

.wms-packing-erp-data {
  display: grid;
  grid-template-columns: 1fr 300px;
  background-color: #2e2e2e;
  border: 1px solid #605039e0;
  border-radius: 1rem;
  padding: 1rem;
}

.in-table-container {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: 1fr;
  overflow-x: auto;
}

.erp-data-table {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(min-content, auto);
  /*grid-auto-flow: column;*/
}

.erp-data-table-item {
  border: 1px solid red;
}

.wms-packing-erp-product {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: 1fr;
}

.date-range-picker {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: auto 1fr;
  row-gap: 1rem;
  padding: 1rem;
  background-color: #0000004a;
  border: 1px solid #605039e0;
  border-radius: 1rem;
}

.erp-logo {
  display: grid;
  grid-template-rows: minmax(auto, 200px);
  justify-items: center;
}

.input-group {
  display: grid;
  grid-auto-flow: column;
  column-gap: .1rem;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  font-size: 1rem;
}



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
  /*border: 2px solid #4CAF50;*/
  border: 2px solid #E8B53F;
  /*border: 2px solid #B01010;*/
  padding: 1rem;
  row-gap: 1rem;
  border-radius: 1rem;
  min-height: 400px;
}

.pallet-item-row-one {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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

.btn-get-erp {
  display: grid;
  max-width: 15rem;
}

.start-date,
.end-date {
  font-size: 1.2rem;
}

@media (max-width: 800px) {
  .wms-packing-erp-data {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .wms-packing-pallet {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
}
</style>