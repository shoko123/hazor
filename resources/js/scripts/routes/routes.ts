import Home from '../../components/routes/Home.vue'
import About from '../../components/routes/About.vue'
import Test from '../../components/routes/Test.vue'
import Login from '../../components/routes/Login.vue'

const routes = [
    { path: '/', component: Home, name: 'Home' },
    { path: '/about', component: About, name: 'About'},
    { path: '/test', component: Test },
    { path: '/login', component: Login, name: 'Login'},
  ];

export  default routes