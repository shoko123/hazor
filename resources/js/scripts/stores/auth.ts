// auth.js
//handles and stores user's login and capabilities
import { ref, computed } from 'vue'
import axios from 'axios';
import { defineStore } from 'pinia'
import { router } from '../setups/vue-router'
import { useXhrStore } from './xhr';
import { useNotificationsStore } from './notifications';

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

  async function login() {
    let xhr = useXhrStore();
    let { showSpinner, showSnackbar } = useNotificationsStore()
    //clear user
    axios.defaults.headers.common["Authorization"] = ``
    user.value = null
    //console.log(`auth.login() form: ${JSON.stringify(loginForm.value, null, 2)}`)

    try {
      showSpinner('Logging in ...')
      let res = await xhr.send('auth/login', 'post', loginForm.value)
      if (res.data.user !== null) {
        user.value = res.data.user
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.user.token}`
        showSpinner(false)
        showSnackbar('Successfully logged-in; redirected to home page')
        router.push({ name: 'home' })

      } else {
        showSnackbar('Login error! Please try again!')
        showSpinner(false)
      }
    } catch (err) {
      showSpinner(false)
      showSnackbar('The Application encounter a problem connecting with the Server')
      console.log(`The Application encounter a problem connecting with the Server`)
    }
  }

  async function logout() {
    console.log("auth.logout")
    let xhr = useXhrStore();
    let notifications = useNotificationsStore()
    notifications.showSpinner('Logging out ...')
    return xhr.send('auth/logout', 'post')
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
