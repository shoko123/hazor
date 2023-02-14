<template>
  <v-btn @click="toFilter" variant="outlined">
    Filters
    <v-tooltip activator="parent" location="bottom left">
      <v-text-field >Go to filters</v-text-field>
      <TagsForm source="Filter"></TagsForm>
    </v-tooltip>
  </v-btn>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoutesMainStore } from '../../../scripts/stores/routes/routesMain'
import TagsForm from '../../selected_tags/TagsForm.vue';


const router = useRouter()
const { getUrlModule } = useRoutesMainStore()

const count = computed(() => {
  return false
})

function toFilter() {
  console.log(`toFilter()`)
  router.push({ name: 'filter', params: { module: getUrlModule() } })  
}
</script>