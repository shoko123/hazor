//routesPrepare
//At this point the new route is assured to have a correct form and all r
//relevant fields are stored in routesStore from and to.
//Now we need to decide on the loading sequence and do the loading.

import type { TRouteInfo, TPreparePlan } from '../../../types/routesTypes';
import { defineStore, storeToRefs } from 'pinia'
import { useXhrStore } from '../xhr';
import { useTrioStore } from '../trio';
import { useCollectionsStore } from '../collections';
import { useModuleStore } from '../module';
import { useNotificationsStore } from '../notifications';

export const useRoutesPrepareStore = defineStore('routesPrepare', () => {

  async function prepareForNewRoute(to: TRouteInfo, from: TRouteInfo, plan: TPreparePlan): Promise<boolean> {

    let xhr = useXhrStore();
    let n = useNotificationsStore();
    let m = useModuleStore();
    let c = useCollectionsStore();
    let t = useTrioStore();

    switch (plan.scaffold) {
      case 'load':
        t.clearFilters()
        n.showSpinner('Loading module data ...')
        await xhr.send('model/init', 'post', { model: to.module })
          .then(res => {
            //console.log(`auth.response is ${JSON.stringify(res, null, 2)}`)
            m.counts = res.data.counts
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
        break;
      case 'reset':
      //reset
      default:
      //nothing
    }

    switch (plan.mainCollection) {
      case 'load':

        n.showSpinner(`Loading ${to.url_module} ...`)
        console.log(`Navigation loading main collection...`)
        await xhr.send('model/index', 'post', { model: to.module })
          .then(res => {
            console.log(`index() returned (success)`)
            //console.log(`index() returned res: ${JSON.stringify(res, null, 2)}`)
            c.setCollectionElement('main', 'array', res.data.collection)
            c.setCollectionElement('main', 'viewIndex', 0)
            c.setCollectionElement('main', 'page', 1)
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
          case 'reset':
            //reset mainCollection
            default:
              //nothing
    }

    switch (plan.item) {
      case 'load':


        console.log(`Navigation to index: loading...`)
        // await xhr.send('model/index', 'post', { model: to.module })
        //   .then(res => {
        //     console.log(`index() returned res: ${JSON.stringify(res, null, 2)}`)
        //     c.setCollection('main', 'array', res.data.collection)
        //     return true
        //   })
        //   .catch(err => {
        //     n.showSnackbar(`Navigation to new routes failed. Navigation cancelled`)
        //     console.log(`Navigation to new routes failed with err: ${JSON.stringify(err, null, 2)}`)
        //     return false
        //   })
        //   .finally(() => {
        //     n.showSpinner(false)
        //   })
          case 'reset':
            //reset mainCollection
            default:
              //nothing
    }

    return true//Promise.resolve(true)




  }

  return { prepareForNewRoute }
})
