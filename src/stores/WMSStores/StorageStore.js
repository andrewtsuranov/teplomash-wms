import { defineStore } from "pinia";
import { computed, ref, watchEffect } from "vue";
import { formatCellNumber, parseCellNumber } from "@/composables/Utils/cellUtils";
import { useWarehouseStore } from "@/stores/WMSStores/WarehouseStore.js";

export const useStorageStore = defineStore("storageStore", () => {
  const warehouseStore = useWarehouseStore();
  // State
  const isLoading = ref(false);
  const error = ref(null);
  const racks = ref([]);
  const selectedRack = ref(null);
  const selectedPallet = ref(null);
  const storageLocations = ref(JSON.parse(localStorage.getItem("storageLocations")) || null);
  const storageLocationsMeta = ref(JSON.parse(localStorage.getItem("storageLocationsMeta")) || null);
  const searchResults = ref([]); // Добавляем searchResults
  const searchLoading = ref(false);
  const filters = ref({
    query: "",
    status: ""
  });
//getters
  const getZoneDimensions = computed(() => {
    const zoneData = warehouseStore.selectedZonesByZoneType?.id
      ? storageLocationsMeta?.value.statistics?.zone_dimensions?.[warehouseStore.selectedZonesByZoneType.id]
      : null;
    return zoneData ?
      { ...zoneData.dims, pallets_per_position: 4 } : []
  });
  const initializeRacks = () => {
    const warehouseNumber = warehouseStore.selectedWarehouse?.number ?? "default_warehouse";
    const zoneCode = warehouseStore.selectedZonesByZoneType?.code ?? "default_zone";
    const totalRows = getZoneDimensions.value;
    racks.value = Array(totalRows?.rows)
      .fill()
      .map((_, rowIndex) => ({
        id: formatCellNumber({
          row: rowIndex + 1,
          warehouse: warehouseNumber,
          zone: zoneCode
        }),
        cells: Array(totalRows?.positions)
          .fill()
          .map((_, cellIndex) => ({
            id: formatCellNumber({
              row: rowIndex + 1,
              cell: cellIndex + 1,
              warehouse: warehouseNumber,
              zone: zoneCode
            }),
            levels: Array(totalRows?.levels)
              .fill()
              .map((_, levelIndex) => ({
                id: formatCellNumber({
                  row: rowIndex + 1,
                  cell: cellIndex + 1,
                  level: levelIndex + 1,
                  warehouse: warehouseNumber,
                  zone: zoneCode
                }),
                pallets: Array(4)
                  .fill()
                  .map((_, palletIndex) => ({
                    id: `${formatCellNumber({
                      row: rowIndex + 1,
                      cell: cellIndex + 1,
                      level: levelIndex + 1,
                      warehouse: warehouseNumber,
                      zone: zoneCode
                    })}-P${palletIndex + 1}`,
                    occupied: false,
                    content: {
                      productId: null,
                      quantity: 0,
                      dateAdded: null,
                      weight: 0,
                      description: ""
                    }
                  }))
              }))
          }))
      }));
  };
  // Инициализируем racks сразу
  initializeRacks();
  // Следим за изменениями в WarehouseStore
  watchEffect(() => {
    if (
      warehouseStore.selectedWarehouse?.number &&
      warehouseStore.selectedZonesByZoneType?.code &&
      getZoneDimensions.value
    ) {
      initializeRacks();
    }
  });
  // Actions

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
            zone: warehouseStore.selectedZonesByZoneType?.code
          }
        })
        .json();
      // Обновляем данные с сервера, включая новые поля
      const rackIndex = racks.value.findIndex((r) => r.id === rackId);
      if (rackIndex !== -1) {
        // Мержим данные с сервера с существующей структурой
        racks.value[rackIndex] = mergeRackData(racks.value[rackIndex], response);
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };
  // Функция для мержинга данных стеллажа
  const mergeRackData = (existingRack, serverData) => {
    const mergedRack = { ...existingRack };

    // Обновляем данные паллет с сервера
    if (serverData.pallets && Array.isArray(serverData.pallets)) {
      serverData.pallets.forEach(palletData => {
        const { row, cell, level, pallet } = parsePalletLocation(palletData.location_code);

        if (mergedRack.cells[cell] &&
          mergedRack.cells[cell].levels[level] &&
          mergedRack.cells[cell].levels[level].pallets[pallet]) {

          // Обновляем данные паллета
          Object.assign(mergedRack.cells[cell].levels[level].pallets[pallet], {
            occupied: true,
            positions_map: palletData.positions_map,
            movement_time: palletData.movement_time,
            abc_class: palletData.abc_class,
            aisle: palletData.aisle,
            location_code: palletData.location_code,
            content: {
              productId: palletData.id || palletData.productId,
              ...mergedRack.cells[cell].levels[level].pallets[pallet].content,
              ...palletData.content
            }
          });
        }
      });
    }

    return mergedRack;
  };
  // Парсинг location_code для определения позиции паллета
  const parsePalletLocation = (locationCode) => {
    // Формат: 3.1.2.2.STR-01 (row.cell.level.pallet.zone)
    const parts = locationCode.split('.');
    return {
      row: parseInt(parts[0]) - 1,
      cell: parseInt(parts[1]) - 1,
      level: parseInt(parts[2]) - 1,
      pallet: parseInt(parts[3]) - 1
    };
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
            zone: warehouseStore.selectedZonesByZoneType?.code
          }
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
            zone: warehouseStore.selectedZonesByZoneType?.code
          }
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
  const setSelectedPallet = (palletInfo) => {
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
              zone: warehouseStore.selectedZonesByZoneType?.code
            }
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
  const setSelectedRack = (rack) => {
    selectedRack.value = selectedRack.value === rack ? null : rack;
  };
  const setStorageLocations = (payload) => {
    storageLocations.value = payload;
    localStorage.setItem("storageLocations", JSON.stringify(payload));
  };
  const setStorageLocationsMeta = (payload) => {
    storageLocationsMeta.value = payload;
    localStorage.setItem("storageLocationsMeta", JSON.stringify(payload));
  };
  return {
    // State
    selectedRack,
    selectedPallet,
    storageLocationsMeta,
    isLoading,
    error,
    storageLocations,
    racks,
    searchResults, // Добавляем в возвращаемый объект
    searchLoading, // Добавляем в возвращаемый объект
    filters, // Добавляем в возвращаемый объект
    // Getters
    getZoneDimensions,
    // Actions
    initializeRacks,
    findCellByNumber,
    fetchRackData,
    mergeRackData,
    parsePalletLocation,
    addPallet,
    removePallet,
    setSelectedPallet,
    searchPallets,
    searchProduct,
    updatePallet,
    setWarehouse,
    setZone,
    setSelectedRack,
    setStorageLocations,
    setStorageLocationsMeta
  };
});
