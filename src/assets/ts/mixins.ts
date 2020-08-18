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
export class PlayerMixin extends Vue {
  @Getter('playMode') readonly playMode!: number
  @Getter('sequenceList') readonly sequenceList!: Array<Song>
  @Getter('currentSong') readonly currentSong!: Song

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

@Component
export class SearchMixin extends Vue {
  @Action('addOneHistory') addOneHistory: any
  @Action('removeOneHistory') removeOneHistory: any

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
}
