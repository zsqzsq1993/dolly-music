import {
  commonData,
  recommandCarouselData,
  recommandListData,
  RetData,
  devMode
} from 'src/api/config'
import dollyAxios from 'dolly-axios'

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
