import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "app-router" */ '_tabbar/Home.vue'),
    meta: {
      title: 'home',
      show: true,
    },
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: () => import(/* webpackChunkName: "app-router" */ '_tabbar/Contacts.vue'),
    meta: {
      title: 'contacts',
      show: true,
    },
  },
  {
    path: '/space',
    name: 'SpaceList',
    component: () => import(/* webpackChunkName: "app-router" */ '_tabbar/SpaceList.vue'),
    meta: {
      title: 'space',
      show: true,
    },
  },
  {
    path: '/appcards',
    name: 'AppCards',
    component: () => import(/* webpackChunkName: "app-router" */ '_tabbar/AppCards.vue'),
    meta: {
      title: 'appcards',
      show: true,
    },
  },
  {
    path: '/todo',
    name: 'Todo',
    component: () => import(/* webpackChunkName: "app-router" */ '_tabbar/Todo.vue'),
    meta: {
      title: 'todo',
      show: true,
    },
  },
  {
    path: '/appsdrag',
    name: 'AppsDraggable',
    component: () => import(/* webpackChunkName: "app-router" */ '_tabbar/AppsDraggable.vue'),
  },
]

const router = new VueRouter({
  routes,
})

export default router
