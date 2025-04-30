<script setup>
import {useWebSocketStore} from "@/stores/WebSocketStore.js";
import {useWarehouseStore} from "@/stores/WMSStores/WarehouseStore.js";
import {useERPStore} from "@/stores/WMSStores/ERPStore.js";
import {ref, onMounted, watch, watchEffect} from "vue";
import TableGroupUnregisteredProducts from "@/components/Tables/ERP/TableGroupUnregisteredProducts.vue";
import SvgLogoErp from "@/components/UI/SVG/svgLogoErp.vue";
import QRCode from "qrcode";
import FormSearchComponents from "@/components/Forms/FormSearchComponents.vue";
import {usePackingStore} from "@/stores/WMSStores/PackingStore.js";
import {useRoute} from "vue-router";

const warehouseStore = useWarehouseStore();
const webSocketStore = useWebSocketStore();
const ERPStore = useERPStore();
const qrcode = ref(null);
const packingStore = usePackingStore();
const route = useRoute()
watch(
    () => ERPStore.isProductsActive,
    (newValue) => {
      // Действия для вкладки продукции
      if (!newValue) {
        packingStore.closeTableItemUnregProduct();
      }
    },
    {immediate: true},
);
const generateQR = async (data) => {
  const opts = {
    errorCorrectionLevel: "H",
    quality: 0.3,
    width: 200,
    margin: 1,
    color: {
      dark: "#000",
      light: "#EEE",
    },
  };
  return new Promise((resolve, reject) => {
    QRCode.toString(data, opts, (err, string) => {
      if (err) reject(err);
      resolve(string);
    });
  });
};
watch(() => route.params, async (newValue, oldValue) => {
  qrcode.value = await generateQR(taskScanData());
})
const taskScanData = () => {
  const data = {
    task_code: "CREATE_PALLET_WITH_SCAN",
    variables: {
      warehouse_id: warehouseStore.selectedWarehouse.id,
      to_zone_id: warehouseStore.selectedZonesByZoneType.id,
      total: 1,
    },
  };
  return JSON.stringify(data);
};
onMounted(async () => {
  try {
    qrcode.value = await generateQR(taskScanData());
    const savedTab = localStorage.getItem("wms-erp-active-tab");
    if (savedTab && ["products", "components"].includes(savedTab)) {
      await ERPStore.setActiveTabs(savedTab);
    }
  } catch (e) {
    console.log(e);
  }
});
// При необходимости сохраняем текущую вкладку в localStorage при изменении
watch(
    () => ERPStore.activeTab,
    (newTab) => {
      localStorage.setItem("wms-erp-active-tab", newTab);
    },
);
</script>
<template>
  <div class="wms-container">
    <!-- Переключатели вкладок вынесены над основным контейнером -->
    <div class="erp-tab-container">
      <ul id="erpTabs" class="nav nav-tabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button
              id="products-tab"
              :aria-selected="ERPStore.isProductsActive"
              :class="['nav-link', ERPStore.isProductsActive ? 'active' : '']"
              aria-controls="products"
              type="button"
              @click="ERPStore.setActiveTabs('products')"
          >
            Продукция
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
              id="components-tab"
              :aria-selected="ERPStore.isComponentsActive"
              :class="['nav-link', ERPStore.isComponentsActive ? 'active' : '']"
              aria-controls="components"
              type="button"
              @click="ERPStore.setActiveTabs('components')"
          >
            Комплектующие
          </button>
        </li>
      </ul>
    </div>
    <!-- Основной контейнер -->
    <div class="wms-packing-erp">
      <div class="erp-data">
        <!-- Содержимое вкладок -->
        <div id="erpTabContent" class="tab-content">
          <div
              id="products"
              :class="[
              'tab-pane fade',
              ERPStore.isProductsActive ? 'show active' : '',
            ]"
              aria-labelledby="products-tab"
              role="tabpanel"
              tabindex="0"
          >
            <div class="erp-product-data">
              <div class="erp-product-info">
                <div class="erp-product-alert alert m-0" role="alert">
                  <i class="bi bi-info-circle erp-update-alert-logo"></i>
                  <span class="erp-update-alert-text">
                    Табличные данные формируются на заключительном этапе сборки
                    и синхронизируются в автоматическом режиме. При
                    необходимости используйте кнопку ручного обновления.
                  </span>
                </div>
                <button
                    class="btn btn-outline-info"
                    title="Обновить"
                    type="button"
                    @click="webSocketStore.GET_UNREGISTERED_ITEMS()"
                >
                  <i class="bi bi-arrow-repeat" style="font-size: 2rem"></i>
                </button>
              </div>
              <table-group-unregistered-products/>
            </div>
          </div>
          <div
              id="components"
              :class="[
              'tab-pane fade',
              ERPStore.isComponentsActive ? 'show active' : '',
            ]"
              aria-labelledby="components-tab"
              role="tabpanel"
              tabindex="0"
          >
            <FormSearchComponents/>
          </div>
        </div>
      </div>
      <div class="erp-qr-task">
        <svg-logo-erp class="erp-logo"/>
        <div class="erp-task-zone">
          <div class="qrcode">
            <label style="text-transform: uppercase"
            >Собрать паллету по QR коду</label
            >
            <div v-html="qrcode"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* Общий контейнер для страницы */
.wms-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Стилизация вкладок */
.erp-tab-container {
  padding: 0 1rem;
  margin-bottom: -1px;
}

.nav-tabs {
  border-bottom: none;
  display: flex;
  gap: 0.5rem;
}

.nav-tabs .nav-item {
  margin-bottom: 0;
}

.nav-tabs .nav-link {
  color: rgba(151, 151, 151, 0.61);
  background-color: #2e2e2e;
  border: 1px solid #605039e0;
  border-bottom: none;
  border-radius: .5rem .5rem 0 0;
  padding: 0.75rem 1.5rem;
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-tabs .nav-link:hover {
  color: #fff;
  background-color: rgb(46, 46, 46);
  transform: translateY(-3px);
}

.nav-tabs .nav-link.active {
  color: blanchedalmond;
  border-color: #605039e0;
  border-bottom-color: #2e2e2e;
  background-color: #2e2e2e;
}

/* Основной контейнер */
.wms-packing-erp {
  display: grid;
  grid-template-areas:
    "data qr-task"
    "data qr-task";
  grid-template-columns: 1fr 320px;
  /*grid-template-rows: min-content 1fr;*/
  column-gap: 1.5rem;
}

.erp-data {
  grid-area: data;
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  row-gap: 2rem;
  padding: 1rem;
  background-color: #2e2e2e;
  border: 1px solid #605039e0;
  border-radius: .5rem;
}

.erp-product-data {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  row-gap: 2rem;
}

.erp-product-info {
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr);
  column-gap: 1rem;
}

.erp-product-alert {
  display: grid;
  grid-template-columns: min-content auto;
  align-items: center;
  column-gap: 1rem;
  padding: 0.4rem 1rem;
  background-color: rgba(0, 0, 0, 0.62);
  border-color: #605039e0;
}

.erp-qr-task {
  grid-area: qr-task;
  padding: 1rem;
  background-color: #2e2e2e;
  border: 1px solid #605039e0;
  border-radius: .5rem;

}

.erp-update-alert-logo {
  font-size: 1.5rem;
}

.erp-update-alert-logo,
.erp-update-alert-text {
  color: #979797;
}

.erp-logo {
  display: grid;
  grid-template-rows: minmax(auto, 200px);
  justify-items: center;
}

.erp-task-zone {
  display: grid;
  grid-template-columns: minmax(auto, 300px);
  row-gap: 1rem;
  justify-content: center;
}

.qrcode {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: min-content 1fr;
  row-gap: 0.5rem;
  justify-items: center;
}

@media (max-width: 800px) {
  .wms-packing-erp-data {
    grid-template-areas:
      "logo"
      "buttons"
      "data";
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    row-gap: 1rem;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .nav-tabs {
    flex-wrap: nowrap;
  }

  .nav-tabs .nav-link {
    flex-grow: 1;
    text-align: center;
    padding: 0.5rem 1rem;
  }

  .erp-tab-container {
    padding: 0;
  }
}
</style>
