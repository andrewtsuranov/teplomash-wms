<template>
  <div class="home-view-container">
    <div class="home-view">
      <div class="textGreetings" @click="">
        <h1>Приветствуем Вас, {{ userStore.getFullNameUser.firstName }} {{ userStore.getFullNameUser.middlename }}!</h1>
      </div>
      <div class="svgHomePic">
        <svg-home-pic height="550px"/>
      </div>
      <div class="wms"
           @click="router.push({name: 'WMS'})"
      >Управление складом Тепломаш
      </div>
    </div>
  </div>
</template>
<script setup>
import {useRouter} from "vue-router";
import {useUserStore} from "@/stores/HTTP/Auth/UserStore.js";
import SvgHomePic from "@/assets/SVG/svgHomePic.vue";

const userStore = useUserStore()
const router = useRouter()
</script>
<style scoped>
.home-view-container {
  display: grid;
  grid-template-columns: 1fr;
  /*background-color: rgba(245, 245, 245, 0.05);*/
  margin: 0 60px;
  height: 100%;


}

.home-view {
  display: grid;
  grid-template-areas:
      "text image"
      "button image";
  grid-template-columns: 1fr 1fr;
  grid-template-rows: minmax(auto, max-content);
  padding: 7rem;
  place-content: center;

}

.textGreetings {
  display: grid;
  grid-area: text;
  background-color: rgba(245, 245, 245, 0.1);
  border: none;
  border-radius: 30px;
}

.svgHomePic {
  display: grid;
  grid-area: image;

}

.wms {
  display: grid;
  grid-area: button;


}

@media (max-width: 1024px) {
  .home-view-container {
    display: grid;
    grid-template-columns: 1fr;
    margin: 0;
  }
}
</style>