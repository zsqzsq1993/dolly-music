import * as types from './mutation-types'
import { Singer } from 'src/assets/ts/Singer'
import {Song} from 'src/assets/ts/Song'

const mutations = {
  [types.SET_SINGER] (state: any, singer: Singer) {
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
  },

  [types.SET_DISS] (state: any, item: any) {
    state.diss = item
  },

  [types.SET_TOP_LIST] (state: any, list: any) {
    state.toplist = list
  },

  [types.SET_SEARCH_HISTORY] (state: any, list: Array<string>) {
    state.searchHistory = list
  },

  [types.SET_PLAY_HISTORY] (state: any, list: Array<Song>) {
    state.playHistory = list
  },

  [types.SET_FAVORITE_HISTORY] (state: any, list: Array<Song>) {
    state.favoriteHistory = list
  },

  [types.SET_LOGIN_PAGE_FLAG] (state: any, flag: boolean) {
    state.loginPageFlag = flag
  },

  [types.SET_LOGIN_INFO] (state: any, object: any) {
    state.loginInfo = object
  },

  [types.SET_FRIEND_USER_NAME] (state: any, name: string) {
    state.friendUsername = name
  }
}

export default mutations
