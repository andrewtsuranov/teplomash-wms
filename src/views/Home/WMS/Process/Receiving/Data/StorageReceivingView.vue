<template>
  <div class="in-table-container">
    <table class="table-content table table-dark table-hover">
      <thead>
      <tr>
        <th scope="col">№</th>
        <th scope="col">Изделие</th>
        <th scope="col">Особенности</th>
        <th scope="col">Заводской номер</th>
        <th scope="col">Кол-во</th>
        <th scope="col">Паллета</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th scope="row">1</th>
        <td>КЭВ-9П2022Е</td>
        <td>Панель из матовой нержавеющей стали</td>
        <td>1234567898765</td>
        <td>9</td>
        <td>id404</td>
      </tr>
      <tr>
        <th scope="row">2</th>
        <td>КЭВ-12П3011Е</td>
        <td>Панель из глянцевой нержавеющей стали</td>
        <td>1234567898765</td>
        <td>9</td>
        <td>id435</td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td>КЭВ-24П4023Е</td>
        <td>Исполнение 30</td>
        <td>1234567898765</td>
        <td>9</td>
        <td>id43</td>
      </tr>
      </tbody>
    </table>
  </div>
<teplomash-task-manager-view/>
</template>
<script setup>
import TeplomashTaskManagerView from "@/components/TeplomashTaskManager/TeplomashTaskManager.vue";
</script>
<style scoped>
.in-table-container {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-template-rows: 1fr;
  overflow-x: auto;
}

</style>