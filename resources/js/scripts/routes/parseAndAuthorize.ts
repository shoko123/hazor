import type { RouteLocationNormalized }  from 'vue-router'
export default function parseAndAuthorize(to: RouteLocationNormalized, from: RouteLocationNormalized): boolean{
        console.log(`middleware.parsAndAuthorize ()`)
        return true
        //throw new Error('parsing failed')
        //console.log(`middleware.authorize() to.path: ${to.path} appSettings: ${JSON.stringify(appSettings, null, 2)}\nisLoggedIn: ${isLoggedIn}`);
}
