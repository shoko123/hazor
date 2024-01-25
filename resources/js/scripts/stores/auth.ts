// auth.js
//handles and stores user's login and capabilities
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useXhrStore } from './xhr'
import { useRoutesMainStore } from './routes/routesMain'
import { useNotificationsStore } from './notifications';
import type { TLoginForm, TRegistrationForm, TForgotPasswordForm, TResetPasswordForm, TUser } from '@/js/types/authTypes'
import type { TPageName } from '@/js/types/routesTypes'

export const useAuthStore = defineStore('auth', () => {
  const { send } = useXhrStore()
  const { showSnackbar } = useNotificationsStore()
  const { routerPush } = useRoutesMainStore()

  const user = ref<TUser | null>(null)
  const accessibility = ref({ authenticatedUsersOnly: true, readOnly: false })
  const dialog = ref({ open: false, message: '' })

  const authenticated = computed(() => {
    return user.value !== null
  })

  const permissions = computed(() => {
    return user.value === null ? [] : (<TUser>user.value).permissions
  })

  async function attemptRegister(form: TRegistrationForm): Promise<boolean> {
    console.log("auth.attemptRegister()")
    user.value = null
    try {
      let res = await send('fortify/logout', 'post')
      res = await send('fortify/register', 'post', form)
      logApiResponse(`fortify/register`, res)
      dialog.value = { open: true, message: `A verification email has been sent to ${form.email}. After verifying your email please click below to close this tab` }
      return true
    } catch (err: any) {
      console.log(`attemptRegister.err: ${getErrorMessage(err)}`)
      if (err.response?.status == 422 && err.response.data.message === 'The email has already been taken.') {
        showSnackbar(`${err.response.data.message}. Please change the email!`)
        return false
      } else {
        showSnackbar(`Registration attemp failed! message: ${getErrorMessage(err)}. You are redirected to the home page. Please try later!`)
        routerPush('home')
        return false
      }
    }
  }

  async function attemptLogin(form: TLoginForm): Promise<boolean> {
    //    async function attemptLogin(form: TLoginForm): Promise<'OK' | 'credentials_problem' | 'not-verified' | 'server_access_problem'> {
    console.log("auth.attemptLogin()")
    user.value = null
    try {
      let res = await send('fortify/logout', 'post')
      res = await send('fortify/login', 'post', form)
      logApiResponse(`login`, res)
      res = await send('about/me', 'get')

      if (res.data.user.is_verified) {
        console.log(`User is verified!`)
        //email.value = ""
        user.value = res.data.user
        showSnackbar(`Successfully logged-in!`)

        return true//{success: true, user: user.value, status_code: res.status}
      } else {
        console.log(`User is **NOT** verified sending a verification notification request`)
        res = await send('fortify/email/verification-notification', 'post')
        logApiResponse(`fortify/email/verification-notification`, res)
        dialog.value = { open: true, message: `Your email is not verified. A verification email has been sent to ${form.email}. After verifying your email please click below to continue` }
        return false//return {success: true, user: user.value, status_code: res.status,error_name: 'not-verified'}
      }
    }
    catch (err: any) {
      console.log(`attemptLogin.err: ${getErrorMessage(err)}`)
      if (err.response.status == 422) {
        showSnackbar(`These credentials don't match our records. Please try again!`)
        return false//{success: false, user: null, status_code: err.response.status, error_name: 'wrong-credentials'}
      } else {
        showSnackbar(`Server access problem! message: ${getErrorMessage(err)}. You are redirected to the home page. Please try later!`)
        routerPush('home')
        return false//{success: false, user: null, status_code: err.response.status, error_name: 'general-error', message: err.response.message}
      }
    }
  }

  async function logout(): Promise<boolean> {
    console.log("auth.logout")
    user.value = null

    try {
      await send('fortify/logout', 'post')
      //logApiResponse(`fortify/logout`, res)
      showSnackbar('Successfully logged-out')
      return true
    }
    catch (err: any) {
      console.log(`logout failed error is ${getErrorMessage(err)}`)
      return false
    }
  }

  async function attemptForgotPassword(form: TForgotPasswordForm): Promise<boolean> {
    console.log("auth.attemptForgotPassword()")
    try {
      let res = await send('fortify/logout', 'post')
      res = await send('fortify/forgot-password', 'post', form)
      logApiResponse(`fortify/forgot-password()`, res)
      dialog.value = { open: true, message: `A password reset was sent to ${form.email}. Please check your email, reset password then click below to continue to the login page.` }
      return true
    }
    catch (err: any) {
      console.log(`attemptForgotPassword.err: ${getErrorMessage(err)}`)
      showSnackbar(`Forgot-password request failed. message: ${getErrorMessage(err)} You are redirected to the home page. Please try later!`)
      routerPush('home')
      return false
    }
  }

  async function attemptResetPassword(form: TResetPasswordForm): Promise<boolean> {
    console.log("auth.attemptResetPassword()")

    try {
      const res = await send('fortify/reset-password', 'post', form)
      logApiResponse(`fortify/reset-password`, res)
      dialog.value = { open: true, message: `Your password was successfuly reset. Please close this tab and follow the instructions in the app to login.` }
      return true
    }
    catch (err: any) {
      console.log(`attemptResetPassword.err: ${getErrorMessage(err)}`)      
      dialog.value = { open: true, message: `Reset-password request failed. message: ${getErrorMessage(err)}. Please close this tab.` }
      return false
    }
  }

  async function userStatus(): Promise<'verified' | 'not-verified' | 'unauthenticated' | 'server-error'> {
    try {
      const res = await send('about/me', 'get')
      return res.data.user.is_verified ? 'verified' : 'not-verified'
    } catch (err: any) {
      console.log(`userStatus.err: ${getErrorMessage(err)}`)      
      return (err.response.status === 401) ? 'unauthenticated' : 'server-error'
    }
  }

  function resetAndGoTo(routeName: TPageName, resetUser = true) {
    dialog.value = { open: false, message: '' }
    if (resetUser) {
      user.value = null
    }
    routerPush(routeName)
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

  return { attemptRegister, attemptLogin,attemptForgotPassword, attemptResetPassword,  logout, resetAndGoTo, userStatus, dialog, user, accessibility, authenticated, permissions }
})
