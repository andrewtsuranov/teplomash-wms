<template>
  <div class="real-time-data">
    <h2>Real-Time Warehouse Data</h2>
    <div class="status-panel">
      <p :class="['status', { 'connected': userStore.isConnected, 'disconnected': !userStore.isConnected }]">
        WebSocket Status: {{ userStore.connectionStatus }}
      </p>
      <p v-if="userStore.reconnectError" class="error">Reconnection error occurred</p>
      <p v-if="userStore.error" class="error">{{ userStore.error }}</p>
      <p v-if="userStore.reconnectAttempts > 0">Reconnection attempts: {{ userStore.reconnectAttempts }}</p>
    </div>
    <div v-if="userStore.isConnected">
      <div class="online-users-panel">
        <h3>Online Users</h3>
        <p class="online-users-count">{{ userStore.onlineUsersCount }}</p>
      </div>
      <div v-if="userStore.lastMessage">
        <h3>Latest Update:</h3>
        <pre>{{ JSON.stringify(userStore.lastMessage, null, 2) }}</pre>
      </div>
      <p>Heartbeat count: {{ userStore.heartBeatTimer }}</p>
    </div>
    <div class="button-group">
      <my-button @click="userStore.initWebSocket" :disabled="userStore.isConnected">Connect</my-button>
      <my-button @click="userStore.disconnect" :disabled="!userStore.isConnected">Disconnect</my-button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useWebSocketStore } from '@/stores/ws/WebSocketStore.js'
import MyButton from "@/components/UI/MyButton.vue"

const userStore = useWebSocketStore()

onMounted(() => {
  userStore.initWebSocket()
})

onUnmounted(() => {
  userStore.disconnect()
})
</script>

<style scoped>
.real-time-data {
  border: 1px solid #ccc;
  padding: 20px;
  margin-top: 20px;
}

.status-panel {
  margin-bottom: 15px;
}

.status {
  font-weight: bold;
}

.status.connected {
  color: green;
}

.status.disconnected {
  color: red;
}

.error {
  color: red;
}

.online-users-panel {
  /*background-color: #f0f0f0;*/
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 15px;
}

.online-users-count {
  font-size: 24px;
  font-weight: bold;
  color: #4CAF50;
}

pre {
  /*background-color: #f4f4f4;*/
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}

.button-group {
  margin-top: 15px;
}

.button-group button {
  margin-right: 10px;
}
</style>