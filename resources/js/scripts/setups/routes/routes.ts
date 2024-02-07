const routes = [
  {
    path: '/',
    component: () => import('@/components/content/HomePage.vue'),
    name: 'home'
  },
  {
    path: '/:module(admin)/dashboard',
    component: () => import('@/components/content/admin/DashboardPage.vue'),
    name: 'dashboard'
  },
  {
    path: '/:module(admin)/:catchAll(.*)',
    component: () => import('@/components/routes/NotFound.vue'),    
    name: 'not-found-admin'
  },
  {
    path: '/:module(auth)/login',
    component: () => import('@/components/content/AuthPage.vue'),
    name: 'login',
  },
  {
    path: '/:module(auth)/register',
    component: () => import('@/components/content/AuthPage.vue'),
    name: 'register',
  },
  {
    path: '/:module(auth)/forgot-password',
    component: () => import('@/components/content/AuthPage.vue'),
    name: 'forgot-password',
  },  
  {
    path: '/:module(auth)/reset-password/:slug',
    component: () => import('@/components/content/AuthPage.vue'),
    name: 'reset-password',
  },  
  {
    path: "/:module(auth)/:catchAll(.*)",
    component: () => import('@/components/routes/NotFound.vue'),    
    name: 'not-found'
  },
  //dig modules ( loci, stones, etc...)
  {
    path: '/:module',
    component: () => import('@/components/content/IndexPage.vue'),    
    name: 'index'
  },
  {
    path: '/:module/welcome',
    component: () => import('@/components/content/WelcomePage.vue'),
    name: 'welcome'
  },
  {
    path: '/:module/filter',
    component: () => import('@/components/content/FilterPage.vue'),
    name: 'filter'
  },

  {
    path: '/:module/create',
    component:  () => import('@/components/content/CreateUpdatePage.vue'),
    name: 'create',
    props: { isCreate: true }
  },
  {
    path: '/:module/:slug',
    component: () => import('@/components/content/ShowPage.vue'),
    name: 'show'
  },
  {
    path: '/:module/:slug/update',
    component:  () => import('@/components/content/CreateUpdatePage.vue'),
    name: 'update',
    props: { isCreate: false }    
  },
  {
    path: '/:module/:slug/media',
    component: () => import('@/components/media/MediaEditor.vue'),
    name: 'media'
  },
  {
    path: '/:module/:slug/tag',
    component: () => import('@/components/content/TaggerPage.vue'),
    name: 'tag'
  },
  {
    path: "/:module/:slug/:catchAll(.*)",
    component: () => import('@/components/routes/NotFound.vue'),    
    name: "not-found-item-action",
  },
]

export default routes