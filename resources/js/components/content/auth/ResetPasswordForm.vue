<template>
  <v-card class="mx-auto" elevation="8" max-width="448" rounded="lg">
    <v-toolbar dark color="primary" density="compact" :height="50">
      <v-toolbar-title>Reset Password Form</v-toolbar-title>
    </v-toolbar>
    <v-card-text class="pa-12 pb-8">
      <div class="text-subtitle-1 text-medium-emphasis">Email</div>

      <v-text-field v-model="data.email" readonly :error-messages="emailErrors" density="compact" placeholder="Email address"
        prepend-inner-icon="mdi-email-outline" variant="outlined"></v-text-field>

      <v-text-field v-model="data.password" :error-messages="passwordErrors"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'" density="compact"
        placeholder="Enter your new password" prepend-inner-icon="mdi-lock-outline" variant="outlined"
        @click:append-inner="visible = !visible"></v-text-field>

      <v-text-field v-model="data.password_confirmation" :error-messages="password_confirmationErrors"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'" density="compact"
        placeholder="Enter new password confirmation" prepend-inner-icon="mdi-lock-outline" variant="outlined"
        @click:append-inner="visible = !visible"></v-text-field>

      <v-btn @click="send" block class="mb-8" color="blue" size="large" variant="tonal">
        Reset Password
      </v-btn>

      <!-- <v-card-text class="text-center">
        <a class="text-blue text-decoration-none" @click="goToRegister">
          Not Registered?<v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-card-text> -->
    </v-card-text>
  </v-card>
  <v-dialog v-model="dialog" persistent width="500">
    <v-card>
      <v-card-text>
        {{ waitText }}
      </v-card-text>
      <!-- <v-card-actions>
        <v-btn color="primary" block @click="goToLogin">Go to Login (after activation of email reset link)</v-btn>
      </v-card-actions> -->
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts" >
import { computed, ref, reactive, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../../scripts/stores/auth'
import { useNotificationsStore } from '../../../scripts/stores/notifications';
import { useRoutesMainStore } from '../../../scripts/stores/routes/routesMain'
import { router } from '../../../scripts/setups/vue-router'
import { useVuelidate } from "@vuelidate/core"
import { required, email, minLength, helpers, sameAs, maxValue } from "@vuelidate/validators"

onMounted(() => {
  const route = useRoute()
   //console.log(`ResetPasswordForm route:\n ${JSON.stringify(route, null, 2)}`)
  data.email = <string>route.query.email
    data.token = <string>route.params.slug
      console.log(`ResetPasswordForm data:\n ${JSON.stringify(data, null, 2)}`)
})

let { showSpinner, showSnackbar } = useNotificationsStore()
let auth = useAuthStore()
let { current } = storeToRefs(useRoutesMainStore())
let { routerPush } = useRoutesMainStore()




const dialog = ref(false)
const data = reactive({
  email: "",
  password: "",
  password_confirmation: "",
  token: ""
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
    password_confirmation: { required, sameAsPassword: sameAs(data.password) },
    token: { required }
  }
})

const v$ = useVuelidate(rules, data)

const emailErrors = computed(() => {
  return <string>(v$.value.email.$error ? v$.value.email.$errors[0].$message : undefined)
})

const passwordErrors = computed(() => {
  return <string>(v$.value.password.$error ? v$.value.password.$errors[0].$message : undefined)
})

const password_confirmationErrors = computed(() => {
  return <string>(v$.value.password_confirmation.$error ? v$.value.password_confirmation.$errors[0].$message : undefined)
})

const visible = ref(false)


async function send() {
  await v$.value.$validate();
  console.log(`after validate() errors: ${JSON.stringify(v$.value.$errors, null, 2)}`)
  if (v$.value.$error || v$.value.$silentErrors.length > 0) {
    showSnackbar("Please correct the marked errors!", "orange")
    console.log(`validation errors: ${JSON.stringify(v$.value.$errors, null, 2)}`)
    console.log(`validation silent errors: ${JSON.stringify(v$.value.$silentErrors, null, 2)}`)
    return
  }

  let res = await auth.resetPassword(data)
  if (res) {
    dialog.value = true
    //showSnackbar('Successfully logged-in!')
    // console.log(`Login success push to preLoginPath: ${current.value.preLoginFullPath}`)
    // if (current.value.preLoginFullPath == '/auth/register') {
    //   routerPush('login')
    // } else {
    //   router.push(<string>current.value.preLoginFullPath)
    // }
  } else {
    showSnackbar('Login or server access error! Please try again!')
  }
  return
}

const waitText = computed(() => {
  return `Your password has been successfully reset. Please close this tab and continue to the login Page.`
})

</script>
<style scoped>
#img {
  height: 91vh;
}
</style>


