// routesStore.js
type TName = 'home' | 'welcome' | 'filter' | 'index' | 'show' | 'create' | 'update' | 'tag' | 'media' | 'login' | 'register'
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


type TIdParams = { id: number, params: object, extra: object } | undefined

type TRouteInfo = {
    url_module: TUrlModule | undefined,
    url_id: string | undefined,
    url_query_string: string | undefined,
    name: TName,
    module: TModule,
    idParams: TIdParams,
    queryParams: object | undefined
}
type TRouteEntityFlags = { module: boolean, collection: boolean, item: boolean, page: boolean }

type TParseResponse = {
    success: boolean,
    data: TRouteInfo | TParsingError
}

type TPlanResponse = {
    success: boolean,
    data: TPlanError | TPlanAction[]
}

type TPrepareResponse = {
    success: boolean,
    errorDetails?: TPrepareError
}
export { TName, TUrlModule, TModule, TRouteInfo, TParseResponse, TParsingError, TRouteEntityFlags, TPlanResponse, TPlanAction, TPlanError, TPrepareResponse, TPrepareError }