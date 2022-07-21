import './bootstrap';
import '../css/app.scss';
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import router from './scripts/routes'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from './components/App.vue'

const pinia = createPinia()

//inject router to all stores
pinia.use(({ store }) => {
  store.$router = markRaw(router)
});

const vuetify = createVuetify({
  components,
  directives,
})

createApp(App)
    .use(pinia)    
    .use(router)
    .use(vuetify)
    .mount('#app')
