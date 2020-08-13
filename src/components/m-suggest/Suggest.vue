<template>
    <scroll class="m-suggest" :data="queryResults">
      <ul class="suggest-list">
        <li v-for="(item, idx) in queryResults"
            :key="idx"
            class="suggest-item">
          <div class="icon-wrapper">
            <i :class="getIconCls(item)"></i>
          </div>
          <p class="content" v-text="getText(item)"></p>
        </li>
      </ul>
    </scroll>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import {getSearch} from 'src/api/getSearch'
    import {createSong, isValidSong, Song, SongConfig} from 'src/assets/ts/Song'
    import Scroll from 'src/base/m-scroll/Scroll.vue'

    const TYPE_SINGER = 'singer'

    interface Singer {
      type: string;
      singername: string;
    }

    @Component({
      components: {Scroll}
    })
    export default class extends Vue {
      queryResults: Array<any> = []

      query(keyword: string, page: number, zhida: boolean) {
        getSearch(keyword, page, zhida).then((response: any) => {
          console.log(response)
          const suggestion: Array<Singer | Song> = []
          if (response.code === 0) {
            response = response.data
            if (response.zhida && response.zhida.singerid && page === 1) {
              suggestion.push({...response.zhida, ...{type: TYPE_SINGER}} as Singer)
            }

            if (response.song && response.song.list && response.song.list.length) {
              response.song.list.forEach((item: any) => {
                if (isValidSong(item)) {
                  suggestion.push(createSong(item as SongConfig))
                }
              })
            }

            this.queryResults = suggestion
          } else {
            throw new Error(`can not get search results by keyword ${keyword}`)
          }
        })
      }

      getIconCls(item: Singer | Song) {
        return (item as Singer).type === TYPE_SINGER
          ? 'icon-mine'
          : 'icon-music'
      }

      getText(item: Singer | Song) {
        return (item as Singer).type === TYPE_SINGER
          ? (item as Singer).singername
          : (item as Song).songname + '-' + (item as Song).singer
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
