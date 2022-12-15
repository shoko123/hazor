<template>
  <v-img id=img :src="backgroundImage?.fullUrl" :lazy-src="backgroundImage?.tnUrl" :cover="true">
    <v-container fill-height fluid>
      <v-row align="center" justify="center">
        <v-col>
          <v-card class="mx-auto" width="30%">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form @submit.prevent="loginRedirect
              ">
                <v-text-field prepend-icon="mdi-account" name="email" email="email" v-model="loginForm.email">
                </v-text-field>
                <v-text-field prepend-icon="mdi-lock" name="password" label="password" type="password"
                  v-model="loginForm.password">
                </v-text-field>
                <v-card-actions>
                  <v-row justify="center">
                    <v-btn type="submit" primary>Login</v-btn>
                  </v-row>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-img>
</template>

<script setup lang="ts" >
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../../scripts/stores/auth'
import { useModuleStore } from '../../../scripts/stores/module'

let auth = useAuthStore()
let { backgroundImage } = storeToRefs(useModuleStore())

const loginForm = computed(() => {
  return auth.loginForm
})
async function loginRedirect() {
  auth.login()
}

</script>
<style scoped>
#img {
  height: 91vh;
}
</style>


