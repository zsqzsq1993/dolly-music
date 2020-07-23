// default import
import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
// import router from './router'
import store from './store'

// customer import
import 'src/assets/stylus/reset.styl'
import 'src/assets/stylus/base.styl'
import 'src/assets/stylus/icon.styl'
import fastclick from 'fastclick'

Vue.config.productionTip = false
fastclick.call(fastclick, document.body)

new Vue({
  // router,
  store,
  render: h => h(App)
}).$mount('#app')
