// notifications.ts
//handles spinner and snackbar
import { defineStore } from 'pinia'

interface Snackbar {
    turnOn: boolean,
    message: string,
    color: string,
    timeout: number,
}

interface Spinner {
    isOn: boolean,
    message: string,
}
export const useNotificationsStore = defineStore('notifications', {

    state: () => {
        return {
            sb_turnOn: false,
            sb_message: "Hello from notifications.ts",
            sb_color: 'blue',
            sb_timeout: 4000,
            sp_isOn: false,
            sp_message: "",
        }
    },
    getters: {
        //sar: (state) => state.snackbar,
        snackbar(): Snackbar { return { turnOn: this.sb_turnOn, message: this.sb_message, color: this.sb_color, timeout: this.sb_timeout } },
        spinner(): Spinner { return { isOn: this.sp_isOn, message: this.sp_message } }
    },

    actions: {
        showSnackbar(message: string, color = 'blue', timeout = 5000) {
            this.$state.sb_color = color
            this.$state.sb_message = message
            this.$state.sb_turnOn = true
            setTimeout(() => {
                this.$state.sb_turnOn = false
            }, timeout)
        },
        //call with a message to show; call without params to turn off
        showSpinner(message?: string) {
            this.$state.sp_isOn = (typeof message !== 'undefined')
            this.$state.sp_message =  (typeof message !== 'undefined') ? message : ""
        },
    },
})
