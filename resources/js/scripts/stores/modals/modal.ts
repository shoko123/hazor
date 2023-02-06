// stores/modals/mpdal.ts
import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useCarouselStore } from './carousel'
import { usePickerStore } from './picker'
type TModalOwner = 'Carousel' | 'Picker'


export const useModalStore = defineStore('modal', () => {
    const c = useCarouselStore()
    const p = usePickerStore()

    const modalOwner = computed((): TModalOwner | undefined => {
        if (c.isOpen) { return 'Carousel' }
        if (p.isOpen) { return 'Picker' }
        return undefined
    })

    const isOpen = computed(() => {
        return c.isOpen || p.isOpen
    })

    return { isOpen, modalOwner }
})
