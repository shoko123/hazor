<template>

  <v-container v-if="item" fluid class="pa-1 ma-0">
    <v-row wrap no-gutters>
      <v-text-field v-model="item.name" label="Name" class="mr-1" readonly filled> </v-text-field>
      <v-text-field v-model="item.stratum" label="Stratum" class="mr-1" readonly filled></v-text-field>
      <v-text-field v-model="item.id" label="Id" class="mr-1" readonly filled></v-text-field>
    </v-row>

    <v-row wrap no-gutters>
      <v-text-field label="Type" v-model="item.type" v-show="item.type" class="mr-1" name="length" filled>
      </v-text-field>

      <v-text-field label="Cross Reference" v-model="item.cross_ref" v-show="item.cross_ref" class="mr-1" name="width"
        filled>
      </v-text-field>
    </v-row>


  </v-container>

</template>

<script lang="ts" setup >

import { TLocusFields } from '../../../types/itemTypes'
import { computed } from 'vue'
import { useItemStore } from '../../../scripts/stores/item'

let i = useItemStore()


const item = computed(() => {
  return i.fields as unknown as TLocusFields
})





</script>
<style scoped>
#title {
  background-color: grey;
}
</style>
