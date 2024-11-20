import {defineStore} from 'pinia'
import {reactive, ref} from "vue"
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
    const urlPrinterIP = reactive({
        ip: 'http://192.168.0.190',
        port: 9100
    })
    let activeXhr = ref(null)
    const qrCodeZPL = (body) => {
        return `^XA^FO20,30^BQN,2,7,H,7,Q,S,7^FDQM,${body}^FS^XZ`
    }
    const code128ZPL = (body) => {
        return `^XA^FO20,100^BY4^BCN,200,Y,N,N^FD${body}^FS^XZ`
    }
//getters
//actions
    const printQRCode = (data) => {
        if (activeXhr.value) {
            activeXhr.value.abort()
        }
        activeXhr.value = new XMLHttpRequest()
        activeXhr.value.open('POST', `${urlPrinterIP.ip}:${urlPrinterIP.port}`, true)
        activeXhr.value.send(qrCodeZPL(data))
        activeXhr.value.onerror = () => {
            console.error('Ошибка отправки')
            activeXhr.value = null
        }
        activeXhr.value.onload = () => {
            console.log('Печать выполнена')
            activeXhr.value = null
        }

    }
    return {
//state
//getters
//actions
        printQRCode
    }
})