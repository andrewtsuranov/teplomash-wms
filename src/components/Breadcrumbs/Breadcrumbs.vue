<template>
  <nav v-if="breadcrumbs.length"
       aria-label="breadcrumb"
       class="my-breadcrumbs"
       style="--bs-breadcrumb-divider: '>'"
  >
    <ol class="breadcrumb">
      <li
          v-for="(breadcrumb, index) in breadcrumbs"
          :key="breadcrumb.path"
          :class="{ active: index === breadcrumbs.length - 1 }"
          class="breadcrumb-item"
          style="color: #6c757d"
      >
        <router-link
            v-if="index < breadcrumbs.length - 1"
            :to="getRouteLocation(breadcrumb)"
        >
          <span class="breadcrumb-item-style">
            <!-- Bootstrap Icon -->
            <i
                v-if="getBreadcrumbIcon(breadcrumb)"
                :aria-label="
    shouldShowText(breadcrumb)
      ? undefined
      : getBreadcrumbText(breadcrumb)
  "
                :class="[
                `bi ${getBreadcrumbIcon(breadcrumb)}`,
                getIconExtraClasses(breadcrumb),
              ]"
                :style="getIconSizeStyle(breadcrumb)"
                :title="
                shouldShowText(breadcrumb)
                  ? undefined
                  : getBreadcrumbText(breadcrumb)
              "
                aria-hidden="true"
            ></i>
            <!-- Показываем текст только если он должен отображаться -->
            <span v-if="shouldShowText(breadcrumb)">{{
                getBreadcrumbText(breadcrumb)
                                                    }}</span>
          </span>
        </router-link>
        <span v-else>
          <!-- Bootstrap Icon для активного элемента -->
          <i
              v-if="getBreadcrumbIcon(breadcrumb)"
              :class="`bi ${getBreadcrumbIcon(breadcrumb)}`"
              :style="getIconSizeStyle(breadcrumb)"
              :title="
              shouldShowText(breadcrumb)
                ? undefined
                : getBreadcrumbText(breadcrumb)
            "
              aria-hidden="true"
          ></i>
          <!-- Показываем текст только если он должен отображаться -->
          <span v-if="shouldShowText(breadcrumb)">{{
              getBreadcrumbText(breadcrumb)
                                                  }}</span>
        </span>
      </li>
    </ol>
  </nav>
</template>
<script setup>
import {watch, computed, shallowRef} from "vue";
import {useRoute} from "vue-router";

const route = useRoute();
const breadcrumbs = shallowRef([]);
const matchedRoutes = computed(() => route.matched);
watch(
    matchedRoutes,
    (newMatched) => {
      // Получаем все подходящие маршруты
      let matchingRoutes = newMatched.filter(
          (route) => route.name || route.meta?.breadcrumb,
      );
      // Сначала ищем маршрут, помеченный как корневой
      const rootIndex = matchingRoutes.findIndex(
          (route) =>
              route.meta?.breadcrumb &&
              typeof route.meta.breadcrumb === "object" &&
              route.meta.breadcrumb.root === true,
      );
      // Если нашли корневой маршрут, отсекаем всё перед ним
      if (rootIndex > 0) {
        matchingRoutes = matchingRoutes.slice(rootIndex);
      }
      breadcrumbs.value = matchingRoutes;
    },
    {immediate: true},
);

// Форматирование имени маршрута
const formatRouteName = (path) => {
  if (!path) return "";
  const parts = path.split("/").filter((part) => part);
  return parts
      .map((part) => {
        if (part.startsWith(":")) {
          const paramName = part.slice(1);
          return route.params[paramName] || paramName;
        }
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join(" ");
};

// Получение иконки для хлебной крошки
const getBreadcrumbIcon = (breadcrumb) => {
  const breadcrumbMeta = breadcrumb.meta?.breadcrumb;
  return (typeof breadcrumbMeta === "object" && breadcrumbMeta.icon) ? breadcrumbMeta.icon : null;
};

// Формирование объекта для навигации
const getRouteLocation = (breadcrumb) => {
  // Проверяем, принадлежит ли breadcrumb маршруту с idWarehouse
  if (breadcrumb.path &&
      (breadcrumb.path.includes(':idWarehouse') || breadcrumb.name === 'WMSProcess')) {
    return {
      name: breadcrumb.name,
      params: {
        idWarehouse: route.params.idWarehouse || ''
      }
    };
  }

  // Расширенная проверка для других параметров (масштабируемость)
  const params = {};
  for (const key in route.params) {
    // Проверяем, есть ли параметр в пути текущего breadcrumb
    if (breadcrumb.path?.includes(`:${key}`)) {
      params[key] = route.params[key];
    }
  }

  return Object.keys(params).length > 0
      ? { name: breadcrumb.name, params }
      : { name: breadcrumb.name };
};

// Получение текста для хлебной крошки
const getBreadcrumbText = (breadcrumb) => {
  const breadcrumbMeta = breadcrumb.meta?.breadcrumb;
  if (typeof breadcrumbMeta === "object" && breadcrumbMeta.text) {
    // Если text — функция, вызываем её с текущим route
    return typeof breadcrumbMeta.text === "function"
        ? breadcrumbMeta.text(route)
        : breadcrumbMeta.text;
  }
  return breadcrumbMeta || breadcrumb.name || formatRouteName(breadcrumb.path);
};

// Определение видимости текста
const shouldShowText = (breadcrumb) => {
  const breadcrumbMeta = breadcrumb.meta?.breadcrumb;
  return !(typeof breadcrumbMeta === "object" && breadcrumbMeta.textOnly === false);
};

// Получение дополнительных классов для иконки
const getIconExtraClasses = (breadcrumb) => {
  const breadcrumbMeta = breadcrumb.meta?.breadcrumb;
  return (typeof breadcrumbMeta === "object" && breadcrumbMeta.iconClass)
      ? breadcrumbMeta.iconClass
      : "";
};

// Получение стилей для размера иконки
const getIconSizeStyle = (breadcrumb) => {
  const breadcrumbMeta = breadcrumb.meta?.breadcrumb;
  if (typeof breadcrumbMeta !== "object" || !breadcrumbMeta.iconSize) {
    return {};
  }

  const sizeMap = {
    sm: "0.75em",
    md: "1em",
    lg: "1.25em",
    xl: "1.5em",
    "2xl": "2em",
  };

  const fontSize = sizeMap[breadcrumbMeta.iconSize] || "1em";
  if (!sizeMap[breadcrumbMeta.iconSize]) {
    console.warn(`Invalid iconSize: ${breadcrumbMeta.iconSize}`);
  }

  return { fontSize };
};
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
