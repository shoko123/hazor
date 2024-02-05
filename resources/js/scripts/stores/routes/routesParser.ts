// routesStore.js
//handles the entire routing mechanism - parsing, loading resources, error handling
import { defineStore } from 'pinia'
import type { TModule } from '../../../types/routesTypes'
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

    function parseModule(module: string) {
        //console.log(`parseModule() module: "${module}"`)
        switch (module) {
            case "admin":
            case "auth":
            case "loci":
            case "stones":
            case 'fauna':
                //m.to.module = <TModule>moduleConversion[module]
                //m.to.url_module = module
                return { success: true, module: <TModule>moduleConversion[module], url_module: module , message: '' }

            default:
                console.log(`******* URL Parser error: Unsupported module name "${module}" *********`)
                return {
                    success: false,
                    data: {},
                    message: `Error: unknown url module "${module}"`
                }
        }
    }


    function parseSlug(module: TModule, slug: string) {
        //console.log(`parseSlug() module: ${module}, slug: ${slug}`);
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
                return { success: false, data: null, message: `Error: bad module name ${module}` }
        }
        return store.validateSlug(slug)
    }

    return { parseModule, parseSlug }
})
