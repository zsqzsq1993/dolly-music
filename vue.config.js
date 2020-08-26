/* eslint-disable */
const path = require('path')
const axios = require('axios')
const bodyParser = require('body-parser')
const Redis = require('ioredis')
const nodemailer = require('nodemailer')
const dbsConfig = require('./src/dbs/config.ts')
const mongoose = require('mongoose')
const User = require('./src/dbs/models/user.js')
/* eslint-enable */

const redis = new Redis(dbsConfig.redis.port, dbsConfig.redis.host)

let dbs = null

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

      app.get('/api/getSearch', (req, res) => {
        const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

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

      app.post('/api/verify', bodyParser.json(), async (req, res) => {
        const {email} = req.body

        const savedExpire = await redis.hget(`nodemail:${email}`, 'expire')

        if (savedExpire && (+new Date() - savedExpire) < 0) {
          return
        }

        const code = dbsConfig.redis.code

        const expire = dbsConfig.redis.expire

        const deliver = nodemailer.createTransport({
          host: dbsConfig.smtp.host,
          port: dbsConfig.smtp.port,
          secure: false,
          auth: {
            user: dbsConfig.smtp.user,
            pass: dbsConfig.smtp.pass
          }
        })

        const message = {
          from: dbsConfig.smtp.user,
          to: email,
          subject: '来自Dolly Music的验证码',
          html: `感谢您的注册，您的验证码是${code}`
        }

        await deliver.sendMail(message, err => {
          if (err) {
            res.json(err)
          } else {
            redis.hset(`nodemail:${email}`, 'code', code, 'expire', expire).then(() => {
              res.json({
                code: 0,
                message: '验证码已发送'
              })
            })
          }
        })
      })

      app.post('/api/register', bodyParser.json(), async (req, res) => {
        const {
          username,
          email,
          password,
          validateCode
        } = req.body

        const savedValidateCode = await redis.hget(`nodemail:${email}`, 'code')
        const savedValidateExpire = await redis.hget(`nodemail:${email}`, 'expire')

        if (!savedValidateCode || savedValidateCode !== validateCode) {
          return res.json({
            code: -1,
            message: '验证码不正确，注意大小写'
          })
        }

        if (+new Date() - savedValidateExpire > 65 * 1000) {
          return res.json({
            code: -1,
            message: '验证已过期'
          })
        }

        if (!dbs) {
          dbs = await mongoose.connect(dbsConfig.mongodb, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
          })
        }

        const usernameResult = await User.find({username})

        if (usernameResult.length) {
          return res.json({
            code: -1,
            message: '用户名已存在'
          })
        }

        const emailResult = await User.find({email})

        if (emailResult.length) {
          return res.json({
            code: -1,
            message: '该邮箱已被注册'
          })
        }

        const newUser = await User.create({
          username,
          email,
          password
        })

        if (newUser) {
          return res.json({
            code: 0,
            message: '注册成功'
          })
        } else {
          return res.json({
            code: -1,
            message: '注册失败'
          })
        }
      })
    },

    publicPath: ''
  }
}
