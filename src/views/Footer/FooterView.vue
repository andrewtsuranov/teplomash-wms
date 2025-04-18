<template>
  <div class="footer-container">
    <div class="footer-copyright">
      <span
        >&copy; 2024 &mdash; {{ yearNow }} Тепломаш&reg; warehouse management
        system.</span
      >
    </div>
    <div class="footer-about">
      <span
        >Система управления складом Тепломаш&reg; с адресным хранением.</span
      >
    </div>
    <div class="footer-support">Поддержка: team@teplomash.ru</div>
  </div>
</template>
<script setup>
import { ref } from "vue";

const yearNow = ref(new Date().getFullYear());
</script>
<style scoped>
.footer-container {
  display: grid;
  grid-template-areas: "copyright about support";
  grid-template-columns: auto 1fr auto;
  grid-template-rows: minmax(50px, auto) auto;
  column-gap: 20px;
  padding: 0 1.2rem;
  color: dimgray;
  align-items: center;
}

.footer-copyright {
  grid-area: copyright;
  display: grid;
  grid-template-columns: 1fr;
}

.footer-about {
  grid-area: about;
  display: grid;
  grid-template-columns: 1fr;
}

.footer-support {
  grid-area: support;
  display: grid;
  grid-template-columns: 1fr;
}

@media (max-width: 1024px) {
  .footer-container {
    grid-template-columns: 1fr;
    grid-template-areas:
      "about"
      "support"
      "copyright";
    row-gap: 20px;
    grid-template-rows: max-content;
    padding: 20px;
  }
}
</style>
