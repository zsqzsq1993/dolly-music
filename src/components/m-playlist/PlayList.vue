<template>
  <transition name="playlist">
    <div class="filter" v-show="showFlag" @click="hide">
      <div class="m-play-list" @click.stop>
        <div class="play-list-main">
          <div class="play-list-header">
            <div class="play-mode-button" @click="changePlayMode">
              <i :class="playModeIcon"></i>
            </div>
            <div class="play-mode-text" v-text="playModeText"></div>
            <div class="clear-button" @click.stop="showConfirm">
              <i class="icon-clear"></i>
            </div>
          </div>
          <scroll class="play-list-songs" :data="sequenceList" ref="shortcutScroll">
            <transition-group tag="ul" name="songlist">
              <li class="song-wrapper"
                  v-for="(song, idx) in sequenceList"
                  :key="song.songid + song.songmid"
                  ref="list">
                <div class="current-song-flag">
                  <i class="icon-play" v-show="showCurrent(idx)"></i>
                </div>
                <div class="song-name"
                     v-text="song.songname"
                     @click.stop="switchSong(song) && scrollToCurrent()"></div>
                <div class="favorite-button" @click.stop="toggleFavorite(song)">
                  <i :class="getIcon(song)"></i>
                </div>
                <div class="delete-button"
                     @click.stop="deleteSong(song) && scrollToCurrent()">
                  <i class="icon-delete"></i>
                </div>
              </li>
            </transition-group>
          </scroll>
          <div class="add-song-wrapper">
            <div class="add-song-button" @click.stop="toAddSongPage">
              <i class="icon-add"></i><span class="text">添加歌曲到队列</span>
            </div>
          </div>
          <div class="add-song-page">
            <add-song ref="addSong"></add-song>
          </div>
        </div>
        <div class="play-list-footer" @click="hide">关闭</div>
      </div>
      <confirm :remind-text="'是否清空所有歌曲列表'"
               @click-left="cancel"
               @click-right="confirm"
               ref="confirm"></confirm>
    </div>
  </transition>
</template>

<script lang="ts">
    import {Component, Mixins, Watch} from 'vue-property-decorator'
    import {Getter, Action} from 'vuex-class'
    import {Song} from 'src/assets/ts/Song'
    import Scroll from 'base/m-scroll/Scroll.vue'
    import Confirm from 'src/base/m-confirm/Confirm.vue'
    import {PlayerMixin} from 'src/assets/ts/mixins'
    import AddSong from 'components/m-add-song/AddSong.vue'

    @Component({
      components: {
        Scroll,
        Confirm,
        AddSong
      }
    })
    export default class extends Mixins(PlayerMixin) {
      @Getter('sequenceList') readonly sequenceList!: Array<Song>

      @Action('switchSong') switchSong: any
      @Action('deleteSong') deleteSong: any
      @Action('clearPlayList') clearPlayList: any

      @Watch('playList.length')
      whenClearPlayList(newVal: Array<Song>) {
        if (!newVal) {
          this.hide()
        }
      }

      showFlag = false

      show() {
        this.showFlag = true

        setTimeout(() => {
          this.refreshScroll()
          this.scrollToCurrent()
        }, 20)
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

      refreshScroll() {
        (this.$refs.shortcutScroll as any).refresh()
      }

      scrollToCurrent() {
        const sequenceIndex = this.sequenceList.findIndex(item => {
          return item.songid === this.currentSong.songid
        });
        (this.$refs.shortcutScroll as any).scrollToElement((this.$refs.list as any)[sequenceIndex], 80)
      }

      showConfirm() {
        (this.$refs.confirm as any).show()
      }

      cancel() {
        (this.$refs.confirm as any).hide()
      }

      confirm() {
        this.clearPlayList();
        (this.$refs.confirm as any).hide()
      }

      toAddSongPage() {
        (this.$refs.addSong as any).show()
      }
    }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'
  @import '~assets/stylus/mixin.styl'

  .playlist-enter-active, .playlist-leave-active
    transition opacity .3s
    .m-play-list
      transition all .3s
  .playlist-enter, .playlist-leave-to
    opacity 0
    .m-play-list
      transform translate3d(0, 100%, 0)
  .filter
    position fixed
    z-index 200
    top 0
    right 0
    bottom 0
    left 0
    background-color $color-background-d

    .m-play-list
      position absolute
      bottom 0
      width 100%
      background-color $color-highlight-background

      .play-list-header
        display flex
        align-items center
        padding 20px 30px 10px 20px

        .play-mode-button
          margin-right 10px
          font-size 30px
          color $color-theme-d

        .play-mode-text
          flex 1
          color $color-text-l
          font-size $font-size-median
          no-wrap()

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
          &.songlist-enter-active, &.songlist-leave-active
            transition all .1s
          &.songlist-enter, &.songlist-leave-to
            height 0
          &.songlist-enter-to, &.songlist-leave
            height 40px
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
            .icon-favorite
              color $color-sub-theme

          .delete-button
            extend-click()
            color $color-theme
            font-size $font-size-small

      .add-song-wrapper
        margin: 20px auto 30px
        width 140px
        .add-song-button
          display flex
          align-items center
          justify-content center
          padding 8px 16px
          border 1px solid $color-text-l
          border-radius 100px
          color $color-text-l
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
