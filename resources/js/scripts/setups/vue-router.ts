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
    switch (r.parseAndAuthorize(to, from)) {
      case 'ok':
        break
      case 'bad-module':
        return { path: from.path, params: { module: from.params.module }}
      case 'unauthorized':
        console.log("vue-router - UNAUTHORIZED")
        return { path: '/auth/login' }
    }
    await r.prepareForNewRoute(to, from);
  }
  catch (err) {
    console.log(`navigationErrorHandler error: ${JSON.stringify(err, null, 2)} to: ${to.path}`);
    return false
  }
})

export default router;

