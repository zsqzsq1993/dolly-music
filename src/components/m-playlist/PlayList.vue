<template>
  <transition name="playlist">
    <div class="filter" v-show="showFlag" @click="hide">
      <div class="m-play-list" @click.stop>
        <div class="play-list-main">
          <div class="play-list-header">
            <div class="play-mode-button">
              <i :class="playModeIcon"></i>
            </div>
            <div class="play-mode-text" v-text="playModeText"></div>
            <div class="clear-button">
              <i class="icon-clear"></i>
            </div>
          </div>
          <ul class="play-list-songs">
            <li class="song-wrapper"
                v-for="(song, idx) in sequenceList"
                :key="song.songid">
              <div class="current-song-flag" v-show="showCurrent(idx)">
                <i class="icon-play-mini"></i>
              </div>
              <div class="song-name" v-text="song.songname"></div>
              <div class="favorite-button">
                <i class="icon-favorite"></i>
              </div>
              <div class="delete-button">
                <i class="icon-delete"></i>
              </div>
            </li>
          </ul>
          <div class="add-song-wrapper">
            <div class="add-song-button">
              <i class="icon-add"></i><span class="text">添加歌曲到队列</span>
            </div>
          </div>
        </div>
        <div class="play-list-footer" @click="hide">关闭</div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import {Getter} from 'vuex-class'
    import {playmode} from 'src/assets/ts/config'
    import {Song} from 'src/assets/ts/Song'

    @Component
    export default class extends Vue {
      @Getter('playMode') readonly playMode!: string
      @Getter('sequenceList') readonly sequenceList!: Array<Song>
      @Getter('currentSong') readonly currentSong!: Song

      showFlag = false

      get playModeIcon() {
        return this.forEach((key: string) => {
          return 'icon-' + key
        })
      }

      get playModeText() {
        const strategy = {
          random: '随机播放',
          loop: '单曲循环',
          sequence: '顺序播放'
        }
        return this.forEach((key: string) => {
          return strategy[key]
        })
      }

      show() {
        this.showFlag = true
      }

      hide() {
        this.showFlag = false
      }

      showCurrent(index: number) {
        const seqIndex = this.sequenceList.findIndex((item: Song) => {
          return item.songid === this.currentSong.songid
        })

        return index === seqIndex
      }

      forEach(callback: any) {
        Object.keys(playmode).forEach((key: string) => {
          if (this.playMode === playmode[key]) {
            callback(key)
          }
        })
      }
    }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'
  @import '~assets/stylus/mixin.styl'

  .playlist-enter-active, .playlist-leave-active
    transition all linear .4s
  .playlist-enter, .playlist-leave-to
    opacity 0
    .m-play-list
      transform translate3d(0, 100%, 0)
  .playlist-enter-to, .playlist-leave
    opacity 1
    .m-play-list
      transform translate3d(0, 0, 0)
  .filter
    position fixed
    z-index 300
    top 0
    right 0
    bottom 0
    left 0
    background-color $color-background-d

    .m-play-list
      position absolute
      z-index 350
      bottom 0
      width 100%
      background-color $color-highlight-background

      .play-list-header
        display flex
        align-items center

        .play-mode-button
          margin-right 10px
          font-size 30px
          color $color-theme-d
        .play-mode-text
          flex 1
          color $color-text-l
          font-size $font-size-median
          overflow hidden
        .clear-button
          extend-click()
          color $color-text-d
          font-size $font-size-median

      .play-list-songs
        max-height 240px
        overflow hidden

        .song-wrapper
          display flex
          align-items center
          height 40px
          padding 0 30px 0 20px
          overflow hidden

          .current-song-flag
            flex 0 0 20px
            width 20px
            color $color-theme-d
            font-size $font-size-small

          .song-name
            flex 1
            no-wrap()
            color $color-text-d
            font-size $font-size-median

          .favorite-button
            extend-click()
            margin-right 15px
            color $color-theme
            font-size $font-size-small

          .delete-button
            extend-click()
            color $color-theme
            font-size $font-size-small

      .add-song-wrapper
        margin: 20px auto 30px
        .add-song-button
          display flex
          align-items center
          justify-content center
          padding 8px 16px
          border 1px solid $color-text-l
          border-radius 100px
          i
            font-size $font-size-small-s
          .text
            font-size $font-size-small
      .play-list-footer
        line-height 50px
        text-align center
        color $color-text-l
        font-size $font-size-median-x
        background-color $color-background
</style>
