<template>
    <v-app-bar :height="36" color=orange dark app>
        <v-app-bar-title>
            <component v-bind:is="SubWelcome"></component>
        </v-app-bar-title>
    </v-app-bar>
</template>
<script lang="ts" setup>
import { defineComponent } from 'vue'
import SubWelcome from './SubWelcome.vue'
defineComponent({
    name: "MainMenu",
    components: {
        SubWelcome
    }
})
</script>