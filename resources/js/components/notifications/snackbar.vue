<template>
  <v-snackbar
    v-model="snackbar.turnOn"
    location="center center"
    left
    :color="snackbar.color"
    :timeout="snackbar.timeout"
  >
    {{ snackbar.message }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { useNotificationsStore } from '../../scripts/stores/notifications'
import { storeToRefs } from 'pinia'

let { snackbar } = storeToRefs(useNotificationsStore())
</script>