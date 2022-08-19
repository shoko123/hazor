<template>
    <v-app-bar :height="36" color=orange dark app>
        <v-app-bar-title>
            <component v-bind:is="SubWelcome"></component>
        </v-app-bar-title>
    </v-app-bar>
</template>
<script lang="ts" setup>
import {  computed } from 'vue'
import SubWelcome from './SubWelcome.vue'
import { useStatusStore } from '../../scripts/stores/status'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'


</script>