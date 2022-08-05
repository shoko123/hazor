import SubRouteContainer from '../../components/routes/SubRouteContainer.vue'
import Collection from '../../components/content/collections/Collection.vue'
import ShowItem from '../../components/content/show-item/ShowItem.vue'
import NotFound from '../../components/routes/NotFound.vue'


const routes = [
  {
    path: '/',
    component: () => import('../../components/content/Home.vue'),
    name: 'Home'
  },
  {
    path: '/:module(admin)',
    component: SubRouteContainer,  
    props: true,
    children: [
      {
        path: 'dashboard',
        component: () => import('../../components/content/admin/Dashboard.vue')
      },
      {
        path: ":catchAll(.*)",
        component: NotFound,
      }
    ],
  },
  {
    path: '/:module(auth)',
    component: SubRouteContainer,
    props: true,
    children: [
      {
        path: ':action(login)',
        name: 'Login',
        component: () => import('../../components/content/auth/Login.vue')
      },
      {
        path: ':action(register)',
        component: () => import('../../components/content/auth/Login.vue')

      },
      {
        path: ":catchAll(.*)",
        component: NotFound,
      }
    ]
  },
  {
    path: '/:module',
    component: SubRouteContainer,
    props: true,
    children: [
      {
        path: ':action(welcome)',
        component: () => import('../../components/content/Welcome.vue')
      },
      {
        path: ':action(Filter)',
        component: () => import('../../components/content/filter/Filter.vue')
      },
      {
        path: ':action(list)',
        component: Collection
      },
      // {
      //     path: ':action(create)',
      //     component: stepper,

      // },
      {
        path: ':dot',
        component: ShowItem,
        // children: [

        //     {
        //         path: ':action(update)',
        //         props: true,
        //         component: stepper,

        //     },
        //     {
        //         path: ':action(media)',
        //         props: true,
        //         component: MediaEdit,
        //     },
        //     {
        //         path: ':action(tags)',
        //         props: true,
        //         component: Tagger,
        //     },
        // ],
      },
    ]
  },
  {
    path: "/:catchAll(.*)",
    //name: "NotFound",
    component: NotFound,
  },
]

export default routes