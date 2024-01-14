// auth.js
//handles and stores user's login and capabilities
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useXhrStore } from './xhr';
import { useNotificationsStore } from './notifications';
import type { TLoginForm, TRegistrationForm, TForgotPasswordForm, TResetPasswordForm, TUser } from '@/js/types/authTypes'

export const useAuthStore = defineStore('auth', () => {
  const { send } = useXhrStore()
  const { showSnackbar, showSpinner } = useNotificationsStore()
  let user = ref<TUser | null>(null)
  let accessibility = ref({ authenticatedUsersOnly: true, readOnly: false })
  const emailVerificationDialog = ref(false)

  const authenticated = computed(() => {
    return user.value !== null
  })

  const permissions = computed(() => {
    return user.value === null ? [] : (<TUser>user.value).permissions
  })

  async function register(form: TRegistrationForm): Promise<boolean> {
    console.log("auth.register")
    user.value = null

    try {
      let res = await send('fortify/logout', 'post')
      logApiResponse(`fortify/logout`, res)
      res = await send('fortify/register', 'post', form)
      logApiResponse(`fortify/register`, res)
      return true
    } catch (err: any) {
      console.log(`register error status : ${err.response.status} message: ${err.response.data.message}`)
      showSnackbar(`Registration error! message: ${getErrorMessage(err)}. Please reload page and try again!`)
      return false
    }
  }

  async function login(form: TLoginForm): Promise<TUser | null> {
    console.log("auth.login")
    user.value = null
    try {
      console.log(`starting login sequence.`)
      let res = await send('fortify/logout', 'post')
      logApiResponse(`logout()`, res)
      res = await send('fortify/login', 'post', form)
      logApiResponse(`login`, res)
      res = await send('about/me', 'get')
      logApiResponse(`about/me`, res)
      if (res.data.user.is_verified) {
        console.log(`User is verified!`)
        user.value = res.data.user
      } else {
        console.log(`User is **NOT** verified sending a verification notification request`)
        res = await send('fortify/email/verification-notification', 'post')
        logApiResponse(`fortify/email/verification-notification`, res)
        emailVerificationDialog.value = true
      }

      showSnackbar('Successfully logged-in!')
      return res.data.user
    }
    catch (err: any) {
      showSnackbar(`Login or server access problem! message: ${getErrorMessage(err)}`)
      return null
    }
  }

  async function logout(): Promise<boolean> {
    console.log("auth.logout")
    user.value = null

    try {
      let res = await send('fortify/logout', 'post')
      logApiResponse(`fortify/logout`, res)
      showSnackbar('Successfully logged-out')
      return true
    }
    catch (err: any) {      
      console.log(`logout failed error is ${getErrorMessage(err)}`)
      return false
    }
  }

  async function sendResetPasswordMail(form: TForgotPasswordForm): Promise<boolean> {
    console.log("auth.sendResetPasswordMail")
    try {
      let res = await send('fortify/logout', 'post')
      logApiResponse(`fortify/logout`, res)
      res = await send('fortify/forgot-password', 'post', form)
      logApiResponse(`fortify/forgot-password()`, res)
      return true
    }
    catch (err: any) {
      showSnackbar(`forgot-password request failed. message: ${getErrorMessage(err)}`)
      return false
    }
  }

  async function resetPassword(form: TResetPasswordForm): Promise<boolean> {
    console.log("auth.resetPassword")

    try {
      let res = await send('fortify/reset-password', 'post', form)
      console.log(`fortify/reset-password() status: ${res.status} data: ${JSON.stringify(res.data, null, 2)}`)
      return true
    }
    catch (err: any) {
      showSnackbar(`reset-password request failed. message: ${getErrorMessage(err)}`)
      return false
    }
  }

  async function getUser(): Promise<TUser | 'unauthenticated' | null> {
    // console.log(`auth.getUser`)
    try {
      let res = await send('about/me', 'get')
      //console.log(`about/me() status: ${res.status} data: ${JSON.stringify(res.data, null, 2)}`)
      return res.data.user
    } catch (err: any) {
      logApiError(`about/me`, err)
      return (err.response.status === 401) ? 'unauthenticated' : null
    }
  }

  function getErrorMessage(err: any): string {
    if (err.response) {
      return err.response.data.message
    } else if (err.request) {
      // The request was made but no response was received
      console.log(`axios.err no response received request: ${JSON.stringify(err.request, null, 2)}`);
      return `No response was received from the server.`
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log(`axios.Error: ${err.message}`);
      return `There was a problem with axios.`
    }
  }

  function logApiResponse(text: string, response: any): void {
    console.log(`${text} returned. status: ${response.status} data: ${JSON.stringify(response.data, null, 2)}`)
  }

  function logApiError(text: string, err: any): void {
    console.log(`${text} error: ${JSON.stringify(err, null, 2)}`)
  }

  return { register, login, logout, sendResetPasswordMail, resetPassword, getUser, user, accessibility, authenticated, permissions, emailVerificationDialog }
})
