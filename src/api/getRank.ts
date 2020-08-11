import {
  commonData,
  topListData,
  topListDetailData,
  jsonpOptions
} from 'src/api/config'
import {jsonp} from 'src/assets/ts/jsonp'

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonData, topListData)

  return jsonp(url, data, jsonpOptions)
}

export function getTopListDetail(topid: number) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonData, topListDetailData, {topid})

  return jsonp(url, data, jsonpOptions)
}
