import {ref, computed} from 'vue'
import {useWebSocketStore} from "@/stores/WebSockets/WebSocketStore.js";
import {useDifferenceById} from "@/composables/useDifferenceById.js";
import {defineStore} from 'pinia'

export const useTransactionStore = defineStore('transaction', () => {
//Store
    const webSocketStore = useWebSocketStore()
// State
    const allTransactionsList100 = ref(JSON.parse(localStorage.getItem('transactions')) || [])
//Getters
    const last10Transactions = computed(() => allTransactionsList100.value.slice(0, 10))
    const getStageProgress = computed(() => last10Transactions.value.map(progress => progress.stage_progress))


//Actions
    const addTransaction = (transaction) => {
        allTransactionsList100.value.unshift({
            ...transaction,
            timestamp: Date.now()
        })
        if (allTransactionsList100.value.length > 100) {
            allTransactionsList100.value = allTransactionsList100.value.slice(0, 100)
        }
        updateUnregItemsByTransaction(transaction)
        localStorage.setItem('transactions', JSON.stringify(allTransactionsList100.value))
    }
    const updateUnregItemsByTransaction = (transaction) => {
        if (transaction.transaction_type === "ADD_PALLET" && transaction.status === "COMPLETED") {
            if (transaction.pallet !== null) {
                return webSocketStore.wsUnregisteredProducts.value = useDifferenceById(webSocketStore.wsUnregisteredProducts, transaction.pallet.items).difference
            }
        }
    }
    const clearOldTransactions = () => {
        // Очистка старых транзакций после 24 часов
        const cutoffTime = Date.now() - (24 * 60 * 60 * 1000)
        allTransactionsList100.value = allTransactionsList100.value.filter(
            transaction => transaction.timestamp > cutoffTime
        )
        localStorage.setItem('transactions', JSON.stringify(allTransactionsList100.value))
    }

    // Method to handle WebSocket updates
    const updateTransactionStatus = (transactionId, newStatus) => {
        const transactionIndex = allTransactionsList100.value.findIndex(t => t.id === transactionId)
        if (transactionIndex !== -1) {
            allTransactionsList100.value[transactionIndex].status = newStatus
            allTransactionsList100.value[transactionIndex].timestamp = Date.now()
            // Persist updated state
            localStorage.setItem('transactions', JSON.stringify(allTransactionsList100.value))
        }
    }
    return {
        allTransactionsList100,
        last10Transactions,
        getStageProgress,
        addTransaction,
        updateTransactionStatus,
        clearOldTransactions
    }
})