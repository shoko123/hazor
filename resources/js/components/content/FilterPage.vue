<template>
  <div>
    <v-row
      wrap
      dense
      class="mt-1"
    >
      <v-col :cols="widths[0]">
        <!-- <TagsForm source="Filter" /> -->
        <TagsForm2 source="Filter" />
      </v-col>
      <v-col :cols="widths[1]">
        <!-- <FilterSelector />  -->
        <FilterSelector2 />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import FilterSelector from '../filter/FilterSelector.vue'
import FilterSelector2 from '../filter/FilterSelector2.vue'
import TagsForm from '../trio/TrioSelectedForm.vue'
import TagsForm2 from '../trio/TrioSelectedForm2.vue'
const widths = computed(() => {
  const { smAndDown } = useDisplay()
  return smAndDown.value ? [12, 12] : [3, 9]
})
</script>
