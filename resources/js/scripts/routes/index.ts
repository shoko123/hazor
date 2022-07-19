import { createRouter, createWebHistory } from 'vue-router'
import parseAndAuthorize from './parseAndAuthorize'
import prepareForNewRoute from './prepareForNewRoute'
import navigationErrorHandler from './navigationErrorHandler'
import routes from './routes'


const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.onError.bind(navigationErrorHandler)

console.log("routes.index.ts setting router.beforeEach()")
router.beforeEach(async (to, from) => {
  try {
    if(!parseAndAuthorize(to, from)) {
      console.log(`new route parse/authorize failure - aborting navigation`)
      return false
    };
    await prepareForNewRoute(to, from);
  }
  catch (err) {
    console.log(`navigationErrorHandler error: ${JSON.stringify(err, null, 2)} to: ${to.path}`);
    return false
  }


})

export default router;

