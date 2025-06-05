import {defineStore} from "pinia";
import {computed, ref} from "vue";

export const useWebSocketStore = defineStore("webSocketStore", () => {
// Lazy store access
    const getUserStore = () => import('@/stores/WMSStores/UserStore.js').then(m => m.useUserStore());
    const getTransactionStore = () => import('@/stores/WMSStores/TransactionStore.js').then(m => m.useTransactionStore());
    const getTSDStore = () => import('@/stores/WMSStores/TSDStore.js').then(m => m.useTSDStore());
    const getWarehouseStore = () => import('@/stores/WMSStores/WarehouseStore.js').then(m => m.useWarehouseStore());
    const getStorageStore = () => import('@/stores/WMSStores/StorageStore.js').then(m => m.useStorageStore())
    //State
    const isConnected = ref(false);
    const connectionPromise = ref(null);
    const onlineDevices = ref([]);
    const socket = ref(null);
    const message = ref(null);
    const reconnectError = ref(false);
    const error = ref();
    const reconnectAttempts = ref(0);
    const maxReconnectAttempts = ref(5);
    const reconnectDelay = ref(3000);
    const lastPongTime = ref(null);
    const productTypes = ref(null);
    const wsUnregisteredProducts = ref(JSON.parse(localStorage.getItem("wsUnregisteredProducts")) || null);
    //Getters
    const lastMessage = computed(() => message.value);
    const connectionStatus = computed(() =>
        isConnected.value ? "В сети" : "Не подключено"
    );
    const getUnregisteredProducts = computed(() => wsUnregisteredProducts.value);
    //Actions
    const initWebSocket = async () => {
        // Если промис уже существует, возвращаем его обратно
        if (connectionPromise.value) {
            return connectionPromise.value;
        }

        // Создаем новый промис для отслеживания подключения
        connectionPromise.value = new Promise(async (resolve, reject) => {
            const userStore = await getUserStore();
            // const wsUrl = `ws://lab:8081/ws/inventory/?token=${userStore.getTokenAccess}`;
            const wsUrl = `ws://192.168.1.144/ws/inventory/?token=${userStore.getTokenAccess}`

            socket.value = new WebSocket(wsUrl);

            // Оригинальные обработчики заменяем на промис-ориентированные
            socket.value.onopen = () => {
                isConnected.value = true;
                reconnectError.value = false;
                error.value = null;
                reconnectAttempts.value = 0;
                console.log("WebSocket connected");
                resolve(); // Резолвим промис при успешном подключении
            };

            socket.value.onclose = (event) => {
                isConnected.value = false;
                console.log(`WebSocket disconnected. Code: ${event.code}, reason: ${event.reason}`);

                // Сбрасываем промис при закрытии соединения
                connectionPromise.value = null;

                if (!event.wasClean) {
                    error.value = "Соединение было разорвано";
                    reject(new Error("WebSocket connection closed unexpectedly"));
                    reconnect();
                }
            };

            socket.value.onmessage = onMessage.bind(this);

            socket.value.onerror = (err) => {
                console.error("WebSocket Error:", err);
                error.value = "WebSocket Error occurred";
                reconnectError.value = true;
                reject(err); // Реджектим промис при ошибке
                connectionPromise.value = null;
            };
        });

        return connectionPromise.value;
    };
    // Обертка-утилита для проверки и ожидания соединения
    const ensureConnected = async () => {
        if (isConnected.value && socket.value?.readyState === WebSocket.OPEN) {
            return Promise.resolve();
        }
        return initWebSocket();
    };
    const onOpen = () => {
        isConnected.value = true;
        reconnectError.value = false;
        error.value = null;
        reconnectAttempts.value = 0;
        console.log("WebSocket connected");
    };
    const sendPong = () => {
        if (isConnected.value && socket.value?.readyState === WebSocket.OPEN) {
            // Отправляем pong в том же формате, в котором получили ping
            socket.value.send(JSON.stringify({type: "pong"}));
            lastPongTime.value = Date.now();
        }
    };
    const onClose = (event) => {
        isConnected.value = false;
        console.log(
            `WebSocket disconnected. Code: ${event.code}, reason: ${event.reason}`
        );
        if (!event.wasClean) {
            error.value = "Соединение было разорвано";
            reconnect();
        }
    };
    const disconnect = () => {
        if (socket.value) {
            socket.value.close();
            isConnected.value = false;
            console.log("WebSocket disconnected by user");
        }
    };
    const reconnect = () => {
        if (reconnectAttempts.value < maxReconnectAttempts.value) {
            reconnectAttempts.value++;
            console.log(`Attempting to reconnect (${reconnectAttempts.value}/${maxReconnectAttempts.value})`);
            setTimeout(() => {
                initWebSocket();
            }, reconnectDelay.value);
        } else {
            console.error("Max reconnection attempts reached");
            reconnectError.value = true;
        }
    };
    const onError = (error) => {
        console.error("WebSocket Error:", error);
        error.value = "WebSocket Error occurred";
        reconnectError.value = true;
    };
    const onMessage = async (event) => {
        try {
            const transactionStore = await getTransactionStore();
            const TSDStore = await getTSDStore();
            const warehouseStore = await getWarehouseStore();
            const storageStore = await getStorageStore()
            // Проверяем, является ли сообщение бинарным (ping frame)
            if (event.data instanceof Blob) {
                event.data.arrayBuffer().then((buffer) => {
                    const view = new Uint8Array(buffer);
                    // Проверяем, является ли это ping frame (код 0x09)
                    if (view[0] === 0x09) {
                        sendPong();
                    }
                });
                return;
            }
            // Обработка обычных JSON сообщений
            const data = JSON.parse(event.data);
            message.value = data;
            // Если получен ping в формате JSON
            if (data.type === "ping") {
                return sendPong();
            }
            // Обработка сообщения: получение активных пользователей
            if (data.type === "loaders_list") {
                onlineDevices.value = data.loaders
                TSDStore.set_onlineTSDList(data.loaders)
            }
            //Обработка сообщения: перенос продукции из ERP в БД
            if (data.type === "items_created" && data.status === "success") {
                GET_UNREGISTERED_ITEMS();
            }
            if (data.type === "items_list" && data.status === "success") {
                wsUnregisteredProducts.value = data.items;
                localStorage.setItem(
                    "wsUnregisteredProducts",
                    JSON.stringify(data.items)
                );
            }
            if (data.type === "product_types_list" && data.status === "success") {
                productTypes.value = data.products;
                localStorage.setItem("productTypes", JSON.stringify(data.products));
            }
            //Получаем общие сведения зон по складу
            if (data.type === "warehouse_zone_statistics" && data.status === "success") {
                if (data.zone_id) {
                    warehouseStore.setDetailedZoneStatistics(data.data)
                } else {
                    warehouseStore.setZoneStatisticsByWarehouseID(data.data)
                }
            }
            if (data.type === "storage_locations" && data.status === "success") {
                storageStore.setStorageLocations(data.locations)
                storageStore.setStorageLocationsMeta(data.meta)
            }
            if (data.type === "error") {
                error.value = data.message;
            }
            if (data.type === "transaction_update") {
                transactionStore.addCurrentTransaction(data.transaction);
            }
        } catch (e) {
            console.error("Error parsing WebSocket message:", e);
            error.value = "Error parsing WebSocket message";
        }
    };
    //Запросы
    const CREATE_ITEMS_BULK = (array) => {
        const data = {
            action: "create_items_bulk",
            items: array
        };
        if (
            isConnected.value &&
            socket.value &&
            socket.value.readyState === WebSocket.OPEN
        ) {
            socket.value.send(JSON.stringify(data));
        } else {
            console.error("Cannot send message: WebSocket is not connected");
            error.value = "Cannot send message: WebSocket is not connected";
        }
    };
    const CREATE_WAREHOUSE = () => {
        const data = {
            action: "create_warehouse",
            number: 4,
            name: "Екатеринбург"
        };
        if (
            isConnected.value &&
            socket.value &&
            socket.value.readyState === WebSocket.OPEN
        ) {
            socket.value.send(JSON.stringify(data));
        } else {
            console.error("Cannot send message: WebSocket is not connected");
            error.value = "Cannot send message: WebSocket is not connected";
        }
    };
    const TASK_CREATE_PALLET = (payload) => {
        if (
            isConnected.value &&
            socket.value &&
            socket.value.readyState === WebSocket.OPEN
        ) {
            socket.value.send(JSON.stringify(payload));
        } else {
            console.error("Cannot send message: WebSocket is not connected");
            error.value = "Cannot send message: WebSocket is not connected";
        }
    };
    const GET_UNREGISTERED_ITEMS = () => {
        const data = {
            action: "get_product_types",
            settings: {
                detail_level: "min",
                has_items: true
            }
        };
        if (
            isConnected.value &&
            socket.value &&
            socket.value.readyState === WebSocket.OPEN
        ) {
            socket.value.send(JSON.stringify(data));
        } else {
            console.error("Cannot send message: WebSocket is not connected");
            error.value = "Cannot send message: WebSocket is not connected";
        }
    };
    const GET_PRODUCT_TYPES = () => {
        const data = {
            action: "get_product_types"
        };
        if (
            isConnected.value &&
            socket.value &&
            socket.value.readyState === WebSocket.OPEN
        ) {
            socket.value.send(JSON.stringify(data));
        } else {
            console.error("Cannot send message: WebSocket is not connected");
            error.value = "Cannot send message: WebSocket is not connected";
        }
    };
    const GET_WAREHOUSE_ZONE_STATISTICS = async (warehouse_id, zone_id = null, include_details = false) => {
        await ensureConnected();
        const data = {
            action: "warehouse_zone_statistics",
            warehouse_id: warehouse_id,
            zone_id: zone_id,
            include_details: include_details
        };
        socket.value.send(JSON.stringify(data));
    };
    //Обработка запроса на получение списка ячеек
    const GET_LOCATIONS_BASE = async (warehouse_id, zone_id = null, abc_class = null, has_pallets = null, filters = null) => {
      await ensureConnected()
        const data = {
            action: "get_locations",
            warehouse_id: warehouse_id,
            zone_id: zone_id,
            abc_class: abc_class,
            has_pallets: has_pallets,
            filters: filters
        };
        if (isConnected.value && socket.value && socket.value.readyState === WebSocket.OPEN) {
            socket.value.send(JSON.stringify(data));
        } else {
            console.error("Cannot send message: WebSocket is not connected");
            error.value = "Cannot send message: WebSocket is not connected";
        }
    };
    const GET_WAREHOUSE = () => {
        socket.value.send(
            JSON.stringify({
                action: "get_warehouse",
                warehouse_id: 1
            })
        );
    };
    const GET_TRANSACTION_DATA = (id, min = false, isData = true) => {
        const data = {
            action: "get_transaction_data",
            id: id,
            min: min,
            data: isData
        };
        if (
            isConnected.value &&
            socket.value &&
            socket.value.readyState === WebSocket.OPEN
        ) {
            socket.value.send(JSON.stringify(data));
        } else {
            console.error("Cannot send message: WebSocket is not connected");
            error.value = "Cannot send message: WebSocket is not connected";
        }
    };
    const LINK_PALLET = () => {
        const data = {
            action: "link_pallet"
        };
        if (
            isConnected.value &&
            socket.value &&
            socket.value.readyState === WebSocket.OPEN
        ) {
            socket.value.send(JSON.stringify(data));
        } else {
            console.error("Cannot send message: WebSocket is not connected");
            error.value = "Cannot send message: WebSocket is not connected";
        }
    };
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
        wsUnregisteredProducts,
        lastPongTime,
        connectionPromise,
        //getters
        lastMessage,
        connectionStatus,
        getUnregisteredProducts,
        //actions
        initWebSocket,
        ensureConnected,
        onOpen,
        onClose,
        onError,
        disconnect,
        reconnect,
        onMessage,
        CREATE_WAREHOUSE,
        CREATE_ITEMS_BULK,
        TASK_CREATE_PALLET,
        GET_UNREGISTERED_ITEMS,
        GET_PRODUCT_TYPES,
        GET_WAREHOUSE,
        GET_TRANSACTION_DATA,
        LINK_PALLET,
        GET_WAREHOUSE_ZONE_STATISTICS,
        GET_LOCATIONS_BASE,
    };
});
