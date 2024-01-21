<template>
  <v-card>
    <v-card-text>
      {{ props.text }}
    </v-card-text>
    <v-card-actions>
      <slot name="buttons"></slot>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts" >

const props = defineProps<{
  text: string
}>()


</script>


