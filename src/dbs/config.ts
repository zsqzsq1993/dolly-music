import {devMode} from 'src/api/config'

const HOST = devMode ? 'localhost' : 'localhost'

const dbsConfig = {
  mongodb: `mongodb://${HOST}:27017/music`,

  redis: {
    get host() {
      return HOST
    },

    get port() {
      return 6379
    },

    get code() {
      return Math.random().toString(16).slice(2, 6).toUpperCase()
    },

    get expire() {
      return +new Date() + 1000 * 60
    }
  },

  smtp: {
    get host() {
      return 'smtp.qq.com'
    },

    get user() {
      return '415692115@qq.com'
    },

    get pass() {
      return 'pardjyirrvxjbgii'
    },

    get port() {
      return 587
    }
  }
}

module.exports = dbsConfig
