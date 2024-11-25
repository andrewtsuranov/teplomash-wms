import {useErrorStore} from "@/stores/Error/ErrorStore.js"
import {defineStore} from 'pinia'
// import ky from "ky"
import {ref} from "vue"

export const usePackingStore = defineStore('packingStore', () => {
    const loading = ref(false)
    const errorStore = useErrorStore()
    const selectedTSD = ref(JSON.parse(localStorage.getItem('selectedTSD')) || null)
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
    // const packingData = ref(JSON.parse(localStorage.getItem('packingData')) || null)
//getters
//actions
    return {
//state
        errorStore,
        loading,
        // packingData,
        palletData,
        palletStatus,
        selectedTSD,
//getters
//actions
    }
})