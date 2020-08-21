import {
  commonData,
  recommandCarouselData,
  recommandListData,
  recommandDetailData,
  RetData,
  devMode,
  HOST
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
  const basicUrl = '/api/getRecommandCarousel'

  const url = devMode
    ? basicUrl
    : HOST + basicUrl

  const data = Object.assign({}, commonData, recommandCarouselData)

  return dollyAxios.get(url, {params: data})
    .then(response => {
      return response.data
    })
}

export function getRecommandList(): Promise<RetData<ListData>> {
  const basicUrl = '/api/getRecommandList'

  const url = devMode
    ? basicUrl
    : HOST + basicUrl

  const data = Object.assign({}, commonData, recommandListData)

  return dollyAxios.get(url, {
    params: data
  }).then(response => {
    return response.data
  })
}

export function getRecommandDetail(disstid: number): Promise<Array<any>> {
  const basicUrl = '/api/getRecommandDetail'

  const url = devMode
    ? basicUrl
    : HOST + basicUrl

  const data = Object.assign({}, commonData, recommandDetailData, {disstid})

  return dollyAxios(url, {
    params: data
  }).then(response => {
    return response.data
  })
}
