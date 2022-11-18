// stores/media.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { TItemFields, TStoneFields} from '../../types/itemTypes'


export const useItemStore = defineStore('item', () => {

    let fields = ref<object | undefined>(undefined)
    let ready = true

    return { ready, fields }
})
