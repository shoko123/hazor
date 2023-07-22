// routesStore.js
//handles the entire routing mechanism - parsing, loading resources, error handling

import type { TParsingError, TParseErrorDetails, TParseUrlModuleResponse, TParseUrlQueryResponse, TParseSlugResponse, TParseSlugData, TName, TModule, TRouteInfo } from '../../../types/routesTypes'
import type { TIdParams, TLocusIdParams, TStoneIdParams, TFaunaIdParams, } from '../../../types/moduleIdParamsTypes'

import type { LocationQuery, RouteLocationNormalized, RouteLocationRaw } from 'vue-router'
import { defineStore, storeToRefs } from 'pinia'
import { useTrioStore } from '../trio/trio'
import { useLocusStore } from '../modules/locus'
import { useFaunaStore } from '../modules/fauna'
import { useStoneStore } from '../modules/stone'


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
                    success: false,
                    data: {
                        error: 'BadModuleName',
                        message: `unknown url module "${module}"`
                    }
                }
        }
    }


    function parseSlug(module: TModule, slug: string): TParseSlugResponse {
        console.log(`parseSlug() module: ${module}, slug: ${slug}`);
        let store
        switch (module) {
            case "Locus":
                store = useLocusStore()
                break

            case "Fauna":
                store = useFaunaStore()
                break

            case "Stone":
                store = useStoneStore()
                break

            default:
                return { success: false, data: { error: "BadIdFormat", message: "bad store name" } }
        }
        return store.slugParamsFromSlug(slug) 
    }

    return { parseModule, parseSlug }
})
