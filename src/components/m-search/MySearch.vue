<template>
  <div class="m-search">
    <div class="search-box-wrapper">
      <search-box @query="handleQuery" ref="searchBox"></search-box>
    </div>
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
    <div class="suggest-wrapper" v-show="query">
      <suggest ref="suggest" :keyword="query" @select-item="addOneHistory"></suggest>
    </div>
    <div class="search-list-wrapper">
      <search-list :list="searchHistory"
                   v-show="showSearchHistory"
                   @clear-all="clearHistory"
                   @select-one="fillSearchBox"
                   @remove-one="removeOneHistory"></search-list>
    </div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
  import {Vue, Component} from 'vue-property-decorator'
  import {Action, Getter} from 'vuex-class'
  import {getHotSearch} from 'src/api/getSearch'
  import SearchBox from 'base/m-search-box/SearchBox.vue'
  import Suggest from 'components/m-suggest/Suggest.vue'
  import SearchList from 'src/base/m-search-list/SearchList.vue'

  interface HotKey {
    k: string;
    n: number;
  }

  @Component({
    components: {
      SearchBox,
      Suggest,
      SearchList
    }
  })
  export default class extends Vue {
    @Action('addOneHistory') addOneHistory: any
    @Action('removeOneHistory') removeOneHistory: any
    @Action('clearHistory') clearHistory: any

    @Getter('searchHistory') readonly searchHistory!: Array<string>

    hots: Array<HotKey> = []
    query = ''

    get showSearchHistory() {
      return this.searchHistory.length && !this.query
    }

    created() {
      this.getHots().then((response: Array<HotKey>) => {
        this.hots = response.slice(0, 30)
      })
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
    }

    fillSearchBox(query: string) {
      (this.$refs.searchBox as any).fillContent(query)
    }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .m-search
    .search-box-wrapper
      margin 20px
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
      bottom 0
      width 100%
      overflow hidden
</style>
