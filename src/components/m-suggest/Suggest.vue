<template>
  <scroll class="m-suggest"
          ref="suggestScroll"
          :data="suggestion"
          :pull-up="true"
          :pull-down="true"
          @scrollToEnd="searchMore">
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
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import {Mutation, Action} from 'vuex-class'
  import * as types from 'src/store/mutation-types'
  import Scroll from 'src/base/m-scroll/Scroll.vue'
  import Loading from 'base/m-loading/Loading.vue'
  import {Singer} from 'src/assets/ts/Singer'
  import Searcher from 'src/assets/ts/Searcher'
  import {Song} from 'src/assets/ts/Song'

  @Component({
    components: {
      Scroll,
      Loading
    }
  })
  export default class extends Vue {
    @Prop({default: ''}) keyword!: string

    @Mutation(types.SET_SINGER) setSinger: any

    @Action('insertSong') insertSong: any

    @Watch('keyword')
    whenKeywordChange(newVal: string) {
      newVal && this.startNewSearch()
    }

    searcher: Searcher = new Searcher()
    loading = false

    get suggestion(): Array<Singer | Song> {
      return Array.prototype.concat(this.searcher.singer, this.searcher.results)
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
    }

    startNewSearch() {
      this.searcher = new Searcher({keyword: this.keyword})
      this.searcher.search();
      (this.$refs.suggestScroll as any).scrollTo(0, 0)
    }

    async searchMore() {
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
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'
  @import '~assets/stylus/mixin.styl'

  .m-suggest
    width 100%
    height 100%

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
