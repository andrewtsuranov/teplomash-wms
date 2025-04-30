import { useErrorStore } from "@/stores/Error/ErrorStore.js";
import { defineStore } from "pinia";
import { ref } from "vue";
import ky from "ky";
import { useUserStore } from "@/stores/WMSStores/UserStore.js";
import { requestUrls } from "@/stores/request-urls.js";


export const usePackingStore = defineStore("packingStore", () => {
  const userStore = useUserStore();
  const kyStd = ky.create({
    prefixUrl: requestUrls.storage,
    retry: 0,
    headers: {
      Authorization: `Bearer ${userStore.getTokenAccess}`,
    },
  });
  const loading = ref(false);
  const errorStore = useErrorStore();
  const detailInfoPackingProduct = ref(null);
  const packingId = ref(JSON.parse(localStorage.getItem("packingId")) || null);
  const isShownTableItemUnregProduct = ref(false);
  const newPalletType = ref();
  const updateProductType = ref();
  //state


  //getters
  //actions
  const CREATE_PALLET_TYPE = async (data) => {
    loading.value = true;
    errorStore.clearError();
    try {
      newPalletType.value = await kyStd
        .post("pallet-types/", { json: data })
        .json();
      return true;
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      loading.value = false;
    }
  };
  const UPDATE_PRODUCT_TYPE = async (data, id) => {
    loading.value = true;
    errorStore.clearError();
    try {
      updateProductType.value = await kyStd
        .put(`product-type/${id}/`, { json: data })
        .json();
      return true;
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      loading.value = false;
    }
  };
  const openTableItemUnregProduct = (item) => {
    detailInfoPackingProduct.value = item;
    isShownTableItemUnregProduct.value = true;
  };
  const closeTableItemUnregProduct = () => {
    detailInfoPackingProduct.value = null;
    isShownTableItemUnregProduct.value = false;
  };
  return {
    //state
    errorStore,
    loading,
    detailInfoPackingProduct,
    isShownTableItemUnregProduct,
    packingId,
    newPalletType,
    updateProductType,
    //getters
    //actions
    openTableItemUnregProduct,
    closeTableItemUnregProduct,
    CREATE_PALLET_TYPE,
    UPDATE_PRODUCT_TYPE,
  };
});
