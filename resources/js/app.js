import './bootstrap';
import '../css/app.scss';

import { createApp } from 'vue'
import App from './components/App.vue'

import router from './scripts/routes'
import { createPinia } from 'pinia'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const pinia = createPinia()

const vuetify = createVuetify({
  components,
  directives,
})

createApp(App)
    .use(router)
    .use(pinia)
    .use(vuetify)
    .mount('#app')
