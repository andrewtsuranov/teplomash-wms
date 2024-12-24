<template>
    <div class="in-table-container table-responsive">
      <table class="table-content table table-dark align-middle table-hover">
        <colgroup>
          <col style="width: 1%">  <!-- № -->
          <col style="width: 45%"> <!-- Изделие -->
          <col style="width: 15%"> <!-- Кол-во -->
          <col style="width: 18%"> <!-- Задача -->
          <col style="width: 5%"> <!-- Инфо -->
        </colgroup>
        <thead>
        <tr>
          <th scope="col">№</th>
          <th scope="col">Изделие</th>
          <th scope="col">Кол-во, шт</th>
          <th scope="col">Задача</th>
          <th scope="col">Инфо</th>
        </tr>
        </thead>
        <!-- Изменено условие: показываем данные, если они есть -->
        <tbody v-if="filterUnregProductByUser && filterUnregProductByUser.length">
        <tr v-for="(item, key) in filterUnregProductByUser"
            :key="key"
            @click="toggleDetailUnregProduct(item)"
            style="cursor: pointer;"
        >
          <th scope="row">{{ item?.number }}</th>
          <td>
            <i class="bi bi-exclamation-circle-fill"
               v-b-tooltip.hover :title="item.data[0].error"
               style="color: #ffc107;"
               v-if="item.data[0].error"></i>
            {{ item?.key }}
          </td>
          <td>{{ item.data.length }}</td>
          <td>
            <button class="btn btn-outline-success"
                    @click.stop="handleCreatePallet(item)"
            >Собрать паллету
            </button>
          </td>
          <td>
            <i class="bi toggle-icon"
               :class="packingStore.openedItemProductKey === item?.key ? 'bi-circle-fill text-primary' : 'bi-caret-down-fill'"
               @click="toggleDetailUnregProduct(item)"
            ></i>
          </td>
        </tr>
        </tbody>
        <!-- Показываем сообщение об отсутствии данных в противном случае -->
        <tbody v-else class="in-table-empty">
        <tr class="no-hover">
          <td colspan="5" class="text-center py-3">Данные отсутствуют</td>
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

defineProps({
  filterUnregProductByUser: Object
})
const warehouseStore = useWarehouseStore()
const userStore = useUserStore()
const ERPStore = useERPStore()
const webSocketStore = useWebSocketStore()
const packingStore = usePackingStore()
const handleCreatePallet = async (products) => {
  if (!packingStore.selectedTSD) {
    alert('Выберите активный ТСД')
  }
  try {
    await ERPStore.GET_PALLET_TYPE_BY_PRODUCT_ID(products.data[0].product_type)
    const data = {
      "action": "create_task",
      "taskData": {
        "task_code": "CREATE_PALLET",
        "assigned_to_id": packingStore.selectedTSD,
        "variables": {
          "warehouse_id": warehouseStore.getWarehouseId,
          "id_PT": products.data[0].product_type,
          "to_zone_id": 1,
          "from_zone_id": 1,
        },
      }
    }
    await webSocketStore.createPalletTask(data)
  } catch (e) {
    console.log(e)
  }
}
const toggleDetailUnregProduct = async (productData) => {
  try {
    if (packingStore.openedItemProductKey === productData.key) {
      packingStore.closeTableItemUnregProduct()
    } else {
      await packingStore.setSelectedGroupUnregProduct(productData)
      packingStore.openTableItemUnregProduct(productData.key)
    }
  } catch (e) {
    console.log(e)
  }
}
</script>
<style scoped>
.in-table-container {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  overflow: auto;
  /*border-top: 1px solid red;*/
  max-height: 370px;
}

table thead {
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 1px 0 0 red;
}
.in-table-empty {
  background-color: #0000004a;
  border-color: #605039e0;
  height: 330px;
  pointer-events: none;
}

.in-table-empty td {
  text-align: center;
  padding: 2rem !important;
  font-size: 1.1rem;
  color: #6c757d;
}

.toggle-icon {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.toggle-icon:hover {
  transform: scale(1.2);
}

@media (max-width: 800px) {
  .in-table-container {
    display: grid;
    grid-column: 1;
    grid-template-columns: 1fr;
  }
}
</style>