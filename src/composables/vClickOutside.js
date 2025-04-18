import { onMounted, onUnmounted } from "vue";

export const useClickOutside = (el, excludeEl, callback) => {
  const handler = (event) => {
    // Проверяем, что элемент существует и клик был не по исключенному элементу
    if (
      el.value &&
      !el.value.contains(event.target) &&
      !excludeEl.value?.contains(event.target)
    ) {
      callback(event);
    }
  };
  onMounted(() => {
    document.addEventListener("click", handler);
  });
  onUnmounted(() => {
    document.removeEventListener("click", handler);
  });
  return () => {
    document.removeEventListener("click", handler);
  };
};
