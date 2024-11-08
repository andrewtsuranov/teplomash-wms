import {useErrorStore} from "@/stores/Error/ErrorStore.js"
import {defineStore} from 'pinia'
import ky from "ky"
import {ref} from "vue"


const kyStd = ky.create({
    prefixUrl: 'http://lab/db7/hs/wms/products/',
    retry: {
        limit: 2,
        methods: ['get'],
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
                request.headers.set('Authorization', `Basic ${btoa(username.value +':'+password.value)}`)
                request.headers.set('Content-Type', 'application/json')
            }
        ],
        afterResponse: [
            (request,options,response) => {
                console.log('Статус ответа:', response.status)
                return response
            }
        ]
    }
})
export const useERPStore = defineStore('ERPStore', () => {
    const errorStore = useErrorStore()
//state
    const loading = ref(false)
    const productByDay = ref(JSON.parse(localStorage.getItem('productByDay')) || null)
//getters
//actions
    async function GET_PRODUCT_BY_DAY(startDate, endDate) {
        loading.value = true;
        errorStore.clearError();
        try {
            const response = await kyCors(`${startDate}/${endDate}/`)
                .json()
            productByDay.value = response
            localStorage.setItem('productByDay', JSON.stringify(response))
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
        productByDay,
//getters
//actions
        GET_PRODUCT_BY_DAY,
    }
})