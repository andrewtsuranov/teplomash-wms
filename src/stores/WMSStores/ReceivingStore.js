import { useErrorStore } from "@/stores/Error/ErrorStore.js";
import { defineStore } from "pinia";
import { ref } from "vue";
import ky from "ky";
import { useUserStore } from "@/stores/WMSStores/UserStore.js";
import { requestUrls } from "@/stores/request-urls.js";


export const useReceivingStore = defineStore("receivingStore", () => {
    const userStore = useUserStore();
    const kyStd = ky.create({
        prefixUrl: requestUrls.storage,
        retry: 0,
        headers: {
            Authorization: `Bearer ${userStore.getTokenAccess}`,
        },
    });
    const loading = ref(false);
    const errorStore = useErrorStore();

    //state


    //getters
    //actions

    return {
        //state
        errorStore,
        loading,

        //getters
        //actions

    };
});
