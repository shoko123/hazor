<template>
  <v-row wrap dense>
    <v-col  :cols="widths[0]">
      <ItemCard class="mb-2" />
    </v-col>
    <v-col  :cols="widths[1]">
      <TagsForm source="Item"></TagsForm>
    </v-col>
  </v-row>
  <Collection source="media" class="mb-2" />
  <Collection source="related" />
</template>

<script lang="ts" setup >
import {computed } from 'vue'
import { useDisplay } from 'vuetify'
import ItemCard from '../item-views/ItemCard.vue'
import Collection from '../../collections/Collection.vue'
import TagsForm from '../../trio/TrioSelectedForm.vue'

const widths = computed(() => {
  const { smAndDown } = useDisplay()
  return smAndDown.value ? [12, 12] : [9, 3]
})
</script>

