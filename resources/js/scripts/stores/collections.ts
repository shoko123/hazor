// collection.ts
//handles all collections and loading of chunks (pages)
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TCollection } from '../../types/collectionTypes'

export const useCollectionsStore = defineStore('collections', () => {

    let main = ref<TCollection>({
            array: [],
            index: 0,
            chunk: [],
            viewIndex: 0,
            views: ["Media", "Chips", "Table"],
            chunkIndex: 0,
        })

    const related = ref<TCollection>({
         array: [],
            index: 0,
            chunk: [],
            viewIndex: 0,
            views: ["Media", "Chips"],
            chunkIndex: 0,
    })
    const media = ref<TCollection>({
        array: [],
           index: 0,
           chunk: [],
           viewIndex: 0,
           views: ["Media"],
           chunkIndex: 0,
   })
   
    return { main, related, media }
})
