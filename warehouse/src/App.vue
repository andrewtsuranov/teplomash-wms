<template>
  <div class="grid-container">
    <header class="header">
      <header-menu-view/>
    </header>
    <main class="main">
      <div class="content">
        <logo-main class="logo logo-main"/>
        <greetings-main-view class="greetings" msg="Добро пожаловать!"/>
        <RouterView class="authorization"/>
      </div>
    </main>
    <footer class="footer">
      <footer-main-view/>
    </footer>
  </div>
</template>
<script setup>
import {RouterLink, RouterView} from 'vue-router'
import GreetingsMainView from "@/views/MainView/GreetingsMainView.vue";
import LogoMain from "@/components/UI/LogoMain.vue";
import FooterMainView from "@/views/MainView/FooterMainView.vue";
import HeaderMenuView from "@/views/MainView/HeaderMenuView.vue";
</script>
<style scoped>
.grid-container {
  display: grid;
  min-height: 100vh;
  grid: "header"
        "main"
        "footer";
  overflow: hidden;
  grid-template-rows: auto 1fr auto;
}

.header {
  grid-area: header;
  background-color: rgba(0, 0, 0, 0.3);
}

.main {
  grid-area: main;
  align-content: center;
}

.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 20px;
  justify-items: center;
  row-gap: 5rem;
}

.logo {
  grid-column: 1 / -1;
}

.logo-main {
  height: 120px;
}

.greetings {
  padding: 0 1rem;
}

.authorization {
  padding: 0 1rem;
}

.footer {
  grid-area: footer;
  background-color: rgba(0, 0, 0, 0.3);
  margin-top: auto;
  align-content: center;
}

/*nav a {*/
/*  color: white;*/
/*  text-decoration: none;*/
/*  padding: 0.5rem;*/
/*  border-radius: 4px;*/
/*  transition: background-color 0.3s;*/
/*}*/
/*nav a:hover,*/
/*nav a.router-link-active {*/
/*  background-color: rgba(255, 255, 255, 0.2);*/
/*}*/
@media (max-width: 768px) {
  /*.grid-container {*/
  /*  grid-template-columns: 1fr;*/
  /*  grid-template-rows: auto auto 1fr;*/
  /*}*/
  .left-column {
    grid-row: 2;
  }

  .right-column {
    grid-row: 3;
  }

  /*nav {*/
  /*  flex-direction: row;*/
  /*  justify-content: center;*/
  /*  flex-wrap: wrap;*/
  /*}*/
}
</style>