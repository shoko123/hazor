<template>
  <v-card class="mx-auto" width="400">
    <v-toolbar dark color="primary">
      <v-toolbar-title>Dashboard</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      Dashboard
    </v-card-text>
  </v-card>

</template>

<script setup lang="ts" >
import { defineComponent } from 'vue';
import { useAuthStore } from '../../../scripts/stores/auth'
import { storeToRefs } from 'pinia'



defineComponent({
  name: "Dashboard",  
})
</script>


