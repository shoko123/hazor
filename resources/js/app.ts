import './bootstrap';
import '../css/app.scss';
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createPinia } from 'pinia'
import router from './scripts/routes'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from './components/App.vue'
import { createApp } from 'vue'

const pinia = createPinia()
const vuetify = createVuetify({
  components,
  directives,
})

createApp(App)
    .use(pinia)    
    .use(router)
    .use(vuetify)
    .mount('#app')
