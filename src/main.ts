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
import 'src/assets/stylus/userfont.styl'
import lazyload from 'vue-lazyload'

Vue.use(lazyload, {
  attempt: 2,
  error: require('@/assets/images/pizza.png'),
  loading: require('@/assets/images/pizza.png')
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
