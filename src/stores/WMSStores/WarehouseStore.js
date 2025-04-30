import {defineStore} from "pinia";
import ky from "ky";
import {computed, ref} from "vue";
import {useErrorStore} from "@/stores/Error/ErrorStore.js";
import {useUserStore} from "@/stores/WMSStores/UserStore.js";
import {requestUrls} from "@/stores/request-urls.js";

export const useWarehouseStore = defineStore("warehouseStore", () => {
    const errorStore = useErrorStore();
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
    const allWarehouses = ref(JSON.parse(localStorage.getItem("warehouses")) || null)
    const selectedWarehouse = ref(JSON.parse(localStorage.getItem("selectedWarehouse")) || null)
    const zoneStatisticsByWarehouseID = ref(JSON.parse(localStorage.getItem("zoneStatisticsByWarehouseID")) || null)
    const detailedZoneStatistics = ref(JSON.parse(localStorage.getItem("detailedZoneStatistics")) || null)
    const selectedZone = ref(JSON.parse(localStorage.getItem("selectedZone")) || null)
    const selectedZonesByZoneType = ref(JSON.parse(localStorage.getItem("selectedZonesByZoneType")) || null)
    //getters
    const zonesByZoneType = computed(() =>
        zoneStatisticsByWarehouseID.value?.zones.filter(item => item.type.code === selectedZone.value.code) || [])
    //actions
    const GET_ALL_WAREHOUSES = async () => {
        loading.value = true;
        errorStore.clearError();
        try {
            const response = await kyStd("warehouses/").json();
            allWarehouses.value = response;
            localStorage.setItem("warehouses", JSON.stringify(response));
            errorStore.clearError();
            return true;
        } catch (e) {
            errorStore.setError(e)
            console.log(e);
            throw e;
        } finally {
            loading.value = false;
        }
    };
    const setZoneStatisticsByWarehouseID = (payload) => {
        zoneStatisticsByWarehouseID.value = payload;
        localStorage.setItem("zoneStatisticsByWarehouseID", JSON.stringify(payload));
    };
    const setDetailedZoneStatistics = (payload) => {
        detailedZoneStatistics.value = payload;
        localStorage.setItem("detailedZoneStatistics", JSON.stringify(payload));
    };
    const setSelectedWarehouse = (payload) => {
        selectedWarehouse.value = payload;
        localStorage.setItem("selectedWarehouse", JSON.stringify(payload));
    }
    const setSelectedZone = (zone) => {
        selectedZone.value = zone;
        localStorage.setItem("selectedZone", JSON.stringify(zone));
    }
    const setSelectedZonesByZoneType = (payload) => {
        selectedZonesByZoneType.value = payload;
        localStorage.setItem("selectedZonesByZoneType", JSON.stringify(payload));
    }
    return {
        //state
        errorStore,
        loading,
        allWarehouses,
        selectedWarehouse,
        zoneStatisticsByWarehouseID,
        selectedZone,
        selectedZonesByZoneType,
        detailedZoneStatistics,
        //getters
        zonesByZoneType,
        //actions
        GET_ALL_WAREHOUSES,
        setZoneStatisticsByWarehouseID,
        setDetailedZoneStatistics,
        setSelectedWarehouse,
        setSelectedZone,
        setSelectedZonesByZoneType,
    }
});
