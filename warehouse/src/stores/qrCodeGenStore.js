import {defineStore} from 'pinia'
import ky from "ky";

export const useQrCodeGenStore = defineStore('qrCodeGenStore', {
    state: () => ({
        qrcode: 'http://api.qrserver.com/v1/create-qr-code/?data=Andrkdlfafhksfsf.fsfasfasfewTsuranov&size=300x300&format=svg'
    }),
    getters: {},
    actions: {
        async REQ_QRCODE() {
            this.loading = true;
            this.error = null;
            try {
                const response = await ky('', {prefixUrl: 'http://api.qrserver.com/v1/create-qr-code/?data=HelloWorld!&size=100x100'})
                console.log(response)
                return response;
            } catch (err) {
                this.error = err.message
                throw err;
            } finally {
                this.loading = false
            }
        },
    }
})


