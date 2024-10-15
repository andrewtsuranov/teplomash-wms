<template>
  <div class="footer-container">
    <div class="footer-copyright">
      <i class="bi bi-c-circle"></i><span>2024 Тепломаш &mdash; warehouse management.</span>
    </div>
    <div class="footer-main">
      <span>Адресная система хранения складом Тепломаш&reg;</span>
    </div>
    <div class="footer-info">
      Поддержка: team@teplomash.ru
    </div>
  </div>
</template>
<script setup>
</script>
<style scoped>
.footer-container {
  display: grid;
  column-gap: 10px;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 50px auto;
  align-items: center;
  color: dimgray;
  padding: 0 50px;
}

.footer-copyright {
}

.footer-main {
}

.footer-info {
}
</style>