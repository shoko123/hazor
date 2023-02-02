<template>
    <v-dialog fullscreen v-model="open">
        <component :is=comp />
    </v-dialog>
</template>

<script lang="ts" setup >

import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import Carousel from './ModalCarousel.vue'
import Picker from './ModalPicker.vue'
import { useModalStore } from '../../scripts/stores/modals/modal'

const m = useModalStore()

const comp = computed(() => {

    switch (m.modalOwner) {
        case 'Carousel':
            return Carousel
        case 'Picker':
            return Picker
        default:
            return undefined
    }
})

const open = computed(() => {
    return m.isOpen
})
</script>





