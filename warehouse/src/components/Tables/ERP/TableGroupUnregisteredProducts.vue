<template>
  <div class="in-table-container">
    <table class="table-content table table-dark table-hover">
      <thead>
      <tr>
        <th scope="col">№</th>
        <th scope="col">Изделие</th>
        <th scope="col">Ошибка</th>
        <th scope="col">Кол-во, шт</th>
        <th scope="col">Задача</th>
        <th scope="col">Дополнительно</th>
      </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in filterUnregProductByUser" :key="key">
          <th scope="row">{{ item.number }}</th>
          <td>
            {{ item?.key }}
          </td>
          <td>
            {{ item.data[0].error }}
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
                    @click="showPackingProductData(item)"
            >
              {{ openedItemCode === item?.key ? 'Скрыть список' : 'Раскрыть список' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import {useUserStore} from "@/stores/HTTP/UserStore.js";
import {useWebSocketStore} from "@/stores/WebSockets/WebSocketStore.js";
import {usePackingStore} from "@/stores/HTTP/PackingStore.js";
import {useERPStore} from "@/stores/HTTP/ERPStore.js";
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";
import {ref} from "vue";

defineProps({
  filterUnregProductByUser: Object
})
const warehouseStore = useWarehouseStore()
const userStore = useUserStore()
const ERPStore = useERPStore()
const webSocketStore = useWebSocketStore()
const packingStore = usePackingStore()
const openedItemCode = ref(null);
const handleCreatePallet = async (products) => {
  if (!packingStore.selectedTSD) {
    alert('Выберите активный ТСД')
  }
  try {
    await ERPStore.GET_PALLET_TYPE_BY_PRODUCT_ID(products.data[0].product_type)
    const data = {
      "action": "create_pallet",
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
const showPackingProductData = async (productData) => {
      try {
        await packingStore.setSelectedGroupUnregProduct(productData)
        if (openedItemCode.value === productData.key) {
          openedItemCode.value = null;
        } else {
          openedItemCode.value = productData.key;
        }
      } catch (e) {
        console.log(e)
      }
    }
</script>
<style scoped>
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

@media (max-width: 800px) {
  .in-table-container {
    display: grid;
    grid-column: 1;
    grid-template-columns: 1fr;
  }
}
</style>