<template>
  <v-container class="ma-0 pa-0 primary--text min_width">
    <v-row>
      <v-btn @click="toWelcome" variant="outlined">
        Welcome
        <v-tooltip activator="parent" location="bottom">{{ welcomeTipText }}</v-tooltip>
      </v-btn>
      <FilterButton v-if="showFilterButton" />

      <v-btn @click="toCollection" variant="outlined">
        Collection
        <v-tooltip activator="parent" location="bottom">{{ welcomeTipText }}</v-tooltip>
      </v-btn>
      <!--v-tooltip v-if="showCollectionLink" bottom>
        <template v-slot:activator="{ on }">
          <v-btn @click="toCollection()" large outlined v-on="on" class="primary--text">
            <v-icon left class="primary--text">menu</v-icon>{{ counterText }}
          </v-btn>
        </template>
        <span>{{ resultsTipText }}</span>
      </v-tooltip> -->

      <!--div v-if="showCounter">
        <v-btn large outlined class="primary--text"></v-btn>
      </div-->
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useModuleStore } from '../../../../scripts/stores/module'
import FilterButton from './FilterButton.vue'

const collectionTipText = computed(() => {
  return `Go to the Collection Page`
})

const welcomeTipText = computed(() => {
  return `Go to the Welcome Page`
})

const showFilterButton = computed(() => {
  return true
})
const resultsText = computed(() => {
  return false
})

const resultsTipText = computed(() => {
  return false
})

const showCollectionLink = computed(() => {
  return false
})

const counterText = computed(() => {
  return 999
})
function toWelcome() {
  console.log(`toWelcome()`)
}

function toCollection() {
 console.log(`toCollection()`)
}


</script>
<style scoped>
.min_width {
  min-width: 300px;
}
</style>