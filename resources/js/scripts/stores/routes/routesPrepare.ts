//routesPrepare
//At this point the new route is assured to have a correct form and all
//relevant fields are stored in routesStore.from and .to. Actions needed
//to complete the transition to the new route are stored in TPlanAction[].
//Here we execute the loading of assets (collection, page, item)and other 
//activities (e.g. clear, copy current -> new,), before
//proceeding to the new route.

import type { TRouteInfo, TPlanAction, TPrepareResponse, TModule, TParseSlugData, TParseSlugResponse, TParseErrorDetails } from '@/js/types/routesTypes'
import type { RouteLocationNormalized, RouteLocationRaw, LocationQuery } from 'vue-router'
import { TLocusFields, TStoneFields, TFaunaFields, } from '@/js/types/moduleFieldsTypes'
import { ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useXhrStore } from '../xhr'
import { useTrioStore } from '../trio'
import { useCollectionsStore } from '../collections/collections'
import { useModuleStore } from '../module'
import { useNotificationsStore } from '../notifications'
import { useItemStore } from '../item'
import { useRoutesMainStore } from './routesMain'
import { useRoutesParserStore } from './routesParser'
import { EmptyResultSetError } from '../../setups/routes/errors'

export const useRoutesPrepareStore = defineStore('routesPrepare', () => {
  let xhr = useXhrStore();
  let n = useNotificationsStore();
  let m = useModuleStore();
  let c = useCollectionsStore()
  let t = useTrioStore();
  let i = useItemStore();
  let r = useRoutesMainStore()
  let p = useRoutesParserStore()

  async function prepareForNewRoute(module: TModule, query: LocationQuery, slug: string, plan: TPlanAction[]): Promise<TPrepareResponse> {
    for (const x of plan) {
      switch (x) {
        case 'module.load':
          await loadTrio(module).catch(err => {
            throw 'ModuleInitError'
          })
          break

        case 'module.clear':
          t.trioReset()
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
          t.clearSelected('Item')
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
    console.log(`PrepareForNewRoute() success after completing queue`)
    return { success: true }
  }

  async function loadTrio(module: TModule) {
    t.trioReset()
    n.showSpinner('Loading module data ...')
    return xhr.send('model/init', 'post', { model: module })
      .then(res => {
        //console.log(`auth.response is ${JSON.stringify(res, null, 2)}`)
        console.log(`model(${module}).init() returned (success)`)
        m.counts = res.data.counts
        m.itemViews = res.data.itemViews
        c.clear(['main', 'media', 'related'])
        t.setTrio(res.data.trio)
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
    console.log(`loadCollectionAndItem done!`)

  }

  async function loadMainCollection(module: TModule, query: LocationQuery) {
    let queryRes = p.parseQuery(module, query)

    if (!queryRes.success) {
      console.log(`parseQuery() failed`)
      throw (<TParseErrorDetails>queryRes.data).error
    }

    n.showSpinner(`Loading ${module} collection...`)
    console.log(`prepare.loadMainCollection()`)
    return xhr.send('model/index', 'post', { model: module, query: queryRes.data })
      .then(res => {
        if(res.data.collection.length === 0){
          throw EmptyResultSetError
        }
        r.to.queryParams = query
        c.setArray('main', res.data.collection)
        console.log(`collection loaded successfully`)
      })
      .catch(err => {
        console.log(`loadMainCollection() failed. err: ${JSON.stringify(err, null, 2)}`)
        throw err
      })
      .finally(() => {
        n.showSpinner(false)
      })
  }


  async function loadItem(module: TModule, slug: string, ) {
    console.log(`prepare.loadItem() slug: ${slug}`)
    let sp = p.parseSlug(module, slug)
    if (!sp.success) {
      console.log(`parseSlug() failed`)
      throw (<TParseErrorDetails>sp.data).error
    }

    n.showSpinner(`Loading ${module} item...`)

    try {
      let res = await xhr.send('model/show', 'post', { model: module, slug: slug, params: sp.data })
      //console.log(`show() returned (success). res: ${JSON.stringify(res, null, 2)}`)
      //let idResData = <TParseSlugData>sp.data
      r.to.slug = res.data.slug
      r.to.idParams = res.data.id_params

      i.saveItem(res.data)
      n.showSpinner(false)
      return true

    } catch (err) {
      console.log(`loadItem() failed`)
      n.showSpinner(false)
      throw err
    }
  }

  async function loadPage(firstPage: boolean): Promise<void> {
    console.log(`prepare.loadPage()`)
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
