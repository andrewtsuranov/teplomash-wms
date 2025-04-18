import { ref, computed } from "vue";

export const useDifferenceById = (sourceArray, compareArray) => {
  const source = ref(sourceArray);
  const compare = ref(compareArray);

  const difference = computed(() => {
    const compareIds = new Set(compare.value.map((item) => item.id));
    return source.value.filter((item) => !compareIds.has(item.id));
  });

  const updateSource = (newSource) => {
    source.value = newSource;
  };

  const updateCompare = (newCompare) => {
    compare.value = newCompare;
  };

  return {
    difference,
    updateSource,
    updateCompare,
    source,
    compare,
  };
};
