<script setup>
import {reactive, ref, computed, watch, onMounted, nextTick} from "vue";
import {usePalletStore} from "@/stores/WMSStores/PalletStore.js";
import {usePackingStore} from "@/stores/WMSStores/PackingStore.js";
import {useWebSocketStore} from "@/stores/WebSocketStore.js";

const webSocketStore = useWebSocketStore();
const palletStore = usePalletStore();
const packingStore = usePackingStore();
const isLoading = ref(false);
const validationErrors = reactive({});
// Проверка наличия ошибок по кодам
const hasError1 = computed(() => {
  return packingStore.detailInfoPackingProduct?.error?.includes("1");
});
const hasError2 = computed(() => {
  return packingStore.detailInfoPackingProduct?.error?.includes("2");
});
// Реактивное состояние формы с расширенной структурой
const palletForm = reactive({
  id: packingStore.detailInfoPackingProduct.id,
  data: {
    name: "",
    code: "",
    product_type_id: packingStore.detailInfoPackingProduct.id,
    description: "",
    base_pallet: null,
    rows_length: 1, // Значение по умолчанию
    rows_width: 1, // Значение по умолчанию
    rows_height: 1, // Значение по умолчанию
    orientation: "LWH",
    default_abc_class: "C",
    default_xyz_class: "Z",
    is_active: true,
  },
  updateProductType: {
    name: packingStore.detailInfoPackingProduct.name,
    length: null,
    width: null,
    height: null,
    max_weight: "",
  },
});
// Добавляем наблюдатель для синхронизации name и code
watch(
    () => palletForm.data.name,
    (newValue) => {
      palletForm.data.code = newValue;
    },
);
// Вычисляемые свойства
const showTotalBoxes = computed(() => {
  return (
      palletForm.data.rows_length &&
      palletForm.data.rows_width &&
      palletForm.data.rows_height
  );
});
const totalBoxesOnPallet = computed(() => {
  if (!showTotalBoxes.value) return 0;
  return (
      palletForm.data.rows_length *
      palletForm.data.rows_width *
      palletForm.data.rows_height
  );
});
// Валидация формы
const validateForm = () => {
  const errors = {};
  // Очистка предыдущих ошибок
  Object.keys(validationErrors).forEach((key) => delete validationErrors[key]);
  // Базовая валидация для ошибки 1
  if (hasError1.value) {
    if (!palletForm.data.name) {
      errors.name = "Необходимо указать наименование";
    }
    if (!palletForm.data.base_pallet) {
      errors.base_pallet = "Необходимо выбрать тип поддона";
    }
    if (!palletForm.data.rows_length || palletForm.data.rows_length < 1) {
      errors.rows_length = "Укажите корректное значение (≥1)";
    }
    if (!palletForm.data.rows_width || palletForm.data.rows_width < 1) {
      errors.rows_width = "Укажите корректное значение (≥1)";
    }
    if (!palletForm.data.rows_height || palletForm.data.rows_height < 1) {
      errors.rows_height = "Укажите корректное значение (≥1)";
    }
  }
  // Дополнительная валидация для ошибки 2
  if (hasError2.value) {
    if (
        !palletForm.updateProductType.length ||
        palletForm.updateProductType.length < 1
    ) {
      errors.productLength = "Укажите корректное значение длины (≥1)";
    }
    if (
        !palletForm.updateProductType.width ||
        palletForm.updateProductType.width < 1
    ) {
      errors.productWidth = "Укажите корректное значение ширины (≥1)";
    }
    if (
        !palletForm.updateProductType.height ||
        palletForm.updateProductType.height < 1
    ) {
      errors.productHeight = "Укажите корректное значение высоты (≥1)";
    }
    if (!palletForm.updateProductType.max_weight) {
      errors.productWeight = "Укажите вес продукции";
    }
  }
  // Копируем ошибки в реактивный объект
  Object.assign(validationErrors, errors);
  return Object.keys(errors).length === 0;
};
// Форматирование веса перед отправкой
const formatWeight = () => {
  if (!palletForm.updateProductType.max_weight.includes(".")) {
    palletForm.updateProductType.max_weight += ".00";
  } else if (
      palletForm.updateProductType.max_weight.split(".")[1].length === 1
  ) {
    palletForm.updateProductType.max_weight += "0";
  }
};
// Обработка успешного создания
const handleSuccess = async () => {
  packingStore.closeTableItemUnregProduct();
  await webSocketStore.GET_UNREGISTERED_ITEMS();
};
// Обработка отправки формы с валидацией
const validateAndSubmit = async () => {
  // Очищаем ошибки перед проверкой
  Object.keys(validationErrors).forEach((key) => delete validationErrors[key]);
  // Запускаем валидацию
  const isValid = validateForm();
  // Дожидаемся обновления DOM
  await nextTick();
  if (!isValid) {
    // Если есть ошибки, прокручиваем к первой ошибке
    const firstErrorField = document.querySelector(".text-danger");
    if (firstErrorField) {
      firstErrorField.scrollIntoView({behavior: "smooth", block: "center"});
    }
    return false;
  }
  try {
    isLoading.value = true;
    // Сценарий 1: Только ошибка кода 2
    if (hasError2.value && !hasError1.value) {
      formatWeight();
      await packingStore.UPDATE_PRODUCT_TYPE(
          palletForm.updateProductType,
          palletForm.id,
      );
      await handleSuccess();
    }
    // Сценарий 2: Только ошибка кода 1
    else if (!hasError2.value && hasError1.value) {
      const result = await packingStore.CREATE_PALLET_TYPE(palletForm.data);
      if (result) {
        await handleSuccess();
      }
    }
    // Сценарий 3: Обе ошибки (коды 1 и 2)
    else if (hasError2.value && hasError1.value) {
      formatWeight();
      await packingStore.UPDATE_PRODUCT_TYPE(
          palletForm.updateProductType,
          palletForm.id,
      );
      const result = await packingStore.CREATE_PALLET_TYPE(palletForm.data);
      if (result) {
        await handleSuccess();
      }
    }
  } catch (e) {
    console.error("Ошибка при обработке запроса:", e);
  } finally {
    isLoading.value = false;
  }
};
onMounted(async () => {
  try {
    await palletStore.GET_BASE_PALLET_TYPE_LIST();
  } catch (error) {
    console.error("Ошибка загрузки типов поддонов:", error);
  }
});
</script>
<template>
  <div class="form-create-pallet-container">
    <div>
      <h4 style="text-transform: uppercase">
        Тип паллеты: {{ packingStore.detailInfoPackingProduct?.name }}
      </h4>
      <hr/>
      <!-- Информационный блок об ошибках -->
      <div v-if="hasError1 || hasError2" class="alert alert-info mb-3">
        <i class="bi bi-info-circle me-2"></i>
        <span v-if="hasError1 && hasError2">
        Необходимо указать параметры паллеты и дополнительные параметры упаковки
      </span>
        <span v-else-if="hasError1"> Необходимо указать параметры паллеты </span>
        <span v-else-if="hasError2">
        Необходимо указать дополнительные параметры упаковки типа продукции
      </span>
      </div>
      <form class="form-create-pallet" novalidate @submit.prevent="validateAndSubmit">
        <div class="form-create-pallet-block-1">
          <!-- Блок дополнительных параметров продукции при наличии ошибки кода 2 -->
          <div v-if="hasError2" class="mb-4">
            <h5 class="mb-3">Параметры упаковки продукции:</h5>
            <div class="row g-3">
              <div class="col-md-3 mb-3">
                <label class="form-label" for="productLength">Длина (мм)</label>
                <input
                    id="productLength"
                    v-model.number="palletForm.updateProductType.length"
                    class="form-control"
                    min="1"
                    required
                    type="number"
                />
                <div v-if="validationErrors.productLength" class="text-danger mt-1">
                  {{ validationErrors.productLength }}
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <label class="form-label" for="productWidth">Ширина (мм)</label>
                <input
                    id="productWidth"
                    v-model.number="palletForm.updateProductType.width"
                    class="form-control"
                    min="1"
                    required
                    type="number"
                />
                <div v-if="validationErrors.productWidth" class="text-danger mt-1">
                  {{ validationErrors.productWidth }}
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <label class="form-label" for="productHeight">Высота (мм)</label>
                <input
                    id="productHeight"
                    v-model.number="palletForm.updateProductType.height"
                    class="form-control"
                    min="1"
                    required
                    type="number"
                />
                <div v-if="validationErrors.productHeight" class="text-danger mt-1">
                  {{ validationErrors.productHeight }}
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <label class="form-label" for="productWeight">Масса (кг)</label>
                <input
                    id="productWeight"
                    v-model="palletForm.updateProductType.max_weight"
                    class="form-control"
                    pattern="\d+(\.\d{2})?"
                    placeholder="0.00"
                    required
                    type="text"
                />
                <div v-if="validationErrors.productWeight" class="text-danger mt-1">
                  {{ validationErrors.productWeight }}
                </div>
              </div>
            </div>
            <hr/>
          </div>
          <!-- Текущая форма для продукции - показываем только при наличии ошибки кода 1 -->
          <div v-if="hasError1">
            <div class="mb-3">
              <h5 class="form-label" for="palletName"
              >Наименование типа паллеты:</h5
              >
              <input
                  id="palletName"
                  v-model="palletForm.data.name"
                  class="form-control"
                  placeholder="например, Серия 600 Колонна 2м или ВО-6Т800А"
                  required
                  type="text"
              />
              <div v-show="validationErrors.name" class="text-danger mt-1">
                {{ validationErrors.name }}
              </div>
            </div>
            <hr/>
            <div class="mb-3">
              <h5 class="form-label" for="palletType">Тип поддона:</h5>
              <select
                  id="palletType"
                  v-model="palletForm.data.base_pallet"
                  class="form-select"
                  required
              >
                <option disabled selected value="">Выберите тип поддона</option>
                <option
                    v-for="type in palletStore.basePalletTypeList || []"
                    :key="type.id"
                    :value="type.id"
                >
                  {{ type.name }}
                </option>
              </select>
              <div v-show="validationErrors.base_pallet" class="text-danger mt-1">
                {{ validationErrors.base_pallet }}
              </div>
            </div>
            <hr/>
          </div>
        </div>
        <div class="form-create-pallet-block-2">
          <div class="row">
            <h5 class="mb-3">Количество коробок на паллете:</h5>
            <div class="col-md-4 mb-3">
              <label class="form-label" for="boxesLength">По длине (max)</label>
              <input
                  id="boxesLength"
                  v-model.number="palletForm.data.rows_length"
                  class="form-control"
                  min="1"
                  required
                  type="number"
              />
              <div v-if="validationErrors.rows_length" class="text-danger mt-1">
                {{ validationErrors.rows_length }}
              </div>
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label" for="boxesWidth">По ширине</label>
              <input
                  id="boxesWidth"
                  v-model.number="palletForm.data.rows_width"
                  class="form-control"
                  min="1"
                  required
                  type="number"
              />
              <div v-if="validationErrors.rows_width" class="text-danger mt-1">
                {{ validationErrors.rows_width }}
              </div>
            </div>
            <div class="col-md-4 mb-3">
              <label class="form-label" for="boxesHeight">По высоте</label>
              <input
                  id="boxesHeight"
                  v-model.number="palletForm.data.rows_height"
                  class="form-control"
                  min="1"
                  required
                  type="number"
              />
              <div v-if="validationErrors.rows_height" class="text-danger mt-1">
                {{ validationErrors.rows_height }}
              </div>
            </div>
            <div v-if="showTotalBoxes && hasError1">
              <div class="alert alert-info mb-0">
                Всего коробок на паллете:
                <strong>{{ totalBoxesOnPallet }}</strong>
              </div>
            </div>
          </div>
          <hr/>
          <div class="mb-3">
            <h5 class="form-label" for="palletDescription">Описание:</h5>
            <textarea
                id="palletDescription"
                v-model="palletForm.data.description"
                class="form-control"
                placeholder="Введите описание типа паллеты"
                rows="3"
            ></textarea>
          </div>
          <hr/>
          <!-- Показываем ошибки валидации в общем блоке -->
          <div
              v-if="Object.keys(validationErrors).length > 0"
              class="alert alert-danger mb-3"
          >
            <i class="bi bi-exclamation-triangle me-2"></i>
            Пожалуйста, исправьте ошибки в форме!
          </div>
          <button :disabled="isLoading" class="btn btn-primary" type="submit">
        <span
            v-if="isLoading"
            aria-hidden="true"
            class="spinner-border spinner-border-sm me-2"
            role="status"
        ></span>
            {{ isLoading ? "Создание..." : "Создать" }}
          </button>
        </div>
      </form>
    </div>
    <div>
    </div>
  </div>
</template>
<style scoped>
.form-create-pallet-container {
  display: grid;
  color: darkgrey;
  grid-template-columns: auto auto;
  background-color: #2e2e2e;
  padding: 1rem;
  border: 1px solid #605039e0;
  border-radius: .5rem;
}

.form-create-pallet {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 3rem;
}

.form-create-pallet-block-1 {
  padding: 1rem;
  border: 1px solid #545455;
  border-radius: .5rem;
}

.form-create-pallet-block-2 {
  padding: 1rem;
  border: 1px solid #545455;
  border-radius: .5rem;
}
</style>
