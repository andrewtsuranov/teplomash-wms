import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {parseCellNumber, formatCellNumber} from "@/composables/Utils/cellUtils";
import {useWarehouseStore} from "@/stores/WMSStores/WarehouseStore.js";



export const useStorageStore = defineStore("storageStore", () => {
const warehouseStore = useWarehouseStore()
  // State
const storageLocations = ref(JSON.parse(localStorage.getItem("storageLocations")) || null);
const storageLocationsMeta = ref(JSON.parse(localStorage.getItem("storageLocationsMeta")) || null);
  const selectedRack = ref(null);
  const selectedPallet = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const searchResults = ref([]); // Добавляем searchResults
  const searchLoading = ref(false);
  const filters = ref({
    query: "",
    status: "",
  });
//getters
  const getTotalStorageRowsByZone = computed(() => {
    const zoneData = storageLocationsMeta.value.statistics.zone_dimensions[warehouseStore.selectedZonesByZoneType.id];
    const totalItems = zoneData.dimensions.total_items || 0;
    const levels = zoneData.dimensions.levels || 1; // Используем 1 как значение по умолчанию, чтобы избежать деления на 0
    const positions = zoneData.dimensions.positions || 1; // Используем 1 как значение по умолчанию

    return totalItems / (levels * positions);
  });
  // Инициализация с учетом формата номеров ячеек
  const racks = ref(
    Array(32)
      .fill()
      .map((_, rowIndex) => ({
        id: rowIndex + 1,
        cells: Array(11)
          .fill()
          .map((_, cellIndex) => ({
            id: formatCellNumber({
              row: rowIndex + 1,
              cell: cellIndex + 1,
              level: 1,
              warehouse: warehouseStore.selectedWarehouse?.number,
              zone: warehouseStore.selectedZonesByZoneType?.code,
            }),
            levels: Array(7)
              .fill()
              .map((_, levelIndex) => ({
                id: formatCellNumber({
                  row: rowIndex + 1,
                  cell: cellIndex + 1,
                  level: levelIndex + 1,
                  warehouse: warehouseStore.selectedWarehouse?.numberselectedWarehouseselectedWarehouse,
                  zone: warehouseStore.selectedZonesByZoneTypeselectedZoneByZoneType,
                }),
                pallets: Array(4)
                  .fill()
                  .map((_, palletIndex) => ({
                    id: `${formatCellNumber({
                      row: rowIndex + 1,
                      cell: cellIndex + 1,
                      level: levelIndex + 1,
                      warehouse: warehouseStore.selectedWarehouse?.number,
                      zone: warehouseStore.selectedZonesByZoneType?.code,
                    })}-P${palletIndex + 1}`,
                    occupied: Math.random() > 0.5,
                    content: {
                      productId: null,
                      quantity: 0,
                      dateAdded: null,
                      weight: 0,
                      description: "",
                    },
                  })),
              })),
          })),
      })),
  );
  // Getters
  const currentRack = computed(() => {
    return racks.value.find((rack) => rack.id === selectedRack.value);
  });
  // Actions
  const selectRack = (rackId) => {
    selectedRack.value = selectedRack.value === rackId ? null : rackId;
  };
  const findCellByNumber = (cellNumber) => {
    const { row, cell, level } = parseCellNumber(cellNumber);
    const rack = racks.value[row - 1];
    if (!rack) return null;
    const cellObj = rack.cells[cell - 1];
    if (!cellObj) return null;
    const levelObj = cellObj.levels[level - 1];
    if (!levelObj) return null;
    return levelObj;
  };
  const fetchRackData = async (rackId) => {
    try {
      isLoading.value = true;
      const response = await api
        .get(`racks/${rackId}`, {
          searchParams: {
            warehouse: warehouseStore.selectedWarehouse?.number,
            zone: warehouseStore.selectedZonesByZoneType?.code,
          },
        })
        .json();
      // Обновляем данные с сервера
      const rackIndex = racks.value.findIndex((r) => r.id === rackId);
      if (rackIndex !== -1) {
        racks.value[rackIndex] = response;
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };
  const addPallet = async (cellNumber, palletData) => {
    try {
      isLoading.value = true;
      const { row } = parseCellNumber(cellNumber);
      const response = await api
        .post("pallets", {
          json: {
            cellNumber,
            ...palletData,
            warehouse: warehouseStore.selectedWarehouse?.number,
            zone: warehouseStore.selectedZonesByZoneType?.code,
          },
        })
        .json();
      await fetchRackData(row);
      return response;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  const removePallet = async (palletId, cellNumber) => {
    try {
      isLoading.value = true;
      const { row } = parseCellNumber(cellNumber);
      await api.delete(`pallets/${palletId}`).json();
      await fetchRackData(row);
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  const searchProduct = async (productId) => {
    try {
      isLoading.value = true;
      const response = await api.get(`products/${productId}`).json();
      return response;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  const updatePallet = async (palletData) => {
    const { rackId, cell, level, palletNumber, ...data } = palletData;
    const cellNumber = `${rackId}.${cell}.${level}.${warehouseStore.selectedWarehouse.number}.${warehouseStore.selectedZonesByZoneType.code}`;
    try {
      isLoading.value = true;
      await api
        .put(`pallets/${cellNumber}/${palletNumber}`, {
          json: {
            ...data,
            warehouse: warehouseStore.selectedWarehouse?.number,
            zone: warehouseStore.selectedZonesByZoneType?.code,
          },
        })
        .json();
      // Обновляем данные в store
      await fetchRackData(rackId);
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  const selectPallet = (palletInfo) => {
    selectedPallet.value = palletInfo;
  };
  const setWarehouse = (warehouse) => {
    warehouseStore.selectedWarehouse.number = warehouse;
  };
  const setZone = (zone) => {
    warehouseStore.selectedZonesByZoneType.code = zone;
  };
  const searchPallets = async ({ query, status }) => {
    try {
      searchLoading.value = true;
      filters.value = { query, status };
      if (query) {
        const response = await api
          .get("pallets/search", {
            searchParams: {
              query,
              status,
              warehouse: warehouseStore.selectedWarehouse?.number,
              zone: warehouseStore.selectedZonesByZoneType?.code,
            },
          })
          .json();
        searchResults.value = response;
      } else {
        searchResults.value = [];
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      searchLoading.value = false;
    }
  };
  const setStorageLocations = (payload) => {
    storageLocations.value = payload
    localStorage.setItem("storageLocations", JSON.stringify(payload));

  }
  const setStorageLocationsMeta = (payload) => {
    storageLocationsMeta.value = payload
    localStorage.setItem("storageLocationsMeta", JSON.stringify(payload));
  }
  return {
    // State
    selectedRack,
    selectedPallet,
    isLoading,
    error,
    storageLocations,
    racks,
    searchResults, // Добавляем в возвращаемый объект
    searchLoading, // Добавляем в возвращаемый объект
    filters, // Добавляем в возвращаемый объект
    // Getters
    currentRack,
    storageLocationsMeta,
    getTotalStorageRowsByZone,
    // Actions
    selectRack,
    findCellByNumber,
    fetchRackData,
    addPallet,
    removePallet,
    selectPallet,
    setWarehouse,
    setZone,
    searchPallets,
    searchProduct,
    updatePallet,
    setStorageLocations,
    setStorageLocationsMeta,
  };
});
