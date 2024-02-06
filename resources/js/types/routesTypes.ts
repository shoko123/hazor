// routesStore.js
import type { TCView } from '../types/collectionTypes'
type TPageName = 'home' | 'welcome' | 'filter' | 'index' | 'show' | 'create' | 'update' | 'tag' | 'media' | 'login' | 'register' | 'forgot-password' | 'reset-password'
type TUrlModule = 'auth' | 'admin' | 'loci' | 'fauna' | 'stones' | ''
type TModule = 'Home' | 'Auth' | 'Admin' | 'Locus' | 'Fauna' | 'Stone'


type TPlanAction =
    'module.load' |
    'module.clear' |
    'collection.item.load' |
    'collection.load' |
    'collection.clear' |
    'filters.clear' |
    'item.load' |
    'item.setIndexInCollection' |
    'item.clear' |
    'item.prepareForCreate' |
    'item.prepareForUpdate' |
    'item.prepareForTag' |
    'item.prepareForMedia' |
    'page.load' | //load pageB1 according to current item
    'page.load1' //load pageB1 = 1

type TRouteInfo = {
    url_module: TUrlModule | undefined,
    slug: string | undefined,
    url_full_path: string | undefined,
    name: TPageName,
    module: TModule,
    queryParams: object | undefined,
    preLoginFullPath: string | undefined
}

type TSelectedFilterFromQuery = {
    param: string,
    group_type_code: string,
    extra: string
}

type TApiFilters = {
    model_tag_ids: number[],
        global_tag_ids: number[],
        column_values: { column_name: string, vals: string[] }[],
        column_lookup_ids: { column_name: string, vals: number[] }[],
        column_search: { column_name: string, vals: string[] }[],
        bespoke: { name: string, vals: string[] }[],
        order_by: { column_name: string, asc: boolean }[],
}

type TParseQuery = {
    success: boolean,
    apiFilters:TApiFilters,
    selectedFilters: TSelectedFilterFromQuery[],
    message: string
}

type TPlanResponse = {
    success: true,
    data: TPlanAction[]
} | {
    success: false,
    message: string
}

type TFuncLoadPage =  (pageNoB1: number, view: TCView, module: TModule) =>  Promise<{ success: true, message: string } | { success: false, message: string }>

export {
    TPageName,
    TUrlModule,
    TModule,
    TRouteInfo,
    TParseQuery,
    TApiFilters,
    TSelectedFilterFromQuery,
    TPlanResponse,
    TPlanAction,
    TFuncLoadPage
}