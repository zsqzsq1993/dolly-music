import storage from 'src/assets/ts/storage'

export const SEARCH_KEY = '__search__'
const MAX_SEARCH_LEN = 15

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
