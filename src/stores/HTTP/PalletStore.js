import {defineStore} from 'pinia'
import {ref} from "vue";
import ky from "ky";
import {useErrorStore} from "@/stores/Error/ErrorStore.js";
import {requestUrls} from "@/stores/request-urls.js";
import {useUserStore} from "@/stores/HTTP/UserStore.js";

const userStore = useUserStore()
const kyStd = ky.create({
    prefixUrl: requestUrls.storage,
    retry: 0,
    headers: {
        Authorization: `Bearer ${userStore.getTokenAccess}`
    },
})
export const usePalletStore = defineStore('palletStore', () => {
//state
    const loading = ref(false)
    const errorStore = useErrorStore()
    const palletType = ref(null)
//getters
//actions
    const GET_PALLET_TYPE_LIST = async () => {
        loading.value = true;
        errorStore.clearError();
        try {
            palletType.value = await kyStd('pallet-types/').json()
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
//state
        errorStore,
        loading,
        palletType,
//getters
//actions
        GET_PALLET_TYPE_LIST,
    }
})