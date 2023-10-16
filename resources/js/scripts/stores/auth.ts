// auth.js
//handles and stores user's login and capabilities
import { ref, computed } from 'vue'
import axios from 'axios';
import { defineStore } from 'pinia'
import { useXhrStore } from './xhr';
import { useNotificationsStore } from './notifications';
import type { TLoginForm, TRegistrationForm, TForgotPasswordForm, TResetPasswordForm, TUser } from '@/js/types/authTypes'


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


  async function register(form: TRegistrationForm): Promise<boolean> {
    //clear user
    user.value = null
    //console.log(`auth.login() form: ${JSON.stringify(loginForm.value, null, 2)}`)

    try {
      let res = await send('fortify/register', 'post', form)

      return true
    } catch (err) {
      console.log(`The Application encounter a problem connecting with the Server`)
      return false
    }
  }

  async function login(form: TLoginForm): Promise<boolean> {
    //clear user
    user.value = null
    //console.log(`auth.login() form: ${JSON.stringify(loginForm.value, null, 2)}`)

    try {
      let res = await send('fortify/login', 'post', form)
      console.log(`login success sending for user data`)
      let res2 = await send('about/me', 'get')
      if (res.data.user !== null) {
        user.value = res2.data.user
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
    return send('fortify/logout', 'post')
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
        user.value = null
        showSpinner(false)
      })
  }

  async function sendResetPasswordMail(form: TForgotPasswordForm): Promise<boolean> {
    console.log("auth.sendResetPasswordMail")
    let { showSnackbar, showSpinner } = useNotificationsStore()
    //showSpinner('Logging out ...')
    return await send('fortify/forgot-password', 'post', form)
      .then(res => {
        return true
        showSnackbar('Successfully reset password, redirected to login page')
        console.log(`Successfully reset password`)
      })
      .catch(err => {
        showSnackbar(`sendResetPasswordMail failed`)
        console.log(`sendResetPasswordMail failed error: ${JSON.stringify(err, null, 2)}`)
        return false
      })
  }

  async function resetPassword(form: TResetPasswordForm): Promise<boolean> {
    console.log("auth.resetPassword")
    let { showSnackbar, showSpinner } = useNotificationsStore()
    //showSpinner('Logging out ...')
    return await send('fortify/reset-password', 'post', form)
      .then(res => {
        return true
        showSnackbar('Successfully reset password, redirected to login page')
        console.log(`Successfully reset password`)
      })
      .catch(err => {
        showSnackbar(`Logout attempt failed. Error logged to console. You are no longer authenticated`)
        console.log(`logout failed error is ${JSON.stringify(err, null, 2)}`)
        return false
      })
  }

  async function storeUserIfVerified(): Promise<boolean> {
    try {
      let res = await send('about/me', 'get')
      console.log(`MaybeActivated user: ${JSON.stringify(res.data, null, 2)}`)
      if (res.data.user.is_verified) {
        user.value = res.data.user
        return true
      } else {
        return false
      }

    } catch (err) {
      console.log(`The Application encounter a problem connecting with the Server`)
      return false
    }
  }
  return { register, login, logout, sendResetPasswordMail,resetPassword, storeUserIfVerified, user, accessibility, authenticated, permissions, }
})
