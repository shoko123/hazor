<template>
  <v-container>
    <v-row>
      <v-col :cols="6" class="px-1">
        <FieldPicker
          v-bind="{
            label: 'Season/Area',
            title: 'Pick Season/Area',
            collectionName: 'areasSeasons',
            fieldName: 'areaSeason',
          }"
        ></FieldPicker>
      </v-col>
      <v-col v-if="showLoci" :cols="6" class="px-1">
        <FieldPicker
          v-bind="{
            label: 'Locus',
            title: 'Pick Locus Number',
            collectionName: 'loci',
            fieldName: 'locus',
          }"
        ></FieldPicker>
      </v-col>
    </v-row>

    <v-row v-if="showFinds">
      <FieldPicker
        v-bind="{
          label: 'Find',
          title: 'Pick find',
          collectionName: 'finds',
          fieldName: 'find',
        }"
      ></FieldPicker>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup >
import { TSource, IMediaItem } from '../../../../types/collectionTypes'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'


import { useRoutesMainStore } from '../../../../scripts/stores/routes/routesMain'
import FieldPicker from './FieldPicker.vue'

const router = useRouter()

const showLoci = computed(() => {
  return false
})

const showFinds = computed(() => {
  return false
})

</script>
