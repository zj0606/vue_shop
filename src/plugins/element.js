
import Vue from 'vue'
import { Form, FormItem, Input, Button, Message } from 'element-ui'

Vue.component(Form.name, Form)

Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)
Vue.use(Button)
Vue.prototype.$message = Message
