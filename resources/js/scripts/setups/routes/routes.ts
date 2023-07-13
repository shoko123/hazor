import Index from '@/components/content/Index.vue'
import NotFound from '@/components/routes/NotFound.vue'

const routes = [
  {
    path: '/',
    component: () => import('@/components/content/Home.vue'),
    name: 'home'
  },
  {
    path: '/:module(admin)/dashboard',
    component: () => import('@/components/content/admin/Dashboard.vue'),
    name: 'dashboard'
  },
  {
    path: '/:module(admin)/:catchAll(.*)',
    component: NotFound,
    name: 'not-found-admin'
  },
  {
    path: '/:module(auth)/login',
    component: () => import('@/components/content/auth/Login.vue'),
    name: 'login',
  },
  {
    path: '/:module(auth)/register',
    component: () => import('@/components/content/auth/Login.vue'),
    name: 'register',
  },
  {
    path: "/:module(auth)/:catchAll(.*)",
    component: NotFound,
    name: 'not-found'
  },
  //dig modules ( loci, stones, etc...)
  {
    path: '/:module',
    component: Index,
    name: 'index'
  },
  {
    path: '/:module/welcome',
    component: () => import('@/components/content/Welcome.vue'),
    name: 'welcome'
  },
  {
    path: '/:module/filter',
    component: () => import('@/components/content/Filter.vue'),
    name: 'filter'
  },

  {
    path: '/:module/create',
    component:  () => import('@/components/content/CreateUpdate.vue'),
    name: 'create',
    props: { isCreate: true }
  },
  {
    path: '/:module/:slug',
    component: () => import('@/components/content/Show.vue'),
    name: 'show'
  },
  {
    path: '/:module/:slug/update',
    component:  () => import('@/components/content/CreateUpdate.vue'),
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
    component: () => import('@/components/content/Tagger.vue'),
    name: 'tag'
  },
  {
    path: "/:module/:slug/:catchAll(.*)",
    component: NotFound,
    name: "not-found-item-action",
  },
]

export default routes