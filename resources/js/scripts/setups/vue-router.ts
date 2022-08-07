import { createRouter, createWebHistory } from 'vue-router'
import navigationErrorHandler from '../routes/navigationErrorHandler'
import { useRoutesStore } from '../routes/routesStore'
import { useMainStore } from '../stores/main'
import routes from '../routes/routes'


export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.onError.bind(navigationErrorHandler)

console.log("setups.vue-router")

router.beforeEach(async (to, from) => {
  const r = useRoutesStore()
  const m = useMainStore()
  if (!m.initialized) {
    console.log(`vue-router beforeEach app is not initialized calling appInit()`)
    await m.appInit()
    console.log(`store(main) appInit returned`)
  }
  try {
    let res = r.handleRouteChange(to, from)
    console.log(`router.beforeEach returned ${JSON.stringify(res, null, 2)}`);
    return res
  }
  catch (err) {
    console.log(`navigationErrorHandler error: ${JSON.stringify(err, null, 2)} to: ${to.path}`);
    return false
  }
})

export default router;

