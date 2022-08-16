// collection.ts
//handles all collections and loading of chunks (pages)
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TCollection } from '../../types/collectionTypes'

export const useCollectionsStore = defineStore('collections', () => {

    let main = ref<TCollection>({
        array: [],
        index: 0,
        page: [],
        views: ["Media", "Chips", "Table"],
        viewIndex: 0,
    })


    const media = ref<TCollection>({
        array: [],
        index: 0,
        page: [],
        views: ["Media"],
        viewIndex: 0,
    })

    const related = ref<TCollection>({
        array: [],
        index: 0,
        page: [],
        views: ["Media", "Chips"],
        viewIndex: 0,
    })

    function collectionSet(name: string, array: []) {
        switch(name) {
            case 'main':
                main.value.array = {...array}
                break

                case 'media':
                media.value.array = {...array}
                break

                case 'related':
                related.value.array = {...array}
                break
        }
    }
    return { main, related, media, collectionSet }
})
