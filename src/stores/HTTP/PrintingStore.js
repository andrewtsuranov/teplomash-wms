import {defineStore} from 'pinia'
import {computed, ref} from "vue"
import ky from "ky";
import {requestUrls} from "@/stores/request-urls.js";
import {useErrorStore} from "@/stores/Error/ErrorStore.js";
import {useERPStore} from "@/stores/HTTP/ERPStore.js";
import {useUserStore} from '@/stores/HTTP/UserStore.js'
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";

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
//     ^XA                          // Начало этикетки
//     ^FO50,50                     // Позиция QR-кода
//     ^BQN,2,5                     // QR-код
//     ^FDQA,http://site.com^FS     // Данные QR-кода
//     ^FO50,200                    // Позиция текста под QR
//     ^ADN                         // Выбор шрифта
//     ^FD http://site.com^FS       // Текст
//     ^XZ                          // Конец этикетки
export const usePrintingStore = defineStore('printingStore', () => {
//state
    const errorStore = useErrorStore()
    const loading = ref(false)
    const printersList = ref(null)
    const printStatus = ref(null)
    const selectedPrinter = ref(null)
    const selectedLabelTemplate = ref(null)
    const labelTemplatesList = ref(null)
    const quantityLabel = ref(1)
//getters
//         const totalLabelPrint = computed(() => selectedQuantityLabel.value);
//actions
    const getZPLPrinters = async () => {
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
    const getLabelTemplate = async () => {
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
    const PRINT_LABEL = async (barcode) => {
        loading.value = true;
        errorStore.clearError();
        const zplData = {
            "template_code": selectedLabelTemplate.value.code,
            "printer_id": selectedPrinter.value.id,
            "data": barcode.map(item => ({
                "product_name": ERPStore.unregItemsById.items[0].name,
                "body": item,
                // "qty": selectedQuantityLabel.value,
            })),
            "copies": 1,
            "priority": 0
        }
        try {
            printStatus.value = await kyPrint
                .post('printers/print_label/', {json: zplData})
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
        selectedPrinter.value = printer;
    }

    const setSelectedLabelTemplate = (type) => {
        selectedLabelTemplate.value = type;
    }
    const increment = () => {
        quantityLabel.value++;
    }
    const decrement = () => {
        if (quantityLabel.value > 1) {
            quantityLabel.value--;
        }
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
//getters
        selectedLabelTemplate,
        // totalLabelPrint,
//actions
        getZPLPrinters,
        getLabelTemplate,
        PRINT_LABEL,
        setSelectedPrinter,
        setSelectedLabelTemplate,
        increment,
        decrement,
    }
})
