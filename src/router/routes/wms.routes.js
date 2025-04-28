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
                    path: ':zone_type/:code?',
                    name: 'wmsPackingZone',
                    components: {
                        default: () => import('@/views/Home/WMS/Process/ProcessZones.vue'),
                        packing: () => import("@/views/Home/WMS/Process/PAC/StoragePackingView.vue")
                    },
                    props: {
                        default: {process: 'Упаковка', processRouteName: 'wmsPackingZone'},
                        packing: true, // Передача параметров маршрута (:code) в StoragePackingView
                    },
                    meta: {
                        breadcrumb: {
                            text: (route) => (route.params.code ? 'Зоны упаковки' : 'Упаковка'),
                            textOnly: true,
                        },
                    },
                },
                {
                    path: ':zone_type/:code?',
                    name: 'wmsReceivingZone',
                    components: {
                        default: () => import('@/views/Home/WMS/Process/ProcessZones.vue'),
                        receiving: () => import('@/views/Home/WMS/Process/REC/StorageReceivingView.vue'),
                    },
                    props: {
                        default: {process: 'Приёмка', processRouteName: 'wmsReceivingZone'},
                        receiving: true, // Передача параметров маршрута (:code)
                    },
                    meta: {
                        breadcrumb: {
                            text: (route) => (route.params.code ? 'Зоны приёмки' : 'Приёмка'),
                            textOnly: true,
                        },
                    },
                },
                {
                    path: ':zone_type/:code?',
                    name: 'wmsStorageZone',
                    components: {
                        default: () => import('@/views/Home/WMS/Process/ProcessZones.vue'),
                        storage: () => import('@/views/Home/WMS/Process/STR/StorageView.vue'),
                    },
                    props: {
                        default: {process: 'Хранение', processRouteName: 'wmsStorageZone'},
                        storage: true, // Передача параметров маршрута (:code)
                    },
                    meta: {
                        breadcrumb: {
                            text: (route) => (route.params.code ? 'Зоны хранения' : 'Хранение'),
                            textOnly: true,
                        },
                    },
                },
                {
                    path: ':zone_type/:code?',
                    name: 'wmsShippingZone',
                    components: {
                        default: () => import('@/views/Home/WMS/Process/ProcessZones.vue'),
                        shipping: () => import('@/views/Home/WMS/Process/SHP/StorageShippingView.vue'),
                    },
                    props: {
                        default: {process: 'Отгрузка', processRouteName: 'wmsShippingZone'},
                        shipping: true, // Передача параметров маршрута (:code)
                    },
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
