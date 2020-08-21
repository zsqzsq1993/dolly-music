import {devMode, commonData, hotSearchData, getSearchData, HOST} from 'src/api/config'
import dollyAxios from 'dolly-axios'

export function getHotSearch() {
  const basicUrl = '/api/getHotSearch'

  const url = devMode
    ? basicUrl
    : HOST + basicUrl

  const data = Object.assign({}, commonData, hotSearchData)

  return dollyAxios.get(url, {
    params: data
  }).then(response => {
    return response.data
  })
}

export function getSearch(keyword: string, page: number, zhida: boolean, perpage: number) {
  const basicUrl = '/api/getSearch'

  const url = devMode
    ? basicUrl
    : HOST + basicUrl

  const data = Object.assign({}, getSearchData, {
    w: keyword,
    p: page,
    catZhida: zhida ? 1 : 0,
    perpage,
    n: perpage
  })

  return dollyAxios.get(url, {
    params: data
  }).then(response => {
    return response.data
  })
}
