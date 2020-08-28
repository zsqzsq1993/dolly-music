<template>
  <transition name="slide" appear>
    <div class="m-user-center" @click="back">
      <div class="back-wrapper">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <user-center-controller @select-item="setCurrentIndex"></user-center-controller>
      </div>
      <div class="random-play-wrapper" v-show="showRandomPlay">
        <div class="random-play-button" @click="randomPlayAll">
          <i class="icon-play"></i>
          <span>随机播放全部</span>
        </div>
      </div>
      <Scroll :data="songlist" ref="scroll" v-show="currentIndex !== 2">
        <songs-list :songs="songlist"
                    v-show="songlist.length"
                    @select="activatePlayer"></songs-list>
        <div class="no-results-wrapper" v-show="!songlist.length"  @click.stop>
          <no-results :text="NoResultsText"></no-results>
        </div>
      </Scroll>
      <div class="friends-wrapper" v-show="currentIndex === 2">
        <friends></friends>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
  import {Component, Watch, Mixins} from 'vue-property-decorator'
  import {Getter, Action} from 'vuex-class'
  import Switches from 'base/m-switches/Switches.vue'
  import UserCenterController from 'components/m-user-center-controller/UserCenterController.vue'
  import Scroll from 'base/m-scroll/Scroll.vue'
  import SongsList from 'base/m-songs-list/SongsList.vue'
  import NoResults from 'base/m-no-results/NoResults.vue'
  import Friends from 'components/m-friends/Friends.vue'
  import {Song} from 'src/assets/ts/Song'
  import {PlayListMixin} from 'src/assets/ts/mixins'

  @Component({
    components: {
      Switches,
      Scroll,
      SongsList,
      NoResults,
      UserCenterController,
      Friends
    }
  })
  export default class extends Mixins(PlayListMixin) {
    @Getter('favoriteHistory') readonly favoriteHistory!: Array<Song>
    @Getter('playHistory') readonly playHistory!: Array<Song>
    @Getter('playList') readonly playList!: Array<Song>

    @Action('insertSong') insertSong: any
    @Action('randomlyActivePlayer') randomlyActivePlayer: any

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

    get NoResultsText() {
      return this.currentIndex
        ? '尚未听过歌曲'
        : '尚未添加歌曲'
    }

    get showRandomPlay() {
      return this.songlist.length && this.currentIndex !== 2
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

    randomPlayAll() {
      this.randomlyActivePlayer({
        list: this.songlist
      })
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
      width 100%
      margin 10px 0 20px 0
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
      top 235px
      right 0
      bottom 0
      left 0
      overflow hidden
      .m-songs-list
        padding 20px 30px
      .no-results-wrapper
        width 100%
        height 100%

    .friends-wrapper
      position absolute
      top 180px
      right 0
      bottom 0
      left 0
</style>
