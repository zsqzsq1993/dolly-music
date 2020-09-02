const devMode = process.env.NODE_ENV !== 'production'

const HOST = devMode ? 'localhost' : 'localhost'

const dbsConfig = {
  // when using local mongodb ->
  // mongodb: `mongodb://${HOST}:27017/music`,

  // when using mongodb cloud
  mongodb: 'mongodb+srv://zsqzsq1993:Findahouse153!@dolly-music.mongodb.net/music?w=majority',

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
