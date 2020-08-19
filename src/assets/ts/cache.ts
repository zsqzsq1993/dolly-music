import storage from 'src/assets/ts/storage'
import {Song} from 'src/assets/ts/Song'

export const SEARCH_KEY = '__search__'
export const PLAY_KEY = '__play__'
export const FAVORITE_KEY = '__favorite__'

const MAX_SEARCH = 15
const MAX_RECENT_PLAY = 200
const MAX_FAVORITE = 200

type History = Array<string | Song>
type NewHistory = string | Song
type Flag = '__search__' | '__play__' | '__favorite__'

export function addOne(historyList: History, newHistory: NewHistory, flag: Flag): History {
  const callback = flag === SEARCH_KEY
    ? (item: string) =>  item === newHistory
    : (item: Song) => item.songmid === (newHistory as Song).songmid

  const index = historyList.findIndex(callback as any)

  if (index > -1) {
    historyList.splice(index, 1)
  }

  historyList.unshift(newHistory)

  const maxLength = flag === SEARCH_KEY
    ? MAX_SEARCH
    : flag === PLAY_KEY
      ? MAX_RECENT_PLAY
      : MAX_FAVORITE

  if (historyList.length > maxLength) {
    historyList.push()
  }

  storage.set(flag, historyList)

  return historyList
}

export function removeOne(historyList: History, newHistory: NewHistory, flag: Flag): History {
  const callback = flag === SEARCH_KEY
    ? (item: string) =>  item === newHistory
    : (item: Song) => item.songmid === (newHistory as Song).songmid

  const index = historyList.findIndex(callback as any)

  if (index !== -1) {
    historyList.splice(index, 1)
    storage.set(flag, historyList)
  }

  return historyList
}

export function clearAll(flag: Flag) {
  storage.remove(flag)
}
