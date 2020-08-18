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
                    @query="handleQuery"></search-box>
      </div>
      <div class="suggest-wrapper">
        <suggest v-show="query"
                 :keyword="query"
                 :singerInfo="false"
                 @select-item="selectItem"></suggest>
      </div>
      <div class="switches-wrapper">
        <switches></switches>
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
    import {Component, Mixins} from 'vue-property-decorator'
    import SearchBox from 'base/m-search-box/SearchBox.vue'
    import Suggest from 'components/m-suggest/Suggest.vue'
    import Switches from 'base/m-switches/Switches.vue'
    import TopTip from 'src/base/m-top-tip/TopTip.vue'
    import {SearchMixin} from 'src/assets/ts/mixins'

    @Component({
      components: {
        SearchBox,
        Suggest,
        Switches,
        TopTip
      }
    })
    export default class extends Mixins(SearchMixin) {
      showFlag = false

      show() {
        this.showFlag = true
      }

      hide() {
        this.showFlag = false
      }

      selectItem(keyword: string) {
        this.addOneHistory(keyword);
        (this.$refs.toptip as any).show()
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
      top 160px
      right 0
      bottom 0
      left 0
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
