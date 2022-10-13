<template>
  <div>
    <v-container fluid class="ma-0">
      <v-row wrap dense>
        <v-col md="12" lg="9" class="d-flex flex-column">
          <FilterSelect></FilterSelect>
        </v-col>
        <v-col md="12" lg="3" class="d-flex flex-column">
          <TagsForm source="Filter"></TagsForm>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup >

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

//import SubMenuFilter from './SubMenuFilter.vue';
import FilterSelect from './FilterSelector.vue';
import TagsForm from '../selected_tags/TagsForm.vue';








</script>
