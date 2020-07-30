<template>
  <div class="m-singer-detail">
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {Getter} from 'vuex-class'
  import {getSingerDetail} from 'src/api/getSingers'
  import {Song, createSong, SongConfig} from 'src/assets/ts/Song'

  @Component
  export default class extends Vue {
    @Getter('singer') singer: any

    songs: Array<Song | undefined> = []

    created() {
      this._getSingerDetail(this.singer.id)
    }

    _getSingerDetail(id: string) {
      if (!id) {
        this.$router.push({path: '/singers'})
        return
      }

      getSingerDetail(id).then(response => {
        this._genSongs(response)
        console.log(this.songs)
      })
    }

    _genSongs(response: any) {
      if (response.code === 0) {
        const dataList: Array<any> = response.data && response.data.list
        dataList.forEach(data => {
          this.songs.push(createSong(data.musicData as SongConfig))
        })
      } else {
        throw Error('can not get singer detail.')
      }
    }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/variable.styl'

  .m-singer-detail
    position fixed
    z-index 100
    top 0
    right 0
    bottom 0
    left 0
    background $color-background
</style>
