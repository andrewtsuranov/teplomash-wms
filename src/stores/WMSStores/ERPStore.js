import { defineStore } from "pinia";
import ky from "ky";
import { computed, ref } from "vue";
import { useErrorStore } from "@/stores/Error/ErrorStore.js";
import { useUserStore } from "@/stores/WMSStores/UserStore.js";
import { requestUrls } from "@/stores/request-urls.js";

const userStore = useUserStore();
const kyStd = ky.create({
  prefixUrl: requestUrls.storage,
  retry: 0,
  headers: {
    Authorization: `Bearer ${userStore.getTokenAccess}`,
  },
});
export const useERPStore = defineStore("ERPStore", () => {
  //State
  const errorStore = useErrorStore();
  const loading = ref(false);
  const minItemsByIdUnreg = ref(null);
  const productTypeId = ref(null);
  const searchComponents = ref(null);
  const getBarcodeFromComponent = ref(null);
  //Getters
  const getNameAndBarcodeProductList = computed(
    () =>
      minItemsByIdUnreg.value?.map((item) => ({
        barcode: item.barcode || "N/A",
        name: item.name || productTypeId.value?.name || "N/A",
      })) || [],
  );
  const getPalletType = computed(() => productTypeId.value?.pallet_types[0]);


  //Actions
  const GET_MIN_ITEMS_BY_ID_UNREG = async (item, zone_id = 38) => {
    loading.value = true;
    errorStore.clearError();
    try {
      minItemsByIdUnreg.value = await kyStd(
        `min-items-list/?product_type_id=${item.id}&zone=${zone_id}`,
      ).json();
      return true;
    } catch (e) {
      errorStore.setError(e);
      console.log(e);
      minItemsByIdUnreg.value = [];
      throw e;
    } finally {
      loading.value = false;
    }
  };
  const GET_PRODUCT_TYPE_BY_ID = async (item) => {
    loading.value = true;
    errorStore.clearError();
    try {
      productTypeId.value = await kyStd(`product-type/${item.id}/`).json();
      return true;
    } catch (e) {
      errorStore.setError(e);
      console.log(e);
      throw e;
    } finally {
      loading.value = false;
    }
  };
  const SEARCH_COMPONENTS_BY_NAME = async (data) => {
    loading.value = true;
    errorStore.clearError();
    try {
      const searchParams = new URLSearchParams();
      if (data.query) searchParams.append("search", data.query);
      if (data.names_only) searchParams.append("names_only", data.names_only);
      if (data.order_by) searchParams.append("order_by", data.order_by);
      if (data.filter && data.filter !== "all")
        searchParams.append("item_type_group", data.filter);
      if (data.limit) searchParams.append("limit", data.limit);
      searchComponents.value = await kyStd("list-product-types/", {
        searchParams: searchParams,
      }).json();
      return true;
    } catch (e) {
      errorStore.setError(e);
      console.log(e);
      throw e;
    } finally {
      loading.value = false;
    }
  };
  const GET_BARCODE_COMPONENT_BY_ID = async (data) => {
    loading.value = true;
    errorStore.clearError();
    try {
      const searchParams = new URLSearchParams();
      if ("name" in data) searchParams.append("name", data.name);
      getBarcodeFromComponent.value = await kyStd(
        "product-type-barcodes/by-name/",
        { searchParams: searchParams },
      ).json();
      return true;
    } catch (e) {
      errorStore.setError(e);
      console.log(e);
      throw e;
    } finally {
      loading.value = false;
    }
  };
  const clearERPData = () => {
    minItemsByIdUnreg.value = null
    productTypeId.value = null
  }
  const clearSearchComponent = () => {
    searchComponents.value = null
  }
  return {
    errorStore,
    loading,
    minItemsByIdUnreg,
    getNameAndBarcodeProductList,
    productTypeId,
    getPalletType,
    searchComponents,
    getBarcodeFromComponent,
    GET_MIN_ITEMS_BY_ID_UNREG,
    GET_PRODUCT_TYPE_BY_ID,
    SEARCH_COMPONENTS_BY_NAME,
    GET_BARCODE_COMPONENT_BY_ID,
    clearERPData,
    clearSearchComponent,
  };
});
