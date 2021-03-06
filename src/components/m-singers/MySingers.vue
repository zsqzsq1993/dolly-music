<template>
  <div class="m-singers" ref="singers">
    <list-view :data="singers" @select="selectSinger" ref="singerScroll"></list-view>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
  import {getSingerList} from 'src/api/getSingers'
  import {Component, Mixins} from 'vue-property-decorator'
  import {Singer} from 'src/assets/ts/Singer'
  import ListView from 'base/m-list-view/ListView.vue'
  import {Mutation, Getter} from 'vuex-class'
  import * as types from 'src/store/mutation-types'
  import {PlayListMixin} from 'src/assets/ts/mixins'
  import {Song} from 'src/assets/ts/Song'

  const HOT_LEN = 10
  const HOT_NAME = '热门'

  interface Item {
    Fsinger_name: string;
    Fsinger_mid: string;
    Findex: string;
  }

  @Component({
    components: {
      ListView
    }
  })
  export default class extends Mixins(PlayListMixin) {
    singers: any[] = []

    @Mutation(types.SET_SINGER) setSinger: any

    @Getter('playList') readonly playList!: Array<Song>

    created() {
      getSingerList().then(response => {
        return this._genMap(response)
      }).then(map => {
        return this._genList(map)
      }).then((list: any) => {
        this.singers = list
      }).catch(e => {
        console.log(e)
      })
    }

    handlePlayList() {
      const bottom = this.playList.length ? 60 : 0
      const wrapper = this.$refs.singers as HTMLElement
      const scroll = (this.$refs.singerScroll as any).$children[0]
      wrapper.style.bottom = bottom + 'px'
      scroll.refresh()
    }

    selectSinger(singer: Singer) {
      this.setSinger(singer)
      this.$router.push({
        path: `/singers/${singer.id}`
      })
    }

    _genMap(response: any): any[] {
      if (response.code === 0) {
        const list = response.data && response.data.list
        const map = Object.create(null)
        map.hot = {
          title: HOT_NAME,
          items: []
        }
        list.forEach((item: any, idx: number) => {
          if (idx < HOT_LEN) {
            map.hot.items.push(
              new Singer(item.Fsinger_mid, item.Fsinger_name)
            )
          }

          if (!map[item.Findex]) {
            map[item.Findex] = {
              title: item.Findex,
              items: []
            }
          }

          map[item.Findex].items.push(
            new Singer(item.Fsinger_mid, item.Fsinger_name)
          )
        })
        return map
      } else {
        throw Error('Can not get singer list from server.')
      }
    }

    _genList(map: any) {
      const hot = []
      const ret = []

      for (const key in map) {
        const val = map[key]
        if (/[a-zA-Z]/.test(val.title)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }

      ret.sort((a, b) => {
        return (a.title.charCodeAt(0) - b.title.charCodeAt(0))
      })

      return hot.concat(ret)
    }
  }
</script>

<style lang="stylus">
  .m-singers
    position fixed
    top 88px
    bottom 0
    width 100%
</style>
