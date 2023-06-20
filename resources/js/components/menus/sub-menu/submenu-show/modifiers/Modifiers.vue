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

  <v-btn v-if="isAllowed('tag')" @click="goToTagger()" icon size="small">
    <v-icon>mdi-tag</v-icon>
    <v-tooltip activator="parent" location="bottom">
      Manage {{ module }} tags
    </v-tooltip>
  </v-btn>

  <v-btn v-if="isAllowed('delete')" @click="itemDelete()" icon size="small">
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
import { useModuleStore } from '../../../../../scripts/stores/module'
import { useRoutesMainStore } from '../../../../../scripts/stores/routes/routesMain'
import { useItemStore } from '../../../../../scripts/stores/item'
import { useTrioStore } from '../../../../../scripts/stores/trio'
let { current } = storeToRefs(useRoutesMainStore())

const i = useItemStore()
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
  router.push({ name: 'create', params: { module: current.value.url_module } })
}

function itemUpdate() {
  console.log(`itemUpdate`)
  router.push({ name: 'update', params: { module: current.value.url_module, url_id: current.value.url_id } })
}

function goToMedia() {
  console.log(`goToMedia`)
  router.push({ name: 'media', params: { module: current.value.url_module, url_id: current.value.url_id } })
}

function goToTagger() {
  console.log(`goToTagger`)
  const { copyCurrentToNew } = useTrioStore()
  copyCurrentToNew()
  router.push({ name: 'tag', params: { module: current.value.url_module, url_id: current.value.url_id } })
}

async function itemDelete() {
  if (i.media1.hasMedia) {
    alert(`Delete aborted. Please delete related media!`)
    return
  }

  if (!confirm("Are you sure you want to delete this item?")) { return }

  let urlId = null;
  try {
    urlId = await i.destroy()
  } catch (error) {
    console.log(`Delete item failed error: ${error}`)
    return
  }

  if (urlId !== null) {
    router.push({ name: 'show', params: { module: current.value.url_module, url_id: <string>urlId } })
  } else {
    console.log(`Last item in array deleted - goto Welcome page`)
    router.push({ name: 'welcome', params: { module: current.value.url_module } })
  }
}

</script>
<style scoped>
.min_width {
  min-width: 400px;
}
</style>