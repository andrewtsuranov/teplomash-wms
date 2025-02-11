import {defineStore} from 'pinia'
import ky from "ky"
import {computed, ref} from "vue"
import {useErrorStore} from "@/stores/Error/ErrorStore.js"
import {useUserStore} from "@/stores/HTTP/UserStore.js";
import {requestUrls} from "@/stores/request-urls.js";
import {useGroupByKey} from "@/composables/useGroupByKey.js";
import {useCustomSortByKey} from "@/composables/useCustomSortByKey.js";
import {useTransliterate} from "@/composables/useTransliterate.js";

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
    const selectedZone = ref(JSON.parse(localStorage.getItem('selectedZone')) || null)
    const allZoneTypes = ref(null)
    const warehouseZoneTypeById = ref(JSON.parse(localStorage.getItem('warehouseZoneTypeById')) || null)
    const warehouseAliasMap = ref({})
//getters
    const GET_WAREHOUSE = computed(() => {
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
            errorStore.clearError()
            return true
        } catch (e) {
            errorStore.setError(e)
            console.log(e)
            throw e
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
            const alias = useTransliterate(response.name).toLowerCase().replace(/\s+/g, '-');
            warehouseAliasMap.value = {[response.id]: alias}; // Создаём объект с одним ключом (id склада)
            localStorage.setItem('warehouseData', JSON.stringify(response))
            errorStore.clearError()
            return true
        } catch (e) {
            console.log(e)
            errorStore.setError(e)
            throw e
        } finally {
            loading.value = false
        }
    }
    const GET_ALl_ZONE_TYPES = async () => {
        loading.value = true;
        errorStore.clearError();
        try {
            allZoneTypes.value = await kyStd('warehouse-zone-types/').json()
            errorStore.clearError()
            return true
        } catch (e) {
            console.log(e)
            errorStore.setError(e)
            throw e
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
            await GET_ALl_ZONE_TYPES()
            errorStore.clearError()
            return true
        } catch (e) {
            console.log(e)
            errorStore.setError(e)
            throw e
        } finally {
            loading.value = false
        }
    }
    const setSelectedZone =  (zone) => {
       selectedZone.value = zone
       localStorage.setItem('selectedZone', JSON.stringify(zone))
    }
    const clearSelectedZone =  () => {
        selectedZone.value = null
        localStorage.removeItem('selectedZone')
    }
    return {
//state
        errorStore,
        loading,
        allWarehouses,
        warehouseData,
        allZoneTypes,
        warehouseZoneTypeById,
        warehouseAliasMap,
        selectedZone,
//getters
        groupByZone,
        customSortByZone,
        GET_WAREHOUSE,
//actions
        GET_WAREHOUSES,
        WAREHOUSE_ID,
        GET_ALl_ZONE_TYPES,
        GET_WAREHOUSES_ZONE_BY_ID,
        setSelectedZone,
        clearSelectedZone,
    }
})