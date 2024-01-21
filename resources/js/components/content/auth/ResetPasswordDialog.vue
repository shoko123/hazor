<template>
  <AuthDialogForm :text="text">
    <template #buttons>
      <v-btn color="primary" block @click="close">Close</v-btn>
    </template>
  </AuthDialogForm>
</template>

<script setup lang="ts" >
//This form is shown after the password-registration was processed on the server side
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../../scripts/stores/auth'
import AuthDialogForm from './AuthDialogForm.vue'

function close() {
 window.close()
}

const text = computed(() => {
  return `Your password was successfuly reset. Please close this tab and follow the instructions in the app to login.`
})
</script>


