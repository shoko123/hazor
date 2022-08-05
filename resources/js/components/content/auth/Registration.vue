<template>
  <v-card class="mx-auto" width="400">
    <v-toolbar dark color="primary">
      <v-toolbar-title>Login</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form @submit.prevent="authenticate">
        <v-text-field prepend-icon="mdi-account" name="email" email="email" v-model="form.email"></v-text-field>
        <v-text-field prepend-icon="mdi-lock" name="password" label="password" type="password" v-model="form.password">
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
import { defineComponent } from "vue";
import { useAuthStore } from '../../../scripts/stores/auth';
import { storeToRefs } from 'pinia'
let auth =  useAuthStore()
let { form }  = storeToRefs(useAuthStore())


async function authenticate() {
  await auth.authenticate(form)
}

defineComponent({
  name: "Login",  
})
</script>


