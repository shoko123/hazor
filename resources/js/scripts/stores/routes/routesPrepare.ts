//routesPrepare
//At this point the new route is assured to have a correct form and all
//relevant fields are stored in routesStore.from and .to. Actions needed
//to complete the transition to the new route are stored in TPlanAction[].
//Here we execute the loading of assets (collection, page, item)and other 
//activities (e.g. clear, copy current -> new,), before
//proceeding to the new route.

import type { TRouteInfo, TPlanAction, TPrepareResponse, TModule, TParseSlugData, TParseQueryData, TParseErrorDetails } from '@/js/types/routesTypes'
import type { RouteLocationNormalized, RouteLocationRaw, LocationQuery } from 'vue-router'
import { TLocusFields, TStoneFields, TFaunaFields, } from '@/js/types/moduleFieldsTypes'
import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
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
import { EmptyResultSetError } from '../../setups/routes/errors'

export const useRoutesPrepareStore = defineStore('routesPrepare', () => {
  let xhr = useXhrStore()
  let n = useNotificationsStore()
  let m = useModuleStore()
  let c = useCollectionsStore()
  let i = useItemStore();
  let r = useRoutesMainStore()
  let p = useRoutesParserStore()
  let f = useFilterStore()
  let { trioReset, setTrio } = useTrioStore()
  let { setItemMedia } = useMediaStore()
  const fromUndef = ref<boolean>(false)

  async function prepareForNewRoute(module: TModule, query: LocationQuery, slug: string, plan: TPlanAction[], fromUndefined: boolean): Promise<TPrepareResponse> {
    fromUndef.value = fromUndefined
    for (const x of plan) {
      switch (x) {
        case 'module.load':
          await loadModule(module).catch(err => {
            throw 'ModuleInitError'
          })
          break

        case 'module.clear':
          trioReset()
          break

        case 'collection.item.load':
          await loadCollectionAndItem(module, query, slug).catch(err => {
            throw "LoadCollectionAndItemFError"
          })
          break

        case 'collection.load':
          await loadMainCollection(module, query).catch(err => {
            if (err === EmptyResultSetError) {
              throw err
            } else {
              throw 'CollectionLoadError'
            }
          })

          break

        case 'collection.clear':
          c.clear(['main', 'media', 'related'])
          break

        case 'item.load':
          await loadItem(module, slug).catch(err => {
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
    return xhr.send('model/init', 'post', { model: module })
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

    const [col, item] = await Promise.all([
      loadMainCollection(module, query),
      loadItem(module, slug)
    ])
      .catch(err => {
        throw err;
      });
    //console.log(`loadCollectionAndItem done!`)
  }

  async function loadMainCollection(module: TModule, query: LocationQuery) {
    let queryRes
    try {
      queryRes = f.urlQueryToFilters(query)
      //console.log(`loadMainCollection()  queryRes:  ${JSON.stringify(queryRes, null, 2)}`)
    }
    catch (err) {
      console.log(`parseQuery() failed`)
      throw err
    }
    if (!queryRes.success) {
      throw (<TParseErrorDetails>queryRes.data).error
    }
    let apiQuery = <TParseQueryData>queryRes.data
    if (fromUndef.value) {
      f.setFiltersFromUrlQuery(apiQuery.selectedFilters)
    }

    n.showSpinner(`Loading ${module} collection...`)
    //console.log(`prepare.loadMainCollection()`)
    return xhr.send('model/index', 'post', { model: module, query: apiQuery.apiFilters })
      .then(res => {
        if (res.data.collection.length === 0) {
          throw EmptyResultSetError
        }
        r.to.queryParams = query
        c.setArray('main', res.data.collection)
        //console.log(`collection loaded successfully`)
      })
      .catch(err => {
        console.log(`loadMainCollection() failed. err: ${JSON.stringify(err, null, 2)}`)
        throw err
      })
      .finally(() => {
        n.showSpinner(false)
      })
  }


  async function loadItem(module: TModule, slug: string,) {
    //console.log(`prepare.loadItem() slug: ${slug}`)
    let sp = p.parseSlug(module, slug)
    if (!sp.success) {
      console.log(`parseSlug() failed`)
      throw (<TParseErrorDetails>sp.data).error
    }

    n.showSpinner(`Loading ${module} item...`)

    try {
      let res = await xhr.send('model/show', 'post', { model: module, slug: slug, params: sp.data })
      //console.log(`show() returned (success). res: ${JSON.stringify(res, null, 2)}`)
      r.to.slug = res.data.slug
      r.to.idParams = res.data.id_params
      setItemMedia(res.data.media)
      c.setArray('related', res.data.related)
      i.saveItem(res.data)
      n.showSpinner(false)
      return true

    } catch (err) {
      console.log(`*********** loadItem() failed **************`)
      n.showSpinner(false)
      throw err
    }
  }

  async function loadPage(firstPage: boolean): Promise<void> {
    //console.log(`prepare.loadPage()`)
    return await c.loadPageByItemIndex('main', c.collection('main').value.meta.view, firstPage ? 0 : i.itemIndex, r.to.module)
  }

  async function itemSetIndexInCollection(): Promise<boolean> {
    //console.log(`prepare.itemSetIndexInCollection()`)
    let itemIndex = c.itemIndexById(i.id)
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
    //
  }

  return { prepareForNewRoute }
})
