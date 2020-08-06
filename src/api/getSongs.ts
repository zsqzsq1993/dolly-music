import {Song} from 'src/assets/ts/Song'
import {commonData, devMode, songUrlData, songLyricData} from 'src/api/config'
import dollyAxios from 'dolly-axios'

export function getLyric(song: Song): Promise<string> {
  const url = devMode
    ? '/api/getLyric'
    : ''

  const data = Object.assign({}, commonData, songLyricData, {
    songmid: song.songmid
  })

  return dollyAxios.get(url, {
    params: data
  }).then((response: any) => {
    response = response.data
    if (response.code === 0) {
      return response.lyric
    } else {
      throw new Error('can not get lyric.')
    }
  }).catch(e => {
    console.log(e)
  })
}

export function getSongUrl(songs: Array<Song>): Promise<any> {
  let attemptingTimes = 3

  let
    $resolve: any,
    $reject: any

  const url = devMode
    ? '/api/getSongUrl'
    : ''

  const data = Object.assign({}, commonData, songUrlData)

  const urlMid = getUrlMid(songs)

  const purlMap = Object.create(null)

  const request = function () {
    dollyAxios.post(url, {
      comm: data,
      req_0: urlMid
    }).then((response: any) => {
      response = response.data
      if (response.code === 0) {
        const data = response.req_0
        if (data.code === 0) {
          const dataList = data.data.midurlinfo as Array<any>
          dataList.forEach((item: any) => {
            if (item.purl) {
              purlMap[item.songmid] = item.purl
            }
          })
          if (Object.keys(purlMap).length > 0) {
            $resolve(purlMap)
          } else {
            retry()
          }
        } else {
          retry()
        }
      } else {
        retry()
      }
    })
  }

  const retry = function () {
    if (attemptingTimes-- > 0) {
      request()
    } else {
      $reject(new Error('can not get songs\' urls'))
    }
  }

  return new Promise((resolve, reject) => {
    $resolve = resolve
    $reject = reject
    request()
  })
}

function getUrlMid(songs: Array<Song>): any {
  const guid: string = getGuid()
  const mids: Array<number | undefined> = []
  const types: Array<number | undefined> = []

  songs.forEach(song => {
    mids.push(song.songmid)
    types.push(0)
  })

  return {
    module: 'vkey.GetVkeyServer',
    method: 'CgiGetVkey',
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  }
}

const getGuid = (function () {
  const uid = ''
  return function () {
    if (uid) {
      return uid
    } else {
      const t = (new Date()).getUTCMilliseconds()
      return '' + Math.round(2147483647 * Math.random()) * t % 1e10
    }
  }
})()
