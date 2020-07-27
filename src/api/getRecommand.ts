import {commonData, recommandCarouselData, recommandListData} from 'src/api/config'
import dollyAxios from 'dolly-axios'

const devMode: boolean = process.env.NODE_ENV !== 'production'

interface RetData<T> {
  code: number;
  data: Array<T>;
}

export interface SliderData {
  picUrl: string;
  jumpUrl: string;
}

export interface ListData {
  creator: {
    name: string;
  };
  dissname: string;
  imgurl: string;
}

export function getRecommandCarousel(): Promise<RetData<SliderData>> {
  const url = devMode
    ? '/api/getRecommandCarousel'
    : '' // 服务器接口

  const data = Object.assign({}, commonData, recommandCarouselData)

  return dollyAxios.get(url, {params: data})
    .then(response => {
      return response.data
    })
}

export function getRecommandList(): Promise<RetData<ListData>> {
  const url = devMode
    ? '/api/getRecommandList'
    : '' // 服务器接口

  const data = Object.assign({}, commonData, recommandListData)

  return dollyAxios.get(url, {
    params: data
  }).then(response => {
    return response.data
  })
}
