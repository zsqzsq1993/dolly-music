<template>
  <scroll class="m-suggest"
          ref="suggestScroll"
          :data="suggestion"
          :pull-up="true"
          :pull-down="true"
          @scrollToEnd="searchMore">
    <loading class="first-loading" :show="showFirstLoading"></loading>
    <ul class="suggest-list">
      <li v-for="(item, idx) in suggestion"
          :key="idx"
          class="suggest-item"
          @click="selectSuggestion(item)">
        <div class="icon-wrapper">
          <i :class="getIconCls(item)"></i>
        </div>
        <p class="content" v-text="getText(item)"></p>
      </li>
      <loading :show="showLoading"
               :text="''"></loading>
    </ul>
    <div class="no-results-wrapper" v-show="showNoResult">
      <div class="image-wrapper">
        <img src="./pizza.png" alt="暂未搜索到结果">
      </div>
      <div class="text-wrapper" v-text="'暂未搜索到结果'"></div>
    </div>
  </scroll>
</template>

<script lang="ts">
  import {Component, Prop, Mixins, Watch} from 'vue-property-decorator'
  import {Mutation, Action, Getter} from 'vuex-class'
  import * as types from 'src/store/mutation-types'
  import Scroll from 'src/base/m-scroll/Scroll.vue'
  import Loading from 'base/m-loading/Loading.vue'
  import {Singer} from 'src/assets/ts/Singer'
  import Searcher from 'src/assets/ts/Searcher'
  import {Song} from 'src/assets/ts/Song'
  import {playListMixin} from 'src/assets/ts/mixins'

  @Component({
    components: {
      Scroll,
      Loading
    }
  })
  export default class extends Mixins(playListMixin) {
    @Prop({default: ''}) keyword!: string

    @Mutation(types.SET_SINGER) setSinger: any

    @Action('insertSong') insertSong: any

    @Getter('playList') readonly playList!: Array<Song>

    @Watch('keyword')
    whenKeywordChange(newVal: string) {
      newVal && this.startNewSearch()
    }

    searcher: Searcher = new Searcher()
    loading = false

    get suggestion(): Array<Singer | Song> {
      return Array.prototype.concat(this.searcher.singer, this.searcher.results)
    }

    get showFirstLoading() {
      return this.keyword && this.searcher && !this.searcher.results.length
    }

    get showLoading() {
      return this.keyword && this.loading
    }

    get showNoResult() {
      return this.searcher &&
        !this.searcher.hasMore &&
        !this.searcher.results.length &&
        !this.searcher.singer.length
    }

    selectSuggestion(item: Singer | Song): void {
      if (item instanceof Singer) {
        this.setSinger(item)
        this.$router.push(`/search/${item.id}`)
      } else {
        this.insertSong({newSong: item})
      }
      this.$emit('select-item', this.keyword)
    }

    startNewSearch() {
      this.searcher = new Searcher({keyword: this.keyword})
      this.searcher.search();
      (this.$refs.suggestScroll as any).scrollTo(0, 0)
    }

    searchMore() {
      this.loading = true
      this.searcher && this.searcher.searchMore().then(() => {
        this.loading = false
      })
    }

    getIconCls(item: Singer | Song) {
      if (item) {
        return item instanceof Singer
          ? 'icon-mine'
          : 'icon-music'
      }
    }

    getText(item: Singer | Song) {
      if (item) {
        return item instanceof Singer
          ? item.name
          : item.songname + '-' + item.singer
      }
    }

    handlePlayList() {
      const bottom = this.playList.length ? 60 : 0;
      (this.$refs.suggestScroll as any).$el.style.bottom = bottom + 'px';
      (this.$refs.suggestScroll as any).refresh()
    }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'
  @import '~assets/stylus/mixin.styl'

  .m-suggest
    position fixed
    top 178px
    bottom 0
    width 100%
    overflow hidden

    .first-loading
      position absolute
      top 50%
      left 50%
      transform translate3d(-50%, -50%, 0)

    .suggest-list
      padding 0 30px
      position relative

      .suggest-item
        display flex
        padding-bottom 20px

        .icon-wrapper
          flex 0 0 30px
          width 30px

          [class^="icon-"]
            font-size 14px
            color $color-text-d

        .content
          flex 1
          font-size $font-size-median
          color $color-text-d
          no-wrap()

    .no-results-wrapper
      display flex
      flex-direction column
      justify-content center
      align-items center
      width 100%
      height 100%
      .image-wrapper
        img
          width 86px
          height 90px
      .text-wrapper
        font-size: $font-size-medium
        color: $color-text-d

</style>
