<template>

  <v-table>
    <thead>
      <tr>
        <th class="text-left">
          ID
        </th>
        <th class="text-left">
          Name
        </th>
        <th class="text-left">
          Description
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in page" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.tag }}</td>
        <td>{{ item.description }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts" setup >

import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { TCollectionName, TPageCMainVTable } from '@/js/types/collectionTypes'
import { useCollectionsStore } from '../../scripts/stores/collections/collections'

const props = defineProps<{
  source: TCollectionName
  pageNoB1: number
}>()

let { collection } = useCollectionsStore()

const c = computed(() => {
  return collection(props.source).value
})

const page = computed(() => {
  return c.value.page as TPageCMainVTable[]
})


</script>

