import { createProcessZoneRoute } from "@/router/utils/routeGenerators";

// Специализированные маршруты
// const specialRoutes = [
//   {
//     path: 'inventory',
//     name: 'wmsInventory',
//     component: () => import('@/views/Home/WMS/Process/Inventory/StorageInventoryView.vue'),
//     meta: { breadcrumb: 'Инвентаризация' }
//   },
//   {
//     path: 'reporting',
//     name: 'wmsReporting',
//     component: () => import('@/views/Home/WMS/Process/Reporting/StorageReportingView.vue'),
//     meta: { breadcrumb: 'Аналитика' }
//   }
// ]

// Маршруты для процессов по шаблону
const processRoutes = [
  createProcessZoneRoute(
    "Упаковка",
    "Packing",
    "/src/views/Home/WMS/Process/PAC/StoragePackingView.vue",
  ),
  createProcessZoneRoute(
    "Приёмка",
    "Receiving",
    "/src/views/Home/WMS/Process/REC/StorageReceivingView.vue",
  ),
  createProcessZoneRoute(
    "Хранение",
    "Storage",
    "/src/views/Home/WMS/Process/STR/StorageView.vue",
  ),
  createProcessZoneRoute(
    "Отгрузка",
    "Shipping",
    "/src/views/Home/WMS/Process/SHP/StorageShippingView.vue",
  ),
];

export default {
  path: "warehouses",
  name: "WMS",
  component: () => import("@/views/Home/WMS/WarehousesView.vue"),
  meta: {
    breadcrumb: {
      text: "Склады",
      textOnly: true,
    },
  },
  children: [
    {
      path: ":idWarehouse",
      name: "WMSProcess",
      component: () => import("@/views/Home/WMS/Process/WarehouseProcess.vue"),
      meta: {
        breadcrumb: {
          text: "Процессы",
          textOnly: true,
        },
      },
      children: [
        ...processRoutes,
        // Дополнительные подмаршруты для TSD и т.д.
        // {
        //     path: 'packing/:code/tsd-pac',
        //     name: 'TTM-packing',
        //     component: () => import('@/components/TeplomashTaskManager/Terminal/TTMTerminal.vue'),
        //     meta: {
        //         breadcrumb: {
        //             text: 'ТСД',
        //             textOnly: true,
        //         }
        //     },
        //     props: true
        // },
        // {
        //     path: ':code',
        //     name: 'TTM',
        //     component: () => import('@/components/TeplomashTaskManager/Terminal/TTMTerminal.vue'),
        // }
      ],
    },
  ],
};
