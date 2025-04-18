import { ref, computed } from "vue";
import { useWebSocketStore } from "@/stores/WebSockets/WebSocketStore.js";
import { useDifferenceById } from "@/composables/useDifferenceById.js";
import { defineStore } from "pinia";

export const useTransactionStore = defineStore("transaction", () => {
  //Store
  const webSocketStore = useWebSocketStore();
  // State
  const allTransactionsList100 = ref(
    JSON.parse(localStorage.getItem("transactions")) || [],
  );
  //Getters
  const last10Transactions = computed(() =>
    allTransactionsList100.value.slice(0, 10),
  );
  const getStageProgress = computed(() =>
    last10Transactions.value.map((progress) => progress.stage_progress),
  );
  // получения сгруппированных по ID транзакций
  const getLatestTransactionsByDevice = computed(() => {
    return (deviceId) => {
      if (!deviceId || !allTransactionsList100.value.length) return [];
      // Фильтруем по устройству
      const deviceTransactions = allTransactionsList100.value.filter(
        (item) => item.assigned_to_id === deviceId,
      );
      // Группируем по ID
      const transactionsMap = new Map();
      for (const transaction of deviceTransactions) {
        const existingTransaction = transactionsMap.get(transaction.id);
        if (
          !existingTransaction ||
          transaction.timestamp > existingTransaction.timestamp
        ) {
          transactionsMap.set(transaction.id, transaction);
        }
      }
      // Сортируем
      return Array.from(transactionsMap.values()).sort(
        (a, b) => b.timestamp - a.timestamp,
      );
    };
  });
  //Actions
  const addCurrentTransaction = (transaction) => {
    // Проверяем, существует ли транзакция с таким ID уже
    const existingIndex = allTransactionsList100.value.findIndex(
      (t) => t.id === transaction.id,
    );
    if (existingIndex !== -1) {
      // Если существует - обновляем статус
      allTransactionsList100.value[existingIndex] = {
        ...allTransactionsList100.value[existingIndex],
        ...transaction,
        timestamp: Date.now(),
      };
    } else {
      // Если новая - добавляем
      allTransactionsList100.value.unshift({
        ...transaction,
        timestamp: Date.now(),
      });
    }
    // Ограничиваем длину массива
    if (allTransactionsList100.value.length > 100) {
      allTransactionsList100.value = allTransactionsList100.value.slice(0, 100);
    }
    updateUnregItemsByTransaction(transaction);
    localStorage.setItem(
      "transactions",
      JSON.stringify(allTransactionsList100.value),
    );
  };
  const updateUnregItemsByTransaction = (transaction) => {
    if (
      transaction.transaction_type === "ADD_PALLET" &&
      transaction.status === "COMPLETED"
    ) {
      if (transaction.pallet !== null) {
        return (webSocketStore.wsUnregisteredProducts.value = useDifferenceById(
          webSocketStore.wsUnregisteredProducts,
          transaction.pallet.items,
        ).difference);
      }
    }
  };
  // const clearOldTransactions = () => {
  //     // Очистка старых транзакций после 24 часов
  //     const cutoffTime = Date.now() - (24 * 60 * 60 * 1000)
  //     allTransactionsList100.value = allTransactionsList100.value.filter(
  //         transaction => transaction.timestamp > cutoffTime
  //     )
  //     localStorage.setItem('transactions', JSON.stringify(allTransactionsList100.value))
  // }
  // Method to handle WebSocket updates
  const updateTransactionStatus = (transactionId, newStatus) => {
    const transactionIndex = allTransactionsList100.value.findIndex(
      (t) => t.id === transactionId,
    );
    if (transactionIndex !== -1) {
      allTransactionsList100.value[transactionIndex].status = newStatus;
      allTransactionsList100.value[transactionIndex].timestamp = Date.now();
      // Persist updated state
      localStorage.setItem(
        "transactions",
        JSON.stringify(allTransactionsList100.value),
      );
    }
  };
  return {
    allTransactionsList100,
    last10Transactions,
    getStageProgress,
    getLatestTransactionsByDevice,
    addCurrentTransaction,
    updateTransactionStatus,
    // clearOldTransactions
  };
});
