// routesPlanTransition.ts
//decide on action needed before transitioning to a new route

import type { TRouteInfo, TPlanResponse, TPreparePlan, TTransitionError } from '../../../types/routesTypes'
import { defineStore, storeToRefs } from 'pinia'
import { useCollectionsStore } from '../collections'

export const useRoutesPlanTransitionStore = defineStore('routesPlanTransition', () => {
    const { main } = storeToRefs(useCollectionsStore())
    
    function planTransition(to: TRouteInfo, from: TRouteInfo): TPlanResponse {
        let changed = { module: false, name: false, id: false }
        let data: TPreparePlan | TTransitionError = { scaffold: 'none', mainCollection: 'none', item: 'none' }

        changed.module = (to.module !== from.module)
        changed.name = (to.name !== from.name)
        changed.id = (to.idParams?.id !== from.idParams?.id)

        if (['Auth', 'Admin'].includes(to.module) ||
            ['Auth', 'Admin'].includes(from.module)) {
            return { success: true, data }
        }


        switch (to.name) {
            case 'home':
                data.scaffold = 'reset'
                data.mainCollection = 'reset'
                data.item = 'reset'
                return { success: true, data }

            case 'welcome':
                switch (from.name) {
                    case 'home':
                        data.scaffold = 'load'
                        data.mainCollection = 'reset'
                        data.item = 'reset'
                        return { success: true, data }

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

                    case 'filter':
                    case 'index':
                        if (changed.module) {
                            data.scaffold = 'load'
                            data.mainCollection = 'reset'
                            data.item = 'reset'
                            return { success: true, data }
                        } else {
                            console.log("routes - 'filter' or 'index' -> 'welcome' with the same module")
                            return { success: true, data }
                        }

                    case 'show':
                        data.scaffold = 'none'
                        data.mainCollection = 'none'
                        data.item = 'reset'
                        return { success: true, data }

                    default:
                        return { success: false, data: 'BadTransition' }
                }
                break

            case 'filter':
                switch (from.name) {
                    case 'index':
                        data.scaffold = 'none'
                        data.mainCollection = 'reset'
                        data.item = 'reset'
                        return { success: true, data }

                    case 'welcome':
                    case 'show':
                        if (changed.module) {
                            data.scaffold = 'load'
                            data.mainCollection = 'reset'
                            data.item = 'reset'
                            return { success: true, data }
                        } else {
                            console.log("routes - filter from the same module")
                            data.scaffold = 'none'
                            data.mainCollection = 'reset'
                            data.item = 'reset'
                            return { success: true, data }
                        }
                        return { success: true, data }

                    default:
                        return { success: false, data: 'BadTransition' }
                }
                break

            case 'index':
                switch (from.name) {
                    
                    case 'welcome':
                        if (changed.module) {
                            data.scaffold = 'load'
                            data.mainCollection = 'load'
                            data.item = 'reset'
                            return { success: true, data }
                        } else {
                            data.scaffold = 'none'
                            data.mainCollection = main.value.length === 0 ? 'load' : 'none'
                            data.item = 'reset'
                            return { success: true, data }
                        }

                    case 'filter':
                        data.scaffold = 'none'
                        data.mainCollection = 'load'
                        data.item = 'reset'
                        return { success: true, data }

                    case 'show':
                        data.scaffold = 'none'
                        data.mainCollection = 'none'
                        data.item = 'load'
                        return { success: true, data }
                    default:
                        return { success: false, data: 'BadTransition' }
                }
                break

            case 'show':
                switch (from.name) {
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
                if (from.name !== 'show' || to.idParams?.id !== from.idParams?.id) {
                    console.log("routes - mutate -> show with a different id")
                    return { success: false, data: 'BadTransition' }
                } else {
                    return { success: true, data }
                }

            default:
                return { success: false, data: 'BadTransition' }
        }
    }
    return { planTransition }
})

