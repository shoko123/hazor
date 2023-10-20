// auth.js
//handles and stores user's login and capabilities
import { ref, computed } from 'vue'
import { AxiosResponse, AxiosError } from 'axios'
import { defineStore } from 'pinia'
import { useXhrStore } from './xhr';
import { useNotificationsStore } from './notifications';
import type { TLoginForm, TRegistrationForm, TForgotPasswordForm, TResetPasswordForm, TUser } from '@/js/types/authTypes'


export const useAuthStore = defineStore('auth', () => {
  const { send } = useXhrStore()
  const { showSnackbar, showSpinner } = useNotificationsStore()
  let user = ref<TUser | null>(null)
  let accessibility = ref({ authenticatedUsersOnly: true, readOnly: false })

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
      getResponseStatus(res, true)
      res = await send('fortify/register', 'post', form)
      getResponseStatus(res, true)
      getResponseData(res, true)
      //showSnackbar('Successfully logged-in!')      
      return true
    } catch (err: any) {
      console.log(`register error status : ${err.response.status} message: ${err.response.data.message}`)
      showSnackbar(`Registration error! message: ${getErrorMessage(err)}. Please reload page and try again!`)
      return false
    }
  }

  async function login(form: TLoginForm): Promise<boolean> {
    console.log("auth.login")
    user.value = null
    try {
      console.log(`starting login sequence.`)
      let res = await send('fortify/logout', 'post')
      getResponseStatus(res, true)
      res = await send('fortify/login', 'post', form)
      getResponseStatus(res, true)
      getResponseData(res, true)
      res = await send('about/me', 'get')
      getResponseStatus(res, true)
      getResponseData(res, true)
      user.value = res.data.user
      showSnackbar('Successfully logged-in!')
      return true
    }
    catch (err: any) {
      showSnackbar(`Login or server access problem! message: ${getErrorMessage(err)}`)
      return false
    }
  }

  async function logout(): Promise<boolean> {
    console.log("auth.logout")
    user.value = null
    //showSpinner('Logging out ...')

    try {
      let res = await send('fortify/logout', 'post')
      getResponseStatus(res, true)
      showSnackbar('Successfully logged-out')
      return true
    }
    catch (err: any) {
      showSnackbar(`Logout attempt failed. Error logged to console. You are no longer authenticated`)
      console.log(`logout failed error is ${getErrorMessage(err)}`)
      return false
    }
  }

  async function sendResetPasswordMail(form: TForgotPasswordForm): Promise<boolean> {
    console.log("auth.sendResetPasswordMail")
    try {
      let res = await send('fortify/logout', 'post')
      getResponseStatus(res, true)
      res = await send('fortify/forgot-password', 'post', form)
      getResponseStatus(res, true)
      getResponseData(res, true)
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
      getResponseStatus(res, true)
      getResponseData(res, true)
      return true
    }
    catch (err: any) {
      showSnackbar(`reset-password request failed. message: ${getErrorMessage(err)}`)
      return false
    }
  }

  async function getUserIfVerified(): Promise<boolean> {
    console.log(`auth.getUserIfVerified`)
    try {
      let res = await send('about/me', 'get')
      getResponseStatus(res, true)
      getResponseData(res, true)
      if (res.data.user.is_verified) {
        user.value = res.data.user
        return true
      } else {
        return false
      }
    } catch (err) {
      showSnackbar(`about/me request failed. message: ${getErrorMessage(err)}. Please reload app.`)
      return false
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

  function getResponseStatus(resp: any, consoleLog: boolean): number {
    if (consoleLog) {
      console.log(`response status: ${resp.status}`)
    }
    return resp?.status
  }

  function getResponseData(resp: any, consoleLog: boolean): any {
    if (consoleLog) {
      console.log(`response data: ${JSON.stringify(resp.data, null, 2)}`)
    }
    return resp?.data
  }

  return { register, login, logout, sendResetPasswordMail, resetPassword, getUserIfVerified, user, accessibility, authenticated, permissions, }
})
