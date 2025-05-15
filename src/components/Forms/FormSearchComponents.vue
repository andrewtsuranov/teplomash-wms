<script setup>
import { ref, nextTick, onUnmounted, onMounted } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { useERPStore } from "@/stores/WMSStores/ERPStore.js";
import { useWarehouseStore } from "@/stores/WMSStores/WarehouseStore.js";
import { usePrintingStore } from "@/stores/WMSStores/PrintingStore.js";

const warehouseStore = useWarehouseStore();
const printingStore = usePrintingStore();
const ERPStore = useERPStore();
// Состояние поиска
// Реактивная переменная для хранения выбранного item
const selectedItem = ref(null);
const searchQuery = ref("");
const selectedFilter = ref("all");
const searchResults = ref([]);
const isLoading = ref(false);
// Дебаунс для поиска (задержка 300мс)
const debouncedSearch = useDebounceFn(async () => {
  if (searchQuery.value.length < 2) {
    searchResults.value = [];
    return;
  }
  isLoading.value = true;
  try {
    await ERPStore.SEARCH_COMPONENTS_BY_NAME({
      query: searchQuery.value,
      filter: selectedFilter.value,
      names_only: false,
      order_by: "name",
      limit: 10
    });
    searchResults.value = await ERPStore.searchComponents.results;
  } catch (e) {
    console.error("Ошибка поиска:", e);
    searchResults.value = [];
  } finally {
    isLoading.value = false;
  }
}, 300);
const handlePrintLabel = async (item) => {
  selectedItem.value = item;
  try {
    await nextTick();
    const modalElement = document.getElementById("modalPrint");
    if (!modalElement) {
      console.error("Модальное окно не найдено");
      return;
    }
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
    await ERPStore.GET_BARCODE_COMPONENT_BY_ID(selectedItem.value);
    await printingStore.GET_ZPL_PRINTERS();
    await printingStore.GET_LABEL_TEMPLATE();
    if (ERPStore.getBarcodeFromComponent) {
      printingStore.clearDataToPrint();
      printingStore.setDataToPrint([ERPStore.getBarcodeFromComponent]);
    }
    if (warehouseStore.selectedZone) {
      const printerInZone = printingStore.printersList.printers.find(
        printer => printer.zones.find(
          zone => zone.id === warehouseStore.selectedZonesByZoneType.id
        )
      );
      if (printerInZone) {
        await printingStore.setSelectedPrinter(printerInZone);
      }
    }
    if (warehouseStore.selectedWarehouse.id === 6) {
      if (printingStore.selectedPrinter.name !== "BIXOLON_SPP-L410 WiFi") {
        await printingStore.setSelectedLabelTemplate(
          printingStore.labelTemplatesList.find(
            (label) => label.code === "300_этикетка_58*40_Комплектующая"
          )
        );
      }
    }
  } catch (e) {
    console.log(e);
  }
};
const toggleDetailUnregProduct = async (item) => {
  try {
    await ERPStore.GET_PRODUCT_TYPE_BY_ID(item);
  } catch (e) {
    console.log(e);
  }
};
onMounted(() => {
});
onUnmounted(() => {
  ERPStore.clearSearchComponent();
});
</script>
<template>
  <div class="form-search-container">
    <div class="search-form mb-3">
      <div class="input-group">
        <input
          v-model="searchQuery"
          class="form-control"
          placeholder="Поиск по номенклатуре..."
          type="text"
          @input="debouncedSearch"
        />
        <select
          v-model="selectedFilter"
          class="form-select"
          style="max-width: 200px"
          @change="debouncedSearch"
        >
          <option value="all">Все поля</option>
          <option value="1">Комплектующая</option>
          <option value="2">Продукция</option>
        </select>
        <button class="btn btn-outline-primary" @click="debouncedSearch">
          Найти
        </button>
      </div>
    </div>
    <div>
      <p>Найдено: {{ searchResults?.length || 0 }}</p>
    </div>
    <!-- Таблица с результатами -->
    <div class="in-table-container table-responsive">
      <table class="table-content table table-dark align-middle table-hover">
        <colgroup>
          <col style="width: 1%" />
          <col style="width: 45%" />
          <col style="width: 10%" />
          <col style="width: 19%" />
        </colgroup>
        <thead>
        <tr>
          <th scope="col">№</th>
          <th scope="col">Комплектующие</th>
          <th scope="col">ID</th>
          <th scope="col">Задача</th>
        </tr>
        </thead>
        <tbody v-if="searchResults.length > 0">
        <tr
          v-for="(item, index) in searchResults"
          :key="item.id"
          style="cursor: pointer"
          @click="toggleDetailUnregProduct(item)"
        >
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ item.name }}</td>
          <td>{{ item.id }}</td>
          <td>
            <button
              v-if="item.item_type_group_code === 'К'"
              class="btn btn-outline-success"
              @click.stop="handlePrintLabel(item)"
            >
              Печать этикетки
            </button>
          </td>
        </tr>
        </tbody>
        <tbody v-else class="in-table-empty">
        <tr class="no-hover">
          <td class="text-center py-3" colspan="5">
            {{ isLoading ? "Загрузка..." : "Ничего не найдено" }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style scoped>
.form-search-container {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-auto-rows: min-content;
}

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

.search-form {
  margin-bottom: 1rem;
}

.form-control {
  background-color: #2b3035;
  border-color: #444;
  color: #fff;
}

.form-control:focus {
  background-color: #2b3035;
  border-color: #666;
  color: #fff;
  box-shadow: none;
}

.form-control::placeholder {
  color: #fff;
  opacity: 0.7;
}

.form-select {
  background-color: #2b3035;
  border-color: #444;
  color: #fff;
}

.form-select:focus {
  background-color: #2b3035;
  border-color: #666;
  color: #fff;
  box-shadow: none;
}

@media (max-width: 800px) {
  .in-table-container {
    display: grid;
    grid-column: 1;
    grid-template-columns: 1fr;
  }

  .input-group {
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-select {
    max-width: 100%;
  }
}
</style>
