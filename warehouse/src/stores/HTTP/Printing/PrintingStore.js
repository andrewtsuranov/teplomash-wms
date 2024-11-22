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
export const usePrintingStore = defineStore('printingStore',
    () => {
//state
        const urlPrinterIP = reactive({
            ip: 'http://192.168.0.190',
            port: 9100
        })

        const qrCodeZPL = (body) => {
            return `^XA^FO20,30^BQN,2,7,H,7,Q,S,7^FDQM,${body}^FS^XZ`
        }
        const code128ZPL = (body) => {
            return `^XA^FO20,100^BY4^BCN,200,Y,N,N^FD${body}^FS^XZ`
        }
        const test = () => {
            return '~WC'
        }
//getters
//actions
        function printQRCode(method = 'POST', timeout = 3000, data) {
            return new Promise((resolve, reject) => {
                const xhr= new XMLHttpRequest();

                // Открываем запрос
                xhr.open(method, `${urlPrinterIP.ip}:${urlPrinterIP.port}`, true);

                // Обработчик ответа
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) { // 4 - запрос завершен
                        if (xhr.status >= 200 && xhr.status < 300) {
                            resolve(xhr.responseText); // Успешный ответ
                        } else {
                            reject(new Error(`Ошибка: ${xhr.status}`)); // Ошибка сервера
                        }
                    }
                };

                // Обработчик ошибки
                xhr.onerror = function () {
                    reject(new Error('Ошибка сети'));
                };

                // Настройка таймера для отмены запроса
                const timer = setTimeout(() => {
                    xhr.abort(); // Отменяем запрос
                    reject(new Error('Запрос отменен из-за таймаута'));
                }, timeout);

                // Очистка таймера при успешном выполнении запроса
                xhr.onload = function () {
                    clearTimeout(timer);
                };

                // Отправка запроса
                xhr.send(qrCodeZPL(data));
            });
        }






//         const printQRCode = (data) => {
//             if (activeXhr.value) {
//                 activeXhr.value = null
//             }
//             activeXhr.value = new XMLHttpRequest()
//             activeXhr.value.open('POST', `${urlPrinterIP.ip}:${urlPrinterIP.port}`, true)
//             activeXhr.value.setRequestHeader('Content-Type', 'text/plain')
//             return new Promise((resolve, reject) => {
//                 activeXhr.value.onreadystatechange = function () {
//                     if (activeXhr.value.readyState === 4) {
//                         if (activeXhr.value.status === 200) {
//                             resolve('Успешно отправлено');
//                         } else {
//                             reject(new Error(`Ошибка отправки: ${activeXhr.value.statusText}`));
//                         }
//                     }
//                 };
//                 activeXhr.value.onerror = function () {
//                     reject(new Error('Ошибка соединения с принтером'));
//                 };
//                 activeXhr.value.ontimeout = function () {
//                     reject(new Error('Превышено время ожидания ответа от принтера'));
//                 };
//                 activeXhr.value.timeout = 5000; // Устанавливаем таймаут (5 секунд)
//                 activeXhr.value.send('^XA^XZ')
//                 activeXhr.value.send(qrCodeZPL(data))
//             });
//         }
        return {
//state
            urlPrinterIP,
//getters
//actions
            printQRCode,
            qrCodeZPL,
            code128ZPL,
            test,
        }
    })