import {defineStore} from "pinia";
import {useErrorStore} from "@/stores/Error/ErrorStore.js";
import {computed, ref} from "vue";
import {useUserStore} from "@/stores/HTTP/UserStore.js";

export const useTSDStore = defineStore('TSDStore', () => {
    const errorStore = useErrorStore()
    const userStore = useUserStore()
    // Store
    const TSDList = ref(null)
    const onlineTSDList = ref(null)
    const selectedTSD = ref(JSON.parse(localStorage.getItem('selectedTsd')) || null)
    //Getters
    const getTSDList = computed(() => {
        if (!userStore.fullListUsers) return 'Список пуст'
        TSDList.value = userStore.fullListUsers.filter(item => item.role === 'LOADER')
        return true
    })
    //Action
    const set_onlineTSDList = (data) => {
        onlineTSDList.value = data
    }
    const set_selectedTSD = (tsdId) => {
        selectedTSD.value = tsdId
        localStorage.setItem('selectedTsd', JSON.stringify(tsdId))
    }
    const clear_selectedTSD = () => {
        selectedTSD.value = null
        localStorage.removeItem('selectedTsd')
    }
    return {
        //States
        TSDList,
        onlineTSDList,
        selectedTSD,
        //Getters
        getTSDList,
        //Actions
        set_onlineTSDList,
        set_selectedTSD,
        clear_selectedTSD
    }
})