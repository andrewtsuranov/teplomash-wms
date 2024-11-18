import {useErrorStore} from "@/stores/Error/ErrorStore.js"
import {defineStore} from 'pinia'
import ky from "ky"
import {ref} from "vue"
import {useWebSocketStore} from "@/stores/WebSockets/WebSocketStore.js";

const kyStd = ky.create({
    prefixUrl: 'http://lab/db7/hs/wms/',
    retry: {
        limit: 2,
        methods: ['post'],
        statusCodes: [408, 500, 502, 503, 504],
    },
    timeout: 30000,
})
const kyCors = kyStd.extend({
    hooks: {
        beforeRequest: [
            (request) => {
                const username = ref('sklad')
                const password = ref('sklad')
                request.headers.set('Authorization', `Basic ${btoa(username.value + ':' + password.value)}`)
                request.headers.set('Content-Type', 'application/json')
            }
        ],
        afterResponse: [
            (request, options, response) => {
                console.log('Статус ответа:', response.status)
                return response
            }
        ]
    }
})
export const useERPStore = defineStore('ERPStore', () => {
    const errorStore = useErrorStore()
    const webSocketStore = useWebSocketStore()
//-------------------------------state---------------------------------
    const loading = ref(false)
//------------------------------getters-------------------------------
//-------------------------------actions---------------------------------
    const GET_PRODUCT_BY_DAY = async (startDate, endDate) => {
        webSocketStore.getUnregisteredItems()
        // loading.value = true;
        // errorStore.clearError();
        // try {
        //     const response = await kyCors.post('products/', {
        //         json: {
        //             "DateFrom": startDate,
        //             "DateTo": endDate
        //         }
        //     }).json()
        //     webSocketStore.createItemsBulk(response)
        //     return true
        // } catch (err) {
        //     console.log(err)
        //     throw err
        // } finally {
        //     loading.value = false
        // }
    }
    const updateProductsData = async () => {
        loading.value = true;
        errorStore.clearError();
        try {
            await webSocketStore.getProductTypes()
            const names = webSocketStore.productTypes.map(obj => obj.name)
            const response = await kyCors.post('product/detail', {
                json: names
            }).json()
            console.log(response)
            const collectData = webSocketStore.productTypes.map(item => {
                const secondItem = response.find(secItem => secItem.name === item.name)


                return {
                    id: item.id,
                    product: item.product,
                    max_weight: secondItem.weight_gross,
                    length: secondItem.L,
                    width: secondItem.W,
                    height: secondItem.H
                }
            })
            console.log(collectData)
            await webSocketStore.updateProductTypes(collectData)
            return true
        } catch (err) {
            console.log(err)
            throw err
        } finally {
            loading.value = false
        }
    }
    return {
//state
        errorStore,
        loading,
//getters
//actions
        GET_PRODUCT_BY_DAY,
        updateProductsData
    }
})