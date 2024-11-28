import {useErrorStore} from "@/stores/Error/ErrorStore.js"
import {defineStore} from 'pinia'
import {useUserStore} from "@/stores/HTTP/Auth/UserStore.js";
import ky from "ky"
import {computed, ref} from "vue"
import {requestUrls} from "@/stores/request-urls.js";

const userStore = useUserStore()
const kyStd = ky.create({
    prefixUrl: requestUrls.storage,
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
    const warehouseData = ref(JSON.parse(localStorage.getItem('warehouseData')) || null)
//getters
    const sortedWarehouses = computed(() => {
        return fullListWarehouses.value.slice().sort((a, b) => a.number - b.number);
    });

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
        sortedWarehouses,
//actions
        GET_WAREHOUSES,
        WAREHOUSE_ID,
    }
})