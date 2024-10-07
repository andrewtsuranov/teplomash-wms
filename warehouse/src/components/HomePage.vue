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
    <h3>
      <p>Адресная система хранения складом Тепломаш&reg;<br/></p>Разработана для сотрудников складских помещений Тепломаш&reg; с целью оптимизации процессов поиска, комплектации и хранения товарной номенклатуры.
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.3rem;
  color: #9B9482;
}
p {
  margin-bottom: 1rem;
}
.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
