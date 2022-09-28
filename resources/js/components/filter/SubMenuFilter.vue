<template>
  {{ subMenuTitle }}
  <v-btn class="primary--text" large outlined @click="submit">Submit</v-btn>
  <v-btn class="primary--text" large outlined @click="clear">clear</v-btn>
</template>

<script lang="ts" setup >
import { computed, } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoutesStore } from '../../scripts/stores/routes/routesMain'

let { current } = storeToRefs(useRoutesStore())

const name = computed(() => {
  return current.value.module
})

const subMenuTitle = computed(() => {
  return `${name.value} Filter Manager`;
})

function submit() {
  console.log(`filter.submit()`);
}

function clear() {
  console.log(`filter.clear()`);
};
</script>