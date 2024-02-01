import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TCollectionExtra, TApiArray, TApiArrayMain, TApiPageMainGallery, TApiPageMainTabular,TApiPageTableLocus, TApiPageTableStone, TApiPageTableFauna, TItemsPerView, TCView, TApiPage, TCollectionView, TPageMainGallery, TPageMain, TPageMainChips } from '@/js/types/collectionTypes'
import type { TModule } from '../../../types/routesTypes'
import type { TXhrResult } from '../../../types/generalTypes'
import { useModuleStore } from '../module'
import { useXhrStore } from '../xhr'
import { useMediaStore } from '../media'

export const useCollectionMainStore = defineStore('collectionMain', () => {
    const { send2 } = useXhrStore()
    const { buildMedia } = useMediaStore()
    const { tagFromSlug } = useModuleStore()

    const itemsPerView = <TItemsPerView>{ Gallery: 36, Tabular: 500, Chips: 200 }

    const extra = ref<TCollectionExtra>({
        length: 0,
        pageNoB1: 1,
        views: <TCView[]>[{ name: "Gallery", ipp: 36 }, { name: "Tabular", ipp: 500 }, { name: "Chips", ipp: 200 }],
        viewIndex: 0,
    })

    const array = ref<TApiArrayMain[]>([])

    const page = ref<TPageMain[]>([])

    const collection = computed(() => {
        return {
            array: array.value,
            page: page.value,//computedPage.value,
            extra: extra.value
        }
    })

    const ipp = computed(() => {
        return extra.value.views[extra.value.viewIndex].ipp
    })

    function setCollectionViews(views: TCollectionView[]) {
        extra.value.views = views.map(x => { return { name: x, ipp: itemsPerView[x] } })
    }

    function setArray(data: TApiArray[]) {
        array.value = <TApiArrayMain[]>data
        extra.value.length = data.length
    }

    async function loadPage(pageNoB1: number, view: TCView, module: TModule): Promise<boolean> {
        const ipp = view.ipp
        const start = (pageNoB1 - 1) * ipp

        console.log(`collectionMain.loadPage() view: ${view.name} pageB1: ${pageNoB1}  ipp: ${ipp} startIndex: ${start} endIndex: ${start + ipp - 1} module: ${module} `);

        //if view is chips, use a slice into the 'main' collection's array
        if (view.name === 'Chips') {
            extra.value.pageNoB1 = pageNoB1
            const slice = array.value.slice(start, start + ipp)
            savePage(slice, view, module)
            return true
        }

        //'Gallery' and 'Tabular' views require db access 
        const ids = array.value.slice(start, start + ipp).map(x => x.id);

        if (ids.length === 0) {
            console.log(`ids.length is 0 - returning`)
            savePage([], view, module)
            return true
        }

        if (view.name === 'Gallery') {
            const res = await send2<TApiPageMainGallery[]>('model/page', 'post', { model: module, view: view.name, ids })
            if (res.success) {
                savePage(res.data, view, module)
                extra.value.pageNoB1 = pageNoB1
                return true
            } else {
                console.log(`loadPage failed. err: ${JSON.stringify(res.message, null, 2)}`)
                return false
            }
        } else {   
            //TODO fix this rediculous Type casting. 
         let res : TXhrResult<TApiPageMainTabular[]> | null = null
            console.log(`CollectionMain.loadPage() before tabular`)
            switch(module){
                case 'Locus': {    
                    res = await send2<TApiPageTableLocus[]>('model/page', 'post', { model: module, view: view.name, ids })               
                } break                
                case 'Stone': {    
                    res = await send2<TApiPageTableStone[]>('model/page', 'post', { model: module, view: view.name, ids })
                 
                } break                
                case 'Fauna': 
                default: {    
                    res = await send2<TApiPageTableFauna[]>('model/page', 'post', { model: module, view: view.name, ids })       
                } break                
            }
            console.log(`CollectionMain.loadPage() after tabular resolved`)
            const tmp = <TXhrResult<TApiPageMainTabular[]>><unknown>res
            if (tmp.success) {
                savePage(tmp.data, view, module)
                extra.value.pageNoB1 = pageNoB1
                return true
            } else {
                console.log(`loadPage failed. err: ${JSON.stringify(tmp.message, null, 2)}`)
                return false
            }  
        }
    }

    function savePage(apiPage: TApiPage[], view: TCView, module: TModule): void {
        let toSave = []

        switch (view.name) {
            case "Gallery":
                toSave = (<TApiPageMainGallery[]>apiPage).map(x => {
                    const media = buildMedia(x.media1, module)
                    const item = { id: x.id, slug: x.slug, tag: tagFromSlug(module, x.slug), short: x.short }
                    return { ...item, media: media }
                })
                page.value = <TPageMainGallery[]>toSave
                break;

            case "Tabular":
                toSave = (<TApiPageMainTabular[]>apiPage).map(x => { return { ...x, tag: tagFromSlug(module, x.slug) } })
                page.value = toSave
                break;

            case 'Chips':
                toSave = (<TApiArrayMain[]>apiPage).map(x => { return { ...x, tag: tagFromSlug(module, x.slug) } })
                page.value = <TPageMainChips[]>toSave
                break;
        }
        //console.log(`mainCollection.savePage() length: ${toSave.length}\npage:\n${JSON.stringify(page.value, null, 2)}`)
    }

    function itemIndexById(id: number) {
        const index = array.value.findIndex(x => x.id === id)
        //console.log(`collectionMain.itemIndexById(id:${id}) array: ${JSON.stringify(array.value.slice(0,5), null, 2)} index: ${index}`)
        return index
    }

    function itemIsInPage(id: number) {
        return page.value.some((x) => (<TPageMainGallery>x).id === id)
    }

    function itemByIndex(index: number): TApiArray {
        return array.value[index]

    }
    function removeItemFromArrayById(id: number): number {
        const newArray = array.value.filter(x => x.id !== id)
        array.value = newArray
        extra.value.length--
        return newArray.length
    }

    function pushToArray(arrayItem: TApiArrayMain): number {
        extra.value.length = array.value.push(arrayItem)
        return array.value.length - 1
    }

    function clear() {
        array.value = []
        page.value = []
        extra.value.pageNoB1 = 1
        extra.value.length = 0
    }

    return {
        extra,
        ipp,
        array,
        page,
        loadPage,
        itemIndexById,
        setCollectionViews,
        setArray,
        collection,
        itemIsInPage,
        itemByIndex,
        removeItemFromArrayById,
        pushToArray,
        clear,
    }
})