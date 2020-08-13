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
      <loading :show="hasMore && loading"
               :text="''"></loading>
    </ul>
  </scroll>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
  import {Mutation} from 'vuex-class'
  import * as types from 'src/store/mutation-types'
  import {getSearch} from 'src/api/getSearch'
  import {createSong, isValidSong, Song, SongConfig} from 'src/assets/ts/Song'
  import Scroll from 'src/base/m-scroll/Scroll.vue'
  import Loading from 'base/m-loading/Loading.vue'
  import {Singer} from 'src/assets/ts/Singer'

  const PER_PAGE = 20

  @Component({
    components: {
      Scroll,
      Loading
    }
  })
  export default class extends Vue {
    @Prop({default: ''}) keyword!: string

    @Mutation(types.SET_SINGER) setSinger: any

    @Watch('keyword')
    whenKeywordChange() {
      this.startNewSearch()
    }

    suggestion: Array<Singer | Song> = []
    page = 1
    hasMore = true
    loading = false

    selectSuggestion(item: Singer | Song): void {
      if (item instanceof Singer) {
        this.setSinger(item)
        this.$router.push(`/search/${item.id}`)
      } else {
        //
      }
    }

    search(zhida?: boolean, perpage?: number): Promise<Array<Song | Singer>> {
      zhida = (typeof zhida !== 'undefined')
        ? zhida
        : true

      perpage = perpage || PER_PAGE

      return getSearch(this.keyword, this.page, zhida, perpage).then((response: any) => {
        const suggestion: Array<Singer | Song> = []
        if (response.code === 0) {
          response = response.data
          if (response.zhida && response.zhida.singerid && this.page === 1) {
            suggestion.push(new Singer(response.zhida.singermid, response.zhida.singername))
          }

          if (response.song && response.song.list && response.song.list.length) {
            response.song.list.forEach((item: any) => {
              if (isValidSong(item)) {
                suggestion.push(createSong(item as SongConfig))
              }
            })
          }

          this.hasMore = this.checkMore(response.song)

          return this.suggestion = this.page === 1
            ? suggestion
            : this.suggestion.concat(suggestion)
        } else {
          throw new Error(`can not get search results by keyword ${this.keyword}`)
        }
      })
    }

    searchMore() {
      if (this.hasMore) {
        this.loading = true
        this.page++
        this.search().then(() => {
          this.loading = false
        })
      }
    }

    checkMore(config: any) {
      return (config.curpage + 1) * config.curnum < config.totalnum
    }

    startNewSearch() {
      this.page = 1
      this.search().then(() => { console.log(this.suggestion) });
      (this.$refs.suggestScroll as any).scrollTo(0, 0)
    }

    getIconCls(item: Singer | Song) {
      return item instanceof Singer
        ? 'icon-mine'
        : 'icon-music'
    }

    getText(item: Singer | Song) {
      return item instanceof Singer
        ? item.name
        : item.songname + '-' + item.singer
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

</style>
