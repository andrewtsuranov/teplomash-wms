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
    const unregProductByID = ref(null)
    const productTypeById = ref(null)
//Getters
    const getItemBarcode = computed(() => {
        return unregProductByID.value?.items.map(item => item)
    })
    const getItemPalletType = computed(() => {
        return unregProductByID.value?.product_type.pallet_types.map(palletType => palletType)
    })
//Actions
    const getItemUnregProductByCode = (code) => {
        // Находим элемент в массиве wsUnregisteredProducts, у которого product_type.code совпадает с переданным code
        const foundItem = webSocketStore.wsUnregisteredProducts?.find(
            (item) => item.product_type.code === code
        );
        // Если элемент найден, присваиваем его unregProductByID.value
        if (foundItem) {
            unregProductByID.value = foundItem;
        } else {
            // Опционально: обрабатываем случай, когда элемент не найден
            unregProductByID.value = null;
            console.warn(`Item with code ${code} not found in wsUnregisteredProducts`);
        }
    };
    const GET_PRODUCT_TYPE_BY_ID = async (id) => {
        console.log(id)
        loading.value = true;
        errorStore.clearError();
        try {
            const response = await kyStd(`pallet-types/by-product/${id}/`).json()
            productTypeById.value = response
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
        unregProductByID,
        getItemBarcode,
        getItemPalletType,
        productTypeById,
        getItemUnregProductByCode,
        GET_PRODUCT_TYPE_BY_ID,
    }
})