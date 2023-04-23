<template>

  <v-container v-if="item" fluid class="pa-1 ma-0">
    <v-row wrap no-gutters>
      <v-textarea v-model="item.details" label="Details" rows="1" class="mr-1 mt-1" auto-grow readonly filled>
      </v-textarea>
    </v-row>

    <v-row wrap no-gutters>
      <v-textarea v-model="item.dimensions" label="Dimensions" rows="1" auto-grow readonly filled></v-textarea>
    </v-row>

    <v-row wrap no-gutters>
      <v-text-field label="Type" v-model="item.type" v-show="item.type" class="mr-1" name="length" filled>
      </v-text-field>

      <v-text-field label="Material" v-model="item.material" v-show="item.material" class="mr-1" name="width" filled>
      </v-text-field>

      <v-text-field label="Date" v-model="item.date" v-show="item.date" name="thickness_min" class="mr-1" filled>
      </v-text-field>

      <v-text-field label="Notes" v-model="item.prov_notes" v-show="item.prov_notes" name="thickness_max" class="mr-1"
        filled></v-text-field>


    </v-row>
   

  </v-container>

</template>

<script lang="ts" setup >

import { TStoneFields } from '@/js/types/moduleFieldsTypes'
import { computed } from 'vue'
import { useItemStore } from '../../../scripts/stores/item'

let i = useItemStore()


const item = computed(() => {
  return i.fields as unknown as TStoneFields
})





</script>
<style scoped>
#title {
  background-color: grey;
}
</style>
