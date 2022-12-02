<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn @click="toFilter()" class="primary--text" large outlined v-on="on">
        <v-icon left class="primary--text">mdi-filter</v-icon>{{ count }}
      </v-btn>
    </template>
    <span>
      <TagsForm source="Item"></TagsForm>
    </span>
  </v-tooltip>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useModuleStore } from '../../../../scripts/stores/module'
import TagsForm from '../../../selected_tags/TagsForm.vue';

let { name } = storeToRefs(useModuleStore())

const count = computed(() => {
  return false
})

function toFilter() {
  //this.$store.dispatch("mgr/goToRoute", "filter");
}
</script>