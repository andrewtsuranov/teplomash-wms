<script setup>
import {computed, onMounted, onUpdated, watch} from "vue";
import { useWebSocketStore } from "@/stores/WebSocketStore.js";
import { usePackingStore } from "@/stores/WMSStores/PackingStore.js";
import { useERPStore } from "@/stores/WMSStores/ERPStore.js";
import { useWarehouseStore } from "@/stores/WMSStores/WarehouseStore.js";
import CustomTooltip from "@/components/UI/Tooltip/CustomTooltip.vue";
import { useErrorCodeDictionary } from "@/composables/Dictionary/useErrorCodeDictionary.js";
import { usePalletStore } from "@/stores/WMSStores/PalletStore.js";

const warehouseStore = useWarehouseStore();
const ERPStore = useERPStore();
const webSocketStore = useWebSocketStore();
const packingStore = usePackingStore();
const palletStore = usePalletStore();
const erpUnregItemsPAC = computed(() => {
  if (!webSocketStore.getUnregisteredProducts) {
    return [];
  }
  return webSocketStore.getUnregisteredProducts;
});

const toggleDetailUnregProduct = async (item) => {
  try {
    if (packingStore.detailInfoPackingProduct?.id === item.id) {
      packingStore.closeTableItemUnregProduct();
    } else {
      await ERPStore.GET_MIN_ITEMS_BY_ID_UNREG(item);
      await ERPStore.GET_PRODUCT_TYPE_BY_ID(item);
      if (ERPStore.getPalletType !== undefined) {
        await palletStore.GET_PALLET_TYPE_BY_ID(ERPStore.getPalletType);
        await palletStore.GET_BASE_PALLET_TYPE_BY_ID(
          palletStore.palletTypeByID?.base_pallet,
        );
      } else {
        await palletStore.GET_PALLET_ITEM_TYPE_LIST();
      }
      await packingStore.openTableItemUnregProduct(item);
    }
  } catch (e) {
    console.log(e);
  }
};
const handleErrorMessage = (errorMessage) => {
  if (errorMessage !== undefined && Array.isArray(errorMessage)) {
    return errorMessage
      .map((err) => useErrorCodeDictionary[err] || "Неизвестная ошибка")
      .join("\n");
  }
  return "";
};
onMounted(async () => {
  try {
    if (webSocketStore.isConnected) {
      await webSocketStore.GET_UNREGISTERED_ITEMS();
    }
  } catch (e) {
    console.log(e);
  }
});

</script>
<template>
  <div class="in-table-container table-responsive">
    <table class="table-content table table-dark align-middle table-hover">
      <colgroup>
        <col style="width: 1%" />
        <!-- № -->
        <col style="width: 45%" />
        <!-- Изделие -->
        <col style="width: 10%" />
        <!-- Кол-во -->
        <col style="width: 8%" />
        <!-- Инфо -->
      </colgroup>
      <thead>
      <tr>
        <th scope="col">№</th>
        <th scope="col">Готовая продукция</th>
        <th scope="col">Кол-во, шт</th>

        <th scope="col">Инфо</th>
      </tr>
      </thead>
      <tbody v-if="erpUnregItemsPAC">
      <tr
          v-for="(item, index) in erpUnregItemsPAC"
          :key="index"
          style="cursor: pointer"
          @click="toggleDetailUnregProduct(item)"
      >
        <th scope="row">{{ index + 1 }}</th>
        <td>
          <CustomTooltip :error="handleErrorMessage(item.error)">
            <i
                v-if="item.error"
                class="bi bi-exclamation-circle-fill"
                style="color: #ffc107"
            >
            </i>
          </CustomTooltip>
          {{ item.name }}
        </td>
        <td>{{ item.total_items }}</td>

        <td>
          <i
              :class="
                packingStore.detailInfoPackingProduct?.id === item.id
                  ? 'bi-circle-fill text-primary'
                  : 'bi-circle'
              "
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
<style scoped>
.in-table-container {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  max-height: 370px;
  overflow: auto;
}

table thead {
  box-shadow: 0 1px 0 0 red;
  position: sticky;
  top: 0;
  z-index: 1;
}

.in-table-empty {
  background-color: #0000004a;
  border-color: #605039e0;
  height: 330px;
  pointer-events: none;
}

.in-table-empty td {
  color: #6c757d;
  font-size: 1.1rem;
  padding: 2rem !important;
  text-align: center;
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
