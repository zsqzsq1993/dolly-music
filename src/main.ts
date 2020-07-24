// default import
import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

// customer import
import 'src/assets/stylus/reset.styl'
import 'src/assets/stylus/base.styl'
import 'src/assets/stylus/icon.styl'
import FastClick from 'fastclick'

Vue.config.productionTip = false

// eslint-disable-next-line
// @ts-ignore
FastClick.attach(document.body)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
