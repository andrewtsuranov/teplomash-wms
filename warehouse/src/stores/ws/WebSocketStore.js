import {defineStore} from 'pinia'
import {useUserStore} from '@/stores/UserStore.js'

export const useWebSocketStore = defineStore('websocket', {
    state: () => ({
        socket: null,
        isConnected: false,
        message: 'Нет сообщений или нет соединения',
        reconnectError: false,
        heartBeatInterval: null,
        heartBeatTimer: 0,
        error: null,
        reconnectAttempts: 0,
        maxReconnectAttempts: 5,
        reconnectDelay: 3000,
        onlineUsers: 0,
        testMessage: null,
    }),
    actions: {
        initWebSocket() {
            const userStore = useUserStore()
            // const wsUrl = `ws://lab:8081/ws/wms/?token=${userStore.token_access}`
            const wsUrl = `ws://38.180.192.229/ws/wms/?token=${userStore.token_access}`
            this.socket = new WebSocket(wsUrl)
            this.socket.onopen = this.onOpen.bind(this)
            this.socket.onclose = this.onClose.bind(this)
            this.socket.onmessage = this.onMessage.bind(this)
            this.socket.onerror = this.onError.bind(this)
        },
        onOpen() {
            this.isConnected = true
            this.reconnectError = false
            this.error = null
            this.reconnectAttempts = 0
            this.startHeartBeat()
            console.log('WebSocket connected')
        },
        onClose(event) {
            this.isConnected = false
            this.stopHeartBeat()
            console.log(`WebSocket disconnected. Code: ${event.code}, reason: ${event.reason}`)
            if (!event.wasClean) {
                this.error = 'Соединение было разорвано'
                this.reconnect()
            }
        },
        onMessage(event) {
            try {
                const data = JSON.parse(event.data)
                this.message = data
                console.log('Received message:', this.message)
                // Обрабатываем различные типы сообщений
                if (data.type === 'online_users') {
                    this.onlineUsers = data.users.length
                }
                // Здесь можно добавить обработку других типов сообщений
            } catch (e) {
                console.error('Error parsing WebSocket message:', e)
                this.error = 'Error parsing WebSocket message'
            }
        },
        onError(error) {
            console.error('WebSocket error:', error)
            this.error = 'WebSocket error occurred'
            this.reconnectError = true
        },
        sendMessage(message, id) {
            const data = {
                action: 'private_message',
                to: id,
                message: message
            }
            if (this.isConnected && this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify(data))
            } else {
                console.error('Cannot send message: WebSocket is not connected')
                this.error = 'Cannot send message: WebSocket is not connected'
            }
        },
        startHeartBeat() {
            this.heartBeatInterval = setInterval(() => {
                this.sendMessage(JSON.stringify({type: 'heartbeat', data: 'ping'}))
                this.heartBeatTimer++
            }, 30000)
        },
        stopHeartBeat() {
            clearInterval(this.heartBeatInterval)
            this.heartBeatTimer = 0
        },
        disconnect() {
            if (this.socket) {
                this.socket.close()
                this.isConnected = false
                this.stopHeartBeat()
                console.log('WebSocket disconnected by user')
            }
        },
        reconnect() {
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++
                console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
                setTimeout(() => {
                    this.initWebSocket()
                }, this.reconnectDelay)
            } else {
                console.error('Max reconnection attempts reached')
                this.reconnectError = true
            }
        },
    },
    getters: {
        lastMessage: (state) => state.message,
        connectionStatus: (state) => state.isConnected ? 'В сети' : 'Не в сети',
        onlineUsersCount: (state) => state.onlineUsers,
    },
})
