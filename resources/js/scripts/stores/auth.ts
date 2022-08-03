// auth.js
//handles and stores user's login and capabilities
import { defineStore } from 'pinia'
import { useXhrStore } from './xhr';
import axios from 'axios';
import { useNotificationsStore } from './notifications';
import { router } from '../setups/vue-router'

interface LoginForm {
  email: string,
  password: string
}

interface User {
  'name': string,
  'id': number,
  'token': string,
  'permissions': string[]
}

type Nullable<T> = T | null;

export const useAuthStore = defineStore('auth', {

  state: () => {
    return {
      form: { email: "", password: "" } as LoginForm,
      user: null as Nullable<User>,
    }
  },
  getters: {
    authenticated: (state) => state.user !== null,
  },

  actions: {
    async authenticate(r: any) {
      let xhr = useXhrStore();
      let notifications = useNotificationsStore()

      //clear user
      axios.defaults.headers.common["Authorization"] = ``
      this.$state.user = null

      console.log(`auth.authenticate() form: ${JSON.stringify(this.$state.form, null, 2)}`)
      notifications.showSpinner('Logging in ...')

      xhr.send('auth/login', 'post', this.$state.form)
        .then(res => {
          //console.log(`auth.response is ${JSON.stringify(res, null, 2)}`)
          if (res.data.user !== null) {
            this.$state.user = res.data.user
            axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.user.token}`
            notifications.showSnackbar('Successfully logged-in; redirected to previous page')
            router.push({ name: 'Home' })
            router.go(-1)
          } else {
            notifications.showSnackbar(`Login failed. Error: ${res.data.message}. Please try again!`)
          }
        })
        .catch(err => {
          notifications.showSnackbar(`Login attempt failed. Error logged to console. Please try again later`)
          console.log(`auth.error is ${JSON.stringify(err, null, 2)}`)
        })
        .finally(() => {
          notifications.showSpinner()
        })
    },

    async logout() {
      console.log("auth.logout")
      let xhr = useXhrStore();
      let notifications = useNotificationsStore()
      notifications.showSpinner('Logging out ...')
      xhr.send('auth/logout',  'post')
        .then(res => {
          notifications.showSnackbar('Successfully logged-out')
          console.log(`logout successful`)
        })
        .catch(err => {
          notifications.showSnackbar(`Login attempt failed. Error logged to console. You are no longer authenticated`)
          console.log(`logout failed error is ${JSON.stringify(err, null, 2)}`)
        })
        .finally(() => {
          //clear user
          axios.defaults.headers.common["Authorization"] = ``
          this.$state.user = null
          notifications.showSpinner()
        })
    }
  },
})
