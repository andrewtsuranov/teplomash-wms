import {defineStore} from 'pinia'
import ky from "ky"
import {computed, ref} from "vue"
import {useErrorStore} from "@/stores/Error/ErrorStore.js"
import {useUserStore} from "@/stores/HTTP/UserStore.js";
import {requestUrls} from "@/stores/request-urls.js";
import {log} from "qrcode/lib/core/galois-field.js";

const userStore = useUserStore()
const kyStd = ky.create({
    prefixUrl: requestUrls.storage,
    retry: 0,
    headers: {
        Authorization: `Bearer ${userStore.getTokenAccess}`
    },
})
export const useERPStore = defineStore('ERPStore', () => {
//State
    const errorStore = useErrorStore()
    const loading = ref(false)
    const palletTypeId = ref(null)
    const minItemsByIdUnreg = ref(null)
    const productTypeId = ref(null)
//Getters
    const getBarcodes = computed(() =>
        minItemsByIdUnreg.value.map(item => item.barcode
        ))
    const getPalletType = computed(() =>
        productTypeId.value?.pallet_types[0]
    )
    const getBasePallet = computed(() =>
        palletTypeId.value?.base_pallet
    )
//Actions
    const GET_MIN_ITEMS_BY_ID_UNREG = async (item, unregistered = true) => {
        loading.value = true;
        errorStore.clearError();
        try {
            minItemsByIdUnreg.value = await kyStd(`min-items-list/?product_type_id=${item.id}&unreg=${unregistered}`).json()
            return true
        } catch (e) {
            errorStore.setError(e)
            console.log(e)
            throw e
        } finally {
            loading.value = false
        }
    }
    const GET_PALLET_TYPE_VIA_PRODUCT_TYPE = async (id) => {
        loading.value = true;
        errorStore.clearError();
        try {
            palletTypeId.value = await kyStd(`pallet-types/${id}/`).json()
            return true
        } catch (e) {
            errorStore.setError(e)
            console.log(e)
            throw e
        } finally {
            loading.value = false
        }
    }
    const GET_PRODUCT_TYPE_BY_ID = async (item) => {
        loading.value = true;
        errorStore.clearError();
        try {
            productTypeId.value = await kyStd(`product-type/${item.id}/`).json()
            return true
        } catch (e) {
            errorStore.setError(e)
            console.log(e)
            throw e
        } finally {
            loading.value = false
        }
    }
    return {
        errorStore,
        loading,
        minItemsByIdUnreg,
        getBarcodes,
        productTypeId,
        palletTypeId,
        getPalletType,
        getBasePallet,
        GET_PALLET_TYPE_VIA_PRODUCT_TYPE,
        GET_MIN_ITEMS_BY_ID_UNREG,
        GET_PRODUCT_TYPE_BY_ID,
    }
})