<template>
 
      <v-btn @click="stepRight(false)" icon="mdi-arrow-left" color="primary"> </v-btn>

      <Picker />

      <v-btn @click="stepRight(true)" icon="mdi-arrow-right" color="primary"></v-btn>
      <!-- <v-btn fab text @click="stepRight(true)">
        <v-icon color="primary">arrow-right</v-icon>
      </v-btn> -->
      <!-- <v-btn
        v-if="isAreaSeason"
        large
        @click="goToArea"
        color="info"
        text
        rounded
        outlined
        class="no-uppercase"
        :disabled="disable"
        >to Area</v-btn
      >
      <v-btn
        v-if="isAreaSeason"
        large
        @click="goToSeason"
        color="info"
        text
        rounded
        outlined
        class="no-uppercase"
        :disabled="disable"
        >to Season</v-btn
      >
      <v-btn
        v-if="isLocus"
        large
        @click="goToAreaSeason"
        color="info"
        text
        rounded
        outlined
        class="no-uppercase"
        :disabled="disable"
        >to Area/Season</v-btn
      >
      <v-btn
        v-if="isFind"
        large
        @click="goToLocus"
        color="info"
        text
        rounded
        outlined
        class="no-uppercase"
        :disabled="disable"
        >to Locus</v-btn
      > -->

</template>

<script lang="ts" setup>
import { computed } from 'vue'
import Picker from "./picker/Picker.vue";

const disableAdjacents = computed(() => {
  return false
})

const isLocus = computed(() => {
  return false
})

const isFind = computed(() => {
  return `I am the "Show" submenu`
})

const isAreaSeason = computed(() => {
  return `I am the "Show" submenu`
})

const item = computed(() => {
  return `I am the "Show" submenu`
})

const header = computed(() => {
  return `I am the "Show" submenu`
})


function stepRight(isRight: boolean) {
  console.log(`goTo ${isRight ? 'Right' : 'Left'}`)
}


</script>

<style scoped>
.no-uppercase {
  text-transform: none;
}

.min_width {
  min-width: 500px;
}
</style>