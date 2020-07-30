import * as config from './config'
import {jsonp} from 'src/assets/ts/jsonp'

export function getSingerList(options?: any): Promise<any> {
  options = options || {}

  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, config.commonData, config.singerListData, options)

  return jsonp(url, data, config.jsonpOptions)
}

export function getSingerDetail(id: string): Promise<any> {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, config.commonData, config.singerDetailData, {singermid: id})

  return jsonp(url, data, config.jsonpOptions)
}
