import {useErrorStore} from "@/stores/Error/ErrorStore.js"
import {useRouter} from "vue-router";
import {defineStore} from 'pinia'
import {useUserStore} from "@/stores/HTTP/Auth/UserStore.js";
import ky from "ky"
import {ref, computed} from "vue"

const userStore = useUserStore()
const router = useRouter()
const kyStd = ky.create({
    prefixUrl: 'http://38.180.192.229/api/manager/',
    // prefixUrl: 'http://lab:8080/api/manager/',
    retry: 0,
    headers: {
        Authorization: `Bearer ${userStore.getTokenAccess}`
    },
})
export const useStorageStore = defineStore('storageStore', () => {
    const errorStore = useErrorStore()
//state
    const loading = ref(false)
    const fullListWarehouses = ref(JSON.parse(localStorage.getItem('warehouses')) || null)
    const warehouseData = ref(JSON.parse(localStorage.getItem('warehouses')) || null)
//getters
//actions
    async function GET_WAREHOUSES() {
        loading.value = true;
        errorStore.clearError();
        try {
            const response = await kyStd('warehouses/').json()
            fullListWarehouses.value = response
            localStorage.setItem('warehouses', JSON.stringify(response))
            return true
        } catch (err) {
            console.log(err)
            throw err
        } finally {
            loading.value = false
        }
    }

    async function WAREHOUSE_ID(id) {
        loading.value = true;
        errorStore.clearError();
        try {
            const response = await kyStd(`warehouses/${id}/`).json()
            warehouseData.value = response
            localStorage.setItem('warehouseData', JSON.stringify(response))
            return true
        } catch (err) {
            console.log(err)
            throw err
        } finally {
            loading.value = false
        }
    }

    // function clearUserData() {
    //     user.value = null
    //     localStorage.removeItem('userData')
    //     return true
    // }
    return {
//state
        errorStore,
        loading,
        fullListWarehouses,
        warehouseData,
//getters
//actions
        GET_WAREHOUSES,
        WAREHOUSE_ID,
    }
})