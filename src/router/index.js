import Vue from 'vue'
import VueRouter from 'vue-router'
import MapBase from '../components/MapBase.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/map',
    name: 'map',
    component: MapBase
  },
  { 
    path: '/', 
    redirect: '/map' 
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  linkActiveClass: "active"
})

export default router
