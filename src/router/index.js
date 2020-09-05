import Vue from 'vue'
import VueRouter from 'vue-router'
import MapBase from '../components/MapBase.vue'
import About from '../components/About.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/map',
    name: 'map',
    component: MapBase
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
	{ 
		path: '/', 
		redirect: '/geonames' 
	}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  linkActiveClass: "active"
})

export default router
