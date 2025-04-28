import wmsRoutes from "@/router/routes/wms.routes.js";
export default {
  path: "/",
  component: () => import("@/layouts/HomeLayout.vue"),
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: "",
      name: "Home",
      component: () => import("@/views/Home/HomeView.vue"),
      meta: {
        breadcrumb: {
          text: "Home",
          icon: "bi-house-door-fill",
          textOnly: false,
          iconSize: "lg", // sm, md, lg, xl, 2xl
          iconClass: "text-secondary",
          root: true,
        },
      },
      children: [
        wmsRoutes,
        {
          path: "profile",
          name: "Profile",
          component: () => import("@/views/Home/Profile/ProfileView.vue"),
          meta: {
            isPersonalPage: true,
            breadcrumb: "Профиль",
          },
        },
        {
          path: "info",
          name: "Info",
          component: () => import("@/views/Home/About/AboutView.vue"),
          meta: { breadcrumb: "О нас" },
        },
        {
          path: "support",
          name: "Support",
          component: () => import("@/views/Home/Support/SupportView.vue"),
          meta: { breadcrumb: "Поддержка" },
        },
      ],
    },
  ],
};

//{
//                     path: 'warehouses',
//                     name: 'WMS',
//                     component: () => import('@/views/Home/WMS/WarehousesView.vue'),
//                     meta: {
//                         breadcrumb: {
//                             text: 'Склады',
//                             textOnly: true,
//                         }
//                     },
//                     children: [
//                         {
//                             path: ':idWarehouse',
//                             name: 'WMSProcess',
//                             component: () => import('@/views/Home/WMS/Process/WarehouseProcess.vue'),
//                             meta: {
//                                 breadcrumb: {
//                                     text: 'Процессы',
//                                     textOnly: true,
//                                 }
//                             },
//                             children: [
//                                 {
//                                     path: 'packing',
//                                     name: 'wmsPackingZone',
//                                     component: () => import('@/views/Home/WMS/Process/ProcessZones.vue'),
//                                     props: {process: 'Упаковка', processRouteName: 'wmsPacking'},
//                                     meta: {
//                                         breadcrumb: {
//                                             text: 'Упаковка',
//                                             textOnly: true,
//                                         }
//                                     },
//                                     children: [
//                                         {
//                                             path: ':code',
//                                             name: 'wmsPacking',
//                                             component: () => import('@/views/Home/WMS/Process/PAC/StoragePackingView.vue'),
//                                             props: true,
//                                             meta: {
//                                                 breadcrumb: {
//                                                     text: 'Зона',
//                                                     textOnly: true,
//                                                 }
//                                             },
//                                             children: [
//                                                 {
//                                                     path: 'tsd-pac',
//                                                     name: 'TTM-packing',
//                                                     components: {
//                                                         default: () => import('@/components/TeplomashTaskManager/TTMTerminal/TTMTerminal.vue'),
//                                                     },
//                                                     meta: {
//                                                         breadcrumb: {
//                                                             text: 'ТСД',
//                                                             textOnly: true,
//                                                         }
//                                                     },
//                                                     props: true
//                                                 },
//                                             ]
//                                         },
//                                     ]
//                                 },
//                                 {
//                                     path: 'receiving',
//                                     name: 'wmsReceivingZone',
//                                     component: () => import('@/views/Home/WMS/Process/ProcessZones.vue'),
//                                     props: {process: 'Приёмка', processRouteName: 'wmsReceiving'},
//                                     meta: {
//                                         breadcrumb: {
//                                             text: 'Приёмка',
//                                             textOnly: true,
//                                         }
//                                     },
//                                 },
//                                 {
//                                     path: 'storage',
//                                     name: 'wmsStorageZone',
//                                     component: () => import('@/views/Home/WMS/Process/ProcessZones.vue'),
//                                     props: {process: 'Хранение', processRouteName: 'wmsStorage'},
//                                     meta: {
//                                         breadcrumb: {
//                                             text: 'Хранение',
//                                             textOnly: true,
//                                         }
//                                     },
//                                 },
//                                 {
//                                     path: 'shipping',
//                                     name: 'wmsShippingZone',
//                                     component: () => import('@/views/Home/WMS/Process/ProcessZones.vue'),
//                                     props: {process: 'Отгрузка', processRouteName: 'wmsShipping'},
//                                     meta: {
//                                         breadcrumb: {
//                                             text: 'Отгрузка',
//                                             textOnly: true,
//                                         }
//                                     },
//                                 },
//
//                                 {
//                                     path: 'receiving/:code',
//                                     name: 'wmsReceiving',
//                                     component: () => import('@/views/Home/WMS/Process/REC/StorageReceivingView.vue'),
//                                     children: [
//                                         {
//                                             path: 'rec-tsd',
//                                             name: 'TTM',
//                                             components: {
//                                                 default: () => import('@/components/TeplomashTaskManager/TTMTerminal/TTMTerminal.vue'),
//                                             },
//                                         },
//                                     ]
//                                 },
//                                 {
//                                     path: 'storage/:code',
//                                     name: 'wmsStorage',
//                                     component: () => import('@/views/Home/WMS/Process/STR/StorageView.vue'),
//                                 },
//                                 {
//                                     path: 'shipping/:code',
//                                     name: 'wmsShipping',
//                                     component: () => import('@/views/Home/WMS/Process/SHP/Data/StorageShippingView.vue'),
//                                 },
//                                 {
//                                     path: 'inventory',
//                                     name: 'wmsInventory',
//                                     component: () => import('@/views/Home/WMS/Process/Inventory/StorageInventoryView.vue'),
//                                     meta: {breadcrumb: 'Инвентаризация'}
//                                 },
//                                 {
//                                     path: 'reporting',
//                                     name: 'wmsReporting',
//                                     component: () => import('@/views/Home/WMS/Process/Reporting/StorageReportingView.vue'),
//                                     meta: {breadcrumb: 'Аналитика'}
//                                 },
//                             ]
//                         },
//                     ]
//                 },
