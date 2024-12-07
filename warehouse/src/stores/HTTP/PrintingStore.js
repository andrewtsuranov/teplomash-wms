import {defineStore} from 'pinia'
import {ref} from "vue"
import ky from "ky";
import {requestUrls} from "@/stores/request-urls.js";
import {useErrorStore} from "@/stores/Error/ErrorStore.js";
import {useUserStore} from '@/stores/HTTP/UserStore.js'

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
        const selectedPrinter = ref('')
        const selectedQuantity = ref(1)
        const labelTemplatesList = ref(null)
        const selectedLabelTemplate = ref('')
        const qrCodeZPL = (body, qty) => {
            return `^XA^FO20,30^BQN,2,7,H,7,Q,S,7^FDQM,${body}^FS^PQ${qty}^XZ`
        }
        const code128ZPL = (body, qty) => {
            return `^XA^FO20,100^BY4^BCN,200,Y,N,N^FD${body}^FS^PQ${qty}^XZ`
        }
        const test = () => {
            return '~WC'
        }
//getters
//actions
        const getZPLPrinters = async () => {
            loading.value = true;
            errorStore.clearError();
            try {
                const response = await kyPrint('printers/list_printers/').json()
                printersList.value = response
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
        const printQRCode = async (body) => {
            loading.value = true;
            errorStore.clearError();
           const zplData = {
               "template_code": selectedLabelTemplate.value,
               "printer_id": selectedPrinter.value.id,
               "data": {
                   "product_name": "Test Product",
                   "body": body,
                   "qty": selectedQuantity.value,
               },
               "copies": selectedQuantity.value,
               "priority": 0
           }


            // const zplData = {
            //     "printer": selectedPrinter.value.name,
            //     "text": qrCodeZPL(data, count)
            // }
            try {
                const response = await kyPrint
                    .post('printers/print_label/',{json:zplData})
                    .json()
                printStatus.value = response
                return true
            } catch (err) {
                console.log(err)
                throw err
            } finally {
                loading.value = false
            }
        }
//
        return {
//state
            printersList,
            selectedPrinter,
            selectedQuantity,
            printStatus,
            errorStore,
            loading,
            labelTemplatesList,
            selectedLabelTemplate,
//getters
//actions
            getZPLPrinters,
            getLabelTemplate,
            printQRCode,
            qrCodeZPL,
            code128ZPL,
            test,
        }
    })