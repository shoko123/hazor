<template>
  <v-container class="ma-0 pa-0 primary--text min_width">
    <v-row>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn @click="toWelcome()" large outlined v-on="on" class="primary--text">
            <v-icon left class="primary--text">home</v-icon>
            {{ homeText }}
          </v-btn>
        </template>
        <span>{{ homeTipText }}</span>
      </v-tooltip>

      <FilterButton v-if="showFilterButton" />

      <v-tooltip v-if="showCollectionLink" bottom>
        <template v-slot:activator="{ on }">
          <v-btn @click="toCollection()" large outlined v-on="on" class="primary--text">
            <v-icon left class="primary--text">menu</v-icon>{{ counterText }}
          </v-btn>
        </template>
        <span>{{ resultsTipText }}</span>
      </v-tooltip>

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

const homeText = computed(() => {
  return false
})

const homeTipText = computed(() => {
  return false
})
const showFilterButton = computed(() => {
  return false
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
  //this.$store.dispatch("mgr/goToRoute", "welcome");
}

function toCollection() {



  //this.$store.dispatch("mgr/goToRoute", "list");
}


</script>
<style scoped>
.min_width {
  min-width: 300px;
}
</style>