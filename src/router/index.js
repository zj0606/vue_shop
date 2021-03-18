import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
// import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_hi" */ '../components/Login.vue')
// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_hi" */ '../components/Home.vue')

// import Hi from '../components/Hi.vue'
const Hi = () => import(/* webpackChunkName: "login_home_hi" */ '../components/Hi.vue')

// import User from '../components/user/User.vue'
// import Role from '../components/power/Role.vue'
// import Rights from '../components/power/Rights.vue'
const User = () => import(/* webpackChunkName: "user" */ '../components/user/User.vue')
const Role = () => import(/* webpackChunkName: "role_rights" */ '../components/power/Role.vue')
const Rights = () => import(/* webpackChunkName: "role_rights" */ '../components/power/Rights.vue')

// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'
// import List from '../components/goods/List.vue'
// import AddGoods from '../components/goods/AddGoods.vue'
const Cate = () => import(/* webpackChunkName: "group_goods" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "group_goods" */ '../components/goods/Params.vue')
const List = () => import(/* webpackChunkName: "group_goods" */ '../components/goods/List.vue')
const AddGoods = () => import(/* webpackChunkName: "group_goods" */ '../components/goods/AddGoods.vue')

// import Order from '../components/orders/Order.vue'
const Order = () => import(/* webpackChunkName: "orders" */ '../components/orders/Order.vue')

// import Reports from '../components/reports/Reports.vue'
const Reports = () => import(/* webpackChunkName: "reports" */ '../components/reports/Reports.vue')

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
    },
    {
      path: 'rights',
      component: Rights
    },
    {
      path: 'categories',
      component: Cate
    },
    {
      path: 'params',
      component: Params
    },
    {
      path: 'list',
      alias: 'goods',
      component: List
    },
    {
      path: 'addGoods',
      name: 'addgoods',
      component: AddGoods
    },
    {
      path: 'orders',
      component: Order
    },
    {
      path: 'reports',
      component: Reports
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
