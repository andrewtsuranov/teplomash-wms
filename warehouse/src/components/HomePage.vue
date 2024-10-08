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
    <h1 class="green">{{ msg }}</h1>
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
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

span {
  font-size: 1.3rem;
  color: #9B9482;
}

.greetings h1,
.greetings span,
.greetings p {
  text-align: center;


}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings span,
  .greetings p {
    text-align: left;
  }
}
</style>
