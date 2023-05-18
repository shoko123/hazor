<template>
<v-col md="12" lg="9" class="d-flex flex-column">
      <ItemCard class="mb-2" />
    </v-col>
    <v-col md="12" lg="3" class="d-flex flex-column">
      <TagsForm source="Item"></TagsForm>
    </v-col>   
   <ItemCard />
</template>

<script lang="ts" setup >
import { computed } from 'vue'
import ItemCard from '../item-views/ItemCard.vue'
import TagsForm from '../../selected_tags/TagsForm.vue'
</script>

