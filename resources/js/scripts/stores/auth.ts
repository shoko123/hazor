// auth.js
//handles and stores user's login and capabilities
import { ref, computed } from 'vue'
import axios from 'axios';
import { defineStore } from 'pinia'
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
}

export const useAuthStore = defineStore('auth', () => {
  let { send } = useXhrStore()

  let loginForm = ref<TLoginForm>({ email: "", password: "" })
  let user = ref<TUser | null>(null)
  let accessibility = ref({ authenticatedUsersOnly: true, readOnly: false })

  const authenticated = computed(() => {
    return user.value !== null
  })

  const permissions = computed(() => {
    return user.value === null ? [] : (<TUser>user.value).permissions
  })


  async function login(): Promise<boolean> {
    //clear user
    axios.defaults.headers.common["Authorization"] = ``
    user.value = null
    //console.log(`auth.login() form: ${JSON.stringify(loginForm.value, null, 2)}`)

    try {
      let res = await send('auth/login', 'post', loginForm.value)
      if (res.data.user !== null) {
        user.value = res.data.user
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.user.token}`
        loginForm.value = { email: "", password: "" }
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
        showSnackbar(`Login attempt failed. Error logged to console. You are no longer authenticated`)
        console.log(`logout failed error is ${JSON.stringify(err, null, 2)}`)
      })
      .finally(() => {
        //clear user
        axios.defaults.headers.common["Authorization"] = ``
        user.value = null
        showSpinner(false)
      })
  }
  return { loginForm, user, accessibility, authenticated, permissions, login, logout }
})
