<template>
  <v-app-bar :height="36" color=primary dark app>
    <v-app-bar-title @click="homeClick()">Hazor</v-app-bar-title>
    <v-btn text @click="homeClick()">Home</v-btn>
    <v-btn text @click="aboutClick()">About</v-btn>
    <v-btn text @click="testClick()">Test</v-btn>
    <v-spacer></v-spacer>
    <UserOptions />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { defineComponent } from "vue"
import UserOptions from './UserOptions.vue'

defineComponent({
  name: "MainMenu",
  components: {
    UserOptions
  }
})

const router = useRouter()

function homeClick() {
  router.push({ path: '/' })
}
function aboutClick() {
  router.push({ path: '/about' })
}
function testClick() {
  router.push({ path: '/test' })
}
</script>

