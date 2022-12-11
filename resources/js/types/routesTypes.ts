// routesStore.js
type TName = 'home' | 'welcome' | 'filter' | 'index' | 'show' | 'create' | 'update' | 'tags' | 'media' | 'login' | 'register'
type TUrlModule = 'auth' | 'admin' | 'loci' | 'fauna' | 'stones' | ''
type TModule = 'Home' | 'Auth' | 'Admin' | 'Locus' | 'Fauna' | 'Stone'
type TParsingError = 'BadModuleName' | 'BadIdFormat' | 'BadQueryParams'
type TPlanError = 'MutateTransitionError' | 'BadTransition' | 'NotImplementedYet'
type TDbAccessError = 'UnauthorizeError' | 'ServerError' | 'ItemNotFound' | 'EmptyResultSet'


type TPlanAction =
    'trio.load' |
    'trio.clear' |
    'collection.item.load'|
    'collection.load' |
    'collection.clear' |
    'filters.clear' |
    'item.load' |
    'item.clear' |
    'item.prepareForNew' |
    'item.prepareForUpdate' |
    'item.prepareForTag' |
    'item.prepareForMedia'

type TIdParams = { id: number, params: object, extra: object } | undefined

type TRouteInfo = {
    url_module: TUrlModule | undefined,
    url_id: string | undefined,
    url_query_params: object | undefined,
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
export { TName, TUrlModule, TModule, TRouteInfo, TParseResponse, TParsingError, TRouteEntityFlags, TPlanResponse, TPlanAction, TPlanError }