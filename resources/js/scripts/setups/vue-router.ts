import { createRouter, createWebHistory } from 'vue-router'
import navigationErrorHandler from '../routes/navigationErrorHandler'
import { useRoutesStore } from '../routes/routesStore'
import routes from '../routes/routes'


export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.onError.bind(navigationErrorHandler)

console.log("routes.index.ts setting router.beforeEach()")

router.beforeEach(async (to, from) => {
  const r = useRoutesStore()
  try {
    if(!r.parseAndAuthorize(to, from)) {
      console.log(`new route parse/authorize failure - aborting navigation`)
      return false
    };
    await r.prepareForNewRoute(to, from);
  }
  catch (err) {
    console.log(`navigationErrorHandler error: ${JSON.stringify(err, null, 2)} to: ${to.path}`);
    return false
  }
})

export default router;

