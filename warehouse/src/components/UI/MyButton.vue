<template>
  <button class="btn">
    <slot></slot>
  </button>
</template>
<style scoped>
.btn {
  padding: 10px 20px;
  background: none;
  color: blanchedalmond;
  border: 1px solid blanchedalmond;
  border-radius: 20px;
  font-size: 1rem;
  margin-right: 15px;
}

.btn:hover {
  background-color: blanchedalmond;
  /*background-color: rgba(255, 255, 255, 0.2);*/
  cursor: pointer;
  transition: background-color 0.5s;
  color: black;
}
</style>