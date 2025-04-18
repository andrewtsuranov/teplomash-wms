<template>
  <g :transform="transform">
    <!-- Тип front -->
    <g
      v-if="type === 'front'"
      :transform="`scale(${width / 593.56}, ${145 / 71.72})`"
    >
      <!-- Используем viewBox из оригинального SVG -->
      <rect class="fil0" width="593.56" height="9.89" />
      <rect class="fil0" y="9.89" width="593.56" height="9.89" />
      <rect class="fil0" y="61.83" width="593.56" height="9.89" />
      <rect class="fil0" y="19.79" width="71.72" height="42.04" />
      <rect class="fil0" x="521.84" y="19.79" width="71.72" height="42.04" />
      <rect class="fil0" x="260.92" y="19.79" width="71.72" height="42.04" />
    </g>
    <!-- Тип side-800 -->
    <g
      v-else-if="type === 'side-800'"
      :transform="`scale(${width / 1551.75}, ${145 / 281.25})`"
    >
      <rect class="fil0" y="242.46" width="193.97" height="38.79" />
      <rect class="fil0" x="1357.78" y="242.46" width="193.97" height="38.79" />
      <rect class="fil0" x="635.25" y="242.46" width="281.26" height="38.79" />
      <rect class="fil0" y="38.8" width="1551.75" height="38.79" />
      <path
        class="fil0"
        d="M174.57 0l-155.17 0c-10.67,0 -19.4,8.73 -19.4,19.4l0 19.4 193.97 0 0 -19.4c0,-10.67 -8.73,-19.4 -19.4,-19.4z"
      />
      <path
        class="fil0"
        d="M1532.36 0l-155.18 0c-10.67,0 -19.4,8.73 -19.4,19.4l0 19.4 193.97 0 0 -19.4c0,-10.67 -8.72,-19.4 -19.39,-19.4z"
      />
      <path
        class="fil0"
        d="M897.11 0l-242.47 0c-10.66,0 -19.39,8.73 -19.39,19.4l0 19.4 281.26 0 0 -19.4c0,-10.67 -8.73,-19.4 -19.4,-19.4z"
      />
      <rect class="fil0" x="635.25" y="77.59" width="281.26" height="164.87" />
      <rect class="fil0" y="77.59" width="193.97" height="164.87" />
      <rect class="fil0" x="1357.78" y="77.59" width="193.97" height="164.87" />
      <path
        class="fil0"
        d="M337.02 0l155.18 0c10.67,0 19.4,8.73 19.4,19.4l0 19.4 -193.98 0 0 -19.4c0,-10.67 8.73,-19.4 19.4,-19.4z"
      />
      <path
        class="fil0"
        d="M1059.56 0l155.17 0c10.67,0 19.4,8.73 19.4,19.4l0 19.4 -193.97 0 0 -19.4c0,-10.67 8.72,-19.4 19.4,-19.4z"
      />
    </g>
    <!-- Тип side-1200 -->
    <g v-else :transform="`scale(${width / 638.69}, ${145 / 77.18})`">
      <rect class="fil0" y="66.53" width="53.22" height="10.65" />
      <rect class="fil0" x="585.46" y="66.53" width="53.22" height="10.65" />
      <rect class="fil0" x="280.76" y="66.53" width="77.17" height="10.65" />
      <rect class="fil0" y="10.65" width="638.69" height="10.65" />
      <path
        class="fil0"
        d="M47.9 0l-42.58 0c-2.93,0 -2.32,2.39 -5.32,5.32l0 5.33 53.22 0 0 -5.33c0,-2.93 -2.39,-5.32 -5.32,-5.32z"
      />
      <path
        class="fil0"
        d="M633.36 0l-42.58 0c-2.92,0 -5.32,2.39 -5.32,5.32l0 5.33 53.23 0 0 -5.33c0,-2.93 -2.4,-5.32 -5.33,-5.32z"
      />
      <path
        class="fil0"
        d="M352.61 0l-66.53 0c-2.93,0 -5.33,2.39 -5.33,5.32l0 5.33 77.18 0 0 -5.33c0,-2.93 -2.39,-5.32 -5.32,-5.32z"
      />
      <rect class="fil0" x="280.75" y="21.29" width="77.17" height="45.24" />
      <rect class="fil0" y="21.29" width="53.22" height="45.24" />
      <rect class="fil0" x="585.46" y="21.29" width="53.22" height="45.24" />
      <path
        class="fil0"
        d="M198.92 0l42.58 0c2.93,0 5.33,2.39 5.33,5.32l0 5.33 -53.23 0 0 -5.33c0,-2.93 2.4,-5.32 5.32,-5.32z"
      />
      <path
        class="fil0"
        d="M102.12 0l42.58 0c2.93,0 5.32,2.39 5.32,5.32l0 5.33 -53.22 0 0 -5.33c0,-2.93 2.39,-5.32 5.32,-5.32z"
      />
      <path
        class="fil0"
        d="M397.18 0l42.58 0c2.93,0 5.32,2.39 5.32,5.32l0 5.33 -53.22 0 0 -5.33c0,-2.93 2.39,-5.32 5.32,-5.32z"
      />
      <path
        class="fil0"
        d="M493.98 0l42.58 0c2.93,0 5.32,2.39 5.32,5.32l0 5.33 -53.22 0 0 -5.33c0,-2.93 2.39,-5.32 5.32,-5.32z"
      />
    </g>
  </g>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ["front", "side-800", "side-1200"].includes(value),
  },
  width: {
    type: Number,
    required: true,
  },
  transform: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.fil0 {
  fill: #8b4513;
}
</style>
