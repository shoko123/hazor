<template>
  <v-container v-if="item" fluid class="pa-1 ma-0">
    <v-row wrap no-gutters>
      <v-text-field v-model="item.name" label="Name" class="mr-1" readonly filled> </v-text-field>
      <v-text-field v-model="item.area" label="Area" class="mr-1" readonly filled> </v-text-field>
      <v-text-field v-model="item.square" label="Square" class="mr-1" readonly filled></v-text-field>
      <v-text-field v-model="item.stratum" label="Stratum" class="mr-1" name="width" readonly filled> </v-text-field>
    </v-row>

    <v-row wrap no-gutters>
      <v-text-field label="Type" v-model="item.type" class="mr-1" name="length" readonly filled> </v-text-field>
      <v-text-field label="Cross Reference" v-model="item.cross_ref" class="mr-1" name="width" readonly
        filled></v-text-field>
      <v-text-field v-model="item.elevation" label="Elevation" class="mr-1" readonly filled></v-text-field>
    </v-row>
    
    <v-row wrap no-gutters>
      <v-textarea label="Description" v-model="item.description" class="mr-1" name="length" readonly filled> </v-textarea>
      <v-textarea label="Notes" v-model="item.notes" class="mr-1" name="length" readonly filled> </v-textarea>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup >
import { computed } from 'vue'
import { TLocusFields } from '@/js/types/moduleFieldsTypes'
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
