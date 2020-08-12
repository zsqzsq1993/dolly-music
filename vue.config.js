/* eslint-disable */
const path = require('path')
const axios = require('axios')
const bodyParser = require('body-parser')
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
        assets: resolve('src/assets'),
        base: resolve('src/base')
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
              data: slider
            })
          } else {
            res.json(response)
          }
        }).catch(e => {
          console.log(e)
        })
      })

      app.get('/api/getRecommandList', (req, res) => {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

        const data = req.query

        axios.get(url, {
          params: data,
          headers: {
            referer: 'https://u.y.qq.com/',
            host: 'u.y.qq.com'
          }
        }).then(response => {
          response = response.data
          if (response.code === 0) {
            res.json({
              code: 0,
              data: response.data.list
            })
          } else {
            res.json(response)
          }
        }).catch(e => {
          console.log(e)
        })
      })

      app.post('/api/getSongUrl', bodyParser.json(), (req, res) => {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.post(url, req.body, {
          headers: {
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com',
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then(response => {
          res.json(response.data)
        }).catch(e => {
          console.log(e)
        })
      })

      app.get('/api/getLyric', (req, res) => {
        const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

        const data = req.query

        axios(url, {
          params: data,
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          }
        }).then(response => {
          res.json(response.data)
        })
      })

      app.get('/api/getRecommandDetail', (req, res) => {
        const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

        const data = req.query

        return axios.get(url, {
          params: data,
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          }
        }).then(response => {
          res.json(response.data)
        })
      })

      // app.get('/api/getTopList', (req, res) => {
      //   const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
      //
      //   const data = req.query
      //
      //   axios.get(url, {
      //     params: data,
      //     headers: {
      //       referer: 'https://i.y.qq.com/n2/m/index.html?tab=toplist',
      //       host: 'i.y.qq.com'
      //     }
      //   }).then(response => {
      //     res.json(response.data)
      //   }).catch(error => {
      //     res.json(error)
      //   })
      // })

      app.get('/api/getHotSearch', (req, res) => {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

        const data = req.query

        axios.get(url, {
          params: data,
          headers: {
            referer: 'https://c.y.qq.com',
            host: 'c.y.qq.com'
          }
        }).then(response => {
          res.json(response.data)
        })
      })
    }
  }
}
