// routesStore.js
import type { TSlugParams, TIdParams } from '../types/moduleIdParamsTypes';
type TPageName = 'home' | 'welcome' | 'filter' | 'index' | 'show' | 'create' | 'update' | 'tag' | 'media' | 'login' | 'register' | 'forgot-password' | 'reset-password'
type TUrlModule = 'auth' | 'admin' | 'loci' | 'fauna' | 'stones' | ''
type TModule = 'Home' | 'Auth' | 'Admin' | 'Locus' | 'Fauna' | 'Stone'
type TParsingError = 'BadModuleName' | 'BadIdFormat' | 'BadQueryParams'
type TPlanError = 'MutateTransitionError' | 'BadTransition' | 'NotImplementedYet'
type TPrepareError = 'GenericPrepareError' | 'UnauthorizeError' | 'ServerConnectionError' | 'ModuleInitFailure' | 'ItemLoadFailure' | 'CollectionLoadFailure' | 'ItemNotFound' | 'EmptyResultSet' | 'ItemNotInResultSet'


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
    idParams: TIdParams | undefined,
    queryParams: object | undefined,
    preLoginFullPath: string | undefined
}
type TRouteEntityFlags = { module: boolean, collection: boolean, item: boolean, page: boolean }

type TParseErrorDetails = {
    error: TParsingError,
    message: string
}

type TParseModuleData = {
    module: TModule,
    url_module: TUrlModule
}
type TParseUrlModuleResponse = {
    success: boolean,
    data: TParseErrorDetails | TParseModuleData
}

type TParseSlugData = {
    slug: string,
    url_params: TSlugParams
}
type TParseSlugResponse = {
    success: boolean,
    data: TParseErrorDetails | TSlugParams
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

type TParseQueryData = {
    apiFilters:TApiFilters,
    selectedFilters: TSelectedFilterFromQuery[]
}

type TParseUrlQueryResponse = {
    success: boolean,
    data: TParseErrorDetails | TParseQueryData
}

type TPlanResponse = {
    success: boolean,
    data: TPlanError | TPlanAction[]
}

type TPrepareResponse = {
    success: boolean,
    errorDetails?: TPrepareError
}
export {
    TPageName,
    TUrlModule,
    TModule,
    TRouteInfo,
    TParsingError,
    TParseModuleData,
    TParseSlugResponse,
    TParseSlugData,
    TParseErrorDetails,
    TParseUrlModuleResponse,
    TParseQueryData,
    TParseUrlQueryResponse,
    TApiFilters,
    TSelectedFilterFromQuery,
    TRouteEntityFlags,
    TPlanResponse,
    TPlanAction,
    TPlanError,
    TPrepareResponse,
    TPrepareError
}