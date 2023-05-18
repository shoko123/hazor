<template>
  <v-row wrap dense>
    <v-col md="12" lg="9" class="d-flex flex-column">
      <ItemCard class="mb-2" />
      <Collection source="media" />
    </v-col>
    <v-col md="12" lg="3" class="d-flex flex-column">
      <TagsForm source="Item"></TagsForm>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup >
import ItemCard from '../item-views/ItemCard.vue'
import Collection from '../../collections/Collection.vue'
import TagsForm from '../../selected_tags/TagsForm.vue'
</script>

