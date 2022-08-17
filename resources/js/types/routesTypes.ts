// routesStore.js
type TName = 'home' | 'welcome' | 'filter' | 'index' | 'show' |'create' | 'update' | 'tags' | 'media' | 'login' | 'register'
type TUrlModule = 'auth' | 'admin' | 'loci' | 'fauna' | 'stones' | ''
type TModule = 'Home' | 'Auth' | 'Admin' | 'Locus' | 'Fauna' | 'Stone'
type TRoutingError = {}
type TParsingError = 'BadModuleName' | 'BadIdFormat' | 'BadQueryParams'
type TTransitionError = 'MutateTransitionError' | 'BadTransition'
type TModuleScaffoldAction = 'reset' | 'load' | 'none'
type TMainCollectionAction = 'reset' | 'load' | 'none'
type TItemAction = 'reset' | 'load' | 'prepareNew' | 'prepareUpdate' | 'prepareTag' | 'prepareMedia' | 'none'

type TIdParams = { id: number, params: object, extra: object } | undefined

type TRouteInfo = {
    url_module: TUrlModule | null,
    url_id: string | null,
    url_query_params: object | null,
    name: TName,
    module: TModule,
    idParams: TIdParams,
    queryParams: object | null
}


type TRouteEntityFlags = { module: boolean, collection: boolean, item: boolean, page: boolean }
// type TReset = [module: boolean, collection: boolean, collection: boolean, page: boolean]
// type TLoad = [boolean, boolean, boolean, boolean]


type TPreparePlan = {
    scaffold: TModuleScaffoldAction
    mainCollection: TMainCollectionAction,
    item: TItemAction,
}

type TParseResponse = {
    success: boolean,
    data: TRouteInfo | TParsingError
}

type TPlanResponse = {
    success: boolean,
    data: TTransitionError | TPreparePlan
}
export { TName, TUrlModule, TModule, TRouteInfo, TParseResponse, TParsingError, TRouteEntityFlags, TPlanResponse, TPreparePlan, TTransitionError }