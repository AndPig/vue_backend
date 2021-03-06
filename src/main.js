import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入样式表
import './assets/css/global.css'
import './assets/font_984292_c4eel7fqa0n/iconfont.css'
import axios from 'axios'
import qs from 'qs'
Vue.prototype.$qs=qs
Vue.prototype.$http=axios
//配置请求的根路径
axios.defaults.baseURL='http://localhost:8080/'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
