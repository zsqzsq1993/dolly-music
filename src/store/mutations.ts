import * as types from './mutation-types'
import { SingerInstance } from 'src/assets/ts/Singer'

const mutations = {
  [types.SET_SINGER] (state: any, singer: SingerInstance) {
    state.singer = singer
  }
}

export default mutations
