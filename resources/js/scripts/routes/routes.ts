import Home from '../../components/content/Home.vue'
import About from '../../components/content/About.vue'
import Test from '../../components/content/Test.vue'
import Login from '../../components/content/Login.vue'

const routes = [
    { path: '/', component: Home, name: 'Home' },
    { path: '/about', component: About, name: 'About'},
    { path: '/test', component: Test },
    { path: '/login', component: Login, name: 'Login'},
  ];

export  default routes