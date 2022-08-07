// notifications.ts
//handles spinner and snackbar
import { defineStore } from 'pinia'
import { ref } from 'vue'

type TSnackbar = {
    turnOn: boolean,
    message: string,
    color: string,
    timeout: number,
}

type TSpinner = {
    isOn: boolean,
    message: string,
}

export const useNotificationsStore = defineStore('notifications', () => {
    let snackbar = ref<TSnackbar>({
        turnOn: false,
        message: "",
        color: 'blue',
        timeout: 4000
    })

    let spinner = ref<TSpinner>({
        isOn: false,
        message: "",
    })

    function showSnackbar(message: string, color = 'blue', timeout = 5000) {
        snackbar.value.color = color
        snackbar.value.message = message
        snackbar.value.turnOn = true
        setTimeout(() => {
            snackbar.value.turnOn = false
        }, timeout)
    }
    //call with a message to show; call with false to hide
    function showSpinner(param: false | string) {
        spinner.value.isOn = !(param === false)
        spinner.value.message = (param === false) ? '' : param
    }
    return { snackbar, spinner, showSnackbar, showSpinner }
})
