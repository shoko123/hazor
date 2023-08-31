<template>
  <v-btn v-if="isAllowed('update')" @click="itemUpdate()" icon size="small">
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
import { useAuthStore } from '../../../../../scripts/stores/auth'
import { useRoutesMainStore } from '../../../../../scripts/stores/routes/routesMain'
import { useItemStore } from '../../../../../scripts/stores/item'
import { useTaggerStore } from '../../../../../scripts/stores/trio/tagger'

const { current } = storeToRefs(useRoutesMainStore())
const { permissions } = storeToRefs(useAuthStore())
const i = useItemStore()
const router = useRouter()

const module = computed(() => {
  return current.value.module
})


function isAllowed(action: string) {
  const term = current.value.module + '-' + action
  return permissions.value.includes(term)
}

function itemCreate() {
  console.log(`itemCreate`)
  router.push({ name: 'create', params: { module: current.value.url_module } })
}

function itemUpdate() {
  console.log(`itemUpdate`)
  router.push({ name: 'update', params: { module: current.value.url_module, slug: current.value.slug } })
}

function goToMedia() {
  console.log(`goToMedia`)
  router.push({ name: 'media', params: { module: current.value.url_module, slug: current.value.slug } })
}

function goToTagger() {
  console.log(`goToTagger`)
  const { copyCurrentToNew } = useTaggerStore()
  copyCurrentToNew()
  router.push({ name: 'tag', params: { module: current.value.url_module, slug: current.value.slug } })
}

async function itemDelete() {
  if (i.media1.hasMedia) {
    alert(`Delete aborted. Please delete related media!`)
    return
  }

  if (!confirm("Are you sure you want to delete this item?")) { return }

  let slug = null;
  try {
    slug = await i.destroy()
  } catch (error) {
    console.log(`Delete item failed error: ${error}`)
    return
  }

  if (slug !== null) {
    router.push({ name: 'show', params: { module: current.value.url_module, slug: <string>slug } })
  } else {
    console.log(`Last item in array deleted - goto Welcome page`)
    router.push({ name: 'welcome', params: { module: current.value.url_module } })
  }
}

</script>