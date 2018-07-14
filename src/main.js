// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vant from 'vant' // 引用 UI
import 'vant/lib/vant-css/index.css'
import './styles/font/iconfont.css'
import axios from 'axios' // axios
import VueLazyload from 'vue-lazyload' // 图片懒加载

// Vue.use(VueLazyload) // 图片懒加载
Vue.prototype.$http = axios // axios

Vue.use(Vant) // 引用 UI

// with options
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('@/assets/images/imglogo.jpg'),
  loading: require('@/assets/images/imglogo.jpg'),
  attempt: 1
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
