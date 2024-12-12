<template>
  <div class="in-table-container">
    <table class="table-content table table-dark table-hover">
      <thead>
      <tr>
        <th scope="col">№</th>
        <th scope="col">Изделие</th>
        <th scope="col">Кол-во, шт</th>
        <th scope="col">Задача</th>
        <th scope="col">Дополнительно</th>
      </tr>
      </thead>
      <tbody>
      <template v-for="(item, key) in filterUnregProductByUser" :key="key">
        <tr>
          <th scope="row">{{ item.number }}</th>
          <td>
            {{ item?.key }}
          </td>
          <td>{{ item.data.length }}</td>
          <td>
            <button class="btn btn-outline-success"
                    @click="handleCreatePallet(item)"
            >Собрать паллету
            </button>
          </td>
          <td>
            <button class="btn btn-outline-primary"
                    @click="toggleTable(item?.key )"
            >
              {{ openedItemCode === item?.key ? 'Скрыть список' : 'Раскрыть список' }}
            </button>
          </td>
        </tr>
        <!-- Подтаблица, отображаемая при раскрытии списка -->
        <tr v-if="openedItemCode === item?.key" :key="'subTable-' + item?.key">
          <td colspan="6">
            <table-item-unregistered-product :subTableDataProduct="item?.data"/>
          </td>
        </tr>
      </template>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import {useUserStore} from "@/stores/HTTP/UserStore.js";
import {useWebSocketStore} from "@/stores/WebSockets/WebSocketStore.js";
import {usePrintingStore} from "@/stores/HTTP/PrintingStore.js";
import {useNumbersOnlyWithoutDot} from "@/composables/NumbersOnlyWithoutDot.js";
import {usePackingStore} from "@/stores/HTTP/PackingStore.js";
import {useERPStore} from "@/stores/HTTP/ERPStore.js";
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";
import {ref, computed} from "vue";
import TableItemUnregisteredProduct from "@/components/Tables/ERP/TableItemUnregisteredProduct.vue";

const prop = defineProps({
  filterUnregProductByUser: Object
})
const warehouseStore = useWarehouseStore()
const userStore = useUserStore()
const ERPStore = useERPStore()
const webSocketStore = useWebSocketStore()
const packingStore = usePackingStore()

// const loading = computed(() => webSocketStore.loading)

const openedItemCode = ref(null);
const handleCreatePallet = async (products) => {
  try {
    await ERPStore.GET_PALLET_TYPE_BY_PRODUCT_ID(products.data[0].product_type)
    const data = {
      "action": "create_pallet",
      // "created_by_id": userStore.getUserId,
      "description": `Создание паллеты ${products.key}`,
      "assigned_to_id": packingStore.selectedTSD,
      "warehouse_id": warehouseStore.getWarehouseId,
      "to_zone_id": 1,
      "from_zone_id": 18,
      "count": 2,
      "palletType": ERPStore.palletTypeByProductId[0]?.id || [],
      "data": {
        "abc_class": "A",
        "xyz_class": "X",
        "to": [],
        "from": [],
        "barcodes": products.data.map(data => data.barcode),
      }
    }
    await webSocketStore.createPalletTask(data)
  } catch (e) {
    console.log(e)
  }
}

const toggleTable = (itemCode) => {
  if (openedItemCode.value === itemCode) {
    openedItemCode.value = null;
  } else {
    openedItemCode.value = itemCode;
  }
};
</script>
<style scoped>
.wms-packing-erp-data {
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-template-rows: 1fr;
  background-color: #2e2e2e;
  border: 1px solid #605039e0;
  border-radius: 1rem;
  padding: 1rem;
}

.in-table-container {
  display: grid;
  grid-column: 1 / 3;
  grid-template-columns: minmax(auto, 1fr);
  overflow: auto;
  border-top: 1px solid red;
  max-height: 370px;
}

table thead {
  position: sticky;
  top: 0;
  z-index: 10;
}

.erp-logo {
  display: grid;
  grid-template-rows: minmax(auto, 200px);
  justify-items: center;
}

.printer-settings-container {
  display: grid;
  grid-template-columns: minmax(auto, 1fr) 1fr;
  grid-auto-rows: 1fr;
  align-items: center;
  row-gap: 1rem;
}

.counter {
  display: grid;
  grid-template-columns: minmax(3rem, auto) 1fr minmax(3rem, auto);
  font-size: 1.2rem;
  /*align-items: center;*/
}

.counter button {
  height: 100%;
  border: 1px solid #514D4C;
}

.counter input {
  display: grid;
  text-align: center;
  border: 1px solid #514D4C;
  outline: none;
  background: none;
}

.erp-settings-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: minmax(auto, 1fr);
  padding-bottom: 1rem;
}

.erp-settings-group-btn {
  display: grid;
  grid-template-columns: repeat(2, minmax(auto, max-content));
  grid-template-rows: minmax(auto, 50px);
  column-gap: 2rem;
}

.erp-settings-info {
  display: grid;
  grid-auto-columns: max-content;
  grid-template-rows: min-content;
  column-gap: 2rem;
  align-content: end;
}

@media (max-width: 800px) {
  .wms-packing-erp-data {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .in-table-container {
    display: grid;
    grid-column: 1;
    grid-template-columns: 1fr;
  }

  .erp-settings-container {
    row-gap: 1rem;
  }

  .erp-settings-group-btn {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(auto, 50px);
    row-gap: 1.2rem;
  }

  .erp-settings-info {
    display: grid;
    grid-auto-columns: minmax(auto, 1fr);
  }
}
</style>