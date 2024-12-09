import {defineStore} from 'pinia'
import {useUserStore} from '@/stores/HTTP/UserStore.js'
import {computed, ref} from "vue";
import {useTransactionStore} from "@/stores/WebSockets/transactionStore.js";
import {usePackingStore} from "@/stores/HTTP/PackingStore.js";

export const useWebSocketStore = defineStore('websocket', () => {
//Подключаем UserStore
    const userStore = useUserStore()
    const packingStore = usePackingStore()
    const transactionStore = useTransactionStore()
//State
    const socket = ref(null)
    const isConnected = ref(false)
    const message = ref(null)
    const reconnectError = ref(false)
    const error = ref()
    const reconnectAttempts = ref(0)
    const maxReconnectAttempts = ref(5)
    const reconnectDelay = ref(3000)
    const onlineDevices = ref([])
    const lastPongTime = ref(null)
    const privateMessage = ref(null)
    const privateMessageID = ref(null)
    const receivedMessage = ref(null)
    const wsGroupUnregProduct = ref(JSON.parse(localStorage.getItem('wsGroupUnregProduct')) || null)
    // const productTypes = ref(JSON.parse(localStorage.getItem('productTypes')) || null)
    const transactionStatus = ref(JSON.parse(localStorage.getItem('transactionStatus')) || null)
//Getters
    const lastMessage = computed(() => message.value)
    const connectionStatus = computed(() => isConnected.value ? 'В сети' : 'Не в сети')
    const getPrivateMessage = computed(() => privateMessage.value)
    const getPrivateMessageID = computed(() => privateMessageID.value)
    const foundIdUser = computed((itemId) => {
        return onlineDevices.value.find(item => item.id === itemId)
    })

//Actions
    function initWebSocket() {
        const wsUrl = `ws://lab:8081/ws/inventory/?token=${userStore.getTokenAccess}`
        // const wsUrl = `ws://192.168.1.144/ws/inventory/?token=${userStore.getTokenAccess}`
        // const wsUrl = `ws://38.180.192.229/ws/inventory/?token=${userStore.getTokenAccess}`
        socket.value = new WebSocket(wsUrl)
        socket.value.onopen = onOpen.bind(this)
        socket.value.onclose = onClose.bind(this)
        socket.value.onmessage = onMessage.bind(this)
        socket.value.onerror = onError.bind(this)
    }

    function onOpen() {
        isConnected.value = true
        reconnectError.value = false
        error.value = null
        reconnectAttempts.value = 0
        console.log('WebSocket connected')
    }

    function sendPong() {
        if (isConnected.value && socket.value?.readyState === WebSocket.OPEN) {
            // Отправляем pong в том же формате, в котором получили ping
            socket.value.send(JSON.stringify({type: 'pong'}))
            lastPongTime.value = Date.now()
        }
    }

    function onClose(event) {
        isConnected.value = false
        console.log(`WebSocket disconnected. Code: ${event.code}, reason: ${event.reason}`)
        if (!event.wasClean) {
            error.value = 'Соединение было разорвано'
            reconnect()
        }
    }

    function disconnect() {
        if (socket.value) {
            socket.value.close()
            isConnected.value = false
            console.log('WebSocket disconnected by user')
        }
    }

    function reconnect() {
        if (reconnectAttempts.value < maxReconnectAttempts.value) {
            reconnectAttempts.value++
            console.log(`Attempting to reconnect (${reconnectAttempts.value}/${maxReconnectAttempts.value})`)
            setTimeout(() => {
                initWebSocket()
            }, reconnectDelay.value)
        } else {
            console.error('Max reconnection attempts reached')
            reconnectError.value = true
        }
    }

    function onError(error) {
        console.error('WebSocket Error:', error)
        error.value = 'WebSocket Error occurred'
        reconnectError.value = true
    }

    function onMessage(event) {
        try {
            // Проверяем, является ли сообщение бинарным (ping frame)
            if (event.data instanceof Blob) {
                event.data.arrayBuffer().then(buffer => {
                    const view = new Uint8Array(buffer)
                    // Проверяем, является ли это ping frame (код 0x09)
                    if (view[0] === 0x09) {
                        sendPong()
                    }
                })
                return
            }
            // Обработка обычных JSON сообщений
            const data = JSON.parse(event.data)
            message.value = data
            // Если получен ping в формате JSON
            if (data.type === 'ping') {
                return sendPong()
            }
            // Обработка сообщения: получение активных пользователей
            if (data.type === 'loaders_list') {
                onlineDevices.value = data.loaders
            }
            // Обработка сообщения: получение приватного ссобщения
            if (data.type === 'private_message') {
                receivedMessage.value = {
                    from_id: `(Получено сообщение от ТСД №${data.from_user}) >>`,
                    message: data.message
                }
            }
            //Обработка сообщения: перенос продукции из ERP в БД
            if (data.type === 'items_created' && data.status === 'success') {
                getUnregisteredItems()
                // productByDayGroup.value = data.items
                // localStorage.setItem('productByDayGroup', JSON.stringify(data.items))
            }
            if (data.type === 'unregistered_items' && data.status === 'success') {
                wsGroupUnregProduct.value = data.groups
                localStorage.setItem('wsGroupUnregProduct', JSON.stringify(data.groups))
            }
            if (data.type === 'product_types_list' && data.status === 'success') {
                productTypes.value = data.products
                localStorage.setItem('productTypes', JSON.stringify(data.products))
            }
            // if (data.type === 'product_types_updated' && data.status === 'success') {
            //     alert(data.message)
            // }
            if (data.type === 'transaction_update') {
                transactionStore.addTransaction(data.transaction)
            }
            if (data.type === 'без понятия' && data.status === 'success') {
                alert(data.message)
            }
        } catch (e) {
            console.error('Error parsing WebSocket message:', e)
            error.value = 'Error parsing WebSocket message'
        }
    }

    function sendMessage(message, id) {
        const data = {
            action: 'send_private_message',
            to: id,
            message: message
        }
        if (isConnected.value && socket.value && socket.value.readyState === WebSocket.OPEN) {
            console.log(data)
            socket.value.send(JSON.stringify(data))
        } else {
            console.error('Cannot send message: WebSocket is not connected')
            error.value = 'Cannot send message: WebSocket is not connected'
        }
    }

//Отправляем запрос на получение сгруппированных незарегестрированных изделий
    function createItemsBulk(array) {
        const data = {
            'action': 'create_items_bulk',
            "items": array
        }
        console.log(data)
        if (isConnected.value && socket.value && socket.value.readyState === WebSocket.OPEN) {
            socket.value.send(JSON.stringify(data))
        } else {
            console.error('Cannot send message: WebSocket is not connected')
            error.value = 'Cannot send message: WebSocket is not connected'
        }
    }

    const getUnregisteredItems = () => {
        const data = {
            "action": "get_unregistered_items"
        }
        if (isConnected.value && socket.value && socket.value.readyState === WebSocket.OPEN) {
            socket.value.send(JSON.stringify(data))
        } else {
            console.error('Cannot send message: WebSocket is not connected')
            error.value = 'Cannot send message: WebSocket is not connected'
        }
    }
    const getProductTypes = () => {
        const data = {
            "action": "get_product_types"
        }
        if (isConnected.value && socket.value && socket.value.readyState === WebSocket.OPEN) {
            socket.value.send(JSON.stringify(data))
        } else {
            console.error('Cannot send message: WebSocket is not connected')
            error.value = 'Cannot send message: WebSocket is not connected'
        }
    }
    const getTransactionData = (id, min = true, max = false) => {
        const data = {
            "action": "get_transaction_data",
            "id": id,
            "min": min,
            "data": max
        }
        if (isConnected.value && socket.value && socket.value.readyState === WebSocket.OPEN) {
            socket.value.send(JSON.stringify(data))
        } else {
            console.error('Cannot send message: WebSocket is not connected')
            error.value = 'Cannot send message: WebSocket is not connected'
        }
    }
    const updateProductTypes = (array) => {
        const data = {
            "action": "update_product_types",
            "products": array
        }
        if (isConnected.value && socket.value && socket.value.readyState === WebSocket.OPEN) {
            socket.value.send(JSON.stringify(data))
        } else {
            console.error('Cannot send message: WebSocket is not connected')
            error.value = 'Cannot send message: WebSocket is not connected'
        }
    }
    const createPalletTask = (payload) => {
        if (isConnected.value && socket.value && socket.value.readyState === WebSocket.OPEN) {
            socket.value.send(JSON.stringify(payload))
        } else {
            console.error('Cannot send message: WebSocket is not connected')
            error.value = 'Cannot send message: WebSocket is not connected'
        }
    }

    function createWarehouse() {
        const data = {
            action: 'create_warehouse',
            number: 4,
            name: 'Екатеринбург'
        }
        if (isConnected.value && socket.value && socket.value.readyState === WebSocket.OPEN) {
            socket.value.send(JSON.stringify(data))
        } else {
            console.error('Cannot send message: WebSocket is not connected')
            error.value = 'Cannot send message: WebSocket is not connected'
        }
    }

    const checkPalletTask = (payload) => {
        if (isConnected.value && socket.value && socket.value.readyState === WebSocket.OPEN) {
            socket.value.send(JSON.stringify(payload))
        } else {
            console.error('Cannot send message: WebSocket is not connected')
            error.value = 'Cannot send message: WebSocket is not connected'
        }
    }
    // function createPallet() {
    //     // Создание паллеты
    //     socket.value.send(JSON.stringify({
    //         action: 'create_pallet',
    //         length: 120,
    //         abc_class: 'A',
    //         xyz_class: 'X',
    //         barcode: '1234567890'
    //     }));
    // }
    function getWarehouse() {
        socket.value.send(JSON.stringify({
            action: 'get_warehouse',
            warehouse_id: 1
        }));
    }

    return {
//state
        socket,
        isConnected,
        message,
        reconnectError,
        error,
        reconnectAttempts,
        maxReconnectAttempts,
        reconnectDelay,
        onlineDevices,
        privateMessage,
        privateMessageID,
        receivedMessage,
        wsGroupUnregProduct,
        // productTypes,
        transactionStatus,
//getters
        lastMessage,
        connectionStatus,
        lastPongTime,
        getPrivateMessage,
        getPrivateMessageID,
        foundIdUser,
//actions
        initWebSocket,
        getUnregisteredItems,
        onOpen,
        onClose,
        onMessage,
        onError,
        sendMessage,
        createWarehouse,
        // createPallet,
        getWarehouse,
        disconnect,
        createItemsBulk,
        reconnect,
        getProductTypes,
        updateProductTypes,
        createPalletTask,
        getTransactionData,
        checkPalletTask,
    }
})
