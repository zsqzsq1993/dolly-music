<template>
  <div class="m-search">
    <div class="search-box-wrapper">
      <search-box @query="handleQuery"></search-box>
    </div>
    <div class="hots-wrapper" v-show="!query">
      <h1 class="hots-title">热门搜索</h1>
      <ul class="hots-content">
        <li v-for="hot in hots"
            :key="hot.n"
            v-text="hot.k"
            class="hot-itme"></li>
      </ul>
    </div>
    <div class="suggest-wrapper" v-show="query">
      <suggest></suggest>
    </div>
  </div>
</template>

<script lang="ts">
  import {Vue, Component} from 'vue-property-decorator'
  import {getHotSearch} from 'src/api/getSearch'
  import SearchBox from 'base/m-search-box/SearchBox.vue'
  import Suggest from 'components/m-suggest/Suggest.vue'

  interface HotKey {
    k: string;
    n: number;
  }

  @Component({
    components: {
      SearchBox,
      Suggest
    }
  })
  export default class extends Vue {
    hots: Array<HotKey> = []
    query = ''

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
</style>
