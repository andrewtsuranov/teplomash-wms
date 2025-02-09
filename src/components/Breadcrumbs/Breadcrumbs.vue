<template>
  <nav aria-label="breadcrumb" style="--bs-breadcrumb-divider: '>'; --bs-breadcrumb-divider-color: #2d3da2;"
       class="my-breadcrumbs">
    <ol class="breadcrumb">
      <li
          class="breadcrumb-item"
          v-for="(breadcrumb, index) in breadcrumbs"
          :key="breadcrumb.path + index"
          :class="{ active: index === breadcrumbs.length - 1 }"
          style="color: white"
      >
        <router-link v-if="index < breadcrumbs.length - 1" :to="breadcrumb.path">
          <span class="breadcrumb-item-style">{{
              breadcrumb.meta.breadcrumb || breadcrumb.name || formatRouteName(breadcrumb.path)
            }}</span>
        </router-link>
        <span v-else>
    {{ breadcrumb.meta.breadcrumb || breadcrumb.name || formatRouteName(breadcrumb.path) }}
  </span>
      </li>
    </ol>
  </nav>
</template>
<script setup>
import {computed, watch, ref} from 'vue';
import {useRoute} from 'vue-router';

const route = useRoute();
const breadcrumbs = ref([]);
watch(route, () => {
  breadcrumbs.value = route.matched.filter(route => route.name || route.meta.breadcrumb);
}, {immediate: true});

function formatRouteName(path) {
  if (!path) return '';
  const formattedName = path
      .split('/')
      .filter(part => part && !part.startsWith(':'))
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  return formattedName;
}
</script>
<style scoped>
.my-breadcrumbs {
  padding: 0 2rem;
}

.breadcrumb {
}

.breadcrumb-item::before {
  color: #E9BD5D;
}

.breadcrumb-item-style {
  /*color: #4CAF50;*/
}

a {
  color: inherit;
  text-decoration: none;
  margin: 0;
  padding: 0;
}
</style>