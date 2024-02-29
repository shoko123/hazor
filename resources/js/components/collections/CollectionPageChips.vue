<template>
  <v-row wrap>
    <v-chip
      v-for="(item, index) in page"
      :key="index"
      :disabled="rms.inTransition"
      class="font-weight-normal ma-2 body-1"
      @click="goTo(item)"
    >
      {{ item.tag }}
    </v-chip>
  </v-row>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type {
  TCollectionName,
  TPageChips,
  TPageMain,
  TPageRelated,
} from '../../types/collectionTypes'
import { useCollectionsStore } from '../../scripts/stores/collections/collections'
import { useRoutesMainStore } from '../../scripts/stores/routes/routesMain'

const props = defineProps<{
  source: TCollectionName
  pageNoB1: number
}>()

const { collection } = useCollectionsStore()
const rms = useRoutesMainStore()

const c = computed(() => {
  return collection(props.source).value
})

const page = computed(() => {
  return c.value.page as TPageChips[]
})

function goTo(item: TPageMain | TPageRelated) {
  if (props.source === 'main') {
    rms.routerPush('show', (<TPageMain>item).slug)
  } else {
    const related = <TPageRelated>item
    rms.moveFromItemToItem(related.slug, related.id, related.module)
  }
  // switch (props.source) {
  //   case 'main':
  //     rms.routerPush('show', (<TPageMain>item).slug)
  //     break

  //   case 'related':
  //     rms.moveFromItemToItem((<TPageRelated>item).slug, (<TPageRelated>item).id, (<TPageRelated>item).module)
  //     break
  // }
}
</script>
