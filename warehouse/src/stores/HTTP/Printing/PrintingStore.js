import {defineStore} from 'pinia'
import {ref} from "vue"

export const usePrintingStore = defineStore('printingStore', () => {
//state
    let activeXhr = ref(null)
//getters
//actions
    const printQRCode = (data) => {
        if (activeXhr.value) {
            activeXhr.value.abort()
        }
        activeXhr.value = new XMLHttpRequest()
        activeXhr.value.open('POST', 'http://192.168.0.190:9100', true)
    //     ^XA                          // Начало этикетки
    //     ^FO50,50                     // Позиция QR-кода
    //     ^BQN,2,5                     // QR-код
    //     ^FDQA,http://site.com^FS     // Данные QR-кода
    //     ^FO50,200                    // Позиция текста под QR
    //     ^ADN                         // Выбор шрифта
    //     ^FD http://site.com^FS       // Текст
    //     ^XZ                          // Конец этикетки
        const zplCommand =
            `^XA
            ^FO20,30
            ^BQN,2,7,
            H,
            7,
            Q,
            S,
            7   
            ^FDQM,
            ${data}
            ^FS
            ^XZ`
        activeXhr.value.onerror = () => {
            console.error('Ошибка отправки')
            activeXhr.value = null
        }
        activeXhr.value.onload = () => {
            console.log('Печать выполнена')
            activeXhr.value = null
        }
        activeXhr.value.send(zplCommand)
    }
    return {
//state
//getters
//actions
        printQRCode
    }
})