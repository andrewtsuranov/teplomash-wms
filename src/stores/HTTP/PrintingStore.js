import {defineStore} from 'pinia'
import {computed, ref} from "vue"
import ky from "ky";
import {requestUrls} from "@/stores/request-urls.js";
import {useErrorStore} from "@/stores/Error/ErrorStore.js";
import {useERPStore} from "@/stores/HTTP/ERPStore.js";
import {useUserStore} from '@/stores/HTTP/UserStore.js'
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";
import {usePackingStore} from "@/stores/HTTP/PackingStore.js";
import {log} from "qrcode/lib/core/galois-field.js";

const ERPStore = useERPStore()
const warehouseStore = useWarehouseStore()
const userStore = useUserStore()
const kyStd = ky.create({
    prefixUrl: requestUrls.storage,
    retry: 0,
    headers: {
        Authorization: `Bearer ${userStore.getTokenAccess}`
    },
})
const kyPrint = kyStd.extend({
    hooks: {
        afterResponse: [
            async (request, options, response) => {
                if (response.status === 401) {
                    const errorStore = useErrorStore()
                    errorStore.setError({
                        status: response.status,
                        message: 'Ошибка авторизации! Пользователь не авторизован, требуется регистрация!'
                    })
                }
            }
        ]
    }
})
export const usePrintingStore = defineStore('printingStore', () => {
//state
    const errorStore = useErrorStore()
    const packingStore = usePackingStore()
    const loading = ref(false)
    const printersList = ref(null)
    const printStatus = ref(null)
    const selectedPrinter = ref(null)
    const selectedLabelTemplate = ref(null)
    const labelTemplatesList = ref(null)
    const quantityLabel = ref(1)
    const dataToPrint = ref(null)
    const dataToPreview = ref(null)
//getters
//actions
    const GET_ZPL_PRINTERS = async () => {
        loading.value = true;
        errorStore.clearError();
        try {
            printersList.value = await kyPrint('printers/list_printers/').json()
            return true
        } catch (err) {
            errorStore.Error = err.message
            throw err;
        } finally {
            loading.value = false
        }
    }
    const GET_LABEL_TEMPLATE = async () => {
        loading.value = true;
        errorStore.clearError();
        try {
            labelTemplatesList.value = await kyPrint('printers/label-templates/').json()
            return true
        } catch (err) {
            errorStore.Error = err.message
            throw err;
        } finally {
            loading.value = false
        }
    }
    const PRINT_LABEL_300_BARCODE_58x40_PRODUCTS = async (payload) => {
        loading.value = true;
        errorStore.clearError();
        try {
            payload.data.map(item => {
                item ["name"] = packingStore.detailInfoPackingProduct.name
            })
            printStatus.value = await kyPrint
                .post('printers/print_label/', {json: payload})
                .json()
            return true
        } catch (err) {
            console.log(err)
            throw err
        } finally {
            loading.value = false
        }
    }
    const PRINT_LABEL_300_BARCODE_58x40_COMPONENTS = async (payload) => {
        loading.value = true;
        errorStore.clearError();
        try {
            printStatus.value = await kyPrint
                .post('printers/print_label/', {json: payload})
                .json()
            return true
        } catch (err) {
            console.log(err)
            throw err
        } finally {
            loading.value = false
        }
    }
    const setSelectedPrinter = (printer) => {
        selectedPrinter.value = printer
    }
    const setSelectedLabelTemplate = (type) => {
        selectedLabelTemplate.value = type
    }
    const increment = () => {
        quantityLabel.value++
    }
    const decrement = () => {
        if (quantityLabel.value > 1) {
            quantityLabel.value--
        }
    }
    const setDataToPrint = (data) => {
        dataToPrint.value = data
    }
    const clearDataToPrint = () => {
        dataToPrint.value = null
    }
    const setDataToPreview = (data) => {
        dataToPreview.value = data
    }
    const clearDataToPreview = () => {
        dataToPreview.value = null
    }
    return {
//state
        printersList,
        selectedPrinter,
        printStatus,
        errorStore,
        loading,
        labelTemplatesList,
        quantityLabel,
        selectedLabelTemplate,
        dataToPrint,
        dataToPreview,
//getters
//actions
        GET_ZPL_PRINTERS,
        GET_LABEL_TEMPLATE,
        PRINT_LABEL_300_BARCODE_58x40_PRODUCTS,
        PRINT_LABEL_300_BARCODE_58x40_COMPONENTS,
        setSelectedPrinter,
        setSelectedLabelTemplate,
        increment,
        decrement,
        setDataToPrint,
        clearDataToPrint,
        setDataToPreview,
        clearDataToPreview,
    }
})
