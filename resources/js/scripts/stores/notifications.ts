// notifications.ts
//handles spinner and snackbar
import { defineStore } from 'pinia'
import { ref } from 'vue'

type TSnackbar = {
    model: boolean,
    message: string,
    color: string,
    timeout: number,
}

type TSpinner = {
    model: boolean,
    message: string,
}

export const useNotificationsStore = defineStore('notifications', () => {
    const snackbar = ref<TSnackbar>({
        model: false,
        message: "",
        color: 'blue',
        timeout: 5000
    })

    const spinner = ref<TSpinner>({
        model: false,
        message: "",
    })

    function showSnackbar(message: string, color = 'blue', timeout = 5) {
        snackbar.value.message = message
        snackbar.value.color = color
        snackbar.value.timeout = timeout * 1000
        snackbar.value.model = true
    }
    //call with a message to show; call with false to hide
    function showSpinner(param: boolean | string) {
        spinner.value.model = !!param      
        if (param) {
            spinner.value.message = <string>param
        }
    }
    return { snackbar, spinner, showSnackbar, showSpinner }
})
