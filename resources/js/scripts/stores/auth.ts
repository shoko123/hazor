// auth.js
//handles and stores user's login and capabilities
import { ref, computed } from 'vue'
import axios from 'axios';
import { defineStore } from 'pinia'
import { useXhrStore } from './xhr';
import { useNotificationsStore } from './notifications';
import type { TLoginForm, TRgistrationForm, TUser } from '@/js/types/authTypes'


export const useAuthStore = defineStore('auth', () => {
  let { send } = useXhrStore()

  let user = ref<TUser | null>(null)
  let accessibility = ref({ authenticatedUsersOnly: true, readOnly: false })

  const authenticated = computed(() => {
    return user.value !== null
  })

  const permissions = computed(() => {
    return user.value === null ? [] : (<TUser>user.value).permissions
  })


  async function register(form: TRgistrationForm): Promise<boolean> {
    //clear user
    axios.defaults.headers.common["Authorization"] = ``
    user.value = null
    //console.log(`auth.login() form: ${JSON.stringify(loginForm.value, null, 2)}`)

    try {
      let res = await send('auth/register', 'post', form)
      if (res.data.user !== null) {
        user.value = res.data.user
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.user.token}`
        return true
      } else {
        return false
      }
    } catch (err) {
      console.log(`The Application encounter a problem connecting with the Server`)
      return false
    }
  }

  async function login(form: TLoginForm): Promise<boolean> {
    //clear user
    axios.defaults.headers.common["Authorization"] = ``
    user.value = null
    //console.log(`auth.login() form: ${JSON.stringify(loginForm.value, null, 2)}`)

    try {
      let res = await send('auth/login', 'post', form)
      if (res.data.user !== null) {
        user.value = res.data.user
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.user.token}`
        return true
      } else {
        return false
      }
    } catch (err) {
      console.log(`The Application encounter a problem connecting with the Server`)
      return false
    }
  }  

  async function logout() {
    console.log("auth.logout")
    let { showSnackbar, showSpinner } = useNotificationsStore()
    showSpinner('Logging out ...')
    return send('auth/logout', 'post')
      .then(res => {
        showSnackbar('Successfully logged-out')
        console.log(`logout successful`)
      })
      .catch(err => {
        showSnackbar(`Logout attempt failed. Error logged to console. You are no longer authenticated`)
        console.log(`logout failed error is ${JSON.stringify(err, null, 2)}`)
      })
      .finally(() => {
        //clear user
        axios.defaults.headers.common["Authorization"] = ``
        user.value = null
        showSpinner(false)
      })
  }
  return { register, login, logout, user, accessibility, authenticated, permissions, }
})
