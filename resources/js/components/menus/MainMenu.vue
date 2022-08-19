<template>
  <v-app-bar :height="36" color=primary dark app>
    <v-app-bar-title @click="homeClick()">** Dig ** ({{module.name}})</v-app-bar-title>
    <v-btn text @click="homeClick()">Home</v-btn>
    <v-btn text @click="locusClick()">Loci</v-btn>
        <v-btn text @click="stoneClick()">Stones</v-btn>
    <v-btn text @click="faunaClick()">Fauna</v-btn>
    <v-spacer></v-spacer>
    <LoginOrUser />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import LoginOrUser from './LoginOrUser.vue'
import { storeToRefs } from 'pinia'
import { useStatusStore } from '../../scripts/stores/status'

let { module } = storeToRefs(useStatusStore())

const router = useRouter()

function homeClick() {
  router.push({ path: '/' })
}
function locusClick() {
  router.push({ path: '/loci/welcome' })
}
function faunaClick() {
  router.push({ path: '/fauna/welcome' })
}
function stoneClick() {
  router.push({ path: '/stones/welcome' })
}
</script>

