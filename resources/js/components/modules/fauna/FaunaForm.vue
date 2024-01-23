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
      <v-btn
        prepend-icon="mdi-map-marker"
        class="mb-3 text-none"
        color="blue-lighten-3"
        @click="openContextTab()"
      >
        {{ item.label }}
      </v-btn>
    </v-row>
    <v-row
      wrap
      no-gutters
    >
      <v-text-field
        v-model="item.area"
        label="Area"
        class="mr-1"
        readonly
        filled
      />
      <v-text-field
        v-model="item.locus"
        label="Locus"
        class="mr-1"
        readonly
        filled
      />
      <v-text-field
        v-model="item.basket"
        label="Basket"
        class="mr-1"
        readonly
        filled
      />
      <v-text-field
        v-model="registratioIsClean"
        label="Registration Clean"
        class="mr-1"
        readonly
        filled
      />
      <v-text-field
        v-model="item.stratum"
        label="Stratum"
        class="mr-1"
        readonly
        filled
      />
    </v-row>

    <v-row
      wrap
      no-gutters
    >
      <v-text-field
        v-model="item.taxon"
        label="Taxon"
        class="mr-1"
        readonly
        filled
      />
      <v-text-field
        v-model="item.taxon_common_name"
        label="Taxon Common Name"
        class="mr-1"
        readonly
        filled
      />
      <v-text-field
        v-model="item.anatomical_label"
        label="Anatomical Label"
        class="mr-1"
        filled
      />
      <v-text-field
        v-model="item.element"
        label="Element"
        class="mr-1"
        filled
      />
    </v-row>

    <v-row
      wrap
      no-gutters
    >
      <v-text-field
        v-model="item.fragment_present"
        label="Fragment Present"
        class="mr-1"
        filled
      />
      <v-text-field
        v-model="item.modifications"
        label="Modifications"
        class="mr-1"
        filled
      />
      <v-text-field
        v-model="item.age"
        label="Age"
        class="mr-1"
        filled
      />
      <v-text-field
        v-model="item.phase"
        label="Phase"
        class="mr-1"
        filled
      />
    </v-row>
    <v-row>
      <div class="font-weight-bold">
        Source: Justin Lev-Tov. (2006) In Hazor: Zooarchaeology. Justin Lev-Tov (Ed).
        Released: 2006-05-12. Open Context.
      </div>
    </v-row>
  </v-container>
</template>


<script lang="ts" setup>

import { TFaunaFields } from '@/js/types/moduleFieldsTypes'
import { computed } from 'vue'
import { useItemStore } from '../../../scripts/stores/item'

let i = useItemStore()


const item = computed(() => {
  return i.fields as unknown as TFaunaFields
})
const registratioIsClean = computed(() => {
  return item.value.registration_clean ? "Yes" : "No"
})
function openContextTab() {
  console.log(`goToOpenContext`)
  window.open(item.value.uri, '_blank', 'noreferrer');
}



</script>

