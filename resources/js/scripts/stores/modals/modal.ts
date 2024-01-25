// stores/modals/mpdal.ts
import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useCarouselStore } from './carousel'
import { useQueryCountStore } from './queryCount'

type TModalOwner = 'Carousel' | 'QueryCount'

export const useModalStore = defineStore('modal', () => {
    const c = useCarouselStore()
    const qc = useQueryCountStore()

    const modalOwner = computed((): TModalOwner | undefined => {
        if (c.isOpen) { return 'Carousel' }
        if (qc.isOpen) { return 'QueryCount' }
        return undefined
    })

    const isOpen = computed(() => {
        return c.isOpen || qc.isOpen
    })

    return { isOpen, modalOwner }
})
