import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {Button, Table, Upload, Tooltip, TableColumn} from 'element-ui'
import 'element-ui/lib/theme-chalk/button.css'
import 'element-ui/lib/theme-chalk/table.css'
import 'element-ui/lib/theme-chalk/upload.css'
import 'element-ui/lib/theme-chalk/tooltip.css'
import 'element-ui/lib/theme-chalk/table-column.css'

Vue.config.productionTip = false
Vue.use(Table)
Vue.use(Button)
Vue.use(Upload)
Vue.use(Tooltip)
Vue.use( TableColumn)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
