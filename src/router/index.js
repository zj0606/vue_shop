import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Hi from '../components/Hi.vue'
import User from '../components/user/User.vue'
import Role from '../components/role/Role.vue'
import store from '../store'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/home/welcome',
    children: [{
      path: 'welcome',
      component: Hi
    },
    {
      path: 'users',
      component: User
    },
    {
      path: 'roles',
      component: Role
    }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 导航的全局守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  const token = store.state.token ? store.state.token : window.sessionStorage.getItem('logintoken')
  if (!token) return next('/login')
  next()
})

export default router
