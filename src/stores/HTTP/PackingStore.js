import {useErrorStore} from "@/stores/Error/ErrorStore.js"
import {defineStore} from 'pinia'
import {computed, ref} from "vue"
import ky from "ky"
import {useUserStore} from "@/stores/HTTP/UserStore.js";
import {requestUrls} from "@/stores/request-urls.js";

const userStore = useUserStore()
const kyStd = ky.create({
    prefixUrl: requestUrls.storage,
    retry: 0,
    headers: {
        Authorization: `Bearer ${userStore.getTokenAccess}`
    },
})

export const usePackingStore = defineStore('packingStore', () => {
    const loading = ref(false)
    const errorStore = useErrorStore()
    const selectedTSD = ref(JSON.parse(localStorage.getItem('selectedTsd')) || null)
    const detailInfoPackingProduct = ref(null);
    const packingId = ref(JSON.parse(localStorage.getItem('packingId')) || null)
    const dataYYYYMMDD = ref(new Date().toISOString().slice(0, 10));
    const isShownTableItemUnregProduct = ref(false)
    const newPalletType = ref()
    const updateProductType = ref()
//state
    const palletData = {
        issue: dataYYYYMMDD.value,
        numberByDay: '01',
        zoneStorage: 'A',
        dimensions: '800',
        productType: 'Продукция',
        productName: 'КЭВ-9П2021Е',
        productQty: '9',
        addInfo: 'Панель из глянцевой нержавеющей стали',
        palletID: ''
    }
    const palletStatus = {
        pending: 'Ожидание...',
        packing: 'Упаковка...',
        handPacking: 'Ручная упаковка...',
        finish: 'Паллета упакована',
        sent: 'Отправлена на склад',
        error: "Ошибка действия",
    }
//getters
//actions
    const CREATE_PALLET_TYPE = async (data) => {
        loading.value = true;
        errorStore.clearError();
        try {
            newPalletType.value = await kyStd
                .post('pallet-types/', {json: data})
                .json()
            return true
        } catch (e) {
            console.log(e)
            throw e
        } finally {
            loading.value = false
        }
    }
    const UPDATE_PRODUCT_TYPE= async (data, id) => {
        loading.value = true;
        errorStore.clearError();
        try {
            updateProductType.value = await kyStd
                .put(`product-type/${id}/`, {json: data})
                .json()
            return true
        } catch (e) {
            console.log(e)
            throw e
        } finally {
            loading.value = false
        }
    }

    const setSelectedTSD = (tsdId) => {
        selectedTSD.value = tsdId
        localStorage.setItem('selectedTsd', JSON.stringify(tsdId))
    }
    const openTableItemUnregProduct = (item) => {
        detailInfoPackingProduct.value = item;
        isShownTableItemUnregProduct.value = true;
    }
    const closeTableItemUnregProduct = () => {
        detailInfoPackingProduct.value = null;
        isShownTableItemUnregProduct.value = false;
    }
    const clearSelectedTSD = () => {
        selectedTSD.value = null
        localStorage.removeItem('selectedTsd')
    }
    return {
//state
        errorStore,
        loading,
        detailInfoPackingProduct,
        isShownTableItemUnregProduct,
        palletData,
        palletStatus,
        selectedTSD,
        packingId,
        newPalletType,
        updateProductType,
//getters
//actions
        setSelectedTSD,
        openTableItemUnregProduct,
        closeTableItemUnregProduct,
        clearSelectedTSD,
        CREATE_PALLET_TYPE,
        UPDATE_PRODUCT_TYPE,
    }
})