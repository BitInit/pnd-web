import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', redirect: '/file', name: '首页'},
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Main'),
      children: [{
        path: 'file',
        component: () => import('@/views/home/FileList')
      },{
        path: 'white',
        component: () => import('@/views/layout/White')
      }]
    }
  ]
})