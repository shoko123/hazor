<template>
  <v-card class="elevation-12" >
    <v-card-title id="collection">{{ header }}
      <v-spacer></v-spacer>
      <v-btn v-if="allowChips" size="small" variant="outlined" @click="toggleDisplayOption()">view: {{
          displayOption
      }}
      </v-btn>
    </v-card-title>
    <div> I am the collection element</div>

  <v-card-text>
      <v-container fluid class="ma-0 pa-0">
        
        <!-- <template v-if="showPaginator">
          <div class="text-center">
            <v-pagination v-model="page" :length="pages" :total-visible="20" :disabled="disable"></v-pagination>
          </div>
        </template>-->
        <component :is=CollectionPageChips source="main" />
      </v-container>
    </v-card-text>
    
    <!-- <v-card-text>
      <v-container fluid class="ma-0 pa-0">
        <template v-if="showPaginator">
          <div class="text-center">
            <v-pagination v-model="page" :length="pages" :total-visible="20" :disabled="disable"></v-pagination>
          </div>
        </template>
        <component v-bind:is="collectionComponent" v-bind:source="source" v-bind:page="page"></component>
      </v-container>
    </v-card-text> -->
    
  </v-card>
</template>


<script lang="ts" setup >
import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import CollectionPageMedia from './CollectionPageMedia.vue'
import CollectionPageChips from './CollectionPageChips.vue'
import CollectionPageTable from './CollectionPageTable.vue'
import { useStatusStore } from '../../../scripts/stores/status';


const props = defineProps({
  source: {
    type: String,
    required: true
  },
  // index: {
  //   type: Number,
  //   required: true
  // }
  
})

let status = storeToRefs(useStatusStore())

defineComponent({
  name: "MainMenu",
  components: {
    CollectionPageMedia,
    CollectionPageChips,
    CollectionPageTable,
  }
})



const page = computed({
  get: () => 0,
  set: val => {
    console.log(`page set to ${val}`)
  }
})


const header = computed(() => {
  return status.mainCollectionHeader.value
})

const collectionComponent = computed(() => {
  return `CollectionPageMedia`
})

const allowChips = computed(() => {
  return `CollectionPageMedia`
})


const showPaginator = computed(() => {
  return `CollectionPageMedia`
})

const displayOption = computed(() => {
  return `page`
})

const itemsPerPage = computed(() => {
  return `CollectionPageMedia`
})

const pages = computed(() => {
  return `CollectionPageMedia`
})
const disable = computed(() => {
  return false
})







function toggleDisplayOption() {
  console.log(`toggle display option`);
  //this.$store.dispatch("mgr/toggleCollectionView", this.source);
}

</script>
<style scoped>
#collection {
  background-color: grey;
  max-height: 36px
}
</style>

