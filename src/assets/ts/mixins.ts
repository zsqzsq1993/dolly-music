import Vue from 'vue'

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
