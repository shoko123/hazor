// auth.js
//handles and stores user's login and capabilities
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useXhrStore } from './xhr'
import { useRoutesMainStore } from './routes/routesMain'
import type { TLoginForm, TRegistrationForm, TForgotPasswordForm, TResetPasswordForm, TUser } from '@/js/types/authTypes'
import type { TPageName } from '@/js/types/routesTypes'
type TEmptyResult = { success: boolean, message: string | null, status: number }//used for empty data apis

export const useAuthStore = defineStore('auth', () => {
  const { send2 } = useXhrStore()
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

  function openDialog(message: string) {
    dialog.value = { open: true, message }
  }

  async function logout(): Promise<boolean> {
    console.log("auth.logout")
    user.value = null
    const res = await send2<TUser>('fortify/logout', 'post')
    return res.success
  }

  async function register(form: TRegistrationForm): Promise<TEmptyResult> {
    console.log("auth.register()")
    user.value = null

    const res = await send2<null>('fortify/register', 'post', form)
    return { success: res.success, message: res.message, status: res.status }
  }

  type TGetUser = { success: boolean, user?: TUser, message: string | null, status: number }

  async function getUser(): Promise<TGetUser> {
    const res = await send2<TUser>('about/me', 'get')
    if (res.success) {
      return { success: true, user: <TUser>res.data, message: null, status: res.status }
    }
    return { success: false, message: 'Failed to access user.', status: res.status }
  }

  type TLoginResultData = { two_factor: boolean }
  type TLoginUserResult = { success: boolean, user?: TUser, message: string | null, status: number }

  async function loginGetUser(form: TLoginForm): Promise<TLoginUserResult> {
    //    async function loginGetUser(form: TLoginForm): Promise<'OK' | 'credentials_problem' | 'not-verified' | 'server_access_problem'> {
    console.log("auth.loginGetUser()")
    user.value = null

    const res2 = await send2<TLoginResultData>('fortify/login', 'post', form)
    if (!res2.success) {
      return { success: false, message: res2.message, status: res2.status }
    }

    return await getUser()
  }

  type TSendVerificationEmailResult = { success: boolean, message: string | null }
  async function sendVerificationNatification(): Promise<TSendVerificationEmailResult> {
    console.log("auth.sendVerificationNatification")
    const res4 = await send2<null>('fortify/email/verification-notification', 'post')
    if (!res4.success) {
      return { success: false, message: res4.message }
    }
    return { success: true, message: null }
  }

  async function forgotPassword(form: TForgotPasswordForm): Promise<TEmptyResult> {
    console.log("auth.forgotPassword()")
    const res = await send2('fortify/forgot-password', 'post', form)
    return { success: res.success, message: res.message, status: res.status }
  }

  async function resetPassword(form: TResetPasswordForm): Promise<TEmptyResult> {
    console.log("auth.resetPassword()")
    const res = await send2('fortify/reset-password', 'post', form)
    return { success: res.success, message: res.message, status: res.status }
  }

  function resetAndGoTo(routeName: TPageName | null = null) {
    dialog.value = { open: false, message: '' }
    if (routeName !== null)
      routerPush(routeName)
  }

  return { register, loginGetUser, getUser, forgotPassword, resetPassword, logout, resetAndGoTo, sendVerificationNatification, openDialog, dialog, user, accessibility, authenticated, permissions }
})
