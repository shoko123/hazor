<template>
  <div>
    <v-container fluid class="ma-0">
      <v-row wrap dense>
        <v-col md="12" lg="9" class="d-flex flex-column">
          <TagSelector />
          <ItemCard class="mt-2"/>
        </v-col>
        <v-col md="12" lg="3" class="d-flex flex-column">
          <TagsForm source="New"></TagsForm>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup >
import TagSelector from '../tagger/TagSelector.vue'
import TagsForm from '../selected_tags/TagsForm.vue'
import ItemCard from '../item/item-views/ItemCard.vue'
</script>
