import {defineStore} from 'pinia'
import ky from "ky"
import {computed, ref} from "vue"

import {useErrorStore} from "@/stores/Error/ErrorStore.js"
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
export const useERPStore = defineStore('ERPStore', () => {
//State
    const errorStore = useErrorStore()
    const loading = ref(false)
    const unregItemsById = ref(null)
    const palletTypeByProductId = ref(null)
//Getters
    const getBarcodesFromUnregItemsById = computed(() =>
        unregItemsById.value.items.map(item => item.barcode
        ))
//Actions
    const GET_UNREG_ITEMS_BY_ID = async (ItemId) => {
        loading.value = true;
        errorStore.clearError();
        try {
            unregItemsById.value = await kyStd(`items/unregistered/?product_type_id=${ItemId}`).json()
            return true
        } catch (e) {
            errorStore.setError(e)
            console.log(e)
            throw e
        } finally {
            loading.value = false
        }
    }
    const GET_PALLET_TYPE_BY_PRODUCT_ID = async (id) => {
        loading.value = true;
        errorStore.clearError();
        try {
            palletTypeByProductId.value = await kyStd(`pallet-types/by-product/${id}/`).json()
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
        palletTypeByProductId,
        unregItemsById,
        getBarcodesFromUnregItemsById,
        GET_PALLET_TYPE_BY_PRODUCT_ID,
        GET_UNREG_ITEMS_BY_ID,
    }
})