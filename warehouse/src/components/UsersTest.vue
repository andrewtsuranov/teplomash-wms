<template>
  <div class="user">
    <div class="user-name">
      {{ user.surname }} {{ user.name }} {{ user.middleName }} ({{ user.email }})
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true,
    default: () => {
    }
  }
})
</script>
<style scoped>
</style>