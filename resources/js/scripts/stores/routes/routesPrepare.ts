//routesPrepare
//At this point the new route is assured to have a correct form and all
//relevant fields are stored in routesStore from and to In addition, actions needed
//to complete the transition to the new route are stored in TPlanAction[].
//Here we execute the loading and other activities (e.g. clearFilters, copy current -> new, etc.).

import type { TRouteInfo, TPlanAction } from '../../../types/routesTypes';
import { defineStore } from 'pinia'
import { useXhrStore } from '../xhr';
import { useTrioStore } from '../trio';
import { useCollectionsStore } from '../collections';
import { useModuleStore } from '../module';
import { useNotificationsStore } from '../notifications';
import { useItemStore } from '../item';
export const useRoutesPrepareStore = defineStore('routesPrepare', () => {
  let xhr = useXhrStore();
  let n = useNotificationsStore();
  let m = useModuleStore();
  let { reset, setCollectionElement } = useCollectionsStore();
  let t = useTrioStore();
  let i = useItemStore();

  async function prepareForNewRoute(to: TRouteInfo, from: TRouteInfo, plan: TPlanAction[]): Promise<boolean> {
    for (const x of plan) {
      switch (x) {
        case 'trio.load':
          await loadTrio(to, from).catch(err => {
            return false
          })
          break

        case 'trio.clear':
          t.clearFilters()
          break

        case 'collection.load':
          await loadMainCollection(to, from).catch(err => {
            return false
          })
          break

        case 'collection.clear':
          reset()
          break
        case 'item.load':
          await loadItem(to, from).catch(err => {
            return false
          })
          break





        case 'item.clear':
          break

        default:
          console.log(`PrepareForNewRoute() Bad Action: ${x}`)
          return false
      }
    }
    return true
  }

  async function loadTrio(to: TRouteInfo, from: TRouteInfo) {
    t.clearFilters()
    n.showSpinner('Loading module data ...')
    await xhr.send('model/init', 'post', { model: to.module })
      .then(res => {
        //console.log(`auth.response is ${JSON.stringify(res, null, 2)}`)
        m.counts = res.data.counts
        m.itemViews = res.data.itemViews
        t.setTrio(res.data.trio)
        return true
      })
      .catch(err => {
        n.showSnackbar(`Navigation to new routes failed. Navigation cancelled`)
        console.log(`Navigation to new routes failed with err: ${JSON.stringify(err, null, 2)}`)
        return false
      })
      .finally(() => {
        n.showSpinner(false)
      })
  }

  async function loadMainCollection(to: TRouteInfo, from: TRouteInfo) {
    n.showSpinner(`Loading ${to.url_module} ...`)
    console.log(`Navigation loading main collection...`)
    await xhr.send('model/index', 'post', { model: to.module })
      .then(res => {
        console.log(`index() returned (success)`)
        //console.log(`index() returned res: ${JSON.stringify(res, null, 2)}`)
        setCollectionElement('main', 'array', res.data.collection, to.module)
        //setCollectionElement('main', 'viewIndex', 0, to.module)
        setCollectionElement('main', 'page', {pageNoB1: 1, viewIndex: 0}, to.module)
        console.log(`index() set array, index, page done`)
        return true
      })
      .catch(err => {
        n.showSnackbar(`Navigation to new routes failed. Navigation cancelled`)
        console.log(`Navigation to new routes failed with err: ${JSON.stringify(err, null, 2)}`)
        return false
      })
      .finally(() => {
        n.showSpinner(false)
      })
  }

  async function loadMainPage(to: TRouteInfo, pageB1: number) {
    n.showSpinner(`Loading ${to.url_module} Page...`)
    console.log(`Navigation loading page(${pageB1})...`)
    await xhr.send('model/index', 'post', { model: to.module })
      .then(res => {
        console.log(`index() returned (success)`)
        //console.log(`index() returned res: ${JSON.stringify(res, null, 2)}`)
        setCollectionElement('main', 'array', res.data.collection, to.module)
        setCollectionElement('main', 'viewIndex', 0, to.module)
        setCollectionElement('main', 'page', 1, to.module)
        console.log(`index() set array, index, page done`)
        return true
      })
      .catch(err => {
        n.showSnackbar(`Navigation to new routes failed. Navigation cancelled`)
        console.log(`Navigation to new routes failed with err: ${JSON.stringify(err, null, 2)}`)
        return false
      })
      .finally(() => {
        n.showSpinner(false)
      })
  }


  async function loadItem(to: TRouteInfo, from: TRouteInfo) {
    console.log(`routesPrepare.loadItem() to: ${JSON.stringify(to, null, 2)}`)
    n.showSpinner(`Loading item ${to.url_id} ...`)
    await xhr.send('model/show', 'post', { model: to.module, url_id: to.url_id })
      .then(res => {
        //console.log(`show() returned (success). res: ${JSON.stringify(res, null, 2)}`)
        i.fields = res.data.item
        return true
      })
      .catch(err => {
        console.log(`show() failed`)
        return false
      })
      .finally(() => {
        n.showSpinner(false)
      })
  }

  return { prepareForNewRoute }
})
