import {
  commonData,
  singerListData,
  jsonpOptions
} from 'src/api/config'
import {jsonp} from 'src/assets/ts/jsonp'

export function getSingerList(options?: any): Promise<any> {
  options = options || {}

  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonData, singerListData, options)

  return jsonp(url, data, jsonpOptions)
}
