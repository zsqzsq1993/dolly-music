import {playmode} from 'src/assets/ts/config'

const state = {
  // used in singer detail page
  singer: {},

  // used in player page
  sequenceList: [],
  playList: [],
  playMode: playmode.sequence,
  playing: false,
  fullScreen: false,
  currentIndex: -1
}

export default state
