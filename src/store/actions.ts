import {ActionTree} from 'vuex'
import * as types from './mutation-types'

const actions: ActionTree<any, any> = {
  activatePlayer({commit}, {list, index}) {
    commit(types.SET_PLAY_LIST, list)
    commit(types.SET_SEQUENCE_LIST, list)
    commit(types.SET_PLAYING_STATE, true)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_CURRENT_INDEX, index)
  }
}

export default actions
