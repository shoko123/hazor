// routesPlanTransition.ts
//decide on action needed before transitioning to a new route

import type { TRouteInfo, TPlanResponse, TPlanError, TPlanAction } from '../../../types/routesTypes'
import { defineStore } from 'pinia'

export const useRoutesPlanTransitionStore = defineStore('routesPlanTransition', () => {


    function planTransition(to: TRouteInfo, from: TRouteInfo): TPlanResponse {
        let changed = { module: false, name: false, urlId: false }

        changed.module = (to.module !== from.module)
        changed.name = (to.name !== from.name)
        changed.urlId = (to.url_id !== from.url_id)

        if (['Auth', 'Admin'].includes(to.module) ||
            ['Auth', 'Admin'].includes(from.module)) {
            return { success: true, data: [] }
        }

        switch (to.name) {
            case 'home':
                return { success: true, data: ['item.clear', 'collection.clear', 'module.clear'] }

            case 'welcome':
                switch (from.name) {
                    case 'home':
                        return { success: true, data: ['module.load'] }

                    case 'welcome':
                        if (changed.module) {
                            return { success: true, data: ['module.load', 'item.clear', 'collection.clear'] }
                        } else {
                            console.log("routes - welcome -> welcome with the same module")
                            return { success: true, data: [] }
                        }

                    case 'filter':
                    case 'index':
                        if (changed.module) {
                            return { success: true, data: ['module.load', 'item.clear', 'collection.clear'] }
                        } else {
                            console.log("routes - 'filter' or 'index' -> 'welcome' with the same module")
                            return { success: true, data: [] }
                        }

                    case 'show':
                        return { success: true, data: ['item.clear'] }

                    default:
                        return { success: false, data: 'BadTransition' }
                }
                break

            case 'filter':
                switch (from.name) {
                    case 'index':
                        return { success: true, data: ['collection.clear', 'item.clear'] }

                    case 'welcome':
                    case 'show':
                        if (changed.module) {
                            return { success: true, data: ['module.load', 'collection.clear', 'item.clear'] }
                        } else {
                            console.log("routes - filter from the same module")
                            return { success: true, data: ['collection.clear', 'item.clear'] }
                        }

                    default:
                        return { success: false, data: 'BadTransition' }
                }

            case 'index':
                switch (from.name) {
                    case 'home':
                        return { success: true, data: ['module.load', 'collection.load', 'page.load1'] }
                    case 'welcome':
                        if (changed.module) {
                            return { success: true, data: ['module.load', 'collection.load', 'page.load1'] }
                        } else {
                            return { success: true, data: ['collection.load', 'page.load1'] }
                        }

                    case 'filter':
                        return { success: true, data: ['collection.load', 'page.load1'] }

                    case 'show':
                        return { success: true, data: ['page.load', 'item.clear'] }
                    default:
                        return { success: false, data: 'BadTransition' }
                }
                break

            case 'show':
                switch (from.name) {
                    case 'show':
                        if (changed.module) {
                            return { success: true, data: ['item.clear', 'collection.clear', 'module.clear', 'module.load', 'collection.item.load', 'item.setIndexInCollection'] }
                        }
                        if (changed.urlId) {
                            return { success: true, data: ['item.load', 'item.setIndexInCollection'] }
                        }
                        return { success: false, data: 'BadTransition' }

                    case 'home':
                        return { success: true, data: ['module.load', 'collection.item.load', 'item.setIndexInCollection'] }

                    case 'welcome':
                        return { success: true, data: ['collection.item.load', 'item.setIndexInCollection'] }

                    case 'index':
                        return { success: true, data: ['item.load', 'item.setIndexInCollection'] }

                    case 'create':
                        return { success: true, data: ['item.load'] }

                    case 'update':
                        return { success: true, data: ['item.load'] }

                    case 'tags':
                        return { success: true, data: [] }

                    case 'media':
                        return { success: true, data: [] }
                    default:
                        return { success: false, data: 'BadTransition' }
                }
                break

            case 'create':
                 switch (from.name) {
                    case 'show':
                        return { success: true, data: ['item.prepareForCreate'] }
                    default:
                        return { success: false, data: 'BadTransition' }
                }
            case 'update':
                switch (from.name) {
                    case 'show':
                        return { success: true, data: ['item.prepareForUpdate'] }
                    default:
                        return { success: false, data: 'BadTransition' }
                }
            case 'tags':
            case 'media':
                switch (from.name) {
                    case 'show':
                        return { success: true, data: ['item.prepareForMedia'] }
                    default:
                        return { success: false, data: 'BadTransition' }
                }
            default:
                return { success: false, data: 'BadTransition' }
        }
    }
    return { planTransition }
})

