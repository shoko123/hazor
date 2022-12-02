// routesPlanTransition.ts
//decide on action needed before transitioning to a new route

import type { TRouteInfo, TPlanResponse, TPlanError, TPlanAction } from '../../../types/routesTypes'
import { defineStore } from 'pinia'
import { useCollectionsStore } from '../collections'

export const useRoutesPlanTransitionStore = defineStore('routesPlanTransition', () => {
    const {collectionMeta} = useCollectionsStore()

    function planTransition(to: TRouteInfo, from: TRouteInfo): TPlanResponse {
        let changed = { module: false, name: false, id: false }

        changed.module = (to.module !== from.module)
        changed.name = (to.name !== from.name)
        changed.id = (to.idParams?.id !== from.idParams?.id)

        if (['Auth', 'Admin'].includes(to.module) ||
            ['Auth', 'Admin'].includes(from.module)) {
            return { success: true, data: [] }
        }

        switch (to.name) {
            case 'home':
                return { success: true, data: ['clearItem', 'clearMainCollection', 'resetTrio'] }

            case 'welcome':
                switch (from.name) {
                    case 'home':
                        return { success: true, data: ['loadTrio'] }

                    case 'welcome':
                        if (changed.module) {
                            return { success: true, data: ['loadTrio', 'clearItem', 'clearMainCollection'] }
                        } else {
                            console.log("routes - welcome -> welcome with the same module")
                            return { success: true, data: [] }
                        }

                    case 'filter':
                    case 'index':
                        if (changed.module) {
                            return { success: true, data: ['loadTrio', 'clearItem', 'clearMainCollection'] }
                        } else {
                            console.log("routes - 'filter' or 'index' -> 'welcome' with the same module")
                            return { success: true, data: [] }
                        }

                    case 'show':
                        return { success: true, data: ['loadItem'] }

                    default:
                        return { success: false, data: 'BadTransition' }
                }
                break

            case 'filter':
                switch (from.name) {
                    case 'index':
                        return { success: true, data: ['clearMainCollection', 'clearItem'] }

                    case 'welcome':
                    case 'show':
                        if (changed.module) {
                            return { success: true, data: ['loadTrio', 'clearMainCollection', 'clearItem'] }
                        } else {
                            console.log("routes - filter from the same module")
                            return { success: true, data: ['clearMainCollection', 'clearItem'] }
                        }

                    default:
                        return { success: false, data: 'BadTransition' }
                }
                break

            case 'index':
                switch (from.name) {
                    case 'welcome':
                        if (changed.module) {
                            return { success: true, data: ['loadTrio', 'loadMainCollection', 'clearItem'] }
                        } else {
                            let toDo: TPlanAction[] = collectionMeta("main").length === 0 ? ['loadMainCollection'] : [] 
                            toDo.push('clearItem', 'loadMainCollection')
                            return { success: true, data: toDo }
                        }

                    case 'filter':
                        return { success: true, data: ['loadMainCollection', 'clearItem'] }

                    case 'show':
                        return { success: true, data: [] }
                    default:
                        return { success: false, data: 'BadTransition' }
                }
                break

            case 'show':
                switch (from.name) {
                    case 'show':
                        if (changed.module) {
                            return { success: true, data: ['clearItem', 'clearMainCollection', 'resetTrio', 'loadMainCollection', 'loadItem'] }
                        }
                        if (changed.id) {
                            return { success: true, data: ['loadItem'] }
                        }
                        return { success: false, data: 'BadTransition' }

                    case 'home':
                        return { success: true, data: ['clearItem', 'clearMainCollection', 'resetTrio'] }

                    case 'welcome':
                        return { success: true, data: ['loadMainCollection', 'loadItem'] }

                    case 'index':
                        return { success: true, data: ['loadItem'] }

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

