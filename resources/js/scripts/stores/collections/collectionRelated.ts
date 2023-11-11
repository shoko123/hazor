// collection.ts
//handles all collections and loading of pages
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TModule } from '../../../types/routesTypes'
import { TCollectionExtra, TCollectionView, TPageCMainVImage, TApiArrayRelated, TCView, TApiArray, TPageCRelatedVMedia, TPageCRelatedVChip, TPageCRelatedVTable } from '@/js/types/collectionTypes'
import { useCollectionsStore } from './collections'
import { useXhrStore } from '../xhr'
import { useMediaStore } from '../media'
import { useNotificationsStore } from '../notifications'
import { useModuleStore } from '../module'

export const useCollectionRelatedStore = defineStore('collectionRelated', () => {

    const { buildMedia } = useMediaStore()
    const c = useCollectionsStore()
    const { tagFromSlug } = useModuleStore()


    let extra = ref<TCollectionExtra>({
        length: 0,
        pageNoB1: 1,
        views: <TCView[]>[{ name: 'Table', ipp: 25 }, { name: 'Image', ipp: 36 }, { name: 'Chip', ipp: 200 }],
        viewIndex: 0,
    })

    let array = ref<TApiArrayRelated[]>([])

    const ipp = computed(() => {
        return extra.value.views[extra.value.viewIndex].ipp
    })

    //headers for the related.Table view
    const headers = computed(() => {
        return [
            { title: 'Tag', align: 'start', key: 'tag' },
            { title: 'Relation', align: 'start', key: 'relation_name', },
            { title: 'Short Description', align: 'start', key: 'short' },
        ]
    })

    const page = computed<TPageCRelatedVMedia[] | TPageCRelatedVTable[] | TPageCRelatedVChip[]>(() => {
        //let ipp = c.getIpp('Image')
        let start = (extra.value.pageNoB1 - 1) * ipp.value
        let slice = array.value.slice(start, start + ipp.value)
        let res = []

        switch (extra.value.views[extra.value.viewIndex].name) {
            case 'Table':
                res = slice.map(x => {
                    let media = buildMedia(x.media, x.module)
                    return {
                        relation_name: x.relation_name,
                        module: x.module,
                        id: x.id,
                        slug: x.slug,
                        tag: `${x.module} ${tagFromSlug(x.module, x.slug)}`,
                        short: x.short,
                    }
                })
                break

            case 'Image':
                res = slice.map(x => {
                    let media = buildMedia(x.media, x.module)
                    return {
                        relation_name: x.relation_name,
                        module: x.module,
                        id: x.id,
                        slug: x.slug,
                        tag: tagFromSlug(x.module, x.slug),
                        short: x.short,
                        media
                    }
                })
                break

            case 'Chip':
                res = slice.map(x => {
                    return {
                        relation_name: x.relation_name,
                        module: x.module,
                        id: x.id,
                        slug: x.slug,
                        tag: `${x.module} ${tagFromSlug(x.module, x.slug)}`,
                    }
                })
                break
        }

        return res
    })

    const collection = computed(() => {
        return {
            array: array.value,
            page: page.value,//computedPage.value,
            extra: extra.value
        }
    })

    function setArray(data: TApiArray[]) {
        array.value = <TApiArrayRelated[]>data
        extra.value.length = data.length
    }

    async function loadPage(pageNoB1: number, view: TCView, module: TModule): Promise<boolean> {
        let ipp = view.ipp
        let start = (pageNoB1 - 1) * ipp

        console.log(`collectionRelated.loadPage() view: ${view} pageB1: ${pageNoB1}  ipp: ${ipp} startIndex: ${start} endIndex: ${start + ipp - 1} module: ${module} `);
        extra.value.pageNoB1 = pageNoB1
        return true
    }

    function itemIndexById(id: number) {
        let index = array.value.findIndex(x => x.id === id)
        return index
    }

    function itemIsInPage(id: number) {
        return page.value.some((x) => x.id === id)
    }

    function itemByIndex(index: number): TApiArray {
        return array.value[index]
    }

    function clear() {
        array.value = []
        extra.value.pageNoB1 = 1
        extra.value.length = 0
    }

    return {
        extra,
        ipp,
        array,
        page,
        headers,
        loadPage,
        itemIndexById,
        setArray,
        collection,
        itemIsInPage,
        itemByIndex,
        clear,
    }
})