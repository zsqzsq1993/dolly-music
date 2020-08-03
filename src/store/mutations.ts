import * as types from './mutation-types'
import { SingerInstance } from 'src/assets/ts/Singer'
import {Song} from 'src/assets/ts/Song'

const mutations = {
  [types.SET_SINGER] (state: any, singer: SingerInstance) {
    state.singer = singer
  },

  [types.SET_SEQUENCE_LIST] (state: any, list: Array<Song>) {
    state.sequenceList = list
  },

  [types.SET_PLAY_LIST] (state: any, list: Array<Song>) {
    state.playList = list
  },

  [types.SET_PLAY_MODE] (state: any, mode: string) {
    state.playMode = mode
  },

  [types.SET_PLAYING_STATE] (state: any, flag: boolean) {
    state.playing = flag
  },

  [types.SET_FULL_SCREEN] (state: any, flag: boolean) {
    state.fullScreen = flag
  },

  [types.SET_CURRENT_INDEX] (state: any, flag: boolean) {
    state.currentIndex = flag
  }
}

export default mutations
