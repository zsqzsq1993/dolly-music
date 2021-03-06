<template>
  <transition name="slide">
    <div class="m-add-song" v-show="showFlag">
      <div class="header">
        <div class="title">添加歌曲到列表</div>
        <div class="close-wrapper" @click.stop="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box :placeholder="'搜索歌曲'"
                    @query="handleQuery"
                    ref="searchBox"></search-box>
      </div>
      <div class="suggest-wrapper" v-show="query">
        <suggest :keyword="query"
                 :singerInfo="false"
                 @select-item="selectItem"></suggest>
      </div>
      <div class="switches-wrapper" v-show="!query">
        <switches @select-item="switchComponent"
                  :tablist="tablist"
                  class="switches"></switches>
        <scroll ref="scroll"
                class="scroll-wrapper"
                :data="scrollData">
          <div class="scroll-inner-wrapper">
            <songs-list v-show="!currentIndex"
                        :songs="playHistory"
                        @select="insertInPlayList"></songs-list>
            <search-list v-show="currentIndex"
                         :withTitle="false"
                         :list="searchHistory"
                         @select-one="fillSearchBox"
                         @remove-one="removeOneSearchHistory"></search-list>
          </div>
        </scroll>
      </div>
      <div class="top-tip-wrapper">
        <top-tip ref="toptip">
          <div class="reminder">
            <i class="icon-ok"></i>
            <span class="text-wrapper">
              1首歌曲已被添加到播放列表
            </span>
          </div>
        </top-tip>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
    import {Component, Mixins, Watch} from 'vue-property-decorator'
    import {Action, Getter} from 'vuex-class'
    import SearchBox from 'base/m-search-box/SearchBox.vue'
    import Suggest from 'components/m-suggest/Suggest.vue'
    import Switches from 'base/m-switches/Switches.vue'
    import TopTip from 'src/base/m-top-tip/TopTip.vue'
    import {SearchMixin} from 'src/assets/ts/mixins'
    import SongsList from 'base/m-songs-list/SongsList.vue'
    import SearchList from 'base/m-search-list/SearchList.vue'
    import Scroll from 'base/m-scroll/Scroll.vue'
    import {Song} from 'src/assets/ts/Song'

    @Component({
      components: {
        Scroll,
        SearchBox,
        Suggest,
        Switches,
        TopTip,
        SongsList,
        SearchList
      }
    })
    export default class extends Mixins(SearchMixin) {
      @Getter('searchHistory') readonly searchHistory!: Array<string>
      @Getter('playHistory') readonly playHistory!: Array<Song>

      @Action('insertSong') insertSong: any

      @Watch('query')
      whenQueryChange(val: string) {
        val && this.refreshScroll()
      }

      @Watch('showFlag')
      whenFlagChange(val: string) {
        val && this.refreshScroll()
      }

      @Watch('currentIndex')
      whenIndexChange() {
        this.refreshScroll()
      }

      showFlag = false
      currentIndex = 0
      tablist = ['最近播放', '搜索历史']

      get scrollData() {
        return Array.prototype.concat(this.playHistory, this.searchHistory)
      }

      show() {
        this.showFlag = true
      }

      hide() {
        this.showFlag = false
      }

      selectItem(keyword: string) {
        this.addOneSearchHistory(keyword);
        (this.$refs.toptip as any).show()
      }

      switchComponent(index: number) {
        this.currentIndex = index
      }

      insertInPlayList(song: Song) {
        this.insertSong(song);
        (this.$refs.toptip as any).show()
      }

      refreshScroll() {
        setTimeout(() => {
          (this.$refs.scroll as any).refresh()
        }, 20)
      }
    }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .slide-enter-active, .slide-leave-active
    transition all .3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0 ,0)
  .m-add-song
    position fixed
    z-index 300
    top 0
    right 0
    bottom 0
    left 0
    background-color $color-background
    .header
      position relative
      width 100%
      height 44px
      .title
        width 100%
        line-height 44px
        text-align center
        color $color-text
        font-size $font-size-large
      .close-wrapper
        position absolute
        top 0
        right 8px
        i
          display block
          padding 12px
          color $color-theme
          font-size 20px
    .search-box-wrapper
      margin 20px
    .suggest-wrapper
      position absolute
      z-index 5
      top 165px
      right 0
      bottom 0
      left 0
    .switches-wrapper
      .switches
        width 240px
        margin 0 auto
      .scroll-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        overflow hidden
        .scroll-inner-wrapper
          padding 20px 30px
    .top-tip-wrapper
      position absolute
      z-index 10
      top 0
      left 0
      width 100%
      .reminder
        padding 18px 0
        text-align center
        i
          color $color-theme
          font-size $font-size-median
          margin-right 4px
        span
          color $color-text
          font-size $font-size-median
</style>
