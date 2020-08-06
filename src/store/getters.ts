export const singer = (state: any) => state.singer

export const sequenceList = (state: any) => state.sequenceList

export const playMode = (state: any) => state.playMode

export const playing = (state: any) => state.playing

export const fullScreen = (state: any) => state.fullScreen

export const currentIndex = (state: any) => state.currentIndex

export const playList = (state: any) => state.playList

export const currentSong = (state: any) => {
  return state.playList[state.currentIndex] || {}
}
