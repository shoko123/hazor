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
        v-model="item.area"
        label="Area"
        class="mr-1"
        filled
        readonly
      />
      <v-text-field
        v-model="item.locus"
        label="Locus"
        class="mr-1"
        filled
        readonly
      />
      <v-text-field
        id="stone"
        v-model="stone"
        label="Stone(basket-stone no)"
        class="mr-1"
        filled
        readonly
      />
      <v-text-field
        v-model="item.year"
        label="Year"
        class="mr-1"
        filled
        readonly
      />
      <v-text-field
        v-show="item.date"
        v-model="item.date"
        label="Date"
        class="mr-1"
        filled
        readonly
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
        filled
        readonly
      />
      <v-text-field
        v-model="item.material_code"
        label="Material Code"
        class="mr-1"
        filled
        readonly
      />
      <v-text-field
        v-show="item.rim_diameter"
        v-model="rimDiameterInCm"
        label="Rim Diameter(cm)"
        class="mr-1"
        filled
        readonly
      />
    </v-row>

    <v-row
      wrap
      no-gutters
    >
      <v-textarea
        v-model="item.description"
        label="Description"
        rows="2"
        class="mr-1"
        filled
        readonly
      />
      <v-textarea
        v-model="item.dimensions"
        label="Dimensions"
        rows="2"
        class="mr-1"
        auto-grow
        filled
        readonly
      />
    </v-row>

    <v-row
      wrap
      no-gutters
    >
      <v-textarea
        v-model="item.prov_notes"
        label="Provenience Notes"
        rows="1"
        class="mr-1"
        auto-grow
        filled
        readonly
      />
      <v-textarea
        v-model="item.notes"
        label="Notes"
        rows="1"
        class="mr-1"
        auto-grow
        filled
        readonly
      />
    </v-row>

    <v-row
      wrap
      no-gutters
    >
      <v-textarea
        v-model="item.publication"
        label="Publication"
        rows="1"
        auto-grow
        filled
        readonly
      />
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { TStoneFields } from '@/js/types/moduleFieldsTypes'
import { useItemStore } from '../../../scripts/stores/item'

let i = useItemStore()

const rimDiameterInCm = computed(() => {
  return item.value.rim_diameter === null ? "" : item.value.rim_diameter / 10
})
const item = computed(() => {
  return <TStoneFields>i.fields
})
const stone = computed(() => {
  return item.value.basket + `-${item.value.stone_no}`
})
</script>

