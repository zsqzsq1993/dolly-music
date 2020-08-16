<template>
  <div class="m-search">
    <div class="search-box-wrapper">
      <search-box @query="handleQuery" ref="searchBox"></search-box>
    </div>
    <scroll :data="scrollData" class="search-scroll" ref="scroll">
      <div>
        <div class="hots-wrapper" v-show="!query">
          <h1 class="hots-title">热门搜索</h1>
          <ul class="hots-content">
            <li v-for="hot in hots"
                :key="hot.n"
                v-text="hot.k"
                class="hot-itme"
                @click="fillSearchBox(hot.k)"></li>
          </ul>
        </div>
        <div class="search-list-wrapper">
          <search-list :list="searchHistory"
                       v-show="showSearchHistory"
                       @clear-all="showConfirm"
                       @select-one="fillSearchBox"
                       @remove-one="removeOneHistory"></search-list>
        </div>
      </div>
    </scroll>
    <suggest v-show="query"
             ref="suggest"
             :keyword="query"
             @select-item="addOneHistory"></suggest>
    <div class="confirm-wrapper">
      <confirm @click-left="cancel"
               @click-right="confirm"
               ref="confirm"></confirm>
    </div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
  import {Component, Mixins} from 'vue-property-decorator'
  import {Action, Getter} from 'vuex-class'
  import {getHotSearch} from 'src/api/getSearch'
  import SearchBox from 'base/m-search-box/SearchBox.vue'
  import Suggest from 'components/m-suggest/Suggest.vue'
  import SearchList from 'base/m-search-list/SearchList.vue'
  import Confirm from 'base/m-confirm/Confirm.vue'
  import Scroll from 'base/m-scroll/Scroll.vue'
  import {playListMixin} from 'src/assets/ts/mixins'
  import {Song} from 'src/assets/ts/Song'

  interface HotKey {
    k: string;
    n: number;
  }

  @Component({
    components: {
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll
    }
  })
  export default class extends Mixins(playListMixin) {
    @Action('addOneHistory') addOneHistory: any
    @Action('removeOneHistory') removeOneHistory: any
    @Action('clearHistory') clearHistory: any

    @Getter('searchHistory') readonly searchHistory!: Array<string>
    @Getter('playList') readonly playList!: Array<Song>

    hots: Array<HotKey> = []
    query = ''

    get showSearchHistory() {
      return this.searchHistory.length && !this.query
    }

    get scrollData() {
      return Array.prototype.concat(this.searchHistory, this.hots)
    }

    created() {
      this.getHots().then((response: Array<HotKey>) => {
        this.hots = response.slice(0, 30)
      })
    }

    handlePlayList() {
      const bottom = this.playList.length ? 60 : 0;
     (this.$refs.scroll as any).$el.style.bottom = bottom + 'px';
      (this.$refs.scroll as any).refresh()
    }

    getHots(): Promise<Array<HotKey>> {
      return getHotSearch().then((response: any) => {
        if (response.code === 0) {
          return response.data.hotkey
        } else {
          throw new Error('can not get hot search data.')
        }
      })
    }

    handleQuery(query: string) {
      this.query = query

      if (!query) {
        setTimeout(() => {
          (this.$refs.scroll as any).refresh()
        }, 20)
      }
    }

    fillSearchBox(query: string) {
      (this.$refs.searchBox as any).fillContent(query)
    }

    showConfirm() {
      (this.$refs.confirm as any).show()
    }

    cancel() {
      (this.$refs.confirm as any).hide()
    }

    confirm() {
      this.clearHistory();
      (this.$refs.confirm as any).hide()
    }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .m-search
    .search-box-wrapper
      margin 20px
    .search-scroll
      position fixed
      top 178px
      right 0
      bottom 0
      left 0
      overflow hidden
      .hots-wrapper
        margin 0 20px 20px
        .hots-title
          margin-bottom 20px
          color $color-text-l
          font-size $font-size-median
        .hots-content
          .hot-itme
            display inline-block
            padding 5px 10px
            margin 0 20px 10px 0
            border-radius 6px
            background-color $color-highlight-background
            color $color-text-d
            font-size $font-size-median
</style>
