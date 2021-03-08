import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import { get, post, put, deletefn } from './axios/index'
import TreeTable from 'vue-table-with-tree-grid'
Vue.config.productionTip = false
Vue.prototype.$get = get
Vue.prototype.$post = post
Vue.prototype.$put = put
Vue.prototype.$delete = deletefn
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
