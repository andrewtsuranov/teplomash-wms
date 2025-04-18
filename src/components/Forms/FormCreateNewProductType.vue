<template>
  <div class="container mt-4">
    <h2>Создать новый тип продукции</h2>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label for="productName" class="form-label"
          >Наименование типа продукции</label
        >
        <input
          type="text"
          class="form-control"
          id="productName"
          v-model="productForm.name"
          required
        />
      </div>

      <div class="mb-3">
        <label for="productType" class="form-label">Тип изделия</label>
        <select
          class="form-select"
          id="productType"
          v-model="productForm.type"
          required
        >
          <option value="" disabled selected>Выберите тип изделия</option>
          <option value="product">Продукция</option>
          <option value="goods">Товар</option>
          <option value="component">Комплектующая</option>
        </select>
      </div>

      <div class="row">
        <div class="col-md-4 mb-3">
          <label for="length" class="form-label">Длина (мм)</label>
          <input
            type="number"
            class="form-control"
            id="length"
            v-model.number="productForm.dimensions.length"
            min="1"
            required
          />
        </div>
        <div class="col-md-4 mb-3">
          <label for="width" class="form-label">Ширина (мм)</label>
          <input
            type="number"
            class="form-control"
            id="width"
            v-model.number="productForm.dimensions.width"
            min="1"
            required
          />
        </div>
        <div class="col-md-4 mb-3">
          <label for="height" class="form-label">Высота (мм)</label>
          <input
            type="number"
            class="form-control"
            id="height"
            v-model.number="productForm.dimensions.height"
            min="1"
            required
          />
        </div>
      </div>

      <div class="mb-3">
        <label for="packAmount" class="form-label">Количество в упаковке</label>
        <input
          type="number"
          class="form-control"
          id="packAmount"
          v-model.number="productForm.packAmount"
          min="1"
          required
        />
      </div>

      <button type="submit" class="btn btn-primary">Создать</button>
    </form>

    <div v-if="formSubmitted" class="mt-4">
      <h3>Результат (JSON):</h3>
      <pre class="bg-light p-3 rounded">{{ formOutput }}</pre>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";

// Реактивное состояние формы
const productForm = reactive({
  name: "",
  type: "",
  dimensions: {
    length: null,
    width: null,
    height: null,
  },
  packAmount: null,
});

const formSubmitted = ref(false);
const formOutput = ref("");

// Обработка отправки формы
const submitForm = () => {
  // Формируем JSON
  const outputData = JSON.stringify(productForm, null, 2);
  formOutput.value = outputData;
  formSubmitted.value = true;

  // В реальном проекте здесь был бы API-запрос
  console.log("Отправляем данные:", outputData);
};
</script>
<style scoped></style>
