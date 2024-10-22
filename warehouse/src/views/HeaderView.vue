<template>
  <div class="header-container">
    <logo-teplomash :height="logoHeight" class="header-logo"/>
    <header-nav class="header-navigation"/>
    <header-search class="header-search"/>
    <header-profile class="header-profile"/>
  </div>
</template>
<script setup>
import HeaderSearch from "@/components/Header/HeaderSearch.vue";
import HeaderProfile from "@/components/Header/HeaderProfile.vue";
import LogoTeplomash from "@/components/UI/LogoTeplomash.vue";
import HeaderNav from "@/components/Header/HeaderNav.vue";
import {ref} from "vue";

const logoHeight = ref('50px')
</script>
<style scoped>
.header-container {
  display: grid;
  grid: "logo navigation search profile";
  column-gap: 20px;
  align-items: center;
  grid-template-columns: minmax(max-content, 250px) minmax(400px, auto) minmax(300px, auto) auto;
  grid-template-rows: 60px;
  padding: 0 50px;
}

.header-logo {
  grid-area: logo;
  display: grid;
}

.header-navigation {
  grid-area: navigation;
  display: grid;
}

.header-search {
  grid-area: search;
  display: grid;
}

.header-profile {
  grid-area: profile;
  display: grid;
  justify-items: end;
}

@media (max-width: 1350px) {
  .header-container {
    grid: "logo navigation profile"
          "search search search";
    grid-template-columns: minmax(max-content, 250px) minmax(400px, auto) auto;
  }
}

@media (max-width: 1024px) {
  .header-container {
    display: grid;
    grid: "logo"
          "navigation"
          "search"
          "profile";
    align-items: center;
    grid-auto-rows: 60px;
    row-gap: 20px;
    padding: 20px;
  }

  .header-profile {
    justify-items: center;
  }
}
</style>