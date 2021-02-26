import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element'
import './assets/css/global.css'
import { get, post } from './axios/index'
Vue.config.productionTip = false
Vue.prototype.$get = get
Vue.prototype.$post = post
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
