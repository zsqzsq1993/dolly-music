import {commonData, topListData, jsonpOptions} from 'src/api/config'
import {jsonp} from 'src/assets/ts/jsonp'

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonData, topListData)

  return jsonp(url, data, jsonpOptions)
}
