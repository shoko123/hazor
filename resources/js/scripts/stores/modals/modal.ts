// stores/modals/mpdal.ts
import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useCarouselStore } from './carousel'
import { usePickerStore } from './picker'
type TModalOwner = 'Carousel' | 'Picker'


export const useModalStore = defineStore('modal', () => {
    const { carouselInfo } = storeToRefs(useCarouselStore())
    const { pickerInfo } = storeToRefs(usePickerStore())

    const modalOwner = computed((): TModalOwner | undefined => {
        if (carouselInfo.value.isOpen) { return 'Carousel' }
        if (pickerInfo.value.isOpen) { return 'Picker' }
        return undefined
    })

    const isOpen = computed(() => {
        return carouselInfo.value.isOpen || pickerInfo.value.isOpen
    })

    return { isOpen, modalOwner }
})
