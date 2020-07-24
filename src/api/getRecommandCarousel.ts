import {commonData, recommandCarouselData} from 'src/api/config'
import dollyAxios from 'dolly-axios'

const devMode: boolean = process.env.NODE_ENV !== 'production'

export default function (): Promise<any> {
  const url = devMode
    ? '/api/getRecommandCarousel'
    : '' // 服务器接口

  const data = Object.assign({}, commonData, recommandCarouselData)

  return dollyAxios.get(url, {params: data})
    .then(result => {
      return result.data
    })
}
