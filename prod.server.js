const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

const port = process.env.PORT || 9000

const app = express()

const router = express.Router()

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

app.use('/api', router)

app.use(express.static('./dist'))

app.listen(port, (error) => {
  if (error) {
    console.log(error)
  } else {
    console.log('listen at http:localhost:' + port)
  }
})
