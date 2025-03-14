<!--<template>-->
<!--  <div class="wms-packing-pallet">-->
<!--    <div v-for="n in 3"-->
<!--         :key="n"-->
<!--         :class="['pallet-status', 'pallet-background', { 'pending': false, 'finish': true, 'error': false }]"-->
<!--         class="pallet-item-content"-->
<!--    >-->
<!--      <div class="pallet-item-row-one">-->
<!--        <div class="piro">-->
<!--          <div class="piro-id">Паллета ID: 339875446</div>-->
<!--          <div class="piro-abc">Класс: А</div>-->
<!--          <div class="piro-size">Габарит: 1200х1200х145 (мм)</div>-->
<!--          <div class="piro-qyt">Кол-во груза: 9 шт </div>-->
<!--          <div class="piro-weight">Масса с грузом: 200 кг </div>-->
<!--        </div>-->
<!--        <div class="pirt-qr" v-html="qrcode"></div>-->
<!--      </div>-->
<!--      <div class="pallet-item-row-two">-->
<!--        <div class="pirt-content">-->
<!--          <div style="font-size: 1.75rem; font-weight: bold">КЭВ-9П2021Е Панель из глянцевой-->
<!--            нержавеющей стали [2024-02-12]-->
<!--          </div>-->
<!--&lt;!&ndash;          <div v-for="item in test">{{ item.status }}</div>&ndash;&gt;-->
<!--          <div>Content</div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="pallet-item-row-three">-->
<!--        <div class="piro-date">Создано: 2024-10-16 13:22:21</div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->
<!--<script setup>-->
<!--import {useSplitDateByT} from "@/composables/SpliDateByT.js";-->
<!--import {useTransactionStore} from "@/stores/WebSockets/transactionStore.js";-->
<!--import QRCode from 'qrcode'-->
<!--import {computed, onMounted, ref} from "vue";-->

<!--const transactionStore = useTransactionStore()-->
<!--const text = ref('А-2024101600-П-1200-[КЭВ-9П2021Е Панель из глянцевой нержавеющей стали]-9')-->
<!--const qrcode = ref(null)-->
<!--const dataYYYYMMDD = ref(new Date().toISOString().slice(0, 10));-->

<!--const test = computed(() => transactionStore.allTransactionsList100.filter(item => item.status === 'PENDING'))-->

<!--const generateQR = async (data) => {-->
<!--  const opts = {-->
<!--    errorCorrectionLevel: 'H',-->
<!--    quality: 0.3,-->
<!--    width: 150,-->
<!--    margin: 1,-->
<!--    color: {-->
<!--      dark: "#000",-->
<!--      light: "none"-->
<!--    }-->
<!--  }-->
<!--  await QRCode.toString(data, opts, (err, string) => {-->
<!--    if (err) throw err-->
<!--    qrcode.value = string-->
<!--  })-->
<!--}-->
<!--onMounted(async () => {-->
<!--  await generateQR(text.value)-->
<!--})-->
<!--</script>-->
<!--<style scoped>-->
<!--.wms-packing-pallet {-->
<!--  display: grid;-->
<!--  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));-->
<!--  grid-template-rows: repeat(auto-fit, 365px);-->
<!--  gap: 1rem;-->
<!--}-->

<!--.pallet-item-content {-->
<!--  display: grid;-->
<!--  grid-template-columns: 1fr;-->
<!--  grid-template-rows: min-content auto min-content;-->
<!--  row-gap: .7rem;-->
<!--  border-radius: 1rem;-->
<!--  color: #2F2D2B;-->
<!--  background-color: #D9D9D9;-->
<!--  font-family: Helvetica, Arial, sans-serif;-->
<!--  padding: 1rem;-->
<!--}-->

<!--.pallet-item-row-one {-->
<!--  display: grid;-->
<!--  grid-template-columns: auto 1fr;-->
<!--  font-weight: bold;-->
<!--}-->
<!--.piro {-->
<!--  display: grid;-->
<!--  grid-template-columns: minmax(auto, 1fr);-->
<!--  grid-auto-rows: min-content;-->

<!--}-->
<!--.piro-id {-->

<!--  font-size: 1.7rem;-->
<!--}-->

<!--.piro-date {-->
<!--  justify-self: end;-->
<!--  font-size: 1.2rem;-->
<!--}-->

<!--.pallet-item-row-two {-->
<!--  display: grid;-->
<!--  grid-template-columns: auto 1fr;-->
<!--  overflow-y: auto;-->
<!--}-->

<!--.pirt-qr {-->
<!--  justify-self: end;-->
<!--  display: grid;-->
<!--  grid-template-columns: 150px;-->
<!--  grid-template-rows: 150px;-->
<!--}-->

<!--.pallet-item-row-three {-->
<!--  display: grid;-->
<!--  grid-template-columns: 1fr;-->
<!--}-->

<!--.pallet-qrcode {-->
<!--  grid-area: qrcode;-->
<!--  align-self: end;-->
<!--}-->

<!--.pallet-background.error,-->
<!--.pallet-status.error {-->
<!--  border: .7rem solid #e80f0f;-->
<!--  animation-name: blinking;-->
<!--  animation-duration: 1s;-->
<!--  animation-iteration-count: 50;-->
<!--}-->

<!--.pallet-background.pending,-->
<!--.pallet-status.pending {-->
<!--  border: .7rem solid #ecaf0e;-->
<!--}-->

<!--.pallet-background.finish,-->
<!--.pallet-status.finish {-->
<!--  border: .7rem solid #19da21;-->
<!--}-->

<!--@media (max-width: 800px) {-->
<!--  .wms-packing-pallet {-->
<!--    display: grid;-->
<!--    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));-->
<!--  }-->
<!--}-->

<!--@keyframes blinking {-->
<!--  50% {-->
<!--    border-color: #ecaf0e;-->
<!--  }-->
<!--}-->
<!--</style>-->


<!--2 вариант-->


<!--<template>-->
<!--  <div class="wms-packing-pallet">-->
<!--    <div v-for="pallet in palletsList"-->
<!--         :key="pallet.id"-->
<!--         :class="['pallet-status', 'pallet-background', {-->
<!--            'pending': pallet.status === 'IN_PROGRESS',-->
<!--            'finish': pallet.status === 'COMPLETED',-->
<!--            'error': pallet.status === 'CANCELED'-->
<!--         }]"-->
<!--         class="pallet-item-content"-->
<!--    >-->
<!--      <div class="pallet-item-row-one">-->
<!--        <div class="piro">-->
<!--          <div class="piro-id">Паллета #{{ pallet.id }}</div>-->
<!--          <div class="piro-abc">Класс: {{ pallet.class }}</div>-->
<!--          <div class="piro-size">Габарит: {{ pallet.dimensions }}</div>-->
<!--          <div class="piro-qyt">Кол-во груза: {{ pallet.itemCount }} шт </div>-->
<!--          <div class="piro-weight">Масса с грузом: {{ pallet.weight }} кг </div>-->
<!--        </div>-->
<!--        <div class="pirt-qr" v-html="pallet.qrCode"></div>-->
<!--      </div>-->
<!--      <div class="pallet-item-row-two">-->
<!--        <div class="pirt-content">-->
<!--          <div style="font-size: 1.75rem; font-weight: bold">{{ pallet.description }}</div>-->
<!--          <div>{{ pallet.additionalInfo }}</div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="pallet-item-row-three">-->
<!--        <div class="piro-date">Создано: {{ formatDate(pallet.createdAt) }}</div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup>-->
<!--import { ref, computed, onMounted, watch } from 'vue'-->
<!--import { useTransactionStore } from "@/stores/WebSockets/transactionStore.js"-->
<!--import { usePalletStore } from '@/stores/HTTP/PalletStore.js'-->
<!--import QRCode from 'qrcode'-->

<!--const transactionStore = useTransactionStore()-->
<!--const palletStore = usePalletStore()-->

<!--// Состояние компонента-->
<!--const palletsList = ref([])-->
<!--const isLoading = ref(false)-->

<!--// Функция для форматирования даты-->
<!--const formatDate = (date) => {-->
<!--  const dateObj = new Date(date)-->
<!--  return dateObj.toLocaleString('ru-RU')-->
<!--}-->

<!--// Создание QR-кода для паллеты-->
<!--const generateQR = async (data) => {-->
<!--  const opts = {-->
<!--    errorCorrectionLevel: 'H',-->
<!--    quality: 0.3,-->
<!--    width: 150,-->
<!--    margin: 1,-->
<!--    color: {-->
<!--      dark: "#000",-->
<!--      light: "none"-->
<!--    }-->
<!--  }-->

<!--  return new Promise((resolve, reject) => {-->
<!--    QRCode.toString(data, opts, (err, string) => {-->
<!--      if (err) reject(err)-->
<!--      resolve(string)-->
<!--    })-->
<!--  })-->
<!--}-->

<!--// Создание новой паллеты из данных транзакции-->
<!--const createPalletFromTransaction = async (transaction) => {-->
<!--  if (transaction.stage_progress.stage_name !== 'Создание паллеты') return null-->

<!--  // Создаем данные для новой паллеты-->
<!--  const palletData = {-->
<!--    id: transaction.id, // В реальном приложении ID должен приходить с сервера-->
<!--    class: 'А',-->
<!--    dimensions: '1200х1200х145 (мм)',-->
<!--    itemCount: 9,-->
<!--    weight: 200,-->
<!--    description: `КЭВ-9П2021Е Панель из глянцевой нержавеющей стали [${new Date().toISOString().slice(0, 10)}]`,-->
<!--    additionalInfo: 'Content',-->
<!--    createdAt: new Date().toISOString(),-->
<!--    status: transaction.status-->
<!--  }-->

<!--  // Генерируем QR-код-->
<!--  const qrText = `А-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-П-1200-[${palletData.description}]-${palletData.itemCount}`-->
<!--  palletData.qrCode = await generateQR(qrText)-->

<!--  return palletData-->
<!--}-->

<!--// Отслеживаем изменения в транзакциях-->
<!--watch(() => transactionStore.allTransactionsList100, async (newTransactions, oldTransactions) => {-->
<!--  if (!newTransactions || newTransactions.length === 0) return-->

<!--  // Находим новые транзакции, которых не было в предыдущем списке-->
<!--  const newTransactionIds = new Set(newTransactions.map(t => t.id))-->
<!--  const oldTransactionIds = new Set(oldTransactions?.map(t => t.id) || [])-->

<!--  // Проходим по всем транзакциям-->
<!--  for (const transaction of newTransactions) {-->
<!--    // Проверяем, является ли транзакция новой или её статус изменился-->
<!--    if (transaction.stage_progress?.stage_name === 'Создание паллеты') {-->
<!--      // Находим индекс существующей паллеты-->
<!--      const existingPalletIndex = palletsList.value.findIndex(p => p.transactionId === transaction.id)-->

<!--      if (existingPalletIndex >= 0) {-->
<!--        // Если статус изменился, обновляем и перемещаем наверх-->
<!--        if (palletsList.value[existingPalletIndex].status !== transaction.status) {-->
<!--          // Создаем копию паллеты с обновленным статусом-->
<!--          const updatedPallet = { ...palletsList.value[existingPalletIndex], status: transaction.status }-->

<!--          // Удаляем старую паллету-->
<!--          palletsList.value.splice(existingPalletIndex, 1)-->

<!--          // Добавляем обновленную паллету в начало списка-->
<!--          palletsList.value.unshift(updatedPallet)-->
<!--        }-->
<!--      } else if (!oldTransactionIds.has(transaction.id)) {-->
<!--        // Транзакция новая, создаем новую паллету-->
<!--        const newPallet = await createPalletFromTransaction(transaction)-->
<!--        if (newPallet) {-->
<!--          newPallet.transactionId = transaction.id-->

<!--          // Добавляем новую паллету в начало списка-->
<!--          palletsList.value.unshift(newPallet)-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}, { deep: true })-->

<!--// Отслеживаем обновления статусов существующих транзакций-->
<!--watch(() => [...transactionStore.allTransactionsList100], async (newTransactions) => {-->
<!--  // Проходим по всем транзакциям и обновляем статусы-->
<!--  for (const transaction of newTransactions) {-->
<!--    if (transaction.stage_progress?.stage_name === 'Создание паллеты') {-->
<!--      const existingPalletIndex = palletsList.value.findIndex(p => p.transactionId === transaction.id)-->

<!--      if (existingPalletIndex >= 0 && palletsList.value[existingPalletIndex].status !== transaction.status) {-->
<!--        // Обновляем статус и перемещаем наверх-->
<!--        const updatedPallet = { ...palletsList.value[existingPalletIndex], status: transaction.status }-->

<!--        // Удаляем паллету со старым статусом-->
<!--        palletsList.value.splice(existingPalletIndex, 1)-->

<!--        // Добавляем обновленную паллету в начало списка-->
<!--        palletsList.value.unshift(updatedPallet)-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}, { deep: true })-->

<!--// Инициализация компонента-->
<!--onMounted(async () => {-->
<!--  isLoading.value = true-->
<!--  try {-->
<!--    // Получаем типы паллет (для справочников)-->
<!--    await palletStore.GET_PALLET_TYPE_LIST()-->

<!--    // Загружаем последние транзакции и создаем из них паллеты-->
<!--    const transactions = transactionStore.allTransactionsList100-->

<!--    if (transactions && transactions.length > 0) {-->
<!--      // Сортируем транзакции по timestamp в обратном порядке (новые сверху)-->
<!--      const sortedTransactions = [...transactions].sort((a, b) =>-->
<!--          new Date(b.timestamp) - new Date(a.timestamp)-->
<!--      )-->

<!--      for (const transaction of sortedTransactions) {-->
<!--        if (transaction.stage_progress?.stage_name === 'Создание паллеты') {-->
<!--          const pallet = await createPalletFromTransaction(transaction)-->
<!--          if (pallet) {-->
<!--            pallet.transactionId = transaction.id-->
<!--            // Используем unshift вместо push, чтобы добавить в начало массива-->
<!--            palletsList.value.unshift(pallet)-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  } catch (error) {-->
<!--    console.error('Ошибка при загрузке данных:', error)-->
<!--  } finally {-->
<!--    isLoading.value = false-->
<!--  }-->
<!--})-->
<!--</script>-->

<!--<style scoped>-->
<!--.wms-packing-pallet {-->
<!--  display: grid;-->
<!--  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));-->
<!--  grid-template-rows: repeat(auto-fit, 365px);-->
<!--  gap: 1rem;-->
<!--}-->

<!--.pallet-item-content {-->
<!--  display: grid;-->
<!--  grid-template-columns: 1fr;-->
<!--  grid-template-rows: min-content auto min-content;-->
<!--  row-gap: .7rem;-->
<!--  border-radius: 1rem;-->
<!--  color: #2F2D2B;-->
<!--  background-color: #D9D9D9;-->
<!--  font-family: Helvetica, Arial, sans-serif;-->
<!--  padding: 1rem;-->
<!--}-->

<!--.pallet-item-row-one {-->
<!--  display: grid;-->
<!--  grid-template-columns: auto 1fr;-->
<!--  font-weight: bold;-->
<!--}-->
<!--.piro {-->
<!--  display: grid;-->
<!--  grid-template-columns: minmax(auto, 1fr);-->
<!--  grid-auto-rows: min-content;-->

<!--}-->
<!--.piro-id {-->
<!--  font-size: 1.7rem;-->
<!--}-->

<!--.piro-date {-->
<!--  justify-self: end;-->
<!--  font-size: 1.2rem;-->
<!--}-->

<!--.pallet-item-row-two {-->
<!--  display: grid;-->
<!--  grid-template-columns: auto 1fr;-->
<!--  overflow-y: auto;-->
<!--}-->

<!--.pirt-qr {-->
<!--  justify-self: end;-->
<!--  display: grid;-->
<!--  grid-template-columns: 150px;-->
<!--  grid-template-rows: 150px;-->
<!--}-->

<!--.pallet-item-row-three {-->
<!--  display: grid;-->
<!--  grid-template-columns: 1fr;-->
<!--}-->

<!--.pallet-qrcode {-->
<!--  grid-area: qrcode;-->
<!--  align-self: end;-->
<!--}-->

<!--.pallet-background.error,-->
<!--.pallet-status.error {-->
<!--  border: .7rem solid #e80f0f;-->
<!--  animation-name: blinking;-->
<!--  animation-duration: 1s;-->
<!--  animation-iteration-count: 50;-->
<!--}-->

<!--.pallet-background.pending,-->
<!--.pallet-status.pending {-->
<!--  border: .7rem solid #ecaf0e;-->
<!--}-->

<!--.pallet-background.finish,-->
<!--.pallet-status.finish {-->
<!--  border: .7rem solid #19da21;-->
<!--}-->

<!--@media (max-width: 800px) {-->
<!--  .wms-packing-pallet {-->
<!--    display: grid;-->
<!--    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));-->
<!--  }-->
<!--}-->

<!--@keyframes blinking {-->
<!--  50% {-->
<!--    border-color: #ecaf0e;-->
<!--  }-->
<!--}-->
<!--</style>-->

<!--3 вариант-->

<template>
  <div class="wms-packing-pallet">
    <div v-for="pallet in palletsList"
         :key="pallet.id"
         :class="['pallet-status', 'pallet-background', {
            'pending': isPending(pallet),
            'finish': isCompleted(pallet),
            'error': isDeleted(pallet),
            'blinking': pallet.isBlinking
         }]"
         class="pallet-item-content"
    >
      <div class="pallet-item-row-one">
        <div class="piro">
          <div class="piro-id">Паллета #{{ pallet.id }}</div>
          <div v-if="pallet.abc_class" class="piro-abc">Класс: {{ pallet.abc_class }}</div>
          <div v-if="pallet.length" class="piro-size">Габарит: {{ pallet.length }}мм</div>
          <div v-if="pallet.items" class="piro-qyt">Кол-во груза: {{ pallet.items.length }} шт </div>
          <div v-if="pallet.weight" class="piro-weight">Масса с грузом: {{ pallet.weight }} кг </div>
        </div>
        <div class="pirt-qr" v-html="pallet.qrCode"></div>
      </div>
      <div class="pallet-item-row-two">
        <div class="pirt-content">
          <div style="font-size: 1.75rem; font-weight: bold">{{ pallet.barcode || 'Ожидание данных...' }}</div>
          <div v-if="pallet.xyz_class">Зона: {{ pallet.current_zone }}, Класс XYZ: {{ pallet.xyz_class }}</div>
        </div>
      </div>
      <div class="pallet-item-row-three">
        <div class="piro-date">Создано: {{ formatDate(pallet.createdAt) }}</div>
        <div class="piro-status">Статус: {{ getStatusText(pallet.status) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTransactionStore } from "@/stores/WebSockets/transactionStore.js"
import { usePalletStore } from '@/stores/HTTP/PalletStore.js'
import { useTranslationsDictionary } from "@/composables/Dictionary/useTransactionsDictionary.js"
import QRCode from 'qrcode'

const transactionStore = useTransactionStore()
const palletStore = usePalletStore()
const translationsDictionary = useTranslationsDictionary

// Состояние компонента
const palletsList = ref([])
const isLoading = ref(false)

// Функция для форматирования даты
const formatDate = (date) => {
  const dateObj = new Date(date)
  return dateObj.toLocaleString('ru-RU')
}

// Статусы транзакций
const TRANSACTION_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED'
}

// Проверка статусов
const isPending = (pallet) => pallet.status === TRANSACTION_STATUS.PENDING
const isCompleted = (pallet) => pallet.status === TRANSACTION_STATUS.COMPLETED
const isDeleted = (pallet) => pallet.status === TRANSACTION_STATUS.CANCELED

// Получение текста статуса из словаря
const getStatusText = (status) => {
  return translationsDictionary[status] || status
}

// Создание QR-кода для паллеты
const generateQR = async (data) => {
  const opts = {
    errorCorrectionLevel: 'H',
    quality: 0.3,
    width: 150,
    margin: 1,
    color: {
      dark: "#000",
      light: "none"
    }
  }

  return new Promise((resolve, reject) => {
    QRCode.toString(data, opts, (err, string) => {
      if (err) reject(err)
      resolve(string)
    })
  })
}

// Создание новой паллеты из данных транзакции
const createPalletFromTransaction = async (transaction) => {
  if (!transaction.stage_progress?.stage_name?.includes('Создание паллеты') &&
      transaction.transaction_type !== 'ADD_PALLET') {
    return null
  }

  // ID паллеты из транзакции или из свойства pallet, если есть
  const palletId = transaction.pallet?.id || transaction.id

  // Создаем базовую структуру паллеты
  const palletData = {
    id: palletId,
    transactionId: transaction.id,
    status: transaction.status,
    createdAt: new Date(transaction.timestamp).toISOString(),
    isBlinking: false
  }

  // Если статус COMPLETED и есть полные данные паллеты
  if (transaction.status === TRANSACTION_STATUS.COMPLETED && transaction.pallet) {
    // Копируем все данные из transaction.pallet
    Object.assign(palletData, transaction.pallet)
  }

  // Генерируем QR-код с доступными данными
  const qrText = transaction.pallet?.barcode || `Паллета-${palletId}-${new Date().toISOString().slice(0, 10)}`
  palletData.qrCode = await generateQR(qrText)

  // Устанавливаем вес если его нет
  if (!palletData.weight && transaction.pallet?.items) {
    palletData.weight = transaction.pallet.items.reduce((sum, item) => sum + (item.weight || 0), 0)
  }

  return palletData
}

// Обработка статуса CANCELED - запуск анимации и удаление через 30 секунд
const handleDeletedStatus = (palletIndex) => {
  const pallet = palletsList.value[palletIndex]
  if (!pallet) return

  // Активируем мигание
  pallet.isBlinking = true

  // Устанавливаем таймер на удаление через 30 секунд
  setTimeout(() => {
    const currentIndex = palletsList.value.findIndex(p => p.id === pallet.id)
    if (currentIndex !== -1) {
      palletsList.value.splice(currentIndex, 1)
    }
  }, 30000) // 30 секунд
}

// Обновление паллеты на основе статуса транзакции
const updatePalletFromTransaction = async (transaction, existingPalletIndex) => {
  const pallet = palletsList.value[existingPalletIndex]

  // Если статус изменился
  if (pallet.status !== transaction.status) {
    // Обновляем статус
    pallet.status = transaction.status

    // Если статус COMPLETED и есть данные паллеты
    if (transaction.status === TRANSACTION_STATUS.COMPLETED && transaction.pallet) {
      // Обновляем все свойства из pallet
      Object.assign(pallet, transaction.pallet)

      // Обновляем QR-код если есть баркод
      if (transaction.pallet.barcode) {
        pallet.qrCode = await generateQR(transaction.pallet.barcode)
      }
    }

    // Если статус CANCELED
    if (transaction.status === TRANSACTION_STATUS.CANCELED) {
      handleDeletedStatus(existingPalletIndex)
    }

    return true
  }

  return false
}

// Отслеживаем изменения в транзакциях
watch(() => transactionStore.allTransactionsList100, async (newTransactions, oldTransactions) => {
  if (!newTransactions || newTransactions.length === 0) return

  for (const transaction of newTransactions) {
    // Проверяем, относится ли транзакция к созданию паллеты
    if ((transaction.stage_progress?.stage_name?.includes('Создание паллеты') ||
            transaction.transaction_type === 'ADD_PALLET') &&
        transaction.status) {

      // Ищем существующую паллету по ID транзакции
      const existingPalletIndex = palletsList.value.findIndex(p => p.transactionId === transaction.id)

      if (existingPalletIndex !== -1) {
        // Если паллета уже существует, обновляем её статус
        const wasUpdated = await updatePalletFromTransaction(transaction, existingPalletIndex)

        // Если были изменения и это не удаление
        if (wasUpdated && transaction.status !== TRANSACTION_STATUS.CANCELED) {
          // Удаляем и вставляем в начало списка для сортировки
          const updatedPallet = palletsList.value.splice(existingPalletIndex, 1)[0]
          palletsList.value.unshift(updatedPallet)
        }
      } else {
        // Если это новая транзакция, создаем новую паллету
        const newPallet = await createPalletFromTransaction(transaction)
        if (newPallet) {
          palletsList.value.unshift(newPallet)

          // Если статус CANCELED, запускаем обработку сразу
          if (transaction.status === TRANSACTION_STATUS.CANCELED) {
            handleDeletedStatus(0)
          }
        }
      }
    }
  }
}, { deep: true })

// Инициализация компонента
onMounted(async () => {
  isLoading.value = true
  try {
    // Получаем типы паллет
    await palletStore.GET_PALLET_TYPE_LIST()

    // Загружаем последние транзакции
    const transactions = transactionStore.allTransactionsList100

    if (transactions && transactions.length > 0) {
      // Сортируем транзакции по timestamp (новые сверху)
      const sortedTransactions = [...transactions].sort((a, b) =>
          new Date(b.timestamp) - new Date(a.timestamp)
      )

      // Обрабатываем только транзакции создания паллет
      for (const transaction of sortedTransactions) {
        if ((transaction.stage_progress?.stage_name?.includes('Создание паллеты') ||
                transaction.transaction_type === 'ADD_PALLET') &&
            transaction.status) {

          // Проверяем, не обработали ли мы уже эту транзакцию
          const existingPalletIndex = palletsList.value.findIndex(p => p.transactionId === transaction.id)

          if (existingPalletIndex === -1) {
            const pallet = await createPalletFromTransaction(transaction)
            if (pallet) {
              palletsList.value.unshift(pallet)

              // Если статус CANCELED, запускаем обработку
              if (transaction.status === TRANSACTION_STATUS.CANCELED) {
                handleDeletedStatus(0)
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.wms-packing-pallet {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-template-rows: repeat(auto-fit, 365px);
  gap: 1rem;
}

.pallet-item-content {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content auto min-content;
  row-gap: .7rem;
  border-radius: 1rem;
  color: #2F2D2B;
  background-color: #D9D9D9;
  font-family: Helvetica, Arial, sans-serif;
  padding: 1rem;
  transition: border-color 0.3s ease;
}

.pallet-item-row-one {
  display: grid;
  grid-template-columns: auto 1fr;
  font-weight: bold;
}

.piro {
  display: grid;
  grid-template-columns: minmax(auto, 1fr);
  grid-auto-rows: min-content;
}

.piro-id {
  font-size: 1.7rem;
}

.piro-date, .piro-status {
  font-size: 1.2rem;
}

.piro-status {
  justify-self: start;
}

.pallet-item-row-two {
  display: grid;
  grid-template-columns: auto 1fr;
  overflow-y: auto;
}

.pallet-item-row-three {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: space-between;
}

.pirt-qr {
  justify-self: end;
  display: grid;
  grid-template-columns: 150px;
  grid-template-rows: 150px;
}

/* Стили для статусов */
.pallet-status.pending,
.pallet-background.pending {
  border: .7rem solid #ecaf0e; /* Желтая рамка для PENDING */
}

.pallet-status.finish,
.pallet-background.finish {
  border: .7rem solid #19da21; /* Зеленая рамка для COMPLETED */
}

.pallet-status.error,
.pallet-background.error {
  border: .7rem solid #e80f0f; /* Красная рамка для CANCELED */
}

/* Стиль для мигания */
.pallet-status.blinking,
.pallet-background.blinking {
  animation-name: blinking;
  animation-duration: 1s;
  animation-iteration-count: 30; /* 30 раз за 30 секунд */
}

@keyframes blinking {
  0%, 100% {
    border-color: #e80f0f; /* Красный */
  }
  50% {
    border-color: #ecaf0e; /* Желтый */
  }
}

@media (max-width: 800px) {
  .wms-packing-pallet {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }

  .pallet-item-row-three {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    gap: 0.5rem;
  }
}
</style>