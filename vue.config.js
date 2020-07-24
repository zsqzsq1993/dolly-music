/* eslint-disable */
const path = require('path')
const axios = require('axios')
/* eslint-enable */

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
  },

  devServer: {
    before(app) {
      app.get('/api/getRecommandCarousel', (req, res) => {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        const data = req.query

        const jumpPrefixMap = {
          10002: 'https://y.qq.com/n/yqq/album/',
          10014: 'https://y.qq.com/n/yqq/playlist/',
          10012: 'https://y.qq.com/n/yqq/mv/v/'
        }

        axios.get(url, {
          params: data,
          headers: {
            referer: 'https://u.y.qq.com/',
            host: 'u.y.qq.com'
          }
        }).then(response => {
          response = response.data
          if (response.code === 0) {
            const slider = []
            const contents =
              response.focus &&
              response.focus.data &&
              response.focus.data.content

            contents.forEach(item => {
              let jumpUrl = item.jump_info && item.jump_info.url
              const picUrl = item.pic_info && item.pic_info.url
              const jumpPrefix = jumpPrefixMap[item.type || 10002]

              jumpUrl = jumpPrefix + jumpUrl + '.html'

              slider.push({
                jumpUrl,
                picUrl
              })
            })

            res.json({
              code: 0,
              data: {
                slider
              }
            })
          } else {
            res.json(res)
          }
        }).catch(e => {
          console.log(e)
        })
      })
    }
  }
}
