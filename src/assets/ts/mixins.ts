import Vue from 'vue'
import {playmode} from 'src/assets/ts/config'
import {mapGetters} from 'vuex'

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

    ...mapGetters([
      'playMode'
    ])
  }
})
