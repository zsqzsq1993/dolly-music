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
                       @remove-one="removeOneSearchHistory"></search-list>
        </div>
      </div>
    </scroll>
    <div class="suggest-wrapper" v-show="query">
      <suggest :keyword="query"
               @select-item="addOneSearchHistory"></suggest>
    </div>
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
  import {Getter} from 'vuex-class'
  import {getHotSearch} from 'src/api/getSearch'
  import SearchBox from 'base/m-search-box/SearchBox.vue'
  import Suggest from 'components/m-suggest/Suggest.vue'
  import SearchList from 'base/m-search-list/SearchList.vue'
  import Confirm from 'base/m-confirm/Confirm.vue'
  import Scroll from 'base/m-scroll/Scroll.vue'
  import {PlayListMixin, SearchMixin} from 'src/assets/ts/mixins'
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

  export default class extends Mixins(SearchMixin, PlayListMixin) {
    @Getter('searchHistory') readonly searchHistory!: Array<string>
    @Getter('playList') readonly playList!: Array<Song>

    hots: Array<HotKey> = []

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

    showConfirm() {
      (this.$refs.confirm as any).show()
    }

    cancel() {
      (this.$refs.confirm as any).hide()
    }

    confirm() {
      this.clearSearchHistory();
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
      .m-search-list
        margin 0 20px 20px
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
    .suggest-wrapper
      position fixed
      top 178px
      right 0
      bottom 0
      left 0
</style>
