import { defineStore } from "pinia";
import {computed, ref} from "vue";
import ky from "ky";
import { useErrorStore } from "@/stores/Error/ErrorStore.js";
import { requestUrls } from "@/stores/request-urls.js";
import { useUserStore } from "@/stores/WMSStores/UserStore.js";
import {useTransactionStore} from "@/stores/WMSStores/TransactionStore.js";
import {useFormatDate} from "@/composables/Date/useFormatDate.js";


export const usePalletStore = defineStore("palletStore", () => {
  const userStore = useUserStore();
  const kyStd = ky.create({
    prefixUrl: requestUrls.storage,
    retry: 0,
    headers: {
      Authorization: `Bearer ${userStore.getTokenAccess}`,
    },
  });
  //state
  const loading = ref(false);
  const errorStore = useErrorStore();
  const transactionStore = useTransactionStore()
  const palletItemTypeList = ref(null);
  const palletTypeList = ref(null);
  const palletTypeByID = ref(null);
  const basePalletTypeList = ref(null);
  const basePalletTypeById = ref(null);

  //getters
const getTransactionsByTypeADD_PALLET = computed(() =>
    transactionStore.allTransactionsList100.filter(tr => tr.transaction_type === "ADD_PALLET")
)

  //actions
  const GET_PALLET_TYPE_LIST = async () => {
    loading.value = true;
    errorStore.clearError();
    try {
      palletTypeList.value = await kyStd("pallet-types/").json();
      return true;
    } catch (e) {
      errorStore.setError(e);
      console.log(e);
      throw e;
    } finally {
      loading.value = false;
    }
  };
  const GET_PALLET_TYPE_BY_ID = async (id) => {
    loading.value = true;
    errorStore.clearError();
    try {
      palletTypeByID.value = await kyStd(`pallet-types/${id}/`).json();
      return true;
    } catch (e) {
      errorStore.setError(e);
      console.log(e);
      throw e;
    } finally {
      loading.value = false;
    }
  };
  const GET_BASE_PALLET_TYPE_LIST = async () => {
    loading.value = true;
    errorStore.clearError();
    try {
      basePalletTypeList.value = await kyStd("base-pallets/").json();
      return true;
    } catch (e) {
      errorStore.setError(e);
      console.log(e);
      throw e;
    } finally {
      loading.value = false;
    }
  };
  const GET_BASE_PALLET_TYPE_BY_ID = async (id) => {
    loading.value = true;
    errorStore.clearError();
    try {
      basePalletTypeById.value = await kyStd(`base-pallets/${id}/`).json();
      return true;
    } catch (e) {
      errorStore.setError(e);
      console.log(e);
      throw e;
    } finally {
      loading.value = false;
    }
  };
  const GET_PALLET_ITEM_TYPE_LIST = async () => {
    loading.value = true;
    errorStore.clearError();
    try {
      palletItemTypeList.value = await kyStd("item-types/").json();
      return true;
    } catch (e) {
      errorStore.setError(e);
      console.log(e);
      throw e;
    } finally {
      loading.value = false;
    }
  };
  const clearPalletData = () => {
    palletTypeByID.value = null
    basePalletTypeById.value = null
  }
  return {
    //state
    errorStore,
    loading,
    palletTypeList,
    palletTypeByID,
    basePalletTypeList,
    basePalletTypeById,
    palletItemTypeList,
    //getters
    getTransactionsByTypeADD_PALLET,
    //actions
    GET_PALLET_TYPE_LIST,
    GET_PALLET_TYPE_BY_ID,
    GET_BASE_PALLET_TYPE_LIST,
    GET_BASE_PALLET_TYPE_BY_ID,
    GET_PALLET_ITEM_TYPE_LIST,
    clearPalletData,
  };
});
