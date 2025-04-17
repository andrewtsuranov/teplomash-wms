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
        <th scope="col">Готовая продукция</th>
        <th scope="col">Кол-во, шт</th>
        <th scope="col">Задача</th>
        <th scope="col">Инфо</th>
      </tr>
      </thead>
      <tbody v-if="erpUnregItemsPAC">
      <tr v-for="(item, index) in erpUnregItemsPAC"
          :key="index"
          style="cursor: pointer;"
          @click="toggleDetailUnregProduct(item)"
      >
        <th scope="row">{{ index + 1 }}</th>
        <td>
          <CustomTooltip :error="handleErrorMessage(item.error)">
            <i v-if="item.error"
               class="bi bi-exclamation-circle-fill"
               style="color: #ffc107;"
            >
            </i>
          </CustomTooltip>
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
          <i :class="packingStore.detailInfoPackingProduct?.id === item.id ? 'bi-circle-fill text-primary' : 'bi-circle'"
             class="bi toggle-icon"
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
import {computed, onMounted, watch} from 'vue';
import {useWebSocketStore} from "@/stores/WebSockets/WebSocketStore.js";
import {usePackingStore} from "@/stores/HTTP/PackingStore.js";
import {useERPStore} from "@/stores/HTTP/ERPStore.js";
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";
import CustomTooltip from "@/components/UI/Tooltip/CustomTooltip.vue";
import {useErrorCodeDictionary} from "@/composables/Dictionary/useErrorCodeDictionary.js";
import {usePalletStore} from "@/stores/HTTP/PalletStore.js";

const warehouseStore = useWarehouseStore()
const ERPStore = useERPStore()
const webSocketStore = useWebSocketStore()
const packingStore = usePackingStore()
const palletStore = usePalletStore()
const erpUnregItemsPAC = computed(() => {
  if (!webSocketStore.getUnregisteredProducts) {
    return []
  }
  return webSocketStore.getUnregisteredProducts
})
const handleCreatePallet = async (item) => {
  if (!packingStore.selectedTSD) {
    alert('Выберите активный ТСД')
  }
  try {
    const data = {
      "action": "create_task",
      "taskData": {
        "task_code": "CREATE_PALLET",
        "assigned_to_id": packingStore.selectedTSD,
        "variables": {
          "warehouse_id": warehouseStore.getWarehouseId,
          "id_PT": item.id,
          "to_zone_id": warehouseStore.selectedZone.id,
        },
      }
    }
    await webSocketStore.TASK_CREATE_PALLET(data)
  } catch (e) {
    console.log(e)
  }
}

const toggleDetailUnregProduct = async (item) => {
  try {
    if (packingStore.detailInfoPackingProduct?.id === item.id) {
      packingStore.closeTableItemUnregProduct()
    } else {
      await ERPStore.GET_MIN_ITEMS_BY_ID_UNREG(item)
      await ERPStore.GET_PRODUCT_TYPE_BY_ID(item)
      if (ERPStore.getPalletType !== undefined) {
        await palletStore.GET_PALLET_TYPE_BY_ID(ERPStore.getPalletType)
        await palletStore.GET_BASE_PALLET_TYPE_BY_ID(palletStore.palletTypeByID?.base_pallet)
      } else {
        await palletStore.GET_PALLET_ITEM_TYPE_LIST();
      }
      await packingStore.openTableItemUnregProduct(item)
    }
  } catch (e) {
    console.log(e)
  }
}
const handleErrorMessage = (errorMessage) => {
  if (errorMessage !== undefined && Array.isArray(errorMessage)) {
    return errorMessage
        .map(err => useErrorCodeDictionary[err] || 'Неизвестная ошибка')
        .join('\n');
  }
  return '';
};
onMounted(async () => {
  try {
    if (webSocketStore.isConnected) {
      await webSocketStore.GET_UNREGISTERED_ITEMS()
    }
  } catch (e) {
    console.log(e)
  }
})
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
  z-index: 1;
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