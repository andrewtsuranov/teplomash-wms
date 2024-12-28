import {useErrorStore} from "@/stores/Error/ErrorStore.js"
import {defineStore} from 'pinia'
import {computed, ref} from "vue"

export const usePackingStore = defineStore('packingStore', () => {
    const loading = ref(false)
    const errorStore = useErrorStore()
    const selectedTSD = ref(JSON.parse(localStorage.getItem('selectedTsd')) || null)
    const openedItemProductId = ref(null);
    const isShownTableItemUnregProduct = ref(false)
    const packingId = ref(JSON.parse(localStorage.getItem('packingId')) || null)
    const dataYYYYMMDD = ref(new Date().toISOString().slice(0, 10));
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
    const setSelectedTSD = (tsdId) => {
        selectedTSD.value = tsdId
        localStorage.setItem('selectedTsd', JSON.stringify(tsdId))
    }
    const openTableItemUnregProduct = (itemId) => {
        openedItemProductId.value = itemId;
        isShownTableItemUnregProduct.value = true;
    }
    const closeTableItemUnregProduct = () => {
        openedItemProductId.value = null;
        isShownTableItemUnregProduct.value = false;
        selectedGroupUnregProduct.value = null;
    }
    const clearSelectedTSD = () => {
        selectedTSD.value = null
        localStorage.removeItem('selectedTsd')
    }
    return {
//state
        errorStore,
        loading,
        openedItemProductId,
        isShownTableItemUnregProduct,
        palletData,
        palletStatus,
        selectedTSD,
        packingId,
//getters

//actions
        setSelectedTSD,
        openTableItemUnregProduct,
        closeTableItemUnregProduct,
        clearSelectedTSD,
    }
})