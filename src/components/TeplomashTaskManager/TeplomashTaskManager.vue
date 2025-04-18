<script setup>
import TTMSettings from "@/components/TeplomashTaskManager/TTMSettings/TTMSettings.vue";
import TTMDevices from "@/components/TeplomashTaskManager/TTMDevices/TTMDevices.vue";
import TTMTerminal from "@/components/TeplomashTaskManager/TTMTerminal/TTMTerminal.vue";
</script>
<template>
  <div class="teplomash-task-manager-container">
    <label class="ttm-title gold-black-block"
    >Тепломаш&reg; Task Manager :
    </label>
    <TTMSettings class="ttm-settings" />
    <TTMDevices class="ttm-devices" />
    <TTMTerminal class="ttm-terminal" />
  </div>
</template>
<style scoped>
.teplomash-task-manager-container {
  display: grid;
  gap: 1rem;
  grid-auto-rows: min-content 300px 280px;
  grid-template-areas:
    "title title"
    "settings terminal"
    "devices terminal";
  grid-template-columns: minmax(auto, 1fr) minmax(auto, 1fr);
}

.ttm-title {
  border-radius: 10px;
  font-size: 1.7rem;
  grid-area: title;
  padding: 0.5rem 2rem;
}

.ttm-settings {
  grid-area: settings;
}

.ttm-devices {
  grid-area: devices;
}

.ttm-terminal {
  grid-area: terminal;
}

.gold-black-block {
  background-color: #0000004a;
  border: 1px solid #605039e0;
}


@media (max-width: 800px) {
  .teplomash-task-manager-container {
    display: grid;
    grid-template-areas:
      "title"
      "settings"
      "devices"
      "terminal";
    grid-template-columns: 1fr;
  }

  .ttm-title {
    font-size: 1.5rem;
  }
}
</style>
