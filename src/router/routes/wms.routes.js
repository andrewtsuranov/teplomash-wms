import {useReverseTransliterate} from "@/composables/Validations/useReverseTransliterate.js";

export default {
    path: "warehouses",
    name: "WMS",
    component: () => import("@/views/Home/WMS/WarehousesView.vue"),
    meta: {
        breadcrumb: {
            text: "Склады",
            textOnly: true
        }
    },
    children: [
        {
            path: ":idWarehouse",
            name: "WMSProcess",
            component: () => import("@/views/Home/WMS/Process/WarehouseProcess.vue"),
            meta: {
                breadcrumb: {
                    text: (route) => useReverseTransliterate(route.params.idWarehouse).toUpperCase(),
                    textOnly: true
                }
            },
            children: [

                {
                    path: 'packing/:code?',
                    name: 'wmsPackingZone',
                    components: {
                        default: () => import('@/views/Home/WMS/Process/ProcessZones.vue'),
                        packing: () => import("@/views/Home/WMS/Process/PAC/StoragePackingView.vue")
                    },
                    props: {packing: true},
                    meta: {
                        breadcrumb: {
                            text: (route) => (route.params.code ? 'Зоны упаковки' : 'Упаковка'),
                            textOnly: true,
                        },
                    },
                },
                {
                    path: 'receiving/:code?',
                    name: 'wmsReceivingZone',
                    components: {
                        default: () => import('@/views/Home/WMS/Process/ProcessZones.vue'),
                        receiving: () => import('@/views/Home/WMS/Process/REC/StorageReceivingView.vue'),
                    },
                    props: {receiving: true},
                    meta: {
                        breadcrumb: {
                            text: (route) => (route.params.code ? 'Зоны приёмки' : 'Приёмка'),
                            textOnly: true,
                        },
                    },
                },
                {
                    path: 'storage/:code?',
                    name: 'wmsStorageZone',
                    components: {
                        default: () => import('@/views/Home/WMS/Process/ProcessZones.vue'),
                        storage: () => import('@/views/Home/WMS/Process/STR/StorageView.vue'),
                    },
                    props: {storage: true},
                    meta: {
                        breadcrumb: {
                            text: (route) => (route.params.code ? 'Зоны хранения' : 'Хранение'),
                            textOnly: true,
                        },
                    },
                },
                {
                    path: 'shipping/:code?',
                    name: 'wmsShippingZone',
                    components: {
                        default: () => import('@/views/Home/WMS/Process/ProcessZones.vue'),
                        shipping: () => import('@/views/Home/WMS/Process/SHP/StorageShippingView.vue'),
                    },
                    props: {shipping: true},
                    meta: {
                        breadcrumb: {
                            text: (route) => (route.params.code ? 'Зоны отгрузки' : 'Отгрузка'),
                            textOnly: true,
                        },
                    },
                },
            ]
        },
    ]

};
