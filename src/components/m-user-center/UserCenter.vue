<template>
  <transition name="slide" appear>
    <div class="m-user-center" @click="back">
      <div class="back-wrapper">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :tablist="tablist"
                  @select-item="setCurrentIndex"></switches>
      </div>
      <div class="random-play-wrapper">
        <div class="random-play-button">
          <i class="icon-play"></i>
          <span>随机播放全部</span>
        </div>
      </div>
      <Scroll :data="scrollData" ref="scroll">
        <songs-list :songs="songlist"
                    @select="activatePlayer"></songs-list>
      </Scroll>
    </div>
  </transition>
</template>

<script lang="ts">
  import {Component, Watch, Mixins} from 'vue-property-decorator'
  import {Getter, Action} from 'vuex-class'
  import Switches from 'base/m-switches/Switches.vue'
  import Scroll from 'base/m-scroll/Scroll.vue'
  import SongsList from 'base/m-songs-list/SongsList.vue'
  import {Song} from 'src/assets/ts/Song'
  import {PlayListMixin} from 'src/assets/ts/mixins'

  @Component({
    components: {
      Switches,
      Scroll,
      SongsList
    }
  })
  export default class extends Mixins(PlayListMixin) {
    @Getter('favoriteHistory') readonly favoriteHistory!: Array<Song>
    @Getter('playHistory') readonly playHistory!: Array<Song>
    @Getter('playList') readonly playList!: Array<Song>

    @Action('insertSong') insertSong: any

    @Watch('currentIndex')
    whenIndexChange(newVal: number, oldVal: number) {
      if (newVal !== oldVal) {
        this.refreshScroll()
      }
    }

    tablist = ['我喜欢的', '最近听的']
    currentIndex = 0

    get songlist() {
      return !this.currentIndex
        ? this.favoriteHistory
        : this.playHistory
    }

    get scrollData() {
      return Array.prototype.concat(this.favoriteHistory, this.playHistory)
    }

    mounted() {
      this.$nextTick(() => {
        this.refreshScroll()
      })
    }

    back() {
      this.$router.push('/')
    }

    setCurrentIndex(index: number) {
      this.currentIndex = index
    }

    activatePlayer(song: Song) {
      this.insertSong(song)
    }

    refreshScroll() {
      (this.$refs.scroll as any).refresh()
    }

    handlePlayList() {
      const bottom = this.playList.length ? 60 : 0;
      (this.$refs.scroll as any).$el.style.bottom = bottom + 'px'
      this.refreshScroll()
    }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .slide-enter-active, .slide-leave-active
    transition all .4s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
  .m-user-center
    position fixed
    z-index 140
    top 0
    right 0
    bottom 0
    left 0
    background-color $color-background

    .back-wrapper
      position absolute
      top 0
      left 6px
      i
        display block
        padding 10px
        color $color-theme
        font-size $font-size-large-x

    .switches-wrapper
      margin 10px 0 30px
      .m-switches
        margin 0 auto
        width 240px

    .random-play-wrapper
      .random-play-button
        margin 0 auto
        box-sizing border-box
        width 135px
        padding 7px 0
        display flex
        align-items center
        justify-content center
        border 1px solid $color-text-l
        border-radius 100px
        color $color-text-l
        font-size 0
        i
          flex: 0 0 auto
          margin-right 6px
          font-size $font-size-median-x
        span
          flex: 0 0 auto
          font-size $font-size-small

    .m-scroll
      position absolute
      top 110px
      right 0
      bottom 0
      left 0
      overflow hidden
      .m-songs-list
        padding 20px 30px
</style>
