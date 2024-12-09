import {defineStore} from 'pinia'
import {computed, ref} from "vue"
import {useWebSocketStore} from "@/stores/WebSockets/WebSocketStore.js";
import {useErrorStore} from "@/stores/Error/ErrorStore.js"

export const useERPStore = defineStore('ERPStore', () => {
//State
    const errorStore = useErrorStore()
    const webSocketStore = useWebSocketStore()
    const loading = ref(false)
    const unregProductByID = ref(null)
//Getters
    const getItemBarcode = computed(() => {
        return unregProductByID.value?.items.map(item => item)
    })
    const getItemPalletType = computed(() => {
        return unregProductByID.value?.product_type.pallet_types.map(palletType => palletType)
    })
//Actions


    const getItemUnregProductByCode = (code) => {
        // Находим элемент в массиве wsGroupUnregProduct, у которого product_type.code совпадает с переданным code
        const foundItem = webSocketStore.wsGroupUnregProduct.find(
            (item) => item.product_type.code === code
        );

        // Если элемент найден, присваиваем его unregProductByID.value
        if (foundItem) {
            unregProductByID.value = foundItem;
        } else {
            // Опционально: обрабатываем случай, когда элемент не найден
            unregProductByID.value = null;
            console.warn(`Item with code ${code} not found in wsGroupUnregProduct`);
        }
    };
    return {
        errorStore,
        loading,
        unregProductByID,
        getItemBarcode,
        getItemPalletType,
        getItemUnregProductByCode,
    }
})