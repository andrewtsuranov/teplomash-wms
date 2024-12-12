import {defineStore} from 'pinia'
import ky from "ky"
import {ref} from "vue"

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
    const palletTypeByProductId = ref(null)
    const unregProductByKey = ref(null)
//Getters

//Actions
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
        unregProductByKey,
        GET_PALLET_TYPE_BY_PRODUCT_ID,
    }
})