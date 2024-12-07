import {defineStore} from 'pinia'
import ky from "ky"
import {computed, ref} from "vue"
import {useErrorStore} from "@/stores/Error/ErrorStore.js"
import {useUserStore} from "@/stores/HTTP/UserStore.js";
import {requestUrls} from "@/stores/request-urls.js";
import {useGroupByKey} from "@/composables/useGroupByKey.js";
import {useCustomSortByKey} from "@/composables/useCustomSortByKey.js";

const userStore = useUserStore()
const kyStd = ky.create({
    prefixUrl: requestUrls.storage,
    retry: 0,
    headers: {
        Authorization: `Bearer ${userStore.getTokenAccess}`
    },
})
export const useWarehouseStore = defineStore('warehouseStore', () => {
    const errorStore = useErrorStore()
//state
    const loading = ref(false)
    const allWarehouses = ref(JSON.parse(localStorage.getItem('warehouses')) || null)
    const warehouseData = ref(JSON.parse(localStorage.getItem('warehouseData')) || null)
    const allZoneTypes = ref(null)
    const warehouseZoneTypeById = ref(JSON.parse(localStorage.getItem('warehouseZoneTypeById')) || null)
    const fullListWarehousesZoneType = ref(null)
//getters
    const getWarehouseId = computed(() => {
        return warehouseData.value.id
    })
    const groupByZone = computed(() => {
        return useGroupByKey(warehouseZoneTypeById.value, 'zone')
    })
    const customSortByZone = computed(() => {
        if (allZoneTypes.value) {
            const orderKeys = allZoneTypes.value.map(zone => zone.name)
            return useCustomSortByKey(groupByZone.value, orderKeys)
        }
        return "Ошибка"
    })
//actions
    const GET_WAREHOUSES = async () => {
        loading.value = true;
        errorStore.clearError();
        try {
            const response = await kyStd('warehouses/').json()
            allWarehouses.value = response
            localStorage.setItem('warehouses', JSON.stringify(response))
            return true
        } catch (err) {
            console.log(err)
            throw err
        } finally {
            loading.value = false
        }
    }
    const WAREHOUSE_ID = async (id) => {
        loading.value = true;
        errorStore.clearError();
        try {
            const response = await kyStd(`warehouses/${id}/`)
                .json()
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
    const GET_ALl_ZONE_TYPES = async () => {
        loading.value = true;
        errorStore.clearError();
        try {
            allZoneTypes.value = await kyStd('warehouse-zone-types/').json()
            return true
        } catch (err) {
            console.log(err)
            throw err
        } finally {
            loading.value = false
        }
    }
    const GET_WAREHOUSES_ZONE_BY_ID = async (params = {}) => {
        loading.value = true;
        errorStore.clearError();
        try {
            const response = await kyStd('warehouse-zones/', {
                searchParams: params
            }).json()
            warehouseZoneTypeById.value = response
            localStorage.setItem('warehouseZoneTypeById', JSON.stringify(response))
            return true
        } catch (err) {
            console.log(err)
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
//state
        errorStore,
        loading,
        allWarehouses,
        warehouseData,
        fullListWarehousesZoneType,
        allZoneTypes,
        warehouseZoneTypeById,
//getters
        groupByZone,
        customSortByZone,
        getWarehouseId,
//actions
        GET_WAREHOUSES,
        WAREHOUSE_ID,
        GET_ALl_ZONE_TYPES,
        GET_WAREHOUSES_ZONE_BY_ID,
    }
})