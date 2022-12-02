import { createRouter, createWebHistory } from 'vue-router'
import navigationErrorHandler from './routes/navigationErrorHandler'
import { useRoutesMainStore } from '../stores/routes/routesMain'
import { useMainStore } from '../stores/main'
import routes from './routes/routes'


export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.onError.bind(navigationErrorHandler)

console.log("setups.vue-router")

router.beforeEach(async (to, from) => {
  const { handleRouteChange }= useRoutesMainStore()
  const m = useMainStore()
  if (!m.initialized) {
    console.log(`vue-router beforeEach app is not initialized calling appInit()`)
    await m.appInit()
    console.log(`store(main) appInit returned`)
  }

  try {
    let res = await handleRouteChange(to, from)
    //console.log(`router.beforeEach returned ${JSON.stringify(res, null, 2)}`);
    return res
  }
  catch (err) {
    console.log(`navigationErrorHandler error: ${JSON.stringify(err, null, 2)} to: ${to.path}`);
    alert(`Navigation Error - Redirected to Home Page`)
    return({ name: 'home' })
    //return false
  }
})

export default router;

