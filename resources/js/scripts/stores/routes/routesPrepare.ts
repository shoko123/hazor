// routesPrepare
//at this point the new route is assured to be synthecly correct and all relevant fields
//are stored in routesStore from and to.
//Now we need to decide on the loading sequence and do the loading.

import { defineStore, storeToRefs } from 'pinia'
import { useXhrStore } from '../xhr';
import { useMainStore } from '../main';
import { useAuthStore } from '../auth';
import { useModuleStore } from '../module';
import { useNotificationsStore } from '../notifications';
import { router } from '../../setups/vue-router'
import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { ref } from 'vue'
import { computed } from 'vue'
import type { TUrlModule, TModule, TRouteInfo, TParsingError, TParseResponse } from '../../../types/routesTypes';

export const useRoutePrepareStore = defineStore('routePrepareStore', () => {

async function prepareForNewRoute(to: TRouteInfo, from: TRouteInfo): Promise<boolean>{

    let xhr = useXhrStore();
    let n = useNotificationsStore();
    let m = useModuleStore();
    
    //if navigate to a new module initialize module (unless Auth or Home)
    if(to.module !== from.module && to.module !== 'Auth' && to.module !== 'Home') {
        await xhr.send('model/hydrate', 'post', { model: to.module })
        .then(res => {
          //console.log(`auth.response is ${JSON.stringify(res, null, 2)}`)
          m.name = <TModule>to.module
          m.counts = res.data.counts
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
    } else {
      m.name = <TModule>to.module
    }
    return true//Promise.resolve(true)


    
    
}

return { prepareForNewRoute }
})
