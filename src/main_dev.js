import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import { get, post, put, deletefn } from './axios/index'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor)
Vue.config.productionTip = false
Vue.prototype.$get = get
Vue.prototype.$post = post
Vue.prototype.$put = put
Vue.prototype.$delete = deletefn
Vue.component('tree-table', TreeTable)
// 创建过滤器
Vue.filter('createTimeFormate', function (value) {
  if (!value) return ''
  value = new Date(value)
  var y = value.getFullYear()
  var m = value.getMonth() + 1
  var d = value.getDate()
  var h = value.getHours()
  var minute = value.getMinutes()
  var s = value.getSeconds()
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + s
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
