// auth.js
//handles and stores user's login and capabilities
import { defineStore } from 'pinia'
import { useXhrStore } from '../stores/xhr';
import { useNotificationsStore } from '../stores/notifications';
import { router } from '../setups/vue-router'
import type { RouteLocationNormalized } from 'vue-router'

export const useRoutesStore = defineStore('routesStore', {

    state: () => {
        return {
            current: {
                module: "Home",
                apiModuleUrl: "/api",
                moduleStoreFolder: "/",
                action: null,
                id: null,
                dotParams: {},
                dot: null,
                queryParams: null,
            },
            to: {
                module: null,
                apiModuleUrl: null,
                moduleStoreFolder: "/",
                action: null,
                id: null,
                dotParams: {},
                dot: null,
                queryParams: null,
            },
            localFilters: null,
            loading: false,
        }
    },
    getters: {
        isLoading: (state) => false,
    },

    actions: {  
        parseAndAuthorize(to: RouteLocationNormalized, from: RouteLocationNormalized): boolean {
            console.log(`middleware.parsAndAuthorize ()`)
            return true
        },

        async prepareForNewRoute(to: RouteLocationNormalized, from: RouteLocationNormalized) {
            console.log(`middleware.prepareForNewRoute ()`)
            //console.log(`middleware.authorize() to.path: ${to.path} appSettings: ${JSON.stringify(appSettings, null, 2)}\nisLoggedIn: ${isLoggedIn}`);
        },
    },
})
