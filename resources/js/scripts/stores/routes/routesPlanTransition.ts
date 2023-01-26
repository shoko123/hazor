// routesPlanTransition.ts
//decide on action needed before transitioning to a new route

import type { TRouteInfo, TPlanResponse, TPlanError, TPlanAction } from '../../../types/routesTypes'
import { defineStore } from 'pinia'
import { useCollectionsStore } from '../collections'

export const useRoutesPlanTransitionStore = defineStore('routesPlanTransition', () => {
    const {collectionMeta} = useCollectionsStore()

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
                return { success: true, data: ['item.clear', 'collection.clear', 'trio.clear'] }

            case 'welcome':
                switch (from.name) {
                    case 'home':
                        return { success: true, data: ['trio.load'] }

                    case 'welcome':
                        if (changed.module) {
                            return { success: true, data: ['trio.load', 'item.clear', 'collection.clear'] }
                        } else {
                            console.log("routes - welcome -> welcome with the same module")
                            return { success: true, data: [] }
                        }

                    case 'filter':
                    case 'index':
                        if (changed.module) {
                            return { success: true, data: ['trio.load', 'item.clear', 'collection.clear'] }
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
                            return { success: true, data: ['trio.load', 'collection.clear', 'item.clear'] }
                        } else {
                            console.log("routes - filter from the same module")
                            return { success: true, data: ['collection.clear', 'item.clear'] }
                        }

                    default:
                        return { success: false, data: 'BadTransition' }
                }
                break

            case 'index':
                switch (from.name) {
                    case 'home':
                         return { success: true, data: ['trio.load', 'collection.load'] }
                    case 'welcome':
                        if (changed.module) {
                            return { success: true, data: ['trio.load', 'collection.load', 'item.clear'] }
                        } else {
                            let toDo: TPlanAction[] = collectionMeta("main").length === 0 ? ['collection.load'] : [] 
                            toDo.push('item.clear', 'collection.load')
                            return { success: true, data: toDo }
                        }

                    case 'filter':
                        return { success: true, data: ['collection.load', 'item.clear'] }

                    case 'show':
                        return { success: true, data: ['page.set'] }
                    default:
                        return { success: false, data: 'BadTransition' }
                }
                break

            case 'show':
                switch (from.name) {
                    case 'show':
                        if (changed.module) {
                            return { success: true, data: ['item.clear', 'collection.clear', 'trio.clear', 'collection.load', 'item.load'] }
                        }
                        if (changed.urlId) {
                            return { success: true, data: ['item.load'] }
                        }
                        return { success: false, data: 'BadTransition' }

                    case 'home':
                        return { success: true, data: ['trio.load', 'collection.item.load'] }

                    case 'welcome':
                        return { success: true, data: ['collection.item.load'] }

                    case 'index':
                        return { success: true, data: ['item.load'] }

                    case 'create':
                        return { success: true, data: [] }

                    case 'update':
                        return { success: true, data: [] }

                    case 'tags':
                        return { success: true, data: [] }

                    case 'media':
                        return { success: true, data: [] }
                    default:
                        return { success: false, data: 'BadTransition' }
                }
                break

            case 'create':
            case 'update':
            case 'tags':
            case 'media':
            default:
                return { success: false, data: 'BadTransition' }
        }
    }
    return { planTransition }
})

