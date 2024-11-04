<template>
  <!-- Скрывающийся navbar для мобильных -->
  <div class="mobile-navbar">
    <div id="navbarToggleExternalContent"
         class="collapse"
         data-bs-theme="dark"
    >
      <div class="bg-dark navbar-content">
        <header-nav class="navbar-menu"/>
        <header-search class="navbar-search"/>
        <header-profile class="navbar-profile"/>
      </div>
    </div>
    <nav class="navbar navbar-dark bg-dark">
      <div class="container-fluid">
        <div class="navbar-logo">
          <logo-teplomash @click="router.push({name: 'Home'})"/>
        </div>
        <button aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation"
                class="navbar-toggler collapsed" data-bs-target="#navbarToggleExternalContent"
                data-bs-toggle="collapse" type="button">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
    </nav>
  </div>
  <!-- Основной header для десктопа -->
  <div class="navbar-content desktop-navbar">
    <logo-teplomash class="navbar-logo" @click="router.push({name: 'Home'})"/>
    <header-nav class="navbar-menu"/>
    <header-search class="navbar-search"/>
    <header-profile class="navbar-profile"/>
  </div>
</template>
<script setup>
import HeaderSearch from "@/views/Header/Search/NavbarSearch.vue";
import HeaderProfile from "@/views/Header/Profile/NavbarProfile.vue";
import LogoTeplomash from "@/components/UI/SVG/svgLogo.vue";
import HeaderNav from "@/views/Header/Menu/NavbarMenu.vue";
import {useRouter} from "vue-router";

const router = useRouter()
</script>
<style scoped>
.navbar-content {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid: "logo navigation search profile";
  column-gap: 20px;
  grid-template-columns: minmax(240px, auto) minmax(400px, auto) minmax(300px, auto) auto;
  grid-template-rows: minmax(auto, 60px);
  padding: 0 3rem;
}

.navbar-logo {
  grid-area: logo;
  display: grid;
  grid-template-rows: minmax(auto, 50px);
  align-self: center;
}

.navbar-menu {
  grid-area: navigation;
}

.navbar-search {
  grid-area: search;
}

.navbar-profile {
  grid-area: profile;
  display: grid;
  justify-items: end;
}

.mobile-navbar {
  display: none;
}

@media (max-width: 1140px) {
  .navbar-content {
    grid: "logo navigation profile"
          "search search search";
    grid-template-columns: minmax(max-content, 250px) minmax(400px, auto) auto;
    grid-template-rows: minmax(80px, auto);
  }
}

@media (max-width: 800px) {
  /* Стили для мобильного navbar */
  .navbar-content {
    padding: 0;
    grid: "search"
        "navigation"
        "profile";
    row-gap: 1.7rem;
  }

  .navbar-search {
    padding: 20px 20px 0 20px;
  }

  .navbar-profile {
    display: grid;
    justify-items: stretch;
  }

  .desktop-navbar {
    display: none;
  }

  .mobile-navbar {
    display: grid;
    grid-template-rows: minmax(auto, 1fr);
  }
}
</style>