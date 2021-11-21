import Vue from 'vue'
import Router from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Loterry',
    component: () => import(/* webpackChunkName: "LotteryWrapper" */ '../../views/LotteryPage.vue'),
    meta: {
      label: 'Main',
      icon: 'mdi-chart-bell-curve',
      isMainMenuItem: true
    }
  }
]

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [...routes],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { selector: to.hash }
    }
    return { x: 0, y: 0 }
  }
})

export default router
