<template>
  <v-container
    v-if="item"
    fluid
    class="pa-1 ma-0"
  >
    <v-row
      wrap
      no-gutters
    >
      <v-text-field
        v-model="item.name"
        label="Name"
        class="mr-1"
        readonly
        filled
      />
      <v-text-field
        v-model="item.area"
        label="Area"
        class="mr-1"
        readonly
        filled
      />
      <v-text-field
        v-model="item.square"
        label="Square"
        class="mr-1"
        readonly
        filled
      />
      <v-text-field
        v-model="item.stratum"
        label="Stratum"
        class="mr-1"
        name="width"
        readonly
        filled
      />
    </v-row>

    <v-row
      wrap
      no-gutters
    >
      <v-text-field
        v-model="item.type"
        label="Type"
        class="mr-1"
        name="length"
        readonly
        filled
      />
      <v-text-field
        v-model="item.cross_ref"
        label="Cross Reference"
        class="mr-1"
        name="width"
        readonly
        filled
      />
      <v-text-field
        v-model="item.elevation"
        label="Elevation"
        class="mr-1"
        readonly
        filled
      />
    </v-row>
    
    <v-row
      wrap
      no-gutters
    >
      <v-textarea
        v-model="item.description"
        label="Description"
        class="mr-1"
        name="length"
        readonly
        filled
      />
      <v-textarea
        v-model="item.notes"
        label="Notes"
        class="mr-1"
        name="length"
        readonly
        filled
      />
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { TLocusFields } from '@/js/types/moduleFieldsTypes'
import { useItemStore } from '../../../scripts/stores/item'

let i = useItemStore()

const item = computed(() => {
  return i.fields as unknown as TLocusFields
})

</script>

