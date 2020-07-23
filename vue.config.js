/* eslint-disable-next-line */
const path = require('path')

const resolve = dir => {
  return path.resolve(__dirname, dir)
}

module.exports = {
  configureWebpack: {
    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json'],
      alias: {
        src: resolve('src'),
        components: resolve('src/components'),
        assets: resolve('src/assets')
      }
    }
  }
}
