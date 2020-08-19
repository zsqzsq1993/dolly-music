import {Component, Watch, Vue} from 'vue-property-decorator'
import {Getter, Mutation, Action} from 'vuex-class'
import {playmode} from 'src/assets/ts/config'
import * as types from 'src/store/mutation-types'
import {Song} from 'src/assets/ts/Song'
import {shuffle} from 'src/assets/ts/util'

@Component
export class PlayListMixin extends Vue {
  @Watch('playList.length')
  activate() {
    this.handlePlayList()
  }

  mounted() {
    this.handlePlayList()
  }

  activated() {
    this.handlePlayList()
  }

  handlePlayList(): void {
    throw new Error('handlePlayList function must be overwritten.')
  }
}

@Component
export class HistoryMixin extends Vue {
  @Action('addOneHistory') addOneHistory: any
  @Action('removeOneHistory') removeOneHistory: any
  @Action('clearHistory') clearHistory: any
}

@Component
export class SearchMixin extends HistoryMixin {
  query = ''

  handleQuery(query: string) {
    this.query = query

    if (!query) {
      setTimeout(() => {
        this.$refs.scroll && (this.$refs.scroll as any).refresh()
      }, 20)
    }
  }

  fillSearchBox(query: string) {
    (this.$refs.searchBox as any).fillContent(query)
  }

  addOneSearchHistory(val: string) {
    this.addOneHistory({
      history: val,
      flag: 'search'
    })
  }

  removeOneSearchHistory(val: string) {
    this.removeOneHistory({
      history: val,
      flag: 'search'
    })
  }

  clearSearchHistory() {
    this.clearHistory('search')
  }
}

@Component
export class FavoriteMixin extends HistoryMixin {
  @Getter('favoriteHistory') readonly favoriteHistory!: Array<Song>
  @Getter('currentSong') readonly currentSong!: Song

  getIcon(song: Song) {
    return this.checkInHistory(song)
      ? 'icon-favorite'
      : 'icon-not-favorite'
  }

  addOneFavorite(song: Song) {
    this.addOneHistory({
      history: song,
      flag: 'favorite'
    })
  }

  removeOneFavorite(song: Song) {
    this.removeOneHistory({
      history: song,
      flag: 'favorite'
    })
  }

  checkInHistory(song: Song) {
    return this.favoriteHistory.findIndex((item: Song) => {
      return item.songmid === song.songmid
    }) > -1
  }

  toggleFavorite(song: Song) {
    if (this.checkInHistory(song)) {
      this.removeOneFavorite(song)
    } else {
      this.addOneFavorite(song)
    }
  }
}

@Component
export class PlayerMixin extends FavoriteMixin {
  @Getter('playMode') readonly playMode!: number
  @Getter('playList') readonly playList!: Array<Song>
  @Getter('sequenceList') readonly sequenceList!: Array<Song>

  @Mutation(types.SET_PLAY_MODE) setPlayMode: any
  @Mutation(types.SET_PLAY_LIST) setPlayList: any
  @Mutation(types.SET_CURRENT_INDEX) setCurrentIndex: any

  get playModeIcon() {
    let icon = 'icon-'

    switch (this.playMode) {
      case playmode.loop:
        icon += 'loop'
        break
      case playmode.sequence:
        icon += 'sequence'
        break
      case playmode.random:
        icon += 'random'
        break
      default:
        break
    }
    return icon
  }

  get playModeText() {
    const strategy: {
      [key: string]: string;
    } = {
      random: '随机播放',
      loop: '单曲循环',
      sequence: '顺序播放'
    }

    let key = ''

    switch (this.playMode) {
      case playmode.loop:
        key = 'loop'
        break
      case playmode.sequence:
        key = 'sequence'
        break
      case playmode.random:
        key = 'random'
        break
      default:
        break
    }

    return strategy[key]
  }

  changePlayMode() {
    const newMode = (this.playMode + 1) % 3
    this.setPlayMode(newMode)
    const newPlayList = this._refreshPlayList()
    const newIndex = this._refreshIndex(newPlayList)

    this.setPlayList(newPlayList)
    this.setCurrentIndex(newIndex)
  }

  _refreshPlayList() {
    let list: Array<Song>
    if (this.playMode === playmode.random) {
      list = shuffle(this.sequenceList)
    } else {
      list = this.sequenceList
    }
    return list
  }

  _refreshIndex(list: Array<Song>) {
    return list.findIndex(item => {
      return this.currentSong.songid === item.songid
    })
  }
}
