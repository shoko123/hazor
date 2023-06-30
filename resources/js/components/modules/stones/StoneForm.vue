<template>
  <v-container v-if="item" fluid class="pa-1 ma-0">
    <v-row wrap no-gutters>
      <v-text-field label="Area" v-model="item.area" class="mr-1" filled readonly> </v-text-field>
      <v-text-field label="Locus" v-model="item.locus" class="mr-1" filled readonly> </v-text-field>
      <v-text-field label="Stone(basket-stone no)" v-model="stone" id="stone" class="mr-1" filled readonly>
      </v-text-field>
      <v-text-field label="Year" v-model="item.year" class="mr-1" filled readonly> </v-text-field>
      <v-text-field label="Date" v-model="item.date" v-show="item.date" class="mr-1" filled readonly>
      </v-text-field>
    </v-row>

    <v-row wrap no-gutters>
      <v-text-field label="Type" v-model="item.type" class="mr-1" filled readonly> </v-text-field>
      <v-text-field label="Material Code" v-model="item.material_code" class="mr-1" filled readonly>
      </v-text-field>
      <v-text-field label="Rim Diameter" v-model="item.rim_diameter" v-show="item.rim_diameter" class="mr-1" filled
        readonly></v-text-field>
    </v-row>

    <v-row wrap no-gutters>
      <v-textarea label="Description" v-model="item.description" rows="2" class="mr-1" filled readonly>
      </v-textarea>
      <v-textarea label="Dimensions" v-model="item.dimensions" rows="2" class="mr-1" auto-grow filled
        readonly></v-textarea>
    </v-row>

    <v-row wrap no-gutters>
      <v-textarea label="Prov Notes" v-model="item.prov_notes" rows="1" class="mr-1" auto-grow filled readonly>
      </v-textarea>
      <v-textarea label="Notes" v-model="item.notes" rows="1" auto-grow filled readonly></v-textarea>
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
const stone = computed(() => {
  return item.value.basket + `-${item.value.stone_no}`
})
</script>

