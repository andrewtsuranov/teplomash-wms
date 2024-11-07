import {useErrorStore} from "@/stores/Error/ErrorStore.js"
import {defineStore} from 'pinia'
import {useUserStore} from "@/stores/HTTP/Auth/UserStore.js";
import ky from "ky"
import {ref} from "vue"

const userStore = useUserStore()

export const usePackingStore = defineStore('packingStore', () => {
    const errorStore = useErrorStore()
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
        palletID: [`[${palletData.zoneStorage}]-[${palletData.issue+palletData.numberByDay}]-[${palletData.dimensions}]-[${palletData.zoneStorage}]-[${palletData.zoneStorage}]-[${palletData.zoneStorage}]`]




    }
    const palletStatus = {
        pending: 'Ожидание...',
        packing: 'Упаковка...',
        handPacking: 'Ручная упаковка...',
        finish: 'Паллета упакована',
        sent: 'Отправлена на склад',
        error: "Ошибка действия",
    }
    const loading = ref(false)
    const packingData = ref(JSON.parse(localStorage.getItem('packingData')) || null)
//getters



//actions

    return {
//state
        errorStore,
        loading,
        packingData,

//getters

//actions

    }
})