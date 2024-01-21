<template>
  <AuthDialogForm :text="text">
    <template #text>
      {{ text }}
    </template>
    <template #buttons>
      <v-btn color="primary" block @click="btnClicked">Continue (After reset)</v-btn>
    </template>
  </AuthDialogForm>
</template>

<script setup lang="ts" >
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../../scripts/stores/auth'
import AuthDialogForm from './AuthDialogForm.vue'

let { email } = storeToRefs(useAuthStore())
let { resetAndGoTo } = useAuthStore()

async function btnClicked() {
  resetAndGoTo('login')
}

const text = computed(() => {
  return `A password reset was sent to ${email.value}. Please check your email, reset password then click below to continue`
})
</script>


