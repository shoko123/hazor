<template>
    <v-dialog fullscreen v-model="open">
        <component :is=comp />
    </v-dialog>
</template>

<script lang="ts" setup >
import { computed, type Component } from 'vue'
import Carousel from './ModalCarousel.vue'
import Count from './ModalQueryCount.vue'
import { useModalStore } from '../../scripts/stores/modals/modal'

const m = useModalStore()

const comp = computed<Component>(() => {
    switch (m.modalOwner) {
        case 'QueryCount':
            return Count
        case 'Carousel':
        default:
            return Carousel
    }
})

const open = computed(() => {
    return m.isOpen
})
</script>





