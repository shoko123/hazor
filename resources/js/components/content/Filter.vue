<template>
  <div>
    <v-container fluid class="ma-0">
      <v-row wrap dense>    
        <v-col md="12" lg="3" class="d-flex flex-column">
          <TagsForm source="Filter"></TagsForm>
        </v-col>
        <v-col md="12" lg="9" class="d-flex flex-column">
          <FilterSelector />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup >
import FilterSelector from '../filter/FilterSelector.vue'
import TagsForm from '../trio/TrioSelectedForm.vue'
</script>
