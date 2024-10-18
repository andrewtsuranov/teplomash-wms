<template>
  <div class="general-page">
    <general-page/>
    <q-r-code-gen/>
  </div>
</template>
<script setup>
import GeneralPage from "@/components/Main/GeneralPage.vue";
import QRCodeGen from "@/components/Main/QRCodeGen.vue";
</script>
<style scoped>
.general-page {
  display: grid;
  background-color: rgba(245, 245, 245, 0.05);
  overflow: hidden;
  grid-template-columns: 1fr 1fr;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px 0 20px;
  justify-items: center;
  gap: 5rem;
  align-content: center;
}
</style>