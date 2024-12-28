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
      <tbody v-if="filterUnregProductByUser">
      <tr v-for="(item, index) in filterUnregProductByUser"
          :key="index"
          style="cursor: pointer;"
          @click="toggleDetailUnregProduct(item.id)"
      >
        <th scope="row">{{ index + 1 }}</th>
        <td>
          <i v-if="item.error"
             v-b-tooltip.hover :title="item?.error.map(e => e)"
             class="bi bi-exclamation-circle-fill"
             style="color: #ffc107;"></i>
          {{ item.name }}
        </td>
        <td>{{ item.total_items }}</td>
        <td>
          <button class="btn btn-outline-success"
                  @click.stop="handleCreatePallet(item)"
          >Собрать паллету
          </button>
        </td>
        <td>
          <i :class="packingStore.openedItemProductId === item?.id ? 'bi-circle-fill text-primary' : 'bi-circle'"
             class="bi toggle-icon"
             @click="toggleDetailUnregProduct(item)"
          ></i>
        </td>
      </tr>
      </tbody>
      <!-- Показываем сообщение об отсутствии данных в противном случае -->
      <tbody v-else class="in-table-empty">
      <tr class="no-hover">
        <td class="text-center py-3" colspan="5">Данные отсутствуют</td>
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
const handleCreatePallet = async (item) => {
  console.log(item)
  if (!packingStore.selectedTSD) {
    alert('Выберите активный ТСД')
  }
  try {
    await ERPStore.GET_UNREG_ITEMS_BY_ID(item.id)
    if (ERPStore.unregItemsById.items) {
      await ERPStore.GET_PALLET_TYPE_BY_PRODUCT_ID(ERPStore.unregItemsById.items[0].product_type_id)
      const data = {
        "action": "create_task",
        "taskData": {
          "task_code": "CREATE_PALLET",
          "assigned_to_id": packingStore.selectedTSD,
          "variables": {
            "warehouse_id": warehouseStore.getWarehouseId,
            "id_PT": ERPStore.unregItemsById.items[0].product_type_id,
            "to_zone_id": 1,
            "from_zone_id": 1,
          },
        }
      }
    await webSocketStore.createPalletTask(data)
    }
  } catch (e) {
    console.log(e)
  }
}
const toggleDetailUnregProduct = async (ItemId) => {
  try {
    if (packingStore.openedItemProductId === ItemId) {
      packingStore.closeTableItemUnregProduct()
    } else {
      await ERPStore.GET_UNREG_ITEMS_BY_ID(ItemId)
      await packingStore.openTableItemUnregProduct(ItemId)
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