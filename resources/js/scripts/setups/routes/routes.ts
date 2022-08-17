import SubRouteContainer from '@/components/routes/SubRouteContainer.vue'
import Index from '@/components/content/Index.vue'
import ShowItem from '@/components/content/show-item/ShowItem.vue'
import NotFound from '@/components/routes/NotFound.vue'


const routes = [
  {
    path: '/',
    component: () => import('@/components/content/Home.vue'),
    name: 'home'
  },
  {
    path: '/:module(admin)',
    component: SubRouteContainer,  
    props: true,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/components/content/admin/Dashboard.vue'),
        name: 'dashboard'
      },
      {
        path: ":catchAll(.*)",
        component: NotFound,
        name: 'not-found'
      }
    ],
  },
  {
    path: '/:module(auth)',
    component: SubRouteContainer,
    props: true,
    children: [
      {
        path: 'login',
        component: () => import('@/components/content/auth/Login.vue'),       
        name: 'login',
      },
      {
        path: 'register',
        component: () => import('@/components/content/auth/Login.vue'),
        name: 'register',
      },
      {
        path: ":catchAll(.*)",
        component: NotFound,
        name: 'not-found'
      }
    ]
  },
  {
    path: '/:module',
    component: SubRouteContainer,
    props: true,
    children: [
      {
        path: 'welcome',
        component: () => import('@/components/content/Welcome.vue'),
        name: 'welcome'
      },
      {
        path: 'filter',
        component: () => import('@/components/content/filter/Filter.vue'),
        name: 'filter'
      },
      {
        path: 'index',
        component: Index,
        name: 'index'
      },
      // {
      //     path: 'create',
      //     component: stepper,

      // },
      {
        path: ':id',
        component: ShowItem,
        name: 'show'
        // children: [

        //     {
        //         path: ':update',
        //         props: true,
        //         component: stepper,

        //     },
        //     {
        //         path: ':media',
        //         props: true,
        //         component: MediaEdit,
        //     },
        //     {
        //         path: 'tags',
        //         props: true,
        //         component: Tagger,
        //     },
        // ],
      },
    ]
  },
  {
    path: "/:catchAll(.*)",
    
    component: NotFound,
    name: "not-found",
  },
]

export default routes