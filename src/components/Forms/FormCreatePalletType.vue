<template>
  <div class="container mt-4">
    <h2>Создать тип паллеты</h2>
    <form @submit.prevent="submitForm">
      <!-- Радиокнопки с динамическим списком -->
      <div class="mb-3">
        <div
            v-for="type in palletStore.palletItemTypeList"
            :key="type.id"
            class="form-check"
        >
          <input
              class="form-check-input"
              type="radio"
              :id="`type-${type.id}`"
              name="productType"
              :value="type.code"
              v-model="palletForm.productType"
          >
          <label
              class="form-check-label"
              :for="`type-${type.id}`"
          >
            {{ type.name }}
          </label>
        </div>
      </div>

      <div class="mb-3">
        <label for="palletName"
               class="form-label"
        >Наименование типа паллеты
        </label>
        <input
            type="text"
            class="form-control"
            id="palletName"
            placeholder="Впишите наименование типа паллеты (например, Серия 600 Колонна 2м, ВО-6Т800А и т.д.)"
            v-model="palletForm.name"
            required
        />
      </div>

      <div class="mb-3">
        <label for="palletType" class="form-label">Тип поддона</label>
        <select
            class="form-select"
            id="palletType"
            v-model="palletForm.type"
            required
        >
          <option value="" disabled selected>Выберите тип поддона</option>
          <option value="no_pallet">Нет поддона</option>
          <option v-for="type in palletStore.basePalletTypeList || []"
                  :key="type.id"
                  :value="type.value"
          >{{ type.name }}</option>

        </select>

      </div>

      <div class="row" v-if="palletForm.type !== 'no_pallet' && palletForm.type !== ''">
        <h5 class="mt-3 mb-3">Расположение коробок на паллете</h5>
        <div class="col-md-4 mb-3">
          <label for="boxesLength" class="form-label">По длине</label>
          <input
              type="number"
              class="form-control"
              id="boxesLength"
              v-model.number="palletForm.boxArrangement.length"
              min="1"
              required
          />
        </div>
        <div class="col-md-4 mb-3">
          <label for="boxesWidth" class="form-label">По ширине</label>
          <input
              type="number"
              class="form-control"
              id="boxesWidth"
              v-model.number="palletForm.boxArrangement.width"
              min="1"
              required
          />
        </div>
        <div class="col-md-4 mb-3">
          <label for="boxesHeight" class="form-label">По высоте</label>
          <input
              type="number"
              class="form-control"
              id="boxesHeight"
              v-model.number="palletForm.boxArrangement.height"
              min="1"
              required
          />
        </div>
      </div>

      <div class="mb-3" v-if="showTotalBoxes">
        <div class="alert alert-info">
          Всего коробок на паллете: <strong>{{ totalBoxesOnPallet }}</strong>
        </div>
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
import {reactive, ref, computed, watch, onMounted} from 'vue';
import {usePalletStore} from "@/stores/HTTP/PalletStore.js";

const palletStore = usePalletStore()

// Реактивное состояние формы
const palletForm = reactive({
  name: '',
  type: '',
  productType: '',
  boxArrangement: {
    length: null,
    width: null,
    height: null
  }
});

const formSubmitted = ref(false);
const formOutput = ref('');

// Вычисляемые свойства
const showTotalBoxes = computed(() => {
  return palletForm.type !== 'no_pallet' &&
      palletForm.type !== '' &&
      palletForm.boxArrangement.length &&
      palletForm.boxArrangement.width &&
      palletForm.boxArrangement.height;
});

const totalBoxesOnPallet = computed(() => {
  if (!showTotalBoxes.value) return 0;

  return palletForm.boxArrangement.length *
      palletForm.boxArrangement.width *
      palletForm.boxArrangement.height;
});

// Очистка данных о расположении при выборе "нет поддона"
watch(() => palletForm.type, (newType) => {
  if (newType === 'no_pallet') {
    palletForm.boxArrangement.length = null;
    palletForm.boxArrangement.width = null;
    palletForm.boxArrangement.height = null;
  }
});

// Обработка отправки формы
const submitForm = () => {
  // Формируем JSON
  const outputData = JSON.stringify(palletForm, null, 2);
  formOutput.value = outputData;
  formSubmitted.value = true;

  // В реальном проекте здесь был бы API-запрос
  console.log('Отправляем данные:', outputData);
};
onMounted(async () => {
  try {
    await palletStore.GET_BASE_PALLET_TYPE_LIST();
    await palletStore.GET_PALLET_ITEM_TYPE_LIST();
  } catch (error) {
    console.error('Error:', error);
  }
});
</script>