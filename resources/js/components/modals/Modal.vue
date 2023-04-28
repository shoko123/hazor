<template>
    <v-dialog fullscreen v-model="open">
        <component :is=comp />
    </v-dialog>
</template>

<script lang="ts" setup >
import type { Component } from 'vue'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import Carousel from './ModalCarousel.vue'
import Picker from './ModalPicker.vue'
import { useModalStore } from '../../scripts/stores/modals/modal'

const m = useModalStore()

const comp = computed<Component>(() => {

    switch (m.modalOwner) {
        case 'Carousel':
            return Carousel
        case 'Picker':
            return Picker
        default:
        console.log(`Modal.vue invalid modalOwner`)            
            return Carousel
    }
})

const open = computed(() => {
    return m.isOpen
})
</script>





