<template>
  <div class="m-rank" ref="rank">
    <scroll :data="topListGroups"
            class="topList-scroll"
            ref="rankScroll">
      <ul class="topList-groups">
        <li class="topList-wrapper"
            v-for="topList in topListGroups"
            :key="topList.id"
            @click="selectTopList(topList)">
          <div class="topList-avatar">
            <img v-lazy="topList.picUrl">
          </div>
          <ul class="topList-topSongs">
            <li class="topList-song"
                v-for="(song, idx) in topList.songList"
                :key="song.songname">
              <div class="song-text">
                {{idx}}{{song.songname}}-{{song.singername}}
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
  import {Component, Mixins} from 'vue-property-decorator'
  import {Mutation, Getter} from 'vuex-class'
  import {getTopList} from 'src/api/getRank'
  import Scroll from 'base/m-scroll/Scroll.vue'
  import * as types from 'src/store/mutation-types'
  import {playListMixin} from 'src/assets/ts/mixins'

  @Component({
    components: {
      Scroll
    }
  })
  export default class extends Mixins(playListMixin) {
    topListGroups: Array<any> = []

    @Getter('playList') readonly playList!: any

    @Mutation(types.SET_TOP_LIST) setTopList: any

    created() {
      this._getRecommandList()
    }

    selectTopList(topList: any) {
      this.setTopList(topList)
      this.$router.push(`/rank/${topList.id}`)
    }

    handlePlayList() {
      const wrapper = this.$refs.rank as HTMLElement
      const scroll = this.$refs.rankScroll as any
      wrapper.style.bottom = this.playList.length
        ? '60px'
        : '0'
      scroll.refresh()
    }

    _getRecommandList() {
      getTopList().then((response: any) => {
        this._getTopList(response)
      }).catch(e => {
        console.log(e)
      })
    }

    _getTopList(response: any) {
      if (response.code === 0) {
        response = response.data
        this.topListGroups = response.topList
      } else {
        throw new Error('get toplist data errors.')
      }
    }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/mixin.styl'
  @import '~assets/stylus/variable.styl'

  .m-rank
    position fixed
    top 88px
    right 0
    bottom 0
    left 0
    .topList-scroll
      width 100%
      height 100%
      overflow hidden
      .topList-wrapper
        display flex
        margin 0 20px
        padding-top 20px
        height 100px
        &:last-child
          padding-bottom 20px
        .topList-avatar
          flex 0 0 100px
          width 100px
          height 100px
          img
            width 100%
            height 100%
        .topList-topSongs
          flex 1
          display flex
          flex-direction column
          justify-content center
          padding 0 20px
          height 100px
          overflow hidden
          background $color-highlight-background
          color $color-text-d
          font-size $font-size-small
          .song-text
            no-wrap()
            line-height 26px
</style>
