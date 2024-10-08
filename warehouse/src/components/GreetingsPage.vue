<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>
<template>
  <div class="greetings">
    <h1 class="">{{ msg }}</h1>
    <p>Адресная система хранения складом Тепломаш&reg;</p>
    <span>Разработана для сотрудников складских помещений Тепломаш&reg; с целью оптимизации процессов поиска, комплектации
        и хранения товарной номенклатуры</span>
  </div>
</template>
<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

p {
  margin-bottom: 1rem;
}

p, span {
  font-size: 1.3rem;
}

.greetings h1,
.greetings span,
.greetings p {
  text-align: center;
  color: blanchedalmond;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings span,
  .greetings p {
    text-align: left;
    color: blanchedalmond;
  }
}
</style>
