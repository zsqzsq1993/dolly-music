import {devMode, topListData} from 'src/api/config'
import dollyAxios from 'dolly-axios'

export function getTopList() {
  const url = devMode
    ? '/api/getTopList'
    : ''

  const data = Object.assign({}, topListData)

  return dollyAxios.get(url, {
    params: data
  }).then(response => {
    return response.data
  })
}
