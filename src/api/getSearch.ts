import {devMode, commonData, hotSearchData, getSearchData} from 'src/api/config'
import dollyAxios from 'dolly-axios'

export function getHotSearch() {
  const url = devMode
    ? '/api/getHotSearch'
    : ''

  const data = Object.assign({}, commonData, hotSearchData)

  return dollyAxios.get(url, {
    params: data
  }).then(response => {
    return response.data
  })
}

export function getSearch(keyword: string, page: number, zhida: boolean, perpage: number) {
  const url = devMode
    ? '/api/getSearch'
    : ''

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
