import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
import {useWebSocketStore} from "@/stores/WebSockets/WebSocketStore.js";

export const useTransactionStore = defineStore('transaction', () => {
    const webSocketStore = useWebSocketStore()
    // In-memory reactive state
    const currentTransactions = ref([])
    // Persistent storage using localStorage
    const loadPersistedTransactions = () => {
        const saved = localStorage.getItem('transactions')
        if (saved) {
            currentTransactions.value = JSON.parse(saved)
        }
    }
    const addTransaction = (transaction) => {
        // Add new transaction to the top of the list
        currentTransactions.value.unshift({
            ...transaction,
            timestamp: Date.now()
        })
        // Limit to last 100 transactions to prevent localStorage overflow
        if (currentTransactions.value.length > 100) {
            currentTransactions.value = currentTransactions.value.slice(0, 100)
        }
        // Persist to localStorage
        localStorage.setItem('transactions', JSON.stringify(currentTransactions.value))
    }
    const clearOldTransactions = () => {
        // Optional: Clear transactions older than 24 hours
        const cutoffTime = Date.now() - (24 * 60 * 60 * 1000)
        currentTransactions.value = currentTransactions.value.filter(
            transaction => transaction.timestamp > cutoffTime
        )
        localStorage.setItem('transactions', JSON.stringify(currentTransactions.value))
    }
    // Computed getter for recent transactions
    const recentTransactions = computed(() =>
        currentTransactions.value.slice(0, 10)
    )
    // Method to handle WebSocket updates
    const updateTransactionStatus = (transactionId, newStatus) => {
        const transactionIndex = currentTransactions.value.findIndex(t => t.id === transactionId)
        if (transactionIndex !== -1) {
            currentTransactions.value[transactionIndex].status = newStatus
            currentTransactions.value[transactionIndex].timestamp = Date.now()
            // Persist updated state
            localStorage.setItem('transactions', JSON.stringify(currentTransactions.value))
        }
    }
    // Initialize by loading persisted transactions
    loadPersistedTransactions()
    return {
        currentTransactions,
        recentTransactions,
        addTransaction,
        updateTransactionStatus,
        clearOldTransactions
    }
})