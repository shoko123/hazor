// collection.ts
//handles all collections and loading of chunks (pages)
import { defineStore, storeToRefs } from 'pinia'
import { ref, computed, registerRuntimeCompiler } from 'vue'
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

    const collectionMain = computed(() => {
        return main
    })



    function getCollection(name: string) {
        switch (name) {
            case 'main':
                return main
            case 'media':
                return media
            case 'related':
                return media
            default:
                return main
        }
    }

    function setCollection(name: string, element: string, data: any) {
        switch (name) {
            case 'main':
                switch (element) {
                    case 'array':
                        main.value.array = data
                        break
                    case 'page':
                        main.value.page = data
                        break
                    case 'index':
                        main.value.index = Number(data)
                        break
                }
                break

            case 'media':
                switch (element) {
                    case 'array':
                        media.value.array = data
                        break
                    case 'page':
                        media.value.page = data
                        break
                    case 'index':
                        media.value.index = Number(data)
                        break
                }                
                break

            case 'related':
                switch (element) {
                    case 'array':
                        related.value.array = data
                        break
                    case 'page':
                        related.value.page = data
                        break
                    case 'index':
                        related.value.index = Number(data)
                        break
                }
                break
        }
    }

    return { main, related, media, getCollection, collectionMain, setCollection, }
})
