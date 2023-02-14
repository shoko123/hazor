<template>
  <v-btn @click="toWelcome" variant="outlined">
    Welcome
    <v-tooltip activator="parent" location="bottom">{{ welcomeTipText }}</v-tooltip>
  </v-btn>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoutesMainStore } from '../../../scripts/stores/routes/routesMain'

const router = useRouter()
const { getUrlModule } = useRoutesMainStore()

const welcomeTipText = computed(() => {
  return `Go to the Welcome Page`
})

function toWelcome() {
  console.log(`toWelcome()`)
  router.push({ name: 'welcome', params: { module: getUrlModule() } })
}

</script>