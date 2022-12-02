<template>
  <v-container v-if="isLoggedIn" class="ma-0 pa-0 min_width">
    <v-row align="center">
      <v-tooltip v-if="isAllowed('update')" top>
        <template v-slot:activator="{ on }">
          <v-btn @click="itemUpdate()" large outlined color="info" dark v-on="on">
            <v-icon>edit</v-icon>
          </v-btn>
        </template>
        <span>Edit {{ name }} details</span>
      </v-tooltip>

      <v-tooltip v-if="isAllowed('media')" top>
        <template v-slot:activator="{ on }">
          <v-btn @click="goToMedia()" large outlined color="info" dark v-on="on">
            <v-icon>camera</v-icon>
          </v-btn>
        </template>
        <span>Manage {{ name }} media</span>
      </v-tooltip>

      <v-tooltip v-if="isAllowed('tag')" top>
        <template v-slot:activator="{ on }">
          <v-btn @click="goToTagger()" large outlined color="info" dark v-on="on">
            <v-icon>mdi-tag</v-icon>
          </v-btn>
        </template>
        <span>Manage {{ name }} tags</span>
      </v-tooltip>

      <v-tooltip v-if="isAllowed('delete')" top>
        <template v-slot:activator="{ on }">
          <v-btn @click="itemDelete()" large outlined color="info" dark v-on="on">
            <v-icon>delete</v-icon>
          </v-btn>
        </template>
        <span>Delete {{ name }}</span>
      </v-tooltip>

      <v-tooltip v-if="isAllowed('create')" top>
        <template v-slot:activator="{ on }">
          <v-btn @click="itemCreate()" large outlined color="info" dark v-on="on">
            <v-icon>note_add</v-icon>
          </v-btn>
        </template>
        <span>Create new {{ name }}</span>
      </v-tooltip>
    </v-row>
  </v-container>
</template>


<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useModuleStore } from '../../../scripts/stores/module'

let { name } = storeToRefs(useModuleStore())

const status = computed(() => {
  return false
})

const isLoggedIn = computed(() => {
  return false
})



const tmp = computed(() => {
  return false
})

function isAllowed(module: string) {
return true
}

function itemCreate() {
  console.log(`itemCreate`)
}

function itemUpdate() {
  console.log(`itemUpdate`)
}

function goToMedia() {
  console.log(`goToMedia`)
}

function goToTagger() {
  console.log(`goToTagger`)
}


function itemDelete() {
  console.log(`itemDelete`)
}

</script>
<style scoped>
.min_width {
  min-width: 400px;
}
</style>