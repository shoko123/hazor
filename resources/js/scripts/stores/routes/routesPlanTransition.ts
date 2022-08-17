// routesStore.js
//handles the entire routing mechanism - parsing, loading resources, error handling

import type { TParsingError, TParseResponse, TName, TModule, TRouteInfo, TRouteEntityFlags, TPlanResponse, TPreparePlan, TTransitionError } from '../../../types/routesTypes'
import { useXhrStore } from '../xhr';
import { useMainStore } from '../main';
import { useAuthStore } from '../auth';
import { useNotificationsStore } from '../notifications';
import { router } from '../../setups/vue-router'
import type { LocationQuery, RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { ref } from 'vue'
import { computed } from 'vue'



export function planTransition(to: TRouteInfo, from: TRouteInfo): TPlanResponse {
    let changed = { module: false, name: false, id: false }
    let data: TPreparePlan | TTransitionError = { scaffold: 'none', mainCollection: 'none', item: 'none' }


    if (to.module !== from.module) {
        changed.module = true
    }
    if (to.name !== from.name) {
        changed.name = true
    }
    if (to.idParams?.id !== from.idParams?.id) {
        changed.id = true
    }

    if (to.name === 'home') {
        data.scaffold = 'reset'
        data.mainCollection = 'reset'
        data.item = 'reset'
        return { success: true, data }
    }

    if (['Auth', 'Admin'].includes(to.module) ||
        ['Auth', 'Admin'].includes(from.module)) {
        return { success: true, data }
    }


    switch (from.name) {
        case 'home':
            switch (to.name) {
                case 'welcome':
                    data.scaffold = 'load'
                    data.mainCollection = 'reset'
                    data.item = 'reset'
                    return { success: true, data }

                default:
                    return { success: false, data: 'BadTransition' }
            }
            break

        case 'welcome':
            switch (to.name) {
                case 'welcome':
                    if (changed.module) {
                        data.scaffold = 'load'
                        data.mainCollection = 'reset'
                        data.item = 'reset'
                        return { success: true, data }
                    } else {
                        console.log("routes - welcome -> welcome with the same module")
                        return { success: true, data }
                    }

                case 'index':
                    data.scaffold = 'none'
                    data.mainCollection = 'load'
                    data.item = 'reset'
                    return { success: true, data }

                case 'show':
                    data.scaffold = 'none'
                    data.mainCollection = 'load'
                    data.item = 'load'
                    return { success: true, data }

                default:
                    return { success: false, data: 'BadTransition' }
            }
            break

        case 'filter':
            switch (to.name) {
                case 'index':
                    data.scaffold = 'none'
                    data.mainCollection = 'load'
                    data.item = 'reset'
                    return { success: true, data }

                case 'welcome':
                    return { success: true, data }

                default:
                    return { success: false, data: 'BadTransition' }
            }
            break

        case 'index':
            switch (to.name) {
                case 'welcome':
                    if (changed.module) {
                        data.scaffold = 'load'
                        data.mainCollection = 'reset'
                        data.item = 'reset'
                        return { success: true, data }
                    } else {
                        return { success: true, data }
                    }

                case 'filter':
                    data.scaffold = 'none'
                    data.mainCollection = 'reset'
                    data.item = 'reset'
                    return { success: true, data }

                case 'show':
                    data.scaffold = 'none'
                    data.mainCollection = 'load'
                    data.item = 'load'
                    return { success: true, data }
                default:
                    return { success: false, data: 'BadTransition' }
            }
            break

        case 'show':
            switch (to.name) {
                case 'welcome':
                    if (changed.module) {
                        data.scaffold = 'none'
                        data.mainCollection = 'reset'
                        data.item = 'reset'
                        return { success: true, data }
                    } else {
                        return { success: true, data }
                    }

                case 'filter':
                    data.scaffold = 'none'
                    data.mainCollection = 'reset'
                    data.item = 'reset'
                    return { success: true, data }

                case 'index':
                    if (changed.module) {
                        console.log("routes - show -> index with a different module")
                        return { success: false, data: 'BadTransition' }
                    } else {
                        data.scaffold = 'none'
                        data.mainCollection = 'none'
                        data.item = 'reset'
                        return { success: true, data }
                    }

                case 'show':
                    if (changed.module) {
                        data.scaffold = 'load'
                        data.mainCollection = 'load'
                        data.item = 'load'
                        return { success: true, data }
                    }
                    if (changed.id) {
                        data.scaffold = 'none'
                        data.mainCollection = 'none'
                        data.item = 'load'
                        return { success: true, data }
                    }

                case 'create': data.scaffold = 'none'
                    data.mainCollection = 'none'
                    data.item = 'prepareNew'
                    return { success: true, data }

                case 'update': data.scaffold = 'none'
                    data.mainCollection = 'none'
                    data.item = 'prepareUpdate'
                    return { success: true, data }

                case 'tags': data.scaffold = 'none'
                    data.mainCollection = 'none'
                    data.item = 'prepareTag'
                    return { success: true, data }

                case 'media': data.scaffold = 'none'
                    data.mainCollection = 'none'
                    data.item = 'prepareMedia'
                    return { success: true, data }
                default:
                    return { success: false, data: 'BadTransition' }
            }
            break

        case 'create':
        case 'update':
        case 'tags':
        case 'media':
            if (to.name !== 'show' || to.idParams?.id !== from.idParams?.id) {
                console.log("routes - mutate -> show with a different id")
                return { success: false, data: 'BadTransition' }
            } else {
                return { success: true, data }
            }

        default:
            return { success: false, data: 'BadTransition' }
    }
}