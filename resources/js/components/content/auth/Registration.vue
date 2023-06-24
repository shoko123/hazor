<template>
  <v-card class="mx-auto" width="400">
    <v-toolbar dark color="primary">
      <v-toolbar-title>Login</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form @submit.prevent="register">
        <v-text-field prepend-icon="mdi-account" name="email" email="email"></v-text-field>
        <v-text-field prepend-icon="mdi-lock" name="password" label="password" type="password">
        </v-text-field>
        <v-card-actions>
          <v-row justify="center">
            <v-btn type="submit" primary>Login</v-btn>
          </v-row>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>

</template>

<script setup lang="ts" >

import { useAuthStore } from '../../../scripts/stores/auth'
import { storeToRefs } from 'pinia'

async function register() {
  //await auth.register(registrationForm)
}

</script>


