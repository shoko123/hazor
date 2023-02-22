<template>
  <v-btn v-if="isAllowed('edit')" @click="itemUpdate()" icon size="small">
    <v-icon>mdi-pencil</v-icon>
    <v-tooltip activator="parent" location="bottom">
      Edit {{ module }} Entry
    </v-tooltip>
  </v-btn>

  <v-btn v-if="isAllowed('media')" @click="goToMedia()" icon size="small">
    <v-icon>mdi-camera</v-icon>
    <v-tooltip activator="parent" location="bottom">
      Manage {{ module }} media
    </v-tooltip>
  </v-btn>

  <v-btn v-if="isAllowed('tag')" @click="itemDelete()" icon size="small">
    <v-icon>mdi-tag</v-icon>
    <v-tooltip activator="parent" location="bottom">
      Manage {{ module }} tags
    </v-tooltip>
  </v-btn>

  <v-btn v-if="isAllowed('delete')" @click="goToTagger()" icon size="small">
    <v-icon>mdi-delete</v-icon>
    <v-tooltip activator="parent" location="bottom">
      Delete {{ module }}
    </v-tooltip>
  </v-btn>

  <v-btn v-if="isAllowed('create')" @click="itemCreate()" icon size="small">
    <v-icon>mdi-note-plus-outline</v-icon>
    <v-tooltip activator="parent" location="bottom">
      Create a new {{ module }} item
    </v-tooltip>
  </v-btn>
</template>


<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useModuleStore } from '../../../../scripts/stores/module'
import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'
let { current } = storeToRefs(useRoutesMainStore())
const router = useRouter()

const module = computed(() => {
  return current.value.module
})

const isLoggedIn = computed(() => {
  return true
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
  router.push({ name: 'media', params: { module: current.value.url_module, url_id: current.value.url_id } })    
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