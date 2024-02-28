<template>
  <v-row
    wrap
    dense
  >
    <v-col :cols="widths[0]">
      <ItemCard class="mb-2" />
    </v-col>
    <v-col :cols="widths[1]">
      <TagsForm source="Item" />
      <TagsForm2 source="Item" />
    </v-col>
  </v-row>
  <CollectionForm
    source="media"
    class="mb-2"
  />
  <CollectionForm source="related" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import ItemCard from '../item-views/ItemCard.vue'
import CollectionForm from '../../collections/CollectionForm.vue'
import TagsForm from '../../trio/TrioSelectedForm.vue'
import TagsForm2 from '../../trio/TrioSelectedForm2.vue'
const widths = computed(() => {
  const { smAndDown } = useDisplay()
  return smAndDown.value ? [12, 12] : [9, 3]
})
</script>

