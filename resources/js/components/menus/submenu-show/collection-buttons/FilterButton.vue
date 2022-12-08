<template>
  <v-btn @click="toFilter" variant="outlined">
    Filters
    <v-tooltip activator="parent" location="right">
      <TagsForm source="Filter"></TagsForm>
    </v-tooltip>
  </v-btn>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useModuleStore } from '../../../../scripts/stores/module'
import TagsForm from '../../../selected_tags/TagsForm.vue';

//let { name } = storeToRefs(useModuleStore())

const count = computed(() => {
  return false
})

function toFilter() {
  console.log(`toFilter()`)
}
</script>