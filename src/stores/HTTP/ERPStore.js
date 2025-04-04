import {defineStore} from 'pinia'
import ky from "ky"
import {computed, ref} from "vue"
import {useErrorStore} from "@/stores/Error/ErrorStore.js"
import {useUserStore} from "@/stores/HTTP/UserStore.js";
import {requestUrls} from "@/stores/request-urls.js";
import {log} from "qrcode/lib/core/galois-field.js";

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
    // const palletTypeId = ref(null)
    const minItemsByIdUnreg = ref(null)
    const productTypeId = ref(null)
    const searchResultsComponents = ref(null)
    const getBarcodeFromComponent = ref(null)
//Getters
    const getBarcodes = computed(() =>
        minItemsByIdUnreg.value.map(item => item.barcode
        ))
    const getPalletType = computed(() =>
        productTypeId.value?.pallet_types[0]
    )
    // const getBasePallet = computed(() =>
    //     palletTypeId.value?.base_pallet
    // )
//Actions
    const GET_MIN_ITEMS_BY_ID_UNREG = async (item, unregistered = true) => {
        loading.value = true;
        errorStore.clearError();
        try {
            minItemsByIdUnreg.value = await kyStd(`min-items-list/?product_type_id=${item.id}&unreg=${unregistered}`).json()
            return true
        } catch (e) {
            errorStore.setError(e)
            console.log(e)
            throw e
        } finally {
            loading.value = false
        }
    }

    const GET_PRODUCT_TYPE_BY_ID = async (item) => {
        loading.value = true;
        errorStore.clearError();
        try {
            productTypeId.value = await kyStd(`product-type/${item.id}/`).json()
            return true
        } catch (e) {
            errorStore.setError(e)
            console.log(e)
            throw e
        } finally {
            loading.value = false
        }
    }
    const SEARCH_COMPONENTS_BY_NAME = async (data = {}) => {
        loading.value = true;
        errorStore.clearError();
        try {
            // Формируем объект параметров динамически
            const searchParams = new URLSearchParams();

            // Добавляем параметры, только если они определены в data
            if (data.query) searchParams.append('search', data.query);
            if ('names_only' in data) searchParams.append('names_only', data.names_only);
            // Передаем item_type_group только если filter задан и не равен 'all'
            if (data.filter && data.filter !== 'all') searchParams.append('item_type_group', data.filter);

            searchResultsComponents.value = await kyStd('list-product-types/', {searchParams: searchParams}).json()
            return true
        } catch (e) {
            errorStore.setError(e)
            console.log(e)
            throw e
        } finally {
            loading.value = false
        }
    }
    const GET_BARCODE_COMPONENT_BY_ID = async (data) => {
        loading.value = true;
        errorStore.clearError();
        try {
            const searchParams = new URLSearchParams();
            if ('name' in data) searchParams.append('name', data.name);
            getBarcodeFromComponent.value = await kyStd('product-type-barcodes/by-name/', {searchParams: searchParams}).json()
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
        minItemsByIdUnreg,
        getBarcodes,
        productTypeId,
        // palletTypeId,
        getPalletType,
        searchResultsComponents,
        getBarcodeFromComponent,
        // getBasePallet,
        // GET_PALLET_TYPE_VIA_PRODUCT_TYPE,
        GET_MIN_ITEMS_BY_ID_UNREG,
        GET_PRODUCT_TYPE_BY_ID,
        SEARCH_COMPONENTS_BY_NAME,
        GET_BARCODE_COMPONENT_BY_ID,
    }
})