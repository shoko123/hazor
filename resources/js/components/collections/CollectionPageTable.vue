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
import { TCollectionName, TPageCMainVTable } from '../../types/collectionTypes'
import { useCollectionsStore } from '../../scripts/stores/collections/collections';

const props = defineProps<{
  source: TCollectionName
  pageNoB1: number
}>()

let { getPageArray } = useCollectionsStore()

const page = computed(() => {
  return getPageArray(props.source).value as TPageCMainVTable[]
})

</script>

