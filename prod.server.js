const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const mongoose = require('mongoose')
const Redis = require('ioredis')
const nodemailer = require('nodemailer')
const session = require('express-session')
const dbsConfig = require('./src/dbs/config.ts')
const User = require('./src/dbs/models/user.js')
const https = require('https')
const fs = require('fs')
const cert = fs.readFileSync('/etc/nginx/1_dollylosingweight.today_bundle.crt')
const key = fs.readFileSync('/etc/nginx/2_dollylosingweight.today.key')

const credential = { key, cert }
const port = process.env.PORT || 9000
const app = express()
const router = express.Router()

const redis = new Redis(dbsConfig.redis.port, dbsConfig.redis.host)

app.use(session({
  secret: 'zsqzsq1993',
  name: 'session_id',
  resave: true,
  rolling: true,
  cookie: {
    maxAge: 30 * 1000 * 60
  }
}))

// basic router

router.get('/getRecommandCarousel', (req, res) => {
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

router.get('/getRecommandList', (req, res) => {
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

router.post('/getSongUrl', bodyParser.json(), (req, res) => {
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

router.get('/getLyric', (req, res) => {
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

router.get('/getRecommandDetail', (req, res) => {
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

router.get('/getHotSearch', (req, res) => {
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

router.get('/getSearch', (req, res) => {
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

// extend router
mongoose.connect(dbsConfig.mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => {
  router.post('/verify', bodyParser.json(), async (req, res) => {
    const {email} = req.body

    const emailResult = await User.find({email})

    if (emailResult.length) {
      return res.json({
        code: -1,
        message: '该邮箱已被注册'
      })
    }

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

  router.post('/register', bodyParser.json(), async (req, res) => {
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

  router.post('/login', bodyParser.json(), async (req, res) => {
    const {username, password} = req.body

    const user = await User.findOne({username})

    if (!user) {
      return res.json({
        code: -1,
        message: '用户名不存在'
      })
    }

    if (user.password !== password) {
      return res.json({
        code: -1,
        message: '密码错误'
      })
    }

    req.session.username = username

    req.session.save()

    res.json({
      code: 0,
      message: `${username}，欢迎回来`
    })
  })

  router.post('/checkLogin', bodyParser.json(), async (req, res) => {
    const username = req.session.username

    if (!username) {
      return res.json({
        code: -1,
        message: '尚未登陆'
      })
    }

    const result = await User.findOne({username})

    if (!result) {
      return res.json({
        code: -1,
        message: 'session中的username与数据库中不匹配'
      })
    }

    res.json({
      code: 0,
      userInfo: {
        username: result.username,
        songs: result.songs,
        friends: result.friends
      }
    })
  })

  router.post('/logout', bodyParser.json(), (req, res) => {
    req.session.destroy(error => {
      if (error) {
        return res.json({
          code: -1,
          error
        })
      }
    })

    res.json({
      code: 0,
      message: '成功登出'
    })
  })

  router.post('/uploadFavorite', bodyParser.json(), async (req, res) => {
    if (!req.session.username) {
      return res.json({
        code: -1,
        message: '未登陆'
      })
    }

    const songs = req.body.songs
    const username = req.session.username

    const result = await User.updateOne({username}, {songs})

    if (result) {
      res.json({
        code: 0,
        message: '歌曲更新成功'
      })
    } else {
      res.json({
        code: -1,
        message: '该用户不存在'
      })
    }
  })

  router.post('/downloadFavorite', bodyParser.json(), async (req, res) => {
    if (!req.session.username) {
      return res.json({
        code: -1,
        message: '未登陆'
      })
    }

    const username = req.body.username

    const result = await User.findOne({username})

    if (!result) {
      res.json({
        code: -1,
        message: '该用户不存在'
      })
    } else {
      res.json({
        code: 0,
        data: result.songs
      })
    }
  })

  router.post('/searchUser', bodyParser.json(), async (req, res) => {
    if (!req.session.username) {
      return res.json({
        code: -1,
        message: '未登陆'
      })
    }

    const {username} = req.body

    const result = await User.find({})
    const filteredResult = result.filter(item => {
      return item.username.indexOf(username) !== -1 &&
        item.username !== req.session.username
    })
    const retResult = []
    filteredResult.forEach(item => {
      retResult.push({
        username: item.username,
        songs: item.songs
      })
    })

    res.json({
      code: 0,
      data: retResult
    })
  })

  router.post('/addFriend', bodyParser.json(), async (req, res) => {
    if (!req.session.username) {
      return res.json({
        code: -1,
        message: '未登陆'
      })
    }

    const friendUsername = req.body.username
    const mine = req.session.username

    const friends = (await User.findOne({username: mine})).friends
    friends.push(friendUsername)

    const result = await User.updateOne({username: mine}, {friends})
    if (result) {
      res.json({
        code: 0,
        message: '关注成功'
      })
    } else {
      res.json({
        code: -1,
        message: '关注失败'
      })
    }
  })

  router.post('/removeFriend', bodyParser.json(), async (req, res) => {
    if (!req.session.username) {
      return res.json({
        code: -1,
        message: '未登陆'
      })
    }

    const friend = req.body.username
    const mine = req.session.username

    const friends = (await User.findOne({username: mine})).friends
    const index = friends.indexOf(friend)
    if (index === -1) {
      return res.json({
        code: -1,
        message: `${friend}不在关注列表`
      })
    }
    friends.splice(index, 1)
    const result = await User.updateOne({username: mine}, {friends})
    if (result) {
      res.json({
        code: 0,
        message: '取关成功'
      })
    } else {
      res.json({
        code: -1,
        message: '取关失败'
      })
    }
  })
}).then(() => {
  app.use('/api', router)

  app.use(express.static('./dist'))

  const httpsSever = https.createServer(credential, app)

  httpsSever.listen(port, error => {
    if (error) {
      console.log(error)
    } else {
      console.log('listen at https://localhost:' + port)
    }
  })
}).catch(error => {
  console.log(error)
})
