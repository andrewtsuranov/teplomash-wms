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
    const getListItemBarcode = computed(() => {
        return unregProductByID.value?.items.map(item=>item.barcode)
    })

//Actions
    const getItemUnregProductByID = (id) => {
        unregProductByID.value = webSocketStore.wsGroupUnregProduct[id]
    }



    return {
        errorStore,
        loading,
        unregProductByID,
        getListItemBarcode,
        getItemUnregProductByID,
    }
})