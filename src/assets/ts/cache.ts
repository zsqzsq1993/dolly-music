import storage from 'src/assets/ts/storage'
import {Song} from 'src/assets/ts/Song'

export const SEARCH_KEY = '__search__'
export const PLAY_KEY = '__play__'

const MAX_SEARCH_LEN = 15
const MAX_RECENT_PLAY = 200

export function addOne(historyList: Array<string>, newHistory: string): Array<string> {
  const index = historyList.findIndex(item => item === newHistory)
  if (index > -1) {
    historyList.splice(index, 1)
  }

  historyList.unshift(newHistory)
  if (historyList.length > MAX_SEARCH_LEN) {
    historyList.push()
  }

  storage.set(SEARCH_KEY, historyList)
  return historyList
}

export function removeOne(historyList: Array<string>, newHistory: string): Array<string> {
  const index = historyList.findIndex(item => item === newHistory)
  if (index !== -1) {
    historyList.splice(index, 1)
    storage.set(SEARCH_KEY, historyList)
  }
  return historyList
}

export function clearAll(): Array<undefined> {
  storage.remove(SEARCH_KEY)
  return []
}

export function addOneSong(historyList: Array<Song>, song: Song): Array<Song> {
  const index = historyList.findIndex(item => item.songmid === song.songmid)

  if (index > -1) {
    historyList.splice(index, 1)
  }

  historyList.unshift(song)
  if (historyList.length > MAX_RECENT_PLAY) {
    historyList.push()
  }

  storage.set(PLAY_KEY, historyList)
  return historyList
}
