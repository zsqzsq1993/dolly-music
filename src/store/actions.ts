import {ActionTree} from 'vuex'
import * as types from './mutation-types'
import {playmode} from 'src/assets/ts/config'
import {shuffle} from 'src/assets/ts/util'
import {Song} from 'src/assets/ts/Song'
import {addOne, removeOne, clearAll} from 'src/assets/ts/cache'

const findIndex = (list: Array<Song>, song: Song) => {
  return list.findIndex(item => {
    return song.songid === item.songid
  })
}

const insertSongHelper = (list: Array<Song>, currentIndex: number, existIndex: number, newSong: Song) => {
  if (currentIndex === existIndex) {
    return -1
  }
  list.splice(currentIndex, 0, newSong)
  if (existIndex > currentIndex) {
    list.splice(existIndex + 1, 1)
  } else if (existIndex < currentIndex && existIndex > -1) {
    list.splice(existIndex, 1)
    currentIndex--
  }
  return currentIndex
}

const deleteSongHelper = (list: Array<Song>, currentIndex: number, deleteIndex: number) => {
  if (deleteIndex < currentIndex) {
    currentIndex--
  }

  list.splice(deleteIndex, 1)
  if (currentIndex === list.length) {
    currentIndex--
  }

  return currentIndex
}

const   deactivatePlayer = (commit: any) => {
  commit(types.SET_PLAYING_STATE, false)
  commit(types.SET_FULL_SCREEN, false)
  commit(types.SET_PLAY_LIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, 0)
}

const actions: ActionTree<any, any> = {
  activatePlayer({commit, state}, {list, index}) {
    let playList, newIndex
    if (state.playMode === playmode.random) {
      playList = shuffle(list)
      newIndex = findIndex(playList, list[index])
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
  },

  insertSong({commit, state}, {newSong}) {
    // obtain variables
    const playList = state.playList.slice()
    const sequenceList = state.sequenceList.slice()

    let currentIndex = state.currentIndex
    const currentSong = playList[currentIndex]
    let currentSequenceIndex = findIndex(sequenceList, currentSong)
    currentSequenceIndex = currentSequenceIndex > -1 ? currentSequenceIndex : 0

    const existIndex = findIndex(playList, newSong)
    const existSequenceIndex = findIndex(sequenceList, newSong)

    // refreshing
    currentIndex = insertSongHelper(playList, currentIndex, existIndex, newSong)
    insertSongHelper(sequenceList, currentSequenceIndex, existSequenceIndex, newSong)

    // Commit
    if (currentIndex > -1) {
      commit(types.SET_PLAY_LIST, playList)
      commit(types.SET_SEQUENCE_LIST, sequenceList)
      commit(types.SET_CURRENT_INDEX, currentIndex)
    }
    commit(types.SET_PLAYING_STATE, true)
    commit(types.SET_FULL_SCREEN, true)
  },

  switchSong({commit, state}, song) {
    const playList = state.playList.slice()
    const index = findIndex(playList, song)
    commit(types.SET_CURRENT_INDEX, index)
  },

  deleteSong({commit, state}, song) {
    const playList = state.playList.slice()
    const sequenceList = state.sequenceList.slice()
    const currentIndex = state.currentIndex

    const delIndexInPlayList = findIndex(playList, song)
    const delIndexInSeqList = findIndex(sequenceList, song)

    const newIndex = deleteSongHelper(playList, currentIndex, delIndexInPlayList)
    sequenceList.splice(delIndexInSeqList, 1)

    if (!sequenceList.length && !playList.length && !currentIndex) {
      deactivatePlayer(commit)
    } else {
      commit(types.SET_SEQUENCE_LIST, sequenceList)
      commit(types.SET_PLAY_LIST, playList)
      commit(types.SET_CURRENT_INDEX, newIndex)
    }
  },

  clearPlayList({commit}) {
    deactivatePlayer(commit)
  },

  addOneHistory({commit, state}, oneHistory) {
    let historylist = state.searchHistory.slice()
    historylist = addOne(historylist, oneHistory)
    commit(types.SET_SEARCH_HISTORY, historylist)
  },

  removeOneHistory({commit, state}, oneHistory) {
    let historylist = state.searchHistory.slice()
    historylist = removeOne(historylist, oneHistory)
    commit(types.SET_SEARCH_HISTORY, historylist)
  },

  clearHistory({commit}) {
    clearAll()
    commit(types.SET_SEARCH_HISTORY, [])
  }
}

export default actions
