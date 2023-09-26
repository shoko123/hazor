<template>
  <v-row wrap dense>
    <v-col md="12" lg="9" class="d-flex flex-column">
      <ItemCard class="mb-2" />
    </v-col>
    <v-col md="12" lg="3" class="d-flex flex-column">
      <TagsForm source="Item"></TagsForm>
    </v-col>
  </v-row>
  <Collection source="media" class="mb-2" />
  <Collection source="related" />
</template>

<script lang="ts" setup >
import ItemCard from '../item-views/ItemCard.vue'
import Collection from '../../collections/Collection.vue'
import TagsForm from '../../trio/TrioSelectedForm.vue'
</script>

