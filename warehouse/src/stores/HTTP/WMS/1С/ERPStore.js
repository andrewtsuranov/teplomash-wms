import {useErrorStore} from "@/stores/Error/ErrorStore.js"
import {defineStore} from 'pinia'
import {useUserStore} from "@/stores/HTTP/Auth/UserStore.js";
import ky from "ky"
import {ref} from "vue"
import {log} from "qrcode/lib/core/galois-field.js";

const userStore = useUserStore()
const kyStd = ky.create({
    prefixUrl: 'http://38.180.192.229/api/manager/',
    // prefixUrl: 'http://lab/db7/hs/wms/products/',
    retry: 0,
})
const kyCors = kyStd.extend({
    hooks: {
        beforeRequest: [
            request => {
                request.headers.set('Access-Control-Allow-Origin', '*');
            }
        ]
    }
})
export const useERPStore = defineStore('ERPStore', () => {
    const errorStore = useErrorStore()
    const dataYYYYMMDD = ref(new Date().toISOString().slice(0, 10));
    const loading = ref(false)

    function encodeBase64(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
    }


//state
    const productByDay = ref(JSON.parse(localStorage.getItem('productByDay')) || null)

//getters

//actions
    async function GET_PRODUCT_BY_DAY(startDate, endDate) {
        const username = ref('СимановА: ')
        const password = ref('')
        console.log( `Basic ${encodeBase64(username)}`)
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