import Vue from 'vue'
import Router from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Loterry',
    component: () => import(/* webpackChunkName: "LotteryWrapper" */ '../../views/LotteryPage.vue'),
    meta: {
      label: 'Dashboard',
      icon: 'mdi-view-dashboard',
      isMainMenuItem: true
    },
     props: (route) => ({
        project: Object,
        ...route.params
    })
  },
  {
    path: '/CreateProject',
    name: 'CreateProject',
    component: () => import(/* webpackChunkName: "CreateProject" */ '../../views/CreateProject.vue'),
    meta: {
      label: 'CreateProject',
      isMainMenuItem: false
    }
  },
   {
    path: '/LotteryDetail',
    name: 'LotteryDetail',
    component: () => import(/* webpackChunkName: "CreateProject" */ '../../components/reusable/LotteryDetail.vue'),
    meta: {
      label: 'LotteryDetail',
      isMainMenuItem: false
    }
  },
     {
    path: '/Archive',
    name: 'LotteryArchive',
    component: () => import(/* webpackChunkName: "Profile" */ '../../views/Archive.vue'),
    meta: {
      label: 'Archive',
      icon: 'mdi-archive',
      isMainMenuItem: true
    }
  },
   {
    path: '/AccountProfile',
    name: 'AccountProfile',
    component: () => import(/* webpackChunkName: "Profile" */ '../../views/Profile.vue'),
    meta: {
      label: 'Profile',
      icon: 'mdi-account',
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
