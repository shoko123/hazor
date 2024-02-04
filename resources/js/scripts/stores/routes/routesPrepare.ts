//routesPrepare
//At this point the new route is assured to have a correct form and all
//relevant fields are stored in routesStore.from and .to. Actions needed
//to complete the transition to the new route are stored in TPlanAction[].
//Here we execute the loading of assets (collection, page, item)and other 
//activities (e.g. clear, copy current -> new,), before
//proceeding to the new route.

import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { TPlanAction, TPrepareResponse, TModule, TParseErrorDetails } from '@/js/types/routesTypes'
import type { TGenericFields } from '@/js/types/moduleTypes'
import type { TApiItemShow} from '@/js/types/itemTypes'
import type { LocationQuery } from 'vue-router'
import { useXhrStore } from '../xhr'
import { useTrioStore } from '../trio/trio'
import { useFilterStore } from '../trio/filter'
import { useCollectionsStore } from '../collections/collections'
import { useMediaStore } from '../media'
import { useModuleStore } from '../module'
import { useNotificationsStore } from '../notifications'
import { useItemStore } from '../item'
import { useRoutesMainStore } from './routesMain'
import { useRoutesParserStore } from './routesParser'
import { TApiArrayMain } from '@/js/types/collectionTypes'

export const useRoutesPrepareStore = defineStore('routesPrepare', () => {
  const { send, send2 } = useXhrStore()
  const n = useNotificationsStore()

  const c = useCollectionsStore()
  const i = useItemStore();
  const r = useRoutesMainStore()
  const p = useRoutesParserStore()
  const f = useFilterStore()
  const m = useModuleStore()
  const { trioReset, setTrio } = useTrioStore()
  const { setItemMedia } = useMediaStore()

  const fromUndef = ref<boolean>(false)

  async function prepareForNewRoute(module: TModule, query: LocationQuery, slug: string, plan: TPlanAction[], fromUndefined: boolean): Promise<TPrepareResponse> {
    fromUndef.value = fromUndefined
    for (const x of plan) {
      switch (x) {
        case 'module.load':
          await loadModule(module).catch(() => {
            throw 'ModuleInitError'
          })
          break

        case 'module.clear':
          trioReset()
          break

        case 'collection.item.load':
          await loadCollectionAndItem(module, query, slug).catch(() => {
            throw "LoadCollectionAndItemFError"
          })
          break

        case 'collection.load': {
          n.showSpinner(`Loading ${module} collection...`)
          const res = await loadMainCollection(module, query)
          n.showSpinner(false)

          if (!res.success) {
            n.showSnackbar(`${res.message}`)
            throw res.message === 'Empty result set' ? 'EmptyResultSet' : 'CollectionLoadError'
          }
        }
          break

        case 'collection.clear':
          c.clear(['main', 'media', 'related'])
          break

        case 'item.load':
          await loadItem(module, slug).catch(() => {
            throw 'ItemLoadError'
          })
          break

        case 'item.clear':
          i.itemClear()
          c.clear(['media', 'related'])
          break

        case 'item.setIndexInCollection':
          if (!itemSetIndexInCollection()) {
            throw 'ItemNotFoundInCollectionError'
          }
          break

        case 'page.load':
          await loadPage(false)
          break

        case 'page.load1':
          await loadPage(true)
          break

        case 'item.prepareForMedia':
          prepareForMedia()
          break

        default:
          console.log(`PrepareForNewRoute() Bad Action: ${x}`)
          throw 'RoutingBadActionError'
      }
    }
    //console.log(`PrepareForNewRoute() success after completing queue`)
    return { success: true }
  }

  async function loadModule(module: TModule) {
    trioReset()
    n.showSpinner('Loading module data ...')
    return send('model/init', 'post', { model: module })
      .then(res => {
        //console.log(`loadModule() res:\n${JSON.stringify(res, null, 2)}`)
        //console.log(`model(${module}).init() returned (success)`)
        m.counts = res.data.counts
        m.lookups = res.data.lookups
        m.welcomeText = res.data.welcome_text

        c.resetCollectionsViewIndex()
        i.setItemViewIndex(0)
        i.itemViews = res.data.display_options.item_views
        c.clear(['main', 'media', 'related'])

        setTrio(res.data.trio)
        c.setCollectionViews('main', res.data.display_options.main_collection_views)
        c.setCollectionViews('related', res.data.display_options.related_collection_views)

        return true
      })
      .catch(err => {
        n.showSnackbar(`Navigation to new routes failed. Navigation cancelled`)
        console.log(`Navigation to new routes failed with err: ${JSON.stringify(err, null, 2)}`)
        throw err;
      })
      .finally(() => {
        n.showSpinner(false)
      })
  }

  async function loadCollectionAndItem(module: TModule, query: LocationQuery, slug: string) {
    n.showSpinner(`Loading Module ${module} ...`)
    console.log(`prepare.loadCollectionAndItem()`)

    await Promise.all([
      loadMainCollection(module, query),
      loadItem(module, slug)
    ])
      .catch(err => {
        throw err
      });
  }

  async function loadMainCollection(module: TModule, query: LocationQuery): Promise<{ success: boolean, message: string }> {
    const res1 = f.urlQueryToApiFilters(query)
    console.log(`loadMainCollection parse result: res: ${JSON.stringify(res1, null, 2)}`)
    if (!res1.success) {
      console.log(`parseQuery() failed`)
      return { success: false, message: `${res1.message}` }
    }

    if (fromUndef.value) {
      f.setFiltersFromUrlQuery(res1.selectedFilters)
    }

    const res2 = await send2<TApiArrayMain[]>('model/index', 'post', { model: module, query: res1.apiFilters })

    if (res2.success) {
      if (res2.data.length === 0) {
        console.log(`loadMainCollection() err: empty result set`)
        return { success: false, message: 'Empty result set' }
      }
      r.to.queryParams = query
      c.setArray('main', res2.data)
      return { success: true, message: '' }
    } else {
      console.log(`loadMainCollection() err: ${res2.message}`)
      return { success: false, message: <string>res2.message }
    }
  }

  async function loadItem(module: TModule, slug: string,) {
    //const tmp: TNewFields<'Fauna'> = {base_taxon_id: 56}
    //console.log(`prepare.loadItem() slug: ${slug}`)
    const sp = p.parseSlug(module, slug)
    if (!sp.success) {
      console.log(`parseSlug() failed`)
      throw (<TParseErrorDetails>sp.data).error
    }

    n.showSpinner(`Loading ${module} item...`)

 const res = await send2<TApiItemShow<TGenericFields>>('model/show', 'post', { model: module, slug: slug, params: sp.data })

 if (res.success) {
      r.to.slug = res.data.slug
      //r.to.idParams = res.data.id_params
      setItemMedia(res.data.media)
      c.setArray('related', res.data.related)
      i.saveitemFieldsPlus(res.data)
      n.showSpinner(false)
 
  return { success: true, message: '' }
} else {
 
  return { success: false, message: <string>res.message }
}

    ///////////
    // try {
    //   const res = await send('model/show', 'post', { model: module, slug: slug, params: sp.data })
    //   //console.log(`show() returned (success). res: ${JSON.stringify(res, null, 2)}`)
    //   r.to.slug = res.data.slug
    //   r.to.idParams = res.data.id_params
    //   setItemMedia(res.data.media)
    //   c.setArray('related', res.data.related)
    //   i.saveitemFieldsPlus(res.data)
    //   n.showSpinner(false)
    //   return true

    // } catch (err) {
    //   console.log(`*********** loadItem() failed **************`)
    //   n.showSpinner(false)
    //   throw err
    // }
  }

  async function loadPage(firstPage: boolean): Promise<void> {
    return await c.loadPageByItemIndex('main', c.collection('main').value.meta.view, firstPage ? 0 : i.itemIndex, r.to.module)
  }

  async function itemSetIndexInCollection(): Promise<boolean> {
    //console.log(`prepare.itemSetIndexInCollection()`)
    const itemIndex = c.itemIndexById(i.id)
    if (itemIndex === -1) {
      console.log(`Item not found in mainCollection - set itemIndex to -1, clear page`)
      //c.mainPageArray = []
      i.itemIndex = -1
      return false
    } else {
      i.itemIndex = itemIndex
      return true
    }
  }


  function prepareForMedia(): void {
    console.log(`prepareForMedia()`)
  }

  return { prepareForNewRoute }
})
