import type { RouteLocationNormalized }  from 'vue-router'
export default async function prepareForNewRoute(to: RouteLocationNormalized, from: RouteLocationNormalized) {
        console.log(`middleware.prepareForNewRoute ()`)
        //console.log(`middleware.authorize() to.path: ${to.path} appSettings: ${JSON.stringify(appSettings, null, 2)}\nisLoggedIn: ${isLoggedIn}`);
}