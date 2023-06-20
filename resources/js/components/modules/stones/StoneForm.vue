<template>
  <v-container v-if="item" fluid class="pa-1 ma-0">
    <v-row wrap no-gutters>
      <v-text-field label="Area" v-model="item.area" class="mr-1" filled readonly> </v-text-field>
      <v-text-field label="Locus" v-model="item.locus" class="mr-1" filled readonly> </v-text-field>
      <v-text-field label="Basket" v-model="item.basket" class="mr-1" filled readonly> </v-text-field>
      <v-text-field label="Year" v-model="item.year" class="mr-1" filled readonly> </v-text-field>
      <v-text-field label="Date" v-model="item.date" v-show="item.date" class="mr-1" filled readonly> </v-text-field>
    </v-row>

    <v-row wrap no-gutters>
      <v-text-field label="Provenience Notes" v-model="item.prov_notes" v-show="item.prov_notes" class="mr-1" filled
        readonly></v-text-field>
      <v-text-field label="Material Code" v-model="item.material" v-show="item.material" class="mr-1" filled readonly>
      </v-text-field>
      <v-text-field label="Type" v-model="item.type" class="mr-1" filled readonly> </v-text-field>
    </v-row>

    <v-row wrap no-gutters>
      <v-textarea v-model="item.details" label="Details" rows="1" class="mr-1" auto-grow filled readonly>
      </v-textarea>
      <v-textarea v-model="item.dimensions" label="Dimensions" rows="1" auto-grow filled readonly></v-textarea>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup >
import { computed } from 'vue'
import { TStoneFields } from '@/js/types/moduleFieldsTypes'
import { useItemStore } from '../../../scripts/stores/item'

let i = useItemStore()

const item = computed(() => {
  return <TStoneFields>i.fields
})

</script>

