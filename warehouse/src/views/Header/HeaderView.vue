<template>
  <!-- Скрывающийся navbar для мобильных -->
  <div class="mobile-header">
    <div id="navbarToggleExternalContent" class="collapse" data-bs-theme="dark" style="">
      <div class="bg-dark header-container">
        <header-nav class="header-navigation"/>
        <header-search class="header-search"/>
        <header-profile class="header-profile"/>
      </div>
    </div>
    <nav class="navbar navbar-dark bg-dark">
      <div class="container-fluid">
        <logo-teplomash :height="logoHeight" class="header-logo"/>
        <button aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation"
                class="navbar-toggler collapsed" data-bs-target="#navbarToggleExternalContent"
                data-bs-toggle="collapse" type="button">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>
  </div>
  <!-- Основной header для десктопа -->
  <div class="header-container desktop-header">
    <logo-teplomash :height="logoHeight" class="header-logo"/>
    <header-nav class="header-navigation"/>
    <header-search class="header-search"/>
    <header-profile class="header-profile"/>
  </div>
</template>
<script setup>
import HeaderSearch from "@/views/Header/HeaderSearch.vue";
import HeaderProfile from "@/views/Header/HeaderProfile.vue";
import LogoTeplomash from "@/components/UI/LogoTeplomash.vue";
import HeaderNav from "@/views/Header/HeaderNav.vue";
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

.mobile-header {
  display: none;
}

@media (max-width: 1350px) {
  .header-container {
    grid: "logo navigation profile"
          "search search search";
    grid-template-columns: minmax(max-content, 250px) minmax(400px, auto) auto;
    grid-template-rows: minmax(80px, auto);
  }
}

@media (max-width: 1024px) {
  /* Стили для мобильного navbar */
  .header-container {
    padding: 0;
    grid: "search"
        "navigation"
        "profile";
    row-gap: 1.7rem;
  }

  .header-search {
    padding: 20px 20px 0 20px;
  }

  .header-profile {
    display: grid;
    justify-items: stretch;
  }

  .desktop-header {
    display: none;
  }

  .mobile-header {
    display: grid;
  }
}
</style>