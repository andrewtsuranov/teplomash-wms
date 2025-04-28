import {defineStore} from "pinia";
import {computed, reactive, ref} from "vue";
import {useUserStore} from "@/stores/HTTP/UserStore.js";

export const useTSDStore = defineStore("TSDStore", () => {
    // Store
    const userStore = useUserStore()
    //State
    const TSDList = ref(null);
    const onlineTSDList = ref([]);
    // const onlineTSDList = reactive([
    //     {
    //       id: 47,
    //       name: "TSD1-PAC-01"
    //     },
    //     {
    //       id: 75,
    //       name: "TSD2-PAC-01"
    //     },
    //     {
    //       id: 76,
    //       name: "TSD3-PAC-01"
    //     },
    //     {
    //       id: 77,
    //       name: "TSD4-PAC-01"
    //     },
    //     {
    //       id: 81,
    //       name: "TSD5-PAC-01"
    //     },
    //     {
    //       id: 79,
    //       name: "TSD6-PAC-01"
    //     }
    //   ]
    // );
    const selectedTSD = ref(JSON.parse(localStorage.getItem("selectedTsd")) || null)
    //Getters
    const getLoaderTSDList = computed(() => {
        return TSDList.value = userStore.fullListUsers.filter(device => device.role === "LOADER")
    })
    //Action
    const set_onlineTSDList = (data) => {
        onlineTSDList.value = data || [];
    };
    const set_selectedTSD = (tsdId) => {
        selectedTSD.value = tsdId;
        localStorage.setItem("selectedTsd", JSON.stringify(tsdId));
    };
    const clear_selectedTSD = () => {
        selectedTSD.value = null;
        localStorage.removeItem("selectedTsd");
    };
    return {
        //States
        TSDList,
        onlineTSDList,
        selectedTSD,
        //Getters
        getLoaderTSDList,
        //Actions
        set_onlineTSDList,
        set_selectedTSD,
        clear_selectedTSD
    };
});
