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

<template>
  <div class="wms-packing-pallet">
    <div v-for="pallet in palletsList"
         :key="pallet.id"
         :class="['pallet-status', 'pallet-background', {
            'pending': pallet.status === 'IN_PROGRESS',
            'finish': pallet.status === 'COMPLETED',
            'error': pallet.status === 'DELETED'
         }]"
         class="pallet-item-content"
    >
      <div class="pallet-item-row-one">
        <div class="piro">
          <div class="piro-id">Паллета ID: {{ pallet.id }}</div>
          <div class="piro-abc">Класс: {{ pallet.class }}</div>
          <div class="piro-size">Габарит: {{ pallet.dimensions }}</div>
          <div class="piro-qyt">Кол-во груза: {{ pallet.itemCount }} шт </div>
          <div class="piro-weight">Масса с грузом: {{ pallet.weight }} кг </div>
        </div>
        <div class="pirt-qr" v-html="pallet.qrCode"></div>
      </div>
      <div class="pallet-item-row-two">
        <div class="pirt-content">
          <div style="font-size: 1.75rem; font-weight: bold">{{ pallet.description }}</div>
          <div>{{ pallet.additionalInfo }}</div>
        </div>
      </div>
      <div class="pallet-item-row-three">
        <div class="piro-date">Создано: {{ formatDate(pallet.createdAt) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTransactionStore } from "@/stores/WebSockets/transactionStore.js"
import { usePalletStore } from '@/stores/HTTP/PalletStore.js'
import QRCode from 'qrcode'

const transactionStore = useTransactionStore()
const palletStore = usePalletStore()

// Состояние компонента
const palletsList = ref([])
const isLoading = ref(false)

// Функция для форматирования даты
const formatDate = (date) => {
  const dateObj = new Date(date)
  return dateObj.toLocaleString('ru-RU')
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
  if (transaction.stage_progress.stage_name !== 'Создание паллеты') return null

  // Создаем данные для новой паллеты
  const palletData = {
    id: Math.floor(Math.random() * 1000000000), // В реальном приложении ID должен приходить с сервера
    class: 'А',
    dimensions: '1200х1200х145 (мм)',
    itemCount: 9,
    weight: 200,
    description: `КЭВ-9П2021Е Панель из глянцевой нержавеющей стали [${new Date().toISOString().slice(0, 10)}]`,
    additionalInfo: 'Content',
    createdAt: new Date().toISOString(),
    status: transaction.status
  }

  // Генерируем QR-код
  const qrText = `А-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-П-1200-[${palletData.description}]-${palletData.itemCount}`
  palletData.qrCode = await generateQR(qrText)

  return palletData
}

// Отслеживаем изменения в транзакциях
watch(() => transactionStore.allTransactionsList100, async (newTransactions, oldTransactions) => {
  if (!newTransactions || newTransactions.length === 0) return

  // Находим новые транзакции, которых не было в предыдущем списке
  const newTransactionIds = new Set(newTransactions.map(t => t.id))
  const oldTransactionIds = new Set(oldTransactions?.map(t => t.id) || [])

  // Проходим по всем транзакциям
  for (const transaction of newTransactions) {
    // Проверяем, является ли транзакция новой или её статус изменился
    if (transaction.stage_progress?.stage_name === 'Создание паллеты') {
      // Находим индекс существующей паллеты
      const existingPalletIndex = palletsList.value.findIndex(p => p.transactionId === transaction.id)

      if (existingPalletIndex >= 0) {
        // Если статус изменился, обновляем и перемещаем наверх
        if (palletsList.value[existingPalletIndex].status !== transaction.status) {
          // Создаем копию паллеты с обновленным статусом
          const updatedPallet = { ...palletsList.value[existingPalletIndex], status: transaction.status }

          // Удаляем старую паллету
          palletsList.value.splice(existingPalletIndex, 1)

          // Добавляем обновленную паллету в начало списка
          palletsList.value.unshift(updatedPallet)
        }
      } else if (!oldTransactionIds.has(transaction.id)) {
        // Транзакция новая, создаем новую паллету
        const newPallet = await createPalletFromTransaction(transaction)
        if (newPallet) {
          newPallet.transactionId = transaction.id

          // Добавляем новую паллету в начало списка
          palletsList.value.unshift(newPallet)
        }
      }
    }
  }
}, { deep: true })

// Отслеживаем обновления статусов существующих транзакций
watch(() => [...transactionStore.allTransactionsList100], async (newTransactions) => {
  // Проходим по всем транзакциям и обновляем статусы
  for (const transaction of newTransactions) {
    if (transaction.stage_progress?.stage_name === 'Создание паллеты') {
      const existingPalletIndex = palletsList.value.findIndex(p => p.transactionId === transaction.id)

      if (existingPalletIndex >= 0 && palletsList.value[existingPalletIndex].status !== transaction.status) {
        // Обновляем статус и перемещаем наверх
        const updatedPallet = { ...palletsList.value[existingPalletIndex], status: transaction.status }

        // Удаляем паллету со старым статусом
        palletsList.value.splice(existingPalletIndex, 1)

        // Добавляем обновленную паллету в начало списка
        palletsList.value.unshift(updatedPallet)
      }
    }
  }
}, { deep: true })

// Инициализация компонента
onMounted(async () => {
  isLoading.value = true
  try {
    // Получаем типы паллет (для справочников)
    await palletStore.GET_PALLET_TYPE_LIST()

    // Загружаем последние транзакции и создаем из них паллеты
    const transactions = transactionStore.allTransactionsList100

    if (transactions && transactions.length > 0) {
      // Сортируем транзакции по timestamp в обратном порядке (новые сверху)
      const sortedTransactions = [...transactions].sort((a, b) =>
          new Date(b.timestamp) - new Date(a.timestamp)
      )

      for (const transaction of sortedTransactions) {
        if (transaction.stage_progress?.stage_name === 'Создание паллеты') {
          const pallet = await createPalletFromTransaction(transaction)
          if (pallet) {
            pallet.transactionId = transaction.id
            // Используем unshift вместо push, чтобы добавить в начало массива
            palletsList.value.unshift(pallet)
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

.piro-date {
  justify-self: end;
  font-size: 1.2rem;
}

.pallet-item-row-two {
  display: grid;
  grid-template-columns: auto 1fr;
  overflow-y: auto;
}

.pirt-qr {
  justify-self: end;
  display: grid;
  grid-template-columns: 150px;
  grid-template-rows: 150px;
}

.pallet-item-row-three {
  display: grid;
  grid-template-columns: 1fr;
}

.pallet-qrcode {
  grid-area: qrcode;
  align-self: end;
}

.pallet-background.error,
.pallet-status.error {
  border: .7rem solid #e80f0f;
  animation-name: blinking;
  animation-duration: 1s;
  animation-iteration-count: 50;
}

.pallet-background.pending,
.pallet-status.pending {
  border: .7rem solid #ecaf0e;
}

.pallet-background.finish,
.pallet-status.finish {
  border: .7rem solid #19da21;
}

@media (max-width: 800px) {
  .wms-packing-pallet {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
}

@keyframes blinking {
  50% {
    border-color: #ecaf0e;
  }
}
</style>