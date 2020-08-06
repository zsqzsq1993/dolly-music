import {ActionTree} from 'vuex'
import * as types from './mutation-types'
import {playmode} from 'src/assets/ts/config'
import {shuffle} from 'src/assets/ts/util'

const actions: ActionTree<any, any> = {
  activatePlayer({commit, state}, {list, index}) {
    let playList, newIndex
    if (state.playMode === playmode.random) {
      playList = shuffle(list)
      newIndex = playList.findIndex(item => {
        return list[index].songid === item.songid
      })
      console.log(newIndex)
    } else {
      playList = list
      newIndex = index
    }
    commit(types.SET_PLAY_LIST, playList)
    commit(types.SET_CURRENT_INDEX, newIndex)
    commit(types.SET_SEQUENCE_LIST, list)
    commit(types.SET_PLAYING_STATE, true)
    commit(types.SET_FULL_SCREEN, true)
  },

  randomlyActivePlayer({commit}, {list}) {
    commit(types.SET_SEQUENCE_LIST, list)
    commit(types.SET_PLAY_MODE, playmode.random)
    commit(types.SET_PLAYING_STATE, true)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAY_LIST, shuffle(list))
    commit(types.SET_CURRENT_INDEX, 0)
  }
}

export default actions
