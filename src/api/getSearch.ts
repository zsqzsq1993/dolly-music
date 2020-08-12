import {devMode, commonData, hotSearchData} from 'src/api/config'
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
