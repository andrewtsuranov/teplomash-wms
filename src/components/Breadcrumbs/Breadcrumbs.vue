<template>
  <nav aria-label="breadcrumb" class="my-breadcrumbs"
       style="--bs-breadcrumb-divider: '>'; --bs-breadcrumb-divider-color: #2d3da2;">
    <ol class="breadcrumb">
      <li
          v-for="(breadcrumb, index) in breadcrumbs"
          :key="breadcrumb.path + index"
          :class="{ active: index === breadcrumbs.length - 1 }"
          class="breadcrumb-item"
          style="color: #6c757d"
      >
        <router-link v-if="index < breadcrumbs.length - 1" :to="breadcrumb.path">
          <span class="breadcrumb-item-style">
            <!-- Bootstrap Icon -->
<i v-if="getBreadcrumbIcon(breadcrumb)"
   :class="[
     `bi ${getBreadcrumbIcon(breadcrumb)}`,
     getIconExtraClasses(breadcrumb)
   ]"
   :style="getIconSizeStyle(breadcrumb)"
   :title="shouldShowText(breadcrumb) ? undefined : getBreadcrumbText(breadcrumb)"
   aria-hidden="true"></i>
            <!-- Показываем текст только если он должен отображаться -->
            <span v-if="shouldShowText(breadcrumb)">{{ getBreadcrumbText(breadcrumb) }}</span>
          </span>
        </router-link>
        <span v-else>
          <!-- Bootstrap Icon для активного элемента -->
          <i v-if="getBreadcrumbIcon(breadcrumb)"
             :class="`bi ${getBreadcrumbIcon(breadcrumb)}`"
             :style="getIconSizeStyle(breadcrumb)"
             :title="shouldShowText(breadcrumb) ? undefined : getBreadcrumbText(breadcrumb)"
             aria-hidden="true"></i>
          <!-- Показываем текст только если он должен отображаться -->
          <span v-if="shouldShowText(breadcrumb)">{{ getBreadcrumbText(breadcrumb) }}</span>
        </span>
      </li>
    </ol>
  </nav>
</template>
<script setup>
import {watch, ref, computed} from 'vue';
import {useRoute} from 'vue-router';

const route = useRoute();
const breadcrumbs = ref([]);
// Использование более нативного реактивного API Vue 3.4
const matchedRoutes = computed(() => route.matched);
watch(matchedRoutes, (newMatched) => {
  // Получаем все подходящие маршруты
  let matchingRoutes = newMatched.filter(route => route.name || route.meta?.breadcrumb);

  // Сначала ищем маршрут, помеченный как корневой
  const rootIndex = matchingRoutes.findIndex(route =>
      route.meta?.breadcrumb &&
      typeof route.meta.breadcrumb === 'object' &&
      route.meta.breadcrumb.root === true
  );

  // Если нашли корневой маршрут, отсекаем всё перед ним
  if (rootIndex > 0) {
    matchingRoutes = matchingRoutes.slice(rootIndex);
  }

  breadcrumbs.value = matchingRoutes;
}, { immediate: true });

function formatRouteName(path) {
  if (!path) return '';
  const formattedName = path
      .split('/')
      .filter(part => part && !part.startsWith(':'))
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  return formattedName;
}

// Методы для работы с Bootstrap иконками
function getBreadcrumbIcon(breadcrumb) {
  const breadcrumbMeta = breadcrumb.meta?.breadcrumb;
  if (typeof breadcrumbMeta === 'object' && breadcrumbMeta.icon) {
    return breadcrumbMeta.icon;
  }
  return null;
}

function getBreadcrumbText(breadcrumb) {
  const breadcrumbMeta = breadcrumb.meta?.breadcrumb;
  if (typeof breadcrumbMeta === 'object' && breadcrumbMeta.text) {
    return breadcrumbMeta.text;
  }
  return breadcrumbMeta || breadcrumb.name || formatRouteName(breadcrumb.path);
}

// Метод для определения, нужно ли показывать текст
function shouldShowText(breadcrumb) {
  const breadcrumbMeta = breadcrumb.meta?.breadcrumb;
  if (typeof breadcrumbMeta === 'object' && breadcrumbMeta.textOnly === false) {
    return false;
  }
  return true;
}

const getIconExtraClasses = (breadcrumb) => {
  const breadcrumbMeta = breadcrumb.meta?.breadcrumb;
  if (typeof breadcrumbMeta === 'object' && breadcrumbMeta.iconClass) {
    return breadcrumbMeta.iconClass;
  }
  return '';
}
// Новый метод для работы с размерами иконок через стили
const getIconSizeStyle = (breadcrumb) => {
  const breadcrumbMeta = breadcrumb.meta?.breadcrumb;
  if (typeof breadcrumbMeta !== 'object' || !breadcrumbMeta.iconSize) {
    return {}; // Возвращаем пустой объект, если размер не указан
  }
  // Карта размеров Bootstrap
  const sizeMap = {
    'sm': '0.75em',
    'md': '1em',     // стандартный размер
    'lg': '1.25em',
    'xl': '1.5em',
    '2xl': '2em'
  };
  // Проверяем, есть ли такой размер в карте
  const fontSize = sizeMap[breadcrumbMeta.iconSize] || '1em';
  return {
    fontSize: fontSize
  };
}
</script>
<style scoped>
.my-breadcrumbs {
  padding: 0 2rem;
}

.breadcrumb-item::before {
  color: #6c757d;
}

/* Базовые стили для иконок */
.bi {
  margin-right: 0.4rem;
  /* Улучшаем вертикальное выравнивание */
  vertical-align: -0.125em;
  display: inline-flex;
  align-items: center;
}

/* Стили для контейнера иконки и текста */
.breadcrumb-item-style {
  display: inline-flex;
  align-items: center;
}

/* Если иконка последняя, у неё не должно быть margin-right */
.breadcrumb-item-style > i:only-child,
.breadcrumb-item > span > i:only-child {
  margin-right: 0;
}

/* Стили для текста рядом с иконкой */
.breadcrumb-item-style > span,
.breadcrumb-item > span > span {
  display: inline-flex;
  align-items: center;
  line-height: 1; /* Важно для вертикального выравнивания */
}

a {
  color: inherit;
  text-decoration: none;
  margin: 0;
  padding: 0;
  display: inline-flex;
  align-items: center;
}
</style>