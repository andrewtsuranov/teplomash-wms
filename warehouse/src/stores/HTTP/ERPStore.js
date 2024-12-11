import {defineStore} from 'pinia'
import ky from "ky"
import {computed, ref} from "vue"
import {useWebSocketStore} from "@/stores/WebSockets/WebSocketStore.js";
import {useErrorStore} from "@/stores/Error/ErrorStore.js"
import {useUserStore} from "@/stores/HTTP/UserStore.js";
import {useGroupByKey} from "@/composables/useGroupByKey.js";
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
    const webSocketStore = useWebSocketStore()
    const loading = ref(false)
    const palletTypeByProductId = ref(null)
//Getters
    const unregisteredProducts = computed(() => {
        return Object.keys(webSocketStore.wsUnregisteredProducts)
            .map((key, index) => ({
                number: index + 1,
                key: key,
                data: webSocketStore.wsUnregisteredProducts[key],
            }))
        // .sort((a, b) => {
        //     // Преобразование строки в Date (теперь можно напрямую)
        //     const dateA = new Date(a.data.created_at);
        //     const dateB = new Date(b.data.created_at);
        //     // Сортировка по возрастанию (самые старые даты вверху)
        //     // return dateA - dateB;
        //     // Сортировка по убыванию (самые новые даты вверху)
        //     return dateB - dateA;
        //     });
    });
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
        unregisteredProducts,
        palletTypeByProductId,
        GET_PALLET_TYPE_BY_PRODUCT_ID,
    }
})