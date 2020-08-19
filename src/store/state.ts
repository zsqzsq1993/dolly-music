import {playmode} from 'src/assets/ts/config'
import storage from 'src/assets/ts/storage'
import {SEARCH_KEY, PLAY_KEY, FAVORITE_KEY} from 'src/assets/ts/cache'

const state = {
  // used in singer detail page
  singer: {},

  // used in player page
  sequenceList: [],
  playList: [],
  playMode: playmode.sequence,
  playing: false,
  fullScreen: false,
  currentIndex: 0,
  diss: {},
  toplist: {},
  searchHistory: storage.get(SEARCH_KEY) || [],
  playHistory: storage.get(PLAY_KEY) || [],
  favoriteHistory: storage.get(FAVORITE_KEY) || []
}

export default state
