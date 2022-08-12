// auth.js
//handles and stores user's login and capabilities
import { defineStore } from 'pinia'
import { useXhrStore } from './xhr';
import axios from 'axios';
import { useNotificationsStore } from './notifications';
import { router } from '../setups/vue-router'
import { ref, computed } from 'vue'

type TLoginForm = {
  email: string,
  password: string
}

type TUser = {
  'name': string,
  'id': number,
  'token': string,
  'permissions': string[]
} | null

type Nullable<T> = T | null

export const useAuthStore = defineStore('auth', () => {
  let loginForm = ref<TLoginForm>({ email: "", password: "" })
  let user = ref<TUser>(null)
  
  let accessibility = ref({ authenticatedUsersOnly: true, readOnly: false })

  const authenticated = computed(() => {
    return user.value !== null
  })

  const authenticatedUsersOnly = computed(() => {
    return accessibility.value.authenticatedUsersOnly
  })
  
  async function login(r: any) {

    let xhr = useXhrStore();
    let notifications = useNotificationsStore()

    //clear user
    axios.defaults.headers.common["Authorization"] = ``
    user.value = null

    console.log(`auth.login() form: ${JSON.stringify(loginForm.value, null, 2)}`)
    notifications.showSpinner('Logging in ...')

    xhr.send('auth/login', 'post', loginForm.value)
      .then(res => {
        //console.log(`auth.response is ${JSON.stringify(res, null, 2)}`)
        if (res.data.user !== null) {
          user.value = res.data.user
          axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.user.token}`
          notifications.showSnackbar('Successfully logged-in; redirected to previous page')
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
        notifications.showSpinner(false)
      })
  }

  async function logout() {
    console.log("auth.logout")
    let xhr = useXhrStore();
    let notifications = useNotificationsStore()
    notifications.showSpinner('Logging out ...')
    xhr.send('auth/logout', 'post')
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
        user.value = null
        notifications.showSpinner(false)
      })
  }
  return { loginForm, user, accessibility, authenticated, login, logout }
})
