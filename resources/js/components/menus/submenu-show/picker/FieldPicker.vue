<template>
  <v-dialog v-model="dialog" width="800">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field v-model="tag" :label="label" filled v-bind="attrs" v-on="on">
      </v-text-field>
    </template>

    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <v-row wrap>
          <v-chip v-for="(item, index) in collection" :key="index" class="font-weight-normal ma-2 body-1"
            @click="select(item)">{{ item.text }}</v-chip>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'

const props = defineProps<{
  label: String,
  title: String,
  collectionName: String,
  fieldName: String,
}>()


onMounted(() => {
  console.log(`Field ${props.label} mounted`)
})

const collection = computed(() => {
  return [{text: 'item1'}, {text: 'item2'}]
})
const dialog = computed(() => {
  return false
})
const tag = computed(() => {
  return `I am TAG`
})


function select(item: object) {
  console.log(`select(${item})`)
}

</script>