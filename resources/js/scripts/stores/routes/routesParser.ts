// routesStore.js
//handles the entire routing mechanism - parsing, loading resources, error handling

import type { TParsingError, TParseErrorDetails, TParseUrlModuleResponse, TParseUrlQueryResponse, TParseSlugResponse, TParseSlugData, TName, TModule, TRouteInfo } from '../../../types/routesTypes'
import type { LocationQuery, RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { defineStore, storeToRefs } from 'pinia'
import { useTrioStore } from '../../../scripts/stores/trio';


const moduleConversion = {
    auth: 'Auth',
    admin: 'Admin',
    loci: 'Locus',
    fauna: 'Fauna',
    stones: "Stone"
}

export const useRoutesParserStore = defineStore('routesParser', () => {
    let trio = useTrioStore()

    function parseModule(module: string): TParseUrlModuleResponse {
        console.log(`parseModule() module: "${module}"`)
        switch (module) {
            case "admin":
            case "auth":
            case "loci":
            case "stones":
            case 'fauna':
                //m.to.module = <TModule>moduleConversion[module]
                //m.to.url_module = module
                return { success: true, data: { module: <TModule>moduleConversion[module], url_module: module } }

            default:
                console.log(`******* URL Parser error: Unsupported module name "${module}" *********`)
                return {
                    success: true,
                    data: {
                        error: 'BadModuleName',
                        message: `unknown url module "${module}"`
                    }
                }
        }
    }


    function parseSlug(module: TModule, urlId: string): TParseSlugResponse {
        //console.log(`parseUrlId() module: ${module}, urlId: ${urlId}`);
        switch (module) {
            case "Locus":

                break;
            case "Fauna":

                break;
            case "Stone":

                break;
        }
        return { success: true, data: { url_id: urlId, url_params: undefined } }
    }

    function parseQuery(module: TModule | null, urlQuery: LocationQuery): TParseUrlQueryResponse {
        let res = trio.urlQueryObjectToApiFilters(urlQuery)
        //console.log(`parseQuery() urlQuery: ${JSON.stringify(urlQuery, null, 2)}`);
        //to.queryParams = urlQuery
        return { success: true, data: res.data }
    }

    return { parseModule, parseSlug, parseQuery }
})
