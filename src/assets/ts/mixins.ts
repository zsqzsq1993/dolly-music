import Vue from 'vue'
import {playmode} from 'src/assets/ts/config'
import {mapGetters, mapMutations} from 'vuex'
import * as types from 'src/store/mutation-types'
import {Song} from 'src/assets/ts/Song'
import {shuffle} from 'src/assets/ts/util'

export const playListMixin = Vue.extend({
  methods: {
    handlePlayList(): void {
      throw new Error('handlePlayList function must be overwritten.')
    }
  },

  mounted() {
    this.handlePlayList()
  },

  activated() {
    this.handlePlayList()
  },

  watch: {
    'playList.length': function () {
      this.handlePlayList()
    }
  }
})

export const playerMixin = Vue.extend({
  computed: {
    playModeIcon() {
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
    },

    playModeText() {
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
    },

    ...mapGetters([
      'playMode',
      'sequenceList',
      'currentSong'
    ])
  },

  methods: {
    changePlayMode() {
      const newMode = (this.playMode + 1) % 3
      this.setPlayMode(newMode)
      const newPlayList = this._refreshPlayList()
      const newIndex = this._refreshIndex(newPlayList)

      this.setPlayList(newPlayList)
      this.setCurrentIndex(newIndex)
    },

    _refreshPlayList() {
      let list: Array<Song>
      if (this.playMode === playmode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      return list
    },

    _refreshIndex(list: Array<Song>) {
      return list.findIndex(item => {
        return this.currentSong.songid === item.songid
      })
    },

    ...mapMutations({
      'setPlayMode': types.SET_PLAY_MODE,
      'setPlayList': types.SET_PLAY_LIST,
      'setCurrentIndex': types.SET_CURRENT_INDEX
    })
  }
})
