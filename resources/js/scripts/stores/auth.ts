// auth.js
//handles and stores user's login and capabilities
import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useXhrStore } from './xhr'
import { useRoutesMainStore } from './routes/routesMain'
import { useNotificationsStore } from './notifications';
import type { TLoginForm, TRegistrationForm, TForgotPasswordForm, TResetPasswordForm, TUser, TAuthErrorName } from '@/js/types/authTypes'
import type {  TPageName} from '@/js/types/routesTypes'

export const useAuthStore = defineStore('auth', () => {
  const { send } = useXhrStore()
  const { showSnackbar, showSpinner } = useNotificationsStore()
  const { routerPush } = useRoutesMainStore()

  let user = ref<TUser | null>(null)
  let accessibility = ref({ authenticatedUsersOnly: true, readOnly: false })

  const authDialog = ref(false)
  const email = ref("")

  const authenticated = computed(() => {
    return user.value !== null
  })

  const permissions = computed(() => {
    return user.value === null ? [] : (<TUser>user.value).permissions
  })

  async function sendRegisterRequest(form: TRegistrationForm): Promise<boolean> {
    console.log("auth.register")
    user.value = null
    try {
      let res = await send('fortify/logout', 'post')
      res = await send('fortify/register', 'post', form)
      logApiResponse(`fortify/register`, res)
      email.value = form.email
      authDialog.value = true
      return true
    } catch (err: any) {
      logApiError(`fortify/register`, err)
      return false
    }
  }
  type TLoginResponse = {success: boolean, user: TUser | null, status_code: number, error_name: TAuthErrorName, message?: string}
  async function login(form: TLoginForm): Promise<'OK' | 'credentials_problem' | 'not-verified' | 'server_access_problem'> {
//    async function login(form: TLoginForm): Promise<'OK' | 'credentials_problem' | 'not-verified' | 'server_access_problem'> {
      console.log("auth.login starting login sequence.")
    user.value = null
    try {
      let res = await send('fortify/logout', 'post')
      res = await send('fortify/login', 'post', form)
      logApiResponse(`login`, res)
      res = await send('about/me', 'get')

      if (res.data.user.is_verified) {
        console.log(`User is verified!`)
        email.value = ""
        user.value = res.data.user
        return 'OK'
      } else {
        console.log(`User is **NOT** verified sending a verification notification request`)
        email.value = form.email
        res = await send('fortify/email/verification-notification', 'post')
        logApiResponse(`fortify/email/verification-notification`, res)
        authDialog.value = true
        return 'not-verified'
      }
    }
    catch (err: any) {
      //console.log(`login.error: ${JSON.stringify(err, null, 2)}`)
      console.log(`login.error.status: ${err.response.status}`)
      if (err.response.status == 422) {
        showSnackbar(`These credentials don't match our records. Please try again!`)
        return 'credentials_problem'
      } else {
        logApiError(`auth/login`, err)
        showSnackbar(`Server access problem! message: ${getErrorMessage(err)}. Please try later!`)
        return 'server_access_problem'
      }
    }
  }

  async function logout(): Promise<boolean> {
    console.log("auth.logout")
    user.value = null

    try {
      let res = await send('fortify/logout', 'post')
      //logApiResponse(`fortify/logout`, res)
      showSnackbar('Successfully logged-out')
      return true
    }
    catch (err: any) {
      console.log(`logout failed error is ${getErrorMessage(err)}`)
      return false
    }
  }

  async function sendForgotPasswordRequest(form: TForgotPasswordForm): Promise<boolean> {
    console.log("auth.sendForgotPasswordRequest")
    try {
      let res = await send('fortify/logout', 'post')
      //logApiResponse(`fortify/logout`, res)
      res = await send('fortify/forgot-password', 'post', form)
      logApiResponse(`fortify/forgot-password()`, res)
      email.value = form.email
      authDialog.value = true
      return true
    }
    catch (err: any) {
      showSnackbar(`forgot-password request failed. message: ${getErrorMessage(err)}`)
      return false
    }
  }

  async function sendResetPasswordRequest(form: TResetPasswordForm): Promise<boolean> {
    console.log("auth.sendResetPasswordRequest")

    try {
      let res = await send('fortify/reset-password', 'post', form)
      logApiResponse(`fortify/reset-password`, res)
      authDialog.value = true
      return true
    }
    catch (err: any) {
      logApiError(`fortify/reset-password`, err)
      authDialog.value = true
      //showSnackbar(`reset-password request failed. message: ${getErrorMessage(err)}`)
      return false
    }
  }

  async function getUser(): Promise<TUser | 'unauthenticated' | 'server-error'> {
    // console.log(`auth.getUser`)
    try {
      let res = await send('about/me', 'get')
      //console.log(`about/me() status: ${res.status} data: ${JSON.stringify(res.data, null, 2)}`)
      return res.data.user
    } catch (err: any) {
      //logApiError(`fortify/reset-password`, err)
      return (err.response.status === 401) ? 'unauthenticated' : 'server-error'
    }
  }

  // async function checkIfVerifiedAndRedirect() {
  //   let dbUser = await getUser()
  //   if (dbUser === 'unauthenticated' || dbUser === 'server-error') {
  //     showSnackbar('There was a problem. Redirected to the home page')
  //     routerPush('home')
  //   } else {
  //     if (dbUser.is_verified) {
  //       user.value = dbUser
  //       showSnackbar('Thank you for completing your email verification! You are logged in and redirected to the home page')
  //       authDialog.value = false
  //       routerPush('home')
  //     } else {
  //       showSnackbar("Your email has not been verified! Please check email and verify!")
  //     }
  //   }
  // }

  async function userStatus(): Promise<'verified'| 'not-verified' | 'unauthenticated' | 'server-error'> {
    let dbUser = await getUser()
    if (dbUser === 'unauthenticated' || dbUser === 'server-error') {
      return dbUser
    } else {
      return dbUser.is_verified ? 'verified' : 'not-verified'
    }
  }

  async function resetAndGoTo(routeName : TPageName, resetUser=true) {
    authDialog.value = false
    if(resetUser){
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

  function logApiError(text: string, err: any): void {
    console.log(`${text} error: ${JSON.stringify(err, null, 2)}`)
  }

  return { sendRegisterRequest, login, logout, sendForgotPasswordRequest, sendResetPasswordRequest, getUser, resetAndGoTo, userStatus, email, user, accessibility, authenticated, permissions, authDialog }
})
