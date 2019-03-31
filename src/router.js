import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Main from './views/layout/Main'
import White from './views/layout/White'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [{
        path: '',
        redirect: '/file'
      },{
        path: 'file',
        component: Main
      },{
        path: 'white',
        component: White
      }]
    }
  ]
})
