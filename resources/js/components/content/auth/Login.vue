<template>
  <v-card class="mx-auto" elevation="8" max-width="448" rounded="lg">
    <v-toolbar dark color="primary" density="compact" :height="50">
      <v-toolbar-title>User Login Form</v-toolbar-title>
    </v-toolbar>
    <v-card-text class="pa-12 pb-8">
      <div class="text-subtitle-1 text-medium-emphasis">Email</div>

      <v-text-field v-model="data.email" :error-messages="emailErrors" density="compact" placeholder="Email address"
        prepend-inner-icon="mdi-email-outline" variant="outlined"></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Password

        <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer" target="_blank">
          Forgot password?</a>
      </div>

      <v-text-field v-model="data.password" :error-messages="passwordErrors"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'" density="compact"
        placeholder="Enter your password" prepend-inner-icon="mdi-lock-outline" variant="outlined"
        @click:append-inner="visible = !visible"></v-text-field>

      <v-btn @click="loginRedirect" block class="mb-8" color="blue" size="large" variant="tonal">
        Log In
      </v-btn>

      <v-card-text class="text-center">
        <a class="text-blue text-decoration-none" @click="goToRegister">
          Not Registered?<v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-card-text>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts" >
import { computed, ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../../scripts/stores/auth'
import { useNotificationsStore } from '../../../scripts/stores/notifications';
import { useRoutesMainStore } from '../../../scripts/stores/routes/routesMain'
import { router } from '../../../scripts/setups/vue-router'

let { showSpinner, showSnackbar } = useNotificationsStore()
let auth = useAuthStore()
let { current } = storeToRefs(useRoutesMainStore())
let { routerPush } = useRoutesMainStore()
import { useVuelidate } from "@vuelidate/core"
import { required, email, minLength, helpers, minValue, maxValue } from "@vuelidate/validators"

const data = reactive({
  email: "",
  password: "",
})

const rules = computed(() => {
  return {
    email: { required, email },
    password: {
      required,
      minLength: minLength(8),
      containsPasswordRequirement: helpers.withMessage(
        () => `The password requires an uppercase, lowercase, and a number`,
        (value) => /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(<string>value)
      ),
    },
  }
})

const v$ = useVuelidate(rules, data)

const emailErrors = computed(() => {
  return <string>(v$.value.email.$error ? v$.value.email.$errors[0].$message : undefined)
})

const passwordErrors = computed(() => {
  return <string>(v$.value.password.$error ? v$.value.password.$errors[0].$message : undefined)
})

const visible = ref(false)


async function loginRedirect() {
  //showSpinner('Logging in ...')

  await v$.value.$validate();
  console.log(`after validate() errors: ${JSON.stringify(v$.value.$errors, null, 2)}`)
  if (v$.value.$error || v$.value.$silentErrors.length > 0) {

    showSnackbar("Please correct the marked errors!", "orange")
    console.log(`validation errors: ${JSON.stringify(v$.value.$errors, null, 2)}`)
    console.log(`validation silent errors: ${JSON.stringify(v$.value.$silentErrors, null, 2)}`)
    return
  }

  let res = await auth.login(data)
  showSpinner(false)
  if (res) {
    showSnackbar('Successfully logged-in!')
    console.log(`Login success push to preLoginPath: ${current.value.preLoginFullPath}`)
    if (current.value.preLoginFullPath == '/auth/register') {
      routerPush('home')
    } else {
      router.push(<string>current.value.preLoginFullPath)
    }
  } else {
    showSnackbar('Login or server access error! Please try again!')
  }
  return
}

function goToRegister() {
  routerPush('register')
}
</script>
<style scoped>
#img {
  height: 91vh;
}
</style>


