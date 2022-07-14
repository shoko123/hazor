<template>


  <v-app-bar :height="36"  :color="backColor" dark app>
    <!-- <template v-slot:prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template> -->

    <v-app-bar-title @click="homeClick()">Hazor</v-app-bar-title>
    <v-btn text @click="homeClick()">Home</v-btn>
    <v-btn text @click="aboutClick()">About</v-btn>
    <v-btn text @click="testClick()">Test</v-btn>
    <v-spacer></v-spacer>

  <v-btn text @click="loginClick()" color="purple">Login</v-btn>
    <!-- <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-heart</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn> -->
  </v-app-bar>
 

</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const bColor = ref('green')

const backColor = computed({
  get() { return bColor.value },
  set(val) { bColor.value = val; }
});
const showDigMenu = true
const showEditMenu = false
const showAdminMenu = false

function homeClick() {
  router.push({ path: '/' })
}
function aboutClick() {
  router.push({ path: '/about' })
}
function testClick() {
  router.push({ path: '/test' })
}
function loginClick() {
  router.push({ path: '/login' })
}
</script>

