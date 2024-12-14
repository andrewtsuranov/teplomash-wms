import {defineStore} from 'pinia'
import {computed, ref} from "vue"
import ky from "ky";
import {requestUrls} from "@/stores/request-urls.js";
import {useErrorStore} from "@/stores/Error/ErrorStore.js";
import {useUserStore} from '@/stores/HTTP/UserStore.js'
import {useWarehouseStore} from "@/stores/HTTP/WarehouseStore.js";

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
export const usePrintingStore = defineStore('printingStore',
    () => {
//state
        const errorStore = useErrorStore()
        const loading = ref(false)
        const printersList = ref(null)
        const printStatus = ref(null)
        const selectedPrinter = ref(null)
        const selectedQuantityLabel = ref(1)
        const selectedLabelTemplate = ref(null)
        const labelTemplatesList = ref(null)
        const qrCodeZPL = (body, qty) => {
            return `^XA^FO20,30^BQN,2,7,H,7,Q,S,7^FDQM,${body}^FS^PQ${qty}^XZ`
        }
        const code128ZPL = (body, qty) => {
            return `^XA^FO20,100^BY4^BCN,200,Y,N,N^FD${body}^FS^PQ${qty}^XZ`
        }
//getters
        const quantityLabel = computed(() => selectedQuantityLabel.value);
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
        const PRINT_LABEL = async (productData) => {
            const body = productData.map(item => item.barcode)
            loading.value = true;
            errorStore.clearError();
            const zplData = {
                "template_code": selectedLabelTemplate.value,
                "printer_id": selectedPrinter.value.id,
                "data": {
                    "product_name": productData.map(item => item.name),
                    "body": body,
                    "qty": selectedQuantityLabel.value,
                },
                "copies": selectedQuantityLabel.value,
                "priority": 0
            }
            // const zplData = {
            //     "printer": selectedPrinter.value.name,
            //     "text": qrCodeZPL(data, count)
            // }
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
        const setSelectedQuantityLabel = (qty) => {
            selectedQuantityLabel.value = qty;
        }
        const setSelectedLabelTemplate = (type) => {
            selectedLabelTemplate.value = type;
        }
        const increment = () => {
            selectedQuantityLabel.value++;
        }
        const decrement = () => {
            if (selectedQuantityLabel.value > 1) {
                selectedQuantityLabel.value--;
            }
        }
        return {
//state
            printersList,
            selectedPrinter,
            selectedQuantityLabel,
            printStatus,
            errorStore,
            loading,
            labelTemplatesList,
            selectedLabelTemplate,
//getters
            quantityLabel,
//actions
            getZPLPrinters,
            getLabelTemplate,
            PRINT_LABEL,
            qrCodeZPL,
            code128ZPL,
            setSelectedPrinter,
            setSelectedQuantityLabel,
            setSelectedLabelTemplate,
            increment,
            decrement,
        }
    })